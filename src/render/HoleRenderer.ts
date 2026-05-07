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
  private readonly centerGeometry = new THREE.CylinderGeometry(1, 1, 0.06, 64);
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
    this.centerGeometry.dispose();
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
    const centerMaterial = new THREE.MeshStandardMaterial({
      color: '#010101',
      roughness: 0.8,
      metalness: 0,
      depthWrite: true
    });
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

    const center = new THREE.Mesh(this.centerGeometry, centerMaterial);
    center.receiveShadow = true;
    center.position.y = 0.025;
    center.renderOrder = 6;

    const rim = new THREE.Mesh(this.rimGeometry, rimMaterial);
    rim.rotation.x = Math.PI / 2;
    rim.position.y = 0.09;
    rim.renderOrder = 7;

    const shadow = new THREE.Mesh(this.shadowGeometry, shadowMaterial);
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = -0.045;
    shadow.renderOrder = 5;

    group.add(shadow, center, rim);
    const label = this.labelRenderer.createLabel(player.name, player.rimColor);
    this.scene.add(group, label);
    const view = { group, label };
    this.views.set(player.id, view);
    return view;
  }

  private disposeView(view: HoleView): void {
    this.scene.remove(view.group, view.label);
    view.group.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (mesh.material) {
        const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        for (const material of materials) {
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
