export const GAME_VERSION = '0.1.0-codex-prototype';

export const MATCH_DURATION_SECONDS = 180;
export const START_RADIUS = 1.0;
export const START_SPEED = 8.0;
export const MIN_SPEED = 4.0;
export const GROWTH_PER_MASS = 0.13;
export const OBJECT_FIT_RATIO = 1.08;
export const HOLE_SWALLOW_RATIO = 1.15;
export const PLAYER_RESPAWN_SECONDS = 3.5;
export const MAX_STAMINA = 100;
export const BOOST_MULTIPLIER = 1.7;
export const BOOST_STAMINA_DRAIN_PER_SECOND = 36;
export const STAMINA_REGEN_PER_SECOND = 22;
export const STAMINA_REGEN_DELAY_SECONDS = 0.75;
export const MAGNET_PULL_STRENGTH = 22;
export const POWERUP_RESPAWN_SECONDS = 18;
export const ARENA_EDGE_OVERHANG_RATIO = 0.1;
export const ARENA_CORNER_CUT_RATIO = 0.12;
export const ARENA_MIN_CORNER_CUT = 7;

export const MAP_SIZE_SETTINGS = {
  small: {
    label: 'Small',
    halfExtent: 48,
    objectCount: 190,
    blockSize: 24,
    roadWidth: 6,
    spawnClearRadius: 13
  },
  medium: {
    label: 'Medium',
    halfExtent: 78,
    objectCount: 430,
    blockSize: 28,
    roadWidth: 7,
    spawnClearRadius: 15
  },
  large: {
    label: 'Large',
    halfExtent: 150,
    objectCount: 980,
    blockSize: 34,
    roadWidth: 8,
    spawnClearRadius: 18
  },
  huge: {
    label: 'Huge',
    halfExtent: 235,
    objectCount: 1680,
    blockSize: 42,
    roadWidth: 9,
    spawnClearRadius: 22
  }
} as const;

export const BOT_NAMES = [
  'Bot Nova',
  'Bot Byte',
  'Bot Orbit',
  'Bot Flux',
  'Bot Vortex',
  'Bot Echo',
  'Bot Titan',
  'Bot Pixel',
  'Bot Quasar',
  'Bot Cinder',
  'Bot Ion',
  'Bot Zenith'
];

export const RIM_COLORS = [
  '#5eead4',
  '#f6c453',
  '#fb7185',
  '#91e88c',
  '#60a5fa',
  '#f97316',
  '#d8b4fe',
  '#f9a8d4',
  '#a3e635',
  '#facc15'
];

export const HOLE_RIM_STYLE_OPTIONS = [
  { value: 'neon', label: 'Neon' },
  { value: 'classic', label: 'Classic' },
  { value: 'double', label: 'Double' },
  { value: 'clean', label: 'Clean' }
] as const;

export const LANGUAGE_OPTIONS = [
  { value: 'en', label: 'English', flag: '🇺🇸', short: 'EN' },
  { value: 'es', label: 'Español', flag: '🇪🇸', short: 'ES' },
  { value: 'pt', label: 'Português', flag: '🇧🇷', short: 'PT' },
  { value: 'fr', label: 'Français', flag: '🇫🇷', short: 'FR' },
  { value: 'de', label: 'Deutsch', flag: '🇩🇪', short: 'DE' },
  { value: 'ru', label: 'Русский', flag: '🇷🇺', short: 'RU' },
  { value: 'ja', label: '日本語', flag: '🇯🇵', short: 'JA' },
  { value: 'zh', label: '中文', flag: '🇨🇳', short: 'ZH' }
] as const;

export const POWERUP_SETTINGS = {
  magnet: {
    label: 'Magnet Field',
    color: '#5eead4',
    durationSeconds: 9
  },
  shrink: {
    label: 'Shrink Pulse',
    color: '#fb7185',
    durationSeconds: 8
  },
  haste: {
    label: 'Overdrive',
    color: '#f6c453',
    durationSeconds: 7
  },
  shield: {
    label: 'Void Shield',
    color: '#60a5fa',
    durationSeconds: 8
  },
  stamina: {
    label: 'Stamina Cell',
    color: '#91e88c',
    durationSeconds: 0
  },
  mass: {
    label: 'Mass Core',
    color: '#d8b4fe',
    durationSeconds: 0
  }
} as const;
