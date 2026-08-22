import { expect, test } from '@playwright/test';
import {
  REQUIRED_UPLOAD,
  attachJson,
  fillPageTwoCore,
  openLaanForm,
  completePageOne,
  selectedFileNames,
} from '../../support/form-helpers.js';
import { connectToAuthenticatedContext, installFinalSubmissionGuard } from '../../support/session.js';

async function layoutMetrics(page, stageSelector) {
  return page.locator(stageSelector).evaluate((stage) => ({
    viewportWidth: document.documentElement.clientWidth,
    documentWidth: document.documentElement.scrollWidth,
    horizontalOverflow: Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth),
    stageWidth: Math.round(stage.getBoundingClientRect().width),
    visibleControlCount: [...stage.querySelectorAll('input, select, textarea, button')].filter(
      (element) => element.offsetParent !== null,
    ).length,
  }));
}

test('phone and tablet viewports support the critical pre-submit path without horizontal overflow', async ({}, testInfo) => {
  const { browser, context, ownsBrowser } = await connectToAuthenticatedContext();

  try {
    for (const device of [
      { name: 'phone', width: 390, height: 844 },
      { name: 'tablet', width: 768, height: 1024 },
    ]) {
      await test.step(device.name, async () => {
        const page = await context.newPage();
        const wasFinalSubmissionAttempted = await installFinalSubmissionGuard(page);

        try {
          await page.setViewportSize({ width: device.width, height: device.height });
          await openLaanForm(page);
          const stageOneLayout = await layoutMetrics(page, '#gform_page_1_1');
          expect(stageOneLayout.horizontalOverflow).toBeLessThanOrEqual(2);

          await completePageOne(page);
          await page.locator('#gform_next_button_1_36').click();
          await expect(page.locator('#gform_page_1_2')).toBeVisible({ timeout: 30_000 });
          await fillPageTwoCore(page, device.name.toUpperCase());

          const requiredUpload = page.locator('#input_1_49');
          await requiredUpload.setInputFiles(REQUIRED_UPLOAD);
          await expect.poll(() => selectedFileNames(requiredUpload)).toEqual(['synthetic-laan-attachment.txt']);
          await expect(page.locator('#field_1_59 input[type="file"]')).toBeVisible();
          await expect(page.locator('#gform_submit_button_1')).toBeVisible();

          const stageTwoLayout = await layoutMetrics(page, '#gform_page_1_2');
          expect(stageTwoLayout.horizontalOverflow).toBeLessThanOrEqual(2);
          expect(wasFinalSubmissionAttempted()).toBe(false);

          await attachJson(testInfo, `laan-${device.name}-layout.json`, {
            viewport: { width: device.width, height: device.height },
            stageOneLayout,
            stageTwoLayout,
            requiredUploadSelected: true,
            stoppingPoint: 'Stage 2 before final submission',
            capturedAt: new Date().toISOString(),
          });
        } finally {
          await page.close();
        }
      });
    }
  } finally {
    if (ownsBrowser) await browser.close();
  }
});
