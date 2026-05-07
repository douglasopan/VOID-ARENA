import * as THREE from 'three';
import type { Player } from '../game/Player';
import type { HoleRimStyle } from '../shared/types';
import { NameLabelRenderer } from './NameLabelRenderer';

interface HoleView {
  group: THREE.Group;
  label: THREE.Sprite;
  rimColor: string;
  rimStyle: HoleRimStyle;
}

export class HoleRenderer {
  private readonly views = new Map<string, HoleView>();
  private readonly labelRenderer = new NameLabelRenderer();
  private readonly stencilMaskGeometry = new THREE.CircleGeometry(0.92, 96);
  private readonly tunnelGeometry = new THREE.CylinderGeometry(0.98, 0.3, 4.6, 96, 1, true);
  private readonly throatGeometry = new THREE.CircleGeometry(0.36, 96);
  private readonly innerRingGeometry = new THREE.TorusGeometry(0.72, 0.026, 8, 72);
  private readonly rimGeometry = new THREE.TorusGeometry(1, 0.075, 12, 64);
  private readonly thinRimGeometry = new THREE.TorusGeometry(1, 0.032, 8, 72);
  private readonly glowRimGeometry = new THREE.TorusGeometry(1.03, 0.16, 12, 72);
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
      const existing = this.views.get(player.id);
      if (existing && (existing.rimColor !== player.rimColor || existing.rimStyle !== player.rimStyle)) {
        this.disposeView(existing);
        this.views.delete(player.id);
      }
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
    this.stencilMaskGeometry.dispose();
    this.tunnelGeometry.dispose();
    this.throatGeometry.dispose();
    this.innerRingGeometry.dispose();
    this.rimGeometry.dispose();
    this.thinRimGeometry.dispose();
    this.glowRimGeometry.dispose();
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
      emissiveIntensity: player.rimStyle === 'clean' ? 0.16 : player.rimStyle === 'neon' ? 0.78 : 0.38,
      roughness: 0.35,
      metalness: 0.2
    });
    const shadowMaterial = new THREE.MeshBasicMaterial({
      color: '#000000',
      transparent: true,
      opacity: 0.22,
      side: THREE.DoubleSide
    });
    const tunnelMaterial = new THREE.MeshStandardMaterial({
      color: '#030711',
      emissive: player.rimColor,
      emissiveIntensity: player.rimStyle === 'clean' ? 0.02 : 0.1,
      roughness: 0.72,
      metalness: 0,
      side: THREE.BackSide
    });
    const throatMaterial = new THREE.MeshBasicMaterial({
      color: '#020817',
      transparent: true,
      opacity: 0.82,
      side: THREE.DoubleSide
    });
    const innerRingMaterial = new THREE.MeshBasicMaterial({
      color: player.rimColor,
      transparent: true,
      opacity: player.rimStyle === 'clean' ? 0.16 : 0.34,
      depthWrite: false
    });

    const stencilMask = new THREE.Mesh(this.stencilMaskGeometry, this.createStencilMaskMaterial());
    stencilMask.rotation.x = -Math.PI / 2;
    stencilMask.position.y = 0.03;
    stencilMask.renderOrder = -100;

    const tunnel = new THREE.Mesh(this.tunnelGeometry, tunnelMaterial);
    tunnel.position.y = -2.12;
    tunnel.renderOrder = 5;

    const throat = new THREE.Mesh(this.throatGeometry, throatMaterial);
    throat.rotation.x = -Math.PI / 2;
    throat.position.y = -4.42;
    throat.renderOrder = 4;

    const depthRing = new THREE.Mesh(this.innerRingGeometry, innerRingMaterial);
    depthRing.rotation.x = Math.PI / 2;
    depthRing.position.y = -0.88;
    depthRing.renderOrder = 5;

    const lowerDepthRing = new THREE.Mesh(this.innerRingGeometry, innerRingMaterial.clone());
    lowerDepthRing.rotation.x = Math.PI / 2;
    lowerDepthRing.position.y = -2.25;
    lowerDepthRing.scale.setScalar(0.66);
    lowerDepthRing.renderOrder = 5;

    const rim = new THREE.Mesh(this.rimGeometry, rimMaterial);
    rim.rotation.x = Math.PI / 2;
    rim.position.y = 0.09;
    rim.renderOrder = 7;

    const rimDetails: THREE.Object3D[] = [];
    if (player.rimStyle === 'neon') {
      const glow = new THREE.Mesh(
        this.glowRimGeometry,
        new THREE.MeshBasicMaterial({
          color: player.rimColor,
          transparent: true,
          opacity: 0.24,
          depthWrite: false
        })
      );
      glow.rotation.x = Math.PI / 2;
      glow.position.y = 0.088;
      glow.renderOrder = 6;
      rimDetails.push(glow);
    }
    if (player.rimStyle === 'double') {
      const outer = new THREE.Mesh(this.thinRimGeometry, rimMaterial.clone());
      outer.rotation.x = Math.PI / 2;
      outer.position.y = 0.115;
      outer.scale.setScalar(1.18);
      outer.renderOrder = 7;
      const inner = new THREE.Mesh(this.thinRimGeometry, rimMaterial.clone());
      inner.rotation.x = Math.PI / 2;
      inner.position.y = 0.12;
      inner.scale.setScalar(0.78);
      inner.renderOrder = 7;
      rimDetails.push(outer, inner);
    }

    const shadow = new THREE.Mesh(this.shadowGeometry, shadowMaterial);
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = -0.045;
    shadow.renderOrder = 5;

    group.add(stencilMask, shadow, tunnel, throat, depthRing, lowerDepthRing, ...rimDetails, rim);
    const label = this.labelRenderer.createLabel(player.name, player.rimColor);
    this.scene.add(group, label);
    const view = {
      group,
      label,
      rimColor: player.rimColor,
      rimStyle: player.rimStyle
    };
    this.views.set(player.id, view);
    return view;
  }

  private createStencilMaskMaterial(): THREE.MeshBasicMaterial {
    return new THREE.MeshBasicMaterial({
      colorWrite: false,
      depthTest: false,
      depthWrite: false,
      side: THREE.DoubleSide,
      stencilWrite: true,
      stencilRef: 1,
      stencilFunc: THREE.AlwaysStencilFunc,
      stencilFail: THREE.ReplaceStencilOp,
      stencilZFail: THREE.ReplaceStencilOp,
      stencilZPass: THREE.ReplaceStencilOp
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
