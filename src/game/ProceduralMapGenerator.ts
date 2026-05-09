import { AdManager } from '../ads/AdManager';
import { MAP_SIZE_SETTINGS, POWERUP_SETTINGS } from '../shared/constants';
import {
  getEnabledPowerUpTypes,
  getEngineConfig,
  getPowerUpEngineSettings,
  getWorldObjectSpawnHeightOffset,
  isWorldObjectKindEnabled,
  runtimePowerUpRespawnSeconds
} from '../admin/EngineConfig';
import { getEnabledCustomObjectVariantsForKind } from '../admin/PrebuildAssetRegistry';
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
  TrafficSignalDefinition,
  TrafficRoute,
  Vec3Data,
  WorldObjectKind
} from '../shared/types';

interface OccupiedFootprint {
  x: number;
  z: number;
  radius: number;
  halfWidth?: number;
  halfDepth?: number;
  rotationY?: number;
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
  trafficSignals: TrafficSignalDefinition[];
  pedestrianPaths: PedestrianPath[];
}

type CityZone =
  | 'industrial'
  | 'commercial'
  | 'highResidential'
  | 'lowResidential'
  | 'civic'
  | 'greenEdge';

const ROAD_LAYOUT_GUIDELINES: Record<MapSize, {
  avenueCount: number;
  sideStreetCount: number;
  minBlockScale: number;
  axisJitterScale: number;
  usableHalfScale: number;
  crosswalkClusterScale: number;
}> = {
  small: {
    avenueCount: 2,
    sideStreetCount: 0,
    minBlockScale: 0.98,
    axisJitterScale: 0.08,
    usableHalfScale: 0.68,
    crosswalkClusterScale: 0.72
  },
  medium: {
    avenueCount: 3,
    sideStreetCount: 0,
    minBlockScale: 1.04,
    axisJitterScale: 0.075,
    usableHalfScale: 0.72,
    crosswalkClusterScale: 0.78
  },
  large: {
    avenueCount: 5,
    sideStreetCount: 1,
    minBlockScale: 1.08,
    axisJitterScale: 0.065,
    usableHalfScale: 0.75,
    crosswalkClusterScale: 0.84
  },
  huge: {
    avenueCount: 6,
    sideStreetCount: 2,
    minBlockScale: 1.12,
    axisJitterScale: 0.055,
    usableHalfScale: 0.76,
    crosswalkClusterScale: 0.88
  }
};

