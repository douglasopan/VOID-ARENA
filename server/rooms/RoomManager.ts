import { randomUUID } from 'node:crypto';
import type {
  JoinRoomResult,
  RoomCreateOptions,
  ServerPlayer,
  ServerPlayerState,
  ServerRoomSummary
} from '../shared/serverTypes';
import { GameRoom } from './GameRoom';

export class RoomManager {
  private readonly rooms = new Map<string, GameRoom>();

  createRoom(options: RoomCreateOptions): ServerRoomSummary {
    const room = new GameRoom(randomUUID(), options);
    this.rooms.set(room.id, room);
    return room.summary();
  }

  listRooms(): ServerRoomSummary[] {
    return [...this.rooms.values()].map((room) => room.summary());
  }

  joinRoom(roomId: string, player: ServerPlayer): JoinRoomResult {
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
}
