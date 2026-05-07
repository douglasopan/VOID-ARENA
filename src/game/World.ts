import * as THREE from 'three';
import type { MapData } from '../shared/types';
import type { RoutePoint, TrafficRoute, TrafficSignalDefinition } from '../shared/types';
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
  private readonly routesById = new Map<string, TrafficRoute>();
  private readonly routeMetrics = new Map<string, RouteMetrics>();
  private readonly signalsByRoute = new Map<string, TrafficSignalDefinition[]>();
  private trafficElapsedSeconds = 0;

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
    this.grid.rebuild(this.objects.filter((object) => object.active));
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

  updateDynamicObjects(deltaSeconds: number): void {
    this.trafficElapsedSeconds += deltaSeconds;
    const trafficByRoute = this.groupTrafficObjectsByRoute();
    for (const object of this.objects) {
      if (!object.active || object.swallowAnimation) {
        continue;
      }

      if (object.isPhysicsControlled) {
        object.updateNaturalPhysics(deltaSeconds, this.halfExtent);
        continue;
      }

      if (object.routeId) {
        const route = this.routesById.get(object.routeId);
        if (route) {
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
        }
      }

      if (object.pedestrianPathId) {
        const path = this.mapData.pedestrianPaths.find((candidate) => candidate.id === object.pedestrianPathId);
        if (path) {
          const result = this.advanceRoute(path, object.routeT, object.routeSpeed * deltaSeconds);
          object.routeT = result.t;
          object.position.set(result.position.x, object.homePosition.y + Math.sin(object.routeT * Math.PI * 2) * 0.03, result.position.z);
          object.rotation.y = this.smoothAngle(object.rotation.y, result.rotationY, Math.min(1, deltaSeconds * 6.8));
        }
      }
    }

    this.enforceTrafficSpacing(trafficByRoute);
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
        powerUp.respawn(position);
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
      const minDistance = powerUp.radius + candidate.radius + 4;
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
    const limit = this.halfExtent - radius * 1.1;
    position.x = THREE.MathUtils.clamp(position.x, -limit, limit);
    position.z = THREE.MathUtils.clamp(position.z, -limit, limit);
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
    for (const player of playerManager.alivePlayers()) {
      const dx = object.homePosition.x - player.position.x;
      const dz = object.homePosition.z - player.position.z;
      const minDistance = player.radius + object.boundingRadius + safeRadius;
      if (dx * dx + dz * dz < minDistance * minDistance) {
        return true;
      }
    }
    return false;
  }

  private groupTrafficObjectsByRoute(): Map<string, WorldObject[]> {
    const grouped = new Map<string, WorldObject[]>();
    for (const object of this.objects) {
      if (!object.active || object.swallowAnimation || object.isPhysicsControlled || !object.routeId) {
        continue;
      }
      const objects = grouped.get(object.routeId) ?? [];
      objects.push(object);
      grouped.set(object.routeId, objects);
    }
    return grouped;
  }

  private desiredTrafficSpeed(object: WorldObject, route: TrafficRoute, routeObjects: WorldObject[]): number {
    let desiredSpeed = object.routeSpeed;
    const signalDistance = this.distanceToNextStoppingSignal(object, route);
    if (signalDistance !== null) {
      const stopBuffer = Math.max(1.1, object.size.z * 0.32);
      if (signalDistance <= stopBuffer) {
        desiredSpeed = 0;
      } else if (signalDistance < 18) {
        desiredSpeed = Math.min(desiredSpeed, Math.max(0, (signalDistance - stopBuffer) * 0.78));
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
