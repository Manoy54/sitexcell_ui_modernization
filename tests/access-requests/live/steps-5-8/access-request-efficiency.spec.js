import { expect, test } from '@playwright/test';
import path from 'node:path';

import { advanceFromStep, completeBaselineThroughStep4 } from '../../support/access-request-path.js';
import { keyboardReachability } from '../../support/accessibility.js';
import { AccessRequestBlockedError, openAccessRequestForm, visibleValidationMessages } from '../../support/form-helpers.js';
import { requireCapturedStepsFieldMap } from '../../support/field-map-gate.js';
import { runLiveAccessCase } from '../../support/live-case.js';
import { collectStepMetrics } from '../../support/measurements.js';
import {
  completeStepAndAdvance,
  completeVisibleRequiredControls,
} from '../../support/required-controls.js';
import { STEP, nextButton } from '../../support/selectors.js';
import { snapshotStepState } from '../../support/step-state.js';
import { visibleUploadFields } from '../../support/upload-controls.js';

const uploadPath = path.resolve('tests/access-requests/fixtures/synthetic-access-document.pdf');

async function reachStep5(page) {
  await completeBaselineThroughStep4(page);
  await advanceFromStep(page, 4);
}

async function completeLaterSteps(page) {
  await reachStep5(page);
  const transitions = [];
  for (const step of [5, 6, 7]) {
    const actions = await completeStepAndAdvance(page, step, { uploadPath });
    transitions.push({ step, actions });
  }
  const step8Actions = await completeVisibleRequiredControls(page, 8, { uploadPath });
  return { transitions, step8Actions };
}

test('TC-AR-E01 records Steps 5–8 manual-field candidates', async ({}, testInfo) => {
  await runLiveAccessCase(testInfo, {
    caseId: 'TC-AR-E01',
    resultType: 'Efficiency',
    expected: 'Manual field candidates are counted for the same valid synthetic branch.',
    step: 8,
    branch: 'manual-field-count',
  }, async ({ page }) => {
    requireCapturedStepsFieldMap();
    await reachStep5(page);
    const metrics = [];
    for (const step of [5, 6, 7]) {
      metrics.push({ step, ...await collectStepMetrics(page.locator(STEP[step])) });
      await completeStepAndAdvance(page, step, { uploadPath });
    }
    metrics.push({ step: 8, ...await collectStepMetrics(page.locator(STEP[8])) });
    return {
      observed: 'Visible, required, disabled, and manual-field candidate counts were captured for Steps 5–8.',
      stoppingPoint: 'Step 8 after field-count measurement',
      extra: { metrics },
    };
  });
});

test('TC-AR-E02 records user-equivalent interactions for the valid later-step path', async ({}, testInfo) => {
  await runLiveAccessCase(testInfo, {
    caseId: 'TC-AR-E02',
    resultType: 'Efficiency',
    expected: 'User-equivalent interactions are counted using the approved fixture and branch.',
    step: 8,
    branch: 'interaction-count',
  }, async ({ page }) => {
    requireCapturedStepsFieldMap();
    const evidence = await completeLaterSteps(page);
    const interactions = evidence.transitions.reduce((sum, item) => sum + item.actions.length + 1, 0)
      + evidence.step8Actions.length;
    return {
      observed: `${interactions} user-equivalent fill, select, upload, check, and Next interactions were recorded for Steps 5–8.`,
      stoppingPoint: 'Step 8 after interaction measurement',
      extra: { interactions, ...evidence },
    };
  });
});

