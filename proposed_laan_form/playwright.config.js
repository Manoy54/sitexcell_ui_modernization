import { defineConfig } from '@playwright/test';

const useManagedServer = process.env.PROTOTYPE_EXTERNAL_SERVER !== '1';
const prototypeBaseURL = process.env.PROTOTYPE_BASE_URL ?? 'http://127.0.0.1:4177';

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  expect: { timeout: 5_000 },
  fullyParallel: false,
  workers: 1,
  reporter: [
    ['list'],
    ['json', { outputFile: '.test-artifacts/proposed-laan-results.json' }],
  ],
  use: {
    baseURL: prototypeBaseURL,
    channel: 'msedge',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    video: 'off',
  },
  ...(useManagedServer ? {
    webServer: {
      command: 'node server.mjs',
      url: prototypeBaseURL,
      reuseExistingServer: true,
      timeout: 30_000,
      gracefulShutdown: { signal: 'SIGTERM', timeout: 1_000 },
    },
  } : {}),
});
