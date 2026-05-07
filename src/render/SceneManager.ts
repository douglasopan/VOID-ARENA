import * as THREE from 'three';
import type { Player } from '../game/Player';
import type { PlayerManager } from '../game/PlayerManager';
import type { World } from '../game/World';
import type { WorldObject } from '../game/WorldObject';
import type { GraphicsQuality } from '../shared/types';
import { AdSurfaceRenderer } from './AdSurfaceRenderer';
import { CameraController } from './CameraController';
import { HoleRenderer } from './HoleRenderer';
import { NameLabelRenderer } from './NameLabelRenderer';
import { ObjectFactory } from './ObjectFactory';

export class SceneManager {
  readonly scene = new THREE.Scene();
  readonly camera = new THREE.PerspectiveCamera(58, 1, 0.1, 1200);
  readonly renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance', stencil: true });
  private readonly objectFactory = new ObjectFactory();
  private readonly cameraController = new CameraController();
  private readonly holeRenderer = new HoleRenderer(this.scene);
  private readonly labelRenderer = new NameLabelRenderer();
  private readonly adSurfaceRenderer = new AdSurfaceRenderer(this.scene);
  private readonly worldRoot = new THREE.Group();
  private readonly objectMeshes = new Map<string, THREE.Object3D>();
  private readonly powerUpMeshes = new Map<string, THREE.Object3D>();
  private readonly powerUpLabels = new Map<string, THREE.Sprite>();
  private readonly objectById = new Map<string, WorldObject>();
  private readonly skyRoot = new THREE.Group();
  private readonly skyTraffic: Array<{
    object: THREE.Object3D;
    speed: number;
    altitude: number;
    lateral: number;
    phase: number;
    span: number;
  }> = [];
  private skyElapsed = 0;
  private firstCameraFrame = true;

  constructor(private readonly container: HTMLElement) {
    this.scene.background = new THREE.Color('#0b2330');
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.autoClearStencil = true;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.container.appendChild(this.renderer.domElement);
    this.scene.add(this.worldRoot, this.skyRoot);
    this.setupLights();
    this.setupSkyTraffic();
    this.setGraphicsQuality('balanced');
    this.resize();
    window.addEventListener('resize', this.resize);
  }

  loadWorld(world: World): void {
    this.clearWorld();
    this.firstCameraFrame = true;
    this.scene.fog = new THREE.Fog('#0b2330', world.halfExtent * 1.2, world.halfExtent * 3.0);

    this.worldRoot.add(this.objectFactory.createWater(world.halfExtent));
    const ground = this.objectFactory.createGround(world.halfExtent);
    this.worldRoot.add(ground);

    for (const surface of world.mapData.surfaces.filter((item) => item.kind === 'sidewalk' || item.kind === 'plaza')) {
      this.worldRoot.add(this.objectFactory.createSurface(surface));
    }

    for (const road of world.mapData.roads) {
      this.worldRoot.add(this.objectFactory.createRoad(road));
    }

    for (const surface of world.mapData.surfaces.filter((item) => item.kind !== 'sidewalk' && item.kind !== 'plaza')) {
      this.worldRoot.add(this.objectFactory.createSurface(surface));
    }

    this.worldRoot.add(this.objectFactory.createBoundary(world.halfExtent));

    for (const object of world.objects) {
      const mesh = this.objectFactory.createWorldObjectMesh(object);
      mesh.position.copy(object.position);
      mesh.rotation.copy(object.rotation);
      mesh.userData.objectId = object.id;
      object.mesh = mesh;
      this.objectMeshes.set(object.id, mesh);
      this.objectById.set(object.id, object);
      this.worldRoot.add(mesh);
    }

    for (const powerUp of world.powerUps) {
      const mesh = this.objectFactory.createPowerUpMesh(powerUp);
      mesh.position.copy(powerUp.position);
      powerUp.mesh = mesh;
      this.powerUpMeshes.set(powerUp.id, mesh);
      this.worldRoot.add(mesh);
      const label = this.labelRenderer.createLabel(powerUp.label, powerUp.color);
      label.scale.set(6.65, 1.68, 1);
      this.powerUpLabels.set(powerUp.id, label);
      this.scene.add(label);
    }

    this.adSurfaceRenderer.setSurfaces(world.mapData.adSurfaces);
  }