test('TC-AR-E03 records repeated later-step values without assuming reuse authority', async ({}, testInfo) => {
  await runLiveAccessCase(testInfo, {
    caseId: 'TC-AR-E03',
    resultType: 'Efficiency',
    expected: 'Repeated synthetic values are mapped without treating repetition as reuse approval.',
    step: 8,
    branch: 'repeated-person-values',
  }, async ({ page }) => {
    requireCapturedStepsFieldMap();
    await completeLaterSteps(page);
    const values = [];
    for (const step of [5, 6, 7, 8]) values.push(...await snapshotStepState(page, step));
    const occurrences = new Map();
    for (const control of values) {
      if (typeof control.value !== 'string' || !control.value) continue;
      const ids = occurrences.get(control.value) ?? [];
      ids.push(control.id);
      occurrences.set(control.value, ids);
    }
    const repeated = [...occurrences.entries()]
      .filter(([, ids]) => ids.length > 1)
      .map(([value, ids]) => ({ value, ids }));
    return {
      observed: `${repeated.length} repeated synthetic values were identified for later business review.`,
      stoppingPoint: 'Step 8 after repetition mapping',
      extra: { repeated },
    };
  });
});

test('TC-AR-E04 records required and optional document handling effort', async ({}, testInfo) => {
  await runLiveAccessCase(testInfo, {
    caseId: 'TC-AR-E04',
    resultType: 'Efficiency',
    expected: 'Document upload/reference actions are counted with validity context.',
    step: 7,
    branch: 'document-handling-effort',
  }, async ({ page }) => {
    requireCapturedStepsFieldMap();
    await reachStep5(page);
    await completeStepAndAdvance(page, 5, { uploadPath });
    await completeStepAndAdvance(page, 6, { uploadPath });
    const uploads = await visibleUploadFields(page, 7);
    return {
      observed: `${uploads.length} visible Step 7 upload controls were mapped for document-handling effort.`,
      stoppingPoint: 'Step 7 document-handling inventory',
      extra: { uploads: uploads.map(({ fieldId, inputId, label, required, accept }) => ({ fieldId, inputId, label, required, accept })) },
    };
  });
});

test('TC-AR-E05 records later-step transitions and backtracking points', async ({}, testInfo) => {
  await runLiveAccessCase(testInfo, {
    caseId: 'TC-AR-E05',
    resultType: 'Efficiency',
    expected: 'Transitions and potential backtracking points are recorded for the valid Steps 5–8 path.',
    step: 8,
    branch: 'transition-log',
  }, async ({ page }) => {
    requireCapturedStepsFieldMap();
    const evidence = await completeLaterSteps(page);
    return {
      observed: 'Three forward transitions and the Step 8 stopping point were recorded for the valid later-step path.',
      stoppingPoint: 'Step 8 transition-log boundary',
      extra: { transitions: evidence.transitions.map(({ step, actions }) => ({ from: step, to: step + 1, interactions: actions.length + 1 })) },
    };
  });
});

test('TC-AR-E06 records validation-correction effort separately from first failure', async ({}, testInfo) => {
  await runLiveAccessCase(testInfo, {
    caseId: 'TC-AR-E06',
    resultType: 'Efficiency',
    expected: 'First validation feedback and correction interactions are recorded separately.',
    step: 7,
    branch: 'validation-correction-effort',
  }, async ({ page }) => {
    requireCapturedStepsFieldMap();
    await reachStep5(page);
    const corrections = [];
    for (const step of [5, 6, 7]) {
      await nextButton(page, step).click();
      await expect(page.locator(STEP[step])).toBeVisible({ timeout: 30_000 });
      const messages = await visibleValidationMessages(page);
      expect(messages.length).toBeGreaterThan(0);
      const actions = await completeStepAndAdvance(page, step, { uploadPath });
      corrections.push({ step, firstFeedback: messages, correctionInteractions: actions.length + 1 });
    }
    return {
      observed: 'Validation feedback and correction interactions were recorded independently for Steps 5–7.',
      stoppingPoint: 'Step 8 after correction-effort measurement',
      extra: { corrections },
    };
  });
});

