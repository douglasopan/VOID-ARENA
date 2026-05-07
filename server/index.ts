import express from 'express';
import http from 'node:http';
import { Server } from 'socket.io';
import { MatchMode } from '../src/game/MatchMode';
import { RoomManager } from './rooms/RoomManager';
import type { RoomCreateOptions, ServerPlayer, ServerPlayerState } from './shared/serverTypes';

const PORT = Number(process.env.PORT ?? 3001);
const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*'
  }
});
const roomManager = new RoomManager();
const socketRooms = new Map<string, string>();

app.use(express.json());
app.use((_request, response, next) => {
  response.header('Access-Control-Allow-Origin', '*');
  response.header('Access-Control-Allow-Headers', 'Content-Type');
  response.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  next();
});
app.options('*', (_request, response) => {
  response.sendStatus(204);
});

roomManager.createRoom({
  roomName: 'Local Preview Room',
  maxPlayers: 16,
  fillBots: true,
  mapSize: 'medium',
  matchMode: MatchMode.Timed,
  durationSeconds: 180,
  enableChat: true,
  enableAds: true,
    objectDensityMultiplier: 1,
    powerUpCount: 14,
    respawnSafeRadius: 12,
    botDifficultyMix: 'balanced'
});

app.get('/health', (_request, response) => {
  response.json({ ok: true, name: 'Void Arena server' });
});

app.get('/rooms', (_request, response) => {
  response.json(roomManager.listRooms());
});

app.post('/rooms', (request, response) => {
  const options = request.body as Partial<RoomCreateOptions>;
  const room = roomManager.createRoom({
    roomName: options.roomName || 'Untitled Arena',
    maxPlayers: options.maxPlayers || 16,
    fillBots: Boolean(options.fillBots),
    mapSize: options.mapSize || 'medium',
    matchMode: options.matchMode || MatchMode.Timed,
    durationSeconds: options.durationSeconds || 180,
    enableChat: options.enableChat ?? true,
    enableAds: options.enableAds ?? true,
    objectDensityMultiplier: options.objectDensityMultiplier || 1,
    powerUpCount: options.powerUpCount ?? 14,
    respawnSafeRadius: options.respawnSafeRadius || 12,
    botDifficultyMix: options.botDifficultyMix || 'balanced'
  });
  response.status(201).json(room);
});

io.on('connection', (socket) => {
  socket.emit('rooms:list', roomManager.listRooms());

  socket.on('rooms:list', () => {
    socket.emit('rooms:list', roomManager.listRooms());
  });

  socket.on('room:create', (options: RoomCreateOptions, ack?: (room: unknown) => void) => {
    const room = roomManager.createRoom(options);
    io.emit('rooms:list', roomManager.listRooms());
    ack?.(room);
  });

  socket.on(
    'room:join',
    (payload: { roomId: string; playerName: string }, ack?: (result: unknown) => void) => {
      const player: ServerPlayer = {
        id: socket.id,
        name: payload.playerName || `Player_${socket.id.slice(0, 4)}`,
        isBot: false
      };
      const result = roomManager.joinRoom(payload.roomId, player);
      if (result.ok) {
        socket.join(payload.roomId);
        socketRooms.set(socket.id, payload.roomId);
        io.emit('rooms:list', roomManager.listRooms());
        socket.emit('state:players', roomManager.listPlayerStates(payload.roomId));
      }
      ack?.(result);
    }
  );

  socket.on('state:update', (payload: { roomId: string; state: ServerPlayerState }) => {
    const states = roomManager.updatePlayerState(payload.roomId, payload.state);
    socket.to(payload.roomId).emit('state:players', states);
  });

  socket.on('chat:send', (payload: { roomId: string; sender: string; text: string }) => {
    io.to(payload.roomId).emit('chat:message', {
      id: `${Date.now()}-${socket.id}`,
      sender: payload.sender,
      text: payload.text,
      system: false,
      timestamp: Date.now()
    });
  });

  socket.on(
    'hole:swallowed',
    (payload: { roomId: string; attackerId: string; victimId: string; timestamp: number }) => {
      io.to(payload.roomId).emit('hole:swallowed', payload);
    }
  );

  socket.on('disconnect', () => {
    const roomId = socketRooms.get(socket.id);
    if (!roomId) return;
    roomManager.leaveRoom(roomId, socket.id);
    socketRooms.delete(socket.id);
    io.emit('rooms:list', roomManager.listRooms());
    socket.to(roomId).emit('state:players', roomManager.listPlayerStates(roomId));
  });
});

httpServer.listen(PORT, () => {
  console.log(`Void Arena server listening on http://localhost:${PORT}`);
});
