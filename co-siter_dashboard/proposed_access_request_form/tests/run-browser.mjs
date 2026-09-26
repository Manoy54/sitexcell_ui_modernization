import { execFileSync, spawn } from 'node:child_process';
import { resolve } from 'node:path';

const port = process.env.ACCESS_PROTOTYPE_PORT ?? '4178';
const baseUrl = `http://127.0.0.1:${port}`;
let server = null;

const serverIsReady = async () => {
    try {
        return (await fetch(baseUrl)).ok;
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
            cwd: resolve('co-siter_dashboard/proposed_access_request_form'),
            env: { ...process.env, ACCESS_PROTOTYPE_PORT: port },
            stdio: 'inherit',
        });
    }

    const deadline = Date.now() + 30_000;
    while (!await serverIsReady()) {
        if (Date.now() > deadline) throw new Error('Access Request prototype server did not start within 30 seconds.');
        await new Promise((resolveWait) => setTimeout(resolveWait, 200));
    }

    const child = spawn(process.execPath, [
        resolve('node_modules/@playwright/test/cli.js'),
        'test',
        '--config=co-siter_dashboard/proposed_access_request_form/playwright.config.js',
    ], { cwd: resolve('.'), env: { ...process.env, ACCESS_PROTOTYPE_PORT: port }, stdio: 'inherit' });

    process.exitCode = await new Promise((resolveExit, reject) => {
        child.once('error', reject);
        child.once('exit', (code, signal) => resolveExit(code ?? (signal ? 1 : 0)));
    });
} finally {
    stopServer();
}
