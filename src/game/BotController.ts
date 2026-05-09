import * as THREE from 'three';
import {
  BOT_AGGRESSION_RAMP_SECONDS,
  BOT_ATTACK_GRACE_SECONDS,
  canHoleSwallow,
  canObjectFit
} from './BalanceConfig';
import {
  BOT_DIFFICULTY_PROFILES,
  type BotDifficulty,
  type BotDifficultyProfile
} from './BotDifficulty';
import type { Player } from './Player';
import type { PlayerManager } from './PlayerManager';
import type { World } from './World';
import type { WorldObject } from './WorldObject';

type ObjectTargetClaims = Map<string, number>;

const STARTER_COLLECTION_SECONDS = 30;

export class BotController {
  private decisionCooldown = 0;
  private matchElapsedSeconds = 0;
  private wantsBoost = false;
  private movementThrottle = 1;
  private objectTarget: WorldObject | null = null;
  private readonly direction = new THREE.Vector3();
  private readonly profile: BotDifficultyProfile;

  constructor(private readonly bot: Player, difficulty: BotDifficulty = 'normal') {
    this.profile = BOT_DIFFICULTY_PROFILES[difficulty];
    this.pickWanderDirection();
  }

  getClaimedObjectTargetId(): string | null {
    return this.isValidObjectTarget(this.objectTarget) ? this.objectTarget.id : null;
  }

  update(deltaSeconds: number, world: World, playerManager: PlayerManager, objectTargetClaims: ObjectTargetClaims = new Map()): void {
    if (!this.bot.alive) {
      this.bot.velocity.set(0, 0, 0);
      this.clearObjectTarget();
      return;
    }

    this.matchElapsedSeconds += deltaSeconds;
    this.decisionCooldown -= deltaSeconds;
    if (this.decisionCooldown <= 0) {
      this.wantsBoost = this.decide(world, playerManager, objectTargetClaims);
      this.decisionCooldown = this.profile.reactionMin + Math.random() * this.profile.reactionJitter;
    }

    this.refreshObjectTargetSteering();
    this.bot.updateResources(deltaSeconds, this.wantsBoost);
    const speed = this.bot.getSpeed(this.bot.isBoosting) * this.movementThrottle;
    const moveDistance = speed * deltaSeconds;
    this.bot.position.x += this.direction.x * moveDistance;
    this.bot.position.z += this.direction.z * moveDistance;
    this.bot.velocity.set(this.direction.x * speed, 0, this.direction.z * speed);
    world.clampToArena(this.bot.position, this.bot.radius);
  }

  private decide(world: World, playerManager: PlayerManager, objectTargetClaims: ObjectTargetClaims): boolean {
    this.movementThrottle = 1;
    if (Math.random() < this.profile.mistakeChance) {
      this.clearObjectTarget();
      this.pickWanderDirection();
      return false;
    }

    const aggressionScale = this.attackAggressionScale();
    const danger = this.findDanger(playerManager);
    if (danger) {
      this.clearObjectTarget();
      this.direction.subVectors(this.bot.position, danger.position);
      this.normalizeDirection();
      return Math.random() < this.profile.boostWhenFleeing;
    }

    const prey = aggressionScale > 0 ? this.findPrey(playerManager, aggressionScale) : null;
    if (prey) {
      this.clearObjectTarget();
      this.direction.subVectors(prey.position, this.bot.position);
      this.normalizeDirection();
      return Math.random() < this.profile.boostWhenChasing * aggressionScale;
    }

    if (this.shouldKeepObjectTarget(this.objectTarget, objectTargetClaims)) {
      this.refreshObjectTargetSteering();
      return false;
    }

    const edible = this.findEdibleObject(world, objectTargetClaims);
    if (edible) {
      this.objectTarget = edible;
      this.refreshObjectTargetSteering();
      return false;
    }

    this.clearObjectTarget();
    if (Math.random() < this.profile.wanderChance) {
      this.pickWanderDirection();
    }
    return false;
  }

  private attackAggressionScale(): number {
    if (this.matchElapsedSeconds < BOT_ATTACK_GRACE_SECONDS) {
      return 0;
    }

    return THREE.MathUtils.clamp(
      (this.matchElapsedSeconds - BOT_ATTACK_GRACE_SECONDS) / BOT_AGGRESSION_RAMP_SECONDS,
      0,
      1
    );
  }

  private findDanger(playerManager: PlayerManager): Player | null {
    let closest: Player | null = null;
    let closestDistanceSq = Number.POSITIVE_INFINITY;

    for (const other of playerManager.alivePlayers()) {
      if (other.id === this.bot.id || other.radius < this.bot.radius * 1.32) {
        continue;
      }

      const distanceSq = this.bot.position.distanceToSquared(other.position);
      const dangerDistance = Math.max(12, other.radius * 5.2 * this.profile.dangerAwareness);
      if (distanceSq < dangerDistance * dangerDistance && distanceSq < closestDistanceSq) {
        closest = other;
        closestDistanceSq = distanceSq;
      }
    }

    return closest;
  }

