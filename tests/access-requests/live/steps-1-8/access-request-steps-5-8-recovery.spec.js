import assert from 'node:assert/strict';
import { expect, test } from '@playwright/test';
import path from 'node:path';

import { accessCaseTitle } from '../../support/case-catalog.js';
import { advanceFromStep, completeBaselineThroughStep4 } from '../../support/access-request-path.js';
import {
  AccessRequestBlockedError,
  openAccessRequestForm,
  visibleValidationMessages,
} from '../../support/form-helpers.js';
import { requireCapturedStepsFieldMap } from '../../support/field-map-gate.js';
import { runLiveAccessCase } from '../../support/live-case.js';
import {
  clearOneCompletedRequiredControl,
  completeStepAndAdvance,
  completeVisibleRequiredControls,
} from '../../support/required-controls.js';
import { previousButton, STEP, nextButton } from '../../support/selectors.js';
import { snapshotStepState } from '../../support/step-state.js';

const uploadPath = path.resolve('tests/access-requests/fixtures/synthetic-access-document.pdf');

async function reachStep(page, targetStep) {
  await completeBaselineThroughStep4(page);
  await advanceFromStep(page, 4);
  for (let step = 5; step < targetStep; step += 1) {
    await completeStepAndAdvance(page, step, { uploadPath });
  }
}

test(accessCaseTitle('TC-AR-R01', 'preserves Step 5–7 values through Back and Next'), async ({}, testInfo) => {
  await runLiveAccessCase(testInfo, {
    caseId: 'TC-AR-R01',
    resultType: 'Acceptance',
    expected: 'Back and Next preserve valid values without duplicate entry.',
    step: 7,
    branch: 'back-next-recovery',
  }, async ({ page }) => {
    requireCapturedStepsFieldMap();
    await reachStep(page, 5);
    const checkpoints = [];
    for (const step of [5, 6, 7]) {
      await completeVisibleRequiredControls(page, step, { uploadPath });
      const before = await snapshotStepState(page, step);
      await completeStepAndAdvance(page, step, { uploadPath });
      await previousButton(page, step + 1).click();
      await expect(page.locator(STEP[step])).toBeVisible({ timeout: 30_000 });
      const after = await snapshotStepState(page, step);
      assert.deepEqual(after, before, `Step ${step} changed after a Back transition.`);
      await nextButton(page, step).click();
      await expect(page.locator(STEP[step + 1])).toBeVisible({ timeout: 30_000 });
      checkpoints.push({ step, preservedControls: after.length });
    }
    return {
      observed: 'Back and Next preserved all captured Step 5–7 control state.',
      stoppingPoint: 'Step 8 after recovery navigation',
      extra: { checkpoints },
    };
  });
});

test(accessCaseTitle('TC-AR-R02', 'characterizes reload state on every approved later step'), async ({}, testInfo) => {
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

test(accessCaseTitle('TC-AR-R04', 'remains blocked until the draft lifecycle is approved'), async ({}, testInfo) => {
  await runLiveAccessCase(testInfo, {
    caseId: 'TC-AR-R04',
    resultType: 'Decision',
    expected: 'Save and Continue Later has approved ownership, expiry, privacy, restore, and discard rules before execution.',
    step: 8,
    branch: 'save-and-continue-later',
  }, async () => {
    throw new AccessRequestBlockedError(
      'Save and Continue Later execution requires an approved draft data lifecycle.',
      {
        blockerId: 'DECISION-AR-DRAFT',
        blockerReason: 'Draft ownership, expiry, privacy, restore, and discard rules are not approved.',
      },
    );
  });
});
