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
import { getEngineConfig, normalizeOggAudioPath } from '../admin/EngineConfig';
import type { CityObjectCategory, MapSize, PowerUpType, WorldObjectKind } from '../shared/types';

interface MusicFadeState {
  startedAt: number;
  durationSeconds: number;
  fromLevel: number;
  toLevel: number;
  stopAtEnd: boolean;
}

export class AudioManager {
  private context: AudioContext | null = null;
  private sfxVolume = 0.55;
  private musicVolume = 0.3;
  private muted = false;
  private unlocked = false;
  private musicOscillator: OscillatorNode | null = null;
  private musicGain: GainNode | null = null;
  private musicElement: HTMLAudioElement | null = null;
  private readonly musicElements = new Set<HTMLAudioElement>();
  private readonly musicLevels = new Map<HTMLAudioElement, number>();
  private readonly musicFades = new Map<HTMLAudioElement, MusicFadeState>();
  private musicTickId = 0;
  private musicAutoAdvanceAudio: HTMLAudioElement | null = null;
  private readonly musicCrossfadeSeconds = 5.5;
  private readonly musicManualFadeSeconds = 3.25;
  private activeMusicKey: string | null = null;
  private activeMusicAssets: string[] = [];
  private activeMusicIndex = 0;
  private pendingMusicRequest: {
    key: string;
    assets: string[];
    index: number;
    forceOriginalAsset: boolean;
    fadeSeconds: number;
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
    for (const audio of this.musicElements) {
      this.applyMusicElementVolume(audio);
    }
  }

  setMuted(muted: boolean): void {
    this.muted = muted;
    if (this.musicGain) {
      this.musicGain.gain.value = muted ? 0 : this.musicVolume * 0.045;
    }
    for (const audio of this.musicElements) {
      audio.muted = muted;
      this.applyMusicElementVolume(audio);
    }
  }

  getSfxVolume(): number {
    return this.sfxVolume;
  }

  getMusicVolume(): number {
    return this.musicVolume;
  }

  getCurrentMusicLabel(): string {
    const asset = this.activeMusicAssets[this.activeMusicIndex];
    if (!asset) {
      return this.musicOscillator ? 'Generated tone' : 'No music';
    }

    return this.formatMusicAssetLabel(asset);
  }

  isMuted(): boolean {
    return this.muted;
  }

  playSwallow(): void {
    return;
  }

  playObjectSwallow(kind: WorldObjectKind, category: CityObjectCategory, mass: number): void {
    const configuredAssets = getEngineConfig().audio.objectSfx[kind];
    const asset = this.pickAsset(configuredAssets?.length ? configuredAssets : OBJECT_SWALLOW_SFX_ASSETS[kind]);
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
    this.playSfxAsset(getEngineConfig().audio.playerDie || PLAYER_DIE_SFX_ASSET, 0.36, this.randomRate(0.98, 1.02), () => undefined, { fadeInSeconds: 0.08, fadeOutSeconds: 0.42 });
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
    this.playSfxAsset(getEngineConfig().audio.uiHover || BUTTON_HOVER_SFX_ASSET, 0.42, this.randomRate(0.98, 1.03), () => {
      this.playTone(460, 620, 0.045, 'triangle', 0.08);
    });
  }

