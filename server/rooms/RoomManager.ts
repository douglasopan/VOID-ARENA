import { randomUUID } from 'node:crypto';
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
import { GameRoom } from './GameRoom';

export interface ClosedRoom {
  id: string;
  playerIds: string[];
  summary: ServerRoomSummary;
}

export class RoomManager {
  private readonly rooms = new Map<string, GameRoom>();

  createRoom(options: RoomCreateOptions): ServerRoomSummary {
    const room = new GameRoom(randomUUID(), options);
    this.rooms.set(room.id, room);
    return room.summary();
  }

  listRooms(): ServerRoomSummary[] {
    this.closeExpiredRooms();
    return [...this.rooms.values()]
      .filter((room) => !room.isEnded())
      .map((room) => room.summary());
  }

  joinRoom(roomId: string, player: ServerPlayer): JoinRoomResult {
    this.closeExpiredRooms();
    const room = this.rooms.get(roomId);
    if (!room) {
      return { ok: false, reason: 'Room not found' };
    }

    return room.join(player);
  }

  leaveRoom(roomId: string, playerId: string): void {
    this.rooms.get(roomId)?.leave(playerId);
  }

  updatePlayerState(roomId: string, state: ServerPlayerState): ServerPlayerState[] {
    return this.rooms.get(roomId)?.updatePlayerState(state) ?? [];
  }

  listPlayerStates(roomId: string): ServerPlayerState[] {
    return this.rooms.get(roomId)?.listPlayerStates() ?? [];
  }

  roomClock(roomId: string): ServerRoomClock | null {
    return this.rooms.get(roomId)?.clock() ?? null;
  }

  addWorldEvent(roomId: string, playerId: string, event: ServerWorldEventInput): ServerWorldEvent | null {
    const room = this.rooms.get(roomId);
    if (!room || room.isEnded() || !room.hasPlayer(playerId)) {
      return null;
    }
    return room.addWorldEvent(event);
  }

  listWorldEvents(roomId: string, since = 0): ServerWorldEvent[] {
    return this.rooms.get(roomId)?.listWorldEvents(since) ?? [];
  }

  endRoom(roomId: string): ClosedRoom | null {
    const room = this.rooms.get(roomId);
    if (!room) {
      return null;
    }
    room.end();
    return this.deleteRoom(roomId);
  }

  closeExpiredRooms(now = Date.now()): ClosedRoom[] {
    const closed: ClosedRoom[] = [];
    for (const room of this.rooms.values()) {
      if (!room.isEnded(now)) {
        continue;
      }
      const deleted = this.deleteRoom(room.id);
      if (deleted) {
        closed.push(deleted);
      }
    }
    return closed;
  }

  private deleteRoom(roomId: string): ClosedRoom | null {
    const room = this.rooms.get(roomId);
    if (!room) {
      return null;
    }
    const summary = room.summary();
    const playerIds = room.playerIds();
    this.rooms.delete(roomId);
    return { id: roomId, playerIds, summary };
  }
}
