import * as THREE from 'three';
import type { Player } from '../game/Player';
import { CAMERA_ZOOM_MAX, CAMERA_ZOOM_MIN } from '../shared/constants';

export class CameraController {
  private readonly desiredPosition = new THREE.Vector3();
  private readonly lookTarget = new THREE.Vector3();
  private respawnDropTargetId: string | null = null;
  private respawnDropRemaining = 0;
  private respawnDropSnap = false;
  private readonly respawnDropDuration = 1.45;

  startRespawnDrop(target: Player): void {
    this.respawnDropTargetId = target.id;
    this.respawnDropRemaining = this.respawnDropDuration;
    this.respawnDropSnap = true;
  }

  update(
    camera: THREE.PerspectiveCamera,
    target: Player | undefined,
    deltaSeconds: number,
    immediate = false,
    zoom = 1,
    zenithBlend = 0
  ): void {
    if (!target) {
      return;
    }

    const radiusBoost = Math.min(26, target.radius * 4.2);
    const zoomScale = THREE.MathUtils.clamp(zoom, CAMERA_ZOOM_MIN, CAMERA_ZOOM_MAX);
    const topDownBlend = THREE.MathUtils.clamp(zenithBlend, 0, 1);
    const cameraDistance = (24 + radiusBoost) * zoomScale * (1 - topDownBlend * 0.84);
    const cameraHeight = (24 + radiusBoost) * zoomScale * (1 + topDownBlend * 0.72);
    this.desiredPosition.set(
      target.position.x,
      cameraHeight,
      target.position.z + cameraDistance
    );
    this.lookTarget.set(target.position.x, 0, target.position.z);

    if (this.respawnDropTargetId === target.id && this.respawnDropRemaining > 0) {
      const remaining = Math.max(0, this.respawnDropRemaining - deltaSeconds);
      const progress = 1 - remaining / this.respawnDropDuration;
      const eased = progress * progress * (3 - 2 * progress);
      const highY = Math.max(145, cameraHeight * 4.4);
      const highZ = target.position.z + cameraDistance * 0.18;
      this.desiredPosition.y = THREE.MathUtils.lerp(highY, cameraHeight, eased);
      this.desiredPosition.z = THREE.MathUtils.lerp(highZ, target.position.z + cameraDistance, eased);
      this.respawnDropRemaining = remaining;
      if (this.respawnDropSnap) {
        camera.position.set(target.position.x, highY, highZ);
        this.respawnDropSnap = false;
      }
      if (remaining <= 0) {
        this.respawnDropTargetId = null;
      }
    }

    if (immediate) {
      camera.position.copy(this.desiredPosition);
    } else {
      const blend = 1 - Math.pow(0.001, deltaSeconds);
      camera.position.lerp(this.desiredPosition, blend);
    }

    camera.lookAt(this.lookTarget);
  }
}
