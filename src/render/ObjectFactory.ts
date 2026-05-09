import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import {
  ARENA_CORNER_CUT_RATIO,
  ARENA_MIN_CORNER_CUT
} from '../shared/constants';
import { getCustomObjectVariantById, getPrebuildModelAsset } from '../admin/PrebuildAssetRegistry';
import type { RoadSegment, SurfaceSegment } from '../shared/types';
import type { PowerUp } from '../game/PowerUp';
import type { WorldObject } from '../game/WorldObject';

export class ObjectFactory {
  private readonly materialCache = new Map<string, THREE.Material>();
  private readonly glowTextureCache = new Map<string, THREE.CanvasTexture>();
  private readonly gltfLoader = new GLTFLoader();
  private readonly customModelCache = new Map<string, Promise<THREE.Group>>();

  createGround(halfExtent: number): THREE.Mesh {
    const geometry = this.createArenaShapeGeometry(halfExtent);
    const material = this.createTerrainCutoutMaterial('#263228', 0.95, 0);
    const ground = new THREE.Mesh(geometry, material);
    ground.position.y = 0.005;
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    return ground;
  }

  createWater(halfExtent: number): THREE.Group {
    const group = new THREE.Group();
    const waterGeometry = new THREE.PlaneGeometry(halfExtent * 5.2, halfExtent * 5.2, 1, 1);
    const waterMaterial = this.createTerrainCutoutMaterial('#155a73', 0.42, 0.18);
    waterMaterial.emissive.set('#063345');
    waterMaterial.emissiveIntensity = 0.25;
    const water = new THREE.Mesh(waterGeometry, waterMaterial);
    water.rotation.x = -Math.PI / 2;
    water.position.y = -0.1;

      const shoreMaterial = this.createTerrainCutoutMaterial('#8aa79d', 0.88, 0.02);
      const edgeThickness = 2.6;
    for (const segment of this.createArenaEdgeSegments(halfExtent)) {
      const shore = new THREE.Mesh(
        new THREE.BoxGeometry(edgeThickness, 0.08, segment.length + edgeThickness * 0.8),
        shoreMaterial
      );
      shore.position.set(
        segment.centerX + segment.outwardX * edgeThickness * 0.45,
        0.045,
        segment.centerZ + segment.outwardZ * edgeThickness * 0.45
      );
      shore.rotation.y = segment.rotationY;
      group.add(shore);
    }

    group.add(water);
    return group;
  }

  createRoad(road: RoadSegment): THREE.Mesh {
    const geometry = new THREE.BoxGeometry(road.width, 0.035, road.length);
    const material = this.createTerrainCutoutMaterial('#1e2430', 0.9, 0.02);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(road.x, 0.025, road.z);
    mesh.rotation.y = road.rotationY;
    mesh.receiveShadow = true;
    return mesh;
  }

  createSurface(surface: SurfaceSegment): THREE.Object3D {
    if (surface.kind === 'crosswalk') {
      return this.createCrosswalk(surface);
    }
    if (surface.kind === 'plaza') {
      return this.createPlaza(surface);
    }

    const geometry = new THREE.BoxGeometry(surface.width, 0.04, surface.length);
    const color =
      surface.kind === 'sidewalk'
        ? '#747c77'
        : '#f6f4d7';
    const material = this.createTerrainCutoutMaterial(color, surface.kind === 'sidewalk' ? 0.86 : 0.58, 0.02);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(surface.x, surface.kind === 'sidewalk' ? 0.06 : 0.08, surface.z);
    mesh.rotation.y = surface.rotationY;
    mesh.receiveShadow = true;
    return mesh;
  }

  private createCrosswalk(surface: SurfaceSegment): THREE.Group {
    const group = new THREE.Group();
    const material = this.createTerrainCutoutMaterial('#e7edf1', 0.58, 0.02);
    const stripeCount = Math.max(4, Math.floor(surface.length / 0.74));
    const stripeLength = surface.length / (stripeCount * 2.1);
    const spacing = surface.length / stripeCount;
    for (let i = 0; i < stripeCount; i += 1) {
      const stripe = new THREE.Mesh(new THREE.BoxGeometry(surface.width, 0.05, stripeLength), material);
      stripe.position.z = -surface.length * 0.5 + spacing * (i + 0.5);
      stripe.receiveShadow = true;
      group.add(stripe);
    }
    group.position.set(surface.x, 0.085, surface.z);
    group.rotation.y = surface.rotationY;
    return group;
  }

  private createPlaza(surface: SurfaceSegment): THREE.Mesh {
    const geometry = new THREE.BoxGeometry(surface.width, 0.045, surface.length);
    const material = this.createTerrainCutoutMaterial('#66736c', 0.88, 0.02);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(surface.x, 0.045, surface.z);
    mesh.rotation.y = surface.rotationY;
    mesh.receiveShadow = true;
    return mesh;
  }

  createBoundary(halfExtent: number): THREE.Group {
    const group = new THREE.Group();
    const material = this.getMaterial('#6f8083', 0.78, 0.03);
    const thickness = 1;
    const height = 0.35;
    for (const segment of this.createArenaEdgeSegments(halfExtent)) {
      const wall = new THREE.Mesh(
        new THREE.BoxGeometry(thickness, height, segment.length + thickness * 0.75),
        material
      );
      wall.position.set(
        segment.centerX + segment.outwardX * thickness * 0.5,
        height / 2 + 0.02,
        segment.centerZ + segment.outwardZ * thickness * 0.5
      );
      wall.rotation.y = segment.rotationY;
      group.add(wall);
    }
    return group;
  }

  private createArenaShapeGeometry(halfExtent: number): THREE.ShapeGeometry {
    const shape = new THREE.Shape();
    const points = this.createArenaPolygonPoints(halfExtent);
    shape.moveTo(points[0].x, points[0].z);
    for (const point of points.slice(1)) {
      shape.lineTo(point.x, point.z);
    }
    shape.closePath();
    return new THREE.ShapeGeometry(shape);
  }

  private createArenaEdgeSegments(halfExtent: number): Array<{
    centerX: number;
    centerZ: number;
    length: number;
    rotationY: number;
    outwardX: number;
    outwardZ: number;
  }> {
    const points = this.createArenaPolygonPoints(halfExtent);
    return points.map((start, index) => {
      const end = points[(index + 1) % points.length];
      const dx = end.x - start.x;
      const dz = end.z - start.z;
      const length = Math.max(0.001, Math.hypot(dx, dz));
      return {
        centerX: (start.x + end.x) * 0.5,
        centerZ: (start.z + end.z) * 0.5,
        length,
        rotationY: Math.atan2(dx, dz),
        outwardX: dz / length,
        outwardZ: -dx / length
      };
    });
  }

  private createArenaPolygonPoints(halfExtent: number): Array<{ x: number; z: number }> {
    const cut = Math.min(halfExtent * 0.28, Math.max(ARENA_MIN_CORNER_CUT, halfExtent * ARENA_CORNER_CUT_RATIO));
    return [
      { x: -halfExtent + cut, z: -halfExtent },
      { x: halfExtent - cut, z: -halfExtent },
      { x: halfExtent, z: -halfExtent + cut },
      { x: halfExtent, z: halfExtent - cut },
      { x: halfExtent - cut, z: halfExtent },
      { x: -halfExtent + cut, z: halfExtent },
      { x: -halfExtent, z: halfExtent - cut },
      { x: -halfExtent, z: -halfExtent + cut }
    ];
  }

