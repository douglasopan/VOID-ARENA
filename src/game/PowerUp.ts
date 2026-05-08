import * as THREE from 'three';
import { POWERUP_SETTINGS } from '../shared/constants';
import { getPowerUpEngineSettings } from '../admin/EngineConfig';
import type { PowerUpSpawnDefinition, PowerUpType } from '../shared/types';

export class PowerUp {
  readonly id: string;
  type: PowerUpType;
  label: string;
  readonly radius: number;
  color: string;
  durationSeconds: number;
  readonly respawnDelay: number;
  position: THREE.Vector3;
  active = true;
  respawnAt = 0;
  rotation = 0;
  mesh: THREE.Object3D | null = null;

  constructor(definition: PowerUpSpawnDefinition) {
    this.id = definition.id;
    this.type = definition.type;
    this.label = definition.label;
    this.position = new THREE.Vector3(
      definition.position.x,
      definition.position.y,
      definition.position.z
    );
    this.radius = definition.radius;
    this.color = definition.color;
    this.durationSeconds = definition.durationSeconds;
    this.respawnDelay = definition.respawnDelay;
  }

  collect(now: number): void {
    this.active = false;
    this.respawnAt = now + this.respawnDelay;
  }

  respawn(position?: THREE.Vector3): void {
    if (position) {
      this.position.copy(position);
    }
    this.active = true;
    this.rotation = 0;
  }

  changeType(type: PowerUpType): void {
    const settings = POWERUP_SETTINGS[type];
    const engineSettings = getPowerUpEngineSettings(type);
    this.type = type;
    this.label = settings.label;
    this.color = settings.color;
    this.durationSeconds = engineSettings.durationSeconds;
  }
}
