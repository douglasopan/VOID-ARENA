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
  private readonly activeSfx = new Set<HTMLAudioElement>();
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
    this.playGeneratedSwallow('decor', 4);
  }

  playObjectSwallow(kind: WorldObjectKind, category: CityObjectCategory, mass: number): void {
    const asset = OBJECT_SWALLOW_SFX_ASSETS[kind];
    if (asset) {
      this.playSfxAsset(asset, 0.95, this.randomRate(0.95, 1.06), () => this.playGeneratedSwallow(category, mass));
      return;
    }

    this.playGeneratedSwallow(category, mass);
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
      this.playSfxAsset(HOLE_SWALLOW_SFX_ASSET, 1, this.randomRate(0.94, 1.03), () => {
        this.playTone(98, 24, 0.32, 'sawtooth', 0.36);
        this.playTone(180, 42, 0.18, 'triangle', 0.18);
      });
      return;
    }

    this.playTone(98, 24, 0.32, 'sawtooth', 0.36);
    this.playTone(180, 42, 0.18, 'triangle', 0.18);
  }

  playDeath(): void {
    this.playSfxAsset(PLAYER_DIE_SFX_ASSET, 0.36, this.randomRate(0.98, 1.02), () => {
      this.playTone(180, 34, 0.42, 'sawtooth', 0.34);
      this.playTone(72, 24, 0.34, 'sine', 0.24);
    }, { fadeInSeconds: 0.08, fadeOutSeconds: 0.42 });
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
    this.playTone(260, 520, 0.22, 'triangle', 0.22);
  }

  playMatchEnd(): void {
    this.playTone(360, 140, 0.45, 'sine', 0.22);
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

  private startTrackGroup(key: string, assets: string[]): void {
    if (this.musicElement && this.activeMusicKey === key && !this.musicElement.paused) {
      return;
    }

    if (assets.length === 0) {
      this.startGeneratedMusic();
      return;
    }

    this.stopMusic();
    const audio = new Audio(this.pickRandom(assets));
    audio.loop = true;
    audio.preload = 'auto';
    audio.volume = this.muted ? 0 : this.musicVolume;
    audio.muted = this.muted;
    this.musicElement = audio;
    this.activeMusicKey = key;
    void audio.play().catch(() => {
      if (this.musicElement === audio) {
        this.musicElement = null;
        this.activeMusicKey = null;
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
  }

  private playGeneratedSwallow(category: CityObjectCategory, mass: number): void {
    const heavy = mass >= 24;
    switch (category) {
      case 'traffic':
        this.playTone(92, 32, heavy ? 0.28 : 0.2, 'sawtooth', heavy ? 0.36 : 0.28);
        this.playTone(220, 74, 0.08, 'square', 0.12);
        break;
      case 'building':
      case 'ad':
        this.playTone(74, 28, 0.34, 'sawtooth', 0.4);
        this.playTone(138, 48, 0.16, 'triangle', 0.2);
        break;
      case 'nature':
        this.playTone(160, 62, 0.18, 'triangle', 0.22);
        break;
      case 'utility':
      case 'sidewalk':
        this.playTone(210, 58, 0.14, 'square', 0.18);
        break;
      case 'pedestrian':
        this.playTone(260, 110, 0.12, 'triangle', 0.14);
        break;
      default:
        this.playTone(120, 54, 0.16, 'sawtooth', 0.28);
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
    fade?: { fadeInSeconds?: number; fadeOutSeconds?: number }
  ): void {
    if (this.muted) {
      return;
    }

    const audio = new Audio(path);
    const targetVolume = this.clamp01(this.sfxVolume * gain);
    audio.volume = fade?.fadeInSeconds ? 0 : targetVolume;
    audio.playbackRate = playbackRate;
    let fadeFrame = 0;
    const release = (): void => {
      if (fadeFrame) {
        window.cancelAnimationFrame(fadeFrame);
      }
      audio.removeEventListener('ended', release);
      audio.removeEventListener('error', release);
      this.activeSfx.delete(audio);
    };
    const applyFade = (): void => {
      const fadeIn = fade?.fadeInSeconds ?? 0;
      const fadeOut = fade?.fadeOutSeconds ?? 0;
      let multiplier = 1;
      if (fadeIn > 0) {
        multiplier = Math.min(multiplier, audio.currentTime / fadeIn);
      }
      if (fadeOut > 0 && Number.isFinite(audio.duration) && audio.duration > 0) {
        multiplier = Math.min(multiplier, Math.max(0, (audio.duration - audio.currentTime) / fadeOut));
      }
      audio.volume = targetVolume * Math.max(0, Math.min(1, multiplier));
      if (!audio.paused && !audio.ended) {
        fadeFrame = window.requestAnimationFrame(applyFade);
      }
    };
    audio.addEventListener('ended', release);
    audio.addEventListener('error', release);
    this.activeSfx.add(audio);
    void audio.play().then(() => {
      if (fade) {
        applyFade();
      }
    }).catch((error) => {
      release();
      onError();
      void error;
    });
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

  private pickRandom<T>(items: T[]): T {
    return items[Math.floor(Math.random() * items.length)];
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
