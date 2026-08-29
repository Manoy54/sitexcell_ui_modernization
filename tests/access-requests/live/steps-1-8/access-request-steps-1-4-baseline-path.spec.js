import { expect, test } from '@playwright/test';
import { accessCaseTitle } from '../../support/case-catalog.js';
import {
  AccessRequestBlockedError,
  attachCaseResult,
  openAccessRequestForm,
  TEST_BUILDING,
  TEST_SITE,
} from '../../support/form-helpers.js';
import { completeBaselineThroughStep4 } from '../../support/access-request-path.js';
import { FINAL_SUBMIT } from '../../support/selectors.js';
import { connectToAuthenticatedContext } from '../../support/session.js';
import { installFinalSubmissionGuard } from '../../support/safety-guards.js';

test(accessCaseTitle('TC-AR-002', 'completes the synthetic baseline path through Step 4'), async ({}, testInfo) => {
  const startedAt = Date.now();
  const { browser, context, ownsBrowser } = await connectToAuthenticatedContext();
  const page = await context.newPage();
  const wasFinalSubmissionAttempted = await installFinalSubmissionGuard(page);

  try {
    try {
      await openAccessRequestForm(page);
      const baseline = await completeBaselineThroughStep4(page);
      await expect(page.locator(FINAL_SUBMIT)).toBeHidden();
      const finalSubmissionAttempted = await wasFinalSubmissionAttempted();
      expect(finalSubmissionAttempted).toBe(false);

      await attachCaseResult(testInfo, page, {
        caseId: 'TC-AR-002',
        resultType: 'Characterization',
        status: 'PASS',
        startedAt,
        expected: 'Synthetic required values and contractor details populate Step 4, including the approved qualification upload, without submitting.',
        observed: 'Step 4 displayed the contractor details and accepted the synthetic qualification document; Next and final Submit were not clicked.',
        stoppingPoint: 'Step 4 after contractor details and qualification upload',
        finalSubmissionAttempted,
        extra: {
          site: TEST_SITE,
          buildingAddress: TEST_BUILDING,
          requiredUploadField: baseline.qualificationFieldId,
          qualificationFile: baseline.fixture.contractor.qualificationFile,
          contractor: {
            name: baseline.fixture.contractor.name,
            company: baseline.fixture.contractor.company,
            inductionNumber: baseline.fixture.contractor.inductionNumber,
            siteInducted: 'Yes',
          },
        },
      });
    } catch (error) {
      const status = error instanceof AccessRequestBlockedError ? 'BLOCKED' : 'FAIL';
      testInfo.annotations.push({ type: 'result-status', description: status });
      await attachCaseResult(testInfo, page, {
        caseId: 'TC-AR-002',
        resultType: 'Characterization',
        status,
        startedAt,
        expected: 'Synthetic required values reach Step 4 without submitting.',
        observed: status === 'BLOCKED' ? 'The authenticated Access Request became unavailable.' : 'The baseline path did not reach the Step 4 boundary.',
        firstFailure: String(error?.message ?? error),
        stoppingPoint: status === 'BLOCKED' ? 'Authentication/authorization preflight' : 'Baseline transition before Step 4',
        finalSubmissionAttempted: await wasFinalSubmissionAttempted(),
      });
      throw error;
    }
  } finally {
    await page.close();
    if (ownsBrowser) await browser.close();
  }
});