  createWorldObjectMesh(object: WorldObject): THREE.Object3D {
    let fallback: THREE.Object3D;
    switch (object.kind) {
      case 'tree':
        fallback = this.createTree(object);
        break;
      case 'bench':
        fallback = this.createBench(object);
        break;
      case 'hydrant':
        fallback = this.createHydrant(object);
        break;
      case 'trash':
        fallback = this.createTrash(object);
        break;
      case 'pedestrian':
        fallback = this.createPedestrian(object);
        break;
      case 'post':
        fallback = this.createPost(object);
        break;
      case 'cone':
        fallback = this.createCone(object);
        break;
      case 'mailbox':
        fallback = this.createMailbox(object);
        break;
      case 'bike':
        fallback = this.createBike(object);
        break;
      case 'planter':
        fallback = this.createPlanter(object);
        break;
      case 'kiosk':
        fallback = this.createKiosk(object);
        break;
      case 'fountain':
        fallback = this.createFountain(object);
        break;
      case 'statue':
        fallback = this.createStatue(object);
        break;
      case 'rock':
        fallback = this.createRock(object);
        break;
      case 'car':
      case 'truck':
      case 'bus':
      case 'emergency':
      case 'trailerTruck':
        fallback = this.createVehicle(object);
        break;
      case 'trafficLight':
        fallback = this.createTrafficLight(object);
        break;
      case 'billboard':
      case 'screen':
        fallback = this.createAdFrame(object);
        break;
      case 'building':
      case 'structure':
        fallback = this.createBuilding(object);
        break;
      case 'crate':
      default:
        fallback = this.createBoxObject(object);
        break;
    }
    return this.createPrebuildModelWrapper(fallback, object);
  }

  updateWorldObjectVisual(root: THREE.Object3D, object: WorldObject): void {
    this.updateUtilityLightState(root, object);

    if (object.category !== 'building') {
      return;
    }

    const fractureLevel = object.fractureLevel;
    const renderVisible = object.active || Boolean(object.swallowAnimation);
    root.traverse((child) => {
      const mesh = child as THREE.Mesh;
      const solid = child.userData.fractureSolid as 'body' | 'roof' | undefined;
      if (solid) {
        const baseY = Number(child.userData.baseY ?? child.position.y);
        const t = THREE.MathUtils.smoothstep(fractureLevel, 0.05, 0.9);
        child.visible = renderVisible && fractureLevel < (solid === 'roof' ? 0.92 : 0.98);
        child.position.y = baseY - object.size.y * (solid === 'roof' ? 0.03 : 0.08) * t;
        if (mesh.isMesh) {
          mesh.scale.set(1 + t * 0.025, 1 - t * (solid === 'roof' ? 0.06 : 0.22), 1 + t * 0.025);
        }
        if (solid === 'roof') {
          child.rotation.x = Number(child.userData.baseRotX ?? 0) + t * 0.18;
          child.rotation.z = Number(child.userData.baseRotZ ?? 0) - t * 0.14;
        }
      }

      const chunk = child.userData.fractureChunk as {
        threshold?: number;
        baseX?: number;
        baseY?: number;
        baseZ?: number;
        spreadX?: number;
        spreadZ?: number;
        drop?: number;
        rotX?: number;
        rotY?: number;
        rotZ?: number;
      } | undefined;
      if (chunk) {
        const threshold = chunk.threshold ?? 0.2;
        const t = THREE.MathUtils.smoothstep(fractureLevel, threshold, 1);
        child.visible = renderVisible && t > 0.01;
        child.position.set(
          (chunk.baseX ?? 0) + (chunk.spreadX ?? 0) * t,
          (chunk.baseY ?? 0) - (chunk.drop ?? 0) * t,
          (chunk.baseZ ?? 0) + (chunk.spreadZ ?? 0) * t
        );
        child.rotation.set(
          (chunk.rotX ?? 0) * t,
          (chunk.rotY ?? 0) * t,
          (chunk.rotZ ?? 0) * t
        );
      }

      if (child.userData.buildingFacade) {
        child.visible = renderVisible && fractureLevel < 0.72;
      }
    });
  }

  private updateUtilityLightState(root: THREE.Object3D, object: WorldObject): void {
    if (object.kind !== 'post' && object.kind !== 'trafficLight') {
      return;
    }

    const off = object.utilityLightFailed;
    const flicker = off ? 0 : this.utilityFlickerFor(object);
    root.traverse((child) => {
      if (child instanceof THREE.PointLight || child instanceof THREE.SpotLight) {
        if (child.userData.cityPointLight) {
          child.userData.cityLightOff = off;
          child.userData.cityLightFlicker = flicker;
        }
        return;
      }

      const mesh = child as THREE.Mesh;
      if (!mesh.isMesh) {
        return;
      }

      const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      const hasCityLight = Boolean(mesh.userData.cityLight || materials.some((material) => material.userData.cityLight));
      if (!hasCityLight) {
        return;
      }
      mesh.userData.cityLightOff = off;
      mesh.userData.cityLightFlicker = flicker;
    });
  }

  private utilityFlickerFor(object: WorldObject): number {
    if (!object.physicsToppled) {
      return 1;
    }

    const t = object.physicsToppledSeconds;
    if (t < 0.18) {
      return 1;
    }

    const blink = Math.sin(t * 34) + Math.sin(t * 19.5) * 0.7;
    const decay = THREE.MathUtils.clamp(1 - t / 2.35, 0.1, 1);
    return blink > 0.2 ? THREE.MathUtils.clamp(decay, 0.12, 1) : 0;
  }

