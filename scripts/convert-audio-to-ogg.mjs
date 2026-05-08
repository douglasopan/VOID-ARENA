import { spawn } from 'node:child_process';
import { rm } from 'node:fs/promises';
import path from 'node:path';

const files = process.argv.slice(2);

if (files.length === 0) {
  console.log('Usage: npm run audio:ogg -- path/to/file.mp3 [more files]');
  process.exit(0);
}

for (const file of files) {
  const input = path.resolve(file);
  if (path.extname(input).toLowerCase() !== '.mp3') {
    console.log(`skip ${input} (not mp3)`);
    continue;
  }

  const output = input.slice(0, -4) + '.ogg';
  await runFfmpeg(input, output);
  await rm(input, { force: true });
  console.log(`converted ${input} -> ${output}`);
}

function runFfmpeg(input, output) {
  return new Promise((resolve, reject) => {
    const child = spawn('ffmpeg', ['-y', '-i', input, '-vn', '-c:a', 'libopus', '-b:a', '128k', output], {
      stdio: ['ignore', 'inherit', 'inherit']
    });
    child.on('error', reject);
    child.on('close', (code) => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(new Error(`ffmpeg exited with code ${code}`));
    });
  });
}
