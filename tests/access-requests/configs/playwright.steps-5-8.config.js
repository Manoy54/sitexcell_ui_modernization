import { resolve } from 'node:path';
import { defineConfig } from '@playwright/test';

const resultReportPath = resolve(
  process.env.ACCESS_REPORT_PATH
    ?? resolve(process.cwd(), '.test-artifacts', 'playwright', 'access-request-steps-5-8-results.json'),
);

export default defineConfig({
  testDir: resolve(process.cwd(), 'tests', 'access-requests', 'live'),
  timeout: 180_000,
  expect: {
    timeout: 20_000,
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
      name: 'access-steps-5-8',
      testMatch: ['steps-5-8/**/*.spec.js'],
      dependencies: ['access-preflight'],
    },
  ],
});