  disposeObject(object: THREE.Object3D): void {
    object.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (mesh.geometry) {
        mesh.geometry.dispose();
      }
      if (mesh.material) {
        const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        for (const material of materials) {
          if (!this.isCachedMaterial(material)) {
            material.dispose();
          }
        }
      }
    });
  }

  dispose(): void {
    for (const material of this.materialCache.values()) {
      material.dispose();
    }
    this.materialCache.clear();
    for (const texture of this.glowTextureCache.values()) {
      texture.dispose();
    }
    this.glowTextureCache.clear();
    this.customModelCache.clear();
  }

  private createPrebuildModelWrapper(fallback: THREE.Object3D, object: WorldObject): THREE.Object3D {
    const variantAsset = getCustomObjectVariantById(object.variantId);
    const modelAsset = variantAsset?.source ? variantAsset : getPrebuildModelAsset(object.kind);
    if (!modelAsset?.source || (modelAsset.format !== 'glb' && modelAsset.format !== 'gltf')) {
      return fallback;
    }

    const wrapper = new THREE.Group();
    wrapper.userData.prebuildModel = modelAsset.id;
    fallback.userData.prebuildFallback = true;
    wrapper.add(fallback);

    this.loadCustomModel(modelAsset.source)
      .then((modelTemplate) => {
        const model = modelTemplate.clone(true);
        this.prepareCustomModel(model);
        model.scale.setScalar(modelAsset.scale);
        model.position.y = modelAsset.offsetY;
        model.rotation.y = modelAsset.rotationY;
        fallback.visible = false;
        wrapper.add(model);
      })
      .catch(() => {
        fallback.visible = true;
      });

    return wrapper;
  }

  private loadCustomModel(source: string): Promise<THREE.Group> {
    const existing = this.customModelCache.get(source);
    if (existing) {
      return existing;
    }

    const request = new Promise<THREE.Group>((resolve, reject) => {
      this.gltfLoader.load(
        source,
        (gltf) => resolve(gltf.scene),
        undefined,
        reject
      );
    });
    this.customModelCache.set(source, request);
    return request;
  }

  private prepareCustomModel(root: THREE.Object3D): void {
    root.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (!mesh.isMesh) {
        return;
      }
      mesh.castShadow = true;
      mesh.receiveShadow = true;
    });
  }

  createPowerUpMesh(powerUp: PowerUp): THREE.Object3D {
    const group = new THREE.Group();
    const core = new THREE.Mesh(
      new THREE.OctahedronGeometry(powerUp.radius * 0.72, 0),
      new THREE.MeshStandardMaterial({
        color: powerUp.color,
        emissive: powerUp.color,
        emissiveIntensity: 0.55,
        roughness: 0.35,
        metalness: 0.2
      })
    );
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(powerUp.radius * 0.72, 0.045, 8, 28),
      new THREE.MeshBasicMaterial({ color: powerUp.color, transparent: true, opacity: 0.82 })
    );
    ring.rotation.x = Math.PI / 2;
    group.add(core, ring);
    group.userData.powerUpType = powerUp.type;
    return group;
  }

  private createBoxObject(object: WorldObject): THREE.Mesh {
    const geometry = new THREE.BoxGeometry(object.size.x, object.size.y, object.size.z);
    const mesh = new THREE.Mesh(geometry, this.getMaterial(object.color, 0.7, 0.04));
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
  }

  private createBuilding(object: WorldObject): THREE.Group {
    const group = new THREE.Group();
    const isIndustrial = object.label === 'Factory Block' || object.label === 'Warehouse';
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(object.size.x, object.size.y, object.size.z),
      this.getMaterial(object.color, 0.82, 0.06)
    );
    body.userData.fractureSolid = 'body';
    body.userData.baseY = body.position.y;
    body.castShadow = true;
    body.receiveShadow = true;

    const roof = new THREE.Mesh(
      new THREE.BoxGeometry(object.size.x * 1.04, 0.22, object.size.z * 1.04),
      this.getMaterial('#313845', 0.75, 0.08)
    );
    roof.position.y = object.size.y * 0.5 + 0.12;
    roof.userData.fractureSolid = 'roof';
    roof.userData.baseY = roof.position.y;
    roof.userData.baseRotX = roof.rotation.x;
    roof.userData.baseRotZ = roof.rotation.z;
    roof.castShadow = true;
    group.add(body, roof);
    this.addBuildingFacadeLights(group, object, isIndustrial);
    this.addBuildingGlow(group, object, isIndustrial);
    this.addRooftopDetails(group, object, isIndustrial);
    this.addBuildingFracturePieces(group, object, isIndustrial);
    return group;
  }

  private addBuildingFracturePieces(group: THREE.Group, object: WorldObject, isIndustrial: boolean): void {
    const chunkCount = Math.max(5, Math.min(14, Math.floor(object.size.y / 2.4) + 4));
    const colors = isIndustrial
      ? ['#5f686d', '#4d565b', '#69737a']
      : [object.color, '#68747a', '#59646a', '#737d82'];

    for (let index = 0; index < chunkCount; index += 1) {
      const rx = this.hashUnit(object.id, index * 11 + 1);
      const ry = this.hashUnit(object.id, index * 11 + 2);
      const rz = this.hashUnit(object.id, index * 11 + 3);
      const sideX = this.hashUnit(object.id, index * 11 + 4) < 0.5 ? -1 : 1;
      const sideZ = this.hashUnit(object.id, index * 11 + 5) < 0.5 ? -1 : 1;
      const width = THREE.MathUtils.lerp(0.42, Math.max(0.8, object.size.x * 0.24), rx);
      const height = THREE.MathUtils.lerp(0.28, Math.max(0.62, object.size.y * 0.13), ry);
      const depth = THREE.MathUtils.lerp(0.42, Math.max(0.8, object.size.z * 0.24), rz);
      const baseX = sideX * object.size.x * THREE.MathUtils.lerp(0.16, 0.43, rz);
      const baseY = -object.size.y * 0.42 + object.size.y * THREE.MathUtils.lerp(0.08, 0.78, ry);
      const baseZ = sideZ * object.size.z * THREE.MathUtils.lerp(0.16, 0.43, rx);
      const chunk = new THREE.Mesh(
        new THREE.BoxGeometry(width, height, depth),
        this.getMaterial(colors[index % colors.length], 0.88, 0.04)
      );
      chunk.position.set(baseX, baseY, baseZ);
      chunk.visible = false;
      chunk.castShadow = true;
      chunk.receiveShadow = true;
      chunk.userData.fractureChunk = {
        threshold: THREE.MathUtils.lerp(0.12, 0.64, this.hashUnit(object.id, index * 11 + 6)),
        baseX,
        baseY,
        baseZ,
        spreadX: sideX * THREE.MathUtils.lerp(0.8, object.size.x * 0.72, this.hashUnit(object.id, index * 11 + 7)),
        spreadZ: sideZ * THREE.MathUtils.lerp(0.8, object.size.z * 0.72, this.hashUnit(object.id, index * 11 + 8)),
        drop: THREE.MathUtils.lerp(0.18, Math.max(0.8, object.size.y * 0.28), this.hashUnit(object.id, index * 11 + 9)),
        rotX: THREE.MathUtils.lerp(-1.2, 1.2, this.hashUnit(object.id, index * 11 + 10)),
        rotY: THREE.MathUtils.lerp(-2.4, 2.4, this.hashUnit(object.id, index * 11 + 11)),
        rotZ: THREE.MathUtils.lerp(-1.2, 1.2, this.hashUnit(object.id, index * 11 + 12))
      };
      group.add(chunk);
    }
  }

  private createTree(object: WorldObject): THREE.Group {
    const group = new THREE.Group();
    const trunk = new THREE.Mesh(
      new THREE.CylinderGeometry(0.16, 0.22, object.size.y * 0.5, 8),
      this.getMaterial('#7b5233', 0.86, 0.02)
    );
    trunk.position.y = -object.size.y * 0.2;
    const crown = new THREE.Mesh(
      new THREE.DodecahedronGeometry(object.size.x * 0.65, 0),
      this.getMaterial(object.color, 0.88, 0.02)
    );
    crown.position.y = object.size.y * 0.12;
    trunk.castShadow = true;
    crown.castShadow = true;
    group.add(trunk, crown);
    return group;
  }

  private createPost(object: WorldObject): THREE.Group {
    const group = new THREE.Group();
    const pole = new THREE.Mesh(
      new THREE.CylinderGeometry(0.075, 0.13, object.size.y, 8),
      this.getMaterial(object.color, 0.55, 0.3)
    );
    const base = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.22, 0.18, 8),
      this.getMaterial('#717d86', 0.62, 0.22)
    );
    base.position.y = -object.size.y * 0.5 + 0.09;
    const cap = new THREE.Mesh(
      new THREE.SphereGeometry(0.12, 8, 6),
      this.getMaterial('#b6c3ce', 0.48, 0.22)
    );
    cap.position.y = object.size.y * 0.5 + 0.12;
    const arm = new THREE.Mesh(
      new THREE.BoxGeometry(1.05, 0.06, 0.06),
      this.getMaterial('#b6c3ce', 0.5, 0.2)
    );
    const lampY = object.size.y * 0.5 - 0.42;
    arm.position.set(0.47, lampY + 0.05, 0);
    const lampHead = new THREE.Mesh(
      new THREE.BoxGeometry(0.34, 0.13, 0.22),
      this.getMaterial('#2e3943', 0.52, 0.18)
    );
    lampHead.position.set(0.98, lampY, 0);
    const bulb = new THREE.Mesh(
      new THREE.SphereGeometry(0.17, 12, 8),
      this.createCityLightMaterial('#ffe4a3', 0.16, 1)
    );
    bulb.position.set(0.98, lampY - 0.13, 0);
    this.markCityLight(bulb, 0.16, 1);
    const light = this.createCityPointLight('#ffe4a3', 0.05, 3.95, 38, 1.35, 7);
    light.position.copy(bulb.position);
    const groundGlow = this.createGroundGlow('#ffd98f', 9.0, 0.045, 0.48);
    groundGlow.position.set(0.92, 0.095, 0);
    pole.castShadow = true;
    base.castShadow = true;
    cap.castShadow = true;
    arm.castShadow = true;
    lampHead.castShadow = true;
    group.add(base, pole, cap, arm, lampHead, bulb, groundGlow, light);
    return group;
  }

  private createBench(object: WorldObject): THREE.Group {
    const group = new THREE.Group();
    const material = this.getMaterial(object.color, 0.78, 0.03);
    const seat = new THREE.Mesh(new THREE.BoxGeometry(object.size.x, 0.16, object.size.z), material);
    seat.position.y = -object.size.y * 0.08;
    const back = new THREE.Mesh(new THREE.BoxGeometry(object.size.x, 0.16, 0.12), material);
    back.position.set(0, object.size.y * 0.22, -object.size.z * 0.45);
    const legMaterial = this.getMaterial('#303641', 0.7, 0.08);
    for (const x of [-object.size.x * 0.38, object.size.x * 0.38]) {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.42, 0.12), legMaterial);
      leg.position.set(x, -object.size.y * 0.34, 0);
      group.add(leg);
    }
    seat.castShadow = true;
    back.castShadow = true;
    group.add(seat, back);
    return group;
  }

  private createHydrant(object: WorldObject): THREE.Group {
    const group = new THREE.Group();
    const material = this.getMaterial(object.color, 0.45, 0.18);
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.2, object.size.y * 0.72, 10), material);
    const cap = new THREE.Mesh(new THREE.SphereGeometry(0.19, 10, 6), material);
    cap.position.y = object.size.y * 0.36;
    const side = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.46, 8), material);
    side.rotation.z = Math.PI / 2;
    side.position.y = object.size.y * 0.1;
    group.add(body, cap, side);
    return group;
  }

  private createCone(object: WorldObject): THREE.Group {
    const group = new THREE.Group();
    const cone = new THREE.Mesh(
      new THREE.ConeGeometry(object.size.x * 0.42, object.size.y, 12),
      this.getMaterial('#f97316', 0.62, 0.03)
    );
    const stripe = new THREE.Mesh(
      new THREE.CylinderGeometry(object.size.x * 0.26, object.size.x * 0.31, 0.06, 12),
      this.getMaterial('#f8fafc', 0.45, 0.02)
    );
    stripe.position.y = object.size.y * 0.12;
    cone.castShadow = true;
    group.add(cone, stripe);
    return group;
  }

  private createMailbox(object: WorldObject): THREE.Group {
    const group = new THREE.Group();
    const post = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.08, object.size.y * 0.65, 8),
      this.getMaterial('#26313c', 0.68, 0.08)
    );
    post.position.y = -object.size.y * 0.2;
    const box = new THREE.Mesh(
      new THREE.BoxGeometry(object.size.x, object.size.y * 0.42, object.size.z),
      this.getMaterial(object.color, 0.58, 0.08)
    );
    box.position.y = object.size.y * 0.22;
    const flag = new THREE.Mesh(
      new THREE.BoxGeometry(0.04, object.size.y * 0.28, 0.22),
      this.getMaterial('#f6c453', 0.44, 0.05)
    );
    flag.position.set(object.size.x * 0.52, object.size.y * 0.28, -object.size.z * 0.12);
    group.add(post, box, flag);
    return group;
  }

  private createBike(object: WorldObject): THREE.Group {
    const group = new THREE.Group();
    const tireMaterial = this.getMaterial('#111318', 0.75, 0.08);
    const frameMaterial = this.getMaterial(object.color, 0.42, 0.18);
    const wheelGeometry = new THREE.TorusGeometry(0.28, 0.035, 8, 18);
    for (const z of [-object.size.z * 0.28, object.size.z * 0.28]) {
      const wheel = new THREE.Mesh(wheelGeometry, tireMaterial);
      wheel.rotation.y = Math.PI / 2;
      wheel.position.set(0, -object.size.y * 0.18, z);
      group.add(wheel);
    }
    const frame = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.12, object.size.z * 0.72), frameMaterial);
    frame.position.y = object.size.y * 0.08;
    const handle = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.05, 0.06), frameMaterial);
    handle.position.set(0, object.size.y * 0.34, -object.size.z * 0.38);
    group.add(frame, handle);
    return group;
  }

  private createPlanter(object: WorldObject): THREE.Group {
    const group = new THREE.Group();
    const box = new THREE.Mesh(
      new THREE.BoxGeometry(object.size.x, object.size.y * 0.46, object.size.z),
      this.getMaterial('#7a5140', 0.86, 0.02)
    );
    box.position.y = -object.size.y * 0.18;
    const plant = new THREE.Mesh(
      new THREE.DodecahedronGeometry(Math.max(object.size.x, object.size.z) * 0.34, 0),
      this.getMaterial(object.color, 0.9, 0.01)
    );
    plant.position.y = object.size.y * 0.18;
    box.castShadow = true;
    plant.castShadow = true;
    group.add(box, plant);
    return group;
  }

  private createKiosk(object: WorldObject): THREE.Group {
    const group = new THREE.Group();
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(object.size.x, object.size.y * 0.78, object.size.z),
      this.getMaterial(object.color, 0.68, 0.06)
    );
    body.position.y = -object.size.y * 0.05;
    const awning = new THREE.Mesh(
      new THREE.BoxGeometry(object.size.x * 1.16, 0.16, object.size.z * 1.12),
      this.getMaterial('#2f4858', 0.58, 0.04)
    );
    awning.position.y = object.size.y * 0.42;
    const windowPane = new THREE.Mesh(
      new THREE.BoxGeometry(object.size.x * 0.58, object.size.y * 0.22, 0.04),
      this.getMaterial('#9bd6e5', 0.26, 0.1)
    );
    windowPane.position.set(0, object.size.y * 0.08, -object.size.z * 0.52);
    group.add(body, awning, windowPane);
    return group;
  }

  private createFountain(object: WorldObject): THREE.Group {
    const group = new THREE.Group();
    const stone = this.getMaterial('#a7b0ad', 0.8, 0.03);
    const basin = new THREE.Mesh(new THREE.CylinderGeometry(object.size.x * 0.5, object.size.x * 0.56, object.size.y * 0.28, 24), stone);
    basin.position.y = -object.size.y * 0.28;
    const water = new THREE.Mesh(
      new THREE.CylinderGeometry(object.size.x * 0.42, object.size.x * 0.42, 0.05, 24),
      new THREE.MeshStandardMaterial({
        color: '#5eead4',
        emissive: '#155a73',
        emissiveIntensity: 0.24,
        roughness: 0.35,
        metalness: 0.12,
        transparent: true,
        opacity: 0.82
      })
    );
    water.position.y = -object.size.y * 0.12;
    const jet = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, object.size.y * 0.58, 10), stone);
    jet.position.y = object.size.y * 0.12;
    group.add(basin, water, jet);
    return group;
  }

  private createStatue(object: WorldObject): THREE.Group {
    const group = new THREE.Group();
    const material = this.getMaterial(object.color, 0.72, 0.06);
    const base = new THREE.Mesh(new THREE.BoxGeometry(object.size.x, object.size.y * 0.22, object.size.z), material);
    base.position.y = -object.size.y * 0.38;
    const body = new THREE.Mesh(new THREE.CapsuleGeometry(object.size.x * 0.18, object.size.y * 0.48, 4, 8), material);
    body.position.y = -object.size.y * 0.02;
    const head = new THREE.Mesh(new THREE.SphereGeometry(object.size.x * 0.18, 10, 8), material);
    head.position.y = object.size.y * 0.36;
    group.add(base, body, head);
    return group;
  }

  private createTrash(object: WorldObject): THREE.Group {
    const group = new THREE.Group();
    const body = new THREE.Mesh(
      new THREE.CylinderGeometry(object.size.x * 0.45, object.size.x * 0.5, object.size.y, 8),
      this.getMaterial(object.color, 0.7, 0.08)
    );
    const lid = new THREE.Mesh(
      new THREE.BoxGeometry(object.size.x * 1.1, 0.08, object.size.z * 1.1),
      this.getMaterial('#1f2933', 0.72, 0.1)
    );
    lid.position.y = object.size.y * 0.52;
    body.castShadow = true;
    group.add(body, lid);
    return group;
  }

  private createPedestrian(object: WorldObject): THREE.Group {
    const group = new THREE.Group();
    const body = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.17, object.size.y * 0.45, 4, 8),
      this.getMaterial(object.color, 0.62, 0.04)
    );
    body.position.y = 0.02;
    const head = new THREE.Mesh(
      new THREE.SphereGeometry(0.18, 10, 8),
      this.getMaterial('#e9bd8a', 0.65, 0.02)
    );
    head.position.y = object.size.y * 0.42;
    body.castShadow = true;
    head.castShadow = true;
    group.add(body, head);
    if (this.shouldAddPedestrianFlashlight(object.id)) {
      this.addPedestrianFlashlight(group, object);
    }
    return group;
  }

  private createRock(object: WorldObject): THREE.Mesh {
    const mesh = new THREE.Mesh(
      new THREE.DodecahedronGeometry(Math.max(object.size.x, object.size.z) * 0.55, 0),
      this.getMaterial(object.color, 0.94, 0)
    );
    mesh.scale.y = 0.72;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
  }

  private createVehicle(object: WorldObject): THREE.Group {
    if (object.kind === 'bus') {
      return this.createBus(object);
    }
    if (object.kind === 'emergency') {
      return this.createEmergencyVehicle(object);
    }
    if (object.kind === 'trailerTruck') {
      return this.createTrailerTruck(object);
    }

    const group = new THREE.Group();
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(object.size.x, object.size.y * 0.65, object.size.z),
      this.getMaterial(object.color, 0.55, 0.12)
    );
    body.position.y = -object.size.y * 0.08;
    const cabin = new THREE.Mesh(
      new THREE.BoxGeometry(object.size.x * 0.72, object.size.y * 0.52, object.size.z * 0.38),
      this.getMaterial('#dce8ef', 0.4, 0.08)
    );
    cabin.position.set(0, object.size.y * 0.32, object.size.z * 0.12);

    const wheelMaterial = this.getMaterial('#111318', 0.8, 0.1);
    const wheelGeometry = new THREE.CylinderGeometry(0.23, 0.23, 0.2, 10);
    for (const x of [-object.size.x * 0.52, object.size.x * 0.52]) {
      for (const z of [-object.size.z * 0.32, object.size.z * 0.32]) {
        const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
        wheel.rotation.z = Math.PI / 2;
        wheel.position.set(x, -object.size.y * 0.36, z);
        group.add(wheel);
      }
    }

    const headlightMaterial = this.createCityLightMaterial('#fff4bc', 0.18, 1);
    const tailLightMaterial = this.createCityLightMaterial('#ff4c4c', 0.1, 0.92);
    const frontSign = this.getVehicleLightFrontSign(object);
    const rearSign = frontSign * -1;
    for (const x of [-object.size.x * 0.28, object.size.x * 0.28]) {
      const headlight = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.12, 0.05), headlightMaterial);
      headlight.position.set(x, object.size.y * 0.06, frontSign * object.size.z * 0.51);
      this.markCityLight(headlight, 0.18, 1);
      const tailLight = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.1, 0.05), tailLightMaterial);
      tailLight.position.set(x, object.size.y * 0.02, rearSign * object.size.z * 0.51);
      this.markCityLight(tailLight, 0.1, 0.92);
      group.add(headlight, tailLight);
    }
    this.addVehicleHeadlightGlow(group, object.size.x, object.size.y, object.size.z, false, frontSign);

    body.castShadow = true;
    cabin.castShadow = true;
    group.add(body, cabin);
    return group;
  }

  private createBus(object: WorldObject): THREE.Group {
    const group = new THREE.Group();
    const bodyMaterial = this.getMaterial(object.color, 0.58, 0.1);
    const body = new THREE.Mesh(new THREE.BoxGeometry(object.size.x, object.size.y * 0.72, object.size.z), bodyMaterial);
    body.position.y = -object.size.y * 0.03;
    const windowMaterial = this.getMaterial('#bde8f2', 0.28, 0.06);
    const windowBand = new THREE.Mesh(new THREE.BoxGeometry(object.size.x * 1.02, object.size.y * 0.22, object.size.z * 0.68), windowMaterial);
    windowBand.position.y = object.size.y * 0.2;
    const routeSign = new THREE.Mesh(
      new THREE.BoxGeometry(object.size.x * 0.55, object.size.y * 0.12, 0.05),
      this.createCityLightMaterial('#facc15', 0.18, 0.9)
    );
    routeSign.position.set(0, object.size.y * 0.34, this.getVehicleLightFrontSign(object) * object.size.z * 0.51);
    this.markCityLight(routeSign, 0.18, 0.9);
    this.addVehicleWheels(group, object, [-object.size.z * 0.36, object.size.z * 0.36], 0.28);
    this.addVehicleLights(group, object, object.size.x, object.size.y, object.size.z);
    body.castShadow = true;
    group.add(body, windowBand, routeSign);
    return group;
  }

  private createEmergencyVehicle(object: WorldObject): THREE.Group {
    const group = new THREE.Group();
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(object.size.x, object.size.y * 0.66, object.size.z),
      this.getMaterial(object.color, 0.48, 0.12)
    );
    body.position.y = -object.size.y * 0.06;
    const cabin = new THREE.Mesh(
      new THREE.BoxGeometry(object.size.x * 0.72, object.size.y * 0.48, object.size.z * 0.38),
      this.getMaterial('#dbeafe', 0.32, 0.08)
    );
    cabin.position.set(0, object.size.y * 0.28, object.size.z * 0.03);
    const stripeColor = object.label === 'Police Car' ? '#2563eb' : '#ef4444';
    const stripe = new THREE.Mesh(
      new THREE.BoxGeometry(object.size.x * 1.04, object.size.y * 0.12, object.size.z * 0.82),
      this.getMaterial(stripeColor, 0.46, 0.08)
    );
    stripe.position.y = object.size.y * 0.02;
    const lightbar = new THREE.Mesh(
      new THREE.BoxGeometry(object.size.x * 0.48, 0.12, 0.18),
      this.createCityLightMaterial('#60a5fa', 0.28, 1)
    );
    lightbar.position.set(0, object.size.y * 0.58, -object.size.z * 0.08);
    this.markCityLight(lightbar, 0.28, 1);
    this.addEmergencyBeacons(group, object);
    this.addVehicleWheels(group, object, [-object.size.z * 0.32, object.size.z * 0.32], 0.23);
    this.addVehicleLights(group, object, object.size.x, object.size.y, object.size.z);
    body.castShadow = true;
    cabin.castShadow = true;
    group.add(body, cabin, stripe, lightbar);
    return group;
  }

  private createTrailerTruck(object: WorldObject): THREE.Group {
    const group = new THREE.Group();
    const cabMaterial = this.getMaterial('#e56f40', 0.52, 0.1);
    const trailerMaterial = this.getMaterial(object.color, 0.66, 0.08);
    const cab = new THREE.Mesh(new THREE.BoxGeometry(object.size.x, object.size.y * 0.75, object.size.z * 0.34), cabMaterial);
    cab.position.set(0, -object.size.y * 0.04, object.size.z * 0.29);
    const trailer = new THREE.Mesh(new THREE.BoxGeometry(object.size.x * 0.94, object.size.y * 0.68, object.size.z * 0.58), trailerMaterial);
    trailer.position.set(0, -object.size.y * 0.07, -object.size.z * 0.16);
    const hitch = new THREE.Mesh(new THREE.BoxGeometry(object.size.x * 0.34, 0.12, object.size.z * 0.12), this.getMaterial('#202733', 0.7, 0.12));
    hitch.position.set(0, -object.size.y * 0.28, object.size.z * 0.11);
    this.addVehicleWheels(group, object, [-object.size.z * 0.38, -object.size.z * 0.08, object.size.z * 0.34], 0.26);
    this.addVehicleLights(group, object, object.size.x, object.size.y, object.size.z);
    cab.castShadow = true;
    trailer.castShadow = true;
    group.add(cab, trailer, hitch);
    return group;
  }

  private createTrafficLight(object: WorldObject): THREE.Group {
    const group = new THREE.Group();
    const signalId = object.trafficSignalId ?? object.id;
    const poleMaterial = this.getMaterial('#25313d', 0.56, 0.24);
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.1, object.size.y, 8), poleMaterial);
    pole.position.y = 0;
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.78, 0.07, 0.07), poleMaterial);
    arm.position.set(0.36, object.size.y * 0.36, 0);
    const box = new THREE.Mesh(
      new THREE.BoxGeometry(0.34, 0.86, 0.2),
      this.getMaterial('#101820', 0.5, 0.16)
    );
    box.position.set(0.78, object.size.y * 0.26, 0);

    const lampData: Array<{ state: 'red' | 'yellow' | 'green'; color: string; y: number }> = [
      { state: 'red', color: '#ef4444', y: 0.25 },
      { state: 'yellow', color: '#facc15', y: 0 },
      { state: 'green', color: '#22c55e', y: -0.25 }
    ];
    for (const lamp of lampData) {
      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.095, 10, 8),
        new THREE.MeshBasicMaterial({ color: lamp.color, transparent: true, opacity: 0.28 })
      );
      mesh.position.set(0.78, object.size.y * 0.26 + lamp.y, -0.112);
      mesh.userData.trafficLamp = { signalId, state: lamp.state };
      group.add(mesh);
    }
    pole.castShadow = true;
    arm.castShadow = true;
    group.add(pole, arm, box);
    return group;
  }

  private addVehicleWheels(group: THREE.Group, object: WorldObject, zPositions: number[], radius: number): void {
    const wheelMaterial = this.getMaterial('#111318', 0.8, 0.1);
    const wheelGeometry = new THREE.CylinderGeometry(radius, radius, 0.2, 10);
    for (const x of [-object.size.x * 0.52, object.size.x * 0.52]) {
      for (const z of zPositions) {
        const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
        wheel.rotation.z = Math.PI / 2;
        wheel.position.set(x, -object.size.y * 0.36, z);
        group.add(wheel);
      }
    }
  }

  private getVehicleLightFrontSign(object: WorldObject): -1 | 1 {
    return 1;
  }

  private addVehicleLights(group: THREE.Group, object: WorldObject, width: number, height: number, length: number): void {
    const headlightMaterial = this.createCityLightMaterial('#fff4bc', 0.18, 1);
    const tailLightMaterial = this.createCityLightMaterial('#ff4c4c', 0.1, 0.92);
    const frontSign = this.getVehicleLightFrontSign(object);
    const rearSign = frontSign * -1;
    for (const x of [-width * 0.28, width * 0.28]) {
      const headlight = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.12, 0.05), headlightMaterial);
      headlight.position.set(x, height * 0.06, frontSign * length * 0.51);
      this.markCityLight(headlight, 0.18, 1);
      const tailLight = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.1, 0.05), tailLightMaterial);
      tailLight.position.set(x, height * 0.02, rearSign * length * 0.51);
      this.markCityLight(tailLight, 0.1, 0.92);
      group.add(headlight, tailLight);
    }
    this.addVehicleHeadlightGlow(group, width, height, length, object.kind === 'emergency', frontSign);
  }

  private createAdFrame(object: WorldObject): THREE.Group {
    const group = new THREE.Group();
    const frameMaterial = this.getMaterial(object.color, 0.5, 0.08);
    const supportMaterial = this.getMaterial('#202733', 0.68, 0.05);
    const railDepth = Math.max(0.24, object.size.z * 0.75);
    const railThickness = Math.max(0.16, object.size.y * 0.035);
    const sideThickness = Math.max(0.16, object.size.x * 0.018);
    const frameZ = -object.size.z * 0.56;

    const top = new THREE.Mesh(
      new THREE.BoxGeometry(object.size.x + sideThickness * 2.4, railThickness, railDepth),
      frameMaterial
    );
    top.position.set(0, object.size.y * 0.5 + railThickness * 0.35, frameZ);
    const bottom = top.clone();
    bottom.position.y = -object.size.y * 0.5 - railThickness * 0.35;

    const leftRail = new THREE.Mesh(
      new THREE.BoxGeometry(sideThickness, object.size.y + railThickness * 2.4, railDepth),
      frameMaterial
    );
    leftRail.position.set(-object.size.x * 0.5 - sideThickness * 0.42, 0, frameZ);
    const rightRail = leftRail.clone();
    rightRail.position.x = object.size.x * 0.5 + sideThickness * 0.42;

    const postGeometry = new THREE.CylinderGeometry(0.12, 0.17, object.size.y * 1.25, 8);
    const leftPost = new THREE.Mesh(postGeometry, supportMaterial);
    const rightPost = leftPost.clone();
    leftPost.position.set(-object.size.x * 0.42, -object.size.y * 0.6, frameZ - 0.22);
    rightPost.position.set(object.size.x * 0.42, -object.size.y * 0.6, frameZ - 0.22);

    const braceGeometry = new THREE.BoxGeometry(object.size.x * 0.86, 0.1, 0.12);
    const rearBrace = new THREE.Mesh(braceGeometry, supportMaterial);
    rearBrace.position.set(0, -object.size.y * 0.16, frameZ - 0.28);

    for (const mesh of [top, bottom, leftRail, rightRail, leftPost, rightPost, rearBrace]) {
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      group.add(mesh);
    }
    return group;
  }

  private addBuildingFacadeLights(group: THREE.Group, object: WorldObject, isIndustrial: boolean): void {
    const lighting = getCustomObjectVariantById(object.variantId)?.lighting ?? getPrebuildModelAsset(object.kind)?.lighting;
    if (lighting?.enabled === false) {
      return;
    }

    const intensity = lighting?.intensity ?? 1;
    const floorCount = lighting?.windowRows
      ? lighting.windowRows
      : Math.max(2, Math.min(isIndustrial ? 5 : 14, Math.floor(object.size.y / 1.18)));
    const rowStep = object.size.y / (floorCount + 1);
    const lightColor = lighting?.color || (isIndustrial ? '#ffd38a' : object.label === 'Office Building' ? '#dff6ff' : '#ffe6a7');
    const material = this.createCityLightMaterial(
      lightColor,
      THREE.MathUtils.clamp(0.04 * intensity, 0, 0.16),
      THREE.MathUtils.clamp((isIndustrial ? 0.86 : 1) * intensity, 0, 1)
    );
    const frontGeometry = new THREE.BoxGeometry(object.size.x * 0.68, 0.12, 0.045);
    const sideGeometry = new THREE.BoxGeometry(0.045, 0.12, object.size.z * 0.58);

    for (let floor = 1; floor <= floorCount; floor += 1) {
      if (isIndustrial && floor % 2 === 0) {
        continue;
      }

      const y = -object.size.y * 0.5 + rowStep * floor;
      const rowOpacity = floor % 3 === 0 ? 0.82 : 1;
        for (const z of [-object.size.z * 0.506, object.size.z * 0.506]) {
          const strip = new THREE.Mesh(frontGeometry, material);
          strip.position.set(0, y, z);
          strip.userData.buildingFacade = true;
          this.markCityLight(strip, THREE.MathUtils.clamp(0.04 * intensity, 0, 0.16), THREE.MathUtils.clamp(rowOpacity * intensity, 0, 1));
          group.add(strip);
        }

      if (object.size.z > 4.8 && floor % 2 === 1) {
        for (const x of [-object.size.x * 0.506, object.size.x * 0.506]) {
            const strip = new THREE.Mesh(sideGeometry, material);
            strip.position.set(x, y, 0);
            strip.userData.buildingFacade = true;
            this.markCityLight(strip, THREE.MathUtils.clamp(0.03 * intensity, 0, 0.14), THREE.MathUtils.clamp(rowOpacity * 0.9 * intensity, 0, 1));
            group.add(strip);
          }
      }
    }
  }

  private addBuildingGlow(group: THREE.Group, object: WorldObject, isIndustrial: boolean): void {
    if (object.size.y < 5.8 && !isIndustrial) {
      return;
    }

    const color = isIndustrial ? '#ffd38a' : object.label === 'Office Building' ? '#dff6ff' : '#ffe6a7';
    const glow = new THREE.Mesh(
      new THREE.BoxGeometry(object.size.x * 0.58, 0.08, 0.055),
      this.createCityLightMaterial(color, 0.026, isIndustrial ? 0.72 : 0.82)
    );
    glow.position.set(0, Math.max(0.9, object.size.y * 0.08), -object.size.z * 0.53);
    glow.userData.buildingFacade = true;
    this.markCityLight(glow, 0.026, isIndustrial ? 0.72 : 0.82);
    group.add(glow);
  }

  private addRooftopDetails(group: THREE.Group, object: WorldObject, isIndustrial: boolean): void {
    const roofY = object.size.y * 0.5 + 0.3;
    const equipmentMaterial = this.getMaterial('#29323d', 0.72, 0.1);
    const ventCount = Math.max(1, Math.min(4, Math.floor((object.size.x + object.size.z) / 5.8)));
    for (let i = 0; i < ventCount; i += 1) {
      const vent = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.34, 0.76), equipmentMaterial);
      const offset = (i - (ventCount - 1) * 0.5) * Math.min(1.3, object.size.x * 0.18);
      vent.position.set(offset, roofY, i % 2 === 0 ? object.size.z * 0.18 : -object.size.z * 0.16);
      vent.castShadow = true;
      group.add(vent);
    }

    if (object.size.y > 7 || isIndustrial) {
      const antenna = new THREE.Mesh(
        new THREE.CylinderGeometry(0.035, 0.05, Math.min(2.2, object.size.y * 0.18), 6),
        this.getMaterial('#202733', 0.54, 0.22)
      );
      antenna.position.set(object.size.x * 0.28, roofY + 0.8, -object.size.z * 0.24);
      const beacon = new THREE.Mesh(
        new THREE.SphereGeometry(0.09, 8, 6),
        this.createCityLightMaterial('#ff675e', 0.06, 0.72)
      );
      beacon.position.set(antenna.position.x, antenna.position.y + 0.88, antenna.position.z);
      this.markCityLight(beacon, 0.06, 0.72);
      group.add(antenna, beacon);
    }

    if (!isIndustrial && object.label !== 'Office Building' && object.size.x > 4.6) {
      const tank = new THREE.Mesh(
        new THREE.CylinderGeometry(0.38, 0.46, 0.62, 10),
        this.getMaterial('#697780', 0.82, 0.04)
      );
      tank.position.set(-object.size.x * 0.28, roofY + 0.34, object.size.z * 0.22);
      tank.castShadow = true;
      group.add(tank);
    }
  }

  private createCityLightMaterial(color: string, dayOpacity: number, nightOpacity: number): THREE.MeshBasicMaterial {
    const material = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: dayOpacity,
      depthWrite: false
    });
    material.userData.cityLight = { dayOpacity, nightOpacity };
    return material;
  }

  private markCityLight(mesh: THREE.Mesh, dayOpacity: number, nightOpacity: number): void {
    mesh.userData.cityLight = { dayOpacity, nightOpacity };
  }

  private addVehicleHeadlightGlow(
    group: THREE.Group,
    width: number,
    height: number,
    length: number,
    emergency = false,
    frontSign: -1 | 1 = 1
  ): void {
    const glowMaterial = this.createCityLightMaterial('#fff4bc', 0.08, 0.9);
    const beamLength = emergency ? 14.4 : 11.2;
    const beamWidth = Math.max(width * 2.42, emergency ? 5.1 : 3.75);
    const frontZ = frontSign * length * 0.58;
    const groundSpill = this.createDirectionalGroundGlow(
      '#fff1a8',
      Math.max(width * 1.7, beamWidth * 0.82),
      beamLength * 0.78,
      0.028,
      emergency ? 0.64 : 0.52,
      frontSign
    );
    groundSpill.position.set(0, 0.082, frontZ + frontSign * beamLength * 0.22);
    group.add(groundSpill);

    const frontWash = new THREE.Mesh(
      new THREE.BoxGeometry(Math.max(width * 0.74, 0.75), 0.055, 0.08),
      glowMaterial
    );
    frontWash.position.set(0, height * 0.055, frontSign * length * 0.615);
    this.markCityLight(frontWash, 0.1, 0.95);
    group.add(frontWash);

    for (const x of [-width * 0.28, width * 0.28]) {
      const beam = this.createForwardLightBeam(
        '#fff4bc',
        Math.max(0.24, width * 0.16),
        Math.max(width * 0.96, emergency ? 1.95 : 1.48),
        beamLength * (emergency ? 0.84 : 0.76),
        0.04,
        emergency ? 1 : 0.92,
        frontSign
      );
      beam.position.set(x, 0.086, frontZ + frontSign * 0.06);
      const glow = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.12, 0.08), glowMaterial);
      glow.position.set(x, height * 0.08, frontSign * length * 0.62);
      this.markCityLight(glow, 0.08, 0.9);
      group.add(beam, glow);
    }

    const spot = this.createCitySpotLight(
      '#fff4bc',
      0.02,
      emergency ? 3.3 : 2.45,
      emergency ? 43 : 36,
      emergency ? 0.48 : 0.38,
      1.02,
      emergency ? 9.2 : 7.35
    );
    spot.position.set(0, height * 0.14, frontSign * length * 0.55);
    spot.target.position.set(0, 0.03, frontSign * (length * 0.55 + beamLength * 0.92));
    group.add(spot, spot.target);
  }

  private createCityPointLight(
    color: string,
    dayIntensity: number,
    nightIntensity: number,
    distance: number,
    decay: number,
    priority: number
  ): THREE.PointLight {
    const light = new THREE.PointLight(color, 0, distance, decay);
    light.castShadow = false;
    light.userData.cityPointLight = { dayIntensity, nightIntensity, priority };
    return light;
  }

  private createCitySpotLight(
    color: string,
    dayIntensity: number,
    nightIntensity: number,
    distance: number,
    angle: number,
    decay: number,
    priority: number
  ): THREE.SpotLight {
    const light = new THREE.SpotLight(color, 0, distance, angle, 0.62, decay);
    light.castShadow = false;
    light.userData.cityPointLight = { dayIntensity, nightIntensity, priority };
    return light;
  }

  private createGroundGlow(
    color: string,
    radius: number,
    dayOpacity: number,
    nightOpacity: number
  ): THREE.Mesh {
    const glow = new THREE.Mesh(
      new THREE.PlaneGeometry(radius * 2.45, radius * 1.55, 1, 1),
      this.createGradientGlowMaterial(color, dayOpacity, nightOpacity, 'radial-soft')
    );
    glow.rotation.x = -Math.PI / 2;
    return glow;
  }

  private createDirectionalGroundGlow(
    color: string,
    width: number,
    length: number,
    dayOpacity: number,
    nightOpacity: number,
    frontSign: -1 | 1
  ): THREE.Mesh {
    const glow = new THREE.Mesh(
      new THREE.PlaneGeometry(width, length, 1, 1),
      this.createGradientGlowMaterial(color, dayOpacity, nightOpacity, 'radial-soft')
    );
    glow.rotation.x = frontSign > 0 ? Math.PI / 2 : -Math.PI / 2;
    return glow;
  }

  private createGradientGlowMaterial(
    color: string,
    dayOpacity: number,
    nightOpacity: number,
    textureKey: string,
    blending: THREE.Blending = THREE.NormalBlending
  ): THREE.MeshBasicMaterial {
    const key = `gradient-glow:${color}:${dayOpacity}:${nightOpacity}:${textureKey}:${blending}`;
    const existing = this.materialCache.get(key);
    if (existing) {
      return existing as THREE.MeshBasicMaterial;
    }

    const material = new THREE.MeshBasicMaterial({
      color,
      map: this.getGlowTexture(textureKey),
      transparent: true,
      opacity: dayOpacity,
      depthWrite: false,
      side: THREE.DoubleSide,
      blending
    });
    material.userData.cityLight = { dayOpacity, nightOpacity };
    this.materialCache.set(key, material);
    return material;
  }

  private getGlowTexture(key: string): THREE.CanvasTexture {
    const existing = this.glowTextureCache.get(key);
    if (existing) {
      return existing;
    }

    const size = 256;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Could not create glow texture context');
    }

    context.clearRect(0, 0, size, size);
    if (key === 'forward-soft') {
      const pixels = context.createImageData(size, size);
      for (let y = 0; y < size; y += 1) {
        const v = y / (size - 1);
        const lengthFade = Math.pow(1 - v, 1.42);
        const baseFeather = THREE.MathUtils.smoothstep(v, 0.02, 0.12);
        const tipFeather = 1 - THREE.MathUtils.smoothstep(v, 0.84, 1);
        for (let x = 0; x < size; x += 1) {
          const u = Math.abs(x / (size - 1) - 0.5) * 2;
          const sideFade = Math.pow(Math.max(0, 1 - u), 1.8);
          const alpha = Math.round(255 * 0.92 * sideFade * lengthFade * baseFeather * tipFeather);
          const index = (y * size + x) * 4;
          pixels.data[index] = 255;
          pixels.data[index + 1] = 255;
          pixels.data[index + 2] = 255;
          pixels.data[index + 3] = alpha;
        }
      }
      context.putImageData(pixels, 0, 0);
      const texture = new THREE.CanvasTexture(canvas);
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.generateMipmaps = false;
      this.glowTextureCache.set(key, texture);
      return texture;
    }

    const center = size * 0.5;
    const gradient = context.createRadialGradient(center, center, 0, center, center, center);
    gradient.addColorStop(0, 'rgba(255,255,255,0.92)');
    gradient.addColorStop(0.14, 'rgba(255,255,255,0.66)');
    gradient.addColorStop(0.34, 'rgba(255,255,255,0.28)');
    gradient.addColorStop(0.58, 'rgba(255,255,255,0.10)');
    gradient.addColorStop(0.82, 'rgba(255,255,255,0.025)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
    context.fillStyle = gradient;
    context.fillRect(0, 0, size, size);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = false;
    this.glowTextureCache.set(key, texture);
    return texture;
  }

  private createLightGlowMaterial(color: string, dayOpacity: number, nightOpacity: number): THREE.MeshBasicMaterial {
    const material = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: dayOpacity,
      depthWrite: false,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending
    });
    material.userData.cityLight = { dayOpacity, nightOpacity };
    return material;
  }

  private addEmergencyBeacons(group: THREE.Group, object: WorldObject): void {
    const redBeacon = new THREE.Mesh(
      new THREE.BoxGeometry(object.size.x * 0.22, 0.09, 0.16),
      this.createCityLightMaterial('#ef4444', 0.22, 1)
    );
    redBeacon.position.set(-object.size.x * 0.16, object.size.y * 0.64, -object.size.z * 0.08);
    const blueBeacon = redBeacon.clone();
    blueBeacon.material = this.createCityLightMaterial('#60a5fa', 0.22, 1);
    blueBeacon.position.x = object.size.x * 0.16;
    this.markCityLight(redBeacon, 0.22, 1);
    this.markCityLight(blueBeacon, 0.22, 1);

    const redLight = this.createCityPointLight('#ef4444', 0.04, 2.45, 24, 1.35, 8);
    redLight.position.copy(redBeacon.position);
    const blueLight = this.createCityPointLight('#60a5fa', 0.04, 2.45, 24, 1.35, 8);
    blueLight.position.copy(blueBeacon.position);
    group.add(redBeacon, blueBeacon, redLight, blueLight);
  }

  private shouldAddPedestrianFlashlight(id: string): boolean {
    return this.hashUnit(id, 17) < 0.4;
  }

  private hashUnit(id: string, salt: number): number {
    let hash = salt >>> 0;
    for (let index = 0; index < id.length; index += 1) {
      hash = (hash * 31 + id.charCodeAt(index) + salt * 17) >>> 0;
    }
    return (hash % 10000) / 10000;
  }

  private addPedestrianFlashlight(group: THREE.Group, object: WorldObject): void {
    const flashlight = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.08, 0.18),
      this.getMaterial('#111827', 0.48, 0.16)
    );
    flashlight.position.set(0.2, object.size.y * 0.08, 0.18);
    const beam = this.createForwardLightBeam('#fff7bd', 0.18, 1.25, 2.9, 0.012, 0.24, 1);
    beam.position.set(0.2, 0.09, 0.3);
    const spot = this.createCitySpotLight('#fff7bd', 0, 0.48, 8.5, 0.5, 1.35, 1.2);
    spot.position.set(0.2, object.size.y * 0.16, 0.24);
    spot.target.position.set(0.2, 0.06, 3.2);
    group.add(flashlight, beam, spot, spot.target);
  }

  private createForwardLightBeam(
    color: string,
    nearWidth: number,
    farWidth: number,
    length: number,
    dayOpacity: number,
    nightOpacity: number,
    frontSign: -1 | 1 = 1
  ): THREE.Mesh {
    const beam = new THREE.Mesh(
      this.createForwardLightBeamGeometry(nearWidth, farWidth, length),
      this.createGradientGlowMaterial(color, dayOpacity, nightOpacity, 'forward-soft', THREE.AdditiveBlending)
    );
    beam.rotation.x = frontSign > 0 ? Math.PI / 2 : -Math.PI / 2;
    return beam;
  }

  private createForwardLightBeamGeometry(nearWidth: number, farWidth: number, length: number): THREE.ShapeGeometry {
    const shape = new THREE.Shape();
    shape.moveTo(-nearWidth * 0.5, 0);
    shape.lineTo(nearWidth * 0.5, 0);
    shape.lineTo(farWidth * 0.5, length);
    shape.lineTo(-farWidth * 0.5, length);
    shape.closePath();
    return new THREE.ShapeGeometry(shape);
  }

  private getMaterial(color: string, roughness: number, metalness: number): THREE.MeshStandardMaterial {
    const key = `${color}:${roughness}:${metalness}`;
    const existing = this.materialCache.get(key);
    if (existing) {
      return existing as THREE.MeshStandardMaterial;
    }

    const material = new THREE.MeshStandardMaterial({ color, roughness, metalness });
    this.materialCache.set(key, material);
    return material;
  }

  private createTerrainCutoutMaterial(color: string, roughness: number, metalness: number): THREE.MeshStandardMaterial {
    const material = new THREE.MeshStandardMaterial({ color, roughness, metalness });
    material.stencilWrite = true;
    material.stencilRef = 1;
    material.stencilFunc = THREE.NotEqualStencilFunc;
    material.stencilFail = THREE.KeepStencilOp;
    material.stencilZFail = THREE.KeepStencilOp;
    material.stencilZPass = THREE.KeepStencilOp;
    return material;
  }

  private isCachedMaterial(material: THREE.Material): boolean {
    for (const cached of this.materialCache.values()) {
      if (cached === material) {
        return true;
      }
    }

    return false;
  }
}
