import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { ACCESS_REQUEST_URL } from './form-helpers.js';
import { ACCESS_FORM } from './selectors.js';

const outputPath = resolve(
  process.env.ACCESS_STORAGE_STATE ?? '.auth/access-request-storage-state.json',
);
await mkdir(dirname(outputPath), { recursive: true });

const browser = await chromium.launch({ channel: 'msedge', headless: false });

try {
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto(ACCESS_REQUEST_URL, { waitUntil: 'domcontentloaded' });

  console.log('A separate Edge window is open. Sign in with the approved test account if prompted.');
  console.log('Waiting for the authenticated Access Request form...');
  await page.locator(ACCESS_FORM).waitFor({ state: 'visible', timeout: 300_000 });

  console.log('The form is visible. Return here and press Enter to save the local session.');
  await new Promise((resolveInput) => {
    process.stdin.once('data', () => {
      process.stdin.pause();
      resolveInput();
    });
    process.stdin.resume();
  });

  await context.storageState({ path: outputPath });
  console.log(`Saved authenticated session state to: ${outputPath}`);
} finally {
  await browser.close();
}
