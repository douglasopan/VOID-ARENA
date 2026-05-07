import { io, type Socket } from 'socket.io-client';
import type {
  JoinRoomResult,
  RoomCreateOptions,
  ServerPlayerState,
  ServerRoomSummary
} from '../../server/shared/serverTypes';
import type { ChatMessage } from '../shared/types';

export class NetworkClient {
  private socket: Socket | null = null;
  private readonly baseUrl: string;

  constructor(baseUrl = resolveMultiplayerServerUrl()) {
    this.baseUrl = baseUrl.replace(/\/+$/, '');
  }

  get connected(): boolean {
    return Boolean(this.socket?.connected);
  }

  get socketId(): string | null {
    return this.socket?.id ?? null;
  }

  get serverUrl(): string {
    return this.baseUrl;
  }

  async connect(): Promise<void> {
    if (this.socket?.connected) {
      return;
    }

    this.socket = io(this.baseUrl, {
      transports: ['websocket', 'polling'],
      autoConnect: true
    });

    await new Promise<void>((resolve, reject) => {
      const timeout = window.setTimeout(() => reject(new Error('Multiplayer server timeout')), 4500);
      this.socket?.once('connect', () => {
        window.clearTimeout(timeout);
        resolve();
      });
      this.socket?.once('connect_error', (error) => {
        window.clearTimeout(timeout);
        reject(error);
      });
    });
  }

  async listRooms(): Promise<ServerRoomSummary[]> {
    const response = await fetch(`${this.baseUrl}/rooms`);
    if (!response.ok) {
      throw new Error(`Could not list rooms: ${response.status}`);
    }
    return (await response.json()) as ServerRoomSummary[];
  }

  async createRoom(options: RoomCreateOptions): Promise<ServerRoomSummary> {
    const response = await fetch(`${this.baseUrl}/rooms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(options)
    });
    if (!response.ok) {
      throw new Error(`Could not create room: ${response.status}`);
    }
    return (await response.json()) as ServerRoomSummary;
  }

  async joinRoom(roomId: string, playerName: string): Promise<JoinRoomResult> {
    await this.connect();
    return new Promise((resolve) => {
      this.socket?.emit('room:join', { roomId, playerName }, (result: JoinRoomResult) => {
        resolve(result);
      });
    });
  }

  onRooms(callback: (rooms: ServerRoomSummary[]) => void): void {
    this.socket?.on('rooms:list', callback);
  }

  onPlayerStates(callback: (states: ServerPlayerState[]) => void): void {
    this.socket?.on('state:players', callback);
  }

  onChat(callback: (message: ChatMessage) => void): void {
    this.socket?.on('chat:message', callback);
  }

  onHoleSwallowed(
    callback: (payload: { attackerId: string; victimId: string; timestamp: number }) => void
  ): void {
    this.socket?.on('hole:swallowed', callback);
  }

  sendPlayerState(roomId: string, state: ServerPlayerState): void {
    this.socket?.emit('state:update', { roomId, state });
  }

  sendChat(roomId: string, sender: string, text: string): void {
    this.socket?.emit('chat:send', { roomId, sender, text });
  }

  sendHoleSwallowed(roomId: string, attackerId: string, victimId: string): void {
    this.socket?.emit('hole:swallowed', {
      roomId,
      attackerId,
      victimId,
      timestamp: Date.now()
    });
  }

  disconnect(): void {
    this.socket?.disconnect();
    this.socket = null;
  }
}

function resolveMultiplayerServerUrl(): string {
  const configured = import.meta.env.VITE_MULTIPLAYER_SERVER_URL?.trim();
  if (configured) {
    return configured;
  }

  if (import.meta.env.DEV) {
    return 'http://localhost:3001';
  }

  return window.location.origin;
}
