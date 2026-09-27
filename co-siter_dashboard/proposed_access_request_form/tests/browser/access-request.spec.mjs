import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.route('https://cdn.jsdelivr.net/**', (route) => route.abort());
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => sessionStorage.clear());
    await page.reload();
});

test('PA-001 opens the isolated eight-stage Access Request at Request context', async ({ page }) => {
    await expect(page).toHaveTitle(/Access Request · Co-Siter/);
    await expect(page.getByRole('heading', { name: 'Request context' })).toBeVisible();
    await expect(page.locator('.prototype-banner')).toHaveCount(0);
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

test('PA-S04 owner and Site comboboxes expose the complete captured option map', async ({ page }) => {
    const owner = page.getByLabel('Owner name (optional)');
    await owner.fill('Woolworth Group');
    await expect(page.getByRole('option', { name: /Woolworth Group/ })).toBeVisible();
    await page.getByRole('option', { name: /Woolworth Group/ }).click();
    await expect(owner).toHaveValue('Woolworth Group');

    const site = page.getByLabel('Search Site by name or address');
    await site.fill('Workplace6');
    await expect(page.getByRole('option', { name: /Workplace6/ })).toBeVisible();
    await page.getByRole('option', { name: /Workplace6/ }).click();
    await expect(page.getByTestId('selected-site')).toContainText('Workplace6');
});

test('dropdown panels float above the form without shifting the field grid', async ({ page }) => {
    const siteTopBefore = await page.locator('[data-site-query]').evaluate((site) => site.getBoundingClientRect().top + window.scrollY);
    await page.getByRole('button', { name: 'Show Owner options' }).click();
    await expect(page.locator('#owner-options')).toBeVisible();

    const geometry = await page.evaluate(() => ({
        anchorLeft: document.querySelector('[data-owner-query]')?.getBoundingClientRect().left ?? 0,
        anchorWidth: document.querySelector('[data-owner-query]')?.getBoundingClientRect().width ?? 0,
        optionsLeft: document.querySelector('#owner-options')?.getBoundingClientRect().left ?? 0,
        optionsWidth: document.querySelector('#owner-options')?.getBoundingClientRect().width ?? 0,
        position: getComputedStyle(document.querySelector('#owner-options')).position,
        siteTop: (document.querySelector('[data-site-query]')?.getBoundingClientRect().top ?? 0) + window.scrollY,
    }));

    expect(geometry.position).toBe('fixed');
    expect(Math.abs(geometry.siteTop - siteTopBefore)).toBeLessThanOrEqual(1);
    expect(Math.abs(geometry.optionsLeft - geometry.anchorLeft)).toBeLessThanOrEqual(1);
    expect(Math.abs(geometry.optionsWidth - geometry.anchorWidth)).toBeLessThanOrEqual(1);
});

test('linked LAAN uses the same animated combobox interaction', async ({ page }) => {
    const linkedLaan = page.getByRole('combobox', { name: 'Linked LAAN request (optional)' });
    await linkedLaan.click();

    await expect(page.locator('#linkedLaan-options')).toBeVisible();
    await expect(page.locator('#linkedLaan-options')).toHaveCSS('animation-name', 'combobox-options-enter');
    await linkedLaan.press('ArrowDown');
    await linkedLaan.press('Enter');

    await expect(linkedLaan).toContainText('LAAN-204 · Southbank Exchange');
    await expect(page.locator('#linkedLaan-options')).toHaveCount(0);
});

test('restores an existing linked LAAN selection with the current label', async ({ page }) => {
    await page.getByRole('button', { name: 'Load complete scenario' }).click();
    await page.evaluate(() => {
        const key = 'sitexcell-access-request-prototype-v1';
        const saved = JSON.parse(sessionStorage.getItem(key));
        saved.fields.linkedLaan = 'LAAN-DEMO-204';
        sessionStorage.setItem(key, JSON.stringify(saved));
    });
    await page.reload();
    await page.getByRole('button', { name: /Stage 1/ }).click();
    await expect(page.getByRole('combobox', { name: 'Linked LAAN request (optional)' })).toContainText('LAAN-204 · Southbank Exchange');
});

test('PA-005/006 complete scenario reaches review and cannot submit', async ({ page }) => {
    await page.getByRole('button', { name: 'Load complete scenario' }).click();

    await expect(page.getByRole('heading', { name: 'Review & declarations' })).toBeVisible();
    await expect(page.getByText('Ready for review', { exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Submit access request' })).toBeDisabled();
    await expect(page.locator('.review-section[open]')).toHaveCount(0);
    await page.locator('.review-section').first().locator('summary').click();
    await expect(page.locator('.review-section').first().getByText('Southbank Exchange', { exact: true })).toBeVisible();
    await page.getByRole('button', { name: /Stage 5/ }).click();
    await expect(page.getByLabel('Nature of works')).toHaveValue('maintenance');
    await expect(page.getByLabel('Network access permit type')).toHaveValue('standard');
});

test('completed navigation can return to review and resets the form scroll position', async ({ page }) => {
    await page.getByRole('button', { name: 'Load complete scenario' }).click();
    await page.getByRole('button', { name: /Stage 7/ }).click();
    await page.locator('.form-column').evaluate((column) => column.scrollTo(0, 900));
    await page.getByRole('button', { name: /Stage 3/ }).click();

    await expect(page.locator('.form-column')).toHaveJSProperty('scrollTop', 0);
    const reviewStage = page.getByRole('button', { name: /Stage 8/ });
    await expect(reviewStage).toBeEnabled();
    await reviewStage.click();
    await expect(page.getByRole('heading', { name: 'Review & declarations' })).toBeVisible();
});

test('PA-X02 linked LAAN demonstration preserves a conflicting selected Site', async ({ page }) => {
    const search = page.getByLabel('Search Site by name or address');
    await search.fill('collins');
    await search.press('ArrowDown');
    await search.press('Enter');
    const reviewer = page.getByText('Review tools');
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

    await expect(page.getByTestId('document-authority')).toContainText('authority.pdf');
    await page.getByLabel('Choose Letter of Authority file').setInputFiles({
        name: 'too-large.pdf',
        mimeType: 'application/pdf',
        buffer: Buffer.alloc(10_000_001),
    });

    await expect(page.getByTestId('document-authority')).toContainText('authority.pdf');
    await expect(page.getByTestId('document-authority')).toContainText('10 MB or smaller');
    await page.getByRole('button', { name: /Stage 7/ }).click();
    await expect(page.getByTestId('document-workersComp')).toContainText('workers-comp.pdf');
});

test('PA-NOTES qualification upload list separates valid and invalid files', async ({ page }) => {
    await page.getByRole('button', { name: 'Load complete scenario' }).click();
    await page.getByRole('button', { name: /Stage 4/ }).click();
    await page.getByLabel('Choose Qualifications & training file').setInputFiles([
        { name: 'valid-training.pdf', mimeType: 'application/pdf', buffer: Buffer.alloc(100_000) },
        { name: 'drivers-licence.jpg', mimeType: 'image/jpeg', buffer: Buffer.alloc(100_000) },
    ]);

    await expect(page.getByTestId('document-qualification')).toContainText('valid-training.pdf');
    await expect(page.getByTestId('document-qualification')).toContainText('drivers-licence.jpg');
    await expect(page.getByTestId('document-qualification')).toContainText('Driver licence-related files are not permitted');
    await expect(page.getByTestId('document-qualification').getByRole('button', { name: 'Remove drivers-licence.jpg' })).toBeVisible();

    await page.getByLabel('Choose Qualifications & training file').setInputFiles([]);
    await expect(page.locator('[aria-live="polite"]')).toContainText('File selection canceled');
    await expect(page.getByTestId('document-qualification')).toContainText('valid-training.pdf');
});

test('PA-NOTES reload keeps qualification filenames visible and asks for reselection', async ({ page }) => {
    await page.getByRole('button', { name: 'Load complete scenario' }).click();
    await page.getByRole('button', { name: /Stage 4/ }).click();
    await page.getByLabel('Choose Qualifications & training file').setInputFiles({
        name: 'reload-training.pdf',
        mimeType: 'application/pdf',
        buffer: Buffer.alloc(100_000),
    });
    await page.reload();

    await expect(page.getByTestId('document-qualification')).toContainText('reload-training.pdf');
    await expect(page.getByTestId('document-qualification')).toContainText('Reselect this file after reload');
    await expect(page.getByLabel('Choose Qualifications & training file')).toHaveAttribute('aria-invalid', 'true');
});

test('PA-D01/D02 saved certificate demonstration blocks expired evidence', async ({ page }) => {
    await page.getByRole('button', { name: 'Load complete scenario' }).click();
    await page.getByRole('button', { name: /Stage 7/ }).click();
    await page.getByText('Review tools').click();
    await page.getByRole('button', { name: 'Use expired saved certificate' }).click();

    await expect(page.getByTestId('document-liability')).toContainText('saved-liability-expired.pdf');
    await expect(page.getByTestId('document-liability')).toContainText('Southbank Billing Pty Ltd');
    await expect(page.getByTestId('document-liability')).toContainText('expired and cannot satisfy readiness');
    await page.getByRole('button', { name: 'Continue to Review & declarations' }).click();
    await expect(page.locator('.error-summary')).toContainText('Public Liability');

    await page.getByText('Review tools').click();
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
