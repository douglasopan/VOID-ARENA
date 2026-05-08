import type {
  JoinRoomResult,
  RoomCreateOptions,
  ServerPlayer,
  ServerPlayerState,
  ServerRoomSummary
} from '../shared/serverTypes';

export class GameRoom {
  private readonly players = new Map<string, ServerPlayer>();
  private readonly playerStates = new Map<string, ServerPlayerState>();
  private botCount: number;
  readonly seed: string;

  constructor(
    readonly id: string,
    private readonly options: RoomCreateOptions
  ) {
    this.botCount = options.fillBots ? Math.max(0, options.maxPlayers) : 0;
    this.seed = `server-${id.slice(0, 8)}-${Date.now()}`;
  }

  join(player: ServerPlayer): JoinRoomResult {
    if (this.players.has(player.id)) {
      return { ok: true, room: this.summary() };
    }

    const occupiedSlots = this.players.size + this.botCount;
    if (occupiedSlots >= this.options.maxPlayers) {
      if (this.botCount > 0 && !player.isBot) {
        this.botCount -= 1;
      } else {
        return { ok: false, reason: 'Room is full' };
      }
    }

    this.players.set(player.id, player);
    return { ok: true, room: this.summary() };
  }

  leave(playerId: string): void {
    this.players.delete(playerId);
    this.playerStates.delete(playerId);
    if (this.options.fillBots) {
      const openSlots = this.options.maxPlayers - this.players.size - this.botCount;
      if (openSlots > 0) {
        this.botCount += openSlots;
      }
    }
  }

  summary(): ServerRoomSummary {
    return {
      id: this.id,
      roomName: this.options.roomName,
      mapSize: this.options.mapSize,
      players: this.players.size,
      maxPlayers: this.options.maxPlayers,
      bots: this.botCount,
      botsEnabled: this.options.fillBots,
      matchMode: this.options.matchMode,
      durationSeconds: this.options.durationSeconds,
      enableChat: this.options.enableChat,
      enableAds: this.options.enableAds,
      dayNightMode: this.options.dayNightMode,
      objectDensityMultiplier: this.options.objectDensityMultiplier,
      powerUpCount: this.options.powerUpCount,
      respawnSafeRadius: this.options.respawnSafeRadius,
      itemRespawnEnabled: this.options.itemRespawnEnabled,
      powerUpRespawnEnabled: this.options.powerUpRespawnEnabled,
      botDifficultyMix: this.options.botDifficultyMix,
      seed: this.seed
    };
  }

  updatePlayerState(state: ServerPlayerState): ServerPlayerState[] {
    if (!this.players.has(state.id)) {
      return this.listPlayerStates();
    }

    this.playerStates.set(state.id, state);
    return this.listPlayerStates();
  }

  listPlayerStates(): ServerPlayerState[] {
    return [...this.playerStates.values()];
  }
}
