import { expect, test } from '@playwright/test';
import path from 'node:path';

const validFile = path.resolve('tests/access-requests/fixtures/synthetic-access-document.pdf');

async function chooseActivity(page, label = 'Installation') {
  await page.locator('#input_1_11').click();
  await page.getByRole('option', { name: label, exact: true }).click();
}

async function chooseSite(page, query = 'CRM') {
  const site = page.locator('#input_1_41');
  await site.fill(query);
  await page.locator('.site-result').first().click();
}

async function completeStageOne(page) {
  await chooseActivity(page);
  await page.locator('#input_1_12').fill('30-09-2026');
  await chooseSite(page);
  await page.locator('input[name="termsAccepted"]').check();
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(page.locator('.form-wrap.is-stage-two')).toBeVisible();
}

async function completeStageTwo(page) {
  const values = {
    carrier: 'Synthetic Carrier',
    projectReference: 'SIM-20260902-001',
    tenantCompany: 'Synthetic Tenant',
    contactName: 'Synthetic Tester',
    contactPhone: '0400000099',
    workLocation: 'Synthetic work location',
    affectedAreas: 'Synthetic affected area',
  };
  for (const [name, value] of Object.entries(values)) {
    await page.locator(`[name="${name}"]`).fill(value);
  }
  await page.locator('#required-file-input').setInputFiles(validFile);
  await expect(page.getByText('Uploaded', { exact: false }).first()).toBeVisible();
  await page.locator('input[name="siteDetailsReviewed"]').check();
  await page.locator('input[name="uploadReviewed"]').check();
  await page.locator('input[name="workDetailsReviewed"]').check();
  await page.locator('input[name="accuracyAccepted"]').check();
}

test.beforeEach(async ({ page }) => {
  await page.goto('/?simulation=1');
  await page.evaluate(() => sessionStorage.clear());
  await page.reload();
  await expect(page.locator('#laan-prototype-form')).toBeVisible();
});

test('blocks incomplete Stage 1 with field-specific errors', async ({ page }) => {
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(page.locator('[data-error-summary]')).toBeVisible();
  await expect(page.locator('#activity-error')).toHaveText(/Select the activity/);
  await expect(page.locator('#commencementDate-error')).toHaveText(/Enter the proposed/);
  await expect(page.locator('#siteId-error')).toHaveText(/canonical Site/);
  await expect(page.locator('#termsAccepted-error')).toHaveText(/Accept the Terms/);
});

test('reaches the simulated ready state without an external submission', async ({ page }) => {
  const requests = [];
  page.on('request', (request) => requests.push(request));
  await completeStageOne(page);
  await completeStageTwo(page);
  await page.getByRole('button', { name: 'Submit', exact: true }).click();
  await expect(page.getByText('Prototype ready for submission', { exact: true })).toBeVisible();
  expect(requests.filter((request) => request.method() === 'POST')).toEqual([]);
});

test('preserves Stage 2 values when navigating back and resets only affected confirmation state', async ({ page }) => {
  await completeStageOne(page);
  await page.locator('[name="carrier"]').fill('Carrier that must persist');
  await page.locator('input[name="siteDetailsReviewed"]').check();
  await page.locator('input[name="workDetailsReviewed"]').check();
  await page.locator('[data-action="go-stage-one"]').first().click();
  await expect(page.locator('#input_1_11')).toBeVisible();
  await page.locator('#input_1_11').click();
  await page.getByRole('option', { name: 'Inspection', exact: true }).click();
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(page.locator('[name="carrier"]')).toHaveValue('Carrier that must persist');
  await expect(page.locator('input[name="siteDetailsReviewed"]')).toBeChecked();
  await expect(page.locator('input[name="workDetailsReviewed"]')).not.toBeChecked();
});

