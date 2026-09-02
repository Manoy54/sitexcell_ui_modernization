import { execFileSync, spawn } from 'node:child_process';
import { resolve } from 'node:path';

const port = process.env.LAAN_PROTOTYPE_PORT ?? '4177';
const baseUrl = `http://127.0.0.1:${port}`;
const root = resolve('proposed_laan_form');
let server = null;

const serverIsReady = async () => {
  try {
    const response = await fetch(`${baseUrl}/`);
    return response.ok;
  } catch {
    return false;
  }
};

const stopServer = () => {
  if (!server?.pid || server.exitCode !== null) return;
  if (process.platform === 'win32') {
    try {
      execFileSync('taskkill', ['/pid', String(server.pid), '/t', '/f'], { stdio: 'ignore' });
    } catch {
      server.kill();
    }
    return;
  }
  server.kill('SIGTERM');
};

try {
  if (!await serverIsReady()) {
    server = spawn(process.execPath, ['server.mjs'], {
      cwd: root,
      env: { ...process.env, LAAN_PROTOTYPE_PORT: port },
      stdio: 'inherit',
    });
  }

  const deadline = Date.now() + 30_000;
  while (Date.now() < deadline) {
    if (await serverIsReady()) break;
    await new Promise((resolvePromise) => setTimeout(resolvePromise, 250));
  }

  const cli = resolve('node_modules/@playwright/test/cli.js');
  const child = spawn(process.execPath, [
    cli,
    'test',
    '--config=proposed_laan_form/playwright.config.js',
  ], {
    cwd: resolve('.'),
    env: { ...process.env, PROTOTYPE_EXTERNAL_SERVER: '1', PROTOTYPE_BASE_URL: baseUrl },
    stdio: 'inherit',
  });

  const exitCode = await new Promise((resolvePromise, reject) => {
    child.once('error', reject);
    child.once('exit', (code, signal) => resolvePromise(code ?? (signal ? 1 : 0)));
  });
  process.exitCode = exitCode;
} finally {
  stopServer();
}
