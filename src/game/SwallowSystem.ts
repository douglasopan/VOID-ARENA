import * as THREE from 'three';
import { getEngineConfig } from '../admin/EngineConfig';
import type { MatchConfig } from './MatchConfig';
import { MatchMode } from './MatchMode';
import type { Player } from './Player';
import type { PlayerManager } from './PlayerManager';
import { BOT_ATTACK_GRACE_SECONDS, canHoleSwallow, canObjectFit } from './BalanceConfig';
import type { World } from './World';
import type { WorldObject } from './WorldObject';

export type SwallowEvent =
  | {
      type: 'objectSwallowStarted';
      player: Player;
      object: WorldObject;
      holeCenter: THREE.Vector3;
      holeRadius: number;
      playerVelocity: THREE.Vector3;
      insideFraction: number;
    }
  | { type: 'objectSwallowed'; player: Player; object: WorldObject }
  | { type: 'holeSwallowed'; attacker: Player; victim: Player }
  | { type: 'holeSwallowCompleted'; attacker: Player | null; victim: Player };

export class SwallowSystem {
  private matchStartedAt: number | null = null;

  constructor(
    private readonly world: World,
    private readonly playerManager: PlayerManager,
    private readonly config: MatchConfig,
    private readonly localPlayerId?: string
  ) {}

  update(deltaSeconds: number, now: number): SwallowEvent[] {
    this.matchStartedAt ??= now;
    const events: SwallowEvent[] = [];
    this.world.rebuildObjectGrid();
    this.tryStartObjectSwallows(deltaSeconds, events);
    this.tryStartHoleSwallows(now, events);

    const completedObjects = this.world.updateSwallowing(deltaSeconds, this.playerManager);
    for (const completed of completedObjects) {
      const player = this.playerManager.get(completed.targetPlayerId);
      if (!player || !player.renderVisible) {
        completed.object.scheduleRespawn(now);
        continue;
      }

      if (this.config.multiplayer && player.id !== this.localPlayerId) {
        continue;
      }

      player.addMass(completed.object.mass);
      player.addScore(completed.object.score);
      player.swallowedObjects += 1;
      if (this.config.itemRespawnEnabled) {
        completed.object.scheduleRespawn(now);
      }
      events.push({ type: 'objectSwallowed', player, object: completed.object });
    }

    for (const player of this.playerManager.all()) {
      if (!player.swallowAnimation) {
        continue;
      }

      const attacker = this.playerManager.get(player.swallowAnimation.attackerId) ?? null;
      const completed = player.updateSwallowAnimation(deltaSeconds, attacker);
      if (completed) {
        events.push({ type: 'holeSwallowCompleted', attacker, victim: player });
      }
    }

    return events;
  }

  private tryStartObjectSwallows(deltaSeconds: number, events: SwallowEvent[]): void {
    const contactedObjects = new Set<string>();

    for (const player of this.playerManager.alivePlayers()) {
      if (this.config.multiplayer && player.id !== this.localPlayerId) {
        continue;
      }
      const candidates = this.world.queryObjects(player.position, Math.max(4, player.radius * 1.6 + 8));

      for (const object of candidates) {
        if (!object.active) {
          continue;
        }

        const dx = object.position.x - player.position.x;
        const dz = object.position.z - player.position.z;
        const distance = Math.hypot(dx, dz);
        const objectRadius = object.effectiveBoundingRadius;
        const rimDistance = this.objectHoleRimDistance(player.radius, objectRadius);

        if (distance > rimDistance || object.swallowAnimation) {
          continue;
        }

        contactedObjects.add(object.id);
        const physicallyFits = this.canObjectPhysicallyEnterHole(player.radius, objectRadius);
        const insideFraction = this.objectInsideHoleFraction(player.radius, objectRadius, distance);
        if (physicallyFits && insideFraction >= this.requiredObjectInsideFraction(object)) {
          const contactSeconds = object.recordSwallowContact(player.id, deltaSeconds);
          const requiredContactSeconds = this.requiredObjectSwallowContactSeconds(
            player,
            object,
            objectRadius,
            distance,
            insideFraction
          );
          if (contactSeconds >= requiredContactSeconds) {
            const fallOptions = {
              holeCenter: player.position,
              holeRadius: player.radius,
              playerVelocity: player.velocity,
              insideFraction
            };
            object.startSwallow(player.id, fallOptions);
            events.push({
              type: 'objectSwallowStarted',
              player,
              object,
              holeCenter: player.position.clone(),
              holeRadius: player.radius,
              playerVelocity: player.velocity.clone(),
              insideFraction
            });
          }
          continue;
        }

        object.resetSwallowContact();
        this.applyHoleRimContact(player, object, distance, objectRadius, rimDistance, insideFraction, physicallyFits, deltaSeconds);
      }
    }

    for (const object of this.world.objects) {
      if (object.hasSwallowContact && !contactedObjects.has(object.id)) {
        object.resetSwallowContact();
      }
    }
  }

