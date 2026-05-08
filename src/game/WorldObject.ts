import * as THREE from 'three';
import { getEngineConfig } from '../admin/EngineConfig';
import type { CityObjectCategory, ObjectSpawnDefinition, WorldObjectKind } from '../shared/types';

export interface ObjectSwallowAnimation {
  targetPlayerId: string;
  elapsed: number;
  duration: number;
  startPosition: THREE.Vector3;
  sinkDepth: number;
}

export interface ObjectSwallowTarget {
  position: THREE.Vector3;
  radius: number;
}

export interface ObjectVoidFallOptions {
  holeCenter?: THREE.Vector3;
  holeRadius?: number;
  playerVelocity?: THREE.Vector3;
  insideFraction?: number;
}

export interface ObjectPhysicsImpulse {
  linear?: THREE.Vector3;
  angular?: THREE.Vector3;
  topple?: boolean;
  fracture?: number;
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
  spawnFade = 1;
  physicsAwake = false;
  physicsToppled = false;
  physicsToppledSeconds = 0;
  utilityLightFailed = false;
  fractureLevel = 0;
  private swallowContactTargetId: string | null = null;
  private swallowContactSeconds = 0;
  readonly physicsVelocity = new THREE.Vector3();
  readonly physicsAngularVelocity = new THREE.Vector3();

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

  get collisionRadius(): number {
    const toppledScale = this.physicsToppled ? 0.88 : 1;
    const kindScale = this.category === 'building'
      ? 0.84
      : this.category === 'pedestrian'
        ? 0.72
        : this.kind === 'post' || this.kind === 'trafficLight'
          ? 0.68
          : 1;
    return Math.max(0.24, this.effectiveBoundingRadius * kindScale * toppledScale);
  }

  get collisionHalfHeight(): number {
    if (this.physicsToppled) {
      return Math.max(0.14, Math.min(this.size.y * 0.26, Math.max(this.size.x, this.size.z) * 0.38));
    }
    return Math.max(0.16, this.size.y * 0.5 * this.temporaryScale);
  }

  get collisionBottom(): number {
    return this.position.y - this.collisionHalfHeight;
  }

  get collisionTop(): number {
    return this.position.y + this.collisionHalfHeight;
  }

  get collisionInverseMass(): number {
    const base = 1 / Math.max(1, Math.sqrt(this.mass));
    if (this.category === 'building') {
      return base * (this.physicsAwake ? 0.18 : 0.045);
    }
    if (this.category === 'traffic') {
      return base * 0.62;
    }
    if (this.kind === 'post' || this.kind === 'trafficLight') {
      return base * 0.36;
    }
    if (this.category === 'pedestrian') {
      return base * 1.25;
    }
    return base * (this.physicsAwake || this.physicsToppled ? 1 : 0.28);
  }

  get hasSwallowContact(): boolean {
    return this.swallowContactSeconds > 0;
  }

  recordSwallowContact(targetPlayerId: string, deltaSeconds: number): number {
    if (this.swallowContactTargetId !== targetPlayerId) {
      this.swallowContactTargetId = targetPlayerId;
      this.swallowContactSeconds = 0;
    }

    this.swallowContactSeconds += deltaSeconds;
    return this.swallowContactSeconds;
  }

  resetSwallowContact(): void {
    this.swallowContactTargetId = null;
    this.swallowContactSeconds = 0;
  }

