import express from 'express';
import { readFileSync } from 'node:fs';
import { copyFile, mkdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import Module, { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '../..');
const port = Number(process.env.PREBUILD_ADMIN_PORT ?? 4187);
const require = createRequire(import.meta.url);

const files = {
  engine: path.join(projectRoot, 'src/admin/prebuildEngineOverrides.json'),
  text: path.join(projectRoot, 'src/admin/prebuildTextOverrides.json'),
  assets: path.join(projectRoot, 'src/admin/prebuildAssetRegistry.json')
};
let tsLoaderRegistered = false;

const app = express();
app.use(express.json({ limit: '12mb' }));
app.use(express.static(__dirname));
app.use('/vendor/three', express.static(path.join(projectRoot, 'node_modules/three')));
app.use('/assets', express.static(path.join(projectRoot, 'public')));

app.get('/api/config', async (_request, response) => {
  response.json({
    engine: await readJson(files.engine, {}),
    text: await readJson(files.text, {}),
    assets: await readJson(files.assets, {})
  });
});

app.get('/api/meta', async (_request, response) => {
  response.json({
    languages: ['en', 'es', 'pt', 'fr', 'de', 'ru', 'ja', 'zh'],
    objectKinds: [
      'crate',
      'post',
      'tree',
      'rock',
      'car',
      'truck',
      'bus',
      'emergency',
      'trailerTruck',
      'trafficLight',
      'building',
      'structure',
      'billboard',
      'screen',
      'bench',
      'hydrant',
      'trash',
      'pedestrian',
      'cone',
      'mailbox',
      'bike',
      'planter',
      'kiosk',
      'fountain',
      'statue'
    ],
    powerUps: ['magnet', 'shrink', 'haste', 'shield', 'stamina', 'mass', 'gust', 'overcharge', 'dash'],
    events: ['rain', 'thunderstorm', 'earthquake', 'meteorShower', 'sandstorm'],
    textDefaults: await readTextDefaults()
  });
});

app.post('/api/config/:section', async (request, response) => {
  const section = request.params.section;
  if (!Object.hasOwn(files, section)) {
    response.status(404).json({ ok: false, error: 'Unknown config section' });
    return;
  }

  const body = section === 'engine'
    ? sanitizeEngineConfigPayload(request.body ?? {})
    : request.body ?? {};
  await writeJson(files[section], body);
  response.json({ ok: true, section });
});

app.post('/api/import-audio', async (request, response) => {
  const sourcePath = String(request.body?.sourcePath ?? '').trim();
  const folder = String(request.body?.folder ?? 'sfx').trim();
  const fileName = String(request.body?.fileName ?? '').trim();

  if (!sourcePath) {
    response.status(400).json({ ok: false, error: 'Missing sourcePath' });
    return;
  }

  if (!['music', 'sfx', 'ui'].includes(folder)) {
    response.status(400).json({ ok: false, error: 'Invalid audio folder' });
    return;
  }

  const absoluteSource = path.resolve(sourcePath);
  const extension = path.extname(absoluteSource).toLowerCase();
  if (extension !== '.ogg' && extension !== '.mp3') {
    response.status(400).json({ ok: false, error: 'Only .ogg and .mp3 are supported' });
    return;
  }

  try {
    const sourceInfo = await stat(absoluteSource);
    if (!sourceInfo.isFile()) {
      response.status(400).json({ ok: false, error: 'Source path is not a file' });
      return;
    }
  } catch {
    response.status(404).json({ ok: false, error: 'Source file not found' });
    return;
  }

  const baseName = slugAudioName(fileName || path.basename(absoluteSource, extension));
  const publicFolder = path.join(projectRoot, 'public/audio', folder);
  const outputFile = path.join(publicFolder, `${baseName}.ogg`);
  await mkdir(publicFolder, { recursive: true });

  try {
    if (extension === '.ogg') {
      await copyFile(absoluteSource, outputFile);
    } else {
      await runFfmpeg(absoluteSource, outputFile);
    }
    response.json({
      ok: true,
      path: `/audio/${folder}/${path.basename(outputFile)}`
    });
  } catch (error) {
    await rm(outputFile, { force: true }).catch(() => undefined);
    response.status(500).json({
      ok: false,
      error: error instanceof Error ? error.message : 'Could not import audio'
    });
  }
});

app.post('/api/import-model', async (request, response) => {
  const sourcePath = String(request.body?.sourcePath ?? '').trim();
  const fileName = String(request.body?.fileName ?? '').trim();

  if (!sourcePath) {
    response.status(400).json({ ok: false, error: 'Missing sourcePath' });
    return;
  }

  const absoluteSource = path.resolve(sourcePath);
  const extension = path.extname(absoluteSource).toLowerCase();
  if (extension !== '.glb' && extension !== '.gltf') {
    response.status(400).json({ ok: false, error: 'Only .glb and .gltf are supported' });
    return;
  }

  try {
    const sourceInfo = await stat(absoluteSource);
    if (!sourceInfo.isFile()) {
      response.status(400).json({ ok: false, error: 'Source path is not a file' });
      return;
    }
  } catch {
    response.status(404).json({ ok: false, error: 'Source model not found' });
    return;
  }

  const baseName = slugAssetName(fileName || path.basename(absoluteSource, extension));
  const publicFolder = path.join(projectRoot, 'public/models/custom');
  const outputFile = path.join(publicFolder, `${baseName}${extension}`);
  await mkdir(publicFolder, { recursive: true });

  try {
    await copyFile(absoluteSource, outputFile);
    response.json({
      ok: true,
      path: `/models/custom/${path.basename(outputFile)}`,
      format: extension.slice(1)
    });
  } catch (error) {
    await rm(outputFile, { force: true }).catch(() => undefined);
    response.status(500).json({
      ok: false,
      error: error instanceof Error ? error.message : 'Could not import model'
    });
  }
});

app.post('/api/map-preview', async (request, response) => {
  try {
    const result = generateMapPreview(request.body ?? {});
    response.json(result);
  } catch (error) {
    response.status(500).json({
      ok: false,
      error: error instanceof Error ? error.message : 'Could not generate map preview'
    });
  }
});

app.listen(port, () => {
  console.log(`Void Arena prebuild admin: http://localhost:${port}`);
});

async function readJson(file, fallback) {
  try {
    return JSON.parse(await readFile(file, 'utf8'));
  } catch {
    return fallback;
  }
}

async function writeJson(file, value) {
  JSON.stringify(value);
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

async function readTextDefaults() {
  const i18nFile = path.join(projectRoot, 'src/i18n/I18n.ts');
  try {
    const source = await readFile(i18nFile, 'utf8');
    const start = source.indexOf('const EN_STRINGS = {');
    const end = source.indexOf('} as const;', start);
    if (start < 0 || end < 0) {
      return {};
    }
    const block = source.slice(start, end);
    const defaults = {};
    const pattern = /^\s{2}([A-Za-z0-9_]+):\s*(['"])((?:\\.|(?!\2).)*)\2,/gm;
    let match;
    while ((match = pattern.exec(block))) {
      defaults[match[1]] = decodeTsString(match[3]);
    }
    return defaults;
  } catch {
    return {};
  }
}

function decodeTsString(value) {
  return value
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '\r')
    .replace(/\\t/g, '\t')
    .replace(/\\'/g, "'")
    .replace(/\\"/g, '"')
    .replace(/\\\\/g, '\\');
}

function slugAudioName(value) {
  return slugAssetName(value) || `audio_${Date.now()}`;
}

function slugAssetName(value) {
  const slug = value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\.[^.]+$/, '')
    .replace(/[^a-zA-Z0-9_-]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .toLowerCase();
  return slug;
}

function runFfmpeg(input, output) {
  return new Promise((resolve, reject) => {
    const child = spawn('ffmpeg', ['-y', '-i', input, '-vn', '-c:a', 'libopus', '-b:a', '128k', output], {
      stdio: ['ignore', 'ignore', 'pipe']
    });
    let stderr = '';
    child.stderr.on('data', (chunk) => {
      stderr += String(chunk);
    });
    child.on('error', reject);
    child.on('close', (code) => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(new Error(stderr.trim() || `ffmpeg exited with code ${code}`));
    });
  });
}

function sanitizeEngineConfigPayload(input) {
  const output = JSON.parse(JSON.stringify(input ?? {}));
  if (!output.gameplay || typeof output.gameplay !== 'object') {
    return output;
  }

  const gameplayRanges = {
    startSpeedMultiplier: [0.25, 6],
    minSpeedMultiplier: [0.25, 6],
    boostMultiplier: [1, 4.5],
    staminaDrainMultiplier: [0.1, 5],
    staminaRegenMultiplier: [0.1, 6],
    magnetStrengthMultiplier: [0, 5],
    objectContactSecondsMultiplier: [0.15, 6],
    rimSuctionMultiplier: [0, 5],
    swallowGravityMultiplier: [0.25, 5],
    objectMissForgiveness: [0.35, 3]
  };

  for (const [key, range] of Object.entries(gameplayRanges)) {
    if (Object.hasOwn(output.gameplay, key)) {
      output.gameplay[key] = clampNumber(output.gameplay[key], range[0], range[1]);
    }
  }

  return output;
}

function clampNumber(value, min, max) {
  const number = Number(value);
  if (!Number.isFinite(number)) {
    return min;
  }
  return Math.min(max, Math.max(min, number));
}

function generateMapPreview(input) {
  registerTsLoader();
  ensureBrowserStubs();
  const engineModule = require(path.join(projectRoot, 'src/admin/EngineConfig.ts'));
  if (input.engineConfig && typeof input.engineConfig === 'object') {
    engineModule.saveEngineConfig(input.engineConfig);
  }
  const { ProceduralMapGenerator } = require(path.join(projectRoot, 'src/game/ProceduralMapGenerator.ts'));
  const size = ['small', 'medium', 'large', 'huge'].includes(input.size) ? input.size : 'medium';
  const objectDensityMultiplier = Number(input.objectDensityMultiplier);
  const powerUpCount = Number(input.powerUpCount);
  const generator = new ProceduralMapGenerator();
  const map = generator.generate({
    size,
    enableAds: input.enableAds !== false,
    seed: String(input.seed || 'VA-PREBUILD'),
    objectDensityMultiplier: Number.isFinite(objectDensityMultiplier) ? objectDensityMultiplier : 1,
    powerUpCount: Number.isFinite(powerUpCount) ? powerUpCount : undefined
  });
  return { ok: true, map };
}

function registerTsLoader() {
  if (tsLoaderRegistered) return;
  const ts = require('typescript');
  Module._extensions['.ts'] = (module, filename) => {
    const source = readFileSync(filename, 'utf8');
    const output = ts.transpileModule(source, {
      fileName: filename,
      compilerOptions: {
        target: ts.ScriptTarget.ES2020,
        module: ts.ModuleKind.CommonJS,
        esModuleInterop: true,
        resolveJsonModule: true
      }
    }).outputText;
    module._compile(output, filename);
  };
  tsLoaderRegistered = true;
}

function ensureBrowserStubs() {
  const storage = new Map();
  globalThis.localStorage ??= {
    get length() {
      return storage.size;
    },
    clear() {
      storage.clear();
    },
    getItem(key) {
      return storage.get(key) ?? null;
    },
    key(index) {
      return Array.from(storage.keys())[index] ?? null;
    },
    removeItem(key) {
      storage.delete(key);
    },
    setItem(key, value) {
      storage.set(key, String(value));
    }
  };
  globalThis.window ??= {
    addEventListener() {},
    dispatchEvent() {
      return true;
    },
    removeEventListener() {}
  };
  globalThis.CustomEvent ??= class CustomEvent extends Event {
    constructor(type, init = {}) {
      super(type);
      this.detail = init.detail;
    }
  };
}
