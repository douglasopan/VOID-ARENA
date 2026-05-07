import {
  BUTTON_CLICK_SFX_ASSET,
  BUTTON_HOVER_SFX_ASSET,
  HOLE_SWALLOW_SFX_ASSET,
  MAP_MUSIC_ASSETS,
  MENU_MUSIC_ASSETS,
  OBJECT_SWALLOW_SFX_ASSETS,
  PLAYER_DIE_SFX_ASSET,
  POWERUP_SFX_ASSETS
} from './AudioAssets';
import type { CityObjectCategory, MapSize, PowerUpType, WorldObjectKind } from '../shared/types';

export class AudioManager {
  private context: AudioContext | null = null;
  private sfxVolume = 0.55;
  private musicVolume = 0.22;
  private muted = false;
  private musicOscillator: OscillatorNode | null = null;
  private musicGain: GainNode | null = null;
  private musicElement: HTMLAudioElement | null = null;
  private activeMusicKey: string | null = null;
  private activeMusicAssets: string[] = [];
  private activeMusicIndex = 0;
  private pendingMusicRequest: {
    key: string;
    assets: string[];
    index: number;
    forceOriginalAsset: boolean;
  } | null = null;
  private supportsOggOpus: boolean | null = null;
  private readonly activeSfx = new Set<HTMLAudioElement>();
  private readonly sfxBuffers = new Map<string, AudioBuffer | null>();
  private readonly sfxBufferLoads = new Map<string, Promise<AudioBuffer | null>>();
  private lastHoverSfxAt = 0;

  setSfxVolume(value: number): void {
    this.sfxVolume = this.clamp01(value);
  }

  setMusicVolume(value: number): void {
    this.musicVolume = this.clamp01(value);
    if (this.musicGain) {
      this.musicGain.gain.value = this.muted ? 0 : this.musicVolume * 0.045;
    }
    if (this.musicElement) {
      this.musicElement.volume = this.muted ? 0 : this.musicVolume;
    }
  }

  setMuted(muted: boolean): void {
    this.muted = muted;
    if (this.musicGain) {
      this.musicGain.gain.value = muted ? 0 : this.musicVolume * 0.045;
    }
    if (this.musicElement) {
      this.musicElement.muted = muted;
      this.musicElement.volume = muted ? 0 : this.musicVolume;
    }
  }

  getSfxVolume(): number {
    return this.sfxVolume;
  }

  getMusicVolume(): number {
    return this.musicVolume;
  }

  isMuted(): boolean {
    return this.muted;
  }

  playSwallow(): void {
    return;
  }

  playObjectSwallow(kind: WorldObjectKind, category: CityObjectCategory, mass: number): void {
    const asset = this.pickAsset(OBJECT_SWALLOW_SFX_ASSETS[kind]);
    if (asset) {
      const fallMix = this.getDistantFallMix(kind, category);
      this.playSfxAsset(
        asset,
        fallMix.gain,
        this.randomRate(fallMix.rateMin, fallMix.rateMax),
        () => undefined,
        {
          fadeInSeconds: fallMix.fadeInSeconds,
          fadeOutSeconds: fallMix.fadeOutSeconds,
          fadeAway: true,
          lowPassFrequency: fallMix.lowPassFrequency
        }
      );
      return;
    }

    void category;
    void mass;
  }

  playPowerUp(type: PowerUpType): void {
    const asset = POWERUP_SFX_ASSETS[type];
    if (asset) {
      this.playSfxAsset(asset, 0.82, this.randomRate(0.98, 1.08), () => this.playGeneratedPowerUp(type));
      return;
    }

    this.playGeneratedPowerUp(type);
  }

  playHoleSwallow(): void {
    if (HOLE_SWALLOW_SFX_ASSET) {
      this.playSfxAsset(HOLE_SWALLOW_SFX_ASSET, 1, this.randomRate(0.94, 1.03), () => undefined);
    }
  }

  playDeath(): void {
    this.playSfxAsset(PLAYER_DIE_SFX_ASSET, 0.36, this.randomRate(0.98, 1.02), () => undefined, { fadeInSeconds: 0.08, fadeOutSeconds: 0.42 });
  }

