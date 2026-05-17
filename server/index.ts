import express from 'express';
import http from 'node:http';
import { spawn } from 'node:child_process';
import { pbkdf2Sync, randomBytes, randomUUID, timingSafeEqual } from 'node:crypto';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { Server } from 'socket.io';
import { MatchMode } from '../src/game/MatchMode';
import { RoomManager } from './rooms/RoomManager';
import type {
  RoomCreateOptions,
  ServerPlayer,
  ServerPlayerState,
  ServerPublicProfile,
  ServerWorldEventInput,
  ServerWorldSnapshot
} from './shared/serverTypes';
import type { PlayerAudioPreferences, PlayerLifetimeStats, PlayerProfile } from '../src/shared/types';

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
const publicProfiles = new Map<string, ServerPublicProfile>();
const accounts = new Map<string, ServerAccountRecord>();
const PUBLIC_PROFILE_STORE_PATH = path.resolve(process.cwd(), 'data', 'public-profiles.json');
const ACCOUNT_STORE_PATH = path.resolve(process.cwd(), 'data', 'accounts.json');
const ADMIN_DEV_FALLBACK_TOKEN = 'VOIDMASTER';
const PASSWORD_HASH_ITERATIONS = 120000;

interface ServerAccountRecord {
  accountId: string;
  usernameLower: string;
  emailLower: string;
  passwordHash: string;
  passwordSalt: string;
  profile: PlayerProfile;
}

await loadPublicProfiles();
await loadAccounts();

setInterval(() => {
  const closedRooms = roomManager.closeExpiredRooms();
  if (closedRooms.length === 0) {
    return;
  }
  for (const room of closedRooms) {
    emitRoomEnded(room.id, 'timer');
    for (const playerId of room.playerIds) {
      if (socketRooms.get(playerId) === room.id) {
        socketRooms.delete(playerId);
      }
    }
  }
  io.emit('rooms:list', roomManager.listRooms());
}, 5000).unref();

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

app.get('/profiles/ranking', (_request, response) => {
  response.json([...publicProfiles.values()].sort((a, b) => b.stats.wins - a.stats.wins));
});

app.post('/auth/register', (request, response) => {
  const username = cleanText(String(request.body?.username ?? ''), 24).replace(/\s+/g, '_');
  const email = String(request.body?.email ?? '').trim().toLowerCase();
  const password = String(request.body?.password ?? '');
  if (username.length < 3) {
    response.status(400).json({ ok: false, reason: 'Use um nome de usuário com pelo menos 3 caracteres.' });
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    response.status(400).json({ ok: false, reason: 'Digite um email válido.' });
    return;
  }
  if (password.length < 6) {
    response.status(400).json({ ok: false, reason: 'Use uma senha com pelo menos 6 caracteres.' });
    return;
  }
  if ([...accounts.values()].some((account) => account.usernameLower === username.toLowerCase())) {
    response.status(409).json({ ok: false, reason: 'Esse nome de usuário já existe.' });
    return;
  }
  if ([...accounts.values()].some((account) => account.emailLower === email)) {
    response.status(409).json({ ok: false, reason: 'Esse email já está cadastrado.' });
    return;
  }

  const credentials = hashPassword(password);
  const profile = createServerProfile(username, email);
  const account: ServerAccountRecord = {
    accountId: profile.accountId,
    usernameLower: username.toLowerCase(),
    emailLower: email,
    passwordHash: credentials.hash,
    passwordSalt: credentials.salt,
    profile
  };
  accounts.set(account.accountId, account);
  publishAccountProfile(account);
  void saveAccounts();
  void savePublicProfiles();
  response.status(201).json({ ok: true, profile: clientProfile(profile) });
});

app.post('/auth/login', (request, response) => {
  const identifier = String(request.body?.identifier ?? '').trim().toLowerCase();
  const password = String(request.body?.password ?? '');
  const account = [...accounts.values()].find((candidate) =>
    candidate.usernameLower === identifier || candidate.emailLower === identifier
  );
  if (!account || !verifyPassword(password, account.passwordSalt, account.passwordHash)) {
    response.status(401).json({ ok: false, reason: 'Usuário/email ou senha incorretos.' });
    return;
  }
  response.json({ ok: true, profile: clientProfile(account.profile) });
});

