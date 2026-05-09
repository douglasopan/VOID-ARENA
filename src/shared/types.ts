import type { MatchMode } from '../game/MatchMode';
import type { BotDifficultyMix } from '../game/BotDifficulty';

export type MapSize = 'small' | 'medium' | 'large' | 'huge';
export type GraphicsQuality = 'performance' | 'balanced' | 'quality';
export type DayNightMode = 'day' | 'night' | 'cycle';
export type LanguageCode = 'en' | 'es' | 'pt' | 'fr' | 'de' | 'ru' | 'ja' | 'zh';
export type CityObjectCategory =
  | 'building'
  | 'roadside'
  | 'sidewalk'
  | 'traffic'
  | 'nature'
  | 'utility'
  | 'decor'
  | 'ad'
  | 'pedestrian'
  | 'powerup';
export type WorldObjectKind =
  | 'crate'
  | 'post'
  | 'tree'
  | 'rock'
  | 'car'
  | 'truck'
  | 'bus'
  | 'emergency'
  | 'trailerTruck'
  | 'trafficLight'
  | 'building'
  | 'structure'
  | 'billboard'
  | 'screen'
  | 'bench'
  | 'hydrant'
  | 'trash'
  | 'pedestrian'
  | 'cone'
  | 'mailbox'
  | 'bike'
  | 'planter'
  | 'kiosk'
  | 'fountain'
  | 'statue';

export type PowerUpType =
  | 'magnet'
  | 'shrink'
  | 'haste'
  | 'shield'
  | 'stamina'
  | 'mass'
  | 'gust'
  | 'overcharge'
  | 'dash';
export type HoleRimStyle = 'classic' | 'neon' | 'double' | 'clean';

export interface Vec2Data {
  x: number;
  z: number;
}

export interface Vec3Data extends Vec2Data {
  y: number;
}

export interface ObjectSpawnDefinition {
  id: string;
  kind: WorldObjectKind;
  label: string;
  position: Vec3Data;
  rotationY: number;
  size: Vec3Data;
  color: string;
  boundingRadius: number;
  mass: number;
  score: number;
  respawnDelay: number;
  category: CityObjectCategory;
  variantId?: string;
  variantLabel?: string;
  variantRole?: string;
  roadAligned?: boolean;
  routeId?: string;
  routeT?: number;
  routeSpeed?: number;
  pedestrianPathId?: string;
  trafficSignalId?: string;
  lightsEnabled?: boolean;
  isAd?: boolean;
  adSurfaceId?: string;
}

export interface RoadSegment {
  id: string;
  x: number;
  z: number;
  width: number;
  length: number;
  rotationY: number;
  lanes: number;
  sidewalkWidth: number;
}

export interface SurfaceSegment {
  id: string;
  x: number;
  z: number;
  width: number;
  length: number;
  rotationY: number;
  kind: 'sidewalk' | 'lane-marking' | 'crosswalk' | 'plaza' | 'parking';
  roadSideSign?: -1 | 1;
}

export interface RoutePoint {
  x: number;
  z: number;
}

export interface TrafficRoute {
  id: string;
  points: RoutePoint[];
  loop: boolean;
}

export type TrafficSignalAxis = 'vertical' | 'horizontal';

export interface TrafficSignalDefinition {
  id: string;
  routeId: string;
  groupId: string;
  axis: TrafficSignalAxis;
  position: Vec3Data;
  rotationY: number;
  stopT: number;
  phaseOffset: number;
}

export interface PedestrianPath {
  id: string;
  points: RoutePoint[];
  loop: boolean;
}

export interface PowerUpSpawnDefinition {
  id: string;
  type: PowerUpType;
  label: string;
  position: Vec3Data;
  radius: number;
  color: string;
  durationSeconds: number;
  respawnDelay: number;
}

export type AdSurfaceType =
  | 'billboard'
  | 'building-banner'
  | 'vehicle-branding'
  | 'digital-video-screen'
  | 'rooftop-sign';

export interface AdSurface {
  id: string;
  type: AdSurfaceType;
  text: string;
  position: Vec3Data;
  rotationY: number;
  width: number;
  height: number;
  dynamic: boolean;
  attachedObjectId?: string;
}

export interface MapData {
  seed: string;
  size: MapSize;
  halfExtent: number;
  roads: RoadSegment[];
  surfaces: SurfaceSegment[];
  trafficRoutes: TrafficRoute[];
  trafficSignals: TrafficSignalDefinition[];
  pedestrianPaths: PedestrianPath[];
  objects: ObjectSpawnDefinition[];
  powerUps: PowerUpSpawnDefinition[];
  spawnPoints: Vec3Data[];
  adSurfaces: AdSurface[];
}

export interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  system: boolean;
  timestamp: number;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  score: number;
  radius: number;
  eliminations: number;
  alive: boolean;
  isLocal: boolean;
  isBot: boolean;
}

export interface MockRoomSummary {
  id: string;
  roomName: string;
  mapSize: MapSize;
  players: number;
  maxPlayers: number;
  botsEnabled: boolean;
  botDifficultyMix?: BotDifficultyMix;
  matchMode: MatchMode;
}

export interface MatchResult {
  winnerName: string;
  placement: number;
  finalScore: number;
  finalRadius: number;
  objectsSwallowed: number;
  eliminations: number;
  challengeCompleted?: boolean;
  objectiveTitle?: string;
  objectiveProgress?: number;
  objectiveTarget?: number;
}

export interface MatchHistoryEntry extends MatchResult {
  id: string;
  accountId: string;
  playerName: string;
  playedAt: string;
  mapSize: MapSize;
  matchMode: MatchMode;
  multiplayer: boolean;
  roomName?: string;
  durationSeconds: number;
  leaderboard: LeaderboardEntry[];
}

export interface PlayerAudioPreferences {
  sfxVolume: number;
  musicVolume: number;
  musicEnabled: boolean;
}

export interface PlayerProfile {
  accountId: string;
  playerName: string;
  holeRimColor: string;
  holeRimStyle: HoleRimStyle;
  language: LanguageCode;
  audioPreferences: PlayerAudioPreferences;
  createdAt: string;
  updatedAt: string;
  matchHistory: MatchHistoryEntry[];
}