  startSwallow(targetPlayerId: string, options: ObjectVoidFallOptions = {}): void {
    this.active = false;
    this.swallowScale = 1;
    this.resetSwallowContact();
    const routeSpeed = Math.max(0, Math.abs(this.routeVelocity || this.routeSpeed || 0));
    const forward = new THREE.Vector3(Math.sin(this.rotation.y), 0, Math.cos(this.rotation.y));
    const toHole = options.holeCenter
      ? new THREE.Vector3(options.holeCenter.x - this.position.x, 0, options.holeCenter.z - this.position.z)
      : forward.clone();
    if (toHole.lengthSq() < 0.0001) {
      toHole.copy(forward);
    }
    toHole.normalize();

    if (routeSpeed > 0.01 && Math.hypot(this.physicsVelocity.x, this.physicsVelocity.z) < routeSpeed * 0.22) {
      this.physicsVelocity.addScaledVector(forward, routeSpeed * 0.38);
    }
    if (options.playerVelocity) {
      this.physicsVelocity.x += options.playerVelocity.x * 0.035;
      this.physicsVelocity.z += options.playerVelocity.z * 0.035;
    }
    this.physicsVelocity.addScaledVector(toHole, 0.08 + Math.min(0.16, this.boundingRadius * 0.025));

    const insideLeverage = THREE.MathUtils.clamp(options.insideFraction ?? 0.62, 0.5, 1);
    this.physicsVelocity.y = Math.min(
      this.physicsVelocity.y,
      -0.16 - insideLeverage * 0.48 - Math.min(0.65, this.boundingRadius * 0.075)
    );

    if (this.physicsAngularVelocity.lengthSq() < 0.04) {
      const horizontalSpeed = Math.max(routeSpeed, Math.hypot(this.physicsVelocity.x, this.physicsVelocity.z));
      const tumbleScale = THREE.MathUtils.clamp(0.46 + horizontalSpeed * 0.08 + this.boundingRadius * 0.055, 0.5, 2.35);
      this.physicsAngularVelocity.set(
        -toHole.z * tumbleScale + (Math.random() - 0.5) * 0.12,
        (Math.random() - 0.5) * tumbleScale * 0.12,
        toHole.x * tumbleScale + (Math.random() - 0.5) * 0.12
      );
      this.addRollingAngularImpulse(this.physicsVelocity);
    }

    this.physicsAwake = true;
    this.physicsToppled = true;
    this.swallowAnimation = {
      targetPlayerId,
      elapsed: 0,
      duration: THREE.MathUtils.clamp(0.84 + this.boundingRadius * 0.14 + Math.sqrt(this.mass) * 0.045, 0.9, 2.65),
      startPosition: this.position.clone(),
      sinkDepth: Math.max(3.8 + this.boundingRadius * 2.2, this.size.y * 0.78 + 2.6)
    };
  }

  get isPhysicsControlled(): boolean {
    return this.physicsAwake || this.physicsToppled;
  }

  ensureVisualAboveGround(visualBottomY: number, clearance = 0.025): void {
    const lift = clearance - visualBottomY;
    if (lift <= 0 || !Number.isFinite(lift)) {
      return;
    }

    this.position.y += lift;
    this.homePosition.y += lift;
  }

  applyPhysicsImpulse(impulse: ObjectPhysicsImpulse): void {
    if (!this.active || this.swallowAnimation) {
      return;
    }

    if (impulse.linear) {
      this.physicsVelocity.add(impulse.linear);
      this.addRollingAngularImpulse(impulse.linear);
    }
    if (impulse.angular) {
      this.physicsAngularVelocity.add(impulse.angular);
    }
    if (impulse.topple) {
      if (!this.physicsToppled) {
        this.physicsToppledSeconds = 0;
        this.utilityLightFailed = false;
      }
      this.physicsToppled = true;
    }
    if (impulse.fracture) {
      this.fracture(impulse.fracture);
    }
    this.physicsAwake = true;
  }

  applyCollisionResponse(normal: THREE.Vector3, impulseStrength: number, topple = false): void {
    if (!this.active || this.swallowAnimation || impulseStrength <= 0) {
      return;
    }

    const massDamping = 1 / Math.max(1, Math.sqrt(this.mass) * 0.42);
    const linear = normal.clone().multiplyScalar(impulseStrength * massDamping);
    const angular = new THREE.Vector3(
      normal.z * impulseStrength * 0.045,
      0,
      -normal.x * impulseStrength * 0.045
    );
    this.applyPhysicsImpulse({ linear, angular, topple });
  }

  fracture(amount: number): void {
    if (this.category !== 'building') {
      return;
    }

    this.fractureLevel = THREE.MathUtils.clamp(this.fractureLevel + Math.max(0, amount), 0, 1);
    if (this.fractureLevel > 0.18) {
      if (!this.physicsToppled) {
        this.physicsToppledSeconds = 0;
      }
      this.physicsToppled = true;
      this.physicsAwake = true;
    }
  }