test('saves, restores, and discards an explicit draft', async ({ page }) => {
  await chooseActivity(page);
  await page.locator('#input_1_12').fill('30-09-2026');
  await page.locator('[data-action="save-draft"]').click();
  await expect(page.getByText('Draft saved in this prototype session.', { exact: true })).toBeVisible();
  await page.evaluate(() => sessionStorage.removeItem('proposed-laan-form-session-v1'));
  await page.reload();
  await page.locator('[data-action="restore-draft"]').click();
  await expect(page.locator('#input_1_12')).toHaveValue('30-09-2026');
  await expect(page.getByText('Draft restored.', { exact: true })).toBeVisible();
  await page.locator('[data-action="discard-draft"]').click();
  await expect(page.getByText('Saved draft discarded.', { exact: true })).toBeVisible();
  await expect(page.locator('[data-action="restore-draft"]')).toBeDisabled();
});

test('rejects impossible dates inline and recovers on correction', async ({ page }) => {
  await chooseActivity(page);
  await page.locator('#input_1_12').fill('32-13-2026');
  await chooseSite(page);
  await page.locator('input[name="termsAccepted"]').check();
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(page.locator('#commencementDate-error')).toHaveText(/real date/);
  await page.locator('#input_1_12').fill('30-09-2026');
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(page.locator('.form-wrap.is-stage-two')).toBeVisible();
});

test('searches and selects a canonical Site with keyboard input', async ({ page }) => {
  const site = page.locator('#input_1_41');
  await site.fill('CRM');
  await expect(page.locator('.site-result')).not.toHaveCount(0);
  await site.press('Enter');
  await expect(site).toHaveValue(/CRM/);
  await expect(page.locator('.site-result')).toHaveCount(0);
});

test('invalidates confirmation for an invalid, oversized, replaced, or removed upload', async ({ page }) => {
  await completeStageOne(page);
  const upload = page.locator('#required-file-input');
  await upload.setInputFiles({ name: 'bad.txt', mimeType: 'text/plain', buffer: Buffer.from('bad') });
  await expect(page.getByText('Unsupported file type', { exact: false })).toBeVisible();
  await upload.setInputFiles({ name: 'large.pdf', mimeType: 'application/pdf', buffer: Buffer.alloc(21 * 1024 * 1024) });
  await expect(page.getByText('larger than', { exact: false })).toBeVisible();
  await upload.setInputFiles(validFile);
  await expect(page.getByText('Uploaded', { exact: false }).first()).toBeVisible();
  await page.locator('input[name="uploadReviewed"]').check();
  await page.locator('[data-action="remove-file"][data-upload-kind="required"]').click();
  await expect(page.locator('input[name="uploadReviewed"]')).not.toBeChecked();
  await expect(page.locator('#required-file-input')).toHaveCount(1);
});

test('supports a simulated upload retry and keeps Submit disabled until every confirmation is complete', async ({ page }) => {
  await completeStageOne(page);
  await expect(page.getByRole('button', { name: 'Submit', exact: true })).toBeDisabled();
  const upload = page.locator('#required-file-input');
  await upload.setInputFiles({ name: 'interrupted.txt', mimeType: 'text/plain', buffer: Buffer.from('interrupted') });
  await expect(page.getByText('Unsupported file type', { exact: false })).toBeVisible();
  await upload.setInputFiles(validFile);
  await expect(page.getByText('Uploaded', { exact: false }).first()).toBeVisible();
  await page.locator('input[name="siteDetailsReviewed"]').check();
  await page.locator('input[name="uploadReviewed"]').check();
  await page.locator('input[name="workDetailsReviewed"]').check();
  await page.locator('input[name="accuracyAccepted"]').check();
  for (const [name, value] of Object.entries({
    carrier: 'Synthetic Carrier', projectReference: 'SIM-20260902-002', tenantCompany: 'Synthetic Tenant',
    contactName: 'Synthetic Tester', contactPhone: '0400000099', workLocation: 'Synthetic location',
    affectedAreas: 'Synthetic area',
  })) await page.locator(`[name="${name}"]`).fill(value);
  await expect(page.getByRole('button', { name: 'Submit', exact: true })).toBeEnabled();
});

test('keeps the simulation usable at a phone viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  expect(overflow).toBe(false);
  await expect(page.locator('#input_1_41')).toBeVisible();
});
