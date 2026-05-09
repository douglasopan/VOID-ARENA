import * as THREE from 'three';
import {
  ARENA_CORNER_CUT_RATIO,
  ARENA_EDGE_OVERHANG_RATIO,
  ARENA_MIN_CORNER_CUT
} from '../shared/constants';
import { getEnabledPowerUpTypes } from '../admin/EngineConfig';
import type { MapData } from '../shared/types';
import type { PedestrianPath, PowerUpType, RoutePoint, TrafficRoute, TrafficSignalDefinition } from '../shared/types';
import { PlayerManager } from './PlayerManager';
import { PowerUp } from './PowerUp';
import { SpatialGrid } from './SpatialGrid';
import { trafficSignalState } from './TrafficSignalSystem';
import { WorldObject } from './WorldObject';

export interface CompletedObjectSwallow {
  object: WorldObject;
  targetPlayerId: string;
}

interface RouteMetrics {
  segmentLengths: number[];
  totalLength: number;
}

export class World {
  readonly halfExtent: number;
  readonly objects: WorldObject[];
  readonly powerUps: PowerUp[];
  private readonly grid = new SpatialGrid<WorldObject>(12);
  private readonly collisionGrid = new SpatialGrid<WorldObject>(10);
  private readonly routesById = new Map<string, TrafficRoute>();
  private readonly routeMetrics = new Map<string, RouteMetrics>();
  private readonly signalsByRoute = new Map<string, TrafficSignalDefinition[]>();
  private readonly powerUpTypes: PowerUpType[] = getEnabledPowerUpTypes();
  private trafficElapsedSeconds = 0;
  private lastPowerUpRespawnType: PowerUpType | null = null;

  constructor(readonly mapData: MapData) {
    this.halfExtent = mapData.halfExtent;
    this.objects = mapData.objects.map((definition) => new WorldObject(definition));
    this.powerUps = mapData.powerUps.map((definition) => new PowerUp(definition));
    for (const route of mapData.trafficRoutes) {
      this.routesById.set(route.id, route);
      this.routeMetrics.set(route.id, this.createRouteMetrics(route));
    }
    for (const signal of mapData.trafficSignals) {
      const signals = this.signalsByRoute.get(signal.routeId) ?? [];
      signals.push(signal);
      this.signalsByRoute.set(signal.routeId, signals);
    }
    this.rebuildObjectGrid();
  }

  get trafficTimeSeconds(): number {
    return this.trafficElapsedSeconds;
  }

  rebuildObjectGrid(): void {
    this.grid.rebuild(this.objects.filter((object) => object.active && object.renderOpacity > 0.18));
  }

  queryObjects(position: THREE.Vector3, radius: number): WorldObject[] {
    return this.grid.query(position, radius);
  }

  updateSwallowing(deltaSeconds: number, playerManager: PlayerManager): CompletedObjectSwallow[] {
    const completed: CompletedObjectSwallow[] = [];

    for (const object of this.objects) {
      if (!object.swallowAnimation) {
        continue;
      }

      const targetPlayerId = object.swallowAnimation.targetPlayerId;
      const target = playerManager.get(targetPlayerId);
      const done = object.updateSwallow(
        deltaSeconds,
        target ? { position: target.position, radius: target.radius } : null
      );
      if (done) {
        completed.push({ object, targetPlayerId });
      }
    }

    return completed;
  }

  updateDynamicObjects(deltaSeconds: number, now = Date.now() / 1000): void {
    this.trafficElapsedSeconds += deltaSeconds;
    const trafficByRoute = this.groupTrafficObjectsByRoute();
    for (const object of this.objects) {
      if (!object.active || object.swallowAnimation) {
        continue;
      }

      object.spawnFade = Math.min(1, object.spawnFade + deltaSeconds * 1.85);

      if (object.isPhysicsControlled) {
        object.updateNaturalPhysics(deltaSeconds, this.halfExtent);
        continue;
      }

      if (object.routeId) {
        const route = this.routesById.get(object.routeId);
        if (route) {
          const previousDistance = this.routeDistanceAtT(route, object.routeT);
          const desiredSpeed = this.desiredTrafficSpeed(object, route, trafficByRoute.get(route.id) ?? []);
          object.routeVelocity = this.moveTowards(
            object.routeVelocity,
            desiredSpeed,
            (desiredSpeed < object.routeVelocity ? 10.5 : 3.2) * deltaSeconds
          );
          const result = this.advanceRoute(route, object.routeT, object.routeVelocity * deltaSeconds);
          object.routeT = result.t;
          object.position.set(result.position.x, object.homePosition.y, result.position.z);
          object.rotation.y = this.smoothAngle(object.rotation.y, result.rotationY, Math.min(1, deltaSeconds * 5.4));
          this.updateTrafficEndpointFade(object, route, previousDistance, now);
        }
      }

      if (object.pedestrianPathId) {
        const path = this.mapData.pedestrianPaths.find((candidate) => candidate.id === object.pedestrianPathId);
        if (path) {
          const result = this.advanceRoute(path, object.routeT, object.routeSpeed * deltaSeconds);
          object.routeT = result.t;
          object.position.set(result.position.x, object.homePosition.y + Math.sin(object.routeT * Math.PI * 2) * 0.03, result.position.z);
          object.rotation.y = this.smoothAngle(object.rotation.y, result.rotationY, Math.min(1, deltaSeconds * 6.8));
          const targetFade = this.pedestrianPathVisibilityTarget(object, path);
          object.visibilityFade = this.moveTowards(object.visibilityFade, targetFade, deltaSeconds * 3.2);
        }
      } else if (object.category === 'pedestrian') {
        const targetFade = this.isPedestrianInsideAnyBuilding(object) ? 0 : 1;
        object.visibilityFade = this.moveTowards(object.visibilityFade, targetFade, deltaSeconds * 3.2);
      }
    }

    this.enforceTrafficSpacing(trafficByRoute);
    this.resolveObjectCollisions(deltaSeconds);
  }

