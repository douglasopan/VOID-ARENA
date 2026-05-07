import { AdManager } from '../ads/AdManager';
import { MAP_SIZE_SETTINGS, POWERUP_RESPAWN_SECONDS, POWERUP_SETTINGS } from '../shared/constants';
import type {
  AdSurface,
  CityObjectCategory,
  MapData,
  MapSize,
  ObjectSpawnDefinition,
  PedestrianPath,
  PowerUpSpawnDefinition,
  PowerUpType,
  RoadSegment,
  RoutePoint,
  SurfaceSegment,
  TrafficRoute,
  Vec3Data,
  WorldObjectKind
} from '../shared/types';

interface OccupiedFootprint {
  x: number;
  z: number;
  radius: number;
}

interface SpawnCandidate {
  x: number;
  z: number;
  rotationY: number;
}

interface RoadNetwork {
  roads: RoadSegment[];
  surfaces: SurfaceSegment[];
  trafficRoutes: TrafficRoute[];
  pedestrianPaths: PedestrianPath[];
}

class SeededRandom {
  private state: number;

  constructor(seed: string) {
    this.state = this.hash(seed);
  }

  next(): number {
    this.state += 0x6d2b79f5;
    let value = this.state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  }

  range(min: number, max: number): number {
    return min + (max - min) * this.next();
  }

  int(min: number, max: number): number {
    return Math.floor(this.range(min, max + 1));
  }

  chance(probability: number): boolean {
    return this.next() < probability;
  }

  pick<T>(items: T[]): T {
    return items[Math.floor(this.next() * items.length)];
  }

