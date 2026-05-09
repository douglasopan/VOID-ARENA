import {
  BOOST_MULTIPLIER,
  MAGNET_PULL_STRENGTH,
  MIN_SPEED,
  POWERUP_RESPAWN_SECONDS,
  POWERUP_SETTINGS,
  START_SPEED
} from '../shared/constants';
import type { PowerUpType, WorldObjectKind } from '../shared/types';
import type { NaturalDisasterType } from '../game/NaturalDisasterSystem';
import prebuildEngineOverrides from './prebuildEngineOverrides.json';

export type EngineDisasterType = Exclude<NaturalDisasterType, 'clear'>;
export type ControlAction =
  | 'moveUp'
  | 'moveDown'
  | 'moveLeft'
  | 'moveRight'
  | 'boost'
  | 'dash'
  | 'power'
  | 'chat'
  | 'pause';

export const ENGINE_CONFIG_STORAGE_KEY = 'void-arena-engine-config';
export const ENGINE_CONFIG_PREBUILD_SIGNATURE_KEY = 'void-arena-engine-prebuild-signature';
export const ENGINE_CONFIG_EVENT = 'void-arena-engine-config-changed';

export const ALL_POWER_UP_TYPES: PowerUpType[] = ['magnet', 'shrink', 'haste', 'shield', 'stamina', 'mass', 'gust', 'overcharge', 'dash'];
export const CONTROL_ACTIONS: ControlAction[] = ['moveUp', 'moveDown', 'moveLeft', 'moveRight', 'boost', 'dash', 'power', 'chat', 'pause'];
export const DEFAULT_CONTROL_BINDINGS: Record<ControlAction, string[]> = {
  moveUp: ['KeyW', 'ArrowUp'],
  moveDown: ['KeyS', 'ArrowDown'],
  moveLeft: ['KeyA', 'ArrowLeft'],
  moveRight: ['KeyD', 'ArrowRight'],
  boost: ['ShiftLeft', 'ShiftRight'],
  dash: ['Space'],
  power: ['KeyE'],
  chat: ['Enter'],
  pause: ['Escape']
};

export const ALL_WORLD_OBJECT_KINDS: WorldObjectKind[] = [
  'crate',
  'post',
  'tree',
  'rock',
  'car',
  'truck',
  'bus',
  'emergency',
  'trailerTruck',
  'trafficLight',
  'building',
  'structure',
  'billboard',
  'screen',
  'bench',
  'hydrant',
  'trash',
  'pedestrian',
  'cone',
  'mailbox',
  'bike',
  'planter',
  'kiosk',
  'fountain',
  'statue'
];

export const ALL_ENGINE_DISASTER_TYPES: EngineDisasterType[] = [
  'rain',
  'thunderstorm',
  'earthquake',
  'meteorShower',
  'sandstorm'
];

export const DEFAULT_WORLD_OBJECT_SPAWN_HEIGHT_OFFSETS: Record<WorldObjectKind, number> = {
  crate: 0,
  post: 0,
  tree: 0,
  rock: 0.18,
  car: 0.14,
  truck: 0.08,
  bus: 0.08,
  emergency: 0.14,
  trailerTruck: 0.09,
  trafficLight: 0,
  building: 0,
  structure: 0,
  billboard: 0,
  screen: 0,
  bench: 0.14,
  hydrant: 0,
  trash: 0,
  pedestrian: 0,
  cone: 0,
  mailbox: 0,
  bike: 0.08,
  planter: 0,
  kiosk: 0,
  fountain: 0,
  statue: 0
};

export interface EnginePowerUpConfig {
  enabled: boolean;
  durationSeconds: number;
}

export interface EngineDisasterConfig {
  enabled: boolean;
  weight: number;
}

export interface EngineControlsConfig {
  mouseControlEnabled: boolean;
  bindings: Record<ControlAction, string[]>;
}

