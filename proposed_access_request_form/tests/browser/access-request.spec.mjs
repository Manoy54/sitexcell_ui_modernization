import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => sessionStorage.clear());
    await page.reload();
});

test('PA-001 opens the isolated eight-stage Access Request at Request context', async ({ page }) => {
    await expect(page).toHaveTitle(/Access Request Prototype/);
    await expect(page.getByRole('heading', { name: 'Request context' })).toBeVisible();
    await expect(page.getByText('Prototype only — no request will be submitted.')).toBeVisible();
    await expect(page.getByRole('button', { name: /Stage 8/ })).toBeVisible();
});

test('PA-004 validation identifies the correction and preserves unrelated values', async ({ page }) => {
    await page.getByLabel('Owner name (optional)').fill('Fictional Property Group');
    await page.getByRole('button', { name: 'Continue to Site requirements' }).click();

    await expect(page.getByRole('alert')).toContainText('Choose a Site');
    await expect(page.getByLabel('Owner name (optional)')).toHaveValue('Fictional Property Group');
    await expect(page.getByLabel('Search Site by name or address')).toBeFocused();
});

test('PA-S01-S03 Site search supports keyboard selection and canonical identity', async ({ page }) => {
    const search = page.getByLabel('Search Site by name or address');
    await search.fill('southbank');
    await search.press('ArrowDown');
    await search.press('Enter');

    await expect(page.getByTestId('selected-site')).toContainText('Southbank Exchange');
    await expect(page.getByTestId('selected-site')).toContainText('SITE-1001');
});

test('PA-005/006 complete scenario reaches review and cannot submit', async ({ page }) => {
    await page.getByRole('button', { name: 'Load complete scenario' }).click();

    await expect(page.getByRole('heading', { name: 'Review & declarations' })).toBeVisible();
    await expect(page.getByText('Ready for prototype review', { exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Submit access request' })).toBeDisabled();
    await expect(page.locator('.review-section').first().getByText('Southbank Exchange', { exact: true })).toBeVisible();
});

test('PA-U04 invalid replacement preserves the previous file and another document', async ({ page }) => {
    await page.getByRole('button', { name: 'Load complete scenario' }).click();
    await page.getByRole('button', { name: /Stage 5/ }).click();

    await expect(page.getByTestId('document-authority')).toContainText('authority-demo.pdf');
    await page.getByLabel('Choose Letter of Authority file').setInputFiles({
        name: 'too-large.pdf',
        mimeType: 'application/pdf',
        buffer: Buffer.alloc(10_000_001),
    });

    await expect(page.getByTestId('document-authority')).toContainText('authority-demo.pdf');
    await expect(page.getByTestId('document-authority')).toContainText('10 MB or smaller');
    await page.getByRole('button', { name: /Stage 7/ }).click();
    await expect(page.getByTestId('document-workersComp')).toContainText('workers-comp-demo.pdf');
});

test('PA-A03 phone layout has no horizontal document overflow', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
    await expect(page.getByRole('button', { name: 'Show request summary' })).toBeVisible();
});