  private canObjectPhysicallyEnterHole(holeRadius: number, objectRadius: number): boolean {
    return canObjectFit(holeRadius, objectRadius) && objectRadius <= holeRadius * 0.98;
  }

  private objectHoleEntryDistance(holeRadius: number, objectRadius: number): number {
    const rimTolerance = Math.min(0.18, Math.max(0.035, objectRadius * 0.045));
    return Math.max(0.1, holeRadius - objectRadius + rimTolerance);
  }

  private objectHoleRimDistance(holeRadius: number, objectRadius: number): number {
    return Math.max(holeRadius + objectRadius * 0.55, holeRadius * 1.04);
  }

  private requiredObjectSwallowContactSeconds(
    player: Player,
    object: WorldObject,
    objectRadius: number,
    distance: number,
    insideFraction: number
  ): number {
    const tightFit = Math.min(1, objectRadius / Math.max(0.001, player.radius));
    const coveragePenalty = THREE.MathUtils.clamp(1 - insideFraction, 0, 1);
    const objectSpeed = Math.max(
      Math.abs(object.routeVelocity || object.routeSpeed || 0),
      Math.hypot(object.physicsVelocity.x, object.physicsVelocity.z)
    );
    const relativeSpeedPressure = Math.max(objectSpeed, player.getSpeed(player.isBoosting) * 0.26);
    const speedPenalty = Math.min(1, Math.max(0, (relativeSpeedPressure - 3.2) / 9.5));
    const centerPenalty = Math.min(1, distance / Math.max(0.1, player.radius));
    return (0.05 + tightFit * 0.15 + coveragePenalty * 0.2 + centerPenalty * 0.06 + speedPenalty * 0.12) * getEngineConfig().gameplay.objectContactSecondsMultiplier;
  }

  private applyHoleRimContact(
    player: Player,
    object: WorldObject,
    distance: number,
    objectRadius: number,
    rimDistance: number,
    insideFraction: number,
    physicallyFits: boolean,
    deltaSeconds: number
  ): void {
    const canUseSpecialPush = false;
    const canUseNaturalRimPush = false;
    if (distance <= 0.001 || (!canUseNaturalRimPush && !canUseSpecialPush)) {
      return;
    }

    const overlapPressure = Math.min(1, Math.max(0, (rimDistance - distance) / Math.max(0.1, objectRadius * 0.55)));
    if (overlapPressure <= 0.001) {
      return;
    }

    const away = new THREE.Vector3(
      (object.position.x - player.position.x) / distance,
      0,
      (object.position.z - player.position.z) / distance
    );

    const playerVelocity = player.velocity.clone();
    playerVelocity.y = 0;
    const playerSpeed = playerVelocity.length();
    if (playerSpeed <= 0.05) {
      return;
    }

    const movingIntoObject = playerVelocity.dot(away) > 0.05;
    if (!movingIntoObject) {
      return;
    }

    const moveDirection = playerVelocity.normalize();
    const massDamping = 1 / Math.max(1, Math.sqrt(object.mass) * 0.26);
    const timeScale = Math.min(1.6, Math.max(0.35, deltaSeconds * 60));
    const glancingPenalty = canUseSpecialPush ? 1.35 : 0.62 + Math.min(0.28, insideFraction * 0.3);
    const impact = (playerSpeed * 0.18 + player.radius * 0.34) * overlapPressure * glancingPenalty * massDamping * timeScale;
    if (impact <= 0.001) {
      return;
    }

    object.position.x += moveDirection.x * Math.min(0.08, impact * 0.018);
    object.position.z += moveDirection.z * Math.min(0.08, impact * 0.018);
    const linear = moveDirection.multiplyScalar(impact);
    const angularScale = (0.1 + Math.min(0.18, objectRadius / Math.max(0.1, player.radius) * 0.08)) * impact;
    const angular = new THREE.Vector3(linear.z * angularScale, 0, -linear.x * angularScale);
    const topple =
      overlapPressure > 0.32 &&
      (object.category === 'traffic' ||
        object.category === 'pedestrian' ||
        object.kind === 'post' ||
        object.kind === 'trafficLight' ||
        object.size.y > Math.max(object.size.x, object.size.z) * 1.35);

    object.applyPhysicsImpulse({
      linear,
      angular,
      topple
    });
  }

