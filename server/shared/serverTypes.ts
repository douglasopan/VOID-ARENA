import type { DayNightMode, HoleRimStyle, MapSize, PowerUpType, PublicPlayerProfile, Vec3Data, WorldTrafficSnapshotEntry } from '../../src/shared/types';
import type { BotDifficultyMix } from '../../src/game/BotDifficulty';
import { MatchMode } from '../../src/game/MatchMode';

export interface ServerPlayer {
  id: string;
  name: string;
  isBot: boolean;
}

export interface RoomCreateOptions {
  roomName: string;
  maxPlayers: number;
  fillBots: boolean;
  mapSize: MapSize;
  matchMode: MatchMode;
  durationSeconds: number;
  enableChat: boolean;
  enableAds: boolean;
  dayNightMode: DayNightMode;
  objectDensityMultiplier: number;
  powerUpCount: number;
  respawnSafeRadius: number;
  itemRespawnEnabled: boolean;
  powerUpRespawnEnabled: boolean;
  botDifficultyMix: BotDifficultyMix;
  mapSeed?: string;
}

export interface ServerRoomSummary {
  id: string;
  roomName: string;
  status: ServerRoomStatus;
  mapSize: MapSize;
  players: number;
  maxPlayers: number;
  bots: number;
  botsEnabled: boolean;
  matchMode: MatchMode;
  durationSeconds: number;
  enableChat: boolean;
  enableAds: boolean;
  dayNightMode: DayNightMode;
  objectDensityMultiplier: number;
  powerUpCount: number;
  respawnSafeRadius: number;
  itemRespawnEnabled: boolean;
  powerUpRespawnEnabled: boolean;
  botDifficultyMix: BotDifficultyMix;
  seed: string;
  createdAt: number;
  startedAt: number;
  endsAt: number | null;
  serverNow: number;
  authorityId: string | null;
}

export type ServerRoomStatus = 'running' | 'ended';

export interface ServerRoomClock {
  roomId: string;
  status: ServerRoomStatus;
  serverNow: number;
  startedAt: number;
  endsAt: number | null;
  authorityId: string | null;
}

export interface ServerPlayerState {
  id: string;
  name: string;
  x: number;
  z: number;
  radius: number;
  score: number;
  mass: number;
  rimColor: string;
  rimStyle: HoleRimStyle;
  alive: boolean;
  stamina: number;
  eliminations: number;
  swallowedObjects: number;
  spawnProtectionRemaining?: number;
}

export interface JoinRoomResult {
  ok: boolean;
  room?: ServerRoomSummary;
  reason?: string;
}

export type ServerWorldEventType = 'powerup:collected' | 'object:swallow-started' | 'object:swallowed';

export interface ServerWorldEventInput {
  type: ServerWorldEventType;
  targetId: string;
  playerId: string;
  respawnDelayMs?: number;
  position?: Vec3Data;
  powerUpType?: PowerUpType;
  collectedPowerUpType?: PowerUpType;
  scoreDelta?: number;
  massDelta?: number;
  holeCenter?: Vec3Data;
  playerVelocity?: Vec3Data;
  holeRadius?: number;
  insideFraction?: number;
}

export interface ServerWorldEvent extends ServerWorldEventInput {
  id: string;
  roomId: string;
  timestamp: number;
  respawnAt: number | null;
}

export interface ServerWorldSnapshot {
  roomId: string;
  authorityId: string;
  timestamp: number;
  traffic: WorldTrafficSnapshotEntry[];
}

export type ServerPublicProfile = PublicPlayerProfile;
