import { expect, test } from '@playwright/test';
import { accessCaseTitle } from '../../../support/case-catalog.js';
import {
  AccessRequestBlockedError,
  TEST_BUILDING,
  TEST_SITE,
  attachCaseResult,
  findTestSiteSelect,
  openAccessRequestForm,
  visibleValidationMessages,
} from '../../../support/form-helpers.js';
import { completeBaselineThroughStep4 } from '../../../support/access-request-path.js';
import { FINAL_SUBMIT, STEP, nextButton } from '../../../support/selectors.js';
import { connectToAuthenticatedContext } from '../../../support/session.js';
import { installFinalSubmissionGuard } from '../../../support/safety-guards.js';

test(accessCaseTitle('TC-AR-004', 'rejects an empty Step 1 with field-level feedback'), async ({}, testInfo) => {
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

test(accessCaseTitle('TC-AR-003', 'partially validates Site-derived conditional context'), async ({}, testInfo) => {
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
      await page.locator('#choice_3_528_0').check();
      await page.locator('#choice_3_464_1').check();
      await page.locator('#gform_page_3_1 .gform_next_button').click();
      await expect(page.locator('#gform_page_3_2')).toBeVisible();
      await expect(page.locator('#input_3_9')).toHaveValue(TEST_BUILDING);
      const finalSubmissionAttempted = await wasFinalSubmissionAttempted();
      expect(finalSubmissionAttempted).toBe(false);

      await attachCaseResult(testInfo, page, {
        caseId: 'TC-AR-003',
        resultType: 'Characterization',
        status: 'PASS',
        startedAt,
        expected: 'Selecting the dedicated Site carries its canonical building context into the form payload.',
        observed: `${TEST_SITE} populated the hidden Building Address field with ${TEST_BUILDING}.`,
        stoppingPoint: 'Step 2 after Step 1 transition',
        finalSubmissionAttempted,
        extra: {
          testSite: TEST_SITE,
          expectedBuilding: TEST_BUILDING,
          buildingAddressField: 'input_3_9',
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
        expected: 'Selecting the dedicated Site carries its canonical building context into the form payload.',
        observed: status === 'BLOCKED'
          ? 'The authenticated Access Request became unavailable.'
          : 'The Site-derived Building Address assertion failed after the Step 1 transition.',
        firstFailure: String(error?.message ?? error),
        stoppingPoint: status === 'BLOCKED'
          ? 'Authentication/authorization preflight'
          : 'Step 1 to Step 2 Site-derived conditional context',
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
