import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const laanUrl = process.env.LAAN_URL ?? 'https://co-siter.com.au/laan-requests/';
const outputPath = resolve(process.env.EDGE_STORAGE_STATE ?? '.auth/storage-state.json');

await mkdir(dirname(outputPath), { recursive: true });

const browser = await chromium.launch({
  channel: 'msedge',
  headless: false,
});

try {
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto(laanUrl, { waitUntil: 'domcontentloaded' });

  console.log('A separate Edge window is open. Sign in manually if prompted.');
  console.log('Waiting for the authenticated LAAN form to appear...');
  await page.locator('#gform_1').waitFor({ state: 'visible', timeout: 300_000 });

  console.log('The authenticated LAAN form is visible. Return here and press Enter to save the session.');
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