export interface EngineConfig {
  version: number;
  branding: {
    title: string;
    menuFont: string;
    textFont: string;
  };
  gameplay: {
    startSpeedMultiplier: number;
    minSpeedMultiplier: number;
    boostMultiplier: number;
    staminaDrainMultiplier: number;
    staminaRegenMultiplier: number;
    magnetStrengthMultiplier: number;
    objectContactSecondsMultiplier: number;
    rimSuctionMultiplier: number;
    swallowGravityMultiplier: number;
    objectMissForgiveness: number;
  };
  visual: {
    skyEffectsEnabled: boolean;
    lightingEffectsEnabled: boolean;
  };
  generation: {
    objectDensityMultiplier: number;
    trafficEnabled: boolean;
    pedestriansEnabled: boolean;
    adsEnabled: boolean;
    enabledObjectKinds: Record<WorldObjectKind, boolean>;
    spawnHeightOffsets: Record<WorldObjectKind, number>;
  };
  powerUps: Record<PowerUpType, EnginePowerUpConfig>;
  disasters: {
    enabled: boolean;
    firstDelayMultiplier: number;
    nextDelayMultiplier: number;
    events: Record<EngineDisasterType, EngineDisasterConfig>;
  };
  controls: EngineControlsConfig;
  audio: {
    menuMusic: string[];
    mapMusic: string[];
    uiHover: string;
    uiClick: string;
    playerDie: string;
    objectSfx: Partial<Record<WorldObjectKind, string[]>>;
  };
}

let cachedConfig: EngineConfig | null = null;

export function createDefaultEngineConfig(): EngineConfig {
  const defaults: EngineConfig = {
    version: 1,
    branding: {
      title: 'VOID ARENA',
      menuFont: 'Orbitron',
      textFont: 'Open Sans'
    },
    gameplay: {
      startSpeedMultiplier: 1,
      minSpeedMultiplier: 1,
      boostMultiplier: BOOST_MULTIPLIER,
      staminaDrainMultiplier: 1,
      staminaRegenMultiplier: 1,
      magnetStrengthMultiplier: 1,
      objectContactSecondsMultiplier: 1,
      rimSuctionMultiplier: 1,
      swallowGravityMultiplier: 1,
      objectMissForgiveness: 1
    },
    visual: {
      skyEffectsEnabled: true,
      lightingEffectsEnabled: true
    },
    generation: {
      objectDensityMultiplier: 1,
      trafficEnabled: true,
      pedestriansEnabled: true,
      adsEnabled: true,
      enabledObjectKinds: Object.fromEntries(ALL_WORLD_OBJECT_KINDS.map((kind) => [kind, true])) as Record<WorldObjectKind, boolean>,
      spawnHeightOffsets: { ...DEFAULT_WORLD_OBJECT_SPAWN_HEIGHT_OFFSETS }
    },
    powerUps: Object.fromEntries(
      ALL_POWER_UP_TYPES.map((type) => [
        type,
        {
          enabled: true,
          durationSeconds: POWERUP_SETTINGS[type].durationSeconds
        }
      ])
    ) as Record<PowerUpType, EnginePowerUpConfig>,
    disasters: {
      enabled: true,
      firstDelayMultiplier: 1,
      nextDelayMultiplier: 1,
      events: {
        rain: { enabled: true, weight: 30 },
        thunderstorm: { enabled: true, weight: 22 },
        earthquake: { enabled: true, weight: 6 },
        meteorShower: { enabled: true, weight: 20 },
        sandstorm: { enabled: true, weight: 22 }
      }
    },
    controls: {
      mouseControlEnabled: true,
      bindings: cloneControlBindings(DEFAULT_CONTROL_BINDINGS)
    },
    audio: {
      menuMusic: ['/audio/music/mainmenu1.ogg', '/audio/music/mainmenu2.ogg'],
      mapMusic: ['/audio/music/citymap1.ogg', '/audio/music/citymap2.ogg', '/audio/music/concrete_symphony.ogg'],
      uiHover: '/audio/ui/hover_button.ogg',
      uiClick: '/audio/ui/click_button.ogg',
      playerDie: '/audio/sfx/die_sound.ogg',
      objectSfx: {
        tree: ['/audio/sfx/tree_fall.ogg'],
        planter: ['/audio/sfx/tree_fall.ogg'],
        car: ['/audio/sfx/car_crash_fall.ogg', '/audio/sfx/car_horn_away_1.ogg', '/audio/sfx/car_horn_away_2.ogg'],
        truck: ['/audio/sfx/car_crash_fall.ogg', '/audio/sfx/car_horn_away_1.ogg', '/audio/sfx/car_horn_away_2.ogg'],
        bus: ['/audio/sfx/car_crash_fall.ogg', '/audio/sfx/car_horn_away_1.ogg', '/audio/sfx/car_horn_away_2.ogg'],
        emergency: ['/audio/sfx/car_crash_fall.ogg', '/audio/sfx/car_horn_away_1.ogg', '/audio/sfx/car_horn_away_2.ogg'],
        trailerTruck: ['/audio/sfx/car_crash_fall.ogg', '/audio/sfx/car_horn_away_1.ogg', '/audio/sfx/car_horn_away_2.ogg'],
        pedestrian: [
          '/audio/sfx/person_fall_man_1.ogg',
          '/audio/sfx/person_fall_man_2.ogg',
          '/audio/sfx/person_fall_man_3.ogg',
          '/audio/sfx/person_fall_man_4.ogg',
          '/audio/sfx/person_fall_man_5.ogg',
          '/audio/sfx/person_fall_woman_1.ogg',
          '/audio/sfx/person_fall_woman_2.ogg'
        ]
      }
    }
  };
  return mergeEngineConfig(defaults, prebuildEngineOverrides as unknown as Partial<EngineConfig>);
}

