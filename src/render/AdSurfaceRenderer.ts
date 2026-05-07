import * as THREE from 'three';
import type { AdSurface } from '../shared/types';
import type { WorldObject } from '../game/WorldObject';

interface SurfaceView {
  surface: AdSurface;
  group: THREE.Group;
  texture: THREE.CanvasTexture;
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
}

export class AdSurfaceRenderer {
  private readonly views = new Map<string, SurfaceView>();
  private timeAccumulator = 0;

  constructor(private readonly scene: THREE.Scene) {}

  setSurfaces(surfaces: AdSurface[]): void {
    this.clear();
    for (const surface of surfaces) {
      const view = this.createView(surface);
      this.views.set(surface.id, view);
      this.scene.add(view.group);
    }
  }

  update(deltaSeconds: number, objectsById: Map<string, WorldObject>): void {
    this.timeAccumulator += deltaSeconds;
    for (const view of this.views.values()) {
      const attached = view.surface.attachedObjectId ? objectsById.get(view.surface.attachedObjectId) : null;
      if (attached) {
        view.group.visible = attached.active || Boolean(attached.swallowAnimation);
        view.group.position.set(
          attached.position.x,
          attached.position.y + attached.size.y * 0.18,
          attached.position.z
        );
        view.group.rotation.y = attached.rotation.y + Math.PI / 2;
        view.group.scale.setScalar(attached.swallowScale);
      }

      if (view.surface.dynamic) {
        this.drawSurface(view, this.timeAccumulator);
        view.texture.needsUpdate = true;
      }
    }
  }

  clear(): void {
    for (const view of this.views.values()) {
      this.scene.remove(view.group);
      view.texture.dispose();
      view.group.traverse((child) => {
        const mesh = child as THREE.Mesh;
        if (mesh.geometry) {
          mesh.geometry.dispose();
        }
        if (mesh.material) {
          const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          for (const material of materials) {
            material.dispose();
          }
        }
      });
    }
    this.views.clear();
  }

  private createView(surface: AdSurface): SurfaceView {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Canvas 2D context unavailable');
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.DoubleSide,
      toneMapped: false
    });
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(surface.width, surface.height), material);
    const group = new THREE.Group();
    group.position.set(surface.position.x, surface.position.y, surface.position.z);
    group.rotation.y = surface.rotationY;
    group.add(plane);

    const view = { surface, group, texture, canvas, context };
    this.drawSurface(view, 0);
    texture.needsUpdate = true;
    return view;
  }

  private drawSurface(view: SurfaceView, time: number): void {
    const { context, canvas, surface } = view;
    const hue = surface.dynamic ? Math.floor((time * 65) % 360) : 174;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = surface.dynamic ? `hsl(${hue}, 72%, 22%)` : '#121722';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = surface.dynamic ? `hsl(${(hue + 90) % 360}, 80%, 62%)` : '#5eead4';
    context.lineWidth = 12;
    context.strokeRect(16, 16, canvas.width - 32, canvas.height - 32);
    context.fillStyle = '#ffffff';
    context.font = '800 42px Inter, Arial, sans-serif';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(surface.text, canvas.width / 2, canvas.height / 2 - 6, canvas.width - 70);
    context.font = '700 24px Inter, Arial, sans-serif';
    context.fillStyle = surface.dynamic ? '#f6c453' : '#b9c1d6';
    context.fillText(surface.dynamic ? 'LIVE SLOT' : surface.type.toUpperCase().replace(/-/g, ' '), canvas.width / 2, canvas.height / 2 + 54);
  }
}