test('TC-AR-E07 compares desktop and phone interaction counts for the same fixture', async ({}, testInfo) => {
  await runLiveAccessCase(testInfo, {
    caseId: 'TC-AR-E07',
    resultType: 'Efficiency',
    expected: 'Desktop and phone effort use the same fixture and counting rules.',
    step: 8,
    branch: 'responsive-effort',
  }, async ({ page }) => {
    requireCapturedStepsFieldMap();
    const viewports = [
      { label: 'desktop', width: 1280, height: 720 },
      { label: 'phone', width: 390, height: 844 },
    ];
    const results = [];
    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await openAccessRequestForm(page);
      const evidence = await completeLaterSteps(page);
      results.push({
        ...viewport,
        interactions: evidence.transitions.reduce((sum, item) => sum + item.actions.length + 1, 0) + evidence.step8Actions.length,
      });
    }
    return {
      observed: 'Desktop and phone interaction counts were captured using the same synthetic fixture.',
      stoppingPoint: 'Phone Step 8 after comparable effort measurement',
      extra: { results },
    };
  });
});

test('TC-AR-E08 records keyboard focus effort through Steps 5–8', async ({}, testInfo) => {
  await runLiveAccessCase(testInfo, {
    caseId: 'TC-AR-E08',
    resultType: 'Efficiency',
    expected: 'Keyboard focusable-control counts are recorded for each later step.',
    step: 8,
    branch: 'keyboard-effort',
  }, async ({ page }) => {
    requireCapturedStepsFieldMap();
    await reachStep5(page);
    const focusCounts = [];
    for (const step of [5, 6, 7]) {
      const sequence = await keyboardReachability(page, step);
      focusCounts.push({
        step,
        controls: sequence.expected.length,
        tabStops: sequence.sequence.length,
        missing: sequence.missing,
      });
      await completeStepAndAdvance(page, step, { uploadPath });
    }
    const step8Sequence = await keyboardReachability(page, 8);
    focusCounts.push({
      step: 8,
      controls: step8Sequence.expected.length,
      tabStops: step8Sequence.sequence.length,
      missing: step8Sequence.missing,
    });
    return {
      observed: 'Focusable-control counts were captured for Steps 5–8.',
      stoppingPoint: 'Step 8 after keyboard-effort measurement',
      extra: { focusCounts },
    };
  });
});

test('TC-AR-E09 measures data preservation after a recoverable error', async ({}, testInfo) => {
  await runLiveAccessCase(testInfo, {
    caseId: 'TC-AR-E09',
    resultType: 'Efficiency',
    expected: 'Before/after field state and recovery effort are recorded after validation.',
    step: 5,
    branch: 'error-preservation-effort',
  }, async ({ page }) => {
    requireCapturedStepsFieldMap();
    await reachStep5(page);
    const before = await snapshotStepState(page, 5);
    await nextButton(page, 5).click();
    await expect(page.locator(STEP[5])).toBeVisible({ timeout: 30_000 });
    const messages = await visibleValidationMessages(page);
    expect(messages.length).toBeGreaterThan(0);
    const afterError = await snapshotStepState(page, 5);
    const actions = await completeStepAndAdvance(page, 5, { uploadPath });
    return {
      observed: 'Step 5 state before and after validation plus correction effort was captured.',
      stoppingPoint: 'Step 6 after Step 5 recovery',
      extra: { before, afterError, messages, correctionInteractions: actions.length + 1 },
    };
  });
});

test('TC-AR-E10 remains blocked until copy behavior and a human protocol are approved', async ({}, testInfo) => {
  await runLiveAccessCase(testInfo, {
    caseId: 'TC-AR-E10',
    resultType: 'Efficiency',
    expected: 'Manual repeat entry and one-click copy are compared using an approved source/target pair and human protocol.',
    step: 8,
    branch: 'manual-versus-copy',
  }, async () => {
    throw new AccessRequestBlockedError(
      'Manual-versus-copy measurement requires approved copy behavior and at least three comparable human sessions.',
      {
        blockerId: 'COPY-PROTOCOL-AR-01',
        blockerReason: 'Approved copy behavior and the human measurement protocol are unavailable.',
      },
    );
  });
});
