import { expect, test } from '@playwright/test';
import { attachJson, collectPageTwoFieldState, openPageTwo } from '../../support/form-helpers.js';
import { connectToAuthenticatedContext, installFinalSubmissionGuard } from '../../support/session.js';

test('supported activity variants reach Stage 2 and record conditional field state', async ({}, testInfo) => {
  const { browser, context, ownsBrowser } = await connectToAuthenticatedContext();

  try {
    for (const activity of ['Inspection', 'Maintenance']) {
      await test.step(activity, async () => {
        const page = await context.newPage();
        const wasFinalSubmissionAttempted = await installFinalSubmissionGuard(page);

        try {
          await openPageTwo(page, { activity });
          const fieldState = await collectPageTwoFieldState(page);

          await expect(page.locator('#gform_submit_button_1')).toBeVisible();
          expect(wasFinalSubmissionAttempted()).toBe(false);

          for (const fieldId of [
            'input_1_69',
            'input_1_70',
            'input_1_71',
            'input_1_73',
            'input_1_28_1',
            'input_1_30_1',
          ]) {
            const field = fieldState.find((entry) => entry.id === fieldId);
            expect(field, `${activity} should expose a state for ${fieldId}`).toBeDefined();
            expect(typeof field.visible).toBe('boolean');
            expect(typeof field.enabled).toBe('boolean');
          }

          await attachJson(testInfo, `laan-${activity.toLowerCase()}-field-state.json`, {
            activity,
            capturedAt: new Date().toISOString(),
            visibleFields: fieldState.filter((field) => field.visible),
            enabledFields: fieldState.filter((field) => field.enabled),
            conditionalTechnicalFields: fieldState.filter((field) =>
              ['input_1_69', 'input_1_70', 'input_1_71', 'input_1_73', 'input_1_28_1', 'input_1_30_1'].includes(field.id),
            ),
            stoppingPoint: 'Stage 2 before final submission',
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
