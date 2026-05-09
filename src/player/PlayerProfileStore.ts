import type { MatchHistoryEntry, PlayerAudioPreferences, PlayerProfile } from '../shared/types';
import type { HoleRimStyle, LanguageCode } from '../shared/types';
import { RIM_COLORS } from '../shared/constants';
import { detectLanguage } from '../i18n/I18n';

const PROFILE_STORAGE_KEY = 'void-arena-profile-v1';
const MAX_HISTORY_ENTRIES = 60;
const DEFAULT_AUDIO_PREFERENCES: PlayerAudioPreferences = {
  sfxVolume: 0.55,
  musicVolume: 0.3,
  musicEnabled: true
};

export class PlayerProfileStore {
  load(): PlayerProfile | null {
    try {
      const raw = window.localStorage.getItem(PROFILE_STORAGE_KEY);
      if (!raw) {
        return null;
      }

      const parsed = JSON.parse(raw) as Partial<PlayerProfile>;
      if (!parsed.accountId || !parsed.playerName || !Array.isArray(parsed.matchHistory)) {
        return null;
      }

      return {
        ...parsed,
        holeRimColor: parsed.holeRimColor || RIM_COLORS[0],
        holeRimStyle: parsed.holeRimStyle || 'neon',
        language: parsed.language || detectLanguage(),
        audioPreferences: this.normalizeAudioPreferences(parsed.audioPreferences)
      } as PlayerProfile;
    } catch {
      return null;
    }
  }

  getOrCreate(playerName: string): PlayerProfile {
    const now = new Date().toISOString();
    const existing = this.load();
    if (existing) {
      const next: PlayerProfile = {
        ...existing,
        playerName,
        updatedAt: now
      };
      this.save(next);
      return next;
    }

    const profile: PlayerProfile = {
      accountId: this.createId(),
      playerName,
      holeRimColor: RIM_COLORS[0],
      holeRimStyle: 'neon',
      language: detectLanguage(),
      audioPreferences: { ...DEFAULT_AUDIO_PREFERENCES },
      createdAt: now,
      updatedAt: now,
      matchHistory: []
    };
    this.save(profile);
    return profile;
  }

  recordMatch(entry: Omit<MatchHistoryEntry, 'id' | 'accountId'>): MatchHistoryEntry | null {
    const profile = this.load();
    if (!profile) {
      return null;
    }

    const historyEntry: MatchHistoryEntry = {
      ...entry,
      id: this.createId(),
      accountId: profile.accountId
    };
    const next: PlayerProfile = {
      ...profile,
      updatedAt: new Date().toISOString(),
      matchHistory: [historyEntry, ...profile.matchHistory].slice(0, MAX_HISTORY_ENTRIES)
    };
    this.save(next);
    return historyEntry;
  }

  recent(limit = 8): MatchHistoryEntry[] {
    return this.load()?.matchHistory.slice(0, limit) ?? [];
  }

  updateAppearance(playerName: string, holeRimColor: string, holeRimStyle: HoleRimStyle): PlayerProfile {
    const profile = this.getOrCreate(playerName);
    const next: PlayerProfile = {
      ...profile,
      holeRimColor,
      holeRimStyle,
      updatedAt: new Date().toISOString()
    };
    this.save(next);
    return next;
  }

  updateLanguage(playerName: string, language: LanguageCode): PlayerProfile {
    const profile = this.getOrCreate(playerName);
    const next: PlayerProfile = {
      ...profile,
      language,
      updatedAt: new Date().toISOString()
    };
    this.save(next);
    return next;
  }

  updateAudioPreferences(playerName: string, audioPreferences: Partial<PlayerAudioPreferences>): PlayerProfile {
    const profile = this.getOrCreate(playerName);
    const next: PlayerProfile = {
      ...profile,
      audioPreferences: this.normalizeAudioPreferences({
        ...profile.audioPreferences,
        ...audioPreferences
      }),
      updatedAt: new Date().toISOString()
    };
    this.save(next);
    return next;
  }

  private save(profile: PlayerProfile): void {
    window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
  }

  private normalizeAudioPreferences(input: Partial<PlayerAudioPreferences> | undefined): PlayerAudioPreferences {
    return {
      sfxVolume: this.clamp01(Number(input?.sfxVolume ?? DEFAULT_AUDIO_PREFERENCES.sfxVolume)),
      musicVolume: this.clamp01(Number(input?.musicVolume ?? DEFAULT_AUDIO_PREFERENCES.musicVolume)),
      musicEnabled: input?.musicEnabled !== false
    };
  }

  private clamp01(value: number): number {
    if (!Number.isFinite(value)) {
      return 0;
    }
    return Math.max(0, Math.min(1, value));
  }

  private createId(): string {
    if (window.crypto?.randomUUID) {
      return window.crypto.randomUUID();
    }

    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  }
}
