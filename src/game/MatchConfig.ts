import { MATCH_DURATION_SECONDS } from '../shared/constants';
import type { CityObjectCategory, DayNightMode, GraphicsQuality, HoleRimStyle, MapSize, WorldObjectKind } from '../shared/types';
import type { BotDifficultyMix } from './BotDifficulty';
import { MatchMode } from './MatchMode';

export type SinglePlayerMode = 'quick' | 'custom' | 'time-trial' | 'career' | 'creative';
export type MatchObjectiveType = 'swallowCategory' | 'swallowKind' | 'eliminateHoles' | 'score';

export interface MatchObjective {
  type: MatchObjectiveType;
  targetCount: number;
  title: string;
  description: string;
  targetCategory?: CityObjectCategory;
  targetKind?: WorldObjectKind;
}

export interface MatchConfig {
  playerName: string;
  mapSize: MapSize;
  matchMode: MatchMode;
  singlePlayerMode: SinglePlayerMode;
  durationSeconds: number;
  botCount: number;
  botDifficultyMix: BotDifficultyMix;
  enableAds: boolean;
  enableChat: boolean;
  graphicsQuality: GraphicsQuality;
  dayNightMode: DayNightMode;
  cameraZoom: number;
  deathCameraEnabled: boolean;
  holeRimColor: string;
  holeRimStyle: HoleRimStyle;
  multiplayer: boolean;
  objectDensityMultiplier: number;
  powerUpCount: number;
  respawnSafeRadius: number;
  itemRespawnEnabled: boolean;
  powerUpRespawnEnabled: boolean;
  objective?: MatchObjective;
  careerStageId?: string;
  roomName?: string;
  roomId?: string;
  mapSeed?: string;
  serverStartedAt?: number;
  serverEndsAt?: number | null;
  serverNow?: number;
  serverAuthorityId?: string | null;
  maxPlayers?: number;
  fillBots?: boolean;
}

export function createDefaultMatchConfig(playerName = ''): MatchConfig {
  return {
    playerName,
    mapSize: 'medium',
    matchMode: MatchMode.Timed,
    singlePlayerMode: 'quick',
    durationSeconds: MATCH_DURATION_SECONDS,
    botCount: 10,
    botDifficultyMix: 'balanced',
    enableAds: true,
    enableChat: true,
    graphicsQuality: 'balanced',
    dayNightMode: 'cycle',
    cameraZoom: 1,
    deathCameraEnabled: true,
    holeRimColor: '#5eead4',
    holeRimStyle: 'neon',
    multiplayer: false,
    objectDensityMultiplier: 1,
    powerUpCount: 14,
    respawnSafeRadius: 12,
    itemRespawnEnabled: true,
    powerUpRespawnEnabled: true,
    mapSeed: generateMapSeed()
  };
}

export function generateMapSeed(): string {
  const timePart = Date.now().toString(36).toUpperCase();
  const randomPart = Math.floor(Math.random() * 0x1000000).toString(36).toUpperCase().padStart(5, '0');
  return `VA-${timePart}-${randomPart}`;
}

export function normalizeMapSeed(seed: string | undefined): string {
  return (seed ?? '').trim().replace(/\s+/g, '-').slice(0, 48);
}

export function generatePlayerName(): string {
  return `Player_${Math.floor(1000 + Math.random() * 9000)}`;
}
