import type { MatchHistoryEntry, PlayerAudioPreferences, PlayerLifetimeStats, PlayerProfile, ProfileSocialLink, PublicPlayerProfile, VoidSkinId } from '../shared/types';
import type { HoleRimStyle, LanguageCode } from '../shared/types';
import { RIM_COLORS } from '../shared/constants';
import { detectLanguage } from '../i18n/I18n';
import { MatchMode } from '../game/MatchMode';
import { calculateProfileExperience } from './ProfileProgression';
import { DEFAULT_VOID_SKIN_ID, STARTER_VOID_SKINS, VOID_SKIN_DEFINITIONS } from './VoidSkins';

const LEGACY_PROFILE_STORAGE_KEY = 'void-arena-profile-v1';
const PROFILE_COLLECTION_STORAGE_KEY = 'void-arena-profiles-v2';
const ACTIVE_ACCOUNT_STORAGE_KEY = 'void-arena-active-account-v2';
const MAX_HISTORY_ENTRIES = 240;
const PASSWORD_HASH_ITERATIONS = 120000;

const DEFAULT_AUDIO_PREFERENCES: PlayerAudioPreferences = {
  sfxVolume: 0.3,
  musicVolume: 0.15,
  cityAmbienceVolume: 0.01,
  musicEnabled: true
};

const DEFAULT_STATS: PlayerLifetimeStats = {
  matchesPlayed: 0,
  wins: 0,
  timedWins: 0,
  lastHoleStandingWins: 0,
  eliminationRushWins: 0,
  timeTrialWins: 0,
  careerWins: 0,
  creativeWins: 0,
  totalScore: 0,
  bestScore: 0,
  totalEliminations: 0,
  totalObjectsSwallowed: 0
};

export class PlayerProfileStore {
  load(): PlayerProfile | null {
    const activeId = window.localStorage.getItem(ACTIVE_ACCOUNT_STORAGE_KEY);
    if (!activeId) {
      return null;
    }
    return this.listProfiles().find((profile) => profile.accountId === activeId) ?? null;
  }

  listProfiles(): PlayerProfile[] {
    const profiles = this.loadProfiles();
    if (profiles.length > 0) {
      return profiles;
    }

    const migrated = this.loadLegacyProfile();
    if (!migrated) {
      return [];
    }

    this.saveProfiles([migrated]);
    window.localStorage.setItem(ACTIVE_ACCOUNT_STORAGE_KEY, migrated.accountId);
    return [migrated];
  }

  async register(username: string, email: string, password: string): Promise<PlayerProfile> {
    const safeUsername = this.normalizeUsername(username);
    const safeEmail = email.trim().toLowerCase();
    if (safeUsername.length < 3) {
      throw new Error('Use um nome de usuário com pelo menos 3 caracteres.');
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(safeEmail)) {
      throw new Error('Digite um email válido.');
    }
    if (password.length < 6) {
      throw new Error('Use uma senha com pelo menos 6 caracteres.');
    }

    const profiles = this.listProfiles();
    if (profiles.some((profile) => profile.username.toLowerCase() === safeUsername.toLowerCase())) {
      throw new Error('Esse nome de usuário já existe.');
    }
    if (profiles.some((profile) => profile.email.toLowerCase() === safeEmail)) {
      throw new Error('Esse email já está cadastrado.');
    }

    const now = new Date().toISOString();
    const credentials = await this.hashPassword(password);
    const profile: PlayerProfile = {
      accountId: this.createId(),
      username: safeUsername,
      email: safeEmail,
      passwordHash: credentials.hash,
      passwordSalt: credentials.salt,
      playerName: safeUsername,
      profileAccentColor: RIM_COLORS[0],
      socialLinks: [],
      ownedVoidSkins: [...STARTER_VOID_SKINS],
      selectedVoidSkin: DEFAULT_VOID_SKIN_ID,
      holeRimColor: RIM_COLORS[0],
      holeRimStyle: 'neon',
      language: detectLanguage(),
      audioPreferences: { ...DEFAULT_AUDIO_PREFERENCES },
      stats: { ...DEFAULT_STATS },
      experience: calculateProfileExperience(DEFAULT_STATS),
      createdAt: now,
      updatedAt: now,
      matchHistory: []
    };

    this.saveProfiles([...profiles, profile]);
    window.localStorage.setItem(ACTIVE_ACCOUNT_STORAGE_KEY, profile.accountId);
    return profile;
  }