  setGraphicsQuality(quality: GraphicsQuality): void {
    const pixelRatio = quality === 'performance' ? 1 : quality === 'balanced' ? Math.min(window.devicePixelRatio, 1.5) : Math.min(window.devicePixelRatio, 2);
    this.renderer.setPixelRatio(pixelRatio);
    this.renderer.shadowMap.enabled = quality !== 'performance';
    this.renderer.shadowMap.type = quality === 'quality' ? THREE.PCFSoftShadowMap : THREE.BasicShadowMap;
    this.resize();
  }

  update(
    world: World | null,
    playerManager: PlayerManager | null,
    localPlayer: Player | undefined,
    deltaSeconds: number,
    zoom = 1
  ): void {
    if (world) {
      this.syncWorld(world, deltaSeconds);
      this.adSurfaceRenderer.update(deltaSeconds, this.objectById);
    }

    if (playerManager) {
      this.holeRenderer.update(playerManager.all());
    }

    this.cameraController.update(this.camera, localPlayer, deltaSeconds, this.firstCameraFrame, zoom);
    this.updateSkyTraffic(deltaSeconds, world, zoom);
    this.firstCameraFrame = false;
  }

  updateDeathDive(world: World, playerManager: PlayerManager, attacker: Player, deltaSeconds: number, elapsedSeconds: number): void {
    this.syncWorld(world, deltaSeconds);
    this.adSurfaceRenderer.update(deltaSeconds, this.objectById);
    this.holeRenderer.update(playerManager.all());

    const t = THREE.MathUtils.clamp(elapsedSeconds / 1.55, 0, 1);
    const ease = 1 - Math.pow(1 - t, 3);
    const orbit = Math.sin(elapsedSeconds * 5.2) * (1 - ease) * Math.max(0.8, attacker.radius * 0.45);
    const y = THREE.MathUtils.lerp(13 + attacker.radius * 1.45, -3.8 - attacker.radius * 0.58, Math.pow(t, 1.32));
    const zOffset = (1 - ease) * (13 + attacker.radius * 1.25);
    this.camera.position.lerp(
      new THREE.Vector3(attacker.position.x + orbit, y, attacker.position.z + zOffset),
      1 - Math.pow(0.0006, deltaSeconds)
    );
    this.camera.lookAt(attacker.position.x, -3.6 - attacker.radius * 0.42, attacker.position.z);
    this.updateSkyTraffic(deltaSeconds, world, 1.2);
  }

  updateMenuPreview(world: World, deltaSeconds: number, elapsedSeconds: number): void {
    this.syncWorld(world, deltaSeconds);
    this.adSurfaceRenderer.update(deltaSeconds, this.objectById);
    this.holeRenderer.update([]);

    const half = world.halfExtent;
    const span = half * 1.8;
    const z = -half * 0.9 + ((elapsedSeconds * 10.5) % span);
    const x = Math.sin(elapsedSeconds * 0.16) * Math.min(18, half * 0.22);
    this.renderer.domElement.dataset.menuPreview = `${elapsedSeconds.toFixed(2)}:${z.toFixed(2)}`;
    this.camera.position.set(x, 15.5, z - 20);
    this.camera.lookAt(x * 0.42, 1.4, z + 28);
    this.updateSkyTraffic(deltaSeconds, world, 1.12);
  }

  render(): void {
    this.renderer.render(this.scene, this.camera);
  }

