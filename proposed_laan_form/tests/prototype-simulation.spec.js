import { expect, test } from '@playwright/test';
import path from 'node:path';

const validFile = path.resolve('tests/access-requests/fixtures/synthetic-access-document.pdf');
const stageTwoValues = {
  carrier: 'Synthetic Carrier',
  projectReference: 'SIM-20260902-001',
  tenantCompany: 'Synthetic Tenant',
  contactName: 'Synthetic Tester',
  contactPhone: '0400000099',
  workLocation: 'Synthetic work location',
  affectedAreas: 'Synthetic affected area',
};

async function chooseActivity(page, label = 'Installation') {
  await page.getByTestId('activity-control').click();
  await page.getByRole('option', { name: label, exact: true }).click();
}

async function chooseSite(page, query = 'CRM') {
  const site = page.getByTestId('site-search');
  await site.fill(query);
  await page.getByTestId('site-result').first().click();
}

async function completeStageOne(page) {
  await chooseActivity(page);
  await page.getByTestId('commencement-date').fill('30-09-2026');
  await chooseSite(page);
  await page.getByTestId('terms-confirmation').check();
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(page.getByTestId('stage-two')).toBeVisible();
  await expect(page.getByRole('complementary', { name: 'Request workspace' })).toBeVisible();
}

async function completeStageTwo(page) {
  for (const [name, value] of Object.entries(stageTwoValues)) {
    await page.getByTestId(`${name}-field`).fill(value);
  }
  await page.getByTestId('required-upload').setInputFiles(validFile);
  await expect(page.getByText('Uploaded', { exact: false }).first()).toBeVisible();
  await page.getByTestId('site-details-reviewed').check();
  await page.getByTestId('upload-reviewed').check();
  await page.getByTestId('work-details-reviewed').check();
  await page.getByTestId('accuracy-accepted').check();
}

test.beforeEach(async ({ page }) => {
  await page.goto('/?simulation=1');
  await page.evaluate(() => sessionStorage.clear());
  await page.reload();
  await expect(page.getByTestId('laan-form')).toBeVisible();
});

test('blocks incomplete Stage 1 with field-specific errors', async ({ page }) => {
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(page.getByRole('alert')).toBeVisible();
  await expect(page.getByTestId('activity-error')).toHaveText(/Select the activity/);
  await expect(page.getByTestId('commencementDate-error')).toHaveText(/Enter the proposed/);
  await expect(page.getByTestId('siteId-error')).toHaveText(/canonical Site/);
  await expect(page.getByTestId('termsAccepted-error')).toHaveText(/Accept the Terms/);
});

test('reaches the simulated ready state without an external submission', async ({ page }) => {
  const requests = [];
  page.on('request', (request) => requests.push(request));
  await completeStageOne(page);
  await completeStageTwo(page);
  await expect(page.getByTestId('readiness-panel')).toContainText('Request details are ready for review');
  await page.getByTestId('stage-two-submit').click();
  await expect(page.getByText('Prototype ready for submission', { exact: true })).toBeVisible();
  expect(requests.filter((request) => request.method() === 'POST')).toEqual([]);
});

test('preserves Stage 2 values when navigating back and resets only affected confirmation state', async ({ page }) => {
  await completeStageOne(page);
  await page.getByTestId('carrier-field').fill('Carrier that must persist');
  await page.getByTestId('site-details-reviewed').check();
  await page.getByTestId('work-details-reviewed').check();
  await page.getByTestId('stage-two-back').click();
  await expect(page.getByTestId('activity-control')).toBeVisible();
  await page.getByTestId('activity-control').click();
  await page.getByRole('option', { name: 'Inspection', exact: true }).click();
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(page.getByTestId('carrier-field')).toHaveValue('Carrier that must persist');
  await expect(page.getByTestId('site-details-reviewed')).toBeChecked();
  await expect(page.getByTestId('work-details-reviewed')).not.toBeChecked();
});

test('saves, restores, and discards an explicit draft', async ({ page }) => {
  await chooseActivity(page);
  await page.getByTestId('commencement-date').fill('30-09-2026');
  await page.getByTestId('save-draft').click();
  await expect(page.getByText('Draft saved in this prototype session.', { exact: true })).toBeVisible();
  await page.evaluate(() => sessionStorage.removeItem('proposed-laan-form-session-v1'));
  await page.reload();
  await page.getByTestId('restore-draft').click();
  await expect(page.getByTestId('commencement-date')).toHaveValue('30-09-2026');
  await expect(page.getByText('Draft restored.', { exact: true })).toBeVisible();
  await page.getByTestId('discard-draft').click();
  await expect(page.getByText('Saved draft discarded.', { exact: true })).toBeVisible();
  await expect(page.getByTestId('restore-draft')).toBeDisabled();
});

test('rejects impossible dates inline and recovers on correction', async ({ page }) => {
  await chooseActivity(page);
  await page.getByTestId('commencement-date').fill('32-13-2026');
  await chooseSite(page);
  await page.getByTestId('terms-confirmation').check();
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(page.getByTestId('commencementDate-error')).toHaveText(/real date/);
  await page.getByTestId('commencement-date').fill('30-09-2026');
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(page.getByTestId('stage-two')).toBeVisible();
});