  private hash(seed: string): number {
    let hash = 2166136261;
    for (let i = 0; i < seed.length; i += 1) {
      hash ^= seed.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
  }
}

export class ProceduralMapGenerator {
  generate(options: {
    size: MapSize;
    enableAds: boolean;
    seed?: string;
    objectDensityMultiplier?: number;
    powerUpCount?: number;
  }): MapData {
    const seed = options.seed ?? `void-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
    const rng = new SeededRandom(seed);
    const settings = MAP_SIZE_SETTINGS[options.size];
    const network = this.createRoadNetwork(options.size, rng);
    const objectBudget = Math.round(settings.objectCount * (options.objectDensityMultiplier ?? 1));
    const spawnPoints = this.createSpawnPoints(settings.halfExtent, rng);
    const objects: ObjectSpawnDefinition[] = [];
    const powerUps: PowerUpSpawnDefinition[] = [];
    const adSurfaces: AdSurface[] = [];
    const adManager = new AdManager();
    const occupied: OccupiedFootprint[] = [];

    this.addPlazas(objects, occupied, network.surfaces, network.roads, spawnPoints, rng, options.size);
    this.addBuildings(objects, occupied, network.roads, spawnPoints, rng, objectBudget);
    this.addRoadsideObjects(objects, occupied, network.roads, spawnPoints, rng, objectBudget);
    this.addTraffic(objects, occupied, network.trafficRoutes, rng, objectBudget);
    this.addPedestrians(objects, occupied, network.pedestrianPaths, rng, objectBudget);
    this.addLooseCityObjects(objects, occupied, network.roads, spawnPoints, rng, options.size, objectBudget);
    this.addPowerUps(powerUps, occupied, network.roads, spawnPoints, rng, options.size, options.powerUpCount);

    if (options.enableAds) {
      this.addAdPlacements(objects, adSurfaces, occupied, network.roads, spawnPoints, adManager, rng, options.size);
    }

    return {
      seed,
      size: options.size,
      halfExtent: settings.halfExtent,
      roads: network.roads,
      surfaces: network.surfaces,
      trafficRoutes: network.trafficRoutes,
      pedestrianPaths: network.pedestrianPaths,
      objects,
      powerUps,
      spawnPoints,
      adSurfaces
    };
  }

  private createRoadNetwork(size: MapSize, rng: SeededRandom): RoadNetwork {
    const settings = MAP_SIZE_SETTINGS[size];
    const roads: RoadSegment[] = [];
    const surfaces: SurfaceSegment[] = [];
    const trafficRoutes: TrafficRoute[] = [];
    const pedestrianPaths: PedestrianPath[] = [];
    const half = settings.halfExtent;
    const majorCount = Math.max(3, Math.floor(half / settings.blockSize) + 1);

    const addRoad = (
      id: string,
      x: number,
      z: number,
      length: number,
      rotationY: number,
      width = settings.roadWidth + rng.range(-0.8, 1.2)
    ): void => {
      const sidewalkWidth = 2.4 + rng.range(0, 0.8);
      const road: RoadSegment = {
        id,
        x,
        z,
        width,
        length,
        rotationY,
        lanes: width > 7.6 ? 2 : 1,
        sidewalkWidth
      };
      if (roads.some((other) => this.roadsOverlapParallel(road, other))) {
        return;
      }
      roads.push(road);
      trafficRoutes.push(...this.createTrafficRoutesForRoad(road));
      pedestrianPaths.push(...this.createPedestrianPathsForRoad(road));
    };

    const verticalPositions = this.cityAxisPositions(majorCount, half, settings.blockSize, rng);
    const horizontalPositions = this.cityAxisPositions(majorCount, half, settings.blockSize, rng);

    verticalPositions.forEach((x, index) => addRoad(`avenue-v-${index}`, x, 0, half * 1.9, 0));
    horizontalPositions.forEach((z, index) => addRoad(`avenue-h-${index}`, 0, z, half * 1.9, Math.PI / 2));

    const sideStreetCount = Math.floor(majorCount * 0.55);
    for (let i = 0; i < sideStreetCount; i += 1) {
      const vertical = rng.chance(0.5);
      const base = rng.pick(vertical ? verticalPositions : horizontalPositions);
      const offset = rng.pick([-1, 1]) * rng.range(settings.blockSize * 0.28, settings.blockSize * 0.52);
      const center = rng.range(-half * 0.45, half * 0.45);
      const length = rng.range(half * 0.45, half * 0.95);
      if (vertical) {
        addRoad(`side-v-${i}`, base + offset, center, length, 0, settings.roadWidth * 0.72);
      } else {
        addRoad(`side-h-${i}`, center, base + offset, length, Math.PI / 2, settings.roadWidth * 0.72);
      }
    }

    for (const road of roads) {
      this.addRoadSurfaces(road, roads, surfaces);
    }
    this.addCrosswalks(roads, surfaces, settings.roadWidth);

    return { roads, surfaces, trafficRoutes, pedestrianPaths };
  }

  private cityAxisPositions(count: number, half: number, blockSize: number, rng: SeededRandom): number[] {
    const positions = new Set<number>([0]);
    const start = -half * 0.72;
    const span = half * 1.44;
    const minGap = blockSize * 0.48;
    for (let i = 0; i < count; i += 1) {
      const base = start + (span * i) / Math.max(1, count - 1);
      const candidate = Math.round((base + rng.range(-blockSize * 0.26, blockSize * 0.26)) * 10) / 10;
      if ([...positions].some((position) => Math.abs(position - candidate) < minGap)) {
        continue;
      }
      positions.add(candidate);
    }
    return [...positions].sort((a, b) => a - b);
  }

  private addRoadSurfaces(road: RoadSegment, roads: RoadSegment[], surfaces: SurfaceSegment[]): void {
    const sideOffset = road.width * 0.5 + road.sidewalkWidth * 0.5;
    const sideVector = this.sideVector(road.rotationY);
    const forward = this.forwardVector(road.rotationY);
    for (const side of [-1, 1]) {
      if (this.hasNearbyParallelRoadOnSide(road, roads, side)) {
        continue;
      }

      const sidewalkCuts = this.sidewalkCutsForRoadSide(road, roads, side, sideOffset);
      const sidewalkRuns = this.subtractRanges(-road.length * 0.5, road.length * 0.5, sidewalkCuts, 3.2);
      sidewalkRuns.forEach((run, index) => {
        const along = (run.start + run.end) * 0.5;
        surfaces.push({
          id: `${road.id}-sidewalk-${side}-${index}`,
          x: road.x + forward.x * along + sideVector.x * sideOffset * side,
          z: road.z + forward.z * along + sideVector.z * sideOffset * side,
          width: road.sidewalkWidth,
          length: run.end - run.start,
          rotationY: road.rotationY,
          kind: 'sidewalk'
        });
      });
    }

    const dashSpacing = 8;
    const dashCount = Math.floor(road.length / dashSpacing);
    const laneCuts = this.intersectionCutsForRoad(
      road,
      roads,
      (other) => other.width * 0.5 + 2.05 + road.width * 0.44
    );
    for (let i = 0; i < dashCount; i += 1) {
      const along = -road.length * 0.5 + i * dashSpacing + dashSpacing * 0.5;
      const dashHalfLength = 1.6;
      if (laneCuts.some((cut) => along + dashHalfLength > cut.start && along - dashHalfLength < cut.end)) {
        continue;
      }
      surfaces.push({
        id: `${road.id}-lane-${i}`,
        x: road.x + forward.x * along,
        z: road.z + forward.z * along,
        width: 0.18,
        length: 3.2,
        rotationY: road.rotationY,
        kind: 'lane-marking'
      });
    }
  }

  private addCrosswalks(roads: RoadSegment[], surfaces: SurfaceSegment[], roadWidth: number): void {
    let id = 0;
    const placed: RoutePoint[] = [];
    for (const a of roads) {
      for (const b of roads) {
        if (a.id >= b.id || Math.abs(Math.sin(a.rotationY - b.rotationY)) < 0.8) {
          continue;
        }

        if (!a.id.startsWith('avenue') && !b.id.startsWith('avenue')) {
          continue;
        }

        const vertical = Math.abs(Math.sin(a.rotationY)) < 0.5 ? a : b;
        const horizontal = vertical === a ? b : a;
        const inVertical = Math.abs(horizontal.z - vertical.z) <= vertical.length * 0.5;
        const inHorizontal = Math.abs(vertical.x - horizontal.x) <= horizontal.length * 0.5;
        if (!inVertical || !inHorizontal) {
          continue;
        }

        const verticalForward = this.forwardVector(vertical.rotationY);
        const horizontalForward = this.forwardVector(horizontal.rotationY);
        const verticalApproach = horizontal.width * 0.5 + 2.05;
        const horizontalApproach = vertical.width * 0.5 + 2.05;
        const crosswalkDepth = (road: RoadSegment): number => Math.max(4.2, Math.min(5.8, road.width * 0.72));
        const candidates: SurfaceSegment[] = [];
        for (const sign of [-1, 1]) {
          candidates.push(
            {
              id: `crosswalk-${id}`,
              x: vertical.x + verticalForward.x * verticalApproach * sign,
              z: horizontal.z + verticalForward.z * verticalApproach * sign,
              width: crosswalkDepth(vertical),
              length: vertical.width + 1.1,
              rotationY: vertical.rotationY + Math.PI / 2,
              kind: 'crosswalk'
            },
            {
              id: `crosswalk-${id + 1}`,
              x: vertical.x + horizontalForward.x * horizontalApproach * sign,
              z: horizontal.z + horizontalForward.z * horizontalApproach * sign,
              width: crosswalkDepth(horizontal),
              length: horizontal.width + 1.1,
              rotationY: horizontal.rotationY + Math.PI / 2,
              kind: 'crosswalk'
            }
          );
        }

        for (const crosswalk of candidates) {
          if (placed.some((point) => Math.hypot(point.x - crosswalk.x, point.z - crosswalk.z) < roadWidth * 0.32)) {
            continue;
          }
          crosswalk.id = `crosswalk-${id}`;
          surfaces.push(crosswalk);
          placed.push({ x: crosswalk.x, z: crosswalk.z });
          id += 1;
        }
      }
    }
  }

  private roadsOverlapParallel(road: RoadSegment, other: RoadSegment): boolean {
    if (Math.abs(Math.sin(road.rotationY - other.rotationY)) > 0.2) {
      return false;
    }

    const forward = this.forwardVector(road.rotationY);
    const side = this.sideVector(road.rotationY);
    const dx = road.x - other.x;
    const dz = road.z - other.z;
    const along = Math.abs(dx * forward.x + dz * forward.z);
    const lateral = Math.abs(dx * side.x + dz * side.z);
    const overlapAlong = along < road.length * 0.5 + other.length * 0.5 + 1.2;
    const protectedLateral =
      road.width * 0.5 +
      other.width * 0.5 +
      0.9;

    return overlapAlong && lateral < protectedLateral;
  }

  private hasNearbyParallelRoadOnSide(road: RoadSegment, roads: RoadSegment[], sideSign: number): boolean {
    const forward = this.forwardVector(road.rotationY);
    const side = this.sideVector(road.rotationY);

    return roads.some((other) => {
      if (other === road || Math.abs(Math.sin(road.rotationY - other.rotationY)) > 0.2) {
        return false;
      }

      const dx = other.x - road.x;
      const dz = other.z - road.z;
      const along = Math.abs(dx * forward.x + dz * forward.z);
      const lateral = dx * side.x + dz * side.z;
      if (lateral * sideSign <= 0) {
        return false;
      }

      const overlapAlong = along < road.length * 0.5 + other.length * 0.5;
      const asphaltGap = Math.abs(lateral) - road.width * 0.5 - other.width * 0.5;
      const hasAvenue = road.id.startsWith('avenue') || other.id.startsWith('avenue');
      const widestRoad = Math.max(road.width, other.width);
      const internalGapAllowance = hasAvenue
        ? Math.max(20, Math.min(28, widestRoad * 2.2))
        : Math.max(11, Math.min(16, widestRoad * 1.4));
      const mergedAvenueGap = road.sidewalkWidth + other.sidewalkWidth + internalGapAllowance;
      return overlapAlong && asphaltGap > 0.1 && asphaltGap <= mergedAvenueGap;
    });
  }

  private sidewalkCutsForRoadSide(
    road: RoadSegment,
    roads: RoadSegment[],
    sideSign: number,
    sideOffset: number
  ): Array<{ start: number; end: number }> {
    const cuts: Array<{ start: number; end: number }> = [];
    const forward = this.forwardVector(road.rotationY);
    const side = this.sideVector(road.rotationY);
    const sidewalkCenter = sideOffset * sideSign;

    for (const other of roads) {
      if (other === road || Math.abs(Math.sin(road.rotationY - other.rotationY)) < 0.8) {
        continue;
      }

      const dx = other.x - road.x;
      const dz = other.z - road.z;
      const along = dx * forward.x + dz * forward.z;
      const lateral = dx * side.x + dz * side.z;
      const reachesSidewalk = Math.abs(lateral - sidewalkCenter) <= other.length * 0.5 + road.sidewalkWidth * 0.5 + 0.08;
      const overlapsRoadLength = Math.abs(along) <= road.length * 0.5 + other.width * 0.5;
      if (!reachesSidewalk || !overlapsRoadLength) {
        continue;
      }

      const halfLength = other.width * 0.5 + 0.32;
      cuts.push({
        start: Math.max(-road.length * 0.5, along - halfLength),
        end: Math.min(road.length * 0.5, along + halfLength)
      });
    }

    cuts.sort((a, b) => a.start - b.start);
    return cuts;
  }

  private intersectionCutsForRoad(
    road: RoadSegment,
    roads: RoadSegment[],
    halfLengthFor: (other: RoadSegment) => number
  ): Array<{ start: number; end: number }> {
    const cuts: Array<{ start: number; end: number }> = [];
    for (const other of roads) {
      if (other === road || Math.abs(Math.sin(road.rotationY - other.rotationY)) < 0.8) {
        continue;
      }

      const along = this.intersectionAlong(road, other);
      if (along === null) {
        continue;
      }

      const halfLength = halfLengthFor(other);
      cuts.push({
        start: Math.max(-road.length * 0.5, along - halfLength),
        end: Math.min(road.length * 0.5, along + halfLength)
      });
    }

    cuts.sort((a, b) => a.start - b.start);
    return cuts;
  }

  private intersectionAlong(road: RoadSegment, other: RoadSegment): number | null {
    const roadForward = this.forwardVector(road.rotationY);
    const roadSide = this.sideVector(road.rotationY);
    const otherForward = this.forwardVector(other.rotationY);
    const dx = other.x - road.x;
    const dz = other.z - road.z;
    const alongRoad = dx * roadForward.x + dz * roadForward.z;
    const lateralRoad = Math.abs(dx * roadSide.x + dz * roadSide.z);
    const alongOther = (road.x - other.x) * otherForward.x + (road.z - other.z) * otherForward.z;

    if (lateralRoad > road.width * 0.5 + other.length * 0.5) {
      return null;
    }

    if (Math.abs(alongRoad) > road.length * 0.5 + other.width * 0.5) {
      return null;
    }

    if (Math.abs(alongOther) > other.length * 0.5 + road.width * 0.5) {
      return null;
    }

    return Math.max(-road.length * 0.5, Math.min(road.length * 0.5, alongRoad));
  }

  private subtractRanges(
    start: number,
    end: number,
    cuts: Array<{ start: number; end: number }>,
    minLength: number
  ): Array<{ start: number; end: number }> {
    const ranges: Array<{ start: number; end: number }> = [];
    let cursor = start;
    for (const cut of cuts) {
      const cutStart = Math.max(start, Math.min(end, cut.start));
      const cutEnd = Math.max(start, Math.min(end, cut.end));
      if (cutStart - cursor >= minLength) {
        ranges.push({ start: cursor, end: cutStart });
      }
      cursor = Math.max(cursor, cutEnd);
    }

    if (end - cursor >= minLength) {
      ranges.push({ start: cursor, end });
    }

    return ranges;
  }

  private createTrafficRoutesForRoad(road: RoadSegment): TrafficRoute[] {
    const forward = this.forwardVector(road.rotationY);
    const side = this.sideVector(road.rotationY);
    const laneOffset = road.lanes === 2 ? road.width * 0.21 : 0;
    const startAlong = -road.length * 0.48;
    const endAlong = road.length * 0.48;
    const routes: TrafficRoute[] = [];
    for (const lane of road.lanes === 2 ? [-1, 1] : [0]) {
      routes.push({
        id: `${road.id}-traffic-${lane}`,
        loop: true,
        points: [
          {
            x: road.x + forward.x * startAlong + side.x * laneOffset * lane,
            z: road.z + forward.z * startAlong + side.z * laneOffset * lane
          },
          {
            x: road.x + forward.x * endAlong + side.x * laneOffset * lane,
            z: road.z + forward.z * endAlong + side.z * laneOffset * lane
          }
        ]
      });
    }
    return routes;
  }

  private createPedestrianPathsForRoad(road: RoadSegment): PedestrianPath[] {
    const forward = this.forwardVector(road.rotationY);
    const side = this.sideVector(road.rotationY);
    const startAlong = -road.length * 0.48;
    const endAlong = road.length * 0.48;
    const offset = road.width * 0.5 + road.sidewalkWidth * 0.55;
    return [-1, 1].map((sideSign) => ({
      id: `${road.id}-walk-${sideSign}`,
      loop: true,
      points: [
        {
          x: road.x + forward.x * startAlong + side.x * offset * sideSign,
          z: road.z + forward.z * startAlong + side.z * offset * sideSign
        },
        {
          x: road.x + forward.x * endAlong + side.x * offset * sideSign,
          z: road.z + forward.z * endAlong + side.z * offset * sideSign
        }
      ]
    }));
  }

  private createSpawnPoints(halfExtent: number, rng: SeededRandom): Vec3Data[] {
    const spawnPoints: Vec3Data[] = [
      { x: -halfExtent * 0.32, y: 0, z: -halfExtent * 0.32 },
      { x: halfExtent * 0.32, y: 0, z: halfExtent * 0.32 },
      { x: -halfExtent * 0.32, y: 0, z: halfExtent * 0.32 },
      { x: halfExtent * 0.32, y: 0, z: -halfExtent * 0.32 },
      { x: 0, y: 0, z: 0 }
    ];

    for (let i = 0; i < 180; i += 1) {
      spawnPoints.push({
        x: rng.range(-halfExtent * 0.78, halfExtent * 0.78),
        y: 0,
        z: rng.range(-halfExtent * 0.78, halfExtent * 0.78)
      });
    }

    return spawnPoints;
  }

  private addPlazas(
    objects: ObjectSpawnDefinition[],
    occupied: OccupiedFootprint[],
    surfaces: SurfaceSegment[],
    roads: RoadSegment[],
    spawnPoints: Vec3Data[],
    rng: SeededRandom,
    size: MapSize
  ): void {
    const settings = MAP_SIZE_SETTINGS[size];
    const countBySize = { small: 1, medium: 2, large: 4, huge: 7 } satisfies Record<MapSize, number>;
    for (let i = 0; i < countBySize[size]; i += 1) {
      let candidate: SpawnCandidate | null = null;
      let width = 0;
      let length = 0;
      let footprintRadius = 0;

      for (let attempt = 0; attempt < 80; attempt += 1) {
        width = rng.range(8, size === 'small' ? 12 : 18);
        length = rng.range(8, size === 'small' ? 13 : 20);
        const x = rng.range(-settings.halfExtent * 0.72, settings.halfExtent * 0.72);
        const z = rng.range(-settings.halfExtent * 0.72, settings.halfExtent * 0.72);
        const rotationY = rng.pick([0, Math.PI / 2]);
        footprintRadius = Math.hypot(width, length) * 0.54;
        if (
          this.overlapsOccupied(x, z, footprintRadius + 1.2, occupied) ||
          this.pointConflictsRoads(x, z, footprintRadius, roads) ||
          this.isTooCloseToAnySpawn(x, z, spawnPoints.slice(0, 5), settings.spawnClearRadius + footprintRadius * 0.35)
        ) {
          continue;
        }

        candidate = { x, z, rotationY };
        break;
      }

      if (!candidate) {
        continue;
      }

      surfaces.push({
        id: `plaza-${i}`,
        x: candidate.x,
        z: candidate.z,
        width,
        length,
        rotationY: candidate.rotationY,
        kind: 'plaza'
      });

      const localOccupied: OccupiedFootprint[] = [];
      const side = this.sideVector(candidate.rotationY);
      const forward = this.forwardVector(candidate.rotationY);
      const place = (kind: WorldObjectKind, localX: number, localZ: number, rotationY = candidate.rotationY): void => {
        const x = candidate.x + side.x * localX + forward.x * localZ;
        const z = candidate.z + side.z * localX + forward.z * localZ;
        const object = this.createObjectDefinition(kind, objects.length, { x, z, rotationY }, rng);
        if (
          this.overlapsOccupied(x, z, object.boundingRadius, occupied) ||
          this.overlapsOccupied(x, z, object.boundingRadius, localOccupied) ||
          this.pointConflictsRoads(x, z, object.boundingRadius, roads)
        ) {
          return;
        }
        objects.push(object);
        localOccupied.push({ x, z, radius: object.boundingRadius });
        occupied.push({ x, z, radius: object.boundingRadius });
      };

      place('fountain', 0, 0);
      if (rng.chance(0.55)) {
        place('statue', 0, length * 0.28);
      }
      for (const sign of [-1, 1]) {
        place('bench', sign * width * 0.28, -length * 0.34, candidate.rotationY + Math.PI / 2);
        place('planter', sign * width * 0.36, length * 0.32);
      }
      if (rng.chance(0.6)) {
        place('kiosk', -width * 0.34, length * 0.08);
      }

      occupied.push({ x: candidate.x, z: candidate.z, radius: footprintRadius });
    }
  }

  private addBuildings(
    objects: ObjectSpawnDefinition[],
    occupied: OccupiedFootprint[],
    roads: RoadSegment[],
    spawnPoints: Vec3Data[],
    rng: SeededRandom,
    objectBudget: number
  ): void {
    const target = Math.floor(objectBudget * 0.24);
    for (let i = 0; i < target; i += 1) {
      const road = rng.pick(roads);
      const candidate = this.roadsideCandidate(road, rng, rng.range(4.2, 9.2), spawnPoints);
      if (!candidate || this.overlapsOccupied(candidate.x, candidate.z, 4.2, occupied)) {
        continue;
      }
      const object = this.createObjectDefinition('building', objects.length, candidate, rng);
      if (
        this.overlapsOccupied(candidate.x, candidate.z, object.boundingRadius, occupied) ||
        this.pointConflictsRoads(object.position.x, object.position.z, object.boundingRadius, roads)
      ) {
        continue;
      }
      objects.push(object);
      occupied.push({ x: candidate.x, z: candidate.z, radius: object.boundingRadius });
    }
  }

  private addRoadsideObjects(
    objects: ObjectSpawnDefinition[],
    occupied: OccupiedFootprint[],
    roads: RoadSegment[],
    spawnPoints: Vec3Data[],
    rng: SeededRandom,
    objectBudget: number
  ): void {
    const target = Math.floor(objectBudget * 0.3);
    const kinds: WorldObjectKind[] = [
      'post',
      'tree',
      'bench',
      'hydrant',
      'trash',
      'cone',
      'mailbox',
      'bike',
      'planter'
    ];
    for (let i = 0; i < target; i += 1) {
      const road = rng.pick(roads);
      const kind = rng.pick(kinds);
      const candidate = this.roadsideCandidate(road, rng, rng.range(0.4, 1.3), spawnPoints, true);
      if (!candidate || this.overlapsOccupied(candidate.x, candidate.z, 0.8, occupied)) {
        continue;
      }
      const object = this.createObjectDefinition(kind, objects.length, candidate, rng);
      if (this.overlapsOccupied(candidate.x, candidate.z, object.boundingRadius, occupied)) {
        continue;
      }
      objects.push(object);
      occupied.push({ x: candidate.x, z: candidate.z, radius: object.boundingRadius });
    }
  }

  private addTraffic(
    objects: ObjectSpawnDefinition[],
    occupied: OccupiedFootprint[],
    routes: TrafficRoute[],
    rng: SeededRandom,
    objectBudget: number
  ): void {
    const target = Math.floor(objectBudget * 0.09);
    for (let i = 0; i < target; i += 1) {
      const route = rng.pick(routes);
      const t = rng.range(0, Math.max(1, route.points.length - 1));
      const point = this.routePoint(route, t);
      const kind: WorldObjectKind = rng.chance(0.22) ? 'truck' : 'car';
      const object = this.createObjectDefinition(kind, objects.length, {
        x: point.position.x,
        z: point.position.z,
        rotationY: point.rotationY
      }, rng);
      object.routeId = route.id;
      object.routeT = t;
      object.routeSpeed = rng.range(3.5, 7.5) * (kind === 'truck' ? 0.72 : 1);
      objects.push(object);
      occupied.push({ x: object.position.x, z: object.position.z, radius: object.boundingRadius });
    }
  }

  private addPedestrians(
    objects: ObjectSpawnDefinition[],
    occupied: OccupiedFootprint[],
    paths: PedestrianPath[],
    rng: SeededRandom,
    objectBudget: number
  ): void {
    const target = Math.floor(objectBudget * 0.08);
    for (let i = 0; i < target; i += 1) {
      const path = rng.pick(paths);
      const t = rng.range(0, Math.max(1, path.points.length - 1));
      const point = this.routePoint(path, t);
      const object = this.createObjectDefinition('pedestrian', objects.length, {
        x: point.position.x,
        z: point.position.z,
        rotationY: point.rotationY
      }, rng);
      object.pedestrianPathId = path.id;
      object.routeT = t;
      object.routeSpeed = rng.range(0.65, 1.35);
      objects.push(object);
      occupied.push({ x: object.position.x, z: object.position.z, radius: object.boundingRadius });
    }
  }

  private addLooseCityObjects(
    objects: ObjectSpawnDefinition[],
    occupied: OccupiedFootprint[],
    roads: RoadSegment[],
    spawnPoints: Vec3Data[],
    rng: SeededRandom,
    size: MapSize,
    objectBudget: number
  ): void {
    const target = Math.max(0, objectBudget - objects.length);
    const kinds: WorldObjectKind[] = ['crate', 'rock', 'structure', 'planter', 'kiosk', 'fountain', 'statue'];
    for (let i = 0; i < target; i += 1) {
      const candidate = this.looseCandidate(roads, rng, spawnPoints, size);
      if (!candidate) continue;
      const kind = rng.pick(kinds);
      const object = this.createObjectDefinition(kind, objects.length, candidate, rng);
      if (
        this.overlapsOccupied(candidate.x, candidate.z, object.boundingRadius, occupied) ||
        this.pointConflictsRoads(candidate.x, candidate.z, object.boundingRadius, roads)
      ) {
        continue;
      }
      objects.push(object);
      occupied.push({ x: object.position.x, z: object.position.z, radius: object.boundingRadius });
    }
  }

  private addPowerUps(
    powerUps: PowerUpSpawnDefinition[],
    occupied: OccupiedFootprint[],
    roads: RoadSegment[],
    spawnPoints: Vec3Data[],
    rng: SeededRandom,
    size: MapSize,
    explicitCount?: number
  ): void {
    const countBySize = { small: 8, medium: 14, large: 28, huge: 44 } satisfies Record<MapSize, number>;
    const types: PowerUpType[] = ['magnet', 'shrink', 'haste', 'shield', 'stamina', 'mass'];
    for (let i = 0; i < (explicitCount ?? countBySize[size]); i += 1) {
      const candidate = this.looseCandidate(roads, rng, spawnPoints, size);
      if (
        !candidate ||
        this.overlapsOccupied(candidate.x, candidate.z, 1.6, occupied) ||
        this.pointConflictsRoads(candidate.x, candidate.z, 1.6, roads)
      ) {
        continue;
      }
      const type = rng.pick(types);
      const settings = POWERUP_SETTINGS[type];
      powerUps.push({
        id: `powerup-${i}`,
        type,
        label: settings.label,
        position: { x: candidate.x, y: 0.55, z: candidate.z },
        radius: 0.75,
        color: settings.color,
        durationSeconds: settings.durationSeconds,
        respawnDelay: POWERUP_RESPAWN_SECONDS
      });
      occupied.push({ x: candidate.x, z: candidate.z, radius: 1.6 });
    }
  }

  private roadsideCandidate(
    road: RoadSegment,
    rng: SeededRandom,
    objectDepth: number,
    spawnPoints: Vec3Data[],
    onSidewalk = false
  ): SpawnCandidate | null {
    const forward = this.forwardVector(road.rotationY);
    const side = this.sideVector(road.rotationY);
    const sideSign = rng.pick([-1, 1]);
    const along = rng.range(-road.length * 0.46, road.length * 0.46);
    const offset = onSidewalk
      ? road.width * 0.5 + road.sidewalkWidth * rng.range(0.25, 0.8)
      : road.width * 0.5 + road.sidewalkWidth + objectDepth * 0.92 + rng.range(1.2, 3.4);
    const x = road.x + forward.x * along + side.x * offset * sideSign;
    const z = road.z + forward.z * along + side.z * offset * sideSign;
    if (this.isTooCloseToAnySpawn(x, z, spawnPoints.slice(0, 5), MAP_SIZE_SETTINGS.small.spawnClearRadius)) {
      return null;
    }
    return { x, z, rotationY: road.rotationY };
  }

  private looseCandidate(
    roads: RoadSegment[],
    rng: SeededRandom,
    spawnPoints: Vec3Data[],
    size: MapSize
  ): SpawnCandidate | null {
    const settings = MAP_SIZE_SETTINGS[size];
    for (let attempt = 0; attempt < 48; attempt += 1) {
      const x = rng.range(-settings.halfExtent + 5, settings.halfExtent - 5);
      const z = rng.range(-settings.halfExtent + 5, settings.halfExtent - 5);
      const road = this.nearestRoad(x, z, roads);
      if (road.distance < road.road.width * 0.5 + road.road.sidewalkWidth + 1.2) continue;
      if (this.isTooCloseToAnySpawn(x, z, spawnPoints.slice(0, 5), settings.spawnClearRadius)) continue;
      return { x, z, rotationY: rng.pick([0, Math.PI / 2, Math.PI, -Math.PI / 2]) };
    }
    return null;
  }

  private createObjectDefinition(
    kind: WorldObjectKind,
    index: number,
    candidate: SpawnCandidate,
    rng: SeededRandom
  ): ObjectSpawnDefinition {
    const base = {
      id: `${kind}-${index}`,
      kind,
      position: { x: candidate.x, y: 0, z: candidate.z },
      rotationY: candidate.rotationY,
      respawnDelay: rng.range(8, 18),
      category: this.categoryForKind(kind),
      roadAligned: true,
      isAd: false
    };

    switch (kind) {
      case 'crate': {
        const box = rng.range(0.55, 1.15);
        return this.withSize(base, 'Supply Crate', { x: box, y: box, z: box }, '#b6783c', box * 0.66, 3.8, 6);
      }
      case 'post': {
        const height = rng.range(1.8, 2.8);
        return this.withSize(base, 'Sidewalk Post', { x: 0.3, y: height, z: 0.3 }, '#c9d2df', 0.28, 1.2, 4);
      }
      case 'bench':
        return this.withSize(base, 'Bench', { x: 1.7, y: 0.55, z: 0.58 }, '#8b5e3c', 0.9, 2.2, 7);
      case 'hydrant':
        return this.withSize(base, 'Hydrant', { x: 0.38, y: 0.75, z: 0.38 }, '#d94848', 0.34, 1.4, 5);
      case 'trash':
        return this.withSize(base, 'Trash Bin', { x: 0.62, y: 0.88, z: 0.62 }, '#2f7e64', 0.48, 2.3, 7);
      case 'cone':
        return this.withSize(base, 'Traffic Cone', { x: 0.46, y: 0.72, z: 0.46 }, '#f97316', 0.34, 1.1, 5);
      case 'mailbox':
        return this.withSize(base, 'Mailbox', { x: 0.58, y: 1.05, z: 0.42 }, '#4f7ca8', 0.42, 1.9, 7);
      case 'bike':
        return this.withSize(base, 'Bike Rack', { x: 0.65, y: 0.82, z: 1.45 }, '#60a5fa', 0.72, 2.8, 10);
      case 'planter':
        return this.withSize(base, 'Planter', { x: rng.range(0.9, 1.55), y: rng.range(0.75, 1.15), z: rng.range(0.8, 1.35) }, '#4ade80', 0.78, 4.2, 12);
      case 'tree': {
        const height = rng.range(2.6, 4.8);
        const crown = rng.range(0.85, 1.55);
        return this.withSize(base, 'Sidewalk Tree', { x: crown, y: height, z: crown }, '#3fb36d', crown * 0.72, 5.8, 10);
      }
      case 'rock': {
        const rock = rng.range(0.6, 1.55);
        return this.withSize(base, 'Landscape Rock', { x: rock * 1.25, y: rock * 0.72, z: rock }, '#8b929c', rock * 0.66, 4.8, 12);
      }
      case 'car': {
        const palette = ['#45a7d8', '#d95763', '#ece077', '#6fc28b', '#b9c1d6'];
        return this.withSize(base, 'City Car', { x: 1.62, y: 0.78, z: 3.05 }, rng.pick(palette), 1.58, 16, 25);
      }
      case 'truck': {
        const palette = ['#f0c850', '#e56f40', '#7aa9d8', '#e2e8f0'];
        return this.withSize(base, 'Delivery Truck', { x: 2.12, y: 1.28, z: 4.35 }, rng.pick(palette), 2.2, 30, 42);
      }
      case 'pedestrian': {
        const palette = ['#f6c453', '#fb7185', '#60a5fa', '#91e88c', '#d8b4fe'];
        return this.withSize(base, 'Pedestrian', { x: 0.45, y: 1.55, z: 0.35 }, rng.pick(palette), 0.36, 2.2, 8);
      }
      case 'structure': {
        const width = rng.range(1.6, 4.4);
        const depth = rng.range(1.5, 4.4);
        const height = rng.range(1.2, 3.2);
        return this.withSize(base, 'Street Structure', { x: width, y: height, z: depth }, '#7cc8b0', Math.hypot(width, depth) * 0.43, 28, 65);
      }
      case 'kiosk':
        return this.withSize(base, 'News Kiosk', { x: 2.05, y: 2.2, z: 1.65 }, '#5aa99f', 1.28, 20, 45);
      case 'fountain':
        return this.withSize(base, 'Plaza Fountain', { x: 2.35, y: 1.25, z: 2.35 }, '#9aa7a3', 1.32, 18, 42);
      case 'statue':
        return this.withSize(base, 'Stone Statue', { x: 1.15, y: 2.35, z: 1.15 }, '#9ca3af', 0.78, 14, 38);
      case 'billboard':
        return this.withSize(base, 'Billboard Ad', { x: 7.6, y: 4.7, z: 0.42 }, '#31394b', 3.82, 48, 82);
      case 'screen':
        return this.withSize(base, 'Video Ad Screen', { x: 7.2, y: 4.5, z: 0.42 }, '#222a3a', 3.64, 52, 88);
      case 'building':
      default: {
        const width = rng.range(4.2, 10.5);
        const depth = rng.range(4.2, 10.5);
        const height = rng.range(4.0, 15.5);
        const palette = ['#77838e', '#8f7f72', '#67788a', '#918d79', '#6f8790', '#9aa3a9', '#75685f', '#5f6f7a'];
        const label = height > 11 ? 'Office Building' : rng.chance(0.35) ? 'Corner Shop' : 'City Building';
        return this.withSize(base, label, { x: width, y: height, z: depth }, rng.pick(palette), Math.hypot(width, depth) * 0.5, width * depth * 1.85, 120);
      }
    }
  }

  private categoryForKind(kind: WorldObjectKind): CityObjectCategory {
    if (kind === 'building') return 'building';
    if (kind === 'car' || kind === 'truck') return 'traffic';
    if (kind === 'post' || kind === 'hydrant' || kind === 'mailbox' || kind === 'cone') return 'utility';
    if (kind === 'tree' || kind === 'rock' || kind === 'planter') return 'nature';
    if (kind === 'billboard' || kind === 'screen') return 'ad';
    if (kind === 'pedestrian') return 'pedestrian';
    if (kind === 'bench' || kind === 'trash' || kind === 'bike' || kind === 'kiosk' || kind === 'fountain' || kind === 'statue') return 'sidewalk';
    return 'decor';
  }

  private withSize(
    base: Omit<ObjectSpawnDefinition, 'label' | 'size' | 'color' | 'boundingRadius' | 'mass' | 'score'>,
    label: string,
    size: Vec3Data,
    color: string,
    boundingRadius: number,
    mass: number,
    score: number
  ): ObjectSpawnDefinition {
    return {
      ...base,
      label,
      size,
      color,
      boundingRadius,
      mass,
      score,
      position: {
        ...base.position,
        y: size.y * 0.5
      }
    };
  }

  private addAdPlacements(
    objects: ObjectSpawnDefinition[],
    adSurfaces: AdSurface[],
    occupied: OccupiedFootprint[],
    roads: RoadSegment[],
    spawnPoints: Vec3Data[],
    adManager: AdManager,
    rng: SeededRandom,
    size: MapSize
  ): void {
    const settings = MAP_SIZE_SETTINGS[size];
    const billboardCount = Math.max(8, Math.floor(settings.halfExtent / 12));
    const buildingCandidates = objects.filter((object) => object.kind === 'building');
    const vehicleCandidates = objects.filter((object) => object.kind === 'truck' || object.kind === 'car');

    for (let i = 0; i < billboardCount; i += 1) {
      const candidate = {
        x: rng.range(-settings.halfExtent * 0.7, settings.halfExtent * 0.7),
        z: rng.range(-settings.halfExtent * 0.7, settings.halfExtent * 0.7),
        rotationY: rng.pick([0, Math.PI / 2, Math.PI, -Math.PI / 2])
      };
      if (
        this.overlapsOccupied(candidate.x, candidate.z, 2.6, occupied) ||
        this.pointConflictsRoads(candidate.x, candidate.z, 2.6, roads)
      ) {
        continue;
      }
      const kind: WorldObjectKind = rng.chance(0.45) ? 'screen' : 'billboard';
      const adObject = this.createObjectDefinition(kind, objects.length, candidate, rng);
      adObject.isAd = true;
      objects.push(adObject);
      occupied.push({ x: candidate.x, z: candidate.z, radius: adObject.boundingRadius });
      const surfacePosition = { x: candidate.x, y: adObject.position.y + 0.28, z: candidate.z };
      const surface =
        kind === 'screen'
          ? adManager.createDigitalVideoScreen(surfacePosition, candidate.rotationY)
          : adManager.createBillboardAd(surfacePosition, candidate.rotationY);
      adObject.adSurfaceId = surface.id;
      adSurfaces.push(surface);
    }

    const edgeOffset = settings.halfExtent * 0.9;
    const edgePlacements: SpawnCandidate[] = [
      { x: -edgeOffset, z: -edgeOffset, rotationY: Math.PI * 0.25 },
      { x: edgeOffset, z: -edgeOffset, rotationY: -Math.PI * 0.25 },
      { x: -edgeOffset, z: edgeOffset, rotationY: Math.PI * 0.75 },
      { x: edgeOffset, z: edgeOffset, rotationY: -Math.PI * 0.75 },
      { x: 0, z: -edgeOffset, rotationY: 0 },
      { x: 0, z: edgeOffset, rotationY: Math.PI },
      { x: -edgeOffset, z: 0, rotationY: Math.PI / 2 },
      { x: edgeOffset, z: 0, rotationY: -Math.PI / 2 }
    ];

    for (const candidate of edgePlacements.slice(0, Math.max(4, Math.floor(settings.halfExtent / 22)))) {
      if (this.overlapsOccupied(candidate.x, candidate.z, 3.4, occupied)) {
        continue;
      }
      const kind: WorldObjectKind = rng.chance(0.38) ? 'screen' : 'billboard';
      const adObject = this.createObjectDefinition(kind, objects.length, candidate, rng);
      adObject.isAd = true;
      objects.push(adObject);
      occupied.push({ x: candidate.x, z: candidate.z, radius: adObject.boundingRadius });
      const surfacePosition = { x: candidate.x, y: adObject.position.y + 0.4, z: candidate.z };
      const surface =
        kind === 'screen'
          ? adManager.createDigitalVideoScreen(surfacePosition, candidate.rotationY)
          : adManager.createBillboardAd(surfacePosition, candidate.rotationY);
      adObject.adSurfaceId = surface.id;
      adSurfaces.push(surface);
    }

    for (const building of buildingCandidates.slice(0, Math.min(32, buildingCandidates.length))) {
      if (!rng.chance(0.42)) continue;
      const side = building.rotationY + rng.pick([0, Math.PI]);
      const offsetX = Math.sin(side) * (building.size.x * 0.52 + 0.05);
      const offsetZ = Math.cos(side) * (building.size.z * 0.52 + 0.05);
      adSurfaces.push(
        adManager.createBuildingBannerAd(
          {
            x: building.position.x + offsetX,
            y: Math.max(2, building.position.y + building.size.y * 0.18),
            z: building.position.z + offsetZ
          },
          side,
          Math.min(6.4, Math.max(2.8, building.size.x * 0.75)),
          1.25
        )
      );
    }

    for (const vehicle of vehicleCandidates.slice(0, Math.min(44, vehicleCandidates.length))) {
      if (!rng.chance(0.34)) continue;
      vehicle.isAd = true;
      adSurfaces.push(
        adManager.createVehicleBranding(
          vehicle.id,
          {
            x: vehicle.position.x,
            y: vehicle.position.y + vehicle.size.y * 0.2,
            z: vehicle.position.z
          },
          vehicle.rotationY
        )
      );
    }
  }

  private nearestRoad(x: number, z: number, roads: RoadSegment[]): { road: RoadSegment; distance: number } {
    let best = roads[0];
    let bestDistance = Number.POSITIVE_INFINITY;
    if (!best) {
      return {
        road: {
          id: 'none',
          x: 0,
          z: 0,
          width: 0,
          length: 0,
          rotationY: 0,
          lanes: 1,
          sidewalkWidth: 0
        },
        distance: Number.POSITIVE_INFINITY
      };
    }
    for (const road of roads) {
      const forward = this.forwardVector(road.rotationY);
      const side = this.sideVector(road.rotationY);
      const dx = x - road.x;
      const dz = z - road.z;
      const along = dx * forward.x + dz * forward.z;
      const lateral = Math.abs(dx * side.x + dz * side.z);
      if (Math.abs(along) > road.length * 0.5) continue;
      if (lateral < bestDistance) {
        best = road;
        bestDistance = lateral;
      }
    }
    return { road: best, distance: bestDistance };
  }

  private pointConflictsRoads(x: number, z: number, radius: number, roads: RoadSegment[]): boolean {
    for (const road of roads) {
      const forward = this.forwardVector(road.rotationY);
      const side = this.sideVector(road.rotationY);
      const dx = x - road.x;
      const dz = z - road.z;
      const along = dx * forward.x + dz * forward.z;
      if (Math.abs(along) > road.length * 0.5 + radius) {
        continue;
      }
      const lateral = Math.abs(dx * side.x + dz * side.z);
      const protectedWidth = road.width * 0.5 + road.sidewalkWidth + Math.max(0.9, radius * 0.86);
      if (lateral < protectedWidth) {
        return true;
      }
    }
    return false;
  }

  private routePoint(route: TrafficRoute | PedestrianPath, t: number): { position: RoutePoint; rotationY: number } {
    const segmentIndex = Math.min(route.points.length - 2, Math.max(0, Math.floor(t)));
    const localT = Math.max(0, Math.min(1, t - segmentIndex));
    const start = route.points[segmentIndex];
    const end = route.points[segmentIndex + 1] ?? route.points[0];
    return {
      position: {
        x: start.x + (end.x - start.x) * localT,
        z: start.z + (end.z - start.z) * localT
      },
      rotationY: Math.atan2(end.x - start.x, end.z - start.z)
    };
  }

  private overlapsOccupied(x: number, z: number, radius: number, occupied: OccupiedFootprint[]): boolean {
    for (const footprint of occupied) {
      const dx = x - footprint.x;
      const dz = z - footprint.z;
      const minDistance = radius + footprint.radius + 0.55;
      if (dx * dx + dz * dz < minDistance * minDistance) {
        return true;
      }
    }
    return false;
  }

  private isTooCloseToAnySpawn(x: number, z: number, spawnPoints: Vec3Data[], radius: number): boolean {
    for (const spawn of spawnPoints) {
      const dx = x - spawn.x;
      const dz = z - spawn.z;
      if (dx * dx + dz * dz < radius * radius) {
        return true;
      }
    }
    return false;
  }

  private forwardVector(rotationY: number): RoutePoint {
    return { x: Math.sin(rotationY), z: Math.cos(rotationY) };
  }

  private sideVector(rotationY: number): RoutePoint {
    return { x: Math.cos(rotationY), z: -Math.sin(rotationY) };
  }
}
