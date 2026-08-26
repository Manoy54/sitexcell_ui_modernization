import { expect, test } from '@playwright/test';
import {
  AccessRequestBlockedError,
  attachCaseResult,
  findTestSiteSelect,
  openAccessRequestForm,
  TEST_BUILDING,
  TEST_SITE,
} from '../../support/form-helpers.js';
import { FINAL_SUBMIT, STEP, nextButton } from '../../support/selectors.js';
import { connectToAuthenticatedContext } from '../../support/session.js';
import { installFinalSubmissionGuard } from '../../support/safety-guards.js';

function futureAccessDate(daysAhead = 7) {
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);
  return `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
}

async function fillBaselineStepsOneToThree(page) {
  const siteSelect = await findTestSiteSelect(page);
  await siteSelect.selectOption({ label: TEST_SITE });
  await page.locator('#choice_3_528_0').check();
  await page.locator('#choice_3_464_1').check();
  await nextButton(page, 1).click();
  await expect(page.locator(STEP[2])).toBeVisible();
  await expect(page.locator('#input_3_9')).toHaveValue(TEST_BUILDING);

  await page.locator('#input_3_430_1').check();
  await nextButton(page, 2).click();
  await expect(page.locator(STEP[3])).toBeVisible();

  const values = {
    '#input_3_10': 'AR baseline synthetic',
    '#input_3_11': 'Synthetic Test Company',
    '#input_3_269': 'Synthetic Contact',
    '#input_3_270': '0400000000',
    '#input_3_12': 'Level 1',
    '#input_3_527': 'Communications room',
    '#input_3_440': 'Synthetic Carrier',
    '#input_3_52': 'Carrier Contact',
    '#input_3_53': '0400000001',
    '#input_3_441': '1 Synthetic Street, Redbank QLD 4301',
    '#input_3_13': futureAccessDate(),
    '#input_3_437': '09:00',
    '#input_3_438': '10:00',
    '#input_3_495': '1',
    '#input_3_22': 'Worker One',
    '#input_3_23': 'Synthetic Test Company',
    '#input_3_458': 'Technician',
    '#input_3_27': '0400000002',
    '#input_3_25': 'worker.one@example.invalid',
    '#input_3_28': '1 Synthetic Street, Redbank QLD 4301',
    '#input_3_29': 'Worker Two',
    '#input_3_298': 'Synthetic Test Company',
    '#input_3_32': 'Technician',
    '#input_3_31': '0400000003',
    '#input_3_30': 'worker.two@example.invalid',
    '#input_3_33': '1 Synthetic Street, Redbank QLD 4301',
  };
  for (const [selector, value] of Object.entries(values)) await page.locator(selector).fill(value);
  await nextButton(page, 3).click();
  await expect(page.locator(STEP[4])).toBeVisible({ timeout: 30_000 });
}

test('TC-AR-002 completes the synthetic baseline path through Step 4', async ({}, testInfo) => {
  const startedAt = Date.now();
  const { browser, context, ownsBrowser } = await connectToAuthenticatedContext();
  const page = await context.newPage();
  const wasFinalSubmissionAttempted = await installFinalSubmissionGuard(page);

  try {
    try {
      await openAccessRequestForm(page);
      await fillBaselineStepsOneToThree(page);

      await page.locator('#input_3_536').selectOption({ label: 'Up to ten contractors' });
      await page.locator('#input_3_158').selectOption('1');
      const requiredQualificationUpload = page.locator('#gform_page_3_4 input[type="file"]').first();
      await expect(requiredQualificationUpload).toBeVisible();
      await expect.poll(() => requiredQualificationUpload.evaluate((input) => input.files.length)).toBe(0);
      await expect(page.locator(FINAL_SUBMIT)).toBeHidden();
      const finalSubmissionAttempted = await wasFinalSubmissionAttempted();
      expect(finalSubmissionAttempted).toBe(false);

      await attachCaseResult(testInfo, page, {
        caseId: 'TC-AR-002',
        resultType: 'Characterization',
        status: 'PASS',
        startedAt,
        expected: 'Synthetic required values reach Step 4 and expose the required qualification upload without submitting.',
        observed: 'Steps 1–4 accepted the baseline values; Step 4 showed the required qualification upload and no file was transmitted.',
        stoppingPoint: 'Step 4 before required upload',
        finalSubmissionAttempted,
        extra: {
          site: TEST_SITE,
          buildingAddress: TEST_BUILDING,
          requiredUploadField: await requiredQualificationUpload.getAttribute('id'),
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
