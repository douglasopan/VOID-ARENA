import type { MatchHistoryEntry, PlayerProfile } from '../shared/types';

const PROFILE_STORAGE_KEY = 'void-arena-profile-v1';
const MAX_HISTORY_ENTRIES = 60;

export class PlayerProfileStore {
  load(): PlayerProfile | null {
    try {
      const raw = window.localStorage.getItem(PROFILE_STORAGE_KEY);
      if (!raw) {
        return null;
      }

      const parsed = JSON.parse(raw) as PlayerProfile;
      if (!parsed.accountId || !parsed.playerName || !Array.isArray(parsed.matchHistory)) {
        return null;
      }

      return parsed;
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

  private save(profile: PlayerProfile): void {
    window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
  }

  private createId(): string {
    if (window.crypto?.randomUUID) {
      return window.crypto.randomUUID();
    }

    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  }
}
