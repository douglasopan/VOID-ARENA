import express from 'express';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '../..');
const port = Number(process.env.PREBUILD_ADMIN_PORT ?? 4187);

const files = {
  engine: path.join(projectRoot, 'src/admin/prebuildEngineOverrides.json'),
  text: path.join(projectRoot, 'src/admin/prebuildTextOverrides.json'),
  assets: path.join(projectRoot, 'src/admin/prebuildAssetRegistry.json')
};

const app = express();
app.use(express.json({ limit: '12mb' }));
app.use(express.static(__dirname));

app.get('/api/config', async (_request, response) => {
  response.json({
    engine: await readJson(files.engine, {}),
    text: await readJson(files.text, {}),
    assets: await readJson(files.assets, {})
  });
});

app.post('/api/config/:section', async (request, response) => {
  const section = request.params.section;
  if (!Object.hasOwn(files, section)) {
    response.status(404).json({ ok: false, error: 'Unknown config section' });
    return;
  }

  await writeJson(files[section], request.body ?? {});
  response.json({ ok: true, section });
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