  playUiClick(): void {
    this.playButtonClick();
  }

  playButtonHover(): void {
    const now = performance.now();
    if (now - this.lastHoverSfxAt < 55) {
      return;
    }
    this.lastHoverSfxAt = now;
    this.playSfxAsset(BUTTON_HOVER_SFX_ASSET, 0.42, this.randomRate(0.98, 1.03), () => {
      this.playTone(460, 620, 0.045, 'triangle', 0.08);
    });
  }

  playButtonClick(): void {
    this.playSfxAsset(BUTTON_CLICK_SFX_ASSET, 0.64, this.randomRate(0.98, 1.02), () => {
      this.playTone(520, 780, 0.055, 'triangle', 0.16);
    });
  }

  playMatchStart(): void {
    return;
  }

  playMatchEnd(): void {
    return;
  }

  unlock(): void {
    const context = this.getContext();
    if (context?.state === 'suspended') {
      void context.resume();
    }

    if (this.musicElement?.paused && this.activeMusicKey) {
      void this.musicElement.play().catch(() => undefined);
    }

    const pending = this.pendingMusicRequest;
    if (pending) {
      this.pendingMusicRequest = null;
      this.playMusicAsset(pending.key, pending.assets, pending.index, pending.forceOriginalAsset);
    }

    this.preloadSfxAssets();
  }

  startMenuMusic(): void {
    this.startTrackGroup('menu', MENU_MUSIC_ASSETS);
  }

  startMusic(mapSize?: MapSize): void {
    const assets = mapSize ? MAP_MUSIC_ASSETS[mapSize] : undefined;
    if (assets?.length) {
      this.startTrackGroup(`map:${mapSize}`, assets);
      return;
    }

    this.startGeneratedMusic();
  }

  nextMusicTrack(): void {
    if (this.activeMusicAssets.length <= 1 || !this.activeMusicKey) {
      return;
    }

    const nextIndex = (this.activeMusicIndex + 1) % this.activeMusicAssets.length;
    this.playMusicAsset(this.activeMusicKey, this.activeMusicAssets, nextIndex);
  }

  private startTrackGroup(key: string, assets: string[]): void {
    if (this.musicElement && this.activeMusicKey === key && !this.musicElement.paused) {
      return;
    }
    if (this.pendingMusicRequest?.key === key) {
      return;
    }

    if (assets.length === 0) {
      this.startGeneratedMusic();
      return;
    }

    this.playMusicAsset(key, assets, Math.floor(Math.random() * assets.length));
  }

  private playMusicAsset(key: string, assets: string[], index: number, forceOriginalAsset = false): void {
    this.stopMusic();
    this.activeMusicAssets = [...assets];
    this.activeMusicIndex = Math.max(0, Math.min(assets.length - 1, index));
    const requestedAsset = assets[this.activeMusicIndex];
    const sourceAsset = forceOriginalAsset ? requestedAsset : this.getPreferredAudioPath(requestedAsset);
    const audio = new Audio(sourceAsset);
    audio.loop = true;
    audio.preload = 'auto';
    audio.volume = this.muted ? 0 : this.musicVolume;
    audio.muted = this.muted;
    this.musicElement = audio;
    this.activeMusicKey = key;
    void audio.play().catch(() => {
      if (!forceOriginalAsset && sourceAsset !== requestedAsset) {
        this.playMusicAsset(key, assets, index, true);
        return;
      }
      if (this.musicElement === audio) {
        this.pendingMusicRequest = { key, assets: [...assets], index, forceOriginalAsset };
      }
    });
  }

  private startGeneratedMusic(): void {
    const context = this.getContext();
    if (!context || this.musicOscillator) {
      return;
    }

    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.value = 62;
    gain.gain.value = this.muted ? 0 : this.musicVolume * 0.045;
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start();
    this.musicOscillator = oscillator;
    this.musicGain = gain;
  }

