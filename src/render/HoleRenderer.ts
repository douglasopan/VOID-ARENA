import * as THREE from 'three';
import type { Player } from '../game/Player';
import { NameLabelRenderer } from './NameLabelRenderer';

interface HoleView {
  group: THREE.Group;
  label: THREE.Sprite;
}

export class HoleRenderer {
  private readonly views = new Map<string, HoleView>();
  private readonly labelRenderer = new NameLabelRenderer();
  private readonly mouthGeometry = new THREE.CircleGeometry(0.98, 96);
  private readonly tunnelGeometry = new THREE.CylinderGeometry(0.98, 0.48, 2.9, 96, 1, true);
  private readonly throatGeometry = new THREE.CircleGeometry(0.52, 96);
  private readonly innerRingGeometry = new THREE.TorusGeometry(0.72, 0.026, 8, 72);
  private readonly rimGeometry = new THREE.TorusGeometry(1, 0.075, 12, 64);
  private readonly shadowGeometry = new THREE.RingGeometry(0.92, 1.18, 64);

  constructor(private readonly scene: THREE.Scene) {}

  update(players: Player[]): void {
    const activeIds = new Set(players.map((player) => player.id));

    for (const [id, view] of this.views) {
      if (!activeIds.has(id)) {
        this.disposeView(view);
        this.views.delete(id);
      }
    }

    for (const player of players) {
      const view = this.views.get(player.id) ?? this.createView(player);
      const visualRadius = player.radius * player.visualScale;
      view.group.visible = player.renderVisible;
      view.label.visible = player.renderVisible;
      view.group.position.set(player.position.x, 0.16 + player.visualY, player.position.z);
      view.group.scale.set(visualRadius, 1, visualRadius);
      view.label.position.set(player.position.x, 1.55 + player.radius * 0.78 + player.visualY, player.position.z);
      view.label.scale.set(5.65 + player.radius * 0.36, 1.42 + player.radius * 0.08, 1);
    }
  }

  dispose(): void {
    for (const view of this.views.values()) {
      this.disposeView(view);
    }
    this.views.clear();
    this.mouthGeometry.dispose();
    this.tunnelGeometry.dispose();
    this.throatGeometry.dispose();
    this.innerRingGeometry.dispose();
    this.rimGeometry.dispose();
    this.shadowGeometry.dispose();
  }

  clear(): void {
    for (const view of this.views.values()) {
      this.disposeView(view);
    }
    this.views.clear();
  }

  private createView(player: Player): HoleView {
    const group = new THREE.Group();
    const rimMaterial = new THREE.MeshStandardMaterial({
      color: player.rimColor,
      emissive: player.rimColor,
      emissiveIntensity: 0.32,
      roughness: 0.35,
      metalness: 0.2
    });
    const shadowMaterial = new THREE.MeshBasicMaterial({
      color: '#000000',
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide
    });
    const tunnelMaterial = new THREE.MeshStandardMaterial({
      color: '#030711',
      emissive: player.rimColor,
      emissiveIntensity: 0.08,
      roughness: 0.72,
      metalness: 0,
      side: THREE.BackSide
    });
    const throatMaterial = new THREE.MeshBasicMaterial({
      color: '#00020a',
      transparent: true,
      opacity: 0.94,
      side: THREE.DoubleSide
    });
    const innerRingMaterial = new THREE.MeshBasicMaterial({
      color: player.rimColor,
      transparent: true,
      opacity: 0.28,
      depthWrite: false
    });

    const tunnel = new THREE.Mesh(this.tunnelGeometry, tunnelMaterial);
    tunnel.position.y = -1.32;
    tunnel.renderOrder = 5;

    const throat = new THREE.Mesh(this.throatGeometry, throatMaterial);
    throat.rotation.x = -Math.PI / 2;
    throat.position.y = -2.78;
    throat.renderOrder = 4;

    const mouth = new THREE.Mesh(this.mouthGeometry, this.createMouthMaterial(player.rimColor));
    mouth.rotation.x = -Math.PI / 2;
    mouth.position.y = 0.037;
    mouth.renderOrder = 6;

    const depthRing = new THREE.Mesh(this.innerRingGeometry, innerRingMaterial);
    depthRing.rotation.x = Math.PI / 2;
    depthRing.position.y = -0.88;
    depthRing.renderOrder = 5;

    const rim = new THREE.Mesh(this.rimGeometry, rimMaterial);
    rim.rotation.x = Math.PI / 2;
    rim.position.y = 0.09;
    rim.renderOrder = 7;

    const shadow = new THREE.Mesh(this.shadowGeometry, shadowMaterial);
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = -0.045;
    shadow.renderOrder = 5;

    group.add(shadow, tunnel, throat, mouth, depthRing, rim);
    const label = this.labelRenderer.createLabel(player.name, player.rimColor);
    this.scene.add(group, label);
    const view = { group, label };
    this.views.set(player.id, view);
    return view;
  }

  private createMouthMaterial(rimColor: string): THREE.MeshBasicMaterial {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const context = canvas.getContext('2d');
    if (!context) {
      return new THREE.MeshBasicMaterial({ color: '#02040b' });
    }

    const gradient = context.createRadialGradient(128, 128, 12, 128, 128, 128);
    gradient.addColorStop(0, '#00010a');
    gradient.addColorStop(0.42, '#020513');
    gradient.addColorStop(0.68, '#08111d');
    gradient.addColorStop(0.82, '#0d1824');
    gradient.addColorStop(1, rimColor);
    context.fillStyle = gradient;
    context.fillRect(0, 0, 256, 256);

    context.globalAlpha = 0.22;
    context.strokeStyle = '#ffffff';
    context.lineWidth = 3;
    for (const radius of [38, 62, 89, 113]) {
      context.beginPath();
      context.arc(128, 128, radius, 0, Math.PI * 2);
      context.stroke();
      context.globalAlpha *= 0.72;
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return new THREE.MeshBasicMaterial({
      map: texture,
      transparent: false,
      side: THREE.FrontSide
    });
  }

  private disposeView(view: HoleView): void {
    this.scene.remove(view.group, view.label);
    view.group.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (mesh.material) {
        const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        for (const material of materials) {
          const mappedMaterial = material as THREE.Material & { map?: THREE.Texture | null };
          mappedMaterial.map?.dispose();
          material.dispose();
        }
      }
    });
    const material = view.label.material;
    if (material.map) {
      material.map.dispose();
    }
    material.dispose();
  }
}