  async login(identifier: string, password: string): Promise<PlayerProfile> {
    const safeIdentifier = identifier.trim().toLowerCase();
    const profile = this.listProfiles().find((item) =>
      item.username.toLowerCase() === safeIdentifier || item.email.toLowerCase() === safeIdentifier
    );
    if (!profile || !profile.passwordHash || !profile.passwordSalt) {
      throw new Error('Conta não encontrada.');
    }

    const valid = await this.verifyPassword(password, profile.passwordSalt, profile.passwordHash);
    if (!valid) {
      throw new Error('Senha incorreta.');
    }

    window.localStorage.setItem(ACTIVE_ACCOUNT_STORAGE_KEY, profile.accountId);
    return profile;
  }

  logout(): void {
    window.localStorage.removeItem(ACTIVE_ACCOUNT_STORAGE_KEY);
  }

  getOrCreate(playerName: string): PlayerProfile {
    const safeName = this.normalizeUsername(playerName) || `Player_${Math.floor(1000 + Math.random() * 9000)}`;
    const existing = this.load();
    if (existing) {
      const next: PlayerProfile = {
        ...existing,
        playerName: safeName,
        username: existing.username || safeName,
        updatedAt: new Date().toISOString()
      };
      this.upsertProfile(next);
      return next;
    }

    const now = new Date().toISOString();
    const profile: PlayerProfile = {
      accountId: this.createId(),
      username: safeName,
      email: '',
      playerName: safeName,
      profileAccentColor: RIM_COLORS[0],
      socialLinks: [],
      ownedVoidSkins: [...STARTER_VOID_SKINS],
      selectedVoidSkin: DEFAULT_VOID_SKIN_ID,
      holeRimColor: RIM_COLORS[0],
      holeRimStyle: 'neon',
      language: detectLanguage(),
      audioPreferences: { ...DEFAULT_AUDIO_PREFERENCES },
      stats: { ...DEFAULT_STATS },
      experience: calculateProfileExperience(DEFAULT_STATS),
      createdAt: now,
      updatedAt: now,
      matchHistory: []
    };
    this.saveProfiles([...this.listProfiles(), profile]);
    window.localStorage.setItem(ACTIVE_ACCOUNT_STORAGE_KEY, profile.accountId);
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
    const nextHistory = [historyEntry, ...profile.matchHistory].slice(0, MAX_HISTORY_ENTRIES);
    const nextStats = this.calculateStats(nextHistory, entry.playerName);
    const next: PlayerProfile = {
      ...profile,
      playerName: entry.playerName,
      matchHistory: nextHistory,
      stats: nextStats,
      experience: calculateProfileExperience(nextStats),
      updatedAt: new Date().toISOString()
    };
    this.upsertProfile(next);
    return historyEntry;
  }

  recent(limit = 8): MatchHistoryEntry[] {
    return this.load()?.matchHistory.slice(0, limit) ?? [];
  }

  activateSyncedProfile(profile: PlayerProfile): PlayerProfile {
    const normalized = this.normalizeProfile(profile);
    if (!normalized) {
      throw new Error('Perfil recebido do servidor é inválido.');
    }
    this.upsertProfile(normalized);
    return normalized;
  }

  toPublicProfile(profile: PlayerProfile): PublicPlayerProfile {
    const {
      email: _email,
      passwordHash: _passwordHash,
      passwordSalt: _passwordSalt,
      audioPreferences: _audioPreferences,
      matchHistory: _matchHistory,
      ...publicProfile
    } = profile;
    return publicProfile;
  }

  updateAppearance(playerName: string, holeRimColor: string, holeRimStyle: HoleRimStyle): PlayerProfile {
    const profile = this.getOrCreate(playerName);
    const next: PlayerProfile = {
      ...profile,
      holeRimColor,
      holeRimStyle,
      updatedAt: new Date().toISOString()
    };
    this.upsertProfile(next);
    return next;
  }

