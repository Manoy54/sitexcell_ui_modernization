import { expect, test } from '@playwright/test';
import {
  TEST_SITE_ID,
  attachJson,
  completePageOne,
  fillPageTwoCore,
  openLaanForm,
  openPageTwo,
  readPageOneState,
} from '../../support/form-helpers.js';
import { connectToAuthenticatedContext, installFinalSubmissionGuard } from '../../support/session.js';

test('characterizes Stage 1 and Stage 2 value preservation after reload', async ({}, testInfo) => {
  const { browser, context, ownsBrowser } = await connectToAuthenticatedContext();
  const page = await context.newPage();
  const wasFinalSubmissionAttempted = await installFinalSubmissionGuard(page);

  try {
    await test.step('preserves Stage 1 values after reload', async () => {
      await openLaanForm(page);
      await completePageOne(page);
      const beforeReload = await readPageOneState(page);

      await page.reload({ waitUntil: 'domcontentloaded' });
      await expect(page.locator('#gform_page_1_1')).toBeVisible({ timeout: 30_000 });
      const afterReload = await readPageOneState(page);

      expect(afterReload).toEqual(expect.objectContaining({
        activity: expect.any(String),
        commencementDate: expect.any(String),
        site: expect.any(String),
        termsAccepted: expect.any(Boolean),
      }));

      await attachJson(testInfo, 'laan-stage-one-reload-preservation.json', {
        beforeReload,
        afterReload,
        preserved: {
          activity: afterReload.activity === beforeReload.activity,
          commencementDate: afterReload.commencementDate === beforeReload.commencementDate,
          site: afterReload.site === TEST_SITE_ID,
          termsAccepted: afterReload.termsAccepted === beforeReload.termsAccepted,
        },
        capturedAt: new Date().toISOString(),
      });
      expect(wasFinalSubmissionAttempted()).toBe(false);
    });
    await test.step('preserves Stage 2 values after reload', async () => {
      await openPageTwo(page);
      const valuesBySelector = await fillPageTwoCore(page, 'RELOAD');

      await page.reload({ waitUntil: 'domcontentloaded' });
      await expect(page.locator('#gform_1')).toBeVisible({ timeout: 30_000 });

      const stageOneVisible = await page.locator('#gform_page_1_1').isVisible();
      const stageTwoVisible = await page.locator('#gform_page_1_2').isVisible();
      expect(stageOneVisible || stageTwoVisible).toBe(true);
      const afterReload = {};
      for (const selector of Object.keys(valuesBySelector)) {
        afterReload[selector] = await page.locator(selector).inputValue();
      }

      expect(Object.keys(afterReload)).toEqual(Object.keys(valuesBySelector));

      await attachJson(testInfo, 'laan-stage-two-reload-preservation.json', {
        activeStageAfterReload: stageTwoVisible ? 2 : stageOneVisible ? 1 : null,
        beforeReload: valuesBySelector,
        afterReload,
        preservedByField: Object.fromEntries(
          Object.entries(valuesBySelector).map(([selector, value]) => [selector, afterReload[selector] === value]),
        ),
        capturedAt: new Date().toISOString(),
      });
      expect(wasFinalSubmissionAttempted()).toBe(false);
    });

    expect(wasFinalSubmissionAttempted()).toBe(false);
  } finally {
    await page.close();
    if (ownsBrowser) await browser.close();
  }
});