test('searches and selects a canonical Site with keyboard input', async ({ page }) => {
  const site = page.getByTestId('site-search');
  await site.fill('CRM');
  await expect(page.getByTestId('site-result')).not.toHaveCount(0);
  await site.press('Enter');
  await expect(site).toHaveValue(/CRM/);
  await expect(page.getByTestId('site-result')).toHaveCount(0);
});

test('invalidates confirmation for an invalid, oversized, replaced, or removed upload', async ({ page }) => {
  await completeStageOne(page);
  const upload = page.getByTestId('required-upload');
  await upload.setInputFiles({ name: 'bad.txt', mimeType: 'text/plain', buffer: Buffer.from('bad') });
  await expect(page.getByTestId('stage-two').getByText('Unsupported file type', { exact: false })).toBeVisible();
  await upload.setInputFiles({ name: 'large.pdf', mimeType: 'application/pdf', buffer: Buffer.alloc(21 * 1024 * 1024) });
  await expect(page.getByTestId('stage-two').getByText('larger than', { exact: false })).toBeVisible();
  await upload.setInputFiles(validFile);
  await expect(page.getByTestId('stage-two').getByText('Uploaded', { exact: false }).first()).toBeVisible();
  await page.getByTestId('upload-reviewed').check();
  await page.getByTestId('required-remove-0').click();
  await expect(page.getByTestId('upload-reviewed')).not.toBeChecked();
  await expect(page.getByTestId('required-upload')).toHaveCount(1);
});

test('supports a simulated upload retry and keeps Submit disabled until every confirmation is complete', async ({ page }) => {
  await completeStageOne(page);
  await expect(page.getByTestId('stage-two-submit')).toBeDisabled();
  const upload = page.getByTestId('required-upload');
  await upload.setInputFiles({ name: 'interrupted.txt', mimeType: 'text/plain', buffer: Buffer.from('interrupted') });
  await expect(page.getByTestId('stage-two').getByText('Unsupported file type', { exact: false })).toBeVisible();
  await upload.setInputFiles(validFile);
  await expect(page.getByTestId('stage-two').getByText('Uploaded', { exact: false }).first()).toBeVisible();
  await page.getByTestId('site-details-reviewed').check();
  await page.getByTestId('upload-reviewed').check();
  await page.getByTestId('work-details-reviewed').check();
  await page.getByTestId('accuracy-accepted').check();
  for (const [name, value] of Object.entries({ ...stageTwoValues, projectReference: 'SIM-20260902-002', workLocation: 'Synthetic location', affectedAreas: 'Synthetic area' })) {
    await page.getByTestId(`${name}-field`).fill(value);
  }
  await expect(page.getByTestId('stage-two-submit')).toBeEnabled();
});

test('preserves multiple optional supporting documents', async ({ page }) => {
  await completeStageOne(page);
  await page.getByTestId('additional-upload').setInputFiles([
    { name: 'drawing-a.pdf', mimeType: 'application/pdf', buffer: Buffer.from('a') },
    { name: 'drawing-b.png', mimeType: 'image/png', buffer: Buffer.from('b') },
  ]);
  await expect(page.getByTestId('stage-two').getByText('drawing-a.pdf', { exact: false })).toBeVisible();
  await expect(page.getByTestId('stage-two').getByText('drawing-b.png', { exact: false })).toBeVisible();
  await expect(page.getByTestId('additional-remove-0')).toBeVisible();
  await expect(page.getByTestId('additional-remove-1')).toBeVisible();
});

test('enforces configured commencement-date boundaries while accepting exact limits', async ({ page }) => {
  await page.goto('/?simulation=1&minDate=01-01-2026&maxDate=31-12-2027');
  await page.evaluate(() => sessionStorage.clear());
  await page.reload();
  await chooseActivity(page);
  await page.getByTestId('commencement-date').fill('01-01-2026');
  await chooseSite(page);
  await page.getByTestId('terms-confirmation').check();
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(page.getByTestId('stage-two')).toBeVisible();
  await page.getByTestId('stage-two-back').click();
  await page.getByTestId('commencement-date').fill('31-12-2028');
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(page.getByTestId('commencementDate-error')).toHaveText(/on or before 31-12-2027/);
});

test('renders every Stage 2 prototype layout with the same semantic controls', async ({ page }) => {
  for (const variant of ['A', 'B', 'C']) {
    await page.goto(`/?simulation=1&variant=${variant}`);
    await page.evaluate(() => sessionStorage.clear());
    await page.reload();
    await completeStageOne(page);
    await expect(page.getByTestId('stage-two')).toBeVisible();
    await expect(page.getByTestId('stage-two-submit')).toBeDisabled();
    await expect(page.getByRole('complementary', { name: 'Request workspace' })).toBeVisible();
  }
});

test('keeps the simulation usable at a phone viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  expect(overflow).toBe(false);
  await expect(page.getByTestId('site-search')).toBeVisible();
});
