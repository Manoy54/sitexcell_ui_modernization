import { expect, test } from '@playwright/test';
import { SUPPORTED_ACTIVITIES } from '../../support/form-helpers.js';
import { connectToAuthenticatedContext, installFinalSubmissionGuard } from '../../support/session.js';

// Covers the initial form contract used by the core regression.
const LAAN_URL = process.env.LAAN_URL ?? 'https://co-siter.com.au/laan-requests/';
const SYNTHETIC_SITE = 'The CRM Carpenters Test';

test('maps the initial LAAN request form without submitting', async ({}, testInfo) => {
  const { browser, context, ownsBrowser } = await connectToAuthenticatedContext();
  const page = await context.newPage();
  const wasFinalSubmissionAttempted = await installFinalSubmissionGuard(page);

  try {
    const startedAt = Date.now();
    await page.goto(LAAN_URL, { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {});

    await expect(page.locator('#gform_1')).toBeVisible();
    await expect(page.locator('#gform_page_1_1')).toBeVisible();
    await expect(page.locator('#gform_next_button_1_36')).toBeVisible();
    await expect(page.locator('#gform_submit_button_1')).toBeHidden();

    const metrics = await page.locator('#gform_page_1_1').evaluate((pageRoot, loadStartedAt) => {
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
        manualFieldCandidates: controls.filter(
          (control) => !control.disabled && ['text', 'tel', 'select-one', 'textarea', 'file', 'checkbox'].includes(control.type),
        ).length,
        activityOptionCount: document.querySelectorAll('#input_1_11 option').length,
        activityOptions: [...document.querySelectorAll('#input_1_11 option')]
          .map((option) => option.textContent.trim())
          .filter(Boolean),
        siteOptionCount: document.querySelectorAll('#input_1_41 option').length,
        syntheticSiteAvailable: [...document.querySelectorAll('#input_1_41 option')].some(
          (option) => option.textContent.trim() === 'The CRM Carpenters Test',
        ),
        initialPageLoadMs: Date.now() - loadStartedAt,
        finalSubmitVisible: isVisible(document.querySelector('#gform_submit_button_1')),
        controls,
      };
    }, startedAt);

    expect(metrics.syntheticSiteAvailable).toBe(true);
    expect(metrics.activityOptionCount).toBe(SUPPORTED_ACTIVITIES.length + 1);
    expect(metrics.activityOptions).toEqual(expect.arrayContaining(SUPPORTED_ACTIVITIES));
    expect(metrics.activityOptionCount).toBe(4);
    expect(metrics.finalSubmitVisible).toBe(false);
    expect(wasFinalSubmissionAttempted()).toBe(false);

    await testInfo.attach('laan-baseline-metrics.json', {
      body: JSON.stringify(
        {
          url: page.url(),
          formId: 'gform_1',
          workflow: 'two-page Gravity Form',
          syntheticSite: SYNTHETIC_SITE,
          capturedAt: new Date().toISOString(),
          metrics,
        },
        null,
        2,
      ),
      contentType: 'application/json',
    });
  } finally {
    await page.close();
    if (ownsBrowser) {
      await browser.close();
    }
  }
});
