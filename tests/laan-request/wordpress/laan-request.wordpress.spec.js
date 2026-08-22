import { expect, test } from '@playwright/test';

const route = process.env.WP_LAAN_PATH ?? '/sitexcell-laan-request-prototype/';

async function openLaanPrototype(page) {
  await page.goto(route, { waitUntil: 'domcontentloaded' });
  await expect(page.getByTestId('activity-select')).toBeVisible();
}

async function completeContext(page, date = '30-09-2026') {
  await page.getByTestId('activity-select').selectOption('Installation');
  await page.getByTestId('commencement-date').fill(date);
  await page.getByTestId('site-search').fill('Carpenters');
  await page.getByRole('option').filter({ hasText: 'The CRM Carpenters Test' }).click();
  await page.getByTestId('terms-checkbox').check();
}

test('rejects an impossible commencement date without leaving Stage 1', async ({ page }) => {
  await openLaanPrototype(page);
  await completeContext(page, '32-13-2026');
  await page.getByTestId('next-stage').click();

  await expect(page.getByTestId('stage-one-errors')).toContainText('real date');
  await expect(page.locator('[data-laan-stage="1"]')).toBeVisible();
  await expect(page.locator('[data-laan-stage="2"]')).toBeHidden();
});

test('preserves request context in the Stage 2 summary', async ({ page }) => {
  await openLaanPrototype(page);
  await completeContext(page);
  await page.getByTestId('next-stage').click();

  await expect(page.getByTestId('request-context-summary')).toContainText('The CRM Carpenters Test');
  await expect(page.getByTestId('request-context-summary')).toContainText('30-09-2026');
  await page.getByTestId('edit-context').click();
  await expect(page.getByTestId('commencement-date')).toHaveValue('30-09-2026');
});

test('keeps final submission disabled at the prototype boundary', async ({ page }) => {
  await openLaanPrototype(page);
  await completeContext(page);
  await page.getByTestId('next-stage').click();

  await expect(page.getByTestId('final-submit')).toBeDisabled();
});
