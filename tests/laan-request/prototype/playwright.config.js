import { resolve } from 'node:path';
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  expect: { timeout: 5_000 },
  fullyParallel: false,
  workers: 1,
  reporter: [['list'], ['json', { outputFile: resolve(process.cwd(), '.test-artifacts', 'playwright', 'prototype-results.json') }]],
  use: {
    baseURL: 'http://127.0.0.1:4174',
    channel: 'msedge',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    video: 'off',
  },
  webServer: {
    command: 'node server.mjs',
    url: 'http://127.0.0.1:4174/',
    reuseExistingServer: true,
  },
});
