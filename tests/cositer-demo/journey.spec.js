import { expect, test } from '@playwright/test';

test('public demo entry leads to a working fictional request register', async ({ page }) => {
    await page.goto('/sitexcell-cositer-login-prototype/');
    await expect(page.getByRole('heading', { name: 'Explore the Co-Siter demo' })).toBeVisible();
    await expect(page.getByLabel(/password/i)).toHaveCount(0);

    await page.getByRole('link', { name: 'Enter demo dashboard' }).click();
    await expect(page.getByRole('navigation', { name: 'Co-Siter navigation' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Requests', exact: true })).toBeVisible();
    await expect(page.locator('[data-demo-request]')).toHaveCount(8);

    await page.getByPlaceholder('ID, Site, or requester').fill('North Quay');
    await expect(page.locator('[data-demo-request]:visible')).toHaveCount(2);
    await page.getByLabel('Status').selectOption('Objections');
    await expect(page.getByText('No requests match these filters.')).toBeVisible();
    await page.getByPlaceholder('ID, Site, or requester').fill('DEMO-LAAN-002');
    await expect(page.locator('[data-demo-request]:visible')).toHaveCount(1);

    await page.getByRole('link', { name: 'View details' }).click();
    await expect(page.getByRole('heading', { name: 'DEMO-LAAN-002' })).toBeVisible();
    await expect(page.getByText('Cable route notice.pdf')).toBeVisible();
    await page.getByRole('link', { name: 'View in Documents' }).click();
    await expect(page.getByRole('heading', { name: 'Documents', exact: true })).toBeVisible();
    await expect(page.getByText('Cable route notice.pdf')).toBeVisible();
});

test('shared navigation exposes demo sections without sending contact data', async ({ page }) => {
    await page.goto('/sitexcell-portal-requests-prototype/?view=users');
    await expect(page.getByRole('navigation', { name: 'Co-Siter navigation' }).getByRole('link')).toHaveCount(5);
    await page.getByPlaceholder('Find a user').fill('Jordan');
    await expect(page.locator('[data-demo-user]:visible')).toHaveCount(1);

    await page.getByRole('navigation', { name: 'Co-Siter navigation' }).getByRole('link', { name: 'Settings' }).click();
    await expect(page.getByRole('heading', { name: 'Settings', exact: true })).toBeVisible();
    await page.getByRole('navigation', { name: 'Co-Siter navigation' }).getByRole('link', { name: 'Contact Us' }).click();
    await expect(page.getByRole('heading', { name: 'Contact Us', exact: true })).toBeVisible();
    await expect(page.locator('form')).not.toHaveAttribute('action');
    await expect(page.getByRole('button', { name: 'Submit' })).toHaveCount(0);
    await page.getByRole('button', { name: 'Preview only' }).click();
    await expect(page.getByLabel('First name *')).toBeFocused();
});

test('both forms use the shared shell, start blank, and keep existing recovery', async ({ page }) => {
    await page.goto('/sitexcell-portal-requests-prototype/?view=access');
    await expect(page.locator('.demo-sidebar')).toHaveCount(1);
    await expect(page.locator('.demo-topbar')).toHaveCount(1);
    await expect(page.locator('#prototype-root .portal-app')).toHaveCount(0);
    await expect(page.getByRole('heading', { name: 'Request context' })).toBeVisible();
    await expect(page.getByLabel('Owner name (optional)')).toHaveValue('');
    await page.getByLabel('Owner name (optional)').fill('Fictional Owner');
    await page.getByRole('link', { name: 'Back to Requests' }).click();
    await page.getByRole('link', { name: 'Access Request' }).click();
    await expect(page.getByLabel('Owner name (optional)')).toHaveValue('Fictional Owner');

    await page.getByRole('link', { name: 'Exit demo' }).click();
    await expect(page.getByRole('heading', { name: 'Explore the Co-Siter demo' })).toBeVisible();
    await page.goto('/sitexcell-portal-requests-prototype/?view=access');
    await expect(page.getByLabel('Owner name (optional)')).toHaveValue('');

    await page.goto('/sitexcell-portal-requests-prototype/?view=laan');
    await expect(page.locator('.demo-sidebar')).toHaveCount(1);
    await expect(page.locator('.demo-topbar')).toHaveCount(1);
    await expect(page.locator('#prototype-root .portal-app')).toHaveCount(0);
    await expect(page.getByTestId('laan-form')).toBeVisible();
    await expect(page.locator('script[src*="assets/js/laan-request.js"]')).toHaveCount(0);
});

test('LAAN demo progress survives dashboard navigation and clears on exit', async ({ page }) => {
    await page.goto('/sitexcell-portal-requests-prototype/?view=laan');
    const terms = page.getByRole('checkbox', { name: /I accept the Terms and Conditions/ });
    await expect(terms).not.toBeChecked();
    await terms.check();
    await page.getByRole('link', { name: 'Back to Requests' }).click();
    await page.getByRole('link', { name: 'LAAN Request' }).click();
    await expect(terms).toBeChecked();

    await page.getByRole('link', { name: 'Exit demo' }).click();
    await expect(page.getByRole('heading', { name: 'Explore the Co-Siter demo' })).toBeVisible();
    await page.goto('/sitexcell-portal-requests-prototype/?view=laan');
    await expect(terms).not.toBeChecked();
});

test('dashboard and embedded forms keep controls reachable at desktop, tablet, and phone widths', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));

    for (const width of [1280, 768, 390, 320]) {
        await page.setViewportSize({ width, height: 900 });
        for (const view of ['requests', 'laan', 'access']) {
            await page.goto(`/sitexcell-portal-requests-prototype/${view === 'requests' ? '' : `?view=${view}`}`);
            await expect(page.getByRole('navigation', { name: 'Co-Siter navigation' })).toBeVisible();
            const hasDocumentOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
            expect(hasDocumentOverflow, `${view} at ${width}px`).toBe(false);
        }
    }

    expect(errors).toEqual([]);
});
