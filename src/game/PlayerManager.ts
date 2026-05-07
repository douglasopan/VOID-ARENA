import * as THREE from 'three';
import { RIM_COLORS } from '../shared/constants';
import type { HoleRimStyle, LeaderboardEntry } from '../shared/types';
import type { BotDifficulty } from './BotDifficulty';
import { MatchMode } from './MatchMode';
import { Player } from './Player';

export class PlayerManager {
  private readonly players = new Map<string, Player>();
  localPlayerId = '';

  createLocalPlayer(
    name: string,
    position: THREE.Vector3,
    id = 'local-player',
    appearance: { rimColor?: string; rimStyle?: HoleRimStyle } = {}
  ): Player {
    const player = new Player({
      id,
      name,
      isBot: false,
      rimColor: appearance.rimColor ?? RIM_COLORS[0],
      rimStyle: appearance.rimStyle ?? 'neon',
      position
    });
    this.localPlayerId = player.id;
    this.players.set(player.id, player);
    return player;
  }

  createRemotePlayer(
    id: string,
    name: string,
    position: THREE.Vector3,
    colorIndex: number,
    appearance: { rimColor?: string; rimStyle?: HoleRimStyle } = {}
  ): Player {
    const player = new Player({
      id,
      name,
      isBot: false,
      rimColor: appearance.rimColor ?? RIM_COLORS[colorIndex % RIM_COLORS.length],
      rimStyle: appearance.rimStyle ?? 'neon',
      position
    });
    this.players.set(player.id, player);
    return player;
  }

  createBot(
    id: string,
    name: string,
    position: THREE.Vector3,
    colorIndex: number,
    botDifficulty: BotDifficulty
  ): Player {
    const player = new Player({
      id,
      name,
      isBot: true,
      rimColor: RIM_COLORS[colorIndex % RIM_COLORS.length],
      rimStyle: colorIndex % 3 === 0 ? 'double' : colorIndex % 2 === 0 ? 'classic' : 'neon',
      position,
      botDifficulty
    });
    this.players.set(player.id, player);
    return player;
  }

  get(id: string): Player | undefined {
    return this.players.get(id);
  }

  getLocalPlayer(): Player | undefined {
    return this.players.get(this.localPlayerId);
  }

  all(): Player[] {
    return [...this.players.values()];
  }

  alivePlayers(): Player[] {
    return this.all().filter((player) => player.alive);
  }

  clear(): void {
    this.players.clear();
    this.localPlayerId = '';
  }

  remove(id: string): void {
    this.players.delete(id);
  }

  getLeaderboard(mode: MatchMode): LeaderboardEntry[] {
    const entries = this.all().map<LeaderboardEntry>((player) => ({
      id: player.id,
      name: player.name,
      score: player.score,
      radius: player.radius,
      eliminations: player.eliminations,
      alive: player.alive,
      isLocal: player.id === this.localPlayerId,
      isBot: player.isBot
    }));

    return entries.sort((a, b) => {
      if (mode === MatchMode.LastHoleStanding && a.alive !== b.alive) {
        return a.alive ? -1 : 1;
      }

      if (b.score !== a.score) {
        return b.score - a.score;
      }

      if (b.eliminations !== a.eliminations) {
        return b.eliminations - a.eliminations;
      }

      return b.radius - a.radius;
    });
  }
}
