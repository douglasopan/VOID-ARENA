import { MATCH_DURATION_SECONDS } from '../shared/constants';
import type { GraphicsQuality, HoleRimStyle, MapSize } from '../shared/types';
import type { BotDifficultyMix } from './BotDifficulty';
import { MatchMode } from './MatchMode';

export interface MatchConfig {
  playerName: string;
  mapSize: MapSize;
  matchMode: MatchMode;
  durationSeconds: number;
  botCount: number;
  botDifficultyMix: BotDifficultyMix;
  enableAds: boolean;
  enableChat: boolean;
  graphicsQuality: GraphicsQuality;
  cameraZoom: number;
  deathCameraEnabled: boolean;
  holeRimColor: string;
  holeRimStyle: HoleRimStyle;
  multiplayer: boolean;
  objectDensityMultiplier: number;
  powerUpCount: number;
  respawnSafeRadius: number;
  roomName?: string;
  roomId?: string;
  mapSeed?: string;
  maxPlayers?: number;
  fillBots?: boolean;
}

export function createDefaultMatchConfig(playerName = ''): MatchConfig {
  return {
    playerName,
    mapSize: 'medium',
    matchMode: MatchMode.Timed,
    durationSeconds: MATCH_DURATION_SECONDS,
    botCount: 10,
    botDifficultyMix: 'balanced',
    enableAds: true,
    enableChat: true,
    graphicsQuality: 'balanced',
    cameraZoom: 1,
    deathCameraEnabled: true,
    holeRimColor: '#5eead4',
    holeRimStyle: 'neon',
    multiplayer: false,
    objectDensityMultiplier: 1,
    powerUpCount: 14,
    respawnSafeRadius: 12
  };
}

export function generatePlayerName(): string {
  return `Player_${Math.floor(1000 + Math.random() * 9000)}`;
}
