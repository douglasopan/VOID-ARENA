import type { MatchConfig } from './MatchConfig';
import { MatchMode } from './MatchMode';
import type { Player } from './Player';
import type { PlayerManager } from './PlayerManager';
import { canHoleSwallow, canObjectFit } from './BalanceConfig';
import type { World } from './World';
import type { WorldObject } from './WorldObject';

export type SwallowEvent =
  | { type: 'objectSwallowed'; player: Player; object: WorldObject }
  | { type: 'holeSwallowed'; attacker: Player; victim: Player }
  | { type: 'holeSwallowCompleted'; attacker: Player | null; victim: Player };

export class SwallowSystem {
  constructor(
    private readonly world: World,
    private readonly playerManager: PlayerManager,
    private readonly config: MatchConfig
  ) {}

  update(deltaSeconds: number, now: number): SwallowEvent[] {
    const events: SwallowEvent[] = [];
    this.world.rebuildObjectGrid();
    this.tryStartObjectSwallows();
    this.tryStartHoleSwallows(now, events);

    const completedObjects = this.world.updateSwallowing(deltaSeconds, this.playerManager);
    for (const completed of completedObjects) {
      const player = this.playerManager.get(completed.targetPlayerId);
      if (!player || !player.renderVisible) {
        completed.object.scheduleRespawn(now);
        continue;
      }

      player.addMass(completed.object.mass);
      player.addScore(completed.object.score);
      player.swallowedObjects += 1;
      completed.object.scheduleRespawn(now);
      events.push({ type: 'objectSwallowed', player, object: completed.object });
    }

    for (const player of this.playerManager.all()) {
      if (!player.swallowAnimation) {
        continue;
      }

      const attacker = this.playerManager.get(player.swallowAnimation.attackerId) ?? null;
      const completed = player.updateSwallowAnimation(deltaSeconds, attacker);
      if (completed) {
        events.push({ type: 'holeSwallowCompleted', attacker, victim: player });
      }
    }

    return events;
  }

  private tryStartObjectSwallows(): void {
    for (const player of this.playerManager.alivePlayers()) {
      const candidates = this.world.queryObjects(player.position, Math.max(2.5, player.radius * 1.35));

      for (const object of candidates) {
        if (!object.active || !canObjectFit(player.radius, object.effectiveBoundingRadius)) {
          continue;
        }

        const dx = object.position.x - player.position.x;
        const dz = object.position.z - player.position.z;
        const swallowDistance = Math.max(0.72, player.radius * 0.95);
        if (dx * dx + dz * dz <= swallowDistance * swallowDistance) {
          object.startSwallow(player.id);
        }
      }
    }
  }

  private tryStartHoleSwallows(now: number, events: SwallowEvent[]): void {
    const players = this.playerManager.alivePlayers();

    for (const attacker of players) {
      if (!attacker.alive) {
        continue;
      }

      for (const victim of players) {
        if (
          attacker.id === victim.id ||
          !victim.alive ||
          victim.hasPowerUp('shield') ||
          !canHoleSwallow(attacker.radius, victim.radius)
        ) {
          continue;
        }

        const dx = victim.position.x - attacker.position.x;
        const dz = victim.position.z - attacker.position.z;
        const swallowDistance = Math.max(
          1.15,
          attacker.radius * 0.98 - victim.radius * 0.12
        );
        if (dx * dx + dz * dz > swallowDistance * swallowDistance) {
          continue;
        }

        victim.markSwallowed(attacker.id, now);
        attacker.addMass(Math.max(6, victim.mass * 0.28 + victim.radius * 5));
        attacker.addScore(150 + victim.score * 0.2 + victim.radius * 45);
        attacker.eliminations += 1;
        events.push({ type: 'holeSwallowed', attacker, victim });

        if (this.config.matchMode === MatchMode.LastHoleStanding) {
          victim.respawnAt = Number.POSITIVE_INFINITY;
        }
      }
    }
  }
}