export function getEngineConfig(): EngineConfig {
  if (cachedConfig) {
    return cachedConfig;
  }

  cachedConfig = loadEngineConfig();
  return cachedConfig;
}

export function saveEngineConfig(config: EngineConfig): EngineConfig {
  const sanitized = sanitizeEngineConfig(config);
  cachedConfig = sanitized;
  localStorage.setItem(ENGINE_CONFIG_STORAGE_KEY, JSON.stringify(sanitized));
  localStorage.setItem(ENGINE_CONFIG_PREBUILD_SIGNATURE_KEY, prebuildConfigSignature());
  window.dispatchEvent(new CustomEvent(ENGINE_CONFIG_EVENT, { detail: sanitized }));
  return sanitized;
}

export function resetEngineConfig(): EngineConfig {
  const defaults = createDefaultEngineConfig();
  cachedConfig = defaults;
  localStorage.setItem(ENGINE_CONFIG_STORAGE_KEY, JSON.stringify(defaults));
  localStorage.setItem(ENGINE_CONFIG_PREBUILD_SIGNATURE_KEY, prebuildConfigSignature());
  window.dispatchEvent(new CustomEvent(ENGINE_CONFIG_EVENT, { detail: defaults }));
  return defaults;
}

export function subscribeEngineConfig(listener: (config: EngineConfig) => void): () => void {
  const handler = (event: Event): void => {
    listener((event as CustomEvent<EngineConfig>).detail ?? getEngineConfig());
  };
  window.addEventListener(ENGINE_CONFIG_EVENT, handler);
  return () => window.removeEventListener(ENGINE_CONFIG_EVENT, handler);
}

export function normalizeOggAudioPath(path: string): string {
  const trimmed = path.trim();
  if (!trimmed) {
    return '';
  }

  const lower = trimmed.toLowerCase();
  if (lower.endsWith('.mp3')) {
    return `${trimmed.slice(0, -4)}.ogg`;
  }
  if (lower.endsWith('.ogg')) {
    return trimmed;
  }
  return '';
}

