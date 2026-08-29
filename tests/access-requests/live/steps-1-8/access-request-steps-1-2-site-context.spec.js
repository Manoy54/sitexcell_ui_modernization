import { expect, test } from '@playwright/test';
import { accessCaseTitle } from '../../support/case-catalog.js';
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
