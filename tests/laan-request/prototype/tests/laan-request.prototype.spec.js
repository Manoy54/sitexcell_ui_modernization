import { expect, test } from '@playwright/test';

async function openPrototype(page) {
  await page.goto('/');
  await expect(page.locator('#stage-1')).toBeVisible();
  await expect(page.locator('#stage-2')).toBeHidden();
}

async function completeStageOne(page, { activity = 'Installation', date = '30-09-2026', site = 'The CRM Carpenters Test' } = {}) {
  await page.locator('#input_1_11').selectOption(activity);
  await page.locator('#input_1_12').fill(date);
  await page.locator('#site-search').fill(site);
  await page.getByRole('option').filter({ hasText: site }).first().click();
  await page.locator('#choice_1_63_1').check();
}

async function completeAccessDetails(page) {
  const values = {
    '#input_1_58': 'Synthetic Carrier Pty Ltd',
    '#input_1_18': 'LAN-PROTOTYPE-001',
    '#input_1_19': 'Synthetic Tenant Pty Ltd',
    '#input_1_83': 'Synthetic Contact',
    '#input_1_87': '0400000000',
    '#input_1_22': 'Level 1, Test Area',
    '#input_1_64': 'Synthetic test access area',
  };
  for (const [selector, value] of Object.entries(values)) await page.locator(selector).fill(value);
}

test('keeps the original request-context flow while improving Site search', async ({ page }) => {
  await openPrototype(page);
  await page.locator('#site-search').fill('Carpenters');
  await expect(page.locator('#site-results')).toContainText('The CRM Carpenters Test');
  await page.getByRole('option').filter({ hasText: 'The CRM Carpenters Test' }).click();
  await expect(page.locator('#selected-site')).toContainText('Canonical Site ID');
});

test('rejects an impossible date inline without leaving Stage 1', async ({ page }) => {
  await openPrototype(page);
  await completeStageOne(page, { date: '32-13-2026' });
  await page.locator('#next-stage').click();
  await expect(page.locator('#stage-one-errors')).toContainText('valid date');
  await expect(page.locator('#stage-1')).toBeVisible();
  await expect(page.locator('#stage-2')).toBeHidden();
  await expect(page.locator('#input_1_11')).toHaveValue('Installation');
});

test('preserves request context and shows a Stage 2 summary', async ({ page }) => {
  await openPrototype(page);
  await completeStageOne(page);
  await page.locator('#next-stage').click();
  await expect(page.locator('#stage-2')).toBeVisible();
  await expect(page.locator('#request-context-summary')).toContainText('The CRM Carpenters Test');
  await expect(page.locator('#request-context-summary')).toContainText('30-09-2026');
  await page.locator('#edit-context').click();
  await expect(page.locator('#stage-1')).toBeVisible();
  await expect(page.locator('#input_1_12')).toHaveValue('30-09-2026');
});

test('preserves values when activity changes and exposes Maintenance confirmation', async ({ page }) => {
  await openPrototype(page);
  await completeStageOne(page, { activity: 'Installation' });
  await page.locator('#next-stage').click();
  await page.locator('#input_1_58').fill('Synthetic Carrier Pty Ltd');
  await page.locator('#edit-context').click();
  await page.locator('#input_1_11').selectOption('Maintenance');
  await page.locator('#next-stage').click();
  await expect(page.locator('#maintenance-confirmation')).toBeVisible();
  await expect(page.locator('#input_1_58')).toHaveValue('Synthetic Carrier Pty Ltd');
});

test('synchronizes required upload and confirmation state', async ({ page }) => {
  await openPrototype(page);
  await completeStageOne(page);
  await page.locator('#next-stage').click();
  await completeAccessDetails(page);
  await page.locator('#input_1_49').setInputFiles({ name: 'synthetic-laan.pdf', mimeType: 'application/pdf', buffer: Buffer.from('prototype') });
  await page.locator('#input_1_29_1').check();
  await expect(page.locator('#laan-file-status')).toContainText('synthetic-laan.pdf');
  await page.locator('#input_1_49').setInputFiles([]);
  await expect(page.locator('#input_1_29_1')).not.toBeChecked();
});

test('reaches a disabled ready-to-submit boundary after review checks', async ({ page }) => {
  await openPrototype(page);
  await completeStageOne(page);
  await page.locator('#next-stage').click();
  await completeAccessDetails(page);
  await page.locator('#input_1_49').setInputFiles({ name: 'synthetic-laan.pdf', mimeType: 'application/pdf', buffer: Buffer.from('prototype') });
  await page.locator('#input_1_29_1').check();
  await page.locator('#input_1_45_1').check();
  await expect(page.locator('#final-submit')).toBeDisabled();
  await expect(page.locator('#readiness-status')).toContainText(/ready to submit/i);
});

test('supports phone and tablet layouts without horizontal overflow', async ({ page }) => {
  for (const viewport of [{ width: 390, height: 844 }, { width: 768, height: 1024 }]) {
    await page.setViewportSize(viewport);
    await openPrototype(page);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  }
});