  resolveObjectCollisions(deltaSeconds: number): void {
    const collidable = this.objects.filter((object) => object.active && !object.swallowAnimation && object.renderOpacity > 0.18);
    if (collidable.length < 2) {
      return;
    }

    const passes = collidable.length > 900 ? 1 : 2;
    for (let pass = 0; pass < passes; pass += 1) {
      this.collisionGrid.rebuild(collidable);
      const resolvedPairs = new Set<string>();

      for (const object of collidable) {
        const candidates = this.collisionGrid.query(object.position, object.collisionRadius + 2.5);
        for (const other of candidates) {
          if (object === other || !other.active || other.swallowAnimation) {
            continue;
          }

          const key = object.id < other.id ? `${object.id}:${other.id}` : `${other.id}:${object.id}`;
          if (resolvedPairs.has(key)) {
            continue;
          }
          resolvedPairs.add(key);
          this.resolveObjectPairCollision(object, other, deltaSeconds);
        }
      }
    }

    for (const object of collidable) {
      this.clampToArena(object.position, Math.max(0.4, object.collisionRadius));
    }
    this.rebuildObjectGrid();
  }

  updateRespawns(now: number, playerManager?: PlayerManager, safeRadius = 8): WorldObject[] {
    const respawned: WorldObject[] = [];

    for (const object of this.objects) {
      if (object.active || object.swallowAnimation || object.respawnAt <= 0 || now < object.respawnAt) {
        continue;
      }

      if (playerManager && this.wouldRespawnInsidePlayer(object, playerManager, safeRadius)) {
        object.respawnAt = now + 1.25;
        continue;
      }

      object.respawn();
      if (playerManager && object.category === 'traffic') {
        this.placeTrafficRespawnAwayFromPlayers(object, playerManager);
      }
      respawned.push(object);
    }

    if (respawned.length > 0) {
      this.rebuildObjectGrid();
    }

    return respawned;
  }

  updatePowerUps(deltaSeconds: number, now: number, playerManager?: PlayerManager, safeRadius = 7): PowerUp[] {
    const respawned: PowerUp[] = [];
    for (const powerUp of this.powerUps) {
      powerUp.rotation += deltaSeconds * 2.5;
      if (!powerUp.active && now >= powerUp.respawnAt) {
        const position = this.randomPowerUpPosition(powerUp, playerManager, safeRadius);
        if (!position) {
          powerUp.respawnAt = now + 1.5;
          continue;
        }
        const nextType = this.nextPowerUpType(powerUp.type);
        powerUp.changeType(nextType);
        powerUp.respawn(position);
        this.lastPowerUpRespawnType = nextType;
        respawned.push(powerUp);
      }
    }
    return respawned;
  }

  private randomPowerUpPosition(
    powerUp: PowerUp,
    playerManager?: PlayerManager,
    safeRadius = 7
  ): THREE.Vector3 | null {
    const margin = Math.max(4, powerUp.radius + 3);
    for (let attempt = 0; attempt < 90; attempt += 1) {
      const x = THREE.MathUtils.lerp(-this.halfExtent + margin, this.halfExtent - margin, Math.random());
      const z = THREE.MathUtils.lerp(-this.halfExtent + margin, this.halfExtent - margin, Math.random());
      if (this.conflictsPowerUpSpawn(x, z, powerUp, playerManager, safeRadius)) {
        continue;
      }
      return new THREE.Vector3(x, 0.55, z);
    }
    return null;
  }

