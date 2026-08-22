import { expect, test } from '@playwright/test';
import { LAAN_URL, SYNTHETIC_SITE_ID } from '../../support/form-helpers.js';
import { connectToAuthenticatedContext, installFinalSubmissionGuard } from '../../support/session.js';

const SYNTHETIC_VALUES = {
  activity: 'Installation',
  commencementDate: '30-09-2026',
  site: 'The CRM Carpenters Test',
  carrierName: 'Synthetic Carrier Pty Ltd',
  projectReference: 'LAN-NAVIGATION-001',
  tenantCompany: 'Synthetic Tenant Pty Ltd',
  tenantContact: 'Synthetic Contact',
  tenantPhone: '0400000000',
  tenantLocation: 'Level 1, Test Area',
  areasAccessed: 'Synthetic test access area',
};

test('preserves entered values while navigating between LAAN pages without submitting', async () => {
  const { browser, context, ownsBrowser } = await connectToAuthenticatedContext();
  const page = await context.newPage();
  const wasFinalSubmissionAttempted = await installFinalSubmissionGuard(page);

  try {
    await page.goto(LAAN_URL, { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {});
    await expect(page.locator('#gform_page_1_1')).toBeVisible();

    await page.locator('#input_1_11').selectOption({ label: SYNTHETIC_VALUES.activity });
    await page.locator('#input_1_12').fill(SYNTHETIC_VALUES.commencementDate);
    await page.locator('#input_1_41').selectOption({ label: SYNTHETIC_VALUES.site });
    await page.locator('#choice_1_63_1').check();
    await page.locator('#gform_next_button_1_36').click();
    await expect(page.locator('#gform_page_1_2')).toBeVisible({ timeout: 30_000 });

    for (const [selector, value] of [
      ['#input_1_58', SYNTHETIC_VALUES.carrierName],
      ['#input_1_18', SYNTHETIC_VALUES.projectReference],
      ['#input_1_19', SYNTHETIC_VALUES.tenantCompany],
      ['#input_1_83', SYNTHETIC_VALUES.tenantContact],
      ['#input_1_87', SYNTHETIC_VALUES.tenantPhone],
      ['#input_1_22', SYNTHETIC_VALUES.tenantLocation],
      ['#input_1_64', SYNTHETIC_VALUES.areasAccessed],
    ]) {
      await page.locator(selector).fill(value);
    }

    const previousButton = page.locator('#gform_page_1_2').locator(
      '#gform_previous_button_1_36, input[value="Previous"], button:has-text("Previous")',
    ).first();
    await expect(previousButton).toBeVisible();
    await previousButton.click();
    await expect(page.locator('#gform_page_1_1')).toBeVisible({ timeout: 30_000 });

    await expect(page.locator('#input_1_11')).toHaveValue(SYNTHETIC_VALUES.activity);
    await expect(page.locator('#input_1_12')).toHaveValue(SYNTHETIC_VALUES.commencementDate);
    await expect(page.locator('#input_1_41')).toHaveValue(SYNTHETIC_SITE_ID);
    await expect(page.locator('#choice_1_63_1')).toBeChecked();

    await page.locator('#gform_next_button_1_36').click();
    await expect(page.locator('#gform_page_1_2')).toBeVisible({ timeout: 30_000 });

    for (const [selector, value] of [
      ['#input_1_58', SYNTHETIC_VALUES.carrierName],
      ['#input_1_18', SYNTHETIC_VALUES.projectReference],
      ['#input_1_19', SYNTHETIC_VALUES.tenantCompany],
      ['#input_1_83', SYNTHETIC_VALUES.tenantContact],
      ['#input_1_87', SYNTHETIC_VALUES.tenantPhone],
      ['#input_1_22', SYNTHETIC_VALUES.tenantLocation],
      ['#input_1_64', SYNTHETIC_VALUES.areasAccessed],
    ]) {
      await expect(page.locator(selector)).toHaveValue(value);
    }

    await expect(page.locator('#gform_submit_button_1')).toBeVisible();
    expect(wasFinalSubmissionAttempted()).toBe(false);
  } finally {
    await page.close();
    if (ownsBrowser) await browser.close();
  }
});
