import * as THREE from 'three';
import type { Player } from '../game/Player';
import type { PlayerManager } from '../game/PlayerManager';
import type { World } from '../game/World';
import type { WorldObject } from '../game/WorldObject';
import type { DayNightMode, GraphicsQuality } from '../shared/types';
import type { LanguageCode } from '../shared/types';
import { powerUpLabelKey, t } from '../i18n/I18n';
import { trafficSignalState, type TrafficSignalState } from '../game/TrafficSignalSystem';
import { CLEAR_NATURAL_DISASTER, type NaturalDisasterSnapshot } from '../game/NaturalDisasterSystem';
import { AdSurfaceRenderer } from './AdSurfaceRenderer';
import { CameraController } from './CameraController';
import { HoleRenderer } from './HoleRenderer';
import { NameLabelRenderer } from './NameLabelRenderer';
import { ObjectFactory } from './ObjectFactory';

function isLikelyLowPowerDevice(): boolean {
  const navigatorWithMemory = navigator as Navigator & { deviceMemory?: number };
  return (
    window.devicePixelRatio >= 2.5 ||
    (typeof navigator.hardwareConcurrency === 'number' && navigator.hardwareConcurrency <= 4) ||
    (typeof navigatorWithMemory.deviceMemory === 'number' && navigatorWithMemory.deviceMemory <= 4)
  );
}

export class SceneManager {
  readonly scene = new THREE.Scene();
  readonly camera = new THREE.PerspectiveCamera(58, 1, 0.1, 1200);
  readonly renderer = new THREE.WebGLRenderer({
    antialias: !isLikelyLowPowerDevice(),
    alpha: false,
    powerPreference: 'high-performance',
    stencil: true
  });
  private readonly objectFactory = new ObjectFactory();
  private readonly cameraController = new CameraController();
  private readonly holeRenderer = new HoleRenderer(this.scene);
  private readonly labelRenderer = new NameLabelRenderer();
  private readonly adSurfaceRenderer = new AdSurfaceRenderer(this.scene);
  private readonly worldRoot = new THREE.Group();
  private readonly weatherRoot = new THREE.Group();
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
  private readonly cityLightMeshes: THREE.Mesh[] = [];
  private readonly cityPointLights: Array<{
    light: THREE.PointLight | THREE.SpotLight;
    dayIntensity: number;
    nightIntensity: number;
    priority: number;
    active: boolean;
  }> = [];
  private readonly trafficSignalLamps: Array<{
    mesh: THREE.Mesh;
    signalId: string;
    state: TrafficSignalState;
  }> = [];
  private ambientLight!: THREE.HemisphereLight;
  private sunLight!: THREE.DirectionalLight;
  private skyElapsed = 0;
  private dayNightElapsed = 0;
  private dayNightMode: DayNightMode = 'cycle';
  private weatherElapsed = 0;
  private lightSelectionAccumulator = 999;
  private adaptivePixelRatioScale = 1;
  private firstCameraFrame = true;
  private language: LanguageCode = 'en';
  private currentGraphicsQuality: GraphicsQuality = 'balanced';
  private currentDisaster: NaturalDisasterSnapshot = CLEAR_NATURAL_DISASTER;
  private rainPoints!: THREE.Points<THREE.BufferGeometry, THREE.PointsMaterial>;
  private rainPositions!: Float32Array;
  private rainVelocities!: Float32Array;
  private lightningLight!: THREE.DirectionalLight;
  private readonly tempLightPosition = new THREE.Vector3();

  constructor(private readonly container: HTMLElement) {
    this.scene.background = new THREE.Color('#0b2330');
    this.applyRendererPixelRatio();
    this.renderer.autoClearStencil = true;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.container.appendChild(this.renderer.domElement);
    this.scene.add(this.worldRoot, this.skyRoot, this.weatherRoot);
    this.setupLights();
    this.setupWeather();
    this.setupSkyTraffic();
    this.setGraphicsQuality('balanced');
    this.resize();
    window.addEventListener('resize', this.resize);
  }

  loadWorld(world: World, language: LanguageCode = this.language): void {
    this.clearWorld();
    this.language = language;
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
      this.collectCityLightMeshes(mesh);
      this.worldRoot.add(mesh);
    }
    this.cityPointLights.sort((a, b) => b.priority - a.priority);

    for (const powerUp of world.powerUps) {
      const mesh = this.objectFactory.createPowerUpMesh(powerUp);
      mesh.position.copy(powerUp.position);
      powerUp.mesh = mesh;
      this.powerUpMeshes.set(powerUp.id, mesh);
      this.worldRoot.add(mesh);
      const label = this.labelRenderer.createLabel(t(this.language, powerUpLabelKey(powerUp.type)), powerUp.color);
      label.scale.set(6.65, 1.68, 1);
      this.powerUpLabels.set(powerUp.id, label);
      this.scene.add(label);
    }