app.post('/auth/profile', (request, response) => {
  const profile = sanitizePrivateProfile(request.body as Partial<PlayerProfile>);
  if (!profile) {
    response.status(400).json({ ok: false, reason: 'Perfil inválido.' });
    return;
  }
  let account = accounts.get(profile.accountId);
  if (!account) {
    if (!profile.passwordHash || !profile.passwordSalt) {
      response.status(404).json({ ok: false, reason: 'Conta não encontrada no servidor.' });
      return;
    }
    account = {
      accountId: profile.accountId,
      usernameLower: profile.username.toLowerCase(),
      emailLower: profile.email.toLowerCase(),
      passwordHash: profile.passwordHash,
      passwordSalt: profile.passwordSalt,
      profile
    };
    accounts.set(account.accountId, account);
  } else {
    account.profile = {
      ...profile,
      accountId: account.accountId,
      username: account.profile.username,
      email: account.profile.email,
      passwordHash: account.passwordHash,
      passwordSalt: account.passwordSalt
    };
  }
  publishAccountProfile(account);
  void saveAccounts();
  void savePublicProfiles();
  response.json({ ok: true, profile: clientProfile(account.profile) });
});

app.post('/profiles/public', (request, response) => {
  const profile = sanitizePublicProfile(request.body as Partial<ServerPublicProfile>);
  if (!profile) {
    response.status(400).json({ ok: false, reason: 'Invalid public profile' });
    return;
  }
  publicProfiles.set(profile.accountId, profile);
  void savePublicProfiles();
  response.status(200).json({ ok: true, profile });
});

app.post('/profiles/public/batch', (request, response) => {
  const rawProfiles = Array.isArray(request.body?.profiles) ? request.body.profiles : [];
  const saved: ServerPublicProfile[] = [];
  for (const rawProfile of rawProfiles.slice(0, 250)) {
    const profile = sanitizePublicProfile(rawProfile as Partial<ServerPublicProfile>);
    if (!profile) {
      continue;
    }
    publicProfiles.set(profile.accountId, profile);
    saved.push(profile);
  }
  void savePublicProfiles();
  response.status(200).json({ ok: true, saved: saved.length });
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
    botDifficultyMix: options.botDifficultyMix || 'balanced',
    mapSeed: options.mapSeed
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
        const clock = roomManager.roomClock(payload.roomId);
        if (clock) {
          socket.emit('room:clock', clock);
        }
        socket.emit('world:events', roomManager.listWorldEvents(payload.roomId));
        socket.emit('state:players', roomManager.listPlayerStates(payload.roomId));
      }
      ack?.(result);
    }
  );

  socket.on('state:update', (payload: { roomId: string; state: ServerPlayerState }) => {
    const clock = roomManager.roomClock(payload.roomId);
    if (!clock || clock.status === 'ended') {
      socket.emit('room:ended', { roomId: payload.roomId, reason: 'ended' });
      return;
    }
    const states = roomManager.updatePlayerState(payload.roomId, payload.state);
    socket.to(payload.roomId).emit('state:players', states);
  });

  socket.on('room:clock', (payload: { roomId: string }) => {
    const clock = roomManager.roomClock(payload.roomId);
    if (clock) {
      socket.emit('room:clock', clock);
    }
  });

  socket.on('world:events', (payload: { roomId: string; since?: number }) => {
    socket.emit('world:events', roomManager.listWorldEvents(payload.roomId, payload.since));
  });

  socket.on('world:event', (payload: { roomId: string; event: ServerWorldEventInput }) => {
    const roomId = socketRooms.get(socket.id);
    if (roomId !== payload.roomId) {
      return;
    }
    const event = roomManager.addWorldEvent(payload.roomId, socket.id, {
      ...payload.event,
      playerId: socket.id
    });
    if (!event) {
      socket.emit('room:ended', { roomId: payload.roomId, reason: 'ended' });
      return;
    }
    io.to(payload.roomId).emit('world:event', event);
  });

  socket.on('world:snapshot', (payload: { roomId: string; snapshot: Omit<ServerWorldSnapshot, 'roomId' | 'authorityId' | 'timestamp'> }) => {
    const roomId = socketRooms.get(socket.id);
    const clock = roomManager.roomClock(payload.roomId);
    if (roomId !== payload.roomId || !clock || clock.status === 'ended' || clock.authorityId !== socket.id) {
      return;
    }
    const snapshot: ServerWorldSnapshot = {
      roomId: payload.roomId,
      authorityId: socket.id,
      timestamp: Date.now(),
      traffic: Array.isArray(payload.snapshot.traffic) ? payload.snapshot.traffic.slice(0, 260) : []
    };
    socket.to(payload.roomId).emit('world:snapshot', snapshot);
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
      if (socketRooms.get(socket.id) !== payload.roomId || roomManager.roomClock(payload.roomId)?.status === 'ended') {
        return;
      }
      io.to(payload.roomId).emit('hole:swallowed', payload);
    }
  );

  socket.on('room:end', (payload: { roomId: string; reason?: string }) => {
    if (socketRooms.get(socket.id) !== payload.roomId) {
      return;
    }
    const closed = roomManager.endRoom(payload.roomId);
    if (!closed) {
      return;
    }
    emitRoomEnded(payload.roomId, payload.reason || 'ended');
    for (const playerId of closed.playerIds) {
      if (socketRooms.get(playerId) === payload.roomId) {
        socketRooms.delete(playerId);
      }
    }
    io.emit('rooms:list', roomManager.listRooms());
  });

  socket.on('disconnect', () => {
    const roomId = socketRooms.get(socket.id);
    if (!roomId) return;
    roomManager.leaveRoom(roomId, socket.id);
    socketRooms.delete(socket.id);
    io.emit('rooms:list', roomManager.listRooms());
    socket.to(roomId).emit('state:players', roomManager.listPlayerStates(roomId));
  });
});

