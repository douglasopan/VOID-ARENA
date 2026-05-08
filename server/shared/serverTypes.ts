import type { DayNightMode, HoleRimStyle, MapSize } from '../../src/shared/types';
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
