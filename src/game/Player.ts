import * as THREE from 'three';
import {
  BOOST_STAMINA_DRAIN_PER_SECOND,
  BOOST_MULTIPLIER,
  MAX_STAMINA,
  PLAYER_RESPAWN_SECONDS,
  STAMINA_REGEN_DELAY_SECONDS,
  STAMINA_REGEN_PER_SECOND,
  START_RADIUS
} from '../shared/constants';
import type { PowerUpType } from '../shared/types';
import { calculateRadius, calculateSpeed } from './BalanceConfig';
import type { BotDifficulty } from './BotDifficulty';

export interface HoleSwallowAnimation {
  attackerId: string;
  elapsed: number;
  duration: number;
  startPosition: THREE.Vector3;
}

export class Player {
  readonly id: string;
  name: string;
  isBot: boolean;
  rimColor: string;
  radius = START_RADIUS;
  mass = 0;
  score = 0;
  swallowedObjects = 0;
  eliminations = 0;
  botDifficulty?: BotDifficulty;
  position: THREE.Vector3;
  velocity = new THREE.Vector3();
  alive = true;
  renderVisible = true;
  respawnAt = 0;
  visualY = 0;
  visualScale = 1;
  stamina = MAX_STAMINA;
  isBoosting = false;
  private staminaRegenDelay = 0;
  readonly activePowerUps = new Map<PowerUpType, number>();
  swallowAnimation: HoleSwallowAnimation | null = null;

  constructor(options: {
    id: string;
    name: string;
    isBot: boolean;
    rimColor: string;
    position: THREE.Vector3;
    botDifficulty?: BotDifficulty;
  }) {
    this.id = options.id;
    this.name = options.name;
    this.isBot = options.isBot;
    this.rimColor = options.rimColor;
    this.position = options.position.clone();
    this.botDifficulty = options.botDifficulty;
  }

  get speed(): number {
    return this.getSpeed(false);
  }

  getSpeed(boosting = false): number {
    let speed = calculateSpeed(this.radius);
    if (this.activePowerUps.has('haste')) {
      speed *= 1.32;
    }
    if (boosting && this.stamina > 0) {
      speed *= BOOST_MULTIPLIER;
    }
    return speed;
  }

  addMass(amount: number): void {
    this.mass += Math.max(0, amount);
    this.radius = calculateRadius(this.mass);
  }

  addScore(score: number): void {
    this.score += Math.max(0, Math.round(score));
  }

  addPowerUp(type: PowerUpType, durationSeconds: number, now: number): void {
    if (type === 'stamina') {
      this.stamina = MAX_STAMINA;
      return;
    }

    if (type === 'mass') {
      this.addMass(18);
      this.addScore(35);
      return;
    }

    this.activePowerUps.set(type, now + durationSeconds);
  }

  updateResources(deltaSeconds: number, wantsBoost: boolean): void {
    this.isBoosting = false;

    if (wantsBoost && this.stamina > 1 && this.alive) {
      this.isBoosting = true;
      this.stamina = Math.max(0, this.stamina - BOOST_STAMINA_DRAIN_PER_SECOND * deltaSeconds);
      this.staminaRegenDelay = STAMINA_REGEN_DELAY_SECONDS;
      return;
    }

    this.staminaRegenDelay = Math.max(0, this.staminaRegenDelay - deltaSeconds);
    if (this.staminaRegenDelay <= 0) {
      this.stamina = Math.min(MAX_STAMINA, this.stamina + STAMINA_REGEN_PER_SECOND * deltaSeconds);
    }
  }

  updatePowerUps(now: number): void {
    for (const [type, expiresAt] of this.activePowerUps) {
      if (now >= expiresAt) {
        this.activePowerUps.delete(type);
      }
    }
  }

  hasPowerUp(type: PowerUpType): boolean {
    return this.activePowerUps.has(type);
  }

  markSwallowed(attackerId: string, now: number): void {
    this.alive = false;
    this.renderVisible = true;
    this.respawnAt = now + PLAYER_RESPAWN_SECONDS;
    this.velocity.set(0, 0, 0);
    this.swallowAnimation = {
      attackerId,
      elapsed: 0,
      duration: 0.86,
      startPosition: this.position.clone()
    };
  }

  updateSwallowAnimation(deltaSeconds: number, attacker: Player | null): boolean {
    if (!this.swallowAnimation) {
      return false;
    }

    const animation = this.swallowAnimation;
    animation.elapsed += deltaSeconds;
    const t = Math.min(1, animation.elapsed / animation.duration);
    const eased = 1 - Math.pow(1 - t, 3);
    const target = attacker?.position ?? animation.startPosition;

    if (attacker) {
      const toCenter = new THREE.Vector3(target.x - this.position.x, 0, target.z - this.position.z);
      const distance = Math.max(0.001, toCenter.length());
      const proximity = THREE.MathUtils.clamp(1 - distance / Math.max(attacker.radius * 2.2, 3), 0, 1);
      toCenter.normalize();
      const suction = 30 + attacker.radius * 9 + proximity * 32;
      this.velocity.x += toCenter.x * suction * deltaSeconds;
      this.velocity.z += toCenter.z * suction * deltaSeconds;
      this.velocity.multiplyScalar(Math.max(0, 1 - deltaSeconds * 4.5));
      this.position.x += this.velocity.x * deltaSeconds;
      this.position.z += this.velocity.z * deltaSeconds;
    }

    const lock = Math.pow(t, 4);
    this.position.x = THREE.MathUtils.lerp(this.position.x, target.x, lock);
    this.position.z = THREE.MathUtils.lerp(this.position.z, target.z, lock);
    const fallDepth = 1.6 + this.radius * 0.42 + (attacker?.radius ?? this.radius) * 0.46;
    this.visualY = -fallDepth * (t * t) - Math.sin(t * Math.PI) * 0.22;
    this.visualScale = Math.max(0.1, 1 - eased * 0.88);

    if (t >= 1) {
      this.swallowAnimation = null;
      this.renderVisible = false;
      this.visualY = 0;
      this.visualScale = 1;
      return true;
    }

    return false;
  }

  respawn(position: THREE.Vector3): void {
    this.position.copy(position);
    this.velocity.set(0, 0, 0);
    this.alive = true;
    this.renderVisible = true;
    this.visualY = 0;
    this.visualScale = 1;
    this.swallowAnimation = null;
    this.radius = calculateRadius(this.mass);
    this.stamina = MAX_STAMINA;
    this.activePowerUps.clear();
  }
}
