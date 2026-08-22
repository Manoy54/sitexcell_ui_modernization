import { resolve } from 'node:path';
import { defineConfig } from '@playwright/test';

const resultReportPath = resolve(process.cwd(), '.test-artifacts', 'playwright', 'wave2-results.json');

export default defineConfig({
  testDir: resolve(process.cwd(), 'tests', 'laan-request', 'live'),
  testMatch: ['wave2/**/*.wave2.spec.js'],
  timeout: 120_000,
  expect: {
    timeout: 15_000,
  },
  fullyParallel: false,
  workers: 1,
  reporter: [
    ['list'],
    ['json', { outputFile: resultReportPath }],
  ],
  use: {
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    video: 'off',
  },
});