  updateNaturalPhysics(deltaSeconds: number, halfExtent: number): void {
    this.updateToppledState(deltaSeconds);
    if (!this.physicsAwake || this.swallowAnimation || !this.active) {
      return;
    }

    const stepCount = Math.max(1, Math.ceil(deltaSeconds / 0.018));
    const step = deltaSeconds / stepCount;
    const groundY = this.physicsToppled
      ? Math.max(0.12, this.homePosition.y - Math.min(this.size.y * 0.36, Math.max(0.18, this.size.y * 0.28)))
      : this.homePosition.y;
    const restitution = this.category === 'traffic'
      ? 0.22
      : this.category === 'building'
        ? 0.06
        : this.category === 'pedestrian'
          ? 0.12
          : 0.18;

    for (let i = 0; i < stepCount; i += 1) {
      this.physicsVelocity.y -= 9.8 * step;
      this.position.addScaledVector(this.physicsVelocity, step);
      this.addRollingAngularImpulse(this.physicsVelocity.clone().multiplyScalar(step * 0.7));
      this.rotation.x += this.physicsAngularVelocity.x * step;
      this.rotation.y += this.physicsAngularVelocity.y * step;
      this.rotation.z += this.physicsAngularVelocity.z * step;

      if (this.position.y <= groundY) {
        this.position.y = groundY;
        if (this.physicsVelocity.y < -1.2) {
          this.physicsVelocity.y *= -restitution;
          this.physicsAngularVelocity.multiplyScalar(0.9);
        } else {
          this.physicsVelocity.y = 0;
        }
      }
    }

    const limit = halfExtent - Math.max(1.2, this.boundingRadius);
    this.position.x = THREE.MathUtils.clamp(this.position.x, -limit, limit);
    this.position.z = THREE.MathUtils.clamp(this.position.z, -limit, limit);
    const groundFriction = this.physicsToppled
      ? this.category === 'building' ? 2.15 : 1.45
      : this.category === 'traffic' ? 1.05 : 2.75;
    this.physicsVelocity.x *= Math.max(0, 1 - deltaSeconds * groundFriction);
    this.physicsVelocity.z *= Math.max(0, 1 - deltaSeconds * groundFriction);
    this.physicsAngularVelocity.multiplyScalar(Math.max(0, 1 - deltaSeconds * (this.physicsToppled ? 1.15 : 2.05)));

    if (!this.physicsToppled) {
      this.rotation.x = THREE.MathUtils.lerp(this.rotation.x, 0, Math.min(1, deltaSeconds * 2.5));
      this.rotation.z = THREE.MathUtils.lerp(this.rotation.z, 0, Math.min(1, deltaSeconds * 2.5));
    } else {
      const maxTilt = this.category === 'building' ? 1.42 : 1.58;
      this.rotation.x = THREE.MathUtils.clamp(this.rotation.x, -maxTilt, maxTilt);
      this.rotation.z = THREE.MathUtils.clamp(this.rotation.z, -maxTilt, maxTilt);
    }

    const motion =
      Math.abs(this.physicsVelocity.x) +
      Math.abs(this.physicsVelocity.y) +
      Math.abs(this.physicsVelocity.z) +
      Math.abs(this.physicsAngularVelocity.x) +
      Math.abs(this.physicsAngularVelocity.y) +
      Math.abs(this.physicsAngularVelocity.z);

    if (motion < 0.035) {
      this.physicsVelocity.set(0, 0, 0);
      this.physicsAngularVelocity.set(0, 0, 0);
      this.physicsAwake = false;
      if (!this.physicsToppled) {
        this.position.y = this.homePosition.y;
        this.rotation.x = 0;
        this.rotation.z = 0;
      }
    }
  }

