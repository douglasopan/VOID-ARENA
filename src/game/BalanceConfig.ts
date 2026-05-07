import {
  GROWTH_PER_MASS,
  HOLE_SWALLOW_RATIO,
  MIN_SPEED,
  OBJECT_FIT_RATIO,
  START_RADIUS,
  START_SPEED
} from '../shared/constants';

export function calculateRadius(totalMass: number): number {
  return START_RADIUS + Math.sqrt(Math.max(0, totalMass)) * GROWTH_PER_MASS;
}

export function calculateSpeed(radius: number): number {
  const growthBonus = Math.max(0, radius - START_RADIUS) * 0.72;
  return Math.max(MIN_SPEED, START_SPEED + Math.min(7.5, growthBonus));
}

export function canObjectFit(holeRadius: number, objectBoundingRadius: number): boolean {
  return objectBoundingRadius <= holeRadius * OBJECT_FIT_RATIO;
}

export function canHoleSwallow(attackerRadius: number, victimRadius: number): boolean {
  return attackerRadius >= victimRadius * HOLE_SWALLOW_RATIO && victimRadius <= attackerRadius * OBJECT_FIT_RATIO;
}
