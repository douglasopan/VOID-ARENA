import * as THREE from 'three';
import { calculateRadius } from './BalanceConfig';
import type { MatchConfig } from './MatchConfig';
import { MatchMode } from './MatchMode';
import type { Player } from './Player';
import type { PlayerManager } from './PlayerManager';
import type { World } from './World';

export interface RespawnEvent {
  type: 'playerRespawned';
  player: Player;
}

export class RespawnSystem {
  private spawnCursor = 0;

  constructor(
    private readonly world: World,
    private readonly playerManager: PlayerManager,
    private readonly config: MatchConfig
  ) {}

  update(now: number): RespawnEvent[] {
    if (this.config.matchMode !== MatchMode.Timed) {
      return [];
    }

    const events: RespawnEvent[] = [];

    for (const player of this.playerManager.all()) {
      if (player.alive || player.renderVisible || now < player.respawnAt) {
        continue;
      }

      player.mass = Math.max(0, player.mass * 0.35);
      player.radius = calculateRadius(player.mass);
      player.respawn(this.findSafeSpawn(player));
      events.push({ type: 'playerRespawned', player });
    }

    return events;
  }

  private findSafeSpawn(player: Player): THREE.Vector3 {
    const spawnPoints = this.world.mapData.spawnPoints;
    let best = this.world.getSpawnPoint(this.spawnCursor);
    let bestScore = Number.NEGATIVE_INFINITY;

    for (let i = 0; i < Math.min(spawnPoints.length, 48); i += 1) {
      this.spawnCursor = (this.spawnCursor + 1) % spawnPoints.length;
      const candidate = this.world.getSpawnPoint(this.spawnCursor);
      let nearestThreat = Number.POSITIVE_INFINITY;
      let nearestAny = Number.POSITIVE_INFINITY;

      for (const other of this.playerManager.alivePlayers()) {
        if (other.id === player.id) {
          continue;
        }

        const distance = candidate.distanceTo(other.position);
        nearestAny = Math.min(nearestAny, distance);
        if (other.radius > player.radius * 1.2) {
          nearestThreat = Math.min(nearestThreat, distance);
        }
      }

      if (nearestAny < this.config.respawnSafeRadius) {
        continue;
      }

      const score = nearestThreat * 1.8 + nearestAny * 0.6 + Math.random() * 4;
      if (score > bestScore) {
        best = candidate;
        bestScore = score;
      }
    }

    this.world.clampToArena(best, player.radius);
    return best;
  }
}
