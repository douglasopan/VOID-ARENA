import * as THREE from 'three';
import type { MapData } from '../shared/types';
import type { RoutePoint, TrafficRoute } from '../shared/types';
import { PlayerManager } from './PlayerManager';
import { PowerUp } from './PowerUp';
import { SpatialGrid } from './SpatialGrid';
import { WorldObject } from './WorldObject';

export interface CompletedObjectSwallow {
  object: WorldObject;
  targetPlayerId: string;
}

export class World {
  readonly halfExtent: number;
  readonly objects: WorldObject[];
  readonly powerUps: PowerUp[];
  private readonly grid = new SpatialGrid<WorldObject>(12);

  constructor(readonly mapData: MapData) {
    this.halfExtent = mapData.halfExtent;
    this.objects = mapData.objects.map((definition) => new WorldObject(definition));
    this.powerUps = mapData.powerUps.map((definition) => new PowerUp(definition));
    this.rebuildObjectGrid();
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
    for (const object of this.objects) {
      if (!object.active || object.swallowAnimation) {
        continue;
      }

      if (object.routeId) {
        const route = this.mapData.trafficRoutes.find((candidate) => candidate.id === object.routeId);
        if (route) {
          const result = this.advanceRoute(route, object.routeT, object.routeSpeed * deltaSeconds);
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