  updatePublicProfile(input: {
    profileTitle?: string;
    bio?: string;
    profileAccentColor?: string;
    holeRimColor?: string;
    socialLinks?: ProfileSocialLink[];
    selectedVoidSkin?: VoidSkinId;
  }): PlayerProfile | null {
    const profile = this.load();
    if (!profile) {
      return null;
    }
    const ownedVoidSkins = this.normalizeOwnedVoidSkins(profile.ownedVoidSkins);
    const selectedVoidSkin =
      input.selectedVoidSkin && ownedVoidSkins.includes(input.selectedVoidSkin)
        ? input.selectedVoidSkin
        : profile.selectedVoidSkin;
    const next: PlayerProfile = {
      ...profile,
      profileTitle: this.cleanText(input.profileTitle ?? profile.profileTitle ?? '', 42),
      bio: this.cleanText(input.bio ?? profile.bio ?? '', 220),
      profileAccentColor: this.normalizeColor(input.profileAccentColor ?? profile.profileAccentColor),
      holeRimColor: this.normalizeColor(input.holeRimColor ?? profile.holeRimColor),
      socialLinks: this.normalizeSocialLinks(input.socialLinks ?? profile.socialLinks),
      ownedVoidSkins,
      selectedVoidSkin,
      updatedAt: new Date().toISOString()
    };
    this.upsertProfile(next);
    return next;
  }

  updateLanguage(playerName: string, language: LanguageCode): PlayerProfile {
    const profile = this.getOrCreate(playerName);
    const next: PlayerProfile = {
      ...profile,
      language,
      updatedAt: new Date().toISOString()
    };
    this.upsertProfile(next);
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
    this.upsertProfile(next);
    return next;
  }

  updateAvatar(avatarDataUrl: string): PlayerProfile | null {
    const profile = this.load();
    if (!profile) {
      return null;
    }
    const next: PlayerProfile = {
      ...profile,
      avatarDataUrl,
      updatedAt: new Date().toISOString()
    };
    this.upsertProfile(next);
    return next;
  }

  private loadProfiles(): PlayerProfile[] {
    try {
      const raw = window.localStorage.getItem(PROFILE_COLLECTION_STORAGE_KEY);
      if (!raw) {
        return [];
      }
      const parsed = JSON.parse(raw) as { profiles?: Partial<PlayerProfile>[] } | Partial<PlayerProfile>[];
      const profiles = Array.isArray(parsed) ? parsed : parsed.profiles ?? [];
      return profiles
        .map((profile) => this.normalizeProfile(profile))
        .filter((profile): profile is PlayerProfile => Boolean(profile));
    } catch {
      return [];
    }
  }

  private loadLegacyProfile(): PlayerProfile | null {
    try {
      const raw = window.localStorage.getItem(LEGACY_PROFILE_STORAGE_KEY);
      if (!raw) {
        return null;
      }
      return this.normalizeProfile(JSON.parse(raw) as Partial<PlayerProfile>);
    } catch {
      return null;
    }
  }

  private normalizeProfile(input: Partial<PlayerProfile> | undefined): PlayerProfile | null {
    if (!input?.accountId && !input?.playerName) {
      return null;
    }
    const now = new Date().toISOString();
    const playerName = this.normalizeUsername(input.playerName || input.username || 'Player');
    const history = Array.isArray(input.matchHistory) ? input.matchHistory : [];
    const stats = this.normalizeStats(input.stats, history, playerName);
    const ownedVoidSkins = this.normalizeOwnedVoidSkins(input.ownedVoidSkins);
    const selectedVoidSkin = ownedVoidSkins.includes(input.selectedVoidSkin as VoidSkinId)
      ? input.selectedVoidSkin as VoidSkinId
      : ownedVoidSkins[0] ?? DEFAULT_VOID_SKIN_ID;
    return {
      accountId: input.accountId || this.createId(),
      username: this.normalizeUsername(input.username || playerName),
      email: (input.email || '').trim().toLowerCase(),
      passwordHash: input.passwordHash,
      passwordSalt: input.passwordSalt,
      avatarDataUrl: input.avatarDataUrl,
      profileTitle: this.cleanText(input.profileTitle ?? '', 42),
      bio: this.cleanText(input.bio ?? '', 220),
      profileAccentColor: this.normalizeColor(input.profileAccentColor || input.holeRimColor || RIM_COLORS[0]),
      socialLinks: this.normalizeSocialLinks(input.socialLinks),
      ownedVoidSkins,
      selectedVoidSkin,
      playerName,
      holeRimColor: input.holeRimColor || RIM_COLORS[0],
      holeRimStyle: input.holeRimStyle || 'neon',
      language: input.language || detectLanguage(),
      audioPreferences: this.normalizeAudioPreferences(input.audioPreferences),
      stats,
      experience: calculateProfileExperience(stats),
      createdAt: input.createdAt || now,
      updatedAt: input.updatedAt || now,
      matchHistory: history
    };
  }