    this.adSurfaceRenderer.setSurfaces(world.mapData.adSurfaces);
  }

  setGraphicsQuality(quality: GraphicsQuality): void {
    this.currentGraphicsQuality = quality;
    this.adaptivePixelRatioScale = 1;
    this.applyRendererPixelRatio();
    this.renderer.shadowMap.enabled = quality === 'quality';
    this.renderer.shadowMap.type = quality === 'quality' ? THREE.PCFSoftShadowMap : THREE.BasicShadowMap;
    this.lightSelectionAccumulator = 999;
    this.resize();
  }

  setDayNightMode(mode: DayNightMode): void {
    this.dayNightMode = mode;
    this.lightSelectionAccumulator = 999;
    this.updateDayNight(0);
  }

  reduceRenderingCost(): boolean {
    if (this.currentGraphicsQuality !== 'performance') {
      this.currentGraphicsQuality = 'performance';
      this.adaptivePixelRatioScale = 0.92;
      this.renderer.shadowMap.enabled = false;
      this.applyRendererPixelRatio();
      this.lightSelectionAccumulator = 999;
      return true;
    }

    if (this.adaptivePixelRatioScale > 0.64) {
      this.adaptivePixelRatioScale = Math.max(0.64, this.adaptivePixelRatioScale - 0.12);
      this.applyRendererPixelRatio();
      return true;
    }

    return false;
  }

  update(
    world: World | null,
    playerManager: PlayerManager | null,
    localPlayer: Player | undefined,
    deltaSeconds: number,
    zoom = 1,
    disaster: NaturalDisasterSnapshot = CLEAR_NATURAL_DISASTER
  ): void {
    this.currentDisaster = disaster;
    this.updateDayNight(deltaSeconds);
    if (world) {
      this.syncWorld(world, deltaSeconds);
      this.updateTrafficSignalLamps(world);
      this.adSurfaceRenderer.update(deltaSeconds, this.objectById);
    }

    if (playerManager) {
      this.holeRenderer.update(playerManager.all());
    }

    this.cameraController.update(this.camera, localPlayer, deltaSeconds, this.firstCameraFrame, zoom);
    this.applyDisasterCameraShake(deltaSeconds);
    this.updateWeather(deltaSeconds);
    this.updateSkyTraffic(deltaSeconds, world, zoom);
    this.firstCameraFrame = false;
  }

  updateDeathDive(
    world: World,
    playerManager: PlayerManager,
    attacker: Player,
    deltaSeconds: number,
    elapsedSeconds: number,
    disaster: NaturalDisasterSnapshot = CLEAR_NATURAL_DISASTER
  ): void {
    this.currentDisaster = disaster;
    this.updateDayNight(deltaSeconds);
    this.syncWorld(world, deltaSeconds);
    this.updateTrafficSignalLamps(world);
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
    this.applyDisasterCameraShake(deltaSeconds);
    this.updateWeather(deltaSeconds);
    this.updateSkyTraffic(deltaSeconds, world, 1.2);
  }

  updateMenuPreview(world: World, deltaSeconds: number, elapsedSeconds: number): void {
    this.currentDisaster = CLEAR_NATURAL_DISASTER;
    this.updateDayNight(deltaSeconds);
    this.syncWorld(world, deltaSeconds);
    this.updateTrafficSignalLamps(world);
    this.adSurfaceRenderer.update(deltaSeconds, this.objectById);
    this.holeRenderer.update([]);

    const half = world.halfExtent;
    const span = half * 1.8;
    const z = -half * 0.9 + ((elapsedSeconds * 10.5) % span);
    const x = Math.sin(elapsedSeconds * 0.16) * Math.min(18, half * 0.22);
    this.renderer.domElement.dataset.menuPreview = `${elapsedSeconds.toFixed(2)}:${z.toFixed(2)}`;
    this.camera.position.set(x, 15.5, z - 20);
    this.camera.lookAt(x * 0.42, 1.4, z + 28);
    this.updateWeather(deltaSeconds);
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
    this.cityLightMeshes.length = 0;
    this.cityPointLights.length = 0;
    this.trafficSignalLamps.length = 0;
  }

  dispose(): void {
    window.removeEventListener('resize', this.resize);
    this.clearWorld();
    this.holeRenderer.dispose();
    this.disposeSkyTraffic();
    this.disposeWeather();
    this.objectFactory.dispose();
    this.renderer.dispose();
  }

  private setupLights(): void {
    this.ambientLight = new THREE.HemisphereLight('#d7f6ff', '#1d241e', 1.5);
    this.scene.add(this.ambientLight);

    this.sunLight = new THREE.DirectionalLight('#ffffff', 2.1);
    this.sunLight.position.set(34, 58, 28);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.set(1024, 1024);
    this.sunLight.shadow.camera.near = 1;
    this.sunLight.shadow.camera.far = 160;
    this.sunLight.shadow.camera.left = -85;
    this.sunLight.shadow.camera.right = 85;
    this.sunLight.shadow.camera.top = 85;
    this.sunLight.shadow.camera.bottom = -85;
    this.scene.add(this.sunLight);

    this.lightningLight = new THREE.DirectionalLight('#dbeafe', 0);
    this.lightningLight.position.set(-18, 42, 24);
    this.scene.add(this.lightningLight);
  }

  private setupWeather(): void {
    const count = 520;
    this.rainPositions = new Float32Array(count * 3);
    this.rainVelocities = new Float32Array(count);
    for (let i = 0; i < count; i += 1) {
      this.resetRainDrop(i, 28);
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(this.rainPositions, 3));
    const material = new THREE.PointsMaterial({
      color: '#bde7ff',
      size: 0.095,
      transparent: true,
      opacity: 0,
      depthWrite: false
    });
    this.rainPoints = new THREE.Points(geometry, material);
    this.rainPoints.frustumCulled = false;
    this.rainPoints.visible = false;
    this.weatherRoot.add(this.rainPoints);
  }

  private updateDayNight(deltaSeconds: number): void {
    this.dayNightElapsed += deltaSeconds;
    this.lightSelectionAccumulator += deltaSeconds;
    const cycleSeconds = 150;
    const phase = (this.dayNightElapsed / cycleSeconds + 0.18) % 1;
    const cycleAngle = phase * Math.PI * 2;
    const angle = this.dayNightMode === 'day'
      ? Math.PI * 0.42
      : this.dayNightMode === 'night'
        ? Math.PI * 1.5
        : cycleAngle;
    const sunHeight = Math.sin(angle);
    const dayFactor = this.dayNightMode === 'day'
      ? 1
      : this.dayNightMode === 'night'
        ? 0
        : THREE.MathUtils.smoothstep(sunHeight, -0.14, 0.42);
    const nightFactor = 1 - dayFactor;
    const twilightFactor = this.dayNightMode === 'cycle'
      ? Math.max(0, 1 - Math.abs(sunHeight) * 3.1) * 0.32
      : 0;

    const daySky = new THREE.Color('#8bc7df');
    const twilightSky = new THREE.Color('#624761');
    const nightSky = new THREE.Color('#0b1b2a');
    const sky = nightSky.clone().lerp(daySky, dayFactor).lerp(twilightSky, twilightFactor);
    const stormDarkening = this.currentDisaster.type === 'thunderstorm'
      ? this.currentDisaster.intensity * 0.42
      : this.currentDisaster.type === 'rain'
        ? this.currentDisaster.intensity * 0.18
        : 0;
    if (stormDarkening > 0) {
      sky.lerp(new THREE.Color('#182432'), stormDarkening);
    }
    this.scene.background = sky;
    if (this.scene.fog) {
      this.scene.fog.color.copy(sky).lerp(new THREE.Color('#1d292b'), 0.18 + stormDarkening * 0.24);
    }

    this.ambientLight.intensity = THREE.MathUtils.lerp(0.58, 1.55, dayFactor);
    this.ambientLight.color.lerpColors(new THREE.Color('#89a6c7'), new THREE.Color('#d7f6ff'), dayFactor);
    this.ambientLight.groundColor.lerpColors(new THREE.Color('#15202a'), new THREE.Color('#1d241e'), dayFactor);

    this.sunLight.intensity = THREE.MathUtils.lerp(0.12, 2.1, dayFactor) * (1 - stormDarkening * 0.52);
    this.sunLight.color.lerpColors(new THREE.Color('#7aa1ff'), new THREE.Color('#fff7dc'), dayFactor);
    this.sunLight.position.set(Math.cos(angle) * 62, Math.max(6, sunHeight * 72), Math.sin(angle + 0.35) * 58);
    this.lightningLight.intensity = this.currentDisaster.lightningFlash * 1.9;

    const lightFactor = THREE.MathUtils.smoothstep(nightFactor, 0.18, 0.86);
    for (const mesh of this.cityLightMeshes) {
      const data = mesh.userData.cityLight ?? this.materialCityLightData(mesh.material);
      if (!data) {
        continue;
      }
      const opacity = THREE.MathUtils.lerp(data.dayOpacity, data.nightOpacity, lightFactor);
      mesh.visible = opacity > 0.012;
      const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      for (const material of materials) {
        material.transparent = true;
        material.opacity = opacity;
      }
    }

    if (this.lightSelectionAccumulator >= 0.24) {
      this.updateCityPointLightSelection();
      this.lightSelectionAccumulator = 0;
    }
    for (const entry of this.cityPointLights) {
      const intensity = THREE.MathUtils.lerp(entry.dayIntensity, entry.nightIntensity, lightFactor);
      const active = entry.active && intensity > 0.01;
      entry.light.visible = active;
      entry.light.intensity = active ? intensity : 0;
    }
  }

  private updateWeather(deltaSeconds: number): void {
    this.weatherElapsed += deltaSeconds;
    const precipitation = this.currentDisaster.precipitation;
    const isMeteor = this.currentDisaster.type === 'meteorShower';
    if (precipitation <= 0.02 && !isMeteor) {
      this.rainPoints.visible = false;
      this.rainPoints.material.opacity = 0;
      return;
    }

    const maxDrops = this.currentGraphicsQuality === 'performance'
      ? 72
      : this.currentGraphicsQuality === 'quality'
        ? 320
        : 150;
    const activeDrops = Math.max(0, Math.min(maxDrops, Math.floor(maxDrops * Math.max(precipitation, isMeteor ? 0.42 : 0))));
    const positions = this.rainPositions;
    const range = isMeteor ? 86 : 58;
    const verticalSpeed = isMeteor ? 34 : 21 + precipitation * 15;
    const wind = this.currentDisaster.wind * (isMeteor ? 12 : 5);
    const cameraX = this.camera.position.x;
    const cameraZ = this.camera.position.z;

    this.rainPoints.visible = activeDrops > 0;
    this.rainPoints.material.opacity = isMeteor
      ? 0.72 * this.currentDisaster.intensity
      : THREE.MathUtils.clamp(0.18 + precipitation * 0.5, 0, 0.72);
    this.rainPoints.material.color.set(isMeteor ? '#ffb86b' : '#bde7ff');
    this.rainPoints.material.size = isMeteor ? 0.16 : 0.095;
    this.rainPoints.position.set(cameraX, 0, cameraZ);

    for (let i = 0; i < activeDrops; i += 1) {
      const offset = i * 3;
      positions[offset] += wind * deltaSeconds;
      positions[offset + 1] -= verticalSpeed * this.rainVelocities[i] * deltaSeconds;
      positions[offset + 2] += (isMeteor ? -verticalSpeed * 0.32 : 0) * deltaSeconds;
      if (
        positions[offset + 1] < 0.4 ||
        positions[offset] < -range ||
        positions[offset] > range ||
        positions[offset + 2] < -range ||
        positions[offset + 2] > range
      ) {
        this.resetRainDrop(i, range);
        if (isMeteor) {
          positions[offset] -= range * 0.32;
          positions[offset + 2] += range * 0.45;
        }
      }
    }

    for (let i = activeDrops; i < this.rainVelocities.length; i += 1) {
      const offset = i * 3;
      positions[offset + 1] = -200;
    }

    this.rainPoints.geometry.attributes.position.needsUpdate = true;
  }

  private resetRainDrop(index: number, range: number): void {
    const offset = index * 3;
    this.rainPositions[offset] = THREE.MathUtils.randFloatSpread(range * 2);
    this.rainPositions[offset + 1] = THREE.MathUtils.randFloat(6, 34);
    this.rainPositions[offset + 2] = THREE.MathUtils.randFloatSpread(range * 2);
    this.rainVelocities[index] = THREE.MathUtils.randFloat(0.72, 1.35);
  }

  private applyDisasterCameraShake(deltaSeconds: number): void {
    const shake = this.currentDisaster.cameraShake;
    if (shake <= 0.01) {
      return;
    }
    const qualityScale = this.currentGraphicsQuality === 'performance' ? 0.6 : 1;
    const amount = shake * qualityScale * 0.46;
    const t = this.weatherElapsed * 38;
    this.camera.position.x += Math.sin(t * 1.11) * amount * deltaSeconds * 9;
    this.camera.position.y += Math.sin(t * 1.47 + 1.4) * amount * deltaSeconds * 4;
    this.camera.position.z += Math.cos(t * 0.92) * amount * deltaSeconds * 9;
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

  private disposeWeather(): void {
    this.rainPoints.geometry.dispose();
    this.rainPoints.material.dispose();
    this.weatherRoot.clear();
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
      this.objectFactory.updateWorldObjectVisual(mesh, object);
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

  private collectCityLightMeshes(object: THREE.Object3D): void {
    object.traverse((child) => {
      const pointLightData = child.userData.cityPointLight as {
        dayIntensity?: number;
        nightIntensity?: number;
        priority?: number;
      } | undefined;
      if ((child instanceof THREE.PointLight || child instanceof THREE.SpotLight) && pointLightData) {
        const cityLight = child;
        cityLight.visible = false;
        this.cityPointLights.push({
          light: cityLight,
          dayIntensity: pointLightData.dayIntensity ?? 0,
          nightIntensity: pointLightData.nightIntensity ?? 0.4,
          priority: pointLightData.priority ?? 0,
          active: false
        });
        return;
      }

      const mesh = child as THREE.Mesh;
      if (!mesh.isMesh) {
        return;
      }
      if (mesh.userData.cityLight || this.materialCityLightData(mesh.material)) {
        this.cityLightMeshes.push(mesh);
      }
      const lamp = mesh.userData.trafficLamp as { signalId?: string; state?: TrafficSignalState } | undefined;
      if (lamp?.signalId && (lamp.state === 'red' || lamp.state === 'yellow' || lamp.state === 'green')) {
        this.trafficSignalLamps.push({ mesh, signalId: lamp.signalId, state: lamp.state });
      }
    });
  }

  private cityPointLightLimit(): number {
    if (this.currentGraphicsQuality === 'performance') {
      return 5;
    }
    if (this.currentGraphicsQuality === 'quality') {
      return 34;
    }
    return 16;
  }

  private applyRendererPixelRatio(): void {
    const qualityBase = this.currentGraphicsQuality === 'performance'
      ? 0.95
      : this.currentGraphicsQuality === 'quality'
        ? 1.45
        : 1.08;
    const lowPowerCap = isLikelyLowPowerDevice() ? 1 : 1.45;
    const pixelRatio = Math.min(window.devicePixelRatio, lowPowerCap, qualityBase) * this.adaptivePixelRatioScale;
    this.renderer.setPixelRatio(Math.max(0.58, pixelRatio));
  }

  private updateCityPointLightSelection(): void {
    const limit = this.cityPointLightLimit();
    if (limit <= 0 || !this.cityPointLights.length) {
      for (const entry of this.cityPointLights) {
        entry.active = false;
      }
      return;
    }

    const cameraX = this.camera.position.x;
    const cameraZ = this.camera.position.z;
    const scored = this.cityPointLights.map((entry) => {
      entry.light.getWorldPosition(this.tempLightPosition);
      const dx = this.tempLightPosition.x - cameraX;
      const dz = this.tempLightPosition.z - cameraZ;
      const distanceSq = dx * dx + dz * dz;
      return {
        entry,
        score: entry.priority * 9000 - distanceSq
      };
    });
    scored.sort((a, b) => b.score - a.score);
    for (const entry of this.cityPointLights) {
      entry.active = false;
    }
    for (let index = 0; index < Math.min(limit, scored.length); index += 1) {
      scored[index].entry.active = true;
    }
  }

  private updateTrafficSignalLamps(world: World): void {
    if (!this.trafficSignalLamps.length) {
      return;
    }

    const signals = new Map(world.mapData.trafficSignals.map((signal) => [signal.id, signal]));
    for (const lamp of this.trafficSignalLamps) {
      const signal = signals.get(lamp.signalId);
      if (!signal) {
        continue;
      }

      const active = trafficSignalState(signal, world.trafficTimeSeconds) === lamp.state;
      const material = lamp.mesh.material as THREE.Material;
      material.transparent = true;
      material.opacity = active ? 0.98 : 0.18;
      lamp.mesh.scale.setScalar(active ? 1.16 : 0.92);
    }
  }

  private materialCityLightData(
    material: THREE.Material | THREE.Material[]
  ): { dayOpacity: number; nightOpacity: number } | null {
    const materials = Array.isArray(material) ? material : [material];
    for (const candidate of materials) {
      const data = candidate.userData.cityLight as { dayOpacity?: number; nightOpacity?: number } | undefined;
      if (data && typeof data.dayOpacity === 'number' && typeof data.nightOpacity === 'number') {
        return { dayOpacity: data.dayOpacity, nightOpacity: data.nightOpacity };
      }
    }
    return null;
  }

  private disposeSprite(sprite: THREE.Sprite): void {
    const material = sprite.material;
    if (material.map) {
      material.map.dispose();
    }
    material.dispose();
  }

}