export function splitAudioList(value: string): string[] {
  return value
    .split(/\r?\n|,/)
    .map(normalizeOggAudioPath)
    .filter(Boolean);
}

export function getPowerUpEngineSettings(type: PowerUpType): EnginePowerUpConfig {
  return getEngineConfig().powerUps[type] ?? {
    enabled: true,
    durationSeconds: POWERUP_SETTINGS[type].durationSeconds
  };
}

export function getEnabledPowerUpTypes(): PowerUpType[] {
  const config = getEngineConfig();
  return ALL_POWER_UP_TYPES.filter((type) => config.powerUps[type]?.enabled !== false);
}

export function isWorldObjectKindEnabled(kind: WorldObjectKind): boolean {
  const config = getEngineConfig();
  if (!config.generation.trafficEnabled && ['car', 'truck', 'bus', 'emergency', 'trailerTruck'].includes(kind)) {
    return false;
  }
  if (!config.generation.pedestriansEnabled && kind === 'pedestrian') {
    return false;
  }
  if (!config.generation.adsEnabled && (kind === 'billboard' || kind === 'screen')) {
    return false;
  }
  return config.generation.enabledObjectKinds[kind] !== false;
}

export function getWorldObjectSpawnHeightOffset(kind: WorldObjectKind): number {
  return getEngineConfig().generation.spawnHeightOffsets[kind] ?? DEFAULT_WORLD_OBJECT_SPAWN_HEIGHT_OFFSETS[kind] ?? 0;
}

export function getEnabledDisasterTypes(): EngineDisasterType[] {
  const disasters = getEngineConfig().disasters;
  if (!disasters.enabled) {
    return [];
  }
  return ALL_ENGINE_DISASTER_TYPES.filter((type) => disasters.events[type]?.enabled !== false && disasters.events[type]?.weight > 0);
}

export function weightedDisasterType(): EngineDisasterType | null {
  const disasters = getEngineConfig().disasters;
  const enabled = getEnabledDisasterTypes();
  const totalWeight = enabled.reduce((total, type) => total + Math.max(0, disasters.events[type]?.weight ?? 0), 0);
  if (totalWeight <= 0) {
    return null;
  }

  let roll = Math.random() * totalWeight;
  for (const type of enabled) {
    roll -= Math.max(0, disasters.events[type]?.weight ?? 0);
    if (roll <= 0) {
      return type;
    }
  }
  return enabled[enabled.length - 1] ?? null;
}

export function runtimeStartSpeed(): number {
  return START_SPEED * getEngineConfig().gameplay.startSpeedMultiplier;
}

export function runtimeMinSpeed(): number {
  return MIN_SPEED * getEngineConfig().gameplay.minSpeedMultiplier;
}

export function runtimePowerUpRespawnSeconds(): number {
  return POWERUP_RESPAWN_SECONDS;
}

function mergeEngineConfig(defaults: EngineConfig, input: Partial<EngineConfig>): EngineConfig {
  return {
    ...defaults,
    ...input,
    branding: { ...defaults.branding, ...input.branding },
    gameplay: { ...defaults.gameplay, ...input.gameplay },
    visual: { ...defaults.visual, ...input.visual },
    generation: {
      ...defaults.generation,
      ...input.generation,
      enabledObjectKinds: {
        ...defaults.generation.enabledObjectKinds,
        ...input.generation?.enabledObjectKinds
      },
      spawnHeightOffsets: {
        ...defaults.generation.spawnHeightOffsets,
        ...input.generation?.spawnHeightOffsets
      }
    },
    powerUps: {
      ...defaults.powerUps,
      ...input.powerUps
    },
    disasters: {
      ...defaults.disasters,
      ...input.disasters,
      events: {
        ...defaults.disasters.events,
        ...input.disasters?.events
      }
    },
    controls: {
      ...defaults.controls,
      ...input.controls,
      bindings: {
        ...defaults.controls.bindings,
        ...input.controls?.bindings
      }
    },
    audio: {
      ...defaults.audio,
      ...input.audio,
      objectSfx: {
        ...defaults.audio.objectSfx,
        ...input.audio?.objectSfx
      }
    }
  };
}