  private saveProfiles(profiles: PlayerProfile[]): void {
    window.localStorage.setItem(PROFILE_COLLECTION_STORAGE_KEY, JSON.stringify({ profiles }));
  }

  private upsertProfile(profile: PlayerProfile): void {
    const profiles = this.listProfiles();
    const index = profiles.findIndex((item) => item.accountId === profile.accountId);
    const next = [...profiles];
    if (index >= 0) {
      next[index] = profile;
    } else {
      next.push(profile);
    }
    this.saveProfiles(next);
    window.localStorage.setItem(ACTIVE_ACCOUNT_STORAGE_KEY, profile.accountId);
  }

  private normalizeAudioPreferences(input: Partial<PlayerAudioPreferences> | undefined): PlayerAudioPreferences {
    return {
      sfxVolume: this.clamp01(Number(input?.sfxVolume ?? DEFAULT_AUDIO_PREFERENCES.sfxVolume)),
      musicVolume: this.clamp01(Number(input?.musicVolume ?? DEFAULT_AUDIO_PREFERENCES.musicVolume)),
      cityAmbienceVolume: this.clamp01(Number(input?.cityAmbienceVolume ?? DEFAULT_AUDIO_PREFERENCES.cityAmbienceVolume)),
      musicEnabled: input?.musicEnabled !== false
    };
  }

  private normalizeStats(
    input: Partial<PlayerLifetimeStats> | undefined,
    history: MatchHistoryEntry[],
    playerName: string
  ): PlayerLifetimeStats {
    if (!input) {
      return this.calculateStats(history, playerName);
    }
    return {
      ...DEFAULT_STATS,
      ...input,
      matchesPlayed: Math.max(0, Number(input.matchesPlayed ?? 0)),
      wins: Math.max(0, Number(input.wins ?? 0)),
      totalEliminations: Math.max(0, Number(input.totalEliminations ?? 0)),
      totalObjectsSwallowed: Math.max(0, Number(input.totalObjectsSwallowed ?? 0)),
      totalScore: Math.max(0, Number(input.totalScore ?? 0)),
      bestScore: Math.max(0, Number(input.bestScore ?? 0))
    };
  }

  private normalizeOwnedVoidSkins(input: unknown): VoidSkinId[] {
    const valid = new Set(VOID_SKIN_DEFINITIONS.map((skin) => skin.id));
    const values = Array.isArray(input) ? input : STARTER_VOID_SKINS;
    const owned = values.filter((value): value is VoidSkinId => typeof value === 'string' && valid.has(value as VoidSkinId));
    const unique = Array.from(new Set([...STARTER_VOID_SKINS, ...owned]));
    return unique.length > 0 ? unique : [DEFAULT_VOID_SKIN_ID];
  }

  private normalizeSocialLinks(input: unknown): ProfileSocialLink[] {
    if (!Array.isArray(input)) {
      return [];
    }
    return input
      .map((link) => {
        if (!link || typeof link !== 'object') {
          return null;
        }
        const candidate = link as Partial<ProfileSocialLink>;
        const kind = candidate.kind;
        if (!kind || !['website', 'instagram', 'youtube', 'tiktok', 'discord'].includes(kind)) {
          return null;
        }
        const url = this.normalizeUrl(candidate.url ?? '');
        if (!url) {
          return null;
        }
        return {
          kind,
          label: this.cleanText(candidate.label || this.defaultSocialLabel(kind), 18),
          url
        };
      })
      .filter((link): link is ProfileSocialLink => Boolean(link))
      .slice(0, 5);
  }

