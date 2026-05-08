import * as THREE from 'three';
import type { Player } from '../game/Player';
import { CAMERA_ZOOM_MAX, CAMERA_ZOOM_MIN } from '../shared/constants';

export class CameraController {
  private readonly desiredPosition = new THREE.Vector3();
  private readonly lookTarget = new THREE.Vector3();

  update(
    camera: THREE.PerspectiveCamera,
    target: Player | undefined,
    deltaSeconds: number,
    immediate = false,
    zoom = 1
  ): void {
    if (!target) {
      return;
    }

    const radiusBoost = Math.min(26, target.radius * 4.2);
    const zoomScale = THREE.MathUtils.clamp(zoom, CAMERA_ZOOM_MIN, CAMERA_ZOOM_MAX);
    this.desiredPosition.set(
      target.position.x,
      (24 + radiusBoost) * zoomScale,
      target.position.z + (24 + radiusBoost) * zoomScale
    );
    this.lookTarget.set(target.position.x, 0, target.position.z);

    if (immediate) {
      camera.position.copy(this.desiredPosition);
    } else {
      const blend = 1 - Math.pow(0.001, deltaSeconds);
      camera.position.lerp(this.desiredPosition, blend);
    }

    camera.lookAt(this.lookTarget);
  }
}
