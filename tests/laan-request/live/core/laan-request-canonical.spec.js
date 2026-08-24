import { expect, test } from '@playwright/test';
import {
  REQUIRED_UPLOAD,
  TEST_SITE,
  TEST_SITE_ID,
  completePageOne,
  fillPageTwoCore,
  openLaanForm,
} from '../../support/form-helpers.js';
import { connectToAuthenticatedContext, installFinalSubmissionGuard } from '../../support/session.js';
const SYNTHETIC_VALUES = {
  activity: 'Installation',
  commencementDate: '30-09-2026',
  carrierName: 'Synthetic Carrier Pty Ltd',
  projectReference: `LAN-SYNTHETIC-${Date.now()}`,
  tenantCompany: 'Synthetic Tenant Pty Ltd',
  tenantContact: 'Synthetic Contact',
  tenantPhone: '0400000000',
  tenantLocation: 'Level 1, Test Area',
  areasAccessed: 'Synthetic test access area',
};

test('completes the canonical synthetic LAAN path to Page 2 without submitting', async ({}, testInfo) => {
  const { browser, context, ownsBrowser } = await connectToAuthenticatedContext();
  const page = await context.newPage();
  const wasFinalSubmissionAttempted = await installFinalSubmissionGuard(page);

  try {
    await openLaanForm(page);
    await completePageOne(page, {
      activity: SYNTHETIC_VALUES.activity,
      commencementDate: SYNTHETIC_VALUES.commencementDate,
    });
    await expect(page.locator('#input_1_11')).toHaveValue(SYNTHETIC_VALUES.activity);
    await expect(page.locator('#input_1_12')).toHaveValue(SYNTHETIC_VALUES.commencementDate);
    await expect(page.locator('#input_1_41')).toHaveValue(TEST_SITE_ID);
    await expect(page.locator('#choice_1_63_1')).toBeChecked();

    await page.locator('#gform_next_button_1_36').click();
    await expect(page.locator('#gform_page_1_2')).toBeVisible({ timeout: 30_000 });
    const pageTwoValues = await fillPageTwoCore(page, 'CANONICAL', {
      projectReference: SYNTHETIC_VALUES.projectReference,
    });
    for (const [selector, value] of Object.entries(pageTwoValues)) {
      await expect(page.locator(selector)).toHaveValue(value);
    }

    await page.locator('#input_1_49').setInputFiles(REQUIRED_UPLOAD);
    await expect.poll(() => page.locator('#input_1_49').evaluate((input) => input.files?.[0]?.name ?? null)).toBe('synthetic-laan-attachment.txt');

    const pageTwoMetrics = await page.locator('#gform_page_1_2').evaluate((pageRoot) => {
      const isVisible = (element) => {
        const style = getComputedStyle(element);
        return style.display !== 'none' && style.visibility !== 'hidden' && element.offsetParent !== null;
      };

      const controls = [...pageRoot.querySelectorAll('input, select, textarea, button')]
        .filter(isVisible)
        .map((element) => ({
          id: element.id || null,
          name: element.getAttribute('name'),
          type: element.getAttribute('type') ?? element.tagName.toLowerCase(),
          required: element.required || element.getAttribute('aria-required') === 'true',
          disabled: element.disabled,
        }));

      return {
        visibleControls: controls.length,
        requiredControls: controls.filter((control) => control.required).length,
        disabledControls: controls.filter((control) => control.disabled).length,
        visibleFinalSubmit: isVisible(document.querySelector('#gform_submit_button_1')),
        uploadedFileName: document.querySelector('#input_1_49')?.files?.[0]?.name ?? null,
        controls,
      };
    });

    await expect(page.locator('#gform_submit_button_1')).toBeVisible();
    expect(wasFinalSubmissionAttempted()).toBe(false);

    await testInfo.attach('laan-canonical-page-two-metrics.json', {
      body: JSON.stringify({
        url: page.url(),
        formId: 'gform_1',
        testSite: TEST_SITE,
        testSiteId: TEST_SITE_ID,
        syntheticValues: SYNTHETIC_VALUES,
        pageTwoValues,
        capturedAt: new Date().toISOString(),
        pageTwoMetrics,
        stoppingPoint: 'Page 2 before final submission',
      }, null, 2),
      contentType: 'application/json',
    });
  } finally {
    await page.close();
    if (ownsBrowser) await browser.close();
  }
});