function emitRoomEnded(roomId: string, reason: string): void {
  io.to(roomId).emit('room:ended', { roomId, reason });
  io.in(roomId).socketsLeave(roomId);
}

async function loadPublicProfiles(): Promise<void> {
  try {
    const raw = await readFile(PUBLIC_PROFILE_STORE_PATH, 'utf8');
    const parsed = JSON.parse(raw) as { profiles?: Partial<ServerPublicProfile>[] } | Partial<ServerPublicProfile>[];
    const profiles = Array.isArray(parsed) ? parsed : parsed.profiles ?? [];
    for (const rawProfile of profiles) {
      const profile = sanitizePublicProfile(rawProfile);
      if (profile) {
        publicProfiles.set(profile.accountId, profile);
      }
    }
  } catch {
    // First run or missing data file: start with an empty public ranking.
  }
}

async function savePublicProfiles(): Promise<void> {
  try {
    await mkdir(path.dirname(PUBLIC_PROFILE_STORE_PATH), { recursive: true });
    const profiles = [...publicProfiles.values()]
      .sort((a, b) => b.stats.wins - a.stats.wins || b.stats.bestScore - a.stats.bestScore)
      .slice(0, 10000);
    await writeFile(PUBLIC_PROFILE_STORE_PATH, JSON.stringify({ profiles }, null, 2), 'utf8');
  } catch (error) {
    console.warn('Could not save public profiles:', error);
  }
}

async function loadAccounts(): Promise<void> {
  try {
    const raw = await readFile(ACCOUNT_STORE_PATH, 'utf8');
    const parsed = JSON.parse(raw) as { accounts?: Array<Partial<ServerAccountRecord>> };
    for (const rawAccount of parsed.accounts ?? []) {
      if (!rawAccount.accountId || !rawAccount.passwordHash || !rawAccount.passwordSalt || !rawAccount.profile) {
        continue;
      }
      const profile = sanitizePrivateProfile({
        ...rawAccount.profile,
        accountId: rawAccount.accountId,
        passwordHash: rawAccount.passwordHash,
        passwordSalt: rawAccount.passwordSalt
      });
      if (!profile) {
        continue;
      }
      const account: ServerAccountRecord = {
        accountId: profile.accountId,
        usernameLower: profile.username.toLowerCase(),
        emailLower: profile.email.toLowerCase(),
        passwordHash: rawAccount.passwordHash,
        passwordSalt: rawAccount.passwordSalt,
        profile
      };
      accounts.set(account.accountId, account);
      publishAccountProfile(account);
    }
  } catch {
    // First run or missing data file: start with no registered accounts.
  }
}

async function saveAccounts(): Promise<void> {
  try {
    await mkdir(path.dirname(ACCOUNT_STORE_PATH), { recursive: true });
    const savedAccounts = [...accounts.values()].map((account) => ({
      accountId: account.accountId,
      usernameLower: account.usernameLower,
      emailLower: account.emailLower,
      passwordHash: account.passwordHash,
      passwordSalt: account.passwordSalt,
      profile: clientProfile(account.profile)
    }));
    await writeFile(ACCOUNT_STORE_PATH, JSON.stringify({ accounts: savedAccounts }, null, 2), 'utf8');
  } catch (error) {
    console.warn('Could not save accounts:', error);
  }
}

function publishAccountProfile(account: ServerAccountRecord): void {
  const publicProfile = sanitizePublicProfile(account.profile);
  if (publicProfile) {
    publicProfiles.set(publicProfile.accountId, publicProfile);
  }
}

