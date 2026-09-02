import { test } from '@playwright/test';
import path from 'node:path';

import { accessCaseTitle } from '../../../support/case-catalog.js';
import { openAccessRequestForm } from '../../../support/form-helpers.js';
import { requireCapturedStepsFieldMap } from '../../../support/field-map-gate.js';
import { runLiveAccessCase } from '../../../support/live-case.js';
import { collectStepMetrics } from '../../../support/measurements.js';
import {
  completeStepAndAdvance,
  completeVisibleRequiredControls,
} from '../../../support/required-controls.js';
import { STEP } from '../../../support/selectors.js';
import { snapshotStepState } from '../../../support/step-state.js';
import { visibleUploadFields } from '../../../support/upload-controls.js';
import { startAtStep5 } from '../../../support/journeys/access-request-journeys.js';

const uploadPath = path.resolve('tests/access-requests/fixtures/synthetic-access-document.pdf');

function repeatedValues(snapshots) {
  const occurrences = new Map();
  for (const control of snapshots.flatMap((item) => item.controls)) {
    if (typeof control.value !== 'string' || !control.value) continue;
    const ids = occurrences.get(control.value) ?? [];
    ids.push(control.id);
    occurrences.set(control.value, ids);
  }
  return [...occurrences.entries()]
    .filter(([, ids]) => ids.length > 1)
    .map(([value, ids]) => ({ value, ids }));
}

async function captureInstrumentedBaseline(page) {
  await startAtStep5(page, { uploadPath });
  const transitions = [];
  const metrics = [];
  const snapshots = [];
  let uploads = [];

  for (const step of [5, 6, 7]) {
    metrics.push({ step, ...await collectStepMetrics(page.locator(STEP[step])) });
    const initialActions = await completeVisibleRequiredControls(page, step, { uploadPath });
    snapshots.push({ step, controls: await snapshotStepState(page, step) });
    if (step === 7) {
      uploads = (await visibleUploadFields(page, step)).map((upload) => ({
        fieldId: upload.fieldId,
        inputId: upload.inputId,
        label: upload.label,
        required: upload.required,
        accept: upload.accept,
      }));
    }
    const completionActions = await completeStepAndAdvance(page, step, { uploadPath });
    transitions.push({
      from: step,
      to: step + 1,
      actions: [...initialActions, ...completionActions],
    });
  }

  metrics.push({ step: 8, ...await collectStepMetrics(page.locator(STEP[8])) });
  const step8Actions = await completeVisibleRequiredControls(page, 8, { uploadPath });
  snapshots.push({ step: 8, controls: await snapshotStepState(page, 8) });
  const interactions = transitions.reduce((total, item) => total + item.actions.length + 1, 0)
    + step8Actions.length;

  return {
    metrics,
    interactions,
    transitions,
    snapshots,
    repeated: repeatedValues(snapshots),
    uploads,
    step8Actions,
  };
}

test(accessCaseTitle('TC-AR-E02', 'captures the instrumented Steps 5–8 baseline once'), async ({}, testInfo) => {
  await runLiveAccessCase(testInfo, {
    caseId: 'TC-AR-E02',
    resultType: 'Efficiency',
    expected: 'One controlled journey captures fields, interactions, repetition, document handling, and transitions.',
    step: 8,
    branch: 'instrumented-baseline',
  }, async ({ page }) => {
    requireCapturedStepsFieldMap();
    const evidence = await captureInstrumentedBaseline(page);
    return {
      observed: `${evidence.interactions} user-equivalent interactions were captured with compatible Steps 5–8 measurements in one journey.`,
      stoppingPoint: 'Step 8 after instrumented baseline capture',
      extra: evidence,
    };
  });
});

test(accessCaseTitle('TC-AR-E07', 'compares desktop and phone interaction counts for the same fixture'), async ({}, testInfo) => {
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
      const evidence = await captureInstrumentedBaseline(page);
      results.push({ ...viewport, interactions: evidence.interactions });
    }
    return {
      observed: 'Desktop and phone interaction counts were captured using the same synthetic fixture and instrumentation.',
      stoppingPoint: 'Phone Step 8 after comparable effort measurement',
      extra: { results },
    };
  });
});
