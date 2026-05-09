import type { Vec3Data, WorldObjectKind } from '../shared/types';
import registry from './prebuildAssetRegistry.json';

export interface PrebuildObjectModelAsset {
  id: string;
  label?: string;
  baseKind: WorldObjectKind;
  enabled?: boolean;
  role?: string;
  source: string;
  format: 'primitive' | 'glb' | 'gltf';
  scale: number;
  offsetY: number;
  rotationY: number;
  spawnHeightOffset: number;
  hitbox?: Vec3Data;
  previewColor?: string;
  lighting: {
    enabled: boolean;
    color: string;
    intensity: number;
    windowRows: number;
  };
}

const WORLD_OBJECT_KINDS = new Set<WorldObjectKind>([
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
]);

const modelCache = new Map<WorldObjectKind, PrebuildObjectModelAsset | null>();
const variantCache = new Map<string, PrebuildObjectModelAsset | null>();
const variantsByKindCache = new Map<WorldObjectKind, PrebuildObjectModelAsset[]>();

export function getPrebuildModelAsset(kind: WorldObjectKind): PrebuildObjectModelAsset | null {
  if (modelCache.has(kind)) {
    return modelCache.get(kind) ?? null;
  }

  const asset = normalizeObjectAsset(kind, registry.models?.[kind], kind);
  modelCache.set(kind, asset);
  return asset;
}

export function getCustomObjectVariantById(id: string | undefined): PrebuildObjectModelAsset | null {
  if (!id) {
    return null;
  }
  if (variantCache.has(id)) {
    return variantCache.get(id) ?? null;
  }

  const raw = registry.customObjects?.find((item) => item?.id === id);
  const asset = raw ? normalizeObjectAsset(raw.baseKind, raw, raw.id, raw.label, raw.enabled !== false, raw.role) : null;
  variantCache.set(id, asset);
  return asset;
}

export function getEnabledCustomObjectVariantsForKind(kind: WorldObjectKind): PrebuildObjectModelAsset[] {
  if (variantsByKindCache.has(kind)) {
    return variantsByKindCache.get(kind) ?? [];
  }

  const variants = (registry.customObjects ?? [])
    .map((item) => normalizeObjectAsset(item?.baseKind, item, item?.id, item?.label, item?.enabled !== false, item?.role))
    .filter((item): item is PrebuildObjectModelAsset => Boolean(item && item.enabled !== false && item.baseKind === kind));
  variantsByKindCache.set(kind, variants);
  return variants;
}

function normalizeObjectAsset(
  rawKind: unknown,
  rawAsset: unknown,
  id: unknown,
  label?: unknown,
  enabled = true,
  role?: unknown
): PrebuildObjectModelAsset | null {
  if (!rawAsset || typeof rawAsset !== 'object' || !WORLD_OBJECT_KINDS.has(rawKind as WorldObjectKind)) {
    return null;
  }

  const asset = rawAsset as Record<string, unknown>;
  const baseKind = rawKind as WorldObjectKind;
  const source = stringValue(asset.source);
  const format = source.toLowerCase().endsWith('.gltf')
    ? 'gltf'
    : source.toLowerCase().endsWith('.glb')
      ? 'glb'
      : asset.format === 'gltf' || asset.format === 'glb'
        ? asset.format
        : 'primitive';
  const hitbox = asset.hitbox && typeof asset.hitbox === 'object'
    ? {
        x: finitePositive((asset.hitbox as Record<string, unknown>).x, 0),
        y: finitePositive((asset.hitbox as Record<string, unknown>).y, 0),
        z: finitePositive((asset.hitbox as Record<string, unknown>).z, 0)
      }
    : undefined;

  return {
    id: stringValue(id || baseKind),
    label: stringValue(label),
    baseKind,
    enabled,
    role: stringValue(role),
    source,
    format,
    scale: finitePositive(asset.scale, 1),
    offsetY: finiteNumber(asset.offsetY, 0),
    rotationY: finiteNumber(asset.rotationY, 0),
    spawnHeightOffset: finiteNumber(asset.spawnHeightOffset, 0),
    hitbox: hitbox && hitbox.x > 0 && hitbox.y > 0 && hitbox.z > 0 ? hitbox : undefined,
    previewColor: stringValue(asset.previewColor),
    lighting: normalizeLighting(asset.lighting)
  };
}

function normalizeLighting(value: unknown): PrebuildObjectModelAsset['lighting'] {
  const lighting = value && typeof value === 'object' ? value as Record<string, unknown> : {};
  return {
    enabled: lighting.enabled !== false,
    color: stringValue(lighting.color) || '#ffe6a7',
    intensity: Math.min(2.5, Math.max(0, finiteNumber(lighting.intensity, 1))),
    windowRows: Math.max(0, Math.min(32, Math.round(finiteNumber(lighting.windowRows, 0))))
  };
}

function stringValue(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

function finiteNumber(value: unknown, fallback: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function finitePositive(value: unknown, fallback: number): number {
  const parsed = finiteNumber(value, fallback);
  return parsed > 0 ? parsed : fallback;
}