  playButtonClick(): void {
    this.playSfxAsset(getEngineConfig().audio.uiClick || BUTTON_CLICK_SFX_ASSET, 0.64, this.randomRate(0.98, 1.02), () => {
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
    this.unlocked = true;
    const context = this.getContext();
    const resume = context?.state === 'suspended'
      ? context.resume().catch(() => undefined)
      : Promise.resolve();
    this.primeContext(context);

    for (const audio of this.musicElements) {
      if (audio.paused) {
        void audio.play().catch(() => undefined);
      }
    }

    const pending = this.pendingMusicRequest;
    if (pending) {
      this.pendingMusicRequest = null;
      this.playMusicAsset(pending.key, pending.assets, pending.index, pending.forceOriginalAsset, pending.fadeSeconds);
    }

    void resume.then(() => {
      this.primeContext(context);
      this.preloadSfxAssets();
    });
  }

  startMenuMusic(): void {
    const assets = getEngineConfig().audio.menuMusic;
    this.startTrackGroup('menu', assets.length ? assets : MENU_MUSIC_ASSETS);
  }

  startMusic(mapSize?: MapSize): void {
    const configuredAssets = getEngineConfig().audio.mapMusic;
    const assets = configuredAssets.length ? configuredAssets : mapSize ? MAP_MUSIC_ASSETS[mapSize] : undefined;
    if (assets?.length) {
      this.startTrackGroup(`map:${mapSize}`, assets);
      return;
    }

    this.startGeneratedMusic();
  }

  nextMusicTrack(): void {
    this.refreshActiveMusicAssetsFromConfig();
    if (this.activeMusicAssets.length <= 1 || !this.activeMusicKey) {
      return;
    }

    const nextIndex = (this.activeMusicIndex + 1) % this.activeMusicAssets.length;
    this.playMusicAsset(this.activeMusicKey, this.activeMusicAssets, nextIndex, false, this.musicManualFadeSeconds);
  }

  private startTrackGroup(key: string, assets: string[]): void {
    const playlist = this.dedupeMusicAssets(assets);
    if (playlist.length === 0) {
      this.startGeneratedMusic();
      return;
    }

    const sameActiveGroup = this.musicElement && this.activeMusicKey === key && !this.musicElement.paused;
    if (sameActiveGroup && this.sameMusicAssets(this.activeMusicAssets, playlist)) {
      return;
    }

    if (sameActiveGroup) {
      const currentAsset = this.activeMusicAssets[this.activeMusicIndex];
      const retainedIndex = playlist.indexOf(currentAsset);
      this.activeMusicAssets = [...playlist];
      if (retainedIndex >= 0) {
        this.activeMusicIndex = retainedIndex;
        return;
      }
      this.playMusicAsset(key, playlist, Math.floor(Math.random() * playlist.length), false, this.musicManualFadeSeconds);
      return;
    }

    if (this.pendingMusicRequest?.key === key) {
      if (this.sameMusicAssets(this.pendingMusicRequest.assets, playlist)) {
        return;
      }
      this.pendingMusicRequest = {
        ...this.pendingMusicRequest,
        assets: [...playlist],
        index: Math.min(this.pendingMusicRequest.index, playlist.length - 1)
      };
      return;
    }

    this.playMusicAsset(key, playlist, Math.floor(Math.random() * playlist.length));
  }

  private playMusicAsset(
    key: string,
    assets: string[],
    index: number,
    forceOriginalAsset = false,
    fadeSeconds = this.musicCrossfadeSeconds
  ): void {
    this.activeMusicAssets = [...assets];
    this.activeMusicIndex = Math.max(0, Math.min(assets.length - 1, index));
    const requestedAsset = assets[this.activeMusicIndex];
    const sourceAsset = forceOriginalAsset ? requestedAsset : this.getPreferredAudioPath(requestedAsset);
    const audio = new Audio(sourceAsset);
    const previousElements = [...this.musicElements];
    let failed = false;
    const handleFailure = (): void => {
      if (failed) {
        return;
      }
      failed = true;
      audio.onerror = null;
      this.releaseMusicElement(audio);
      this.pendingMusicRequest = { key, assets: [...assets], index, forceOriginalAsset, fadeSeconds };
    };
    audio.loop = false;
    audio.preload = 'auto';
    audio.volume = 0;
    audio.muted = this.muted;
    audio.onended = () => this.handleMusicEnded(audio);
    audio.onerror = () => handleFailure();

    this.musicElements.add(audio);
    this.musicLevels.set(audio, 0);
    this.stopGeneratedMusic();

    const playPromise = audio.play();
    void playPromise
      .then(() => {
        if (failed) {
          return;
        }
        this.musicElement = audio;
        this.activeMusicKey = key;
        this.musicAutoAdvanceAudio = null;
        this.fadeMusicElement(audio, 1, previousElements.length ? fadeSeconds : Math.min(1.6, fadeSeconds));
        for (const previous of previousElements) {
          this.fadeMusicElement(previous, 0, fadeSeconds, true);
        }
        this.scheduleMusicTick();
      })
      .catch(() => {
        if (!this.unlocked) {
          this.pendingMusicRequest = { key, assets: [...assets], index, forceOriginalAsset, fadeSeconds };
          this.releaseMusicElement(audio);
          return;
        }
        handleFailure();
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
    this.stopGeneratedMusic();
    for (const audio of [...this.musicElements]) {
      this.fadeMusicElement(audio, 0, 1.8, true);
    }
    this.activeMusicKey = null;
    this.activeMusicAssets = [];
    this.activeMusicIndex = 0;
    this.pendingMusicRequest = null;
  }

  private stopGeneratedMusic(): void {
    if (this.musicOscillator) {
      try {
        this.musicOscillator.stop();
      } catch {
        // The oscillator can already be stopped if the browser closed the graph.
      }
      this.musicOscillator.disconnect();
      this.musicOscillator = null;
    }

    if (this.musicGain) {
      this.musicGain.disconnect();
      this.musicGain = null;
    }
  }

  private handleMusicEnded(audio: HTMLAudioElement): void {
    const wasCurrentTrack = this.musicElement === audio;
    const key = this.activeMusicKey;
    this.refreshActiveMusicAssetsFromConfig();
    const assets = [...this.activeMusicAssets];
    const nextIndex = assets.length > 1 ? (this.activeMusicIndex + 1) % assets.length : this.activeMusicIndex;

    this.releaseMusicElement(audio);

    if (!wasCurrentTrack || !key || assets.length === 0) {
      return;
    }

    this.playMusicAsset(key, assets, nextIndex, false, 1.2);
  }

  private applyMusicElementVolume(audio: HTMLAudioElement): void {
    const level = this.musicLevels.get(audio) ?? 1;
    audio.muted = this.muted;
    audio.volume = this.muted ? 0 : this.clamp01(this.musicVolume * level);
  }

  private setMusicElementLevel(audio: HTMLAudioElement, level: number): void {
    this.musicLevels.set(audio, this.clamp01(level));
    this.applyMusicElementVolume(audio);
  }

  private fadeMusicElement(
    audio: HTMLAudioElement,
    toLevel: number,
    durationSeconds: number,
    stopAtEnd = false
  ): void {
    if (!this.musicElements.has(audio)) {
      return;
    }

    const duration = Math.max(0.05, durationSeconds);
    const fromLevel = this.musicLevels.get(audio) ?? 1;
    this.musicFades.set(audio, {
      startedAt: performance.now() / 1000,
      durationSeconds: duration,
      fromLevel,
      toLevel: this.clamp01(toLevel),
      stopAtEnd
    });
    this.scheduleMusicTick();
  }

  private releaseMusicElement(audio: HTMLAudioElement): void {
    this.musicFades.delete(audio);
    this.musicLevels.delete(audio);
    this.musicElements.delete(audio);
    audio.onended = null;
    audio.onerror = null;
    try {
      audio.pause();
      audio.removeAttribute('src');
      audio.load();
    } catch {
      // Releasing best-effort is enough; the browser will collect failed media nodes.
    }

    if (this.musicElement === audio) {
      this.musicElement = null;
    }
    if (this.musicAutoAdvanceAudio === audio) {
      this.musicAutoAdvanceAudio = null;
    }
  }

  private formatMusicAssetLabel(asset: string): string {
    const fileName = asset.split('/').pop()?.replace(/\.[a-z0-9]+$/i, '') ?? asset;
    return fileName
      .replace(/[_-]+/g, ' ')
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  }

  private refreshActiveMusicAssetsFromConfig(): void {
    const key = this.activeMusicKey ?? this.pendingMusicRequest?.key;
    if (!key) {
      return;
    }

    const configuredAssets = this.getConfiguredMusicAssetsForKey(key);
    if (configuredAssets.length === 0 || this.sameMusicAssets(this.activeMusicAssets, configuredAssets)) {
      return;
    }

    const currentAsset = this.activeMusicAssets[this.activeMusicIndex];
    this.activeMusicAssets = [...configuredAssets];
    const retainedIndex = configuredAssets.indexOf(currentAsset);
    this.activeMusicIndex = retainedIndex >= 0
      ? retainedIndex
      : Math.min(this.activeMusicIndex, configuredAssets.length - 1);

    if (this.pendingMusicRequest?.key === key) {
      this.pendingMusicRequest = {
        ...this.pendingMusicRequest,
        assets: [...configuredAssets],
        index: Math.min(this.pendingMusicRequest.index, configuredAssets.length - 1)
      };
    }
  }

  private getConfiguredMusicAssetsForKey(key: string): string[] {
    if (key === 'menu') {
      const configuredAssets = getEngineConfig().audio.menuMusic;
      return this.dedupeMusicAssets(configuredAssets.length ? configuredAssets : MENU_MUSIC_ASSETS);
    }

    if (key.startsWith('map:')) {
      const configuredAssets = getEngineConfig().audio.mapMusic;
      const mapSize = key.slice('map:'.length);
      if (configuredAssets.length) {
        return this.dedupeMusicAssets(configuredAssets);
      }
      if (this.isMapSize(mapSize)) {
        return this.dedupeMusicAssets(MAP_MUSIC_ASSETS[mapSize]);
      }
    }

    return [];
  }

  private dedupeMusicAssets(assets: string[]): string[] {
    const deduped: string[] = [];
    const seen = new Set<string>();
    for (const asset of assets) {
      const normalized = this.getPreferredAudioPath(asset);
      if (!normalized || seen.has(normalized)) {
        continue;
      }
      seen.add(normalized);
      deduped.push(normalized);
    }
    return deduped;
  }

  private sameMusicAssets(left: string[], right: string[]): boolean {
    if (left.length !== right.length) {
      return false;
    }
    return left.every((asset, index) => asset === right[index]);
  }

  private isMapSize(value: string): value is MapSize {
    return value === 'small' || value === 'medium' || value === 'large' || value === 'huge';
  }

  private scheduleMusicTick(): void {
    if (this.musicTickId !== 0) {
      return;
    }

    this.musicTickId = window.requestAnimationFrame(this.tickMusic);
  }

  private readonly tickMusic = (): void => {
    this.musicTickId = 0;
    const now = performance.now() / 1000;

    for (const [audio, fade] of [...this.musicFades]) {
      const progress = this.clamp01((now - fade.startedAt) / fade.durationSeconds);
      const eased = progress * progress * (3 - 2 * progress);
      const level = fade.fromLevel + (fade.toLevel - fade.fromLevel) * eased;
      this.setMusicElementLevel(audio, level);

      if (progress >= 1) {
        this.musicFades.delete(audio);
        this.setMusicElementLevel(audio, fade.toLevel);
        if (fade.stopAtEnd) {
          this.releaseMusicElement(audio);
        }
      }
    }

    this.maybeAutoAdvanceMusic();

    if (this.musicFades.size > 0 || this.musicElements.size > 0) {
      this.scheduleMusicTick();
    }
  };

  private maybeAutoAdvanceMusic(): void {
    const audio = this.musicElement;
    if (!audio || !this.activeMusicKey || this.activeMusicAssets.length === 0 || audio.paused) {
      return;
    }
    this.refreshActiveMusicAssetsFromConfig();

    const duration = audio.duration;
    if (!Number.isFinite(duration) || duration <= 0) {
      return;
    }

    const remainingSeconds = duration - audio.currentTime;
    if (
      remainingSeconds > this.musicCrossfadeSeconds ||
      remainingSeconds <= 0.2 ||
      this.musicAutoAdvanceAudio === audio
    ) {
      return;
    }

    this.musicAutoAdvanceAudio = audio;
    const nextIndex = this.activeMusicAssets.length > 1
      ? (this.activeMusicIndex + 1) % this.activeMusicAssets.length
      : this.activeMusicIndex;
    this.playMusicAsset(
      this.activeMusicKey,
      this.activeMusicAssets,
      nextIndex,
      false,
      Math.max(0.9, Math.min(this.musicCrossfadeSeconds, remainingSeconds))
    );
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

    const sourcePath = forceOriginalAsset ? path : this.getPreferredAudioPath(path);
    const context = this.getContext();
    if (!context) {
      this.playHtmlSfx(sourcePath, path, gain, playbackRate, onError, fade, forceOriginalAsset);
      return;
    }

    void this.loadSfxBuffer(sourcePath).then((buffer) => {
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

  private primeContext(context: AudioContext | null): void {
    if (!context || !this.unlocked || this.muted) {
      return;
    }

    try {
      const buffer = context.createBuffer(1, 1, 22050);
      const source = context.createBufferSource();
      const gain = context.createGain();
      gain.gain.value = 0.0001;
      source.buffer = buffer;
      source.connect(gain);
      gain.connect(context.destination);
      source.start(0);
      source.onended = (): void => {
        source.disconnect();
        gain.disconnect();
      };
    } catch {
      // Some mobile browsers reject silent priming; normal playback can still work.
    }
  }

  private randomRate(min: number, max: number): number {
    return min + Math.random() * (max - min);
  }

  private getPreferredAudioPath(path: string): string {
    return normalizeOggAudioPath(path) || path;
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