  stopMusic(): void {
    this.musicOscillator?.stop();
    this.musicOscillator = null;
    this.musicGain = null;
    this.musicElement?.pause();
    this.musicElement = null;
    this.activeMusicKey = null;
    this.activeMusicAssets = [];
    this.activeMusicIndex = 0;
    this.pendingMusicRequest = null;
  }

  private playGeneratedSwallow(category: CityObjectCategory, mass: number): void {
    const heavy = mass >= 24;
    switch (category) {
      case 'traffic':
        this.playTone(92, 32, heavy ? 0.24 : 0.18, 'sawtooth', heavy ? 0.16 : 0.12);
        this.playTone(220, 74, 0.08, 'square', 0.045);
        break;
      case 'building':
      case 'ad':
        this.playTone(74, 28, 0.32, 'sawtooth', 0.17);
        this.playTone(138, 48, 0.16, 'triangle', 0.075);
        break;
      case 'nature':
        this.playTone(160, 62, 0.18, 'triangle', 0.08);
        break;
      case 'utility':
      case 'sidewalk':
        this.playTone(210, 58, 0.14, 'square', 0.075);
        break;
      case 'pedestrian':
        this.playTone(260, 110, 0.12, 'triangle', 0.04);
        break;
      default:
        this.playTone(120, 54, 0.16, 'sawtooth', 0.11);
        break;
    }
  }

  private playGeneratedPowerUp(type: PowerUpType): void {
    switch (type) {
      case 'haste':
        this.playTone(420, 820, 0.11, 'triangle', 0.18);
        break;
      case 'shield':
        this.playTone(240, 420, 0.18, 'sine', 0.2);
        break;
      case 'magnet':
        this.playTone(170, 520, 0.2, 'sawtooth', 0.16);
        break;
      case 'mass':
        this.playTone(150, 74, 0.22, 'triangle', 0.24);
        break;
      case 'shrink':
        this.playTone(520, 180, 0.15, 'square', 0.14);
        break;
      case 'stamina':
      default:
        this.playTone(520, 780, 0.055, 'triangle', 0.16);
        break;
    }
  }

  private playSfxAsset(
    path: string,
    gain: number,
    playbackRate: number,
    onError: () => void,
    fade?: {
      fadeInSeconds?: number;
      fadeOutSeconds?: number;
      fadeAway?: boolean;
      lowPassFrequency?: number;
    },
    forceOriginalAsset = false
  ): void {
    if (this.muted) {
      return;
    }

    const sourcePath = path;
    const context = this.getContext();
    if (!context) {
      this.playHtmlSfx(sourcePath, path, gain, playbackRate, onError, fade, forceOriginalAsset);
      return;
    }

    void this.loadSfxBuffer(sourcePath).then((buffer) => {
      if (!buffer && !forceOriginalAsset && sourcePath !== path) {
        this.playSfxAsset(path, gain, playbackRate, onError, fade, true);
        return;
      }
      if (!buffer) {
        onError();
        return;
      }
      this.playSfxBuffer(context, buffer, gain, playbackRate, fade);
    });
  }