  private conflictsPowerUpSpawn(
    x: number,
    z: number,
    candidate: PowerUp,
    playerManager?: PlayerManager,
    safeRadius = 7
  ): boolean {
    for (const object of this.objects) {
      if (!object.active) continue;
      const dx = object.position.x - x;
      const dz = object.position.z - z;
      const minDistance = object.boundingRadius + candidate.radius + 1.2;
      if (dx * dx + dz * dz < minDistance * minDistance) {
        return true;
      }
    }

    for (const powerUp of this.powerUps) {
      if (powerUp === candidate || !powerUp.active) continue;
      const dx = powerUp.position.x - x;
      const dz = powerUp.position.z - z;
      const minDistance = Math.max(powerUp.radius + candidate.radius + 4, this.powerUpMinimumSpacing());
      if (dx * dx + dz * dz < minDistance * minDistance) {
        return true;
      }
    }

    if (playerManager) {
      for (const player of playerManager.alivePlayers()) {
        const dx = player.position.x - x;
        const dz = player.position.z - z;
        const minDistance = player.radius + candidate.radius + safeRadius;
        if (dx * dx + dz * dz < minDistance * minDistance) {
          return true;
        }
      }
    }

    return false;
  }

  private powerUpMinimumSpacing(): number {
    const baseSpacing = { small: 9, medium: 11, large: 13.5, huge: 16 } satisfies Record<MapData['size'], number>;
    const defaultCount = { small: 8, medium: 14, large: 28, huge: 44 } satisfies Record<MapData['size'], number>;
    const densityScale = Math.sqrt(defaultCount[this.mapData.size] / Math.max(1, this.powerUps.length));
    return Math.max(6.25, Math.min(baseSpacing[this.mapData.size], baseSpacing[this.mapData.size] * densityScale));
  }

  private nextPowerUpType(previousType: PowerUpType): PowerUpType {
    const availableTypes = getEnabledPowerUpTypes();
    const powerUpTypes = availableTypes.length ? availableTypes : this.powerUpTypes;
    let available = powerUpTypes.filter((type) => type !== previousType && type !== this.lastPowerUpRespawnType);
    if (available.length === 0) {
      available = powerUpTypes.filter((type) => type !== previousType);
    }
    if (available.length === 0) {
      available = powerUpTypes;
    }
    return available[Math.floor(Math.random() * available.length)];
  }

  queryPowerUps(position: THREE.Vector3, radius: number): PowerUp[] {
    const radiusSq = radius * radius;
    return this.powerUps.filter((powerUp) => {
      if (!powerUp.active) return false;
      const dx = powerUp.position.x - position.x;
      const dz = powerUp.position.z - position.z;
      return dx * dx + dz * dz <= radiusSq;
    });
  }

  clampToArena(position: THREE.Vector3, radius: number): void {
    const inset = Math.max(0, radius * (1 - ARENA_EDGE_OVERHANG_RATIO));
    const axisLimit = Math.max(0, this.halfExtent - inset);
    position.x = THREE.MathUtils.clamp(position.x, -axisLimit, axisLimit);
    position.z = THREE.MathUtils.clamp(position.z, -axisLimit, axisLimit);

    const cornerCut = this.arenaCornerCut();
    const diagonalLimit = Math.max(0, this.halfExtent * 2 - cornerCut - inset * Math.SQRT2);
    const absX = Math.abs(position.x);
    const absZ = Math.abs(position.z);
    const cornerAmount = absX + absZ;
    if (cornerAmount <= diagonalLimit) {
      return;
    }

    const correction = (cornerAmount - diagonalLimit) * 0.5;
    position.x = Math.sign(position.x) * Math.max(0, absX - correction);
    position.z = Math.sign(position.z) * Math.max(0, absZ - correction);
  }

  getSpawnPoint(index: number): THREE.Vector3 {
    const point = this.mapData.spawnPoints[index % this.mapData.spawnPoints.length];
    return new THREE.Vector3(point.x, point.y, point.z);
  }

  private wouldRespawnInsidePlayer(
    object: WorldObject,
    playerManager: PlayerManager,
    safeRadius: number
  ): boolean {
    const respawnPosition = this.respawnSafetyPosition(object, playerManager);
    for (const player of playerManager.alivePlayers()) {
      const dx = respawnPosition.x - player.position.x;
      const dz = respawnPosition.z - player.position.z;
      const extraTrafficBuffer = object.category === 'traffic' ? 20 : 0;
      const minDistance = player.radius + object.boundingRadius + safeRadius + extraTrafficBuffer;
      if (dx * dx + dz * dz < minDistance * minDistance) {
        return true;
      }
    }
    return false;
  }

  private respawnSafetyPosition(object: WorldObject, playerManager: PlayerManager): THREE.Vector3 {
    if (object.category === 'traffic') {
      const placement = this.bestTrafficRespawnPlacement(object, playerManager);
      if (placement) {
        return new THREE.Vector3(placement.position.x, object.homePosition.y, placement.position.z);
      }
    }

    return object.homePosition;
  }

  private placeTrafficRespawnAwayFromPlayers(object: WorldObject, playerManager: PlayerManager): void {
    const placement = this.bestTrafficRespawnPlacement(object, playerManager);
    if (!placement) {
      return;
    }

    object.routeT = placement.t;
    object.position.set(placement.position.x, object.homePosition.y, placement.position.z);
    object.rotation.y = placement.rotationY;
  }

