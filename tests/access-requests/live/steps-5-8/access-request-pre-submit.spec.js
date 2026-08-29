import { expect, test } from '@playwright/test';
import path from 'node:path';

import { completeBaselineThroughStep4, advanceFromStep } from '../../support/access-request-path.js';
import { requireCapturedStepsFieldMap } from '../../support/field-map-gate.js';
import { runLiveAccessCase } from '../../support/live-case.js';
import { collectStepMetrics } from '../../support/measurements.js';
import {
  completeStepAndAdvance,
  completeVisibleRequiredControls,
} from '../../support/required-controls.js';
import { FINAL_SUBMIT, STEP } from '../../support/selectors.js';

const qualificationPath = path.resolve('tests/access-requests/fixtures/synthetic-access-document.pdf');

test('TC-AR-006 reaches the valid Step 8 review state without submitting', async ({}, testInfo) => {
  await runLiveAccessCase(testInfo, {
    caseId: 'TC-AR-006',
    resultType: 'Acceptance',
    expected: 'The valid synthetic request reaches Step 8 review with final Submit visible and untouched.',
    step: 8,
    branch: 'valid-pre-submit',
  }, async ({ page }) => {
    const fieldMap = requireCapturedStepsFieldMap();
    const baseline = await completeBaselineThroughStep4(page);
    await advanceFromStep(page, 4);

    const actions = [];
    for (const stepNumber of [5, 6, 7]) {
      actions.push({
        step: stepNumber,
        actions: await completeStepAndAdvance(page, stepNumber, {
          uploadPath: qualificationPath,
        }),
      });
    }
    actions.push({
      step: 8,
      actions: await completeVisibleRequiredControls(page, 8, {
        uploadPath: qualificationPath,
      }),
    });

    await expect(page.locator(STEP[8])).toBeVisible();
    await expect(page.locator(FINAL_SUBMIT)).toBeVisible();
    const reviewText = await page.locator(STEP[8]).innerText();
    expect(reviewText).toContain(baseline.fixture.project.associatedLaanId);
    expect(reviewText).toContain(baseline.fixture.contractor.qualificationFile);

    return {
      observed: 'The synthetic path reached Step 8; earlier-step reference and qualification values were represented in the review, required controls were populated, and final Submit remained untouched.',
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