  clearWorld(): void {
    this.holeRenderer.clear();
    this.adSurfaceRenderer.clear();
    for (const label of this.powerUpLabels.values()) {
      this.disposeSprite(label);
      this.scene.remove(label);
    }
    for (const object of this.worldRoot.children) {
      this.objectFactory.disposeObject(object);
    }
    this.worldRoot.clear();
    this.objectMeshes.clear();
    this.powerUpMeshes.clear();
    this.powerUpLabels.clear();
    this.objectById.clear();
  }

  dispose(): void {
    window.removeEventListener('resize', this.resize);
    this.clearWorld();
    this.holeRenderer.dispose();
    this.disposeSkyTraffic();
    this.objectFactory.dispose();
    this.renderer.dispose();
  }

  private setupLights(): void {
    const ambient = new THREE.HemisphereLight('#d7f6ff', '#1d241e', 1.5);
    this.scene.add(ambient);

    const sun = new THREE.DirectionalLight('#ffffff', 2.1);
    sun.position.set(34, 58, 28);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    sun.shadow.camera.near = 1;
    sun.shadow.camera.far = 160;
    sun.shadow.camera.left = -85;
    sun.shadow.camera.right = 85;
    sun.shadow.camera.top = 85;
    sun.shadow.camera.bottom = -85;
    this.scene.add(sun);
  }

  private setupSkyTraffic(): void {
    const cloudMaterial = new THREE.MeshStandardMaterial({
      color: '#d7e7ec',
      roughness: 0.95,
      transparent: true,
      opacity: 0.72
    });
    const cloudGeometry = new THREE.DodecahedronGeometry(1, 0);
    for (let i = 0; i < 9; i += 1) {
      const cloud = new THREE.Group();
      for (let puff = 0; puff < 4; puff += 1) {
        const mesh = new THREE.Mesh(cloudGeometry, cloudMaterial);
        mesh.position.set((puff - 1.5) * 2.1, Math.sin(puff) * 0.25, Math.cos(puff) * 0.7);
        mesh.scale.set(2.9 + puff * 0.45, 0.58, 1.35 + puff * 0.22);
        cloud.add(mesh);
      }
      this.skyRoot.add(cloud);
      this.skyTraffic.push({
        object: cloud,
        speed: 1.3 + i * 0.18,
        altitude: 42 + (i % 3) * 6,
        lateral: -90 + i * 24,
        phase: i * 37,
        span: 260
      });
    }

    for (let i = 0; i < 3; i += 1) {
      const aircraft = i === 1 ? this.createHelicopter() : this.createPlane();
      this.skyRoot.add(aircraft);
      this.skyTraffic.push({
        object: aircraft,
        speed: 8.5 + i * 2.4,
        altitude: 54 + i * 8,
        lateral: -72 + i * 72,
        phase: i * 91,
        span: 320
      });
    }

    for (let i = 0; i < 12; i += 1) {
      const bird = this.createBird();
      this.skyRoot.add(bird);
      this.skyTraffic.push({
        object: bird,
        speed: 5.5 + i * 0.35,
        altitude: 24 + (i % 4) * 2.8,
        lateral: -64 + i * 12,
        phase: i * 23,
        span: 160
      });
    }
    this.skyRoot.visible = false;
  }