  private bestTrafficRespawnPlacement(
    object: WorldObject,
    playerManager: PlayerManager
  ): { t: number; position: RoutePoint; rotationY: number } | null {
    if (!object.routeId) {
      return null;
    }

    const route = this.routesById.get(object.routeId);
    if (!route || route.points.length < 2) {
      return null;
    }

    const lastT = Math.max(0, route.points.length - 1.001);
    const candidateTs = route.loop
      ? [0, lastT * 0.25, lastT * 0.5, lastT * 0.75]
      : [0, lastT];
    let best: { t: number; position: RoutePoint; rotationY: number; score: number } | null = null;

    for (const t of candidateTs) {
      const placement = this.advanceRoute(route, t, 0);
      const closestPlayerDistance = this.closestPlayerDistanceSq(placement.position, playerManager);
      const edgeFavor = Math.max(Math.abs(placement.position.x), Math.abs(placement.position.z)) * 4;
      const score = closestPlayerDistance + edgeFavor;
      if (!best || score > best.score) {
        best = { ...placement, score };
      }
    }

    return best ? { t: best.t, position: best.position, rotationY: best.rotationY } : null;
  }

  private closestPlayerDistanceSq(position: RoutePoint, playerManager: PlayerManager): number {
    let best = Number.POSITIVE_INFINITY;
    for (const player of playerManager.alivePlayers()) {
      const dx = position.x - player.position.x;
      const dz = position.z - player.position.z;
      best = Math.min(best, dx * dx + dz * dz);
    }
    return best;
  }

  private groupTrafficObjectsByRoute(): Map<string, WorldObject[]> {
    const grouped = new Map<string, WorldObject[]>();
    for (const object of this.objects) {
      if (!object.active || object.swallowAnimation || object.isPhysicsControlled || !object.routeId || object.renderOpacity < 0.25) {
        continue;
      }
      const objects = grouped.get(object.routeId) ?? [];
      objects.push(object);
      grouped.set(object.routeId, objects);
    }
    return grouped;
  }

  private resolveObjectPairCollision(a: WorldObject, b: WorldObject, deltaSeconds: number): void {
    if (this.shouldKeepRouteTrafficAuthoritative(a, b)) {
      return;
    }
    if (this.shouldAllowPedestrianEntry(a, b)) {
      return;
    }

    const radiusA = a.collisionRadius;
    const radiusB = b.collisionRadius;
    const minDistance = radiusA + radiusB;
    const dx = b.position.x - a.position.x;
    const dz = b.position.z - a.position.z;
    const distanceSq = dx * dx + dz * dz;
    if (distanceSq >= minDistance * minDistance) {
      return;
    }

    const verticalOverlap =
      a.collisionBottom < b.collisionTop &&
      a.collisionTop > b.collisionBottom;
    if (!verticalOverlap) {
      this.resolveStackSupport(a, b);
      return;
    }

    const distance = Math.max(0.0001, Math.sqrt(distanceSq));
    const nx = distance > 0.001 ? dx / distance : this.stablePairNormal(a, b).x;
    const nz = distance > 0.001 ? dz / distance : this.stablePairNormal(a, b).z;
    const normal = new THREE.Vector3(nx, 0, nz).normalize();

    if (this.tryStackOnCollision(a, b, normal)) {
      return;
    }
    if (this.tryStackOnCollision(b, a, normal.clone().multiplyScalar(-1))) {
      return;
    }

    const penetration = minDistance - distance + 0.004;
    const inverseMassA = a.collisionInverseMass;
    const inverseMassB = b.collisionInverseMass;
    const totalInverseMass = inverseMassA + inverseMassB;
    if (totalInverseMass <= 0) {
      return;
    }

    const moveA = penetration * (inverseMassA / totalInverseMass);
    const moveB = penetration * (inverseMassB / totalInverseMass);
    a.position.x -= normal.x * moveA;
    a.position.z -= normal.z * moveA;
    b.position.x += normal.x * moveB;
    b.position.z += normal.z * moveB;

    const relativeVelocity = new THREE.Vector3().subVectors(b.physicsVelocity, a.physicsVelocity);
    const closingSpeed = -relativeVelocity.dot(normal);
    const impactStrength = Math.max(0, closingSpeed + penetration / Math.max(0.016, deltaSeconds) * 0.08);
    const toppleA = impactStrength > 0.75 && this.canToppleFromCollision(a);
    const toppleB = impactStrength > 0.75 && this.canToppleFromCollision(b);
    a.applyCollisionResponse(normal.clone().multiplyScalar(-1), impactStrength * (inverseMassA / totalInverseMass), toppleA);
    b.applyCollisionResponse(normal, impactStrength * (inverseMassB / totalInverseMass), toppleB);

    const sharedVelocity = (a.physicsVelocity.dot(normal) + b.physicsVelocity.dot(normal)) * 0.5;
    a.physicsVelocity.addScaledVector(normal, sharedVelocity - a.physicsVelocity.dot(normal));
    b.physicsVelocity.addScaledVector(normal, sharedVelocity - b.physicsVelocity.dot(normal));
    a.physicsVelocity.multiplyScalar(0.96);
    b.physicsVelocity.multiplyScalar(0.96);

    if (a.routeId) {
      a.routeVelocity = Math.min(a.routeVelocity, Math.max(0, b.routeVelocity * 0.45));
    }
    if (b.routeId) {
      b.routeVelocity = Math.min(b.routeVelocity, Math.max(0, a.routeVelocity * 0.45));
    }
  }