  private findPrey(playerManager: PlayerManager, aggressionScale: number): Player | null {
    let closest: Player | null = null;
    let bestScore = Number.NEGATIVE_INFINITY;

    for (const other of playerManager.alivePlayers()) {
      if (
        other.id === this.bot.id ||
        other.isSpawnProtected(performance.now() / 1000) ||
        !canHoleSwallow(this.bot.radius, other.radius)
      ) {
        continue;
      }

      const distanceSq = this.bot.position.distanceToSquared(other.position);
      const chaseDistance = Math.max(10, this.bot.radius * 8.5 * this.profile.preyAwareness * aggressionScale);
      const score =
        other.score * 0.03 * aggressionScale +
        other.radius * 12 * this.profile.preyAggression * aggressionScale -
        Math.sqrt(distanceSq);
      if (distanceSq < chaseDistance * chaseDistance && score > bestScore) {
        closest = other;
        bestScore = score;
      }
    }

    return closest;
  }

  private findEdibleObject(world: World, objectTargetClaims: ObjectTargetClaims): WorldObject | null {
    const searchRadius = Math.max(18, this.bot.radius * 8 * this.profile.objectAwareness);
    let best: WorldObject | null = null;
    let bestScore = Number.NEGATIVE_INFINITY;
    const starterScale = this.starterCollectionScale();

    for (const object of world.queryObjects(this.bot.position, searchRadius)) {
      if (!object.active || !canObjectFit(this.bot.radius, object.effectiveBoundingRadius)) {
        continue;
      }
      if ((objectTargetClaims.get(object.id) ?? 0) > 0) {
        continue;
      }

      const distance = Math.max(0.1, this.bot.position.distanceTo(object.position));
      const fitRatio = object.effectiveBoundingRadius / Math.max(0.001, this.bot.radius);
      const starterPreference = THREE.MathUtils.clamp(1 - fitRatio / 0.82, -0.25, 1);
      const score =
        object.mass * (2.2 + this.profile.objectGreed) +
        object.score * 0.4 * this.profile.objectGreed -
        distance * this.profile.distanceDiscipline +
        starterScale * (starterPreference * 32 - distance * 0.42 - Math.sqrt(object.mass) * 0.7);
      if (score > bestScore) {
        best = object;
        bestScore = score;
      }
    }

    return best;
  }

  private shouldKeepObjectTarget(object: WorldObject | null, objectTargetClaims: ObjectTargetClaims): object is WorldObject {
    if (!this.isValidObjectTarget(object)) {
      return false;
    }

    const distance = this.bot.position.distanceTo(object.position);
    if (distance > Math.max(24, this.bot.radius * 10 * this.profile.objectAwareness)) {
      return false;
    }

    return (objectTargetClaims.get(object.id) ?? 0) <= 0;
  }

  private isValidObjectTarget(object: WorldObject | null): object is WorldObject {
    return Boolean(
      object &&
      object.active &&
      !object.swallowAnimation &&
      canObjectFit(this.bot.radius, object.effectiveBoundingRadius)
    );
  }

  private refreshObjectTargetSteering(): void {
    if (!this.isValidObjectTarget(this.objectTarget)) {
      this.clearObjectTarget();
      return;
    }

    const object = this.objectTarget;
    const toTarget = new THREE.Vector3(
      object.position.x - this.bot.position.x,
      0,
      object.position.z - this.bot.position.z
    );
    const distance = toTarget.length();
    const holdDistance = this.objectHoldDistance(object);
    if (distance <= holdDistance) {
      this.direction.set(0, 0, 0);
      this.movementThrottle = 0;
      this.wantsBoost = false;
      return;
    }

    this.direction.copy(toTarget.multiplyScalar(1 / Math.max(0.001, distance)));
    const approachDistance = Math.max(2.2, this.bot.radius * 2.4, object.effectiveBoundingRadius * 4.4);
    const progress = THREE.MathUtils.clamp((distance - holdDistance) / approachDistance, 0, 1);
    const smooth = progress * progress * (3 - 2 * progress);
    const starterScale = this.starterCollectionScale();
    const smallTargetScale = object.effectiveBoundingRadius <= this.bot.radius * 0.62 ? 0.78 : 1;
    const minThrottle = THREE.MathUtils.lerp(0.16, 0.24, 1 - starterScale);
    const maxThrottle = THREE.MathUtils.lerp(0.66, 0.94, 1 - starterScale);
    this.movementThrottle = THREE.MathUtils.clamp(
      THREE.MathUtils.lerp(minThrottle, maxThrottle, smooth) * smallTargetScale,
      0.12,
      1
    );
  }

  private objectHoldDistance(object: WorldObject): number {
    return Math.max(0.08, Math.min(this.bot.radius * 0.18, object.effectiveBoundingRadius * 0.42));
  }

  private starterCollectionScale(): number {
    return THREE.MathUtils.clamp(1 - this.matchElapsedSeconds / STARTER_COLLECTION_SECONDS, 0, 1);
  }

  private clearObjectTarget(resetThrottle = true): void {
    this.objectTarget = null;
    if (resetThrottle) {
      this.movementThrottle = 1;
    }
  }

  private pickWanderDirection(): void {
    const angle = Math.random() * Math.PI * 2;
    this.direction.set(Math.cos(angle), 0, Math.sin(angle));
  }

  private normalizeDirection(): void {
    this.direction.y = 0;
    if (this.direction.lengthSq() < 0.001) {
      this.pickWanderDirection();
      return;
    }

    this.direction.normalize();
    const jitter = (Math.random() - 0.5) * this.profile.directionJitter;
    this.direction.applyAxisAngle(new THREE.Vector3(0, 1, 0), jitter);
  }
}
