import { expect, test } from '@playwright/test';
import {
  AccessRequestBlockedError,
  attachCaseResult,
  openAccessRequestForm,
  visibleValidationMessages,
} from '../../support/form-helpers.js';
import { FINAL_SUBMIT, STEP, nextButton } from '../../support/selectors.js';
import { connectToAuthenticatedContext } from '../../support/session.js';
import { installFinalSubmissionGuard } from '../../support/safety-guards.js';

test('TC-AR-004 rejects an empty Step 1 with field-level feedback', async ({}, testInfo) => {
  const startedAt = Date.now();
  const { browser, context, ownsBrowser } = await connectToAuthenticatedContext();
  const page = await context.newPage();
  const wasFinalSubmissionAttempted = await installFinalSubmissionGuard(page);

  try {
    try {
      await openAccessRequestForm(page);
      const stepOneNext = nextButton(page, 1);
      await expect(stepOneNext).toBeVisible();
      await stepOneNext.click();

      await expect(page.locator(STEP[1])).toBeVisible({ timeout: 30_000 });
      await expect(page.locator(STEP[2])).toBeHidden();
      await expect(page.locator(FINAL_SUBMIT)).toBeHidden();
      await expect.poll(async () => (await visibleValidationMessages(page)).length).toBeGreaterThan(0);
      const finalSubmissionAttempted = await wasFinalSubmissionAttempted();
      expect(finalSubmissionAttempted).toBe(false);

      await attachCaseResult(testInfo, page, {
        caseId: 'TC-AR-004',
        resultType: 'Acceptance',
        status: 'PASS',
        startedAt,
        expected: 'An empty Step 1 remains visible with field-level validation feedback.',
        observed: 'Step 1 remained visible and exposed validation messages.',
        stoppingPoint: 'Step 1 after required-field validation',
        finalSubmissionAttempted,
        extra: { messages: await visibleValidationMessages(page) },
      });
    } catch (error) {
      const status = error instanceof AccessRequestBlockedError ? 'BLOCKED' : 'FAIL';
      testInfo.annotations.push({ type: 'result-status', description: status });
      await attachCaseResult(testInfo, page, {
        caseId: 'TC-AR-004',
        resultType: 'Acceptance',
        status,
        startedAt,
        expected: 'An empty Step 1 remains visible with field-level validation feedback.',
        observed: status === 'BLOCKED'
          ? 'The authenticated Access Request became unavailable.'
          : 'The required-field behavior assertion failed.',
        firstFailure: String(error?.message ?? error),
        stoppingPoint: status === 'BLOCKED'
          ? 'Authentication/authorization preflight'
          : 'Step 1 required-field validation',
        finalSubmissionAttempted: await wasFinalSubmissionAttempted(),
      });
      throw error;
    }
  } finally {
    await page.close();
    if (ownsBrowser) await browser.close();
  }
});
