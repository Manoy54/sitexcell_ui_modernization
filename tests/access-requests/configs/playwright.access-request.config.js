import { resolve } from 'node:path';
import { defineConfig } from '@playwright/test';

const resultReportPath = resolve(
  process.env.ACCESS_REPORT_PATH
    ?? resolve(process.cwd(), '.test-artifacts', 'playwright', 'access-request-results.json'),
);

const configuredWorkers = process.env.ACCESS_WORKERS ?? '1';
const workerCount = Number(configuredWorkers);
if (!Number.isInteger(workerCount) || workerCount < 1 || workerCount !== 1) {
  throw new Error(
    `ACCESS_WORKERS must be exactly 1 until the approved isolation experiment passes; received "${configuredWorkers}".`,
  );
}

export default defineConfig({
  testDir: resolve(process.cwd(), 'tests', 'access-requests', 'live'),
  timeout: 180_000,
  expect: {
    timeout: 20_000,
  },
  fullyParallel: false,
  workers: workerCount,
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
      name: 'access-authentication',
      testMatch: ['access-request/00-authentication-preflight.setup.js'],
    },
    {
      name: 'access-early',
      testMatch: [
        'access-request/behaviors/entry-validation-and-context.spec.js',
        'access-request/behaviors/early-conditional-branches.spec.js',
        'access-request/behaviors/site-search.spec.js',
      ],
      dependencies: ['access-authentication'],
    },
    {
      name: 'access-step5-readiness',
      testMatch: ['access-request/01-later-step-readiness.setup.js'],
      dependencies: ['access-authentication'],
    },
    {
      name: 'access-later',
      testMatch: ['access-request/**/*.spec.js'],
      testIgnore: [
        'access-request/behaviors/entry-validation-and-context.spec.js',
        'access-request/behaviors/early-conditional-branches.spec.js',
        'access-request/behaviors/site-search.spec.js',
      ],
      dependencies: ['access-step5-readiness'],
    },
  ],
});
