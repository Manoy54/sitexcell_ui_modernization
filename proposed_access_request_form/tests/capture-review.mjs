import { mkdirSync } from 'node:fs';
import { execFileSync, spawn } from 'node:child_process';
import { join, resolve } from 'node:path';
import { chromium } from '@playwright/test';

const port = '4178';
const url = `http://127.0.0.1:${port}`;
const executablePath = join(process.env.LOCALAPPDATA ?? '', 'ms-playwright', 'chromium-1200', 'chrome-win64', 'chrome.exe');
const output = resolve('.impeccable', 'review');
mkdirSync(output, { recursive: true });

const server = spawn(process.execPath, ['server.mjs'], {
    cwd: resolve('proposed_access_request_form'),
    env: { ...process.env, ACCESS_PROTOTYPE_PORT: port },
    stdio: 'ignore',
});

const stopServer = () => {
    if (!server.pid || server.exitCode !== null) return;
    if (process.platform === 'win32') {
        try { execFileSync('taskkill', ['/pid', String(server.pid), '/t', '/f'], { stdio: 'ignore' }); }
        catch { server.kill(); }
    } else server.kill('SIGTERM');
};

try {
    const deadline = Date.now() + 15_000;
    while (true) {
        try { if ((await fetch(url)).ok) break; } catch { /* wait for local server */ }
        if (Date.now() > deadline) throw new Error('Prototype server did not start.');
        await new Promise((resolveWait) => setTimeout(resolveWait, 200));
    }

    const browser = await chromium.launch({ executablePath });
    for (const capture of [
        { name: 'desktop.png', width: 1440, height: 900, demo: true },
        { name: 'user-1361.png', width: 1361, height: 636, demo: false },
        { name: 'mobile.png', width: 390, height: 844, demo: true },
    ]) {
        const page = await browser.newPage({ viewport: { width: capture.width, height: capture.height } });
        await page.goto(url);
        await page.evaluate(() => sessionStorage.clear());
        await page.reload();
        if (capture.demo) await page.locator('[data-load-demo]').first().evaluate((button) => button.click());
        await page.screenshot({ path: join(output, capture.name), fullPage: capture.width > 720 });
        await page.close();
    }
    await browser.close();
    console.log(`Review captures written to ${output}`);
} finally {
    stopServer();
}