const STREETLIGHT_SPACING = 14;
const STREETLIGHT_MIN_SEGMENT_LENGTH = 5.5;
const CROSSWALK_OBJECT_CLEARANCE = 0.9;

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

    this.addTrafficSignalObjects(objects, occupied, network.trafficSignals, rng);
    this.reserveCrosswalkFootprints(occupied, network.surfaces);
    this.addStreetlights(objects, occupied, network.surfaces, rng);
    this.addPlazas(objects, occupied, network.surfaces, network.roads, spawnPoints, rng, options.size);
    this.addParkingLots(objects, occupied, network.surfaces, network.roads, spawnPoints, rng, options.size);
    this.addResidentialLots(objects, occupied, network.roads, spawnPoints, rng, options.size);
    this.addCivicBuildings(objects, occupied, network.roads, spawnPoints, rng, options.size);
    this.addBuildings(objects, occupied, network.roads, spawnPoints, rng, objectBudget);
    this.addRoadsideObjects(objects, occupied, network.roads, spawnPoints, rng, objectBudget);
    this.addBenchTrashPairs(objects, occupied, rng);
    this.addBuildingServiceProps(objects, occupied, network.roads, rng, objectBudget);
    this.addEdgeNature(objects, occupied, network.roads, spawnPoints, rng, options.size, objectBudget);
    this.addTraffic(objects, occupied, network.trafficRoutes, network.roads, network.surfaces, rng, objectBudget);
    this.addParkedVehicles(objects, occupied, network.roads, network.surfaces, spawnPoints, rng, objectBudget);
    this.addPedestrians(objects, occupied, network.pedestrianPaths, rng, objectBudget);
    this.addSeatedPedestrians(objects, occupied, rng, objectBudget);
    this.addBuildingDoorPedestrians(objects, occupied, network.pedestrianPaths, network.roads, rng, objectBudget);
    this.addLooseCityObjects(objects, occupied, network.roads, spawnPoints, rng, options.size, objectBudget);
    this.addPowerUps(powerUps, occupied, network.roads, spawnPoints, rng, options.size, options.powerUpCount);

    if (options.enableAds) {
      this.addAdPlacements(objects, adSurfaces, occupied, network.roads, spawnPoints, adManager, rng, options.size);
    }

    const engineConfig = getEngineConfig();
    const filteredObjects = this.finalizeObjectPlacement(
      objects.filter((object) => isWorldObjectKindEnabled(object.kind)),
      network.roads,
      network.surfaces,
      network.pedestrianPaths
    );
    const filteredAdSurfaces = engineConfig.generation.adsEnabled
      ? adSurfaces.filter((surface) => !surface.attachedObjectId || filteredObjects.some((object) => object.id === surface.attachedObjectId))
      : [];

    return {
      seed,
      size: options.size,
      halfExtent: settings.halfExtent,
      roads: network.roads,
      surfaces: network.surfaces,
      trafficRoutes: network.trafficRoutes,
      trafficSignals: network.trafficSignals,
      pedestrianPaths: network.pedestrianPaths,
      objects: filteredObjects,
      powerUps,
      spawnPoints,
      adSurfaces: filteredAdSurfaces
    };
  }

  private createRoadNetwork(size: MapSize, rng: SeededRandom): RoadNetwork {
    const settings = MAP_SIZE_SETTINGS[size];
    const guidelines = ROAD_LAYOUT_GUIDELINES[size];
    const roads: RoadSegment[] = [];
    const surfaces: SurfaceSegment[] = [];
    const trafficRoutes: TrafficRoute[] = [];
    const trafficSignals: TrafficSignalDefinition[] = [];
    const pedestrianPaths: PedestrianPath[] = [];
    const half = settings.halfExtent;
    const majorCount = guidelines.avenueCount;

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

    const verticalPositions = this.cityAxisPositions(
      majorCount,
      half,
      settings.blockSize,
      rng,
      guidelines
    );
    const horizontalPositions = this.cityAxisPositions(
      majorCount,
      half,
      settings.blockSize,
      rng,
      guidelines
    );

    verticalPositions.forEach((x, index) => addRoad(`avenue-v-${index}`, x, 0, half * 1.9, 0));
    horizontalPositions.forEach((z, index) => addRoad(`avenue-h-${index}`, 0, z, half * 1.9, Math.PI / 2));

    const sideStreetCount = guidelines.sideStreetCount;
    for (let i = 0; i < sideStreetCount; i += 1) {
      const vertical = rng.chance(0.5);
      const base = rng.pick(vertical ? verticalPositions : horizontalPositions);
      const offset = rng.pick([-1, 1]) * rng.range(settings.blockSize * 1.05, settings.blockSize * 1.36);
      const center = rng.range(-half * 0.45, half * 0.45);
      const length = rng.range(half * 0.28, half * 0.52);
      if (vertical) {
        addRoad(`side-v-${i}`, base + offset, center, length, 0, settings.roadWidth * 0.72);
      } else {
        addRoad(`side-h-${i}`, center, base + offset, length, Math.PI / 2, settings.roadWidth * 0.72);
      }
    }

    trafficRoutes.push(...this.createTurningTrafficRoutes(roads, rng));

    for (const road of roads) {
      this.addRoadSurfaces(road, roads, surfaces);
    }
    this.addCrosswalks(roads, surfaces, settings.roadWidth, settings.blockSize * guidelines.crosswalkClusterScale);
    this.addTrafficSignals(roads, trafficRoutes, trafficSignals);

    return { roads, surfaces, trafficRoutes, trafficSignals, pedestrianPaths };
  }

  private cityAxisPositions(
    count: number,
    half: number,
    blockSize: number,
    rng: SeededRandom,
    guidelines: typeof ROAD_LAYOUT_GUIDELINES[MapSize]
  ): number[] {
    const target = Math.max(1, count);
    if (target === 1) {
      return [0];
    }

    const positions = new Set<number>([0]);
    const minGap = blockSize * guidelines.minBlockScale;
    const usableHalf = half * guidelines.usableHalfScale;
    const rings = Math.max(1, Math.ceil((target - 1) / 2));

    for (let ring = 1; positions.size < target && ring <= rings + 1; ring += 1) {
      for (const side of [-1, 1]) {
        if (positions.size >= target) {
          break;
        }
        const baseDistance = Math.min(usableHalf, (usableHalf * ring) / rings);
        const candidate = Math.round((side * baseDistance + rng.range(-blockSize * guidelines.axisJitterScale, blockSize * guidelines.axisJitterScale)) * 10) / 10;
        if ([...positions].some((position) => Math.abs(position - candidate) < minGap)) {
          continue;
        }
        positions.add(candidate);
      }
    }

    for (let attempt = 0; positions.size < target && attempt < target * 12; attempt += 1) {
      const candidate = Math.round(rng.range(-usableHalf, usableHalf) * 10) / 10;
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
          kind: 'sidewalk',
          roadSideSign: side as -1 | 1
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

  private addCrosswalks(
    roads: RoadSegment[],
    surfaces: SurfaceSegment[],
    roadWidth: number,
    minIntersectionGap: number
  ): void {
    let id = 0;
    const placed: RoutePoint[] = [];
    const placedIntersections: RoutePoint[] = [];
    for (const a of roads) {
      for (const b of roads) {
        if (a.id >= b.id || Math.abs(Math.sin(a.rotationY - b.rotationY)) < 0.8) {
          continue;
        }

        const aIsAvenue = a.id.startsWith('avenue');
        const bIsAvenue = b.id.startsWith('avenue');
        if (!aIsAvenue || !bIsAvenue) {
          continue;
        }

        const vertical = Math.abs(Math.sin(a.rotationY)) < 0.5 ? a : b;
        const horizontal = vertical === a ? b : a;
        const center = { x: vertical.x, z: horizontal.z };
        if (placedIntersections.some((point) => Math.hypot(point.x - center.x, point.z - center.z) < minIntersectionGap)) {
          continue;
        }
        const inVertical = Math.abs(horizontal.z - vertical.z) <= vertical.length * 0.5;
        const inHorizontal = Math.abs(vertical.x - horizontal.x) <= horizontal.length * 0.5;
        if (!inVertical || !inHorizontal) {
          continue;
        }

        const verticalForward = this.forwardVector(vertical.rotationY);
        const horizontalForward = this.forwardVector(horizontal.rotationY);
        const verticalApproach = horizontal.width * 0.5 + 2.05;
        const horizontalApproach = vertical.width * 0.5 + 2.05;
        const crosswalkDepth = (road: RoadSegment): number => Math.max(2.4, Math.min(3.5, road.width * 0.42));
        const candidates: SurfaceSegment[] = [];
        for (const sign of [-1, 1]) {
          candidates.push(
            {
              id: `crosswalk-${id}`,
              x: vertical.x + verticalForward.x * verticalApproach * sign,
              z: horizontal.z + verticalForward.z * verticalApproach * sign,
              width: crosswalkDepth(vertical),
              length: vertical.width + 0.85,
              rotationY: vertical.rotationY + Math.PI / 2,
              kind: 'crosswalk'
            },
            {
              id: `crosswalk-${id + 1}`,
              x: vertical.x + horizontalForward.x * horizontalApproach * sign,
              z: horizontal.z + horizontalForward.z * horizontalApproach * sign,
              width: crosswalkDepth(horizontal),
              length: horizontal.width + 0.85,
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
        placedIntersections.push(center);
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
    const laneOffset = road.width * (road.lanes === 2 ? 0.25 : 0.23);
    const startAlong = -road.length * 0.48;
    const endAlong = road.length * 0.48;
    const routes: TrafficRoute[] = [];
    for (const lane of [-1, 1]) {
      const laneStart = lane < 0 ? startAlong : endAlong;
      const laneEnd = lane < 0 ? endAlong : startAlong;
      routes.push({
        id: `${road.id}-traffic-${lane}`,
        loop: true,
        points: [
          {
            x: road.x + forward.x * laneStart + side.x * laneOffset * lane,
            z: road.z + forward.z * laneStart + side.z * laneOffset * lane
          },
          {
            x: road.x + forward.x * laneEnd + side.x * laneOffset * lane,
            z: road.z + forward.z * laneEnd + side.z * laneOffset * lane
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

  private createTurningTrafficRoutes(roads: RoadSegment[], rng: SeededRandom): TrafficRoute[] {
    const routes: TrafficRoute[] = [];
    const verticals = roads.filter((road) => Math.abs(Math.sin(road.rotationY)) < 0.5);
    const horizontals = roads.filter((road) => Math.abs(Math.cos(road.rotationY)) < 0.5);
    for (const vertical of verticals) {
      for (const horizontal of horizontals) {
        if (routes.length >= 24 || !rng.chance(0.42)) {
          continue;
        }
        const center = { x: vertical.x, z: horizontal.z };
        if (
          Math.abs(center.z - vertical.z) > vertical.length * 0.5 ||
          Math.abs(center.x - horizontal.x) > horizontal.length * 0.5
        ) {
          continue;
        }
        const verticalSign = rng.pick([-1, 1]);
        const horizontalSign = rng.pick([-1, 1]);
        const laneOffsetV = vertical.width * (vertical.lanes === 2 ? 0.25 : 0.23);
        const laneOffsetH = horizontal.width * (horizontal.lanes === 2 ? 0.25 : 0.23);
        const turnRadius = Math.max(3.8, Math.min(6.8, (vertical.width + horizontal.width) * 0.34));
        const vLaneX = center.x + laneOffsetV * horizontalSign;
        const hLaneZ = center.z + laneOffsetH * verticalSign;
        const vStart = {
          x: vLaneX,
          z: center.z - verticalSign * Math.min(20, vertical.length * 0.22)
        };
        const beforeTurn = {
          x: vLaneX,
          z: center.z - verticalSign * turnRadius
        };
        const afterTurn = {
          x: center.x + horizontalSign * turnRadius,
          z: hLaneZ
        };
        const hEnd = {
          x: center.x + horizontalSign * Math.min(22, horizontal.length * 0.22),
          z: hLaneZ
        };
        const arc = this.quadraticRoutePoints(beforeTurn, { x: vLaneX, z: hLaneZ }, afterTurn, 6);
        routes.push({
          id: `turn-${vertical.id}-${horizontal.id}-${routes.length}`,
          loop: true,
          points: [vStart, beforeTurn, ...arc, afterTurn, hEnd]
        });
      }
    }
    return routes;
  }

  private quadraticRoutePoints(start: RoutePoint, control: RoutePoint, end: RoutePoint, steps: number): RoutePoint[] {
    const points: RoutePoint[] = [];
    for (let i = 1; i < steps; i += 1) {
      const t = i / steps;
      const inv = 1 - t;
      points.push({
        x: inv * inv * start.x + 2 * inv * t * control.x + t * t * end.x,
        z: inv * inv * start.z + 2 * inv * t * control.z + t * t * end.z
      });
    }
    return points;
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
    const countBySize = { small: 2, medium: 4, large: 8, huge: 13 } satisfies Record<MapSize, number>;
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

  private addParkingLots(
    objects: ObjectSpawnDefinition[],
    occupied: OccupiedFootprint[],
    surfaces: SurfaceSegment[],
    roads: RoadSegment[],
    spawnPoints: Vec3Data[],
    rng: SeededRandom,
    size: MapSize
  ): void {
    const countBySize = { small: 1, medium: 2, large: 4, huge: 7 } satisfies Record<MapSize, number>;
    for (let lotIndex = 0; lotIndex < countBySize[size]; lotIndex += 1) {
      let lot: (SpawnCandidate & { width: number; length: number }) | null = null;

      for (let attempt = 0; attempt < 80; attempt += 1) {
        const road = rng.pick(roads);
        const forward = this.forwardVector(road.rotationY);
        const side = this.sideVector(road.rotationY);
        const sideSign = rng.pick([-1, 1]);
        const maxScaleBySize = { small: 1.35, medium: 1.72, large: 2.02, huge: 2.16 } satisfies Record<MapSize, number>;
        const lotScale = rng.chance(0.36)
          ? rng.range(1.28, maxScaleBySize[size])
          : rng.range(0.95, 1.22);
        const width = rng.range(8.8, size === 'small' ? 11.5 : 15.2) * lotScale;
        const length = rng.range(12, size === 'small' ? 16 : 23.5) * lotScale;
        const along = rng.range(-road.length * 0.38, road.length * 0.38);
        const offset = road.width * 0.5 + road.sidewalkWidth + width * 0.5 + rng.range(2.4, 4.8);
        const x = road.x + forward.x * along + side.x * offset * sideSign;
        const z = road.z + forward.z * along + side.z * offset * sideSign;
        const radius = Math.hypot(width, length) * 0.52;
        const lotFootprint = {
          x,
          z,
          radius,
          halfWidth: width * 0.5 + 0.8,
          halfDepth: length * 0.5 + 0.8,
          rotationY: road.rotationY
        };
        if (
          this.overlapsFootprint(lotFootprint, occupied) ||
          this.pointConflictsRoads(x, z, Math.max(2.2, Math.min(width * 0.42, 5.8)), roads) ||
          this.isTooCloseToAnySpawn(x, z, spawnPoints.slice(0, 5), MAP_SIZE_SETTINGS[size].spawnClearRadius + 1.5)
        ) {
          continue;
        }

        lot = { x, z, rotationY: road.rotationY, width, length };
        break;
      }

      if (!lot) {
        continue;
      }

      surfaces.push({
        id: `parking-lot-${lotIndex}`,
        x: lot.x,
        z: lot.z,
        width: lot.width,
        length: lot.length,
        rotationY: lot.rotationY,
        kind: 'parking'
      });

      const forward = this.forwardVector(lot.rotationY);
      const side = this.sideVector(lot.rotationY);
      const localOccupied: OccupiedFootprint[] = [];
      const usableWidth = lot.width * 0.84;
      const usableLength = lot.length * 0.84;
      const columns = Math.max(2, Math.min(8, Math.floor(usableWidth / 3.05)));
      const rows = Math.max(2, Math.min(10, Math.floor(usableLength / 4.35)));
      const stallWidth = usableWidth / columns;
      const rowDepth = usableLength / rows;
      for (let row = 0; row < rows; row += 1) {
        for (let column = 0; column < columns; column += 1) {
          if (!rng.chance(0.72)) {
            continue;
          }
          const localX = -usableWidth * 0.5 + stallWidth * (column + 0.5) + rng.range(-0.1, 0.1);
          const localZ = -usableLength * 0.5 + rowDepth * (row + 0.5) + rng.range(-0.16, 0.16);
          const x = lot.x + side.x * localX + forward.x * localZ;
          const z = lot.z + side.z * localX + forward.z * localZ;
          const kind: WorldObjectKind = rng.chance(0.14) ? 'emergency' : 'car';
          const car = this.createObjectDefinition(kind, objects.length, {
            x,
            z,
            rotationY: lot.rotationY + (row % 2 === 1 ? Math.PI : 0)
          }, rng);
          car.label = `Parked ${car.label}`;
          car.lightsEnabled = false;
          car.variantRole = 'parking-stall';
          if (
            this.overlapsOccupied(x, z, car.boundingRadius * 0.42, occupied) ||
            this.overlapsOccupied(x, z, car.boundingRadius * 0.42, localOccupied)
          ) {
            continue;
          }
          objects.push(car);
          const footprint = {
            x,
            z,
            radius: car.boundingRadius * 0.42,
            halfWidth: car.size.x * 0.5 + 0.18,
            halfDepth: car.size.z * 0.5 + 0.18,
            rotationY: car.rotationY
          };
          localOccupied.push(footprint);
          occupied.push(footprint);
        }
      }

      for (const sign of [-1, 1]) {
        if (!rng.chance(0.68)) {
          continue;
        }
        const x = lot.x + side.x * (sign * lot.width * 0.43) + forward.x * rng.range(-lot.length * 0.32, lot.length * 0.32);
        const z = lot.z + side.z * (sign * lot.width * 0.43) + forward.z * rng.range(-lot.length * 0.32, lot.length * 0.32);
        const kind: WorldObjectKind = rng.chance(0.5) ? 'trash' : 'crate';
        const prop = this.createObjectDefinition(kind, objects.length, { x, z, rotationY: lot.rotationY }, rng);
        if (!this.overlapsOccupied(x, z, prop.boundingRadius, occupied)) {
          objects.push(prop);
          occupied.push({ x, z, radius: prop.boundingRadius });
        }
      }

      occupied.push({
        x: lot.x,
        z: lot.z,
        radius: Math.hypot(lot.width, lot.length) * 0.52,
        halfWidth: lot.width * 0.5 + 0.45,
        halfDepth: lot.length * 0.5 + 0.45,
        rotationY: lot.rotationY
      });
    }
  }

  private addResidentialLots(
    objects: ObjectSpawnDefinition[],
    occupied: OccupiedFootprint[],
    roads: RoadSegment[],
    spawnPoints: Vec3Data[],
    rng: SeededRandom,
    size: MapSize
  ): void {
    const targetBySize = { small: 3, medium: 7, large: 15, huge: 24 } satisfies Record<MapSize, number>;
    let placed = 0;
    let attempts = 0;
    while (placed < targetBySize[size] && attempts < targetBySize[size] * 30) {
      attempts += 1;
      const road = rng.pick(roads);
      const forward = this.forwardVector(road.rotationY);
      const side = this.sideVector(road.rotationY);
      const sideSign = rng.pick([-1, 1]);
      const lotWidth = rng.range(8.2, 11.5);
      const lotDepth = rng.range(8.4, 12.5);
      const along = rng.range(-road.length * 0.42, road.length * 0.42);
      const offset = road.width * 0.5 + road.sidewalkWidth + lotDepth * 0.5 + rng.range(1.6, 3.3);
      const centerX = road.x + forward.x * along + side.x * offset * sideSign;
      const centerZ = road.z + forward.z * along + side.z * offset * sideSign;
      if (this.zoneForPosition(centerX, centerZ) !== 'lowResidential') {
        continue;
      }
      const radius = Math.hypot(lotWidth, lotDepth) * 0.52;
      if (
        this.overlapsOccupied(centerX, centerZ, radius + 0.35, occupied) ||
        this.pointConflictsRoads(centerX, centerZ, radius * 0.72, roads) ||
        this.isTooCloseToAnySpawn(centerX, centerZ, spawnPoints.slice(0, 5), MAP_SIZE_SETTINGS[size].spawnClearRadius + 1)
      ) {
        continue;
      }

      const lotOccupied: OccupiedFootprint[] = [];
      const placeLocal = (
        object: ObjectSpawnDefinition,
        localDepth: number,
        localFront: number,
        footprintScale = 1
      ): boolean => {
        object.position.x = centerX + side.x * localDepth * sideSign + forward.x * localFront;
        object.position.z = centerZ + side.z * localDepth * sideSign + forward.z * localFront;
        const footprint = {
          x: object.position.x,
          z: object.position.z,
          radius: object.boundingRadius * footprintScale,
          halfWidth: object.size.x * 0.5 + 0.22,
          halfDepth: object.size.z * 0.5 + 0.22,
          rotationY: object.rotationY
        };
        if (
          this.overlapsOccupied(footprint.x, footprint.z, footprint.radius, occupied) ||
          this.overlapsOccupied(footprint.x, footprint.z, footprint.radius, lotOccupied)
        ) {
          return false;
        }
        objects.push(object);
        occupied.push(footprint);
        lotOccupied.push(footprint);
        return true;
      };

      const houseSize = { x: rng.range(4.0, 5.6), y: rng.range(2.8, 4.4), z: rng.range(4.0, 5.8) };
      const house = this.createManualObjectDefinition(
        'building',
        objects.length,
        { x: centerX, z: centerZ, rotationY: road.rotationY },
        'Detached House',
        houseSize,
        rng.pick(['#9a8068', '#8e9377', '#a58d74', '#7d8b80']),
        Math.hypot(houseSize.x, houseSize.z) * 0.5,
        houseSize.x * houseSize.z * 1.35,
        95
      );
      if (!placeLocal(house, lotDepth * 0.12, rng.range(-lotWidth * 0.12, lotWidth * 0.12))) {
        continue;
      }

      const garage = this.createManualObjectDefinition(
        'structure',
        objects.length,
        { x: centerX, z: centerZ, rotationY: road.rotationY },
        'Home Garage',
        { x: rng.range(2.4, 3.4), y: 1.7, z: rng.range(2.6, 3.6) },
        '#7d8a83',
        1.75,
        18,
        38,
        'decor'
      );
      placeLocal(garage, -lotDepth * 0.28, rng.pick([-1, 1]) * lotWidth * 0.26, 0.92);

      const carCount = rng.chance(0.55) ? 2 : 1;
      for (let carIndex = 0; carIndex < carCount; carIndex += 1) {
        const localFront = (carIndex - (carCount - 1) * 0.5) * 2.1;
        const car = this.createObjectDefinition(rng.chance(0.18) ? 'truck' : 'car', objects.length, {
          x: centerX,
          z: centerZ,
          rotationY: road.rotationY
        }, rng);
        car.label = `Garage ${car.label}`;
        car.lightsEnabled = false;
        placeLocal(car, -lotDepth * 0.38, localFront, 0.88);
      }

      const fenceColor = '#8a735c';
      for (const fence of [
        { depth: -lotDepth * 0.5, front: 0, size: { x: lotWidth, y: 0.62, z: 0.12 }, rot: road.rotationY + Math.PI / 2 },
        { depth: lotDepth * 0.5, front: 0, size: { x: lotWidth, y: 0.62, z: 0.12 }, rot: road.rotationY + Math.PI / 2 },
        { depth: 0, front: -lotWidth * 0.5, size: { x: 0.12, y: 0.62, z: lotDepth }, rot: road.rotationY },
        { depth: 0, front: lotWidth * 0.5, size: { x: 0.12, y: 0.62, z: lotDepth }, rot: road.rotationY }
      ]) {
        if (!rng.chance(0.86)) {
          continue;
        }
        const object = this.createManualObjectDefinition(
          'structure',
          objects.length,
          { x: centerX, z: centerZ, rotationY: fence.rot },
          'Lot Fence',
          fence.size,
          fenceColor,
          Math.hypot(fence.size.x, fence.size.z) * 0.5,
          5,
          8,
          'decor'
        );
        placeLocal(object, fence.depth, fence.front, 0.72);
      }

      for (let treeIndex = 0; treeIndex < rng.int(1, 4); treeIndex += 1) {
        const tree = this.createObjectDefinition('tree', objects.length, { x: centerX, z: centerZ, rotationY: rng.range(0, Math.PI * 2) }, rng);
        placeLocal(tree, rng.range(-lotDepth * 0.34, lotDepth * 0.42), rng.range(-lotWidth * 0.42, lotWidth * 0.42), 0.8);
      }

      occupied.push({
        x: centerX,
        z: centerZ,
        radius,
        halfWidth: lotDepth * 0.5 + 0.35,
        halfDepth: lotWidth * 0.5 + 0.35,
        rotationY: road.rotationY
      });
      placed += 1;
    }
  }

  private addCivicBuildings(
    objects: ObjectSpawnDefinition[],
    occupied: OccupiedFootprint[],
    roads: RoadSegment[],
    spawnPoints: Vec3Data[],
    rng: SeededRandom,
    size: MapSize
  ): void {
    const stations = size === 'small'
      ? [rng.chance(0.5) ? 'Fire Station' : 'Police Station']
      : ['Fire Station', 'Police Station'];

    for (const label of stations) {
      for (let attempt = 0; attempt < 72; attempt += 1) {
        const road = rng.pick(roads);
        const candidate = this.roadsideCandidate(road, rng, 6.5, spawnPoints);
        if (!candidate) {
          continue;
        }
        const zone = this.zoneForPosition(candidate.x, candidate.z);
        if (zone !== 'commercial' && zone !== 'industrial' && zone !== 'civic') {
          continue;
        }
        const sizeDef = label === 'Fire Station'
          ? { x: 10.4, y: 3.6, z: 7.4 }
          : { x: 8.6, y: 4.1, z: 6.4 };
        const radius = Math.hypot(sizeDef.x, sizeDef.z) * 0.52;
        if (
          this.overlapsOccupied(candidate.x, candidate.z, radius + 0.6, occupied) ||
          this.pointConflictsRoads(candidate.x, candidate.z, Math.min(4.8, radius * 0.64), roads)
        ) {
          continue;
        }

        const building = this.createManualObjectDefinition(
          'building',
          objects.length,
          candidate,
          label,
          sizeDef,
          label === 'Fire Station' ? '#8e5650' : '#59677e',
          radius,
          sizeDef.x * sizeDef.z * 1.8,
          150
        );
        objects.push(building);
        occupied.push({
          x: building.position.x,
          z: building.position.z,
          radius: radius + 0.55,
          halfWidth: sizeDef.x * 0.5 + 0.58,
          halfDepth: sizeDef.z * 0.5 + 0.58,
          rotationY: building.rotationY
        });

        const forward = this.forwardVector(candidate.rotationY);
        const side = this.sideVector(candidate.rotationY);
        const emergencyCount = label === 'Fire Station' ? 2 : 1;
        for (let i = 0; i < emergencyCount; i += 1) {
          const x = candidate.x - forward.x * (sizeDef.z * 0.52 + 2.3) + side.x * (i - (emergencyCount - 1) * 0.5) * 2.4;
          const z = candidate.z - forward.z * (sizeDef.z * 0.52 + 2.3) + side.z * (i - (emergencyCount - 1) * 0.5) * 2.4;
          const vehicle = this.createObjectDefinition('emergency', objects.length, { x, z, rotationY: candidate.rotationY }, rng);
          vehicle.label = label === 'Fire Station' ? 'Fire Response Truck' : 'Police Car';
          vehicle.color = label === 'Fire Station' ? '#f43f5e' : '#f8fafc';
          vehicle.lightsEnabled = false;
          if (!this.overlapsOccupied(x, z, vehicle.boundingRadius, occupied)) {
            objects.push(vehicle);
            occupied.push({
              x,
              z,
              radius: vehicle.boundingRadius,
              halfWidth: vehicle.size.x * 0.5 + 0.3,
              halfDepth: vehicle.size.z * 0.5 + 0.3,
              rotationY: vehicle.rotationY
            });
          }
        }
        break;
      }
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
    const target = Math.floor(objectBudget * 0.42);
    let placed = 0;
    let attempts = 0;
    while (placed < target && attempts < target * 14) {
      attempts += 1;
      const road = rng.pick(roads);
      const candidate = rng.chance(0.48)
        ? this.roadsideCandidate(road, rng, rng.range(2.8, 6.8), spawnPoints)
        : this.blockInteriorBuildingCandidate(roads, rng, spawnPoints);
      if (!candidate || this.overlapsOccupied(candidate.x, candidate.z, 2.35, occupied)) {
        continue;
      }
      const object = this.createObjectDefinition('building', objects.length, candidate, rng);
      const spacingRadius = this.buildingSpacingRadius(object);
      const roadClearRadius = Math.min(3.6, Math.max(1.35, object.boundingRadius * 0.34));
      if (
        this.overlapsOccupied(candidate.x, candidate.z, spacingRadius, occupied) ||
        this.pointConflictsRoads(object.position.x, object.position.z, roadClearRadius, roads)
      ) {
        continue;
      }
      objects.push(object);
      occupied.push({
        x: candidate.x,
        z: candidate.z,
        radius: spacingRadius,
        halfWidth: object.size.x * 0.5 + 0.38,
        halfDepth: object.size.z * 0.5 + 0.38,
        rotationY: object.rotationY
      });
      placed += 1;
    }
  }

  private addTrafficSignals(
    roads: RoadSegment[],
    routes: TrafficRoute[],
    trafficSignals: TrafficSignalDefinition[]
  ): void {
    const routesById = new Map(routes.map((route) => [route.id, route]));
    const maxSignals = 220;
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
        const center = { x: vertical.x, z: horizontal.z };
        if (
          Math.abs(center.z - vertical.z) > vertical.length * 0.5 ||
          Math.abs(center.x - horizontal.x) > horizontal.length * 0.5
        ) {
          continue;
        }

        const groupId = `signal-${Math.round(center.x * 10)}-${Math.round(center.z * 10)}`;
        const phaseOffset = ((Math.abs(Math.round(center.x * 3 + center.z * 5)) % 4) - 1.5) * 0.012;
        const approaches: Array<{ road: RoadSegment; crossRoad: RoadSegment; axis: TrafficSignalDefinition['axis'] }> = [
          { road: vertical, crossRoad: horizontal, axis: 'vertical' },
          { road: horizontal, crossRoad: vertical, axis: 'horizontal' }
        ];

        for (const approach of approaches) {
          for (const lane of [-1, 1]) {
            if (trafficSignals.length >= maxSignals) {
              return;
            }
            const routeId = `${approach.road.id}-traffic-${lane}`;
            const route = routesById.get(routeId);
            if (!route) {
              continue;
            }

            const stopT = this.stopTForRouteAtIntersection(
              route,
              center,
              approach.crossRoad.width * 0.5 + 1.55
            );
            if (stopT === null) {
              continue;
            }

            const routeSample = this.routePoint(route, stopT);
            const side = this.sideVector(approach.road.rotationY);
            const sidewalkOffset = approach.road.width * 0.5 + approach.road.sidewalkWidth * 0.48;
            const poleSide = lane < 0 ? -1 : 1;
            trafficSignals.push({
              id: `${groupId}-${approach.axis}-${lane}`,
              routeId,
              groupId,
              axis: approach.axis,
              position: {
                x: routeSample.position.x + side.x * sidewalkOffset * poleSide,
                y: 0,
                z: routeSample.position.z + side.z * sidewalkOffset * poleSide
              },
              rotationY: routeSample.rotationY,
              stopT,
              phaseOffset
            });
          }
        }
      }
    }
  }

  private stopTForRouteAtIntersection(
    route: TrafficRoute,
    center: RoutePoint,
    stopOffset: number
  ): number | null {
    if (route.points.length < 2) {
      return null;
    }

    const start = route.points[0];
    const end = route.points[1];
    const dx = end.x - start.x;
    const dz = end.z - start.z;
    const length = Math.hypot(dx, dz);
    if (length < 0.001) {
      return null;
    }

    const dirX = dx / length;
    const dirZ = dz / length;
    const projected = (center.x - start.x) * dirX + (center.z - start.z) * dirZ;
    const lateralX = center.x - (start.x + dirX * projected);
    const lateralZ = center.z - (start.z + dirZ * projected);
    const lateralDistance = Math.hypot(lateralX, lateralZ);
    if (lateralDistance > 5.4 || projected < stopOffset + 1.2 || projected > length - 2.2) {
      return null;
    }

    return Math.max(0.04, Math.min(0.96, (projected - stopOffset) / length));
  }

  private blockInteriorBuildingCandidate(
    roads: RoadSegment[],
    rng: SeededRandom,
    spawnPoints: Vec3Data[]
  ): SpawnCandidate | null {
    const halfExtent = Math.max(...roads.map((road) => road.length)) * 0.53;
    for (let attempt = 0; attempt < 88; attempt += 1) {
      const x = rng.range(-halfExtent * 0.78, halfExtent * 0.78);
      const z = rng.range(-halfExtent * 0.78, halfExtent * 0.78);
      const nearest = this.nearestRoad(x, z, roads);
      const minRoadDistance = nearest.road.width * 0.5 + nearest.road.sidewalkWidth + 2.7;
      const maxRoadDistance = Math.max(18, minRoadDistance + 22);
      if (nearest.distance < minRoadDistance || nearest.distance > maxRoadDistance) {
        continue;
      }
      if (this.isTooCloseToAnySpawn(x, z, spawnPoints.slice(0, 5), MAP_SIZE_SETTINGS.small.spawnClearRadius)) {
        continue;
      }
      return { x, z, rotationY: nearest.road.rotationY };
    }
    return null;
  }

  private buildingSpacingRadius(object: ObjectSpawnDefinition): number {
    const largestSide = Math.hypot(object.size.x, object.size.z) * 0.5;
    const zonePadding = object.label === 'Factory Block' || object.label === 'Warehouse' ? 0.86 : 0.62;
    return largestSide + zonePadding;
  }

  private addTrafficSignalObjects(
    objects: ObjectSpawnDefinition[],
    occupied: OccupiedFootprint[],
    signals: TrafficSignalDefinition[],
    rng: SeededRandom
  ): void {
    const renderedApproaches = new Set<string>();
    for (const signal of signals) {
      const approachKey = `${signal.groupId}:${signal.axis}`;
      if (renderedApproaches.has(approachKey)) {
        continue;
      }
      renderedApproaches.add(approachKey);

      if (this.overlapsOccupied(signal.position.x, signal.position.z, 0.48, occupied)) {
        continue;
      }

      const object = this.createObjectDefinition('trafficLight', objects.length, {
        x: signal.position.x,
        z: signal.position.z,
        rotationY: signal.rotationY
      }, rng);
      object.trafficSignalId = signal.id;
      objects.push(object);
      occupied.push({ x: object.position.x, z: object.position.z, radius: object.boundingRadius });
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
    const target = Math.floor(objectBudget * 0.44);
    for (let i = 0; i < target; i += 1) {
      const road = rng.pick(roads);
      const candidate = this.roadsideCandidate(road, rng, rng.range(0.4, 1.3), spawnPoints, true);
      if (!candidate || this.overlapsOccupied(candidate.x, candidate.z, 0.8, occupied)) {
        continue;
      }
      const kind = this.roadsideKindForZone(candidate.x, candidate.z, rng);
      const object = this.createObjectDefinition(kind, objects.length, candidate, rng);
      if (this.overlapsOccupied(candidate.x, candidate.z, object.boundingRadius, occupied)) {
        continue;
      }
      objects.push(object);
      occupied.push({ x: candidate.x, z: candidate.z, radius: object.boundingRadius });
    }
  }

  private addBenchTrashPairs(
    objects: ObjectSpawnDefinition[],
    occupied: OccupiedFootprint[],
    rng: SeededRandom
  ): void {
    const benches = objects.filter((object) => object.kind === 'bench');
    for (const bench of benches) {
      if (!rng.chance(0.68)) {
        continue;
      }
      const side = this.sideVector(bench.rotationY);
      const sign = rng.pick([-1, 1]);
      const x = bench.position.x + side.x * sign * 1.18;
      const z = bench.position.z + side.z * sign * 1.18;
      const trash = this.createObjectDefinition('trash', objects.length, { x, z, rotationY: bench.rotationY }, rng);
      if (this.overlapsOccupied(x, z, trash.boundingRadius, occupied)) {
        continue;
      }
      objects.push(trash);
      occupied.push({ x, z, radius: trash.boundingRadius });
    }
  }

  private addBuildingServiceProps(
    objects: ObjectSpawnDefinition[],
    occupied: OccupiedFootprint[],
    roads: RoadSegment[],
    rng: SeededRandom,
    objectBudget: number
  ): void {
    const buildings = objects.filter((object) => object.kind === 'building');
    const target = Math.min(Math.floor(objectBudget * 0.13), Math.floor(buildings.length * 1.6));
    let placed = 0;
    for (const building of buildings) {
      if (placed >= target || !rng.chance(0.55)) {
        continue;
      }
      const count = rng.chance(0.36) ? 2 : 1;
      for (let i = 0; i < count && placed < target; i += 1) {
        const sideSign = rng.pick([-1, 1]);
        const frontSign = rng.pick([-1, 1]);
        const localX = sideSign * (building.size.x * 0.5 + rng.range(0.75, 1.7));
        const localZ = frontSign * rng.range(-building.size.z * 0.36, building.size.z * 0.48);
        const cos = Math.cos(building.rotationY);
        const sin = Math.sin(building.rotationY);
        const x = building.position.x + localX * cos + localZ * sin;
        const z = building.position.z - localX * sin + localZ * cos;
        const kind: WorldObjectKind = rng.pick(['crate', 'trash', 'planter']);
        const prop = this.createObjectDefinition(kind, objects.length, { x, z, rotationY: building.rotationY }, rng);
        if (
          this.overlapsOccupied(x, z, prop.boundingRadius, occupied) ||
          this.pointConflictsRoads(x, z, prop.boundingRadius, roads)
        ) {
          continue;
        }
        objects.push(prop);
        occupied.push({ x, z, radius: prop.boundingRadius });
        placed += 1;
      }
    }
  }

  private addEdgeNature(
    objects: ObjectSpawnDefinition[],
    occupied: OccupiedFootprint[],
    roads: RoadSegment[],
    spawnPoints: Vec3Data[],
    rng: SeededRandom,
    size: MapSize,
    objectBudget: number
  ): void {
    const settings = MAP_SIZE_SETTINGS[size];
    const target = Math.floor(objectBudget * 0.09);
    let placed = 0;
    let attempts = 0;
    while (placed < target && attempts < target * 16) {
      attempts += 1;
      const edge = rng.pick(['north', 'south', 'east', 'west']);
      const inset = rng.range(4.5, settings.halfExtent * 0.18);
      const along = rng.range(-settings.halfExtent * 0.86, settings.halfExtent * 0.86);
      const x = edge === 'east'
        ? settings.halfExtent - inset
        : edge === 'west'
          ? -settings.halfExtent + inset
          : along;
      const z = edge === 'north'
        ? -settings.halfExtent + inset
        : edge === 'south'
          ? settings.halfExtent - inset
          : along;
      const kind: WorldObjectKind = rng.next() < 0.62 ? 'tree' : rng.next() < 0.78 ? 'rock' : 'planter';
      const object = this.createObjectDefinition(kind, objects.length, { x, z, rotationY: rng.range(0, Math.PI * 2) }, rng);
      if (
        this.overlapsOccupied(x, z, object.boundingRadius, occupied) ||
        this.pointConflictsRoads(x, z, object.boundingRadius, roads) ||
        this.isTooCloseToAnySpawn(x, z, spawnPoints.slice(0, 5), settings.spawnClearRadius * 0.72)
      ) {
        continue;
      }
      objects.push(object);
      occupied.push({ x, z, radius: object.boundingRadius });
      placed += 1;
    }
  }

  private addStreetlights(
    objects: ObjectSpawnDefinition[],
    occupied: OccupiedFootprint[],
    surfaces: SurfaceSegment[],
    rng: SeededRandom
  ): void {
    for (const surface of surfaces) {
      if (surface.kind !== 'sidewalk' || surface.length < STREETLIGHT_MIN_SEGMENT_LENGTH) {
        continue;
      }

      const lightCount = surface.length < STREETLIGHT_SPACING * 1.78
        ? 1
        : Math.ceil(surface.length / STREETLIGHT_SPACING);
      const margin = Math.min(STREETLIGHT_SPACING * 0.5, surface.length * 0.42);
      const usableLength = Math.max(0, surface.length - margin * 2);
      let placedOnSurface = false;

      for (let index = 0; index < lightCount; index += 1) {
        const along = lightCount === 1
          ? 0
          : -usableLength * 0.5 + (usableLength * index) / (lightCount - 1);
        placedOnSurface = this.placeStreetlightOnSidewalk(surface, along, objects, occupied, rng) || placedOnSurface;
      }

      if (!placedOnSurface) {
        const fallbackCount = 5;
        for (let index = 0; index < fallbackCount && !placedOnSurface; index += 1) {
          const t = index / (fallbackCount - 1);
          const along = -usableLength * 0.5 + usableLength * t;
          placedOnSurface = this.placeStreetlightOnSidewalk(surface, along, objects, occupied, rng);
        }
      }
    }
  }

  private placeStreetlightOnSidewalk(
    surface: SurfaceSegment,
    along: number,
    objects: ObjectSpawnDefinition[],
    occupied: OccupiedFootprint[],
    rng: SeededRandom
  ): boolean {
    const forward = this.forwardVector(surface.rotationY);
    const side = this.sideVector(surface.rotationY);
    const roadSideSign = surface.roadSideSign ?? -1;
    const curbOffset = -roadSideSign * Math.min(surface.width * 0.32, 0.8);
    const x = surface.x + forward.x * along + side.x * curbOffset;
    const z = surface.z + forward.z * along + side.z * curbOffset;
    const rotationY = surface.rotationY + (roadSideSign === 1 ? Math.PI : 0);
    const object = this.createObjectDefinition('post', objects.length, { x, z, rotationY }, rng);
    object.label = 'Streetlight';
    const radius = Math.max(0.62, object.boundingRadius);
    if (this.overlapsOccupied(x, z, radius, occupied)) {
      return false;
    }
    objects.push(object);
    occupied.push({ x, z, radius });
    return true;
  }

  private roadsideKindForZone(x: number, z: number, rng: SeededRandom): WorldObjectKind {
    const zone = this.zoneForPosition(x, z);
    const pools: Record<ReturnType<ProceduralMapGenerator['zoneForPosition']>, WorldObjectKind[]> = {
      industrial: ['cone', 'trash', 'trash', 'crate', 'crate', 'hydrant', 'structure', 'bike'],
      commercial: ['bench', 'bench', 'trash', 'trash', 'bike', 'planter', 'kiosk', 'hydrant'],
      highResidential: ['tree', 'bench', 'bench', 'trash', 'trash', 'bike', 'planter', 'mailbox'],
      lowResidential: ['tree', 'tree', 'bench', 'trash', 'mailbox', 'planter', 'hydrant'],
      civic: ['bench', 'trash', 'trash', 'hydrant', 'planter', 'kiosk'],
      greenEdge: ['tree', 'tree', 'rock', 'rock', 'bench', 'trash', 'planter']
    };
    return rng.pick(pools[zone]);
  }

  private addTraffic(
    objects: ObjectSpawnDefinition[],
    occupied: OccupiedFootprint[],
    routes: TrafficRoute[],
    roads: RoadSegment[],
    surfaces: SurfaceSegment[],
    rng: SeededRandom,
    objectBudget: number
  ): void {
    const target = Math.floor(objectBudget * 0.115);
    const spawnableRoutes = routes.filter((route) => this.isTrafficSpawnRoute(route));
    if (spawnableRoutes.length === 0) {
      return;
    }

    let placed = 0;
    let attempts = 0;
    while (placed < target && attempts < target * 24) {
      attempts += 1;
      const route = rng.pick(spawnableRoutes);
      const t = rng.range(0.035, Math.max(0.965, route.points.length - 1.035));
      const point = this.routePoint(route, t);
      const kind = this.randomTrafficVehicleKind(rng);
      const object = this.createObjectDefinition(kind, objects.length, {
        x: point.position.x,
        z: point.position.z,
        rotationY: point.rotationY
      }, rng);
      object.routeId = route.id;
      object.routeT = t;
      object.routeSpeed = rng.range(3.5, 7.5) * this.vehicleSpeedMultiplier(kind);
      this.decorateTrafficVehicle(object, rng);
      const spawnRadius = this.trafficSpawnRadius(object);
      if (
        this.overlapsOccupied(object.position.x, object.position.z, spawnRadius, occupied) ||
        this.pointConflictsTrafficSpawn(object.position.x, object.position.z, spawnRadius, roads, surfaces)
      ) {
        continue;
      }
      objects.push(object);
      occupied.push({ x: object.position.x, z: object.position.z, radius: object.boundingRadius });
      placed += 1;
    }
  }

  private isTrafficSpawnRoute(route: TrafficRoute): boolean {
    return !route.id.startsWith('turn-') && route.points.length >= 2;
  }

  private trafficSpawnRadius(object: ObjectSpawnDefinition): number {
    return Math.max(2.2, object.boundingRadius * 1.08, object.size.z * 0.58 + 1.25);
  }

  private randomTrafficVehicleKind(rng: SeededRandom): WorldObjectKind {
    const roll = rng.next();
    if (roll < 0.055) return 'emergency';
    if (roll < 0.12) return 'bus';
    if (roll < 0.2) return 'trailerTruck';
    if (roll < 0.39) return 'truck';
    return 'car';
  }

  private decorateTrafficVehicle(object: ObjectSpawnDefinition, rng: SeededRandom): void {
    if (object.kind === 'truck' && rng.chance(0.22)) {
      object.label = 'Garbage Truck';
      object.color = '#3f8c68';
      object.variantRole = 'garbage-truck';
      object.routeSpeed = (object.routeSpeed ?? 0) * 0.78;
    }
  }

  private vehicleSpeedMultiplier(kind: WorldObjectKind): number {
    if (kind === 'emergency') return 1.08;
    if (kind === 'bus') return 0.68;
    if (kind === 'trailerTruck') return 0.58;
    if (kind === 'truck') return 0.72;
    return 1;
  }

  private addParkedVehicles(
    objects: ObjectSpawnDefinition[],
    occupied: OccupiedFootprint[],
    roads: RoadSegment[],
    surfaces: SurfaceSegment[],
    spawnPoints: Vec3Data[],
    rng: SeededRandom,
    objectBudget: number
  ): void {
    const target = Math.floor(objectBudget * 0.075);
    for (let i = 0; i < target; i += 1) {
      const road = rng.pick(roads);
      const candidate = this.parkingCandidate(road, rng, spawnPoints);
      if (
        !candidate ||
        this.overlapsOccupied(candidate.x, candidate.z, 1.75, occupied) ||
        this.pointConflictsCrosswalks(candidate.x, candidate.z, 2.35, surfaces)
      ) {
        continue;
      }
      const kind: WorldObjectKind = rng.chance(0.08)
        ? rng.pick<WorldObjectKind>(['bus', 'trailerTruck'])
        : rng.chance(0.16) ? 'truck' : 'car';
      const object = this.createObjectDefinition(kind, objects.length, candidate, rng);
      object.label = `Parked ${object.label}`;
      object.lightsEnabled = false;
      if (
        this.overlapsOccupied(candidate.x, candidate.z, object.boundingRadius, occupied) ||
        this.pointConflictsCrosswalks(candidate.x, candidate.z, Math.max(2.35, object.boundingRadius * 0.72), surfaces)
      ) {
        continue;
      }
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
    const target = Math.floor(objectBudget * 0.24);
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
      this.decoratePedestrian(object, rng);
      if (this.overlapsOccupied(object.position.x, object.position.z, object.boundingRadius, occupied)) {
        continue;
      }
      objects.push(object);
      occupied.push({ x: object.position.x, z: object.position.z, radius: object.boundingRadius });
    }
  }

  private addSeatedPedestrians(
    objects: ObjectSpawnDefinition[],
    occupied: OccupiedFootprint[],
    rng: SeededRandom,
    objectBudget: number
  ): void {
    const benches = objects.filter((object) => object.kind === 'bench');
    const target = Math.min(Math.floor(objectBudget * 0.045), benches.length);
    let placed = 0;
    for (const bench of benches) {
      if (placed >= target || !rng.chance(0.46)) {
        continue;
      }
      const forward = this.forwardVector(bench.rotationY);
      const side = this.sideVector(bench.rotationY);
      const x = bench.position.x - forward.x * 0.32 + side.x * rng.range(-0.28, 0.28);
      const z = bench.position.z - forward.z * 0.32 + side.z * rng.range(-0.28, 0.28);
      const person = this.createObjectDefinition('pedestrian', objects.length, { x, z, rotationY: bench.rotationY }, rng);
      this.decoratePedestrian(person, rng, 'seated');
      person.boundingRadius = 0.24;
      person.mass = 1.6;
      if (this.overlapsOccupied(x, z, 0.22, occupied)) {
        continue;
      }
      objects.push(person);
      occupied.push({ x, z, radius: 0.22 });
      placed += 1;
    }
  }

  private addBuildingDoorPedestrians(
    objects: ObjectSpawnDefinition[],
    occupied: OccupiedFootprint[],
    paths: PedestrianPath[],
    roads: RoadSegment[],
    rng: SeededRandom,
    objectBudget: number
  ): void {
    const buildings = objects.filter((object) => object.kind === 'building');
    const target = Math.min(Math.floor(objectBudget * 0.075), Math.floor(buildings.length * 0.42));
    let placed = 0;
    for (const building of buildings) {
      if (placed >= target || !rng.chance(0.28)) {
        continue;
      }
      const forward = this.forwardVector(building.rotationY);
      const side = this.sideVector(building.rotationY);
      const doorSide = rng.pick([-1, 1]);
      const door = {
        x: building.position.x - forward.x * (building.size.z * 0.5 + 0.34) + side.x * doorSide * rng.range(0, building.size.x * 0.22),
        z: building.position.z - forward.z * (building.size.z * 0.5 + 0.34) + side.z * doorSide * rng.range(0, building.size.x * 0.22)
      };
      const walk = {
        x: door.x - forward.x * rng.range(2.2, 4.8) + side.x * doorSide * rng.range(0.5, 1.4),
        z: door.z - forward.z * rng.range(2.2, 4.8) + side.z * doorSide * rng.range(0.5, 1.4)
      };
      if (
        this.pointConflictsRoads(door.x, door.z, 0.42, roads) ||
        this.pointConflictsRoads(walk.x, walk.z, 0.42, roads) ||
        this.overlapsOccupied(walk.x, walk.z, 0.42, occupied)
      ) {
        continue;
      }

      const pathId = `door-path-${paths.length}`;
      paths.push({
        id: pathId,
        points: [door, walk, door],
        loop: true
      });
      const person = this.createObjectDefinition('pedestrian', objects.length, {
        x: walk.x,
        z: walk.z,
        rotationY: Math.atan2(door.x - walk.x, door.z - walk.z)
      }, rng);
      this.decoratePedestrian(person, rng, this.pedestrianRoleForBuilding(building, rng));
      person.pedestrianPathId = pathId;
      person.routeT = rng.range(0, 1.8);
      person.routeSpeed = rng.range(0.35, 0.9);
      objects.push(person);
      occupied.push({ x: person.position.x, z: person.position.z, radius: person.boundingRadius });
      placed += 1;
    }
  }

  private decoratePedestrian(
    object: ObjectSpawnDefinition,
    rng: SeededRandom,
    forcedRole?: 'civilian' | 'police' | 'firefighter' | 'construction' | 'seated'
  ): void {
    const role = forcedRole ?? this.randomPedestrianRole(rng);
    object.variantRole = role;
    if (role === 'police') {
      object.label = 'Police Officer';
      object.color = '#2563eb';
      object.score = 12;
      return;
    }
    if (role === 'firefighter') {
      object.label = 'Firefighter';
      object.color = '#ef4444';
      object.score = 12;
      return;
    }
    if (role === 'construction') {
      object.label = 'Construction Worker';
      object.color = '#facc15';
      object.score = 10;
      return;
    }
    if (role === 'seated') {
      object.label = 'Seated Pedestrian';
      object.color = rng.pick(['#60a5fa', '#fb7185', '#91e88c', '#d8b4fe']);
      return;
    }
    object.label = rng.chance(0.5) ? 'Pedestrian' : 'Resident';
  }

  private randomPedestrianRole(rng: SeededRandom): 'civilian' | 'police' | 'firefighter' | 'construction' {
    const roll = rng.next();
    if (roll < 0.045) return 'police';
    if (roll < 0.075) return 'firefighter';
    if (roll < 0.155) return 'construction';
    return 'civilian';
  }

  private pedestrianRoleForBuilding(
    building: ObjectSpawnDefinition,
    rng: SeededRandom
  ): 'civilian' | 'police' | 'firefighter' | 'construction' {
    if (building.label === 'Police Station') return 'police';
    if (building.label === 'Fire Station') return 'firefighter';
    if (building.label === 'Factory Block' || building.label === 'Warehouse') return rng.chance(0.64) ? 'construction' : 'civilian';
    return this.randomPedestrianRole(rng);
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
    const types: PowerUpType[] = getEnabledPowerUpTypes();
    if (types.length === 0) {
      return;
    }
    const targetCount = explicitCount ?? countBySize[size];
    const minimumSpacing = this.powerUpMinimumSpacing(size, targetCount);
    let attempts = 0;
    let lastType: PowerUpType | null = null;
    while (powerUps.length < targetCount && attempts < targetCount * 110) {
      attempts += 1;
      const candidate = this.powerUpCandidate(rng, spawnPoints, size);
      const spacing = attempts > targetCount * 80 ? minimumSpacing * 0.74 : minimumSpacing;
      if (
        !candidate ||
        this.overlapsOccupied(candidate.x, candidate.z, 0.82, occupied) ||
        this.isTooCloseToPlacedPowerUps(candidate.x, candidate.z, powerUps, spacing)
      ) {
        continue;
      }
      const type = this.pickPowerUpType(types, rng, lastType);
      const settings = POWERUP_SETTINGS[type];
      const engineSettings = getPowerUpEngineSettings(type);
      const index = powerUps.length;
      powerUps.push({
        id: `powerup-${index}`,
        type,
        label: settings.label,
        position: { x: candidate.x, y: 0.55, z: candidate.z },
        radius: 0.75,
        color: settings.color,
        durationSeconds: engineSettings.durationSeconds,
        respawnDelay: runtimePowerUpRespawnSeconds()
      });
      lastType = type;
      occupied.push({ x: candidate.x, z: candidate.z, radius: 0.82 });
    }
  }

  private powerUpMinimumSpacing(size: MapSize, targetCount: number): number {
    const baseSpacing = { small: 9, medium: 11, large: 13.5, huge: 16 } satisfies Record<MapSize, number>;
    const defaultCount = { small: 8, medium: 14, large: 28, huge: 44 } satisfies Record<MapSize, number>;
    const densityScale = Math.sqrt(defaultCount[size] / Math.max(1, targetCount));
    return Math.max(6.25, Math.min(baseSpacing[size], baseSpacing[size] * densityScale));
  }

  private isTooCloseToPlacedPowerUps(
    x: number,
    z: number,
    powerUps: PowerUpSpawnDefinition[],
    minimumSpacing: number
  ): boolean {
    const minimumSpacingSq = minimumSpacing * minimumSpacing;
    return powerUps.some((powerUp) => {
      const dx = powerUp.position.x - x;
      const dz = powerUp.position.z - z;
      return dx * dx + dz * dz < minimumSpacingSq;
    });
  }

  private pickPowerUpType(
    types: PowerUpType[],
    rng: SeededRandom,
    previousType: PowerUpType | null
  ): PowerUpType {
    const available = previousType ? types.filter((type) => type !== previousType) : types;
    return rng.pick(available.length > 0 ? available : types);
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

  private parkingCandidate(
    road: RoadSegment,
    rng: SeededRandom,
    spawnPoints: Vec3Data[]
  ): SpawnCandidate | null {
    const forward = this.forwardVector(road.rotationY);
    const side = this.sideVector(road.rotationY);
    const sideSign = rng.pick([-1, 1]);
    const along = rng.range(-road.length * 0.43, road.length * 0.43);
    const offset = road.width * 0.5 + rng.range(0.9, Math.max(1.1, road.sidewalkWidth * 0.72));
    const x = road.x + forward.x * along + side.x * offset * sideSign;
    const z = road.z + forward.z * along + side.z * offset * sideSign;
    if (this.isTooCloseToAnySpawn(x, z, spawnPoints.slice(0, 5), MAP_SIZE_SETTINGS.small.spawnClearRadius)) {
      return null;
    }
    return { x, z, rotationY: sideSign < 0 ? road.rotationY : road.rotationY + Math.PI };
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

  private powerUpCandidate(
    rng: SeededRandom,
    spawnPoints: Vec3Data[],
    size: MapSize
  ): SpawnCandidate | null {
    const settings = MAP_SIZE_SETTINGS[size];
    for (let attempt = 0; attempt < 80; attempt += 1) {
      const x = rng.range(-settings.halfExtent + 4, settings.halfExtent - 4);
      const z = rng.range(-settings.halfExtent + 4, settings.halfExtent - 4);
      if (this.isTooCloseToAnySpawn(x, z, spawnPoints.slice(0, 5), settings.spawnClearRadius * 0.55)) {
        continue;
      }
      return { x, z, rotationY: rng.pick([0, Math.PI / 2, Math.PI, -Math.PI / 2]) };
    }
    return null;
  }

  private createManualObjectDefinition(
    kind: WorldObjectKind,
    index: number,
    candidate: SpawnCandidate,
    label: string,
    size: Vec3Data,
    color: string,
    boundingRadius: number,
    mass: number,
    score: number,
    category = this.categoryForKind(kind)
  ): ObjectSpawnDefinition {
    const spawnHeightOffset = getWorldObjectSpawnHeightOffset(kind);
    return {
      id: `${kind}-${index}`,
      kind,
      label,
      position: {
        x: candidate.x,
        y: Math.max(size.y * 0.5 + spawnHeightOffset, size.y * 0.5 + 0.01),
        z: candidate.z
      },
      rotationY: candidate.rotationY,
      size,
      color,
      boundingRadius,
      mass,
      score,
      respawnDelay: 14,
      category,
      roadAligned: true,
      isAd: false
    };
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
        const height = rng.range(3.6, 5.2);
        return this.withSize(base, 'Streetlight', { x: 0.36, y: height, z: 0.36 }, '#c9d2df', 0.36, 2.2, 6);
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
      case 'bus': {
        const palette = ['#f6d365', '#62c7d8', '#e8edf2', '#7bc67b'];
        return this.withSize(base, 'City Bus', { x: 2.26, y: 1.58, z: 6.25 }, rng.pick(palette), 3.15, 48, 62);
      }
      case 'emergency': {
        const palette = ['#f8fafc', '#f43f5e', '#2563eb'];
        const label = rng.chance(0.5) ? 'Ambulance' : rng.chance(0.5) ? 'Police Car' : 'Fire Response Truck';
        const size = label === 'Police Car'
          ? { x: 1.72, y: 0.86, z: 3.18 }
          : { x: 2.05, y: 1.28, z: 4.15 };
        return this.withSize(base, label, size, rng.pick(palette), Math.hypot(size.x, size.z) * 0.5, 24, 44);
      }
      case 'trailerTruck': {
        const palette = ['#d7dee8', '#c9b18a', '#8aa5b1', '#f0c850'];
        return this.withSize(base, 'Truck With Trailer', { x: 2.2, y: 1.36, z: 6.65 }, rng.pick(palette), 3.45, 58, 70);
      }
      case 'pedestrian': {
        const palette = ['#f6c453', '#fb7185', '#60a5fa', '#91e88c', '#d8b4fe'];
        return this.withSize(base, 'Pedestrian', { x: 0.45, y: 1.55, z: 0.35 }, rng.pick(palette), 0.36, 2.2, 8);
      }
      case 'trafficLight':
        return this.withSize(base, 'Traffic Light', { x: 0.46, y: 3.05, z: 0.46 }, '#27313c', 0.42, 6.5, 12);
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
        return this.withSize(base, 'Billboard Ad', { x: 13.1, y: 5.95, z: 0.42 }, '#31394b', 6.58, 72, 110);
      case 'screen':
        return this.withSize(base, 'Video Ad Screen', { x: 12.55, y: 6.35, z: 0.42 }, '#222a3a', 6.32, 78, 118);
      case 'building':
      default: {
        const zone = this.zoneForPosition(candidate.x, candidate.z);
        const paletteByZone = {
          industrial: ['#6f7678', '#59666b', '#7b7468', '#5c6363'],
          commercial: ['#77838e', '#67788a', '#6f8790', '#9aa3a9'],
          highResidential: ['#8f7f72', '#918d79', '#9aa3a9', '#75685f'],
          lowResidential: ['#a18b73', '#8f806f', '#7d917b', '#9a8f7a'],
          civic: ['#66758a', '#75899c', '#6f7f8d', '#8c8f94'],
          greenEdge: ['#6f8068', '#7b866e', '#687c72', '#8a7d65']
        };
        const sizeByZone = {
          industrial: { width: [7.5, 14.5], depth: [6.5, 13], height: [3.4, 8.2], mass: 2.15 },
          commercial: { width: [5.4, 11.5], depth: [4.8, 10.8], height: [4.5, 13.5], mass: 1.9 },
          highResidential: { width: [5.2, 9.8], depth: [5.2, 9.8], height: [9.5, 20], mass: 2.05 },
          lowResidential: { width: [3.8, 6.8], depth: [3.8, 6.4], height: [2.6, 5.2], mass: 1.55 },
          civic: { width: [7.2, 12.4], depth: [5.8, 10.5], height: [4.2, 9.2], mass: 1.85 },
          greenEdge: { width: [3.2, 6.8], depth: [3.2, 6.4], height: [2.3, 4.4], mass: 1.35 }
        };
        const settings = sizeByZone[zone];
        const width = rng.range(settings.width[0], settings.width[1]);
        const depth = rng.range(settings.depth[0], settings.depth[1]);
        const height = rng.range(settings.height[0], settings.height[1]);
        const labelByZone = {
          industrial: rng.chance(0.5) ? 'Factory Block' : 'Warehouse',
          commercial: height > 10 ? 'Office Building' : 'Corner Shop',
          highResidential: 'Apartment Tower',
          lowResidential: 'Town House',
          civic: height > 6.5 ? 'Civic Office' : 'Municipal Building',
          greenEdge: 'Park Service Building'
        };
        return this.withSize(
          base,
          labelByZone[zone],
          { x: width, y: height, z: depth },
          rng.pick(paletteByZone[zone]),
          Math.hypot(width, depth) * 0.5,
          width * depth * settings.mass,
          120
        );
      }
    }
  }

  private zoneForPosition(x: number, z: number): CityZone {
    if (Math.abs(x) < 22 && Math.abs(z) < 22) return 'civic';
    if (Math.max(Math.abs(x), Math.abs(z)) > 92) return 'greenEdge';
    if (x < 0 && z < 0) return 'industrial';
    if (x >= 0 && z < 0) return 'commercial';
    if (x >= 0 && z >= 0) return 'highResidential';
    return 'lowResidential';
  }

  private categoryForKind(kind: WorldObjectKind): CityObjectCategory {
    if (kind === 'building') return 'building';
    if (kind === 'car' || kind === 'truck' || kind === 'bus' || kind === 'emergency' || kind === 'trailerTruck') return 'traffic';
    if (kind === 'post' || kind === 'hydrant' || kind === 'mailbox' || kind === 'cone' || kind === 'trafficLight') return 'utility';
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
    const spawnHeightOffset = getWorldObjectSpawnHeightOffset(base.kind);
    const centerY = Math.max(size.y * 0.5 + spawnHeightOffset, size.y * 0.5 + 0.01);
    return this.applyCustomObjectVariant({
      ...base,
      label,
      size,
      color,
      boundingRadius,
      mass,
      score,
      position: {
        ...base.position,
        y: centerY
      }
    }, base.kind);
  }

  private applyCustomObjectVariant(object: ObjectSpawnDefinition, kind: WorldObjectKind): ObjectSpawnDefinition {
    const variants = getEnabledCustomObjectVariantsForKind(kind);
    if (!variants.length) {
      return object;
    }

    const variant = variants[Math.floor(this.variantRandomUnit(object) * variants.length)];
    const nextSize = variant.hitbox ?? object.size;
    const spawnHeightOffset = getWorldObjectSpawnHeightOffset(kind) + variant.spawnHeightOffset;
    const centerY = Math.max(nextSize.y * 0.5 + spawnHeightOffset, nextSize.y * 0.5 + 0.01);
    return {
      ...object,
      label: variant.label || object.label,
      color: variant.previewColor || object.color,
      size: nextSize,
      boundingRadius: Math.max(object.boundingRadius, Math.hypot(nextSize.x, nextSize.z) * 0.48),
      variantId: variant.id,
      variantLabel: variant.label,
      variantRole: variant.role,
      position: {
        ...object.position,
        y: centerY
      }
    };
  }

  private variantRandomUnit(object: ObjectSpawnDefinition): number {
    const id = `${object.id}:${object.position.x.toFixed(2)}:${object.position.z.toFixed(2)}`;
    let hash = 2166136261;
    for (let index = 0; index < id.length; index += 1) {
      hash ^= id.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }
    return ((hash >>> 0) % 10000) / 10000;
  }

  private finalizeObjectPlacement(
    objects: ObjectSpawnDefinition[],
    roads: RoadSegment[],
    surfaces: SurfaceSegment[],
    pedestrianPaths: PedestrianPath[]
  ): ObjectSpawnDefinition[] {
    const accepted: Array<{ object: ObjectSpawnDefinition; index: number }> = [];
    const occupied: OccupiedFootprint[] = [];
    const ordered = objects
      .map((object, index) => ({
        object,
        index,
        priority: this.objectPlacementPriority(object)
      }))
      .sort((a, b) => b.priority - a.priority || b.object.mass - a.object.mass || a.index - b.index);

    for (const entry of ordered) {
      const footprint = this.placementFootprint(entry.object);
      if (
        this.objectConflictsProtectedSurface(entry.object, roads, surfaces, pedestrianPaths, footprint.radius) ||
        this.overlapsFootprint(footprint, occupied)
      ) {
        continue;
      }

      accepted.push({ object: entry.object, index: entry.index });
      occupied.push(footprint);
    }

    return accepted.sort((a, b) => a.index - b.index).map((entry) => entry.object);
  }

  private objectPlacementPriority(object: ObjectSpawnDefinition): number {
    if (object.kind === 'trafficLight') return 120;
    if (object.category === 'building') return 112;
    if (object.category === 'ad') return 104;
    if (object.kind === 'fountain' || object.kind === 'statue') return 98;
    if (object.category === 'traffic') return 92;
    if (object.category === 'pedestrian') return 88;
    if (object.kind === 'post') return 82;
    if (object.kind === 'kiosk' || object.kind === 'structure') return 76;
    if (object.kind === 'tree') return 70;
    if (object.kind === 'bench' || object.kind === 'bike' || object.kind === 'planter') return 64;
    return 58;
  }

  private placementFootprint(object: ObjectSpawnDefinition): OccupiedFootprint {
    const padding = this.placementPadding(object);
    const radius = Math.max(object.boundingRadius, Math.hypot(object.size.x, object.size.z) * 0.5) + padding;
    const rectangular =
      object.category === 'building' ||
      object.category === 'ad' ||
      object.category === 'traffic' ||
      object.kind === 'structure' ||
      object.kind === 'kiosk' ||
      object.kind === 'bench' ||
      object.kind === 'bike' ||
      object.kind === 'fountain' ||
      object.kind === 'statue' ||
      object.kind === 'planter';

    return {
      x: object.position.x,
      z: object.position.z,
      radius,
      halfWidth: rectangular ? object.size.x * 0.5 + padding : undefined,
      halfDepth: rectangular ? object.size.z * 0.5 + padding : undefined,
      rotationY: rectangular ? object.rotationY : undefined
    };
  }

  private placementPadding(object: ObjectSpawnDefinition): number {
    if (object.variantRole === 'parking-stall') return 0.08;
    if (object.category === 'building') return 0.9;
    if (object.category === 'ad') return 0.75;
    if (object.category === 'traffic') return 0.42;
    if (object.category === 'pedestrian') return 0.38;
    if (object.kind === 'post' || object.kind === 'trafficLight') return 0.34;
    if (object.kind === 'tree') return 0.55;
    if (object.kind === 'bench' || object.kind === 'bike' || object.kind === 'planter') return 0.48;
    return 0.45;
  }

  private overlapsFootprint(candidate: OccupiedFootprint, occupied: OccupiedFootprint[]): boolean {
    return occupied.some((footprint) => this.footprintsOverlap(candidate, footprint));
  }

  private footprintsOverlap(a: OccupiedFootprint, b: OccupiedFootprint): boolean {
    const aRect = this.hasRectFootprint(a);
    const bRect = this.hasRectFootprint(b);
    if (aRect && bRect) {
      return this.rectanglesOverlap(a, b);
    }
    if (aRect) {
      return this.rectangleCircleOverlap(a, b);
    }
    if (bRect) {
      return this.rectangleCircleOverlap(b, a);
    }
    const dx = a.x - b.x;
    const dz = a.z - b.z;
    const minDistance = a.radius + b.radius + 0.06;
    return dx * dx + dz * dz < minDistance * minDistance;
  }

  private hasRectFootprint(footprint: OccupiedFootprint): boolean {
    return (
      typeof footprint.halfWidth === 'number' &&
      typeof footprint.halfDepth === 'number' &&
      typeof footprint.rotationY === 'number'
    );
  }

  private rectanglesOverlap(a: OccupiedFootprint, b: OccupiedFootprint): boolean {
    const axes = [
      this.sideVector(a.rotationY ?? 0),
      this.forwardVector(a.rotationY ?? 0),
      this.sideVector(b.rotationY ?? 0),
      this.forwardVector(b.rotationY ?? 0)
    ];
    for (const axis of axes) {
      const left = this.projectFootprint(a, axis);
      const right = this.projectFootprint(b, axis);
      if (left.max < right.min || right.max < left.min) {
        return false;
      }
    }
    return true;
  }

  private rectangleCircleOverlap(rectangle: OccupiedFootprint, circle: OccupiedFootprint): boolean {
    const dx = circle.x - rectangle.x;
    const dz = circle.z - rectangle.z;
    const cos = Math.cos(-(rectangle.rotationY ?? 0));
    const sin = Math.sin(-(rectangle.rotationY ?? 0));
    const localX = dx * cos - dz * sin;
    const localZ = dx * sin + dz * cos;
    const closestX = Math.max(-(rectangle.halfWidth ?? 0), Math.min(rectangle.halfWidth ?? 0, localX));
    const closestZ = Math.max(-(rectangle.halfDepth ?? 0), Math.min(rectangle.halfDepth ?? 0, localZ));
    const boxDx = localX - closestX;
    const boxDz = localZ - closestZ;
    const minDistance = circle.radius + 0.06;
    return boxDx * boxDx + boxDz * boxDz < minDistance * minDistance;
  }

  private projectFootprint(footprint: OccupiedFootprint, axis: RoutePoint): { min: number; max: number } {
    const center = footprint.x * axis.x + footprint.z * axis.z;
    if (this.hasRectFootprint(footprint)) {
      const localX = this.sideVector(footprint.rotationY ?? 0);
      const localZ = this.forwardVector(footprint.rotationY ?? 0);
      const extent =
        (footprint.halfWidth ?? 0) * Math.abs(localX.x * axis.x + localX.z * axis.z) +
        (footprint.halfDepth ?? 0) * Math.abs(localZ.x * axis.x + localZ.z * axis.z);
      return { min: center - extent, max: center + extent };
    }

    return { min: center - footprint.radius, max: center + footprint.radius };
  }

  private objectConflictsProtectedSurface(
    object: ObjectSpawnDefinition,
    roads: RoadSegment[],
    surfaces: SurfaceSegment[],
    pedestrianPaths: PedestrianPath[],
    radius: number
  ): boolean {
    if (this.pointConflictsCrosswalks(object.position.x, object.position.z, radius * 0.78, surfaces)) {
      return object.kind !== 'trafficLight';
    }

    const shouldStayOffRoads =
      object.category === 'building' ||
      object.category === 'ad' ||
      object.kind === 'structure' ||
      object.kind === 'kiosk' ||
      object.kind === 'fountain' ||
      object.kind === 'statue';
    if (shouldStayOffRoads && this.pointConflictsRoads(object.position.x, object.position.z, radius * 0.72, roads)) {
      return true;
    }

    const shouldStayOffPedestrianLane =
      object.category !== 'pedestrian' &&
      object.category !== 'traffic' &&
      object.kind !== 'trafficLight';
    if (
      shouldStayOffPedestrianLane &&
      this.pointConflictsPedestrianPaths(
        object.position.x,
        object.position.z,
        this.pedestrianLaneClearance(object),
        pedestrianPaths
      )
    ) {
      return true;
    }

    return false;
  }

  private pedestrianLaneClearance(object: ObjectSpawnDefinition): number {
    if (object.category === 'building') return Math.min(4.2, object.boundingRadius * 0.46 + 0.55);
    if (object.category === 'ad') return Math.min(3.4, object.boundingRadius * 0.42 + 0.5);
    if (object.kind === 'post') return 0.62;
    return Math.max(0.72, Math.min(2.15, object.boundingRadius + 0.55));
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
    const billboardCount = Math.max(5, Math.floor(settings.halfExtent / 20));
    const buildingCandidates = objects.filter((object) => object.kind === 'building');
    const vehicleCandidates = objects.filter((object) => object.category === 'traffic');

    for (let i = 0; i < billboardCount; i += 1) {
      const candidate = {
        x: rng.range(-settings.halfExtent * 0.7, settings.halfExtent * 0.7),
        z: rng.range(-settings.halfExtent * 0.7, settings.halfExtent * 0.7),
        rotationY: rng.pick([0, Math.PI / 2, Math.PI, -Math.PI / 2])
      };
      if (
        this.overlapsOccupied(candidate.x, candidate.z, 5.2, occupied) ||
        this.pointConflictsRoads(candidate.x, candidate.z, 5.2, roads)
      ) {
        continue;
      }
      const kind: WorldObjectKind = rng.chance(0.45) ? 'screen' : 'billboard';
      const adObject = this.createObjectDefinition(kind, objects.length, candidate, rng);
      adObject.isAd = true;
      if (
        this.overlapsOccupied(candidate.x, candidate.z, adObject.boundingRadius, occupied) ||
        this.pointConflictsRoads(candidate.x, candidate.z, adObject.boundingRadius, roads)
      ) {
        continue;
      }
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

    const edgePlacements = this.edgeAdPlacements(settings.halfExtent, rng);

    for (const candidate of edgePlacements) {
      if (this.overlapsOccupied(candidate.x, candidate.z, 1.8, occupied)) {
        continue;
      }
      const kind: WorldObjectKind = rng.chance(0.48) ? 'screen' : 'billboard';
      const adObject = this.createObjectDefinition(kind, objects.length, candidate, rng);
      adObject.isAd = true;
      if (this.overlapsOccupied(candidate.x, candidate.z, adObject.boundingRadius, occupied)) {
        continue;
      }
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

  private edgeAdPlacements(halfExtent: number, rng: SeededRandom): SpawnCandidate[] {
    const edgeOffset = halfExtent * 0.98;
    const perSide = Math.max(2, Math.min(12, Math.floor(halfExtent / 23)));
    const placements: SpawnCandidate[] = [];
    for (let i = 0; i < perSide; i += 1) {
      const t = perSide === 1 ? 0 : -0.78 + (1.56 * i) / (perSide - 1);
      const along = halfExtent * t + rng.range(-halfExtent * 0.035, halfExtent * 0.035);
      placements.push(
        { x: along, z: -edgeOffset, rotationY: 0 },
        { x: along, z: edgeOffset, rotationY: Math.PI },
        { x: -edgeOffset, z: along, rotationY: Math.PI / 2 },
        { x: edgeOffset, z: along, rotationY: -Math.PI / 2 }
      );
    }

    placements.push(
      { x: -edgeOffset, z: -edgeOffset, rotationY: Math.PI * 0.25 },
      { x: edgeOffset, z: -edgeOffset, rotationY: -Math.PI * 0.25 },
      { x: -edgeOffset, z: edgeOffset, rotationY: Math.PI * 0.75 },
      { x: edgeOffset, z: edgeOffset, rotationY: -Math.PI * 0.75 }
    );

    return placements;
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

  private pointConflictsCrosswalks(x: number, z: number, radius: number, surfaces: SurfaceSegment[]): boolean {
    for (const surface of surfaces) {
      if (surface.kind !== 'crosswalk') {
        continue;
      }

      const dx = x - surface.x;
      const dz = z - surface.z;
      const cos = Math.cos(-surface.rotationY);
      const sin = Math.sin(-surface.rotationY);
      const localX = dx * cos - dz * sin;
      const localZ = dx * sin + dz * cos;
      const protectedHalfWidth = surface.width * 0.5 + radius;
      const protectedHalfLength = surface.length * 0.5 + radius;
      if (Math.abs(localX) <= protectedHalfWidth && Math.abs(localZ) <= protectedHalfLength) {
        return true;
      }
    }

    return false;
  }

  private pointConflictsTrafficSpawn(
    x: number,
    z: number,
    radius: number,
    roads: RoadSegment[],
    surfaces: SurfaceSegment[]
  ): boolean {
    return (
      this.pointConflictsCrosswalks(x, z, Math.max(4.2, radius + 1.9), surfaces) ||
      this.pointConflictsRoadIntersections(x, z, Math.max(8.2, radius + 4.6), roads)
    );
  }

  private pointConflictsRoadIntersections(x: number, z: number, radius: number, roads: RoadSegment[]): boolean {
    const radiusSq = radius * radius;
    for (const a of roads) {
      for (const b of roads) {
        if (a.id >= b.id || Math.abs(Math.sin(a.rotationY - b.rotationY)) < 0.8) {
          continue;
        }

        const center = this.roadIntersectionCenter(a, b);
        if (!center) {
          continue;
        }

        const dx = x - center.x;
        const dz = z - center.z;
        if (dx * dx + dz * dz <= radiusSq) {
          return true;
        }
      }
    }
    return false;
  }

  private roadIntersectionCenter(a: RoadSegment, b: RoadSegment): RoutePoint | null {
    const vertical = Math.abs(Math.sin(a.rotationY)) < 0.5 ? a : b;
    const horizontal = vertical === a ? b : a;
    const center = { x: vertical.x, z: horizontal.z };
    if (
      Math.abs(center.z - vertical.z) > vertical.length * 0.5 ||
      Math.abs(center.x - horizontal.x) > horizontal.length * 0.5
    ) {
      return null;
    }
    return center;
  }

  private pointConflictsPedestrianPaths(x: number, z: number, radius: number, paths: PedestrianPath[]): boolean {
    const radiusSq = radius * radius;
    for (const path of paths) {
      for (let i = 0; i < path.points.length - 1; i += 1) {
        const start = path.points[i];
        const end = path.points[i + 1];
        const distanceSq = this.pointSegmentDistanceSq(x, z, start.x, start.z, end.x, end.z);
        if (distanceSq < radiusSq) {
          return true;
        }
      }
    }
    return false;
  }

  private pointSegmentDistanceSq(
    x: number,
    z: number,
    startX: number,
    startZ: number,
    endX: number,
    endZ: number
  ): number {
    const segmentX = endX - startX;
    const segmentZ = endZ - startZ;
    const lengthSq = segmentX * segmentX + segmentZ * segmentZ;
    if (lengthSq <= 0.0001) {
      const dx = x - startX;
      const dz = z - startZ;
      return dx * dx + dz * dz;
    }

    const t = Math.max(0, Math.min(1, ((x - startX) * segmentX + (z - startZ) * segmentZ) / lengthSq));
    const closestX = startX + segmentX * t;
    const closestZ = startZ + segmentZ * t;
    const dx = x - closestX;
    const dz = z - closestZ;
    return dx * dx + dz * dz;
  }

  private reserveCrosswalkFootprints(occupied: OccupiedFootprint[], surfaces: SurfaceSegment[]): void {
    for (const surface of surfaces) {
      if (surface.kind !== 'crosswalk') {
        continue;
      }

      occupied.push({
        x: surface.x,
        z: surface.z,
        radius: Math.hypot(surface.width, surface.length) * 0.5 + CROSSWALK_OBJECT_CLEARANCE,
        halfWidth: surface.width * 0.5 + CROSSWALK_OBJECT_CLEARANCE,
        halfDepth: surface.length * 0.5 + CROSSWALK_OBJECT_CLEARANCE,
        rotationY: surface.rotationY
      });
    }
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
      if (
        typeof footprint.halfWidth === 'number' &&
        typeof footprint.halfDepth === 'number' &&
        typeof footprint.rotationY === 'number'
      ) {
        const cos = Math.cos(-footprint.rotationY);
        const sin = Math.sin(-footprint.rotationY);
        const localX = dx * cos - dz * sin;
        const localZ = dx * sin + dz * cos;
        const closestX = Math.max(-footprint.halfWidth, Math.min(footprint.halfWidth, localX));
        const closestZ = Math.max(-footprint.halfDepth, Math.min(footprint.halfDepth, localZ));
        const boxDx = localX - closestX;
        const boxDz = localZ - closestZ;
        const minDistance = radius + 0.45;
        if (boxDx * boxDx + boxDz * boxDz < minDistance * minDistance) {
          return true;
        }
        continue;
      }
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
