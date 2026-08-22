import { resolve } from 'node:path';
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './',
  timeout: 30_000,
  expect: { timeout: 5_000 },
  fullyParallel: false,
  workers: 1,
  reporter: [['list'], ['json', { outputFile: resolve(process.cwd(), '.test-artifacts', 'playwright', 'wordpress-results.json') }]],
  use: {
    baseURL: process.env.WP_BASE_URL ?? 'http://sitexcell.local',
    channel: 'msedge',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    video: 'off',
  },
});
