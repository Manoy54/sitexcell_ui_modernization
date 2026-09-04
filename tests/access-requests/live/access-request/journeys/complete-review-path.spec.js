import { expect, test } from '@playwright/test';
import path from 'node:path';

import { accessCaseTitle } from '../../../support/case-catalog.js';
import { requireCapturedStepsFieldMap } from '../../../support/field-map-gate.js';
import { runLiveAccessCase } from '../../../support/live-case.js';
import { collectStepMetrics } from '../../../support/measurements.js';
import { FINAL_SUBMIT, STEP } from '../../../support/selectors.js';
import { reachStep8Review } from '../../../support/journeys/access-request-journeys.js';

const qualificationPath = path.resolve('tests/access-requests/fixtures/synthetic-access-document.pdf');

test(accessCaseTitle('TC-AR-006', 'reaches the valid Step 8 review state without submitting'), async ({}, testInfo) => {
  await runLiveAccessCase(testInfo, {
    caseId: 'TC-AR-006',
    resultType: 'Acceptance',
    expected: 'The valid synthetic request reaches Step 8 review with final Submit visible and untouched.',
    step: 8,
    branch: 'valid-pre-submit',
  }, async ({ page }) => {
    const fieldMap = requireCapturedStepsFieldMap();
    const { baseline, actions } = await reachStep8Review(page, { uploadPath: qualificationPath });
    await expect(page.locator(STEP[8])).toBeVisible();
    await expect(page.locator(FINAL_SUBMIT)).toBeVisible();
    const reviewText = await page.locator(STEP[8]).innerText();

    return {
      observed: 'The synthetic path reached Step 8 with the final Submit control visible and untouched; review-text representation of earlier-step values was recorded without treating it as a required provider behavior.',
      stoppingPoint: 'Step 8 review before final Submit',
      extra: {
        fieldMapCapturedAt: fieldMap.capturedAt,
        qualificationFieldId: baseline.qualificationFieldId,
        reviewEvidence: {
          associatedLaanId: baseline.fixture.project.associatedLaanId,
          qualificationFile: baseline.fixture.contractor.qualificationFile,
          referencePresent: reviewText.includes(baseline.fixture.project.associatedLaanId),
          qualificationPresent: reviewText.includes(baseline.fixture.contractor.qualificationFile),
        },
        actions,
        metrics: await collectStepMetrics(page.locator(STEP[8])),
      },
    };
  });
});
