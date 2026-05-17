import { io, type Socket } from 'socket.io-client';
import type {
  JoinRoomResult,
  RoomCreateOptions,
  ServerPlayerState,
  ServerPublicProfile,
  ServerRoomClock,
  ServerRoomSummary,
  ServerWorldEvent,
  ServerWorldEventInput,
  ServerWorldSnapshot
} from '../../server/shared/serverTypes';
import type { ChatMessage, PlayerProfile } from '../shared/types';

export class NetworkClient {
  private socket: Socket | null = null;
  private baseUrl: string;

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

  setServerUrl(url: string): void {
    const nextUrl = url.trim().replace(/\/+$/, '');
    if (!nextUrl) {
      return;
    }
    this.disconnect();
    this.baseUrl = nextUrl;
    window.localStorage.setItem(MULTIPLAYER_SERVER_STORAGE_KEY, nextUrl);
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

  onRoomClock(callback: (clock: ServerRoomClock) => void): void {
    this.socket?.on('room:clock', callback);
  }

  onRoomEnded(callback: (payload: { roomId: string; reason?: string }) => void): void {
    this.socket?.on('room:ended', callback);
  }

  onWorldEvents(callback: (events: ServerWorldEvent[]) => void): void {
    this.socket?.on('world:events', callback);
  }

  onWorldEvent(callback: (event: ServerWorldEvent) => void): void {
    this.socket?.on('world:event', callback);
  }

  onWorldSnapshot(callback: (snapshot: ServerWorldSnapshot) => void): void {
    this.socket?.on('world:snapshot', callback);
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

  requestRoomClock(roomId: string): void {
    this.socket?.emit('room:clock', { roomId });
  }

  requestWorldEvents(roomId: string, since?: number): void {
    this.socket?.emit('world:events', { roomId, since });
  }

  sendWorldEvent(roomId: string, event: ServerWorldEventInput): void {
    this.socket?.emit('world:event', { roomId, event });
  }

  sendWorldSnapshot(roomId: string, snapshot: Pick<ServerWorldSnapshot, 'traffic'>): void {
    this.socket?.emit('world:snapshot', { roomId, snapshot });
  }

  async listPublicProfiles(): Promise<ServerPublicProfile[]> {
    const response = await fetch(`${this.baseUrl}/profiles/ranking`);
    if (!response.ok) {
      throw new Error(`Could not list public profiles: ${response.status}`);
    }
    return (await response.json()) as ServerPublicProfile[];
  }

  async syncPublicProfile(profile: ServerPublicProfile): Promise<void> {
    const response = await fetch(`${this.baseUrl}/profiles/public`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile)
    });
    if (!response.ok) {
      throw new Error(`Could not sync public profile: ${response.status}`);
    }
  }

  async syncPublicProfiles(profiles: ServerPublicProfile[]): Promise<void> {
    if (profiles.length === 0) {
      return;
    }
    const response = await fetch(`${this.baseUrl}/profiles/public/batch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profiles })
    });
    if (!response.ok) {
      throw new Error(`Could not sync public profiles: ${response.status}`);
    }
  }

  async registerAccount(username: string, email: string, password: string): Promise<PlayerProfile> {
    const response = await fetch(`${this.baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    });
    return this.readProfileResponse(response, 'Não foi possível registrar a conta.');
  }

  async loginAccount(identifier: string, password: string): Promise<PlayerProfile> {
    const response = await fetch(`${this.baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password })
    });
    return this.readProfileResponse(response, 'Não foi possível entrar na conta.');
  }

  async savePrivateProfile(profile: PlayerProfile): Promise<PlayerProfile> {
    const response = await fetch(`${this.baseUrl}/auth/profile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile)
    });
    return this.readProfileResponse(response, 'Não foi possível salvar o perfil no servidor.');
  }

  endRoom(roomId: string, reason = 'client-ended'): void {
    this.socket?.emit('room:end', { roomId, reason });
  }

  disconnect(): void {
    this.socket?.disconnect();
    this.socket = null;
  }

  private async readProfileResponse(response: Response, fallbackMessage: string): Promise<PlayerProfile> {
    const payload = await response.json().catch(() => null) as { profile?: PlayerProfile; reason?: string } | null;
    if (!response.ok || !payload?.profile) {
      throw new Error(payload?.reason || fallbackMessage);
    }
    return payload.profile;
  }
}

const MULTIPLAYER_SERVER_STORAGE_KEY = 'void-arena-multiplayer-server-url';

function resolveMultiplayerServerUrl(): string {
  const urlParam = new URLSearchParams(window.location.search).get('server')?.trim();
  if (urlParam) {
    window.localStorage.setItem(MULTIPLAYER_SERVER_STORAGE_KEY, urlParam);
    return urlParam;
  }

  const saved = window.localStorage.getItem(MULTIPLAYER_SERVER_STORAGE_KEY)?.trim();
  if (saved) {
    return saved;
  }

  const configured = import.meta.env.VITE_MULTIPLAYER_SERVER_URL?.trim();
  if (configured) {
    return configured;
  }

  if (import.meta.env.DEV) {
    return 'http://localhost:3001';
  }

  return window.location.origin;
}
