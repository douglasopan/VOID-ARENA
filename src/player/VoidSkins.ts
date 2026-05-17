import type { MatchMode } from '../game/MatchMode';
import type { VoidSkinId } from '../shared/types';

export interface VoidSkinDefinition {
  id: VoidSkinId;
  name: string;
  rarity: 'starter' | 'rare' | 'epic' | 'legendary';
  accentColor: string;
  description: string;
  powerName: string;
  powerDescription: string;
  compatibleModes: Array<MatchMode | 'skin-power-arena'>;
}

export const DEFAULT_VOID_SKIN_ID: VoidSkinId = 'neon-core';

export const STARTER_VOID_SKINS: VoidSkinId[] = ['neon-core', 'classic-singularity'];

export const VOID_SKIN_DEFINITIONS: VoidSkinDefinition[] = [
  {
    id: 'neon-core',
    name: 'Neon Core',
    rarity: 'starter',
    accentColor: '#5eead4',
    description: 'A clean competitive void rim tuned for classic arena readability.',
    powerName: 'Stable Pull',
    powerDescription: 'Future skin-power modes can give this skin a smoother short-range object pull.',
    compatibleModes: ['skin-power-arena']
  },
  {
    id: 'classic-singularity',
    name: 'Classic Singularity',
    rarity: 'starter',
    accentColor: '#f8fafc',
    description: 'A restrained dark rim for players who want a minimal void signature.',
    powerName: 'Quiet Edge',
    powerDescription: 'Future skin-power modes can reduce visual noise during boost windows.',
    compatibleModes: ['skin-power-arena']
  },
  {
    id: 'aurora-rift',
    name: 'Aurora Rift',
    rarity: 'rare',
    accentColor: '#a78bfa',
    description: 'A luminous rim with shifting color bands for profile collectors.',
    powerName: 'Phase Wake',
    powerDescription: 'Future skin-power modes can leave a short slowing trail behind the void.',
    compatibleModes: ['skin-power-arena']
  },
  {
    id: 'solar-flare',
    name: 'Solar Flare',
    rarity: 'epic',
    accentColor: '#facc15',
    description: 'A hot glowing rim built for aggressive elimination-focused styles.',
    powerName: 'Heat Bite',
    powerDescription: 'Future skin-power modes can briefly weaken rival void size after direct contact.',
    compatibleModes: ['skin-power-arena']
  },
  {
    id: 'storm-pulse',
    name: 'Storm Pulse',
    rarity: 'legendary',
    accentColor: '#60a5fa',
    description: 'An electric rim for event-heavy arenas and volatile match rules.',
    powerName: 'Static Burst',
    powerDescription: 'Future skin-power modes can trigger a small directional burst after a dash.',
    compatibleModes: ['skin-power-arena']
  }
];

export function getVoidSkinDefinition(id: VoidSkinId): VoidSkinDefinition {
  return VOID_SKIN_DEFINITIONS.find((skin) => skin.id === id) ?? VOID_SKIN_DEFINITIONS[0];
}