  private requiredObjectInsideFraction(object: WorldObject): number {
    const massPenalty = THREE.MathUtils.clamp((Math.sqrt(object.mass) - 3) * 0.012, 0, 0.1);
    const tallPenalty = object.size.y > Math.max(object.size.x, object.size.z) * 1.5 ? 0.04 : 0;
    const categoryPenalty =
      object.category === 'traffic'
        ? 0.16
        : object.kind === 'tree' || object.kind === 'planter'
          ? 0.14
          : object.kind === 'bike'
            ? 0.1
            : object.category === 'nature'
              ? 0.08
              : 0;
    return THREE.MathUtils.clamp(0.6 + massPenalty + tallPenalty + categoryPenalty, 0.6, 0.86);
  }

  private minimumRimPushInsideFraction(object: WorldObject): number {
    return Math.max(0.18, this.requiredObjectInsideFraction(object) * 0.42);
  }

  private objectInsideHoleFraction(holeRadius: number, objectRadius: number, distance: number): number {
    const r = Math.max(0.001, objectRadius);
    const R = Math.max(0.001, holeRadius);
    const d = Math.max(0, distance);

    if (d <= Math.abs(R - r)) {
      return R >= r ? 1 : (R * R) / (r * r);
    }
    if (d >= R + r) {
      return 0;
    }

    const objectTerm = (d * d + r * r - R * R) / Math.max(0.001, 2 * d * r);
    const holeTerm = (d * d + R * R - r * r) / Math.max(0.001, 2 * d * R);
    const area =
      r * r * Math.acos(THREE.MathUtils.clamp(objectTerm, -1, 1)) +
      R * R * Math.acos(THREE.MathUtils.clamp(holeTerm, -1, 1)) -
      0.5 * Math.sqrt(Math.max(0, (-d + r + R) * (d + r - R) * (d - r + R) * (d + r + R)));

    return THREE.MathUtils.clamp(area / (Math.PI * r * r), 0, 1);
  }

  private tryStartHoleSwallows(now: number, events: SwallowEvent[]): void {
    const players = this.playerManager.alivePlayers();

    for (const attacker of players) {
      if (!attacker.alive) {
        continue;
      }
      if (this.config.multiplayer && attacker.id !== this.localPlayerId) {
        continue;
      }

      for (const victim of players) {
        if (
          attacker.id === victim.id ||
          !victim.alive ||
          victim.hasPowerUp('shield') ||
          victim.isSpawnProtected(now) ||
          this.isBotAttackGraceActive(attacker, now) ||
          !canHoleSwallow(attacker.radius, victim.radius)
        ) {
          continue;
        }

        const dx = victim.position.x - attacker.position.x;
        const dz = victim.position.z - attacker.position.z;
        const swallowDistance = Math.max(
          1.15,
          attacker.radius * 0.98 - victim.radius * 0.12
        );
        if (dx * dx + dz * dz > swallowDistance * swallowDistance) {
          continue;
        }

        victim.markSwallowed(attacker.id, now);
        attacker.addMass(Math.max(6, victim.mass * 0.28 + victim.radius * 5));
        attacker.addScore(150 + victim.score * 0.2 + victim.radius * 45);
        attacker.eliminations += 1;
        events.push({ type: 'holeSwallowed', attacker, victim });

        if (this.config.matchMode === MatchMode.LastHoleStanding) {
          victim.respawnAt = Number.POSITIVE_INFINITY;
        }
      }
    }
  }

  private isBotAttackGraceActive(attacker: Player, now: number): boolean {
    if (!attacker.isBot || this.matchStartedAt === null) {
      return false;
    }

    return now - this.matchStartedAt < BOT_ATTACK_GRACE_SECONDS;
  }
}
