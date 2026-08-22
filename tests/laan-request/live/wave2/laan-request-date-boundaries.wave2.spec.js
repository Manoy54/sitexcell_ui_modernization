import { expect, test } from '@playwright/test';
import { completePageOne, openLaanForm } from '../../support/form-helpers.js';
import { connectToAuthenticatedContext, installFinalSubmissionGuard } from '../../support/session.js';

test('accepts valid commencement date boundaries', async () => {
  const { browser, context, ownsBrowser } = await connectToAuthenticatedContext();
  const page = await context.newPage();
  const wasFinalSubmissionAttempted = await installFinalSubmissionGuard(page);

  try {
    for (const commencementDate of ['01-01-2027', '31-12-2027']) {
      await test.step(commencementDate, async () => {
        await openLaanForm(page);
        await completePageOne(page, { commencementDate });
        await page.locator('#gform_next_button_1_36').click();

        await expect(page.locator('#gform_page_1_2')).toBeVisible({ timeout: 30_000 });
        await expect(page.locator('#input_1_12')).toHaveValue(commencementDate);
        expect(wasFinalSubmissionAttempted()).toBe(false);
      });
    }
  } finally {
    await page.close();
    if (ownsBrowser) await browser.close();
  }
});
