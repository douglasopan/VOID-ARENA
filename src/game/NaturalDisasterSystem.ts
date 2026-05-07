import * as THREE from 'three';
import type { PlayerManager } from './PlayerManager';
import type { World } from './World';
import type { WorldObject } from './WorldObject';

export type NaturalDisasterType = 'clear' | 'rain' | 'thunderstorm' | 'earthquake' | 'meteorShower';

export interface NaturalDisasterSnapshot {
  type: NaturalDisasterType;
  active: boolean;
  started: boolean;
  intensity: number;
  precipitation: number;
  wind: number;
  cameraShake: number;
  lightningFlash: number;
  remainingSeconds: number;
}

export const CLEAR_NATURAL_DISASTER: NaturalDisasterSnapshot = {
  type: 'clear',
  active: false,
  started: false,
  intensity: 0,
  precipitation: 0,
  wind: 0,
  cameraShake: 0,
  lightningFlash: 0,
  remainingSeconds: 0
};

interface ActiveNaturalDisaster {
  type: Exclude<NaturalDisasterType, 'clear'>;
  elapsedSeconds: number;
  durationSeconds: number;
  baseIntensity: number;
  lightningCooldown: number;
}

export class NaturalDisasterSystem {
  private active: ActiveNaturalDisaster | null = null;
  private nextEventInSeconds = 18 + Math.random() * 16;
  private quakePhase = Math.random() * Math.PI * 2;
  private quakeImpulseCooldown = 0;
  private meteorSlowPulse = 0;

  reset(): void {
    this.active = null;
    this.nextEventInSeconds = 18 + Math.random() * 16;
    this.quakePhase = Math.random() * Math.PI * 2;
    this.quakeImpulseCooldown = 0;
    this.meteorSlowPulse = 0;
  }

  update(deltaSeconds: number, world: World, playerManager: PlayerManager): NaturalDisasterSnapshot {
    if (!this.active) {
      this.nextEventInSeconds -= deltaSeconds;
      if (this.nextEventInSeconds <= 0) {
        this.active = this.createEvent();
      }
    }

    if (!this.active) {
      return CLEAR_NATURAL_DISASTER;
    }

    const event = this.active;
    const started = event.elapsedSeconds === 0;
    event.elapsedSeconds += deltaSeconds;
    event.lightningCooldown = Math.max(0, event.lightningCooldown - deltaSeconds);
    const remainingSeconds = Math.max(0, event.durationSeconds - event.elapsedSeconds);
    const fadeIn = Math.min(1, event.elapsedSeconds / 2.5);
    const fadeOut = Math.min(1, remainingSeconds / 3.5);
    const envelope = Math.min(fadeIn, fadeOut);
    const pulse = 0.86 + Math.sin(event.elapsedSeconds * 2.1) * 0.08;
    const intensity = Math.max(0, Math.min(1, event.baseIntensity * envelope * pulse));
    const lightningFlash = this.updateLightning(event, intensity);
    const snapshot: NaturalDisasterSnapshot = {
      type: event.type,
      active: true,
      started,
      intensity,
      precipitation: this.precipitationFor(event.type, intensity),
      wind: this.windFor(event.type, intensity),
      cameraShake: this.cameraShakeFor(event.type, intensity),
      lightningFlash,
      remainingSeconds
    };

    this.applyWorldEffects(snapshot, deltaSeconds, world, playerManager);

    if (remainingSeconds <= 0) {
      this.active = null;
      this.nextEventInSeconds = 28 + Math.random() * 34;
    }

    return snapshot;
  }

  playerSpeedMultiplier(snapshot: NaturalDisasterSnapshot): number {
    if (snapshot.type === 'earthquake') {
      return 1 - snapshot.intensity * 0.16;
    }
    if (snapshot.type === 'thunderstorm') {
      return 1 - snapshot.intensity * 0.08;
    }
    if (snapshot.type === 'rain') {
      return 1 - snapshot.intensity * 0.045;
    }
    return 1;
  }

