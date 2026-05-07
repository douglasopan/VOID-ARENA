import * as THREE from 'three';
import { canHoleSwallow, canObjectFit } from './BalanceConfig';
import {
  BOT_DIFFICULTY_PROFILES,
  type BotDifficulty,
  type BotDifficultyProfile
} from './BotDifficulty';
import type { Player } from './Player';
import type { PlayerManager } from './PlayerManager';
import type { World } from './World';
import type { WorldObject } from './WorldObject';

export class BotController {
  private decisionCooldown = 0;
  private wantsBoost = false;
  private readonly direction = new THREE.Vector3();
  private readonly profile: BotDifficultyProfile;

  constructor(private readonly bot: Player, difficulty: BotDifficulty = 'normal') {
    this.profile = BOT_DIFFICULTY_PROFILES[difficulty];
    this.pickWanderDirection();
  }

  update(deltaSeconds: number, world: World, playerManager: PlayerManager): void {
    if (!this.bot.alive) {
      return;
    }

    this.decisionCooldown -= deltaSeconds;
    if (this.decisionCooldown <= 0) {
      this.wantsBoost = this.decide(world, playerManager);
      this.decisionCooldown = this.profile.reactionMin + Math.random() * this.profile.reactionJitter;
    }

    this.bot.updateResources(deltaSeconds, this.wantsBoost);
    const moveDistance = this.bot.getSpeed(this.bot.isBoosting) * deltaSeconds;
    this.bot.position.x += this.direction.x * moveDistance;
    this.bot.position.z += this.direction.z * moveDistance;
    world.clampToArena(this.bot.position, this.bot.radius);
  }

  private decide(world: World, playerManager: PlayerManager): boolean {
    if (Math.random() < this.profile.mistakeChance) {
      this.pickWanderDirection();
      return false;
    }

    const danger = this.findDanger(playerManager);
    if (danger) {
      this.direction.subVectors(this.bot.position, danger.position);
      this.normalizeDirection();
      return Math.random() < this.profile.boostWhenFleeing;
    }

    const prey = this.findPrey(playerManager);
    if (prey) {
      this.direction.subVectors(prey.position, this.bot.position);
      this.normalizeDirection();
      return Math.random() < this.profile.boostWhenChasing;
    }

    const edible = this.findEdibleObject(world);
    if (edible) {
      this.direction.subVectors(edible.position, this.bot.position);
      this.normalizeDirection();
      return false;
    }

    if (Math.random() < this.profile.wanderChance) {
      this.pickWanderDirection();
    }
    return false;
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

  private findPrey(playerManager: PlayerManager): Player | null {
    let closest: Player | null = null;
    let bestScore = Number.NEGATIVE_INFINITY;

    for (const other of playerManager.alivePlayers()) {
      if (other.id === this.bot.id || !canHoleSwallow(this.bot.radius, other.radius)) {
        continue;
      }

      const distanceSq = this.bot.position.distanceToSquared(other.position);
      const chaseDistance = Math.max(16, this.bot.radius * 8.5 * this.profile.preyAwareness);
      const score = other.score * 0.03 + other.radius * 12 * this.profile.preyAggression - Math.sqrt(distanceSq);
      if (distanceSq < chaseDistance * chaseDistance && score > bestScore) {
        closest = other;
        bestScore = score;
      }
    }

    return closest;
  }

  private findEdibleObject(world: World): WorldObject | null {
    const searchRadius = Math.max(18, this.bot.radius * 8 * this.profile.objectAwareness);
    let best: WorldObject | null = null;
    let bestScore = Number.NEGATIVE_INFINITY;

    for (const object of world.queryObjects(this.bot.position, searchRadius)) {
      if (!object.active || !canObjectFit(this.bot.radius, object.effectiveBoundingRadius)) {
        continue;
      }

      const distance = Math.max(0.1, this.bot.position.distanceTo(object.position));
      const score =
        object.mass * (2.2 + this.profile.objectGreed) +
        object.score * 0.4 * this.profile.objectGreed -
        distance * this.profile.distanceDiscipline;
      if (score > bestScore) {
        best = object;
        bestScore = score;
      }
    }

    return best;
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
