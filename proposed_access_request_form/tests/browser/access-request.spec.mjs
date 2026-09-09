import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.route('https://cdn.jsdelivr.net/**', (route) => route.abort());
    await page.goto('/', { waitUntil: 'domcontentloaded' });
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
    await page.getByRole('button', { name: /Stage 5/ }).click();
    await expect(page.getByLabel('Nature of works')).toHaveValue('maintenance');
    await expect(page.getByLabel('Network access permit type')).toHaveValue('standard');
});

test('PA-X02 linked LAAN demonstration preserves a conflicting selected Site', async ({ page }) => {
    const search = page.getByLabel('Search Site by name or address');
    await search.fill('collins');
    await search.press('ArrowDown');
    await search.press('Enter');
    const reviewer = page.getByText('Reviewer demonstrations');
    await reviewer.click();
    await page.getByRole('button', { name: 'Apply linked LAAN context' }).click();

    await expect(page.getByTestId('selected-site')).toContainText('Collins Exchange');
    await expect(page.getByRole('status')).toContainText('preserved');
});

test('malformed URL encoding returns 400 and leaves the local server healthy', async ({ request }) => {
    const malformed = await request.get('/%');
    expect(malformed.status()).toBe(400);
    expect((await request.get('/')).status()).toBe(200);
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

test('PA-D01/D02 saved certificate demonstration blocks expired evidence', async ({ page }) => {
    await page.getByRole('button', { name: 'Load complete scenario' }).click();
    await page.getByRole('button', { name: /Stage 7/ }).click();
    await page.getByText('Reviewer demonstrations').click();
    await page.getByRole('button', { name: 'Use expired saved certificate' }).click();

    await expect(page.getByTestId('document-liability')).toContainText('saved-liability-expired.pdf');
    await expect(page.getByTestId('document-liability')).toContainText('Example Billing Pty Ltd');
    await expect(page.getByTestId('document-liability')).toContainText('Fictional Document Library');
    await expect(page.getByTestId('document-liability')).toContainText('expired and cannot satisfy readiness');
    await page.getByRole('button', { name: 'Continue to Review & declarations' }).click();
    await expect(page.getByRole('alert')).toContainText('Public Liability');

    await page.getByText('Reviewer demonstrations').click();
    await page.getByRole('button', { name: 'Use current saved certificate' }).click();
    await expect(page.getByTestId('document-liability')).toContainText('saved-liability-current.pdf');
    await expect(page.getByLabel('I reviewed this selected file').last()).toBeVisible();
});

test('PA-A03 phone layout has no horizontal document overflow', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
    const summaryButton = page.getByRole('button', { name: 'Show request summary' });
    await expect(summaryButton).toBeVisible();
    expect((await summaryButton.boundingBox()).height).toBeGreaterThanOrEqual(44);
    expect((await page.getByRole('button', { name: 'Reset' }).boundingBox()).height).toBeGreaterThanOrEqual(44);
});

for (const width of [320, 768, 1024]) {
    test(`PA-A03-A05 reflows without horizontal overflow at ${width}px`, async ({ page }) => {
        await page.setViewportSize({ width, height: 800 });
        await page.reload();
        expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
    });
}

test('PA-A04 keeps the form, workspace and stage navigation usable at tablet width', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 900 });
    await page.reload();
    await expect(page.locator('.form-column')).toBeVisible();
    await expect(page.locator('.workspace')).toBeVisible();
    await page.getByRole('button', { name: 'Load complete scenario' }).click();
    await expect(page.getByRole('heading', { name: 'Review & declarations' })).toBeVisible();
});

test('PA-A05 supports 200 percent zoom-equivalent, text spacing and user media preferences', async ({ page }) => {
    await page.setViewportSize({ width: 640, height: 450 });
    await page.reload();
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
    await expect(page.getByRole('button', { name: 'Show request summary' })).toBeVisible();

    await page.setViewportSize({ width: 320, height: 800 });
    await page.locator('body').evaluate((body) => {
        body.style.lineHeight = '1.5';
        body.style.letterSpacing = '.12em';
        body.style.wordSpacing = '.16em';
    });
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
    await page.emulateMedia({ reducedMotion: 'reduce', forcedColors: 'active' });
    await expect(page.getByRole('heading', { name: 'Request context' })).toBeVisible();
});
