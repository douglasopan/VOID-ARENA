import type {
  JoinRoomResult,
  RoomCreateOptions,
  ServerPlayer,
  ServerPlayerState,
  ServerRoomClock,
  ServerRoomSummary,
  ServerWorldEvent,
  ServerWorldEventInput
} from '../shared/serverTypes';

export class GameRoom {
  private readonly players = new Map<string, ServerPlayer>();
  private readonly playerStates = new Map<string, ServerPlayerState>();
  private readonly worldEvents: ServerWorldEvent[] = [];
  private botCount: number;
  private authorityId: string | null = null;
  readonly createdAt = Date.now();
  readonly startedAt = this.createdAt;
  readonly seed: string;
  private endedAt: number | null = null;

  constructor(
    readonly id: string,
    private readonly options: RoomCreateOptions
  ) {
    this.botCount = options.fillBots ? Math.max(0, options.maxPlayers) : 0;
    this.seed = options.mapSeed?.trim() || `server-${id.slice(0, 8)}-${Date.now()}`;
  }

  join(player: ServerPlayer): JoinRoomResult {
    if (this.isEnded()) {
      return { ok: false, reason: 'Room has ended' };
    }

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
    this.authorityId ??= player.id;
    return { ok: true, room: this.summary() };
  }

  leave(playerId: string): void {
    this.players.delete(playerId);
    this.playerStates.delete(playerId);
    if (this.authorityId === playerId) {
      this.authorityId = this.players.keys().next().value ?? null;
    }
    if (this.options.fillBots) {
      const openSlots = this.options.maxPlayers - this.players.size - this.botCount;
      if (openSlots > 0) {
        this.botCount += openSlots;
      }
    }
  }

  hasPlayer(playerId: string): boolean {
    return this.players.has(playerId);
  }

  playerIds(): string[] {
    return [...this.players.keys()];
  }

  get worldAuthorityId(): string | null {
    return this.authorityId;
  }

  get endsAt(): number | null {
    return this.options.durationSeconds > 0
      ? this.startedAt + this.options.durationSeconds * 1000
      : null;
  }

  get status(): 'running' | 'ended' {
    return this.isEnded() ? 'ended' : 'running';
  }

  isEnded(now = Date.now()): boolean {
    return Boolean(this.endedAt) || (this.endsAt !== null && now >= this.endsAt);
  }

  end(now = Date.now()): void {
    this.endedAt ??= now;
  }

  clock(now = Date.now()): ServerRoomClock {
    return {
      roomId: this.id,
      status: this.isEnded(now) ? 'ended' : 'running',
      serverNow: now,
      startedAt: this.startedAt,
      endsAt: this.endsAt,
      authorityId: this.authorityId
    };
  }

  summary(): ServerRoomSummary {
    const serverNow = Date.now();
    return {
      id: this.id,
      roomName: this.options.roomName,
      status: this.isEnded(serverNow) ? 'ended' : 'running',
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
      seed: this.seed,
      createdAt: this.createdAt,
      startedAt: this.startedAt,
      endsAt: this.endsAt,
      serverNow,
      authorityId: this.authorityId
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

  addWorldEvent(input: ServerWorldEventInput, now = Date.now()): ServerWorldEvent {
    const event: ServerWorldEvent = {
      ...input,
      id: `${now}-${this.id.slice(0, 6)}-${this.worldEvents.length}`,
      roomId: this.id,
      timestamp: now,
      respawnAt: typeof input.respawnDelayMs === 'number'
        ? now + Math.max(0, Math.min(input.respawnDelayMs, 15 * 60 * 1000))
        : null
    };
    this.worldEvents.push(event);
    if (this.worldEvents.length > 1500) {
      this.worldEvents.splice(0, this.worldEvents.length - 1500);
    }
    return event;
  }

  listWorldEvents(since = 0): ServerWorldEvent[] {
    return this.worldEvents.filter((event) => event.timestamp > since);
  }
}