  private tryStackOnCollision(top: WorldObject, bottom: WorldObject, normalFromBottomToTop: THREE.Vector3): boolean {
    if (!this.canObjectRestOn(top, bottom)) {
      return false;
    }

    const topBottom = top.collisionBottom;
    const bottomTop = bottom.collisionTop;
    const topIsAbove = top.position.y > bottom.position.y + Math.min(0.45, bottom.collisionHalfHeight * 0.55);
    const verticalContact = topBottom <= bottomTop + Math.max(0.18, top.collisionHalfHeight * 0.24);
    const fallingOrSettling = top.physicsVelocity.y <= 0.18 || top.physicsAwake || top.physicsToppled;
    if (!topIsAbove || !verticalContact || !fallingOrSettling) {
      return false;
    }

    top.position.y = bottomTop + top.collisionHalfHeight + 0.012;
    top.physicsVelocity.y = Math.max(0, top.physicsVelocity.y) * 0.12;
    top.physicsVelocity.x += normalFromBottomToTop.x * 0.12;
    top.physicsVelocity.z += normalFromBottomToTop.z * 0.12;
    top.physicsAngularVelocity.multiplyScalar(0.72);
    top.physicsAwake = true;
    top.physicsToppled = top.physicsToppled || top.category !== 'building';
    return true;
  }

  private resolveStackSupport(a: WorldObject, b: WorldObject): void {
    if (this.canObjectRestOn(a, b) && this.isSupportedBy(a, b)) {
      a.position.y = b.collisionTop + a.collisionHalfHeight + 0.012;
      a.physicsVelocity.y = Math.max(0, a.physicsVelocity.y) * 0.12;
      return;
    }
    if (this.canObjectRestOn(b, a) && this.isSupportedBy(b, a)) {
      b.position.y = a.collisionTop + b.collisionHalfHeight + 0.012;
      b.physicsVelocity.y = Math.max(0, b.physicsVelocity.y) * 0.12;
    }
  }

  private canObjectRestOn(top: WorldObject, bottom: WorldObject): boolean {
    if (bottom.category === 'pedestrian' && top.category !== 'pedestrian') {
      return false;
    }
    if (top.category === 'building' && bottom.category !== 'building') {
      return false;
    }
    return top.mass <= bottom.mass * 5.5 || bottom.category === 'building';
  }

  private isSupportedBy(top: WorldObject, bottom: WorldObject): boolean {
    const dx = top.position.x - bottom.position.x;
    const dz = top.position.z - bottom.position.z;
    const horizontalDistance = Math.hypot(dx, dz);
    const supportRadius = Math.max(0.18, Math.min(top.collisionRadius, bottom.collisionRadius) * 0.82);
    const verticalGap = top.collisionBottom - bottom.collisionTop;
    return (
      top.position.y > bottom.position.y &&
      horizontalDistance < supportRadius &&
      verticalGap >= -0.05 &&
      verticalGap <= 0.24
    );
  }

  private stablePairNormal(a: WorldObject, b: WorldObject): THREE.Vector3 {
    let hash = 2166136261;
    const key = `${a.id}:${b.id}`;
    for (let index = 0; index < key.length; index += 1) {
      hash ^= key.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }
    const angle = ((hash >>> 0) / 4294967296) * Math.PI * 2;
    return new THREE.Vector3(Math.cos(angle), 0, Math.sin(angle));
  }

  private canToppleFromCollision(object: WorldObject): boolean {
    if (object.category === 'building') {
      return object.fractureLevel > 0.12 || object.physicsAwake;
    }
    return object.category !== 'ad';
  }

  private shouldKeepRouteTrafficAuthoritative(a: WorldObject, b: WorldObject): boolean {
    const aGuidedTraffic = this.isGuidedTraffic(a);
    const bGuidedTraffic = this.isGuidedTraffic(b);
    if (aGuidedTraffic && bGuidedTraffic) {
      return true;
    }
    if (aGuidedTraffic && b.kind === 'trafficLight') {
      return true;
    }
    if (bGuidedTraffic && a.kind === 'trafficLight') {
      return true;
    }
    return false;
  }

