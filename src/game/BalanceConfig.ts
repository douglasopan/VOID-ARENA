import {
  GROWTH_PER_MASS,
  HOLE_SWALLOW_RATIO,
  OBJECT_FIT_RATIO,
  START_RADIUS
} from '../shared/constants';
import { runtimeMinSpeed, runtimeStartSpeed } from '../admin/EngineConfig';

export const BOT_ATTACK_GRACE_SECONDS = 12;
export const BOT_AGGRESSION_RAMP_SECONDS = 10;

export function calculateRadius(totalMass: number): number {
  return START_RADIUS + Math.sqrt(Math.max(0, totalMass)) * GROWTH_PER_MASS;
}

export function calculateSpeed(radius: number): number {
  const growth = Math.max(0, radius - START_RADIUS);
  const massDrag = 1 / (1 + growth * 0.16);
  const heavyDrag = Math.min(2.1, growth * 0.055);
  return Math.max(runtimeMinSpeed(), runtimeStartSpeed() * massDrag - heavyDrag);
}

export function canObjectFit(holeRadius: number, objectBoundingRadius: number): boolean {
  return objectBoundingRadius <= holeRadius * OBJECT_FIT_RATIO;
}

export function canHoleSwallow(attackerRadius: number, victimRadius: number): boolean {
  return attackerRadius >= victimRadius * HOLE_SWALLOW_RATIO && victimRadius <= attackerRadius * OBJECT_FIT_RATIO;
}