function loadEngineConfig(): EngineConfig {
  const defaults = createDefaultEngineConfig();
  try {
    const signature = prebuildConfigSignature();
    const storedSignature = localStorage.getItem(ENGINE_CONFIG_PREBUILD_SIGNATURE_KEY);
    const raw = localStorage.getItem(ENGINE_CONFIG_STORAGE_KEY);
    if (!raw || storedSignature !== signature) {
      localStorage.setItem(ENGINE_CONFIG_STORAGE_KEY, JSON.stringify(defaults));
      localStorage.setItem(ENGINE_CONFIG_PREBUILD_SIGNATURE_KEY, signature);
      return defaults;
    }
    return sanitizeEngineConfig(JSON.parse(raw) as Partial<EngineConfig>);
  } catch {
    return defaults;
  }
}

function sanitizeEngineConfig(input: Partial<EngineConfig>): EngineConfig {
  const defaults = createDefaultEngineConfig();
  const merged = mergeEngineConfig(defaults, input);

  merged.gameplay.startSpeedMultiplier = clamp(merged.gameplay.startSpeedMultiplier, 0.25, 4);
  merged.gameplay.minSpeedMultiplier = clamp(merged.gameplay.minSpeedMultiplier, 0.25, 4);
  merged.gameplay.boostMultiplier = clamp(merged.gameplay.boostMultiplier, 1, 3.6);
  merged.gameplay.staminaDrainMultiplier = clamp(merged.gameplay.staminaDrainMultiplier, 0.1, 4);
  merged.gameplay.staminaRegenMultiplier = clamp(merged.gameplay.staminaRegenMultiplier, 0.1, 5);
  merged.gameplay.magnetStrengthMultiplier = clamp(merged.gameplay.magnetStrengthMultiplier, 0, 4);
  merged.gameplay.objectContactSecondsMultiplier = clamp(merged.gameplay.objectContactSecondsMultiplier, 0.15, 5);
  merged.gameplay.rimSuctionMultiplier = clamp(merged.gameplay.rimSuctionMultiplier, 0, 4);
  merged.gameplay.swallowGravityMultiplier = clamp(merged.gameplay.swallowGravityMultiplier, 0.25, 4);
  merged.gameplay.objectMissForgiveness = clamp(merged.gameplay.objectMissForgiveness, 0.35, 2.4);
  merged.visual.skyEffectsEnabled = merged.visual.skyEffectsEnabled !== false;
  merged.visual.lightingEffectsEnabled = merged.visual.lightingEffectsEnabled !== false;
  merged.generation.objectDensityMultiplier = clamp(merged.generation.objectDensityMultiplier, 0.1, 2.5);
  merged.disasters.firstDelayMultiplier = clamp(merged.disasters.firstDelayMultiplier, 0.2, 6);
  merged.disasters.nextDelayMultiplier = clamp(merged.disasters.nextDelayMultiplier, 0.2, 8);

  for (const type of ALL_POWER_UP_TYPES) {
    const value = merged.powerUps[type] ?? defaults.powerUps[type];
    merged.powerUps[type] = {
      enabled: value.enabled !== false,
      durationSeconds: clamp(Number(value.durationSeconds), 0, 120)
    };
  }
  for (const kind of ALL_WORLD_OBJECT_KINDS) {
    merged.generation.enabledObjectKinds[kind] = merged.generation.enabledObjectKinds[kind] !== false;
    merged.generation.spawnHeightOffsets[kind] = clamp(Number(merged.generation.spawnHeightOffsets[kind]), -0.35, 1.5);
  }
  for (const type of ALL_ENGINE_DISASTER_TYPES) {
    const value = merged.disasters.events[type] ?? defaults.disasters.events[type];
    merged.disasters.events[type] = {
      enabled: value.enabled !== false,
      weight: clamp(Number(value.weight), 0, 100)
    };
  }

  merged.controls.mouseControlEnabled = merged.controls.mouseControlEnabled !== false;
  merged.controls.bindings = sanitizeControlBindings(merged.controls.bindings, defaults.controls.bindings);

  const prebuildAudio = (prebuildEngineOverrides as unknown as Partial<EngineConfig>).audio;
  merged.audio.menuMusic = mergeUniqueAudioPaths(merged.audio.menuMusic, prebuildAudio?.menuMusic);
  merged.audio.mapMusic = mergeUniqueAudioPaths(merged.audio.mapMusic, prebuildAudio?.mapMusic);
  merged.audio.menuMusic = merged.audio.menuMusic.map(normalizeOggAudioPath).filter(Boolean);
  merged.audio.mapMusic = merged.audio.mapMusic.map(normalizeOggAudioPath).filter(Boolean);
  merged.audio.uiHover = normalizeOggAudioPath(merged.audio.uiHover) || defaults.audio.uiHover;
  merged.audio.uiClick = normalizeOggAudioPath(merged.audio.uiClick) || defaults.audio.uiClick;
  merged.audio.playerDie = normalizeOggAudioPath(merged.audio.playerDie) || defaults.audio.playerDie;
  for (const [kind, assets] of Object.entries(merged.audio.objectSfx)) {
    merged.audio.objectSfx[kind as WorldObjectKind] = (assets ?? []).map(normalizeOggAudioPath).filter(Boolean);
  }

  if (merged.audio.menuMusic.length === 0) {
    merged.audio.menuMusic = defaults.audio.menuMusic;
  }
  if (merged.audio.mapMusic.length === 0) {
    merged.audio.mapMusic = defaults.audio.mapMusic;
  }

  return merged;
}

