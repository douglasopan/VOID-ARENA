import type { MapSize } from '../../src/shared/types';
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
  objectDensityMultiplier: number;
  powerUpCount: number;
  respawnSafeRadius: number;
  botDifficultyMix: BotDifficultyMix;
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
  objectDensityMultiplier: number;
  powerUpCount: number;
  respawnSafeRadius: number;
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
  alive: boolean;
  stamina: number;
  eliminations: number;
  swallowedObjects: number;
}

export interface JoinRoomResult {
  ok: boolean;
  room?: ServerRoomSummary;
  reason?: string;
}