  private createEvent(): ActiveNaturalDisaster {
    const roll = Math.random();
    if (roll < 0.34) {
      return {
        type: 'rain',
        elapsedSeconds: 0,
        durationSeconds: 24 + Math.random() * 16,
        baseIntensity: 0.46 + Math.random() * 0.18,
        lightningCooldown: 999
      };
    }
    if (roll < 0.62) {
      return {
        type: 'thunderstorm',
        elapsedSeconds: 0,
        durationSeconds: 18 + Math.random() * 12,
        baseIntensity: 0.68 + Math.random() * 0.22,
        lightningCooldown: 1.5 + Math.random() * 2
      };
    }
    if (roll < 0.84) {
      return {
        type: 'earthquake',
        elapsedSeconds: 0,
        durationSeconds: 8 + Math.random() * 5,
        baseIntensity: 0.64 + Math.random() * 0.22,
        lightningCooldown: 999
      };
    }
    return {
      type: 'meteorShower',
      elapsedSeconds: 0,
      durationSeconds: 12 + Math.random() * 8,
      baseIntensity: 0.48 + Math.random() * 0.2,
      lightningCooldown: 999
    };
  }

  private updateLightning(event: ActiveNaturalDisaster, intensity: number): number {
    if (event.type !== 'thunderstorm') {
      return 0;
    }
    if (event.lightningCooldown > 0) {
      return 0;
    }
    event.lightningCooldown = 2.8 + Math.random() * 4.6;
    return Math.min(1, 0.5 + intensity * 0.65);
  }

  private precipitationFor(type: NaturalDisasterType, intensity: number): number {
    if (type === 'rain') {
      return intensity;
    }
    if (type === 'thunderstorm') {
      return Math.min(1, intensity * 1.28);
    }
    if (type === 'meteorShower') {
      return intensity * 0.38;
    }
    return 0;
  }

  private windFor(type: NaturalDisasterType, intensity: number): number {
    if (type === 'thunderstorm') {
      return intensity * 1.1;
    }
    if (type === 'rain') {
      return intensity * 0.42;
    }
    if (type === 'meteorShower') {
      return intensity * 0.32;
    }
    return 0;
  }

  private cameraShakeFor(type: NaturalDisasterType, intensity: number): number {
    if (type === 'earthquake') {
      return intensity * 0.72;
    }
    if (type === 'thunderstorm') {
      return intensity * 0.08;
    }
    if (type === 'meteorShower') {
      return intensity * 0.1;
    }
    return 0;
  }

  private applyWorldEffects(
    snapshot: NaturalDisasterSnapshot,
    deltaSeconds: number,
    world: World,
    playerManager: PlayerManager
  ): void {
    if (!snapshot.active) {
      return;
    }

    const trafficDamping = this.trafficDamping(snapshot);
    if (trafficDamping < 1) {
      const damping = Math.pow(trafficDamping, deltaSeconds);
      for (const object of world.objects) {
        if (object.active && object.routeId) {
          object.routeVelocity *= damping;
        }
      }
    }

    if (snapshot.type === 'earthquake') {
      this.quakePhase += deltaSeconds * (11 + snapshot.intensity * 8);
      const wobble = Math.sin(this.quakePhase) * snapshot.intensity * deltaSeconds * 0.65;
      playerManager.alivePlayers().forEach((player, index) => {
        player.position.x += wobble * Math.cos(this.quakePhase + index);
        player.position.z += wobble * Math.sin(this.quakePhase * 0.83 + index);
        world.clampToArena(player.position, player.radius);
      });
      this.applyEarthquakeObjectPhysics(snapshot, deltaSeconds, world);
    }

    if (snapshot.type === 'meteorShower') {
      this.meteorSlowPulse += deltaSeconds;
      if (this.meteorSlowPulse > 0.42) {
        this.meteorSlowPulse = 0;
        for (const object of world.objects) {
          if (!object.active || object.swallowAnimation || object.category === 'building') {
            continue;
          }
          object.temporaryScale = Math.max(0.92, object.temporaryScale - snapshot.intensity * 0.012);
        }
      }
    }
  }

  private trafficDamping(snapshot: NaturalDisasterSnapshot): number {
    if (snapshot.type === 'earthquake') {
      return 1 - snapshot.intensity * 0.24;
    }
    if (snapshot.type === 'thunderstorm') {
      return 1 - snapshot.intensity * 0.12;
    }
    if (snapshot.type === 'rain') {
      return 1 - snapshot.intensity * 0.06;
    }
    return 1;
  }