function mergeUniqueAudioPaths(primary: string[] = [], required: string[] = []): string[] {
  const paths: string[] = [];
  const seen = new Set<string>();

  for (const path of [...primary, ...required]) {
    const normalized = typeof path === 'string' ? normalizeOggAudioPath(path) : '';
    if (!normalized || seen.has(normalized)) {
      continue;
    }
    seen.add(normalized);
    paths.push(normalized);
  }

  return paths;
}

function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) {
    return min;
  }
  return Math.min(max, Math.max(min, value));
}

function cloneControlBindings(bindings: Record<ControlAction, string[]>): Record<ControlAction, string[]> {
  return Object.fromEntries(
    CONTROL_ACTIONS.map((action) => [action, [...(bindings[action] ?? [])]])
  ) as Record<ControlAction, string[]>;
}

function sanitizeControlBindings(
  bindings: Partial<Record<ControlAction, unknown>>,
  fallback: Record<ControlAction, string[]>
): Record<ControlAction, string[]> {
  const sanitized = cloneControlBindings(fallback);
  for (const action of CONTROL_ACTIONS) {
    const raw = bindings[action];
    const source = Array.isArray(raw)
      ? raw
      : typeof raw === 'string'
        ? [raw]
        : fallback[action];
    const values = source
      .map((value) => typeof value === 'string' ? value.trim() : '')
      .filter(Boolean);
    sanitized[action] = values.length > 0 ? [...new Set(values)].slice(0, 4) : [...fallback[action]];
  }
  return sanitized;
}

function prebuildConfigSignature(): string {
  const raw = JSON.stringify(prebuildEngineOverrides);
  let hash = 2166136261;
  for (let index = 0; index < raw.length; index += 1) {
    hash ^= raw.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `${raw.length}:${(hash >>> 0).toString(36)}`;
}
