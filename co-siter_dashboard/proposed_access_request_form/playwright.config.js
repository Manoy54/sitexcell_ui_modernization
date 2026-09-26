import { defineConfig } from '@playwright/test';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const port = Number.parseInt(process.env.ACCESS_PROTOTYPE_PORT ?? '4178', 10);
const installedChromium = process.env.LOCALAPPDATA
    ? join(process.env.LOCALAPPDATA, 'ms-playwright', 'chromium-1200', 'chrome-win64', 'chrome.exe')
    : '';

export default defineConfig({
    testDir: './tests/browser',
    workers: 1,
    reporter: [['list']],
    use: {
        baseURL: `http://127.0.0.1:${port}`,
        launchOptions: existsSync(installedChromium) ? { executablePath: installedChromium } : {},
        trace: 'retain-on-failure',
        screenshot: 'only-on-failure',
    },
});
