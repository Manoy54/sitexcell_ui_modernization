import { expect } from '@playwright/test';
import path from 'node:path';

import { advanceFromStep, completeBaselineThroughStep4 } from '../access-request-path.js';
import { completeStepAndAdvance, completeVisibleRequiredControls } from '../required-controls.js';
import { STEP } from '../selectors.js';

const defaultUploadPath = path.resolve('tests/access-requests/fixtures/synthetic-access-document.pdf');

export async function startAtStep5(page, { uploadPath = defaultUploadPath } = {}) {
  const baseline = await completeBaselineThroughStep4(page, { qualificationPath: uploadPath });
  await completeVisibleRequiredControls(page, 4, { uploadPath });
  await advanceFromStep(page, 4);
  return baseline;
}

export async function reachStep(page, targetStep, { uploadPath = defaultUploadPath } = {}) {
  if (!Number.isInteger(targetStep) || targetStep < 5 || targetStep > 8) {
    throw new RangeError(`Later-step journey target must be between 5 and 8: ${targetStep}`);
  }

  const baseline = await startAtStep5(page, { uploadPath });
  for (let step = 5; step < targetStep; step += 1) {
    await completeStepAndAdvance(page, step, { uploadPath });
  }
  await expect(page.locator(STEP[targetStep])).toBeVisible({ timeout: 30_000 });
  return { baseline };
}

export async function reachStep7(page, { uploadPath = defaultUploadPath } = {}) {
  return reachStep(page, 7, { uploadPath });
}

export async function reachStep8Review(page, { uploadPath = defaultUploadPath } = {}) {
  const baseline = await startAtStep5(page, { uploadPath });
  const actions = [];
  for (const step of [5, 6, 7]) {
    actions.push({
      step,
      actions: await completeStepAndAdvance(page, step, { uploadPath }),
    });
  }
  actions.push({
    step: 8,
    actions: await completeVisibleRequiredControls(page, 8, { uploadPath }),
  });
  await expect(page.locator(STEP[8])).toBeVisible({ timeout: 30_000 });
  return { baseline, actions };
}