  updateSwallow(deltaSeconds: number, target: ObjectSwallowTarget | null): boolean {
    if (!this.swallowAnimation) {
      return false;
    }

    const animation = this.swallowAnimation;
    animation.elapsed += deltaSeconds;
    const targetPosition = target?.position ?? animation.startPosition;
    const targetRadius = target?.radius ?? Math.max(1, this.boundingRadius);
    const engine = getEngineConfig().gameplay;
    const stepCount = Math.max(1, Math.ceil(deltaSeconds / 0.016));
    const step = deltaSeconds / stepCount;
    const sinkDepth = Math.max(animation.sinkDepth, targetRadius * 1.15 + this.boundingRadius * 1.35);

    for (let i = 0; i < stepCount; i += 1) {
      const toCenter = new THREE.Vector3(targetPosition.x - this.position.x, 0, targetPosition.z - this.position.z);
      const distance = Math.max(0.001, toCenter.length());
      const insideFraction = this.footprintInsideApertureFraction(targetRadius, this.effectiveBoundingRadius, distance);
      const aperturePressure = THREE.MathUtils.clamp((insideFraction - 0.35) / 0.65, 0, 1);
      toCenter.normalize();

      const massDamping = 1 / Math.max(0.75, Math.sqrt(this.mass) * 0.14);
      const settlePressure = Math.max(0, aperturePressure - 0.72);
      const centering = targetRadius * 0.075 * settlePressure * settlePressure * massDamping * engine.rimSuctionMultiplier;
      const gravity = (9.8 + aperturePressure * 5.6) * engine.swallowGravityMultiplier;
      if (centering > 0) {
        this.physicsVelocity.x += toCenter.x * centering * step;
        this.physicsVelocity.z += toCenter.z * centering * step;
      }
      this.physicsVelocity.y -= gravity * step * Math.max(0.48, aperturePressure);

      const horizontalDrag = Math.max(0, 1 - step * (0.28 + aperturePressure * 0.42));
      this.physicsVelocity.x *= horizontalDrag;
      this.physicsVelocity.z *= horizontalDrag;
      this.physicsVelocity.y *= Math.max(0, 1 - step * 0.05);

      this.position.addScaledVector(this.physicsVelocity, step);
      this.addRollingAngularImpulse(this.physicsVelocity.clone().multiplyScalar(step * 0.18));
      this.rotation.x += this.physicsAngularVelocity.x * step;
      this.rotation.y += this.physicsAngularVelocity.y * step;
      this.rotation.z += this.physicsAngularVelocity.z * step;
      this.physicsAngularVelocity.multiplyScalar(Math.max(0, 1 - step * 0.38));
    }

    this.swallowScale = 1;
    if (this.physicsToppled) {
      this.physicsToppledSeconds += deltaSeconds;
      if ((this.kind === 'post' || this.kind === 'trafficLight') && this.physicsToppledSeconds > 1.15) {
        this.utilityLightFailed = true;
      }
    }

    const targetY = targetPosition.y - sinkDepth;
    const horizontalMissDistance = Math.hypot(this.position.x - targetPosition.x, this.position.z - targetPosition.z);
    const missLimit = Math.max(0.18, targetRadius - this.boundingRadius * 0.18) * engine.objectMissForgiveness;
    const tooWideToKeepFalling =
      animation.elapsed > 0.22 &&
      horizontalMissDistance > missLimit &&
      this.position.y > targetPosition.y - Math.max(0.42, this.boundingRadius * 0.34);
    const stalledAboveHole =
      animation.elapsed > animation.duration * 1.65 &&
      this.position.y > targetPosition.y - sinkDepth * 0.44;
    if (tooWideToKeepFalling || stalledAboveHole) {
      this.abortSwallow();
      return false;
    }

    const deepEnough = this.position.y <= targetY;
    const visibleLongEnough = animation.elapsed >= animation.duration;
    if (deepEnough && visibleLongEnough) {
      this.swallowAnimation = null;
      this.swallowScale = 1;
      this.physicsAwake = false;
      this.physicsVelocity.set(0, 0, 0);
      this.physicsAngularVelocity.set(0, 0, 0);
      return true;
    }

    return false;
  }

  abortSwallow(): void {
    this.swallowAnimation = null;
    this.active = true;
    this.swallowScale = 1;
    this.physicsAwake = true;
    this.physicsToppled = true;
    this.physicsVelocity.y = Math.max(this.physicsVelocity.y * -0.22, 0.08);
    this.position.y = Math.max(this.position.y, this.homePosition.y + 0.04);
    this.resetSwallowContact();
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
    this.spawnFade = 0;
    this.temporaryScale = 1;
    this.physicsAwake = false;
    this.physicsToppled = false;
    this.physicsToppledSeconds = 0;
    this.utilityLightFailed = false;
    this.fractureLevel = 0;
    this.resetSwallowContact();
    this.physicsVelocity.set(0, 0, 0);
    this.physicsAngularVelocity.set(0, 0, 0);
  }

  private updateToppledState(deltaSeconds: number): void {
    if (!this.physicsToppled || !this.active || this.swallowAnimation) {
      return;
    }

    this.physicsToppledSeconds += deltaSeconds;
    if ((this.kind === 'post' || this.kind === 'trafficLight') && this.physicsToppledSeconds > 2.35) {
      this.utilityLightFailed = true;
    }
  }

  private addRollingAngularImpulse(linear: THREE.Vector3): void {
    const horizontalSpeed = Math.hypot(linear.x, linear.z);
    if (horizontalSpeed < 0.0001) {
      return;
    }

    const rollRadius = Math.max(0.35, Math.min(this.size.x, this.size.z) * 0.5);
    const rollScale = this.category === 'building' ? 0.12 : this.category === 'traffic' ? 0.28 : 0.46;
    this.physicsAngularVelocity.x += (linear.z / rollRadius) * rollScale;
    this.physicsAngularVelocity.z -= (linear.x / rollRadius) * rollScale;
  }

  private footprintInsideApertureFraction(holeRadius: number, objectRadius: number, distance: number): number {
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
}