  private createPlane(): THREE.Group {
    const group = new THREE.Group();
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: '#dbeafe', roughness: 0.45, metalness: 0.12 });
    const accentMaterial = new THREE.MeshStandardMaterial({ color: '#5eead4', roughness: 0.5, metalness: 0.06 });
    const body = new THREE.Mesh(new THREE.BoxGeometry(4.6, 0.52, 0.62), bodyMaterial);
    const wing = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.12, 5.4), accentMaterial);
    const tail = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.95, 0.14), accentMaterial);
    tail.position.x = -2.1;
    group.add(body, wing, tail);
    group.scale.setScalar(0.9);
    return group;
  }

  private createHelicopter(): THREE.Group {
    const group = new THREE.Group();
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: '#f6c453', roughness: 0.48, metalness: 0.08 });
    const rotorMaterial = new THREE.MeshBasicMaterial({ color: '#16202a' });
    const body = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.75, 0.9), bodyMaterial);
    const tail = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.18, 0.18), bodyMaterial);
    const rotor = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.06, 0.16), rotorMaterial);
    tail.position.x = -2.1;
    rotor.position.y = 0.6;
    group.add(body, tail, rotor);
    return group;
  }

  private createBird(): THREE.Group {
    const group = new THREE.Group();
    const material = new THREE.MeshBasicMaterial({ color: '#111827', transparent: true, opacity: 0.72 });
    const leftWing = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.035, 0.08), material);
    const rightWing = leftWing.clone();
    leftWing.rotation.z = 0.34;
    rightWing.rotation.z = -0.34;
    leftWing.position.x = -0.32;
    rightWing.position.x = 0.32;
    group.add(leftWing, rightWing);
    return group;
  }

  private updateSkyTraffic(deltaSeconds: number, world: World | null, zoom: number): void {
    this.skyElapsed += deltaSeconds;
    const visible = Boolean(world) && (zoom >= 1.05 || this.camera.position.y > 18);
    this.skyRoot.visible = visible;
    if (!visible) {
      return;
    }

    const spanScale = Math.max(1, (world?.halfExtent ?? 80) / 80);
    this.skyTraffic.forEach((item, index) => {
      const span = item.span * spanScale;
      const progress = (this.skyElapsed * item.speed + item.phase) % span;
      const x = this.camera.position.x - span * 0.5 + progress;
      const z = this.camera.position.z + item.lateral * spanScale + Math.sin(this.skyElapsed * 0.18 + index) * 8;
      item.object.position.set(x, item.altitude, z);
      item.object.rotation.y = Math.PI / 2 + Math.sin(this.skyElapsed * 0.08 + index) * 0.18;
      item.object.rotation.z = Math.sin(this.skyElapsed * 0.7 + index) * 0.04;
    });
  }

  private disposeSkyTraffic(): void {
    this.skyRoot.traverse((child) => {
      const mesh = child as THREE.Mesh;
      mesh.geometry?.dispose();
      if (mesh.material) {
        const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        materials.forEach((material) => material.dispose());
      }
    });
    this.skyRoot.clear();
    this.skyTraffic.length = 0;
  }

  private readonly resize = (): void => {
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;
    this.camera.aspect = width / Math.max(1, height);
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
  };

  private syncWorld(world: World, deltaSeconds: number): void {
    for (const object of world.objects) {
      const mesh = this.objectMeshes.get(object.id);
      if (!mesh) {
        continue;
      }

      mesh.visible = object.active || Boolean(object.swallowAnimation);
      mesh.position.copy(object.position);
      mesh.rotation.copy(object.rotation);
      mesh.scale.setScalar(object.swallowScale * object.temporaryScale);
    }

    for (const powerUp of world.powerUps) {
      const mesh = this.powerUpMeshes.get(powerUp.id);
      if (!mesh) continue;
      mesh.visible = powerUp.active;
      mesh.position.set(powerUp.position.x, powerUp.position.y + Math.sin(powerUp.rotation * 1.6) * 0.14, powerUp.position.z);
      mesh.rotation.y = powerUp.rotation;
      mesh.rotation.x = Math.sin(powerUp.rotation) * 0.22;
      const label = this.powerUpLabels.get(powerUp.id);
      if (label) {
        label.visible = powerUp.active;
        label.position.set(powerUp.position.x, powerUp.position.y + 1.58, powerUp.position.z);
      }
    }
  }

  private disposeSprite(sprite: THREE.Sprite): void {
    const material = sprite.material;
    if (material.map) {
      material.map.dispose();
    }
    material.dispose();
  }

}
