import assert from 'node:assert/strict';
import { expect, test } from '@playwright/test';
import path from 'node:path';

import { accessCaseTitle } from '../../../support/case-catalog.js';
import {
  AccessRequestBlockedError,
  openAccessRequestForm,
  visibleValidationMessages,
} from '../../../support/form-helpers.js';
import { requireCapturedStepsFieldMap } from '../../../support/field-map-gate.js';
import { runLiveAccessCase } from '../../../support/live-case.js';
import {
  clearOneCompletedRequiredControl,
  completeStepAndAdvance,
  completeVisibleRequiredControls,
} from '../../../support/required-controls.js';
import { previousButton, STEP, nextButton } from '../../../support/selectors.js';
import { snapshotStepState } from '../../../support/step-state.js';
import { reachStep } from '../../../support/journeys/access-request-journeys.js';

const uploadPath = path.resolve('tests/access-requests/fixtures/synthetic-access-document.pdf');

test(accessCaseTitle('TC-AR-R02', 'characterizes reload state on every approved later step'), async ({}, testInfo) => {
  test.setTimeout(420_000);
  await runLiveAccessCase(testInfo, {
    caseId: 'TC-AR-R02',
    resultType: 'Characterization',
    expected: 'Reload behavior and recovery effort are recorded for Steps 5–8.',
    step: 8,
    branch: 'reload-recovery',
  }, async ({ page }) => {
    requireCapturedStepsFieldMap();
    const observations = [];
    for (const targetStep of [5, 6, 7, 8]) {
      await openAccessRequestForm(page);
      await reachStep(page, targetStep);
      await completeVisibleRequiredControls(page, targetStep, { uploadPath });
      const before = await snapshotStepState(page, targetStep);
      await page.reload({ waitUntil: 'domcontentloaded' });
      const visibleStep = await page.locator('[id^="gform_page_3_"]:visible').getAttribute('id');
      const targetStillVisible = await page.locator(STEP[targetStep]).isVisible().catch(() => false);
      const after = targetStillVisible ? await snapshotStepState(page, targetStep) : [];
      observations.push({ targetStep, visibleStep, before, after });
    }
    return {
      observed: 'Reload outcomes were captured for Steps 5–8; inspect the per-step snapshots for preserved and lost state.',
      stoppingPoint: 'Reload characterization complete',
      extra: { observations },
    };
  });
});

test(accessCaseTitle('TC-AR-R03', 'preserves unrelated state while correcting later-step validation'), async ({}, testInfo) => {
  await runLiveAccessCase(testInfo, {
    caseId: 'TC-AR-R03',
    resultType: 'Acceptance',
    expected: 'Correcting a validation error preserves unrelated valid values and restores progression.',
    step: 7,
    branch: 'validation-correction',
  }, async ({ page }) => {
    requireCapturedStepsFieldMap();
    await reachStep(page, 5);
    const corrections = [];
    for (const step of [5, 6, 7]) {
      await completeVisibleRequiredControls(page, step, { uploadPath });
      const cleared = await clearOneCompletedRequiredControl(page, step);
      if (!cleared) {
        throw new AccessRequestBlockedError(
          `Step ${step} has no safely clearable completed required control for the correction scenario.`,
          {
            blockerId: 'VALIDATION-TARGET-AR-01',
            blockerReason: `No safely clearable completed required control was found on Step ${step}.`,
          },
        );
      }
      const before = await snapshotStepState(page, step);
      await nextButton(page, step).click();
      const remained = await page.locator(STEP[step]).isVisible().catch(() => false);
      expect(remained).toBe(true);
      const messages = await visibleValidationMessages(page);
      expect(messages.length).toBeGreaterThan(0);
      const afterError = await snapshotStepState(page, step);
      const unrelatedBefore = before.filter((item) => item.id !== cleared.id);
      const unrelatedAfter = afterError.filter((item) => item.id !== cleared.id);
      assert.deepEqual(unrelatedAfter, unrelatedBefore, `Step ${step} cleared unrelated values after validation.`);
      const focus = await page.evaluate((fieldId) => {
        const active = document.activeElement;
        return {
          id: active instanceof HTMLElement ? active.id || null : null,
          inInvalidField: Boolean(fieldId && active instanceof HTMLElement && active.closest(`#${CSS.escape(fieldId)}`)),
          inValidationSummary: Boolean(active instanceof HTMLElement && active.closest('.validation_error, .gform_validation_errors')),
        };
      }, cleared.fieldId);
      expect(focus.inInvalidField || focus.inValidationSummary).toBe(true);
      await completeStepAndAdvance(page, step, { uploadPath });
      corrections.push({ step, messages, before, afterError, cleared, focus });
      await expect(page.locator(STEP[step + 1])).toBeVisible({ timeout: 30_000 });
    }
    return {
      observed: 'Validation outcomes and successful corrections were recorded through Step 7.',
      stoppingPoint: 'Step 8 after validation correction',
      extra: { corrections },
    };
  });
});