  private shouldAllowPedestrianEntry(a: WorldObject, b: WorldObject): boolean {
    const aPedestrian = a.category === 'pedestrian';
    const bPedestrian = b.category === 'pedestrian';
    if (aPedestrian === bPedestrian) {
      return false;
    }
    const pedestrian = aPedestrian ? a : b;
    const other = aPedestrian ? b : a;
    return (
      other.category === 'building' &&
      (Boolean(pedestrian.pedestrianPathId?.startsWith('door-path-')) || this.isInsideObjectFootprint(pedestrian, other, 0.12))
    );
  }

  private isGuidedTraffic(object: WorldObject): boolean {
    return object.category === 'traffic' && Boolean(object.routeId) && !object.isPhysicsControlled;
  }

  private updateTrafficEndpointFade(
    object: WorldObject,
    route: TrafficRoute,
    previousDistance: number,
    now: number
  ): void {
    if (!this.shouldFadeTrafficEndpoint(route)) {
      object.visibilityFade = 1;
      return;
    }

    const metrics = this.routeMetrics.get(route.id) ?? this.createRouteMetrics(route);
    const currentDistance = this.routeDistanceAtT(route, object.routeT);
    const wrappedToStart = route.loop && currentDistance + 1.2 < previousDistance;
    if (wrappedToStart) {
      object.spawnFade = 0;
      object.visibilityFade = 1;
      return;
    }

    const remaining = Math.max(0, metrics.totalLength - currentDistance);
    const fadeDistance = Math.max(8, object.size.z * 1.65, Math.abs(object.routeSpeed) * 1.2);
    object.visibilityFade = THREE.MathUtils.smoothstep(remaining, 0, fadeDistance);

    if (!route.loop && remaining <= 0.08 && object.visibilityFade <= 0.04) {
      object.active = false;
      object.routeVelocity = 0;
      object.respawnAt = now + Math.max(0.35, Math.min(1.2, object.respawnDelay * 0.12));
    }
  }

  private shouldFadeTrafficEndpoint(route: TrafficRoute): boolean {
    if (route.id.startsWith('bus-line-')) {
      return false;
    }
    return !route.loop || route.points.length <= 2 || route.id.includes('-traffic-');
  }

  private pedestrianPathVisibilityTarget(object: WorldObject, path: PedestrianPath): number {
    if (this.isPedestrianInsideAnyBuilding(object)) {
      return 0;
    }

    if (path.stopKind === 'door' || path.id.startsWith('door-path-') || this.isNearDoorPathEndpoint(object, path)) {
      const lastT = Math.max(1, path.points.length - 1);
      const normalized = ((object.routeT % lastT) + lastT) % lastT;
      const doorDistanceT = Math.min(normalized, Math.abs(lastT - normalized));
      return THREE.MathUtils.smoothstep(doorDistanceT, 0.08, 0.62);
    }

    if (path.id.startsWith('bus-stop-path-')) {
      return this.busNearStop(path.points[0]) ? 0 : 1;
    }

    return 1;
  }

  private isNearDoorPathEndpoint(object: WorldObject, path: PedestrianPath): boolean {
    if (path.points.length < 3 || object.category !== 'pedestrian') {
      return false;
    }
    const first = path.points[0];
    const last = path.points[path.points.length - 1];
    return Math.hypot(first.x - last.x, first.z - last.z) < 0.05 && path.points.length === 3;
  }

  private isPedestrianInsideAnyBuilding(pedestrian: WorldObject): boolean {
    if (pedestrian.category !== 'pedestrian') {
      return false;
    }

    for (const object of this.objects) {
      if (!object.active || object.category !== 'building') {
        continue;
      }
      if (this.isInsideObjectFootprint(pedestrian, object, -0.04)) {
        return true;
      }
    }
    return false;
  }

  private isInsideObjectFootprint(candidate: WorldObject, footprintOwner: WorldObject, padding = 0): boolean {
    const dx = candidate.position.x - footprintOwner.position.x;
    const dz = candidate.position.z - footprintOwner.position.z;
    const sideX = Math.cos(footprintOwner.rotation.y);
    const sideZ = -Math.sin(footprintOwner.rotation.y);
    const forwardX = Math.sin(footprintOwner.rotation.y);
    const forwardZ = Math.cos(footprintOwner.rotation.y);
    const localX = dx * sideX + dz * sideZ;
    const localZ = dx * forwardX + dz * forwardZ;
    const halfWidth = footprintOwner.size.x * 0.5 + padding;
    const halfDepth = footprintOwner.size.z * 0.5 + padding;
    return Math.abs(localX) <= halfWidth && Math.abs(localZ) <= halfDepth;
  }

  private busNearStop(stop: RoutePoint): boolean {
    for (const object of this.objects) {
      if (!object.active || object.kind !== 'bus' || object.variantRole !== 'bus-line') {
        continue;
      }
      const dx = object.position.x - stop.x;
      const dz = object.position.z - stop.z;
      if (dx * dx + dz * dz < 7.5 * 7.5) {
        return true;
      }
    }
    return false;
  }

