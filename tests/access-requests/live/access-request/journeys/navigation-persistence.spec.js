import assert from 'node:assert/strict';
import { expect, test } from '@playwright/test';
import { accessCaseTitle } from '../../../support/case-catalog.js';
import path from 'node:path';

import { requireCapturedStepsFieldMap } from '../../../support/field-map-gate.js';
import { runLiveAccessCase } from '../../../support/live-case.js';
import {
  completeStepAndAdvance,
  completeVisibleRequiredControls,
} from '../../../support/required-controls.js';
import { previousButton, STEP, nextButton } from '../../../support/selectors.js';
import { snapshotStepState } from '../../../support/step-state.js';
import { startAtStep5 } from '../../../support/journeys/access-request-journeys.js';

const qualificationPath = path.resolve('tests/access-requests/fixtures/synthetic-access-document.pdf');

test(accessCaseTitle('TC-AR-005', 'preserves entered values while navigating through the approved boundary'), async ({}, testInfo) => {
  await runLiveAccessCase(testInfo, {
    caseId: 'TC-AR-005',
    resultType: 'Acceptance',
    expected: 'Entered values and derived Site context persist across back/next navigation through Step 8.',
    step: 8,
    branch: 'navigation-persistence',
  }, async ({ page }) => {
    requireCapturedStepsFieldMap();
    await startAtStep5(page, { uploadPath: qualificationPath });

    const checkpoints = [];
    for (const stepNumber of [5, 6, 7]) {
      await completeVisibleRequiredControls(page, stepNumber, { uploadPath: qualificationPath });
      const before = await snapshotStepState(page, stepNumber);
      await completeStepAndAdvance(page, stepNumber, { uploadPath: qualificationPath });
      await previousButton(page, stepNumber + 1).click();
      await expect(page.locator(STEP[stepNumber])).toBeVisible({ timeout: 30_000 });
      const afterBack = await snapshotStepState(page, stepNumber);
      assert.deepEqual(afterBack, before, `Step ${stepNumber} values changed after Back navigation.`);
      await nextButton(page, stepNumber).click();
      await expect(page.locator(STEP[stepNumber + 1])).toBeVisible({ timeout: 30_000 });
      checkpoints.push({ step: stepNumber, controls: before.length });
    }

    return {
      observed: 'Steps 5–7 preserved their entered state after Back and Next transitions, and the workflow returned to Step 8.',
      stoppingPoint: 'Step 8 after navigation persistence checks',
      extra: { checkpoints },
    };
  });
});