  private normalizeUrl(value: string): string {
    const trimmed = value.trim();
    if (!trimmed) {
      return '';
    }
    const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    try {
      const url = new URL(withProtocol);
      if (url.protocol !== 'https:' && url.protocol !== 'http:') {
        return '';
      }
      return url.toString().slice(0, 180);
    } catch {
      return '';
    }
  }

  private defaultSocialLabel(kind: ProfileSocialLink['kind']): string {
    switch (kind) {
      case 'instagram':
        return 'Instagram';
      case 'youtube':
        return 'YouTube';
      case 'tiktok':
        return 'TikTok';
      case 'discord':
        return 'Discord';
      case 'website':
      default:
        return 'Website';
    }
  }

  private normalizeColor(value: string | undefined): string {
    const color = (value || RIM_COLORS[0]).trim();
    return /^#[0-9a-f]{6}$/i.test(color) ? color : RIM_COLORS[0];
  }

  private cleanText(value: string, maxLength: number): string {
    return value.replace(/\s+/g, ' ').trim().slice(0, maxLength);
  }

  private calculateStats(history: MatchHistoryEntry[], playerName: string): PlayerLifetimeStats {
    const stats = { ...DEFAULT_STATS };
    for (const entry of history) {
      stats.matchesPlayed += 1;
      stats.totalScore += Math.max(0, entry.finalScore);
      stats.bestScore = Math.max(stats.bestScore, entry.finalScore);
      stats.totalEliminations += Math.max(0, entry.eliminations);
      stats.totalObjectsSwallowed += Math.max(0, entry.objectsSwallowed);
      const won = (entry.winnerName === playerName || entry.placement === 1) && entry.challengeCompleted !== false;
      if (!won) {
        continue;
      }
      stats.wins += 1;
      switch (entry.matchMode) {
        case MatchMode.LastHoleStanding:
          stats.lastHoleStandingWins += 1;
          break;
        case MatchMode.EliminationRush:
          stats.eliminationRushWins += 1;
          break;
        case MatchMode.TimeTrial:
          stats.timeTrialWins += 1;
          break;
        case MatchMode.Career:
          stats.careerWins += 1;
          break;
        case MatchMode.Creative:
          stats.creativeWins += 1;
          break;
        case MatchMode.Timed:
        default:
          stats.timedWins += 1;
          break;
      }
    }
    return stats;
  }

  private async hashPassword(password: string, salt = this.randomSalt()): Promise<{ hash: string; salt: string }> {
    const passwordBytes = new TextEncoder().encode(password);
    const passwordBuffer = passwordBytes.buffer.slice(passwordBytes.byteOffset, passwordBytes.byteOffset + passwordBytes.byteLength) as ArrayBuffer;
    const saltBytes = this.base64ToBytes(salt);
    const saltBuffer = saltBytes.buffer.slice(saltBytes.byteOffset, saltBytes.byteOffset + saltBytes.byteLength) as ArrayBuffer;
    const keyMaterial = await window.crypto.subtle.importKey(
      'raw',
      passwordBuffer,
      'PBKDF2',
      false,
      ['deriveBits']
    );
    const derived = await window.crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt: saltBuffer,
        iterations: PASSWORD_HASH_ITERATIONS,
        hash: 'SHA-256'
      },
      keyMaterial,
      256
    );
    return {
      salt,
      hash: this.bytesToBase64(new Uint8Array(derived))
    };
  }

  private async verifyPassword(password: string, salt: string, expectedHash: string): Promise<boolean> {
    const actual = await this.hashPassword(password, salt);
    return actual.hash === expectedHash;
  }

  private randomSalt(): string {
    const bytes = new Uint8Array(16);
    window.crypto.getRandomValues(bytes);
    return this.bytesToBase64(bytes);
  }

  private bytesToBase64(bytes: Uint8Array): string {
    let binary = '';
    bytes.forEach((byte) => {
      binary += String.fromCharCode(byte);
    });
    return window.btoa(binary);
  }

  private base64ToBytes(value: string): Uint8Array {
    const binary = window.atob(value);
    const bytes = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index += 1) {
      bytes[index] = binary.charCodeAt(index);
    }
    return bytes;
  }

  private normalizeUsername(value: string): string {
    return value.trim().replace(/\s+/g, '_').slice(0, 18);
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