  private playSfxBuffer(
    context: AudioContext,
    buffer: AudioBuffer,
    gain: number,
    playbackRate: number,
    fade?: {
      fadeInSeconds?: number;
      fadeOutSeconds?: number;
      fadeAway?: boolean;
      lowPassFrequency?: number;
    }
  ): void {
    if (context.state === 'suspended') {
      void context.resume();
    }

    const source = context.createBufferSource();
    const gainNode = context.createGain();
    const filter = fade?.lowPassFrequency ? context.createBiquadFilter() : null;
    const targetVolume = this.clamp01(this.sfxVolume * gain);
    const now = context.currentTime;
    const duration = Math.max(0.05, buffer.duration / Math.max(0.01, playbackRate));
    const fadeIn = Math.min(fade?.fadeInSeconds ?? 0, duration * 0.45);
    const fadeOut = Math.min(fade?.fadeOutSeconds ?? 0, duration * 0.85);
    const fadeTarget = fade?.fadeAway ? targetVolume * 0.05 : targetVolume;
    const releaseStart = Math.max(fadeIn, duration - fadeOut);

    source.buffer = buffer;
    source.playbackRate.value = playbackRate;
    gainNode.gain.setValueAtTime(fadeIn > 0 ? 0.0001 : targetVolume, now);
    if (fadeIn > 0) {
      gainNode.gain.linearRampToValueAtTime(targetVolume, now + fadeIn);
    }
    if (fade?.fadeAway || fadeOut > 0) {
      gainNode.gain.setValueAtTime(targetVolume, now + releaseStart);
      gainNode.gain.linearRampToValueAtTime(Math.max(0.0001, fadeTarget), now + duration);
    }

    if (filter) {
      filter.type = 'lowpass';
      filter.frequency.value = fade?.lowPassFrequency ?? 1600;
      filter.Q.value = 0.45;
      source.connect(filter);
      filter.connect(gainNode);
    } else {
      source.connect(gainNode);
    }
    gainNode.connect(context.destination);
    source.onended = (): void => {
      source.disconnect();
      filter?.disconnect();
      gainNode.disconnect();
    };
    source.start(now);
    source.stop(now + duration + 0.02);
  }

  private playHtmlSfx(
    sourcePath: string,
    originalPath: string,
    gain: number,
    playbackRate: number,
    onError: () => void,
    fade: {
      fadeInSeconds?: number;
      fadeOutSeconds?: number;
      fadeAway?: boolean;
      lowPassFrequency?: number;
    } | undefined,
    forceOriginalAsset: boolean
  ): void {
    const audio = new Audio(sourcePath);
    audio.volume = this.clamp01(this.sfxVolume * gain);
    audio.playbackRate = playbackRate;
    const release = (): void => {
      audio.removeEventListener('ended', release);
      audio.removeEventListener('error', release);
      this.activeSfx.delete(audio);
    };
    audio.addEventListener('ended', release);
    audio.addEventListener('error', release);
    this.activeSfx.add(audio);
    void audio.play().catch(() => {
      release();
      if (!forceOriginalAsset && sourcePath !== originalPath) {
        this.playSfxAsset(originalPath, gain, playbackRate, onError, fade, true);
        return;
      }
      onError();
    });
  }