  private arenaCornerCut(): number {
    return Math.min(this.halfExtent * 0.28, Math.max(ARENA_MIN_CORNER_CUT, this.halfExtent * ARENA_CORNER_CUT_RATIO));
  }

  private desiredTrafficSpeed(object: WorldObject, route: TrafficRoute, routeObjects: WorldObject[]): number {
    let desiredSpeed = object.routeSpeed;
    const signalDistance = this.distanceToNextStoppingSignal(object, route);
    if (signalDistance !== null) {
      const stopBuffer = Math.max(2.35, object.size.z * 0.62);
      if (signalDistance <= stopBuffer) {
        desiredSpeed = 0;
      } else if (signalDistance < 28) {
        desiredSpeed = Math.min(desiredSpeed, Math.max(0, (signalDistance - stopBuffer) * 0.62));
      }
    }

    const vehicleAhead = this.distanceToVehicleAhead(object, route, routeObjects);
    if (vehicleAhead) {
      const gap = this.vehicleSpacingGap(object, vehicleAhead.object);
      if (vehicleAhead.distance <= gap) {
        desiredSpeed = 0;
      } else if (vehicleAhead.distance < gap + 18) {
        desiredSpeed = Math.min(desiredSpeed, Math.max(0, (vehicleAhead.distance - gap) * 0.86));
      }
    }

    return desiredSpeed;
  }

  private enforceTrafficSpacing(trafficByRoute: Map<string, WorldObject[]>): void {
    for (const [routeId, objects] of trafficByRoute) {
      const route = this.routesById.get(routeId);
      const metrics = route ? this.routeMetrics.get(route.id) : undefined;
      if (!route || !metrics || objects.length < 2 || metrics.totalLength < objects.length * 4.5) {
        continue;
      }

      let ordered = objects
        .filter((object) => object.active && !object.swallowAnimation)
        .map((object) => ({ object, distance: this.routeDistanceAtT(route, object.routeT) }))
        .sort((a, b) => a.distance - b.distance);

      for (let pass = 0; pass < 3; pass += 1) {
        for (let index = 0; index < ordered.length; index += 1) {
          const follower = ordered[index];
          const leader = ordered[(index + 1) % ordered.length];
          if (!route.loop && index === ordered.length - 1) {
            continue;
          }

          const gap = this.distanceBetweenRouteDistances(follower.distance, leader.distance, metrics.totalLength, route.loop);
          const minGap = this.vehicleSpacingGap(follower.object, leader.object);
          if (gap >= minGap || !Number.isFinite(gap)) {
            continue;
          }

          follower.distance = route.loop
            ? this.normalizeRouteDistance(leader.distance - minGap, metrics.totalLength)
            : Math.max(0, leader.distance - minGap);
          this.placeObjectAtRouteDistance(route, follower.object, follower.distance);
          follower.object.routeVelocity = Math.min(follower.object.routeVelocity, leader.object.routeVelocity);
        }

        ordered = ordered.sort((a, b) => a.distance - b.distance);
      }
    }
  }

  private vehicleSpacingGap(follower: WorldObject, leader: WorldObject): number {
    return Math.max(3.15, follower.size.z * 0.5 + leader.size.z * 0.5 + 1.55);
  }

  private distanceToNextStoppingSignal(object: WorldObject, route: TrafficRoute): number | null {
    const signals = object.routeId ? this.signalsByRoute.get(object.routeId) : undefined;
    if (!signals?.length) {
      return null;
    }

    let nearest: number | null = null;
    for (const signal of signals) {
      const state = trafficSignalState(signal, this.trafficElapsedSeconds);
      if (state === 'green') {
        continue;
      }

      const distance = this.distanceAheadOnRoute(route, object.routeT, signal.stopT);
      if (distance > 0.05 && distance < 22 && (nearest === null || distance < nearest)) {
        nearest = distance;
      }
    }
    return nearest;
  }

  private distanceToVehicleAhead(
    object: WorldObject,
    route: TrafficRoute,
    routeObjects: WorldObject[]
  ): { object: WorldObject; distance: number } | null {
    let nearest: { object: WorldObject; distance: number } | null = null;
    for (const other of routeObjects) {
      if (other === object) {
        continue;
      }
      const distance = this.distanceAheadOnRoute(route, object.routeT, other.routeT);
      if (distance > 0.05 && distance < 48 && (!nearest || distance < nearest.distance)) {
        nearest = { object: other, distance };
      }
    }
    return nearest;
  }

  private createRouteMetrics(route: TrafficRoute): RouteMetrics {
    const segmentLengths: number[] = [];
    let totalLength = 0;
    for (let i = 0; i < route.points.length - 1; i += 1) {
      const start = route.points[i];
      const end = route.points[i + 1];
      const length = Math.max(0.001, Math.hypot(end.x - start.x, end.z - start.z));
      segmentLengths.push(length);
      totalLength += length;
    }
    return { segmentLengths, totalLength: Math.max(0.001, totalLength) };
  }

