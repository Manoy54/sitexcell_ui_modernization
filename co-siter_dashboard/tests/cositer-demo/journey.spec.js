import { expect, test } from '@playwright/test';

async function openAccountOptions(page) {
    const toggle = page.getByRole('button', { name: 'Account options' });
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    return page.getByRole('navigation', { name: 'Account options' });
}

async function leaveDashboard(page) {
    const accountOptions = await openAccountOptions(page);
    await accountOptions.getByRole('link', { name: 'Leave dashboard' }).click();
}

test('public demo entry leads to a working fictional request register', async ({ page }) => {
    await page.goto('/sitexcell-cositer-login-prototype/');
    await expect(page.getByRole('heading', { name: 'Welcome to Co-Siter' })).toBeVisible();
    await expect(page.getByLabel(/password/i)).toHaveCount(0);

    await page.getByRole('link', { name: 'Enter dashboard' }).click();
    await expect(page.getByRole('navigation', { name: 'Co-Siter navigation' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Requests', exact: true })).toBeVisible();
    await expect(page.locator('[data-demo-request]')).toHaveCount(8);

    await page.getByPlaceholder('ID, Site, or requester').fill('North Quay');
    await expect(page.locator('[data-demo-request]:visible')).toHaveCount(2);
    await page.getByLabel('Status').selectOption('Objections');
    await expect(page.getByText('No requests match these filters.')).toBeVisible();
    await page.getByPlaceholder('ID, Site, or requester').fill('LAAN-002');
    await expect(page.locator('[data-demo-request]:visible')).toHaveCount(1);

    await page.getByRole('link', { name: 'View details' }).click();
    await expect(page.getByRole('heading', { name: 'LAAN-002' })).toBeVisible();
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
    await expect(page.locator('[data-demo-contact-form]')).toBeVisible();
    await expect(page.locator('form')).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Submit' })).toHaveCount(0);
    await page.getByRole('button', { name: 'Review details' }).click();
    await expect(page.getByLabel('First name *')).toBeFocused();
});

test('sidebar profile reveals functional account options', async ({ page }) => {
    await page.goto('/sitexcell-portal-requests-prototype/');
    const toggle = page.getByRole('button', { name: 'Account options' });
    const accountOptions = await openAccountOptions(page);

    await expect(accountOptions).toBeVisible();
    await expect(accountOptions.getByRole('link')).toHaveCount(3);
    await page.keyboard.press('Escape');
    await expect(accountOptions).toBeHidden();
    await expect(toggle).toBeFocused();

    await openAccountOptions(page);
    await page.locator('.demo-topbar').click();
    await expect(accountOptions).toBeHidden();

    await openAccountOptions(page);
    await accountOptions.getByRole('link', { name: 'Account settings' }).click();
    await expect(page.getByRole('heading', { name: 'Settings', exact: true })).toBeVisible();
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

    await page.getByRole('button', { name: 'Reset Access form' }).click();
    await expect(page.getByText('Reset this request?')).toBeVisible();
    await page.getByRole('button', { name: 'Keep working' }).click();
    await expect(page.getByLabel('Owner name (optional)')).toHaveValue('Fictional Owner');
    await page.getByRole('button', { name: 'Reset Access form' }).click();
    await page.getByRole('button', { name: 'Reset request' }).click();
    await expect(page.getByLabel('Owner name (optional)')).toHaveValue('');
    await page.getByLabel('Owner name (optional)').fill('Second fictional owner');

    await leaveDashboard(page);
    await expect(page.getByRole('heading', { name: 'Welcome to Co-Siter' })).toBeVisible();
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

    await leaveDashboard(page);
    await expect(page.getByRole('heading', { name: 'Welcome to Co-Siter' })).toBeVisible();
    await page.goto('/sitexcell-portal-requests-prototype/?view=laan');
    await expect(terms).not.toBeChecked();
});

test('portal pages and embedded forms show no prototype labels', async ({ page }) => {
    for (const route of [
        '/sitexcell-cositer-login-prototype/',
        '/sitexcell-portal-requests-prototype/',
        '/sitexcell-portal-requests-prototype/?view=request&id=SAR-001',
        '/sitexcell-portal-requests-prototype/?view=users',
        '/sitexcell-portal-requests-prototype/?view=documents',
        '/sitexcell-portal-requests-prototype/?view=settings',
        '/sitexcell-portal-requests-prototype/?view=contact',
        '/sitexcell-portal-requests-prototype/?view=laan',
        '/sitexcell-portal-requests-prototype/?view=access',
    ]) {
        await page.goto(route);
        expect(await page.locator('body').innerText(), route).not.toMatch(/\b(prototype|demo|fictional|synthetic|sample)\b/i);
        if (route.endsWith('view=laan')) {
            await page.getByTestId('site-search').fill('1 Denison Street');
            await page.getByTestId('site-result').first().click();
            await expect(page.getByText('No site-specific notes are recorded for this Site.')).toBeVisible();
            expect(await page.locator('body').innerText(), `${route} with Site selected`).not.toMatch(/\b(prototype|demo|fictional|synthetic|sample)\b/i);
        }
    }
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