function createServerProfile(username: string, email: string): PlayerProfile {
  const now = new Date().toISOString();
  const stats = { ...DEFAULT_STATS };
  return {
    accountId: randomUUID(),
    username,
    email,
    playerName: username,
    profileAccentColor: '#5eead4',
    socialLinks: [],
    ownedVoidSkins: ['neon-core', 'classic-singularity'],
    selectedVoidSkin: 'neon-core',
    holeRimColor: '#5eead4',
    holeRimStyle: 'neon',
    language: 'pt',
    audioPreferences: { ...DEFAULT_AUDIO_PREFERENCES },
    stats,
    experience: defaultExperience(),
    createdAt: now,
    updatedAt: now,
    matchHistory: []
  };
}

function sanitizePrivateProfile(input: Partial<PlayerProfile>): PlayerProfile | null {
  if (!input?.accountId || !input.username) {
    return null;
  }
  const username = cleanText(input.username, 24).replace(/\s+/g, '_');
  const email = String(input.email ?? '').trim().toLowerCase();
  if (username.length < 3 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return null;
  }
  const stats = normalizeStats(input.stats);
  const experience = input.experience
    ? {
        totalXp: clampInt(input.experience.totalXp),
        level: Math.max(1, clampInt(input.experience.level)),
        currentLevelXp: clampInt(input.experience.currentLevelXp),
        nextLevelXp: Math.max(1, clampInt(input.experience.nextLevelXp)),
        progress: Math.max(0, Math.min(1, Number(input.experience.progress) || 0))
      }
    : defaultExperience();
  return {
    accountId: cleanText(input.accountId, 80),
    username,
    email,
    passwordHash: cleanText(input.passwordHash ?? '', 180) || undefined,
    passwordSalt: cleanText(input.passwordSalt ?? '', 180) || undefined,
    avatarDataUrl: typeof input.avatarDataUrl === 'string' && input.avatarDataUrl.startsWith('data:image/')
      ? input.avatarDataUrl.slice(0, 250000)
      : undefined,
    profileTitle: cleanText(input.profileTitle ?? '', 42),
    bio: cleanText(input.bio ?? '', 220),
    profileAccentColor: normalizeColor(input.profileAccentColor),
    socialLinks: Array.isArray(input.socialLinks) ? input.socialLinks.slice(0, 5) : [],
    ownedVoidSkins: Array.isArray(input.ownedVoidSkins) && input.ownedVoidSkins.length > 0
      ? input.ownedVoidSkins
      : ['neon-core', 'classic-singularity'],
    selectedVoidSkin: input.selectedVoidSkin ?? 'neon-core',
    playerName: cleanText(input.playerName || username, 24),
    holeRimColor: normalizeColor(input.holeRimColor),
    holeRimStyle: input.holeRimStyle ?? 'neon',
    language: input.language ?? 'pt',
    audioPreferences: normalizeAudioPreferences(input.audioPreferences),
    stats,
    experience,
    createdAt: input.createdAt || new Date().toISOString(),
    updatedAt: input.updatedAt || new Date().toISOString(),
    matchHistory: Array.isArray(input.matchHistory) ? input.matchHistory.slice(0, 240) : []
  };
}

function clientProfile(profile: PlayerProfile): PlayerProfile {
  const {
    passwordHash: _passwordHash,
    passwordSalt: _passwordSalt,
    ...safeProfile
  } = profile;
  return safeProfile;
}

function sanitizePublicProfile(input: Partial<ServerPublicProfile>): ServerPublicProfile | null {
  if (!input?.accountId || !input.username || !input.stats || !input.experience) {
    return null;
  }

  return {
    accountId: cleanText(input.accountId, 80),
    username: cleanText(input.username, 24),
    avatarDataUrl: typeof input.avatarDataUrl === 'string' && input.avatarDataUrl.startsWith('data:image/')
      ? input.avatarDataUrl.slice(0, 250000)
      : undefined,
    profileTitle: cleanText(input.profileTitle ?? '', 42),
    bio: cleanText(input.bio ?? '', 220),
    profileAccentColor: normalizeColor(input.profileAccentColor),
    socialLinks: Array.isArray(input.socialLinks) ? input.socialLinks.slice(0, 5) : [],
    ownedVoidSkins: Array.isArray(input.ownedVoidSkins) ? input.ownedVoidSkins : [],
    selectedVoidSkin: input.selectedVoidSkin ?? 'neon-core',
    playerName: cleanText(input.playerName || input.username, 24),
    holeRimColor: normalizeColor(input.holeRimColor),
    holeRimStyle: input.holeRimStyle ?? 'neon',
    language: input.language ?? 'en',
    stats: {
      matchesPlayed: clampInt(input.stats.matchesPlayed),
      wins: clampInt(input.stats.wins),
      timedWins: clampInt(input.stats.timedWins),
      lastHoleStandingWins: clampInt(input.stats.lastHoleStandingWins),
      eliminationRushWins: clampInt(input.stats.eliminationRushWins),
      timeTrialWins: clampInt(input.stats.timeTrialWins),
      careerWins: clampInt(input.stats.careerWins),
      creativeWins: clampInt(input.stats.creativeWins),
      totalScore: clampInt(input.stats.totalScore),
      bestScore: clampInt(input.stats.bestScore),
      totalEliminations: clampInt(input.stats.totalEliminations),
      totalObjectsSwallowed: clampInt(input.stats.totalObjectsSwallowed)
    },
    experience: {
      totalXp: clampInt(input.experience.totalXp),
      level: Math.max(1, clampInt(input.experience.level)),
      currentLevelXp: clampInt(input.experience.currentLevelXp),
      nextLevelXp: Math.max(1, clampInt(input.experience.nextLevelXp)),
      progress: Math.max(0, Math.min(1, Number(input.experience.progress) || 0))
    },
    createdAt: input.createdAt || new Date().toISOString(),
    updatedAt: input.updatedAt || new Date().toISOString()
  };
}

