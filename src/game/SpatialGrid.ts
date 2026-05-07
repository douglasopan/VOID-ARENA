import * as THREE from 'three';

export interface SpatialItem {
  id: string;
  position: THREE.Vector3;
  boundingRadius: number;
}

export class SpatialGrid<T extends SpatialItem> {
  private readonly buckets = new Map<string, T[]>();

  constructor(private readonly cellSize: number) {}

  clear(): void {
    this.buckets.clear();
  }

  insert(item: T): void {
    const minX = this.toCell(item.position.x - item.boundingRadius);
    const maxX = this.toCell(item.position.x + item.boundingRadius);
    const minZ = this.toCell(item.position.z - item.boundingRadius);
    const maxZ = this.toCell(item.position.z + item.boundingRadius);

    for (let x = minX; x <= maxX; x += 1) {
      for (let z = minZ; z <= maxZ; z += 1) {
        const key = this.key(x, z);
        const bucket = this.buckets.get(key);
        if (bucket) {
          bucket.push(item);
        } else {
          this.buckets.set(key, [item]);
        }
      }
    }
  }

  rebuild(items: T[]): void {
    this.clear();
    for (const item of items) {
      this.insert(item);
    }
  }

  query(position: THREE.Vector3, radius: number): T[] {
    const minX = this.toCell(position.x - radius);
    const maxX = this.toCell(position.x + radius);
    const minZ = this.toCell(position.z - radius);
    const maxZ = this.toCell(position.z + radius);
    const found = new Map<string, T>();

    for (let x = minX; x <= maxX; x += 1) {
      for (let z = minZ; z <= maxZ; z += 1) {
        const bucket = this.buckets.get(this.key(x, z));
        if (!bucket) {
          continue;
        }

        for (const item of bucket) {
          found.set(item.id, item);
        }
      }
    }

    return [...found.values()];
  }

  private toCell(value: number): number {
    return Math.floor(value / this.cellSize);
  }

  private key(x: number, z: number): string {
    return `${x}:${z}`;
  }
}
