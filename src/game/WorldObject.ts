import * as THREE from 'three';
import type { CityObjectCategory, ObjectSpawnDefinition, WorldObjectKind } from '../shared/types';

export interface ObjectSwallowAnimation {
  targetPlayerId: string;
  elapsed: number;
  duration: number;
  startPosition: THREE.Vector3;
  velocity: THREE.Vector3;
  angularVelocity: THREE.Vector3;
  swirlDirection: number;
  sinkDepth: number;
}

export interface ObjectSwallowTarget {
  position: THREE.Vector3;
  radius: number;
}

export class WorldObject {
  readonly id: string;
  readonly kind: WorldObjectKind;
  readonly label: string;
  readonly homePosition: THREE.Vector3;
  readonly homeRotationY: number;
  readonly size: THREE.Vector3;
  readonly color: string;
  readonly boundingRadius: number;
  readonly mass: number;
  readonly score: number;
  readonly respawnDelay: number;
  readonly category: CityObjectCategory;
  readonly routeId?: string;
  readonly pedestrianPathId?: string;
  readonly trafficSignalId?: string;
  routeT: number;
  routeSpeed: number;
  routeVelocity: number;
  readonly isAd: boolean;
  readonly adSurfaceId?: string;
  position: THREE.Vector3;
  rotation = new THREE.Euler();
  active = true;
  respawnAt = 0;
  swallowScale = 1;
  temporaryScale = 1;
  mesh: THREE.Object3D | null = null;
  swallowAnimation: ObjectSwallowAnimation | null = null;

  constructor(definition: ObjectSpawnDefinition) {
    this.id = definition.id;
    this.kind = definition.kind;
    this.label = definition.label;
    this.position = new THREE.Vector3(
      definition.position.x,
      definition.position.y,
      definition.position.z
    );
    this.homePosition = this.position.clone();
    this.homeRotationY = definition.rotationY;
    this.rotation.set(0, definition.rotationY, 0);
    this.size = new THREE.Vector3(definition.size.x, definition.size.y, definition.size.z);
    this.color = definition.color;
    this.boundingRadius = definition.boundingRadius;
    this.mass = definition.mass;
    this.score = definition.score;
    this.respawnDelay = definition.respawnDelay;
    this.category = definition.category;
    this.routeId = definition.routeId;
    this.pedestrianPathId = definition.pedestrianPathId;
    this.trafficSignalId = definition.trafficSignalId;
    this.routeT = definition.routeT ?? 0;
    this.routeSpeed = definition.routeSpeed ?? 0;
    this.routeVelocity = this.routeSpeed;
    this.isAd = Boolean(definition.isAd);
    this.adSurfaceId = definition.adSurfaceId;
  }

  get effectiveBoundingRadius(): number {
    return this.boundingRadius * this.temporaryScale;
  }

  startSwallow(targetPlayerId: string): void {
    this.active = false;
    this.swallowScale = 1;
    this.swallowAnimation = {
      targetPlayerId,
      elapsed: 0,
      duration: THREE.MathUtils.clamp(0.58 + this.boundingRadius * 0.1 + this.mass * 0.002, 0.58, 1.45),
      startPosition: this.position.clone(),
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 0.35,
        0.25 + Math.random() * 0.45,
        (Math.random() - 0.5) * 0.35
      ),
      angularVelocity: new THREE.Vector3(
        1.8 + Math.random() * 2.4,
        2.2 + Math.random() * 3.2,
        1.3 + Math.random() * 2.1
      ),
      swirlDirection: Math.random() < 0.5 ? -1 : 1,
      sinkDepth: 2.4 + this.boundingRadius * 1.45
    };
  }

  updateSwallow(deltaSeconds: number, target: ObjectSwallowTarget | null): boolean {
    if (!this.swallowAnimation) {
      return false;
    }

    const animation = this.swallowAnimation;
    animation.elapsed += deltaSeconds;
    const t = Math.min(1, animation.elapsed / animation.duration);
    const targetPosition = target?.position ?? animation.startPosition;
    const targetRadius = target?.radius ?? Math.max(1, this.boundingRadius);
    const stepCount = Math.max(1, Math.ceil(deltaSeconds / 0.016));
    const step = deltaSeconds / stepCount;

    for (let i = 0; i < stepCount; i += 1) {
      const toCenter = new THREE.Vector3(targetPosition.x - this.position.x, 0, targetPosition.z - this.position.z);
      const distance = Math.max(0.001, toCenter.length());
      const captureRadius = Math.max(targetRadius * 1.75 + this.boundingRadius * 0.9, 2.6);
      const proximity = THREE.MathUtils.clamp(1 - distance / captureRadius, 0, 1);
      toCenter.normalize();

      const tangent = new THREE.Vector3(-toCenter.z, 0, toCenter.x).multiplyScalar(animation.swirlDirection);
      const suction = (24 + targetRadius * 9 + this.boundingRadius * 3) * (0.42 + proximity * 1.65);
      const gravity = 15 + targetRadius * 3.4 + proximity * 24;
      animation.velocity.x += (toCenter.x * suction + tangent.x * suction * 0.18 * (1 - t)) * step;
      animation.velocity.z += (toCenter.z * suction + tangent.z * suction * 0.18 * (1 - t)) * step;
      animation.velocity.y -= gravity * step;
      animation.velocity.multiplyScalar(Math.max(0, 1 - step * (2.1 + proximity * 1.7)));

      this.position.x += animation.velocity.x * step;
      this.position.y += animation.velocity.y * step;
      this.position.z += animation.velocity.z * step;

      const centerLock = Math.max(0, (t - 0.45) / 0.55) * step * 7;
      this.position.x = THREE.MathUtils.lerp(this.position.x, targetPosition.x, centerLock);
      this.position.z = THREE.MathUtils.lerp(this.position.z, targetPosition.z, centerLock);
    }

    const finalDepth = Math.max(animation.sinkDepth, targetRadius * 0.8 + this.boundingRadius * 0.85);
    const targetY = targetPosition.y - finalDepth;
    const lateLock = Math.max(0, (t - 0.72) / 0.28);
    this.position.y = THREE.MathUtils.lerp(this.position.y, targetY, lateLock * 0.25);
    this.rotation.x += animation.angularVelocity.x * deltaSeconds * (1 + t * 5);
    this.rotation.y += animation.angularVelocity.y * deltaSeconds * (1 + t * 5);
    this.rotation.z += animation.angularVelocity.z * deltaSeconds * (1 + t * 5);
    const dropProgress = THREE.MathUtils.clamp(
      (animation.startPosition.y - this.position.y) / Math.max(0.001, finalDepth),
      0,
      1
    );
    const shrinkT = Math.max(dropProgress, Math.max(0, (t - 0.68) / 0.32));
    this.swallowScale = Math.max(0.06, 1 - shrinkT * 0.92);

    if (t >= 1) {
      this.swallowAnimation = null;
      this.swallowScale = 1;
      return true;
    }

    return false;
  }

  scheduleRespawn(now: number): void {
    this.respawnAt = now + this.respawnDelay;
  }

  respawn(): void {
    this.position.copy(this.homePosition);
    this.rotation.set(0, this.homeRotationY, 0);
    this.routeVelocity = this.routeSpeed;
    this.active = true;
    this.swallowAnimation = null;
    this.swallowScale = 1;
    this.temporaryScale = 1;
  }
}
