import { resolve } from 'node:path';
import { defineConfig } from '@playwright/test';

const resultReportPath = resolve(
  process.cwd(),
  '.test-artifacts',
  'playwright',
  'access-request-core-results.json',
);

export default defineConfig({
  testDir: resolve(process.cwd(), 'tests', 'access-requests', 'live'),
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
  projects: [
    {
      name: 'access-preflight',
      testMatch: ['core/access-request-preflight.setup.js'],
    },
    {
      name: 'access-core',
      testMatch: ['core/**/*.spec.js'],
      dependencies: ['access-preflight'],
    },
  ],
});
