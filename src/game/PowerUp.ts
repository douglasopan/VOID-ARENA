import * as THREE from 'three';
import type { PowerUpSpawnDefinition, PowerUpType } from '../shared/types';

export class PowerUp {
  readonly id: string;
  readonly type: PowerUpType;
  readonly label: string;
  readonly homePosition: THREE.Vector3;
  readonly radius: number;
  readonly color: string;
  readonly durationSeconds: number;
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
    this.homePosition = this.position.clone();
    this.radius = definition.radius;
    this.color = definition.color;
    this.durationSeconds = definition.durationSeconds;
    this.respawnDelay = definition.respawnDelay;
  }

  collect(now: number): void {
    this.active = false;
    this.respawnAt = now + this.respawnDelay;
  }

  respawn(): void {
    this.position.copy(this.homePosition);
    this.active = true;
    this.rotation = 0;
  }
}
