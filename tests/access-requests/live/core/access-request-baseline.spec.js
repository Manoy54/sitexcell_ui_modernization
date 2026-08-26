import { expect, test } from '@playwright/test';
import {
  AccessRequestBlockedError,
  TEST_BUILDING,
  TEST_SITE,
  attachCaseResult,
  findTestSiteSelect,
  openAccessRequestForm,
} from '../../support/form-helpers.js';
import { connectToAuthenticatedContext } from '../../support/session.js';
import { installFinalSubmissionGuard } from '../../support/safety-guards.js';

test('TC-AR-003 partially validates Site-derived conditional context', async ({}, testInfo) => {
  const startedAt = Date.now();
  const { browser, context, ownsBrowser } = await connectToAuthenticatedContext();
  const page = await context.newPage();
  const wasFinalSubmissionAttempted = await installFinalSubmissionGuard(page);

  try {
    try {
      await openAccessRequestForm(page);
      const siteSelect = await findTestSiteSelect(page);
      await siteSelect.selectOption({ label: TEST_SITE });
      await expect(siteSelect).toHaveValue(/.+/);
      await expect(page.getByText(TEST_BUILDING, { exact: false })).toBeVisible();
      const finalSubmissionAttempted = await wasFinalSubmissionAttempted();
      expect(finalSubmissionAttempted).toBe(false);

      await attachCaseResult(testInfo, page, {
        caseId: 'TC-AR-003',
        resultType: 'Characterization',
        status: 'PASS',
        startedAt,
        expected: 'Selecting the dedicated Site exposes its canonical building context.',
        observed: `${TEST_SITE} resolved to ${TEST_BUILDING}.`,
        stoppingPoint: 'Step 1 after Site selection',
        finalSubmissionAttempted,
        extra: {
          testSite: TEST_SITE,
          expectedBuilding: TEST_BUILDING,
          siteSelectorId: await siteSelect.getAttribute('id'),
        },
      });
    } catch (error) {
      const status = error instanceof AccessRequestBlockedError ? 'BLOCKED' : 'FAIL';
      testInfo.annotations.push({ type: 'result-status', description: status });
      await attachCaseResult(testInfo, page, {
        caseId: 'TC-AR-003',
        resultType: 'Characterization',
        status,
        startedAt,
        expected: 'Selecting the dedicated Site exposes its canonical building context.',
        observed: status === 'BLOCKED'
          ? 'The authenticated Access Request became unavailable.'
          : 'The Site-derived conditional-context assertion failed.',
        firstFailure: String(error?.message ?? error),
        stoppingPoint: status === 'BLOCKED'
          ? 'Authentication/authorization preflight'
          : 'Step 1 Site-derived conditional context',
        finalSubmissionAttempted: await wasFinalSubmissionAttempted(),
        extra: { testSite: TEST_SITE, expectedBuilding: TEST_BUILDING },
      });
      throw error;
    }
  } finally {
    await page.close();
    if (ownsBrowser) await browser.close();
  }
});
