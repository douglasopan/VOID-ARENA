import express from 'express';
import http from 'node:http';
import { spawn } from 'node:child_process';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { Server } from 'socket.io';
import { MatchMode } from '../src/game/MatchMode';
import { RoomManager } from './rooms/RoomManager';
import type { RoomCreateOptions, ServerPlayer, ServerPlayerState } from './shared/serverTypes';

const PORT = Number(process.env.PORT ?? 3001);
const HOST = process.env.HOST ?? '0.0.0.0';
const allowedOrigins = (process.env.CLIENT_ORIGINS ?? process.env.CLIENT_ORIGIN ?? '*')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);
const corsOrigin = allowedOrigins.includes('*') ? '*' : allowedOrigins;
const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: corsOrigin
  }
});
const roomManager = new RoomManager();
const socketRooms = new Map<string, string>();
const ADMIN_DEV_FALLBACK_TOKEN = 'VOIDMASTER';

app.use((request, response, next) => {
  const requestOrigin = request.headers.origin;
  const responseOrigin =
    allowedOrigins.includes('*') || !requestOrigin
      ? '*'
      : allowedOrigins.includes(requestOrigin)
        ? requestOrigin
        : allowedOrigins[0] ?? '*';
  response.header('Access-Control-Allow-Origin', responseOrigin);
  response.header('Access-Control-Allow-Headers', 'Content-Type,X-Admin-Token,X-Audio-Folder,X-File-Name');
  response.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  response.header('Vary', 'Origin');
  next();
});
app.post('/admin/audio', express.raw({ type: '*/*', limit: '80mb' }), async (request, response) => {
  if (!hasAdminAccess(request.headers['x-admin-token'])) {
    response.status(401).send('Admin master token is invalid.');
    return;
  }

  const rawFolder = String(request.headers['x-audio-folder'] ?? 'sfx');
  const folder = ['music', 'sfx', 'ui'].includes(rawFolder) ? rawFolder : 'sfx';
  const rawFileName = decodeURIComponent(String(request.headers['x-file-name'] ?? 'audio.ogg'));
  const safeBaseName = sanitizeAudioBaseName(rawFileName);
  const sourceExtension = path.extname(rawFileName).toLowerCase();
  const outputDir = path.resolve(process.cwd(), 'public', 'audio', folder);
  const outputPath = path.join(outputDir, `${safeBaseName}.ogg`);

  try {
    await mkdir(outputDir, { recursive: true });
    if (sourceExtension === '.ogg') {
      await writeFile(outputPath, request.body);
    } else if (sourceExtension === '.mp3') {
      const tempPath = path.join(os.tmpdir(), `${safeBaseName}-${Date.now()}.mp3`);
      await writeFile(tempPath, request.body);
      await convertMp3ToOgg(tempPath, outputPath);
      await rm(tempPath, { force: true });
    } else {
      response.status(400).send('Only .ogg and .mp3 audio files are accepted.');
      return;
    }

    response.status(201).json({
      path: `/audio/${folder}/${safeBaseName}.ogg`
    });
  } catch (error) {
    response.status(500).send(error instanceof Error ? error.message : 'Audio conversion failed.');
  }
});
app.use(express.json());
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
  dayNightMode: 'cycle',
  objectDensityMultiplier: 1,
  powerUpCount: 14,
  respawnSafeRadius: 12,
  itemRespawnEnabled: true,
  powerUpRespawnEnabled: true,
  botDifficultyMix: 'balanced'
});

app.get('/health', (_request, response) => {
  response.json({
    ok: true,
    name: 'Void Arena server',
    rooms: roomManager.listRooms().length,
    uptimeSeconds: Math.round(process.uptime())
  });
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
    dayNightMode: options.dayNightMode || 'cycle',
    objectDensityMultiplier: options.objectDensityMultiplier || 1,
    powerUpCount: options.powerUpCount ?? 14,
    respawnSafeRadius: options.respawnSafeRadius || 12,
    itemRespawnEnabled: options.itemRespawnEnabled ?? true,
    powerUpRespawnEnabled: options.powerUpRespawnEnabled ?? true,
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
    const room = roomManager.createRoom({
      ...options,
      itemRespawnEnabled: options.itemRespawnEnabled ?? true,
      powerUpRespawnEnabled: options.powerUpRespawnEnabled ?? true
    });
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

function hasAdminAccess(headerValue: string | string[] | undefined): boolean {
  const configuredToken = process.env.ADMIN_MASTER_TOKEN || ADMIN_DEV_FALLBACK_TOKEN;
  const providedToken = Array.isArray(headerValue) ? headerValue[0] : headerValue;
  return Boolean(providedToken) && providedToken === configuredToken;
}

function sanitizeAudioBaseName(fileName: string): string {
  const parsed = path.parse(fileName);
  const base = parsed.name
    .normalize('NFKD')
    .replace(/[^\w.-]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .toLowerCase();
  return base || `audio_${Date.now()}`;
}

function convertMp3ToOgg(inputPath: string, outputPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const ffmpeg = spawn('ffmpeg', [
      '-y',
      '-i',
      inputPath,
      '-vn',
      '-c:a',
      'libopus',
      '-b:a',
      '128k',
      outputPath
    ], {
      stdio: ['ignore', 'ignore', 'pipe']
    });

    let stderr = '';
    ffmpeg.stderr.on('data', (chunk) => {
      stderr += String(chunk);
    });
    ffmpeg.on('error', reject);
    ffmpeg.on('close', (code) => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(new Error(stderr || `ffmpeg exited with code ${code}`));
    });
  });
}

httpServer.listen(PORT, HOST, () => {
  console.log(`Void Arena server listening on http://${HOST}:${PORT}`);
});