  private routeDistanceAtT(route: TrafficRoute, t: number): number {
    const metrics = this.routeMetrics.get(route.id) ?? this.createRouteMetrics(route);
    const segmentIndex = Math.min(metrics.segmentLengths.length - 1, Math.max(0, Math.floor(t)));
    const localT = Math.max(0, Math.min(1, t - segmentIndex));
    let distance = 0;
    for (let i = 0; i < segmentIndex; i += 1) {
      distance += metrics.segmentLengths[i] ?? 0;
    }
    return distance + (metrics.segmentLengths[segmentIndex] ?? 0) * localT;
  }

  private distanceAheadOnRoute(route: TrafficRoute, fromT: number, toT: number): number {
    const metrics = this.routeMetrics.get(route.id) ?? this.createRouteMetrics(route);
    const fromDistance = this.routeDistanceAtT(route, fromT);
    const toDistance = this.routeDistanceAtT(route, toT);
    if (toDistance > fromDistance) {
      return toDistance - fromDistance;
    }
    if (!route.loop) {
      return Number.POSITIVE_INFINITY;
    }
    return metrics.totalLength - fromDistance + toDistance;
  }

  private distanceBetweenRouteDistances(fromDistance: number, toDistance: number, totalLength: number, loop: boolean): number {
    if (toDistance > fromDistance) {
      return toDistance - fromDistance;
    }
    if (!loop) {
      return Number.POSITIVE_INFINITY;
    }
    return totalLength - fromDistance + toDistance;
  }

  private placeObjectAtRouteDistance(route: TrafficRoute, object: WorldObject, distance: number): void {
    object.routeT = this.tAtRouteDistance(route, distance);
    const result = this.advanceRoute(route, object.routeT, 0);
    object.position.set(result.position.x, object.homePosition.y, result.position.z);
    object.rotation.y = result.rotationY;
  }

  private tAtRouteDistance(route: TrafficRoute, distance: number): number {
    const metrics = this.routeMetrics.get(route.id) ?? this.createRouteMetrics(route);
    let remaining = route.loop
      ? this.normalizeRouteDistance(distance, metrics.totalLength)
      : THREE.MathUtils.clamp(distance, 0, metrics.totalLength);
    for (let index = 0; index < metrics.segmentLengths.length; index += 1) {
      const segmentLength = metrics.segmentLengths[index];
      if (remaining <= segmentLength) {
        return index + remaining / Math.max(0.001, segmentLength);
      }
      remaining -= segmentLength;
    }
    return route.loop ? 0 : Math.max(0, metrics.segmentLengths.length - 0.001);
  }

  private normalizeRouteDistance(distance: number, totalLength: number): number {
    if (!Number.isFinite(distance) || totalLength <= 0) {
      return 0;
    }
    return ((distance % totalLength) + totalLength) % totalLength;
  }

  private moveTowards(current: number, target: number, maxDelta: number): number {
    if (Math.abs(target - current) <= maxDelta) {
      return target;
    }
    return current + Math.sign(target - current) * maxDelta;
  }

  private advanceRoute(
    route: TrafficRoute,
    currentT: number,
    distance: number
  ): { t: number; position: RoutePoint; rotationY: number } {
    if (route.points.length < 2) {
      const point = route.points[0] ?? { x: 0, z: 0 };
      return { t: 0, position: point, rotationY: 0 };
    }

    let segmentIndex = Math.floor(currentT);
    let localT = currentT - segmentIndex;
    let remaining = distance;

    for (let guard = 0; guard < 12 && remaining > 0; guard += 1) {
      const start = route.points[segmentIndex];
      const end = route.points[(segmentIndex + 1) % route.points.length];
      const segmentLength = Math.max(0.001, Math.hypot(end.x - start.x, end.z - start.z));
      const available = (1 - localT) * segmentLength;
      if (remaining <= available) {
        localT += remaining / segmentLength;
        remaining = 0;
      } else {
        remaining -= available;
        segmentIndex += 1;
        localT = 0;
        if (segmentIndex >= route.points.length - 1) {
          segmentIndex = route.loop ? 0 : route.points.length - 2;
          if (!route.loop) {
            remaining = 0;
            localT = 1;
          }
        }
      }
    }

    const start = route.points[segmentIndex];
    const end = route.points[(segmentIndex + 1) % route.points.length];
    const x = THREE.MathUtils.lerp(start.x, end.x, localT);
    const z = THREE.MathUtils.lerp(start.z, end.z, localT);
    const rotationY = Math.atan2(end.x - start.x, end.z - start.z);
    return { t: segmentIndex + localT, position: { x, z }, rotationY };
  }

  private smoothAngle(current: number, target: number, amount: number): number {
    const delta = Math.atan2(Math.sin(target - current), Math.cos(target - current));
    return current + delta * amount;
  }
}