function hashPassword(password: string, salt = randomBytes(16).toString('base64')): { hash: string; salt: string } {
  return {
    salt,
    hash: pbkdf2Sync(password, Buffer.from(salt, 'base64'), PASSWORD_HASH_ITERATIONS, 32, 'sha256').toString('base64')
  };
}

function verifyPassword(password: string, salt: string, expectedHash: string): boolean {
  try {
    const actual = hashPassword(password, salt).hash;
    const actualBytes = Buffer.from(actual, 'base64');
    const expectedBytes = Buffer.from(expectedHash, 'base64');
    return actualBytes.length === expectedBytes.length && timingSafeEqual(actualBytes, expectedBytes);
  } catch {
    return false;
  }
}

const DEFAULT_AUDIO_PREFERENCES: PlayerAudioPreferences = {
  sfxVolume: 0.3,
  musicVolume: 0.15,
  cityAmbienceVolume: 0.01,
  musicEnabled: true
};

const DEFAULT_STATS: PlayerLifetimeStats = {
  matchesPlayed: 0,
  wins: 0,
  timedWins: 0,
  lastHoleStandingWins: 0,
  eliminationRushWins: 0,
  timeTrialWins: 0,
  careerWins: 0,
  creativeWins: 0,
  totalScore: 0,
  bestScore: 0,
  totalEliminations: 0,
  totalObjectsSwallowed: 0
};

function defaultExperience(): PlayerProfile['experience'] {
  return {
    totalXp: 0,
    level: 1,
    currentLevelXp: 0,
    nextLevelXp: 500,
    progress: 0
  };
}

function normalizeStats(input: Partial<PlayerLifetimeStats> | undefined): PlayerLifetimeStats {
  return {
    matchesPlayed: clampInt(input?.matchesPlayed),
    wins: clampInt(input?.wins),
    timedWins: clampInt(input?.timedWins),
    lastHoleStandingWins: clampInt(input?.lastHoleStandingWins),
    eliminationRushWins: clampInt(input?.eliminationRushWins),
    timeTrialWins: clampInt(input?.timeTrialWins),
    careerWins: clampInt(input?.careerWins),
    creativeWins: clampInt(input?.creativeWins),
    totalScore: clampInt(input?.totalScore),
    bestScore: clampInt(input?.bestScore),
    totalEliminations: clampInt(input?.totalEliminations),
    totalObjectsSwallowed: clampInt(input?.totalObjectsSwallowed)
  };
}

function normalizeAudioPreferences(input: Partial<PlayerAudioPreferences> | undefined): PlayerAudioPreferences {
  return {
    sfxVolume: clamp01(input?.sfxVolume),
    musicVolume: clamp01(input?.musicVolume),
    cityAmbienceVolume: clamp01(input?.cityAmbienceVolume),
    musicEnabled: input?.musicEnabled !== false
  };
}

function cleanText(value: string, maxLength: number): string {
  return String(value ?? '').replace(/\s+/g, ' ').trim().slice(0, maxLength);
}

function normalizeColor(value: string | undefined): string {
  const color = String(value || '#5eead4').trim();
  return /^#[0-9a-f]{6}$/i.test(color) ? color : '#5eead4';
}

function clampInt(value: unknown): number {
  const number = Number(value);
  return Number.isFinite(number) ? Math.max(0, Math.floor(number)) : 0;
}

function clamp01(value: unknown): number {
  const number = Number(value);
  return Number.isFinite(number) ? Math.max(0, Math.min(1, number)) : 0;
}

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