  private applyEarthquakeObjectPhysics(snapshot: NaturalDisasterSnapshot, deltaSeconds: number, world: World): void {
    this.quakeImpulseCooldown -= deltaSeconds;
    if (this.quakeImpulseCooldown > 0) {
      return;
    }

    this.quakeImpulseCooldown = 0.14 + Math.random() * 0.16;
    for (const object of world.objects) {
      if (!object.active || object.swallowAnimation) {
        continue;
      }

      const chance = this.earthquakeImpulseChance(object, snapshot.intensity);
      if (Math.random() > chance) {
        continue;
      }

      const direction = new THREE.Vector3(Math.random() - 0.5, 0, Math.random() - 0.5);
      if (direction.lengthSq() < 0.001) {
        direction.set(1, 0, 0);
      }
      direction.normalize();

      const vulnerable = this.physicsVulnerability(object);
      const massDamping = 1 / Math.max(1, Math.sqrt(object.mass) * 0.38);
      const linearStrength = snapshot.intensity * vulnerable * massDamping;
      const linear = direction.multiplyScalar(
        object.category === 'building' ? linearStrength * 0.18 : linearStrength * (object.category === 'pedestrian' ? 2.6 : 4.2)
      );
      linear.y = object.category === 'pedestrian'
        ? snapshot.intensity * 0.55
        : snapshot.intensity * 0.12 * massDamping;

      const tallness = object.size.y / Math.max(0.5, Math.min(object.size.x, object.size.z));
      const angularStrength = snapshot.intensity * vulnerable * THREE.MathUtils.clamp(tallness, 0.6, 6);
      const angular = new THREE.Vector3(
        (Math.random() - 0.5) * angularStrength * (object.category === 'building' ? 0.34 : 1.6),
        (Math.random() - 0.5) * angularStrength * 0.2,
        (Math.random() - 0.5) * angularStrength * (object.category === 'building' ? 0.34 : 1.6)
      );

      object.applyPhysicsImpulse({
        linear,
        angular,
        topple: this.shouldToppleFromEarthquake(object, snapshot.intensity)
      });
    }
  }

  private earthquakeImpulseChance(object: WorldObject, intensity: number): number {
    if (object.physicsToppled) {
      return object.category === 'building' ? 0.015 : 0.05;
    }
    if (object.category === 'pedestrian') {
      return Math.min(0.95, intensity * 0.82);
    }
    if (object.category === 'traffic') {
      return Math.min(0.72, intensity * 0.52);
    }
    if (object.category === 'building') {
      return object.size.y > 6.5 ? Math.min(0.22, intensity * 0.16) : Math.min(0.1, intensity * 0.08);
    }
    if (object.category === 'nature' || object.category === 'utility') {
      return Math.min(0.58, intensity * 0.44);
    }
    return Math.min(0.38, intensity * 0.24);
  }

  private physicsVulnerability(object: WorldObject): number {
    if (object.category === 'pedestrian') {
      return 1.45;
    }
    if (object.category === 'traffic') {
      return object.kind === 'bus' || object.kind === 'truck' || object.kind === 'trailerTruck' ? 0.92 : 1.1;
    }
    if (object.category === 'building') {
      return THREE.MathUtils.clamp(object.size.y / 16, 0.24, 1.12);
    }
    if (object.kind === 'post' || object.kind === 'trafficLight') {
      return 1.35;
    }
    if (object.kind === 'tree') {
      return 1.05;
    }
    return 0.82;
  }

  private shouldToppleFromEarthquake(object: WorldObject, intensity: number): boolean {
    if (object.category === 'pedestrian') {
      return intensity > 0.22;
    }
    if (object.category === 'traffic') {
      return Math.random() < intensity * 0.22;
    }
    if (object.kind === 'post' || object.kind === 'trafficLight' || object.kind === 'tree') {
      return Math.random() < intensity * 0.34;
    }
    if (object.category === 'building') {
      return object.size.y > 7.5 && Math.random() < intensity * 0.08;
    }
    return Math.random() < intensity * 0.08;
  }
}
