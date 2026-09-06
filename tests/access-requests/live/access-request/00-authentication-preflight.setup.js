import { expect, test } from '@playwright/test';
import { accessCaseTitle } from '../../support/case-catalog.js';
import {
  AccessRequestBlockedError,
  TEST_SITE,
  attachCaseResult,
  inspectAccessRequestAvailability,
} from '../../support/form-helpers.js';
import { collectStepMetrics } from '../../support/measurements.js';
import { ACCESS_FORM, FINAL_SUBMIT, STEP } from '../../support/selectors.js';
import {
  closeSharedAuthenticatedBrowser,
  connectToAuthenticatedContext,
} from '../../support/session.js';
import { installFinalSubmissionGuard } from '../../support/safety-guards.js';

test(accessCaseTitle('TC-AR-001', 'opens the authenticated Access Request without submitting'), async ({}, testInfo) => {
  const startedAt = Date.now();
  const timings = {};
  const contextStartedAt = Date.now();
  let connection;
  try {
    connection = await connectToAuthenticatedContext();
  } catch (error) {
    const blockerReason = String(error?.message ?? error);
    testInfo.annotations.push({ type: 'result-status', description: 'BLOCKED' });
    await attachCaseResult(testInfo, null, {
      caseId: 'TC-AR-001',
      resultType: 'Acceptance',
      status: 'BLOCKED',
      startedAt,
      expected: 'An authenticated Access Request session is available.',
      observed: blockerReason,
      stoppingPoint: 'Authentication/authorization preflight',
      finalSubmissionAttempted: false,
      blockerId: 'AUTH-AR-01',
      blockerReason,
      owner: 'security/privacy + QA/reviewer',
      timings: { contextSetupMs: Date.now() - contextStartedAt },
      extra: { testSite: TEST_SITE },
    });
    throw new AccessRequestBlockedError(`Access Request execution blocked: ${blockerReason}`, {
      blockerId: 'AUTH-AR-01',
      blockerReason,
    });
  }
  const { browser, context, ownsBrowser, ownsContext } = connection;
  timings.contextSetupMs = Date.now() - contextStartedAt;
  const page = await context.newPage();
  const wasFinalSubmissionAttempted = await installFinalSubmissionGuard(page);

  try {
    const availabilityStartedAt = Date.now();
    const availability = await inspectAccessRequestAvailability(page);
    timings.availabilityCheckMs = Date.now() - availabilityStartedAt;
    if (!availability.available) {
      testInfo.annotations.push({ type: 'result-status', description: 'BLOCKED' });
      await attachCaseResult(testInfo, page, {
        caseId: 'TC-AR-001',
        resultType: 'Acceptance',
        status: 'BLOCKED',
        startedAt,
        expected: 'The authenticated Access Request form and Step 1 are visible.',
        observed: availability.reason,
        stoppingPoint: 'Authentication/authorization preflight',
        finalSubmissionAttempted: await wasFinalSubmissionAttempted(),
        blockerId: 'AUTH-AR-01',
        blockerReason: availability.reason,
        timings,
        extra: { testSite: TEST_SITE },
      });
      throw new AccessRequestBlockedError(
        `Access Request execution blocked: ${availability.reason} Refresh the approved authenticated test session.`,
        { blockerId: 'AUTH-AR-01', blockerReason: availability.reason, owner: 'security/privacy + QA/reviewer' },
      );
    }

    try {
      await expect(page.locator(ACCESS_FORM)).toBeVisible();
      await expect(page.locator(STEP[1])).toBeVisible();
      await expect(page.locator(STEP[2])).toBeHidden();
      await expect(page.locator(FINAL_SUBMIT)).toBeHidden();
      const finalSubmissionAttempted = await wasFinalSubmissionAttempted();
      expect(finalSubmissionAttempted).toBe(false);

      await attachCaseResult(testInfo, page, {
        caseId: 'TC-AR-001',
        resultType: 'Acceptance',
        status: 'PASS',
        startedAt,
        expected: 'The authenticated Access Request form and Step 1 are visible; final Submit is hidden.',
        observed: 'The form and Step 1 are visible; Step 2 and final Submit are hidden.',
        stoppingPoint: 'Step 1',
        finalSubmissionAttempted,
        timings,
        extra: {
          testSite: TEST_SITE,
          metrics: await collectStepMetrics(page.locator(STEP[1])),
        },
      });
    } catch (error) {
      testInfo.annotations.push({ type: 'result-status', description: 'FAIL' });
      await attachCaseResult(testInfo, page, {
        caseId: 'TC-AR-001',
        resultType: 'Acceptance',
        status: 'FAIL',
        startedAt,
        expected: 'The authenticated Access Request form and Step 1 are visible; final Submit is hidden.',
        observed: 'The authenticated route was available, but a Step 1 baseline assertion failed.',
        firstFailure: String(error?.message ?? error),
        stoppingPoint: 'Step 1 baseline assertion',
        finalSubmissionAttempted: await wasFinalSubmissionAttempted(),
        timings,
        extra: { testSite: TEST_SITE },
      });
      throw error;
    }
  } finally {
    await page.close();
    if (ownsContext) await context.close();
    if (ownsBrowser) await browser.close();
    if (ownsContext && !ownsBrowser) await closeSharedAuthenticatedBrowser();
  }
});