  private loadSfxBuffer(path: string): Promise<AudioBuffer | null> {
    const cached = this.sfxBuffers.get(path);
    if (cached) {
      return Promise.resolve(cached);
    }
    if (this.sfxBuffers.has(path)) {
      return Promise.resolve(null);
    }

    const existingLoad = this.sfxBufferLoads.get(path);
    if (existingLoad) {
      return existingLoad;
    }

    const load = fetch(path)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load audio ${path}`);
        }
        return response.arrayBuffer();
      })
      .then((data) => this.getContext()?.decodeAudioData(data) ?? null)
      .then((buffer) => {
        this.sfxBuffers.set(path, buffer);
        this.sfxBufferLoads.delete(path);
        return buffer;
      })
      .catch(() => {
        this.sfxBuffers.set(path, null);
        this.sfxBufferLoads.delete(path);
        return null;
      });
    this.sfxBufferLoads.set(path, load);
    return load;
  }

  private preloadSfxAssets(): void {
    const assets = new Set<string>();
    assets.add(BUTTON_HOVER_SFX_ASSET);
    assets.add(BUTTON_CLICK_SFX_ASSET);
    assets.add(PLAYER_DIE_SFX_ASSET);
    for (const asset of Object.values(OBJECT_SWALLOW_SFX_ASSETS)) {
      if (Array.isArray(asset)) {
        asset.forEach((item) => assets.add(item));
      } else if (asset) {
        assets.add(asset);
      }
    }
    for (const asset of Object.values(POWERUP_SFX_ASSETS)) {
      if (asset) {
        assets.add(asset);
      }
    }
    if (HOLE_SWALLOW_SFX_ASSET) {
      assets.add(HOLE_SWALLOW_SFX_ASSET);
    }
    assets.forEach((asset) => {
      void this.loadSfxBuffer(asset);
    });
  }

  private createAssetAudioGraph(
    audio: HTMLAudioElement,
    lowPassFrequency?: number
  ): { source: MediaElementAudioSourceNode; filter: BiquadFilterNode } | null {
    if (!lowPassFrequency) {
      return null;
    }

    const context = this.getContext();
    if (!context) {
      return null;
    }

    try {
      const source = context.createMediaElementSource(audio);
      const filter = context.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = lowPassFrequency;
      filter.Q.value = 0.45;
      source.connect(filter);
      filter.connect(context.destination);
      return { source, filter };
    } catch {
      return null;
    }
  }

  private playTone(
    startFrequency: number,
    endFrequency: number,
    duration: number,
    type: OscillatorType,
    gainAmount: number
  ): void {
    if (this.muted) {
      return;
    }

    const context = this.getContext();
    if (!context) {
      return;
    }

    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(startFrequency, context.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(Math.max(1, endFrequency), context.currentTime + duration);
    gain.gain.setValueAtTime(this.sfxVolume * gainAmount, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + duration);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + duration);
  }

  private getContext(): AudioContext | null {
    if (this.context) {
      if (this.context.state === 'suspended') {
        void this.context.resume();
      }
      return this.context;
    }

    const AudioContextConstructor = window.AudioContext ?? window.webkitAudioContext;
    if (!AudioContextConstructor) {
      return null;
    }

    this.context = new AudioContextConstructor();
    if (this.context.state === 'suspended') {
      void this.context.resume();
    }
    return this.context;
  }

  private randomRate(min: number, max: number): number {
    return min + Math.random() * (max - min);
  }

  private getPreferredAudioPath(path: string): string {
    if (!path.toLowerCase().endsWith('.mp3') || !this.canPlayOggOpus()) {
      return path;
    }

    return `${path.slice(0, -4)}.ogg`;
  }

  private canPlayOggOpus(): boolean {
    if (this.supportsOggOpus !== null) {
      return this.supportsOggOpus;
    }

    const audio = document.createElement('audio');
    const support = audio.canPlayType('audio/ogg; codecs="opus"');
    this.supportsOggOpus = support === 'probably' || support === 'maybe';
    return this.supportsOggOpus;
  }

  private pickRandom<T>(items: T[]): T {
    return items[Math.floor(Math.random() * items.length)];
  }

  private pickAsset(asset: string | string[] | undefined): string | undefined {
    if (Array.isArray(asset)) {
      return asset.length ? this.pickRandom(asset) : undefined;
    }

    return asset;
  }

  private getDistantFallMix(
    kind: WorldObjectKind,
    category: CityObjectCategory
  ): {
    gain: number;
    rateMin: number;
    rateMax: number;
    fadeInSeconds: number;
    fadeOutSeconds: number;
    lowPassFrequency: number;
  } {
    if (kind === 'pedestrian' || category === 'pedestrian') {
      return {
        gain: 0.052,
        rateMin: 0.9,
        rateMax: 1.02,
        fadeInSeconds: 0.06,
        fadeOutSeconds: 3.6,
        lowPassFrequency: 980
      };
    }

    if (kind === 'car' || kind === 'truck' || category === 'traffic') {
      return {
        gain: 0.22,
        rateMin: 0.9,
        rateMax: 1.02,
        fadeInSeconds: 0.045,
        fadeOutSeconds: 2.75,
        lowPassFrequency: 1450
      };
    }

    if (kind === 'tree' || kind === 'planter' || category === 'nature') {
      return {
        gain: 0.18,
        rateMin: 0.9,
        rateMax: 1.02,
        fadeInSeconds: 0.045,
        fadeOutSeconds: 2.55,
        lowPassFrequency: 1250
      };
    }

    return {
      gain: 0.17,
      rateMin: 0.9,
      rateMax: 1.02,
      fadeInSeconds: 0.045,
      fadeOutSeconds: 2.35,
      lowPassFrequency: 1300
    };
  }

  private clamp01(value: number): number {
    return Math.max(0, Math.min(1, value));
  }
}

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}
