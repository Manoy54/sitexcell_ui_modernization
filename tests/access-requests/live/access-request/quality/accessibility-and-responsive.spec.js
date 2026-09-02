import { expect, test } from '@playwright/test';
import path from 'node:path';

import { accessCaseTitle } from '../../../support/case-catalog.js';
import {
  documentOverflow,
  keyboardReachability,
  reducedMotionViolations,
  unlabeledVisibleControls,
} from '../../../support/accessibility.js';
import { requireCapturedStepsFieldMap } from '../../../support/field-map-gate.js';
import { runLiveAccessCase } from '../../../support/live-case.js';
import {
  completeStepAndAdvance,
  completeVisibleRequiredControls,
} from '../../../support/required-controls.js';
import { STEP } from '../../../support/selectors.js';
import { startAtStep5 } from '../../../support/journeys/access-request-journeys.js';

const uploadPath = path.resolve('tests/access-requests/fixtures/synthetic-access-document.pdf');

async function reachStep8(page, checkpoint = async () => {}) {
  await startAtStep5(page, { uploadPath });
  for (const step of [5, 6, 7]) {
    await checkpoint(step);
    await completeStepAndAdvance(page, step, { uploadPath });
  }
  await completeVisibleRequiredControls(page, 8, { uploadPath });
  await checkpoint(8);
  await expect(page.locator(STEP[8])).toBeVisible();
}

test(accessCaseTitle('TC-AR-A01', 'keeps the Steps 5–8 critical path keyboard reachable'), async ({}, testInfo) => {
  await runLiveAccessCase(testInfo, {
    caseId: 'TC-AR-A01',
    resultType: 'Characterization',
    expected: 'Critical Steps 5–8 controls can receive focus in DOM order.',
    step: 8,
    branch: 'keyboard-only',
  }, async ({ page }) => {
    requireCapturedStepsFieldMap();
    const sequences = [];
    await reachStep8(page, async (step) => {
      const reachability = await keyboardReachability(page, step);
      expect(reachability.expected.length).toBeGreaterThan(0);
      expect(reachability.missing).toEqual([]);
      sequences.push({ step, ...reachability });
    });
    return {
      observed: 'Every visible enabled critical control on Steps 5–8 accepted focus.',
      stoppingPoint: 'Step 8 after keyboard reachability checks',
      extra: { sequences },
    };
  });
});

test(accessCaseTitle('TC-AR-A02', 'provides usable names for Steps 5–8 form controls'), async ({}, testInfo) => {
  await runLiveAccessCase(testInfo, {
    caseId: 'TC-AR-A02',
    resultType: 'Characterization',
    expected: 'Visible Steps 5–8 controls have labels or accessible names.',
    step: 8,
    branch: 'labels-errors-focus',
  }, async ({ page }) => {
    requireCapturedStepsFieldMap();
    const unlabeled = [];
    await reachStep8(page, async (step) => {
      unlabeled.push(...(await unlabeledVisibleControls(page, step)).map((control) => ({ step, ...control })));
    });
    expect(unlabeled).toEqual([]);
    return {
      observed: 'No visible enabled Steps 5–8 form control lacked an accessible name.',
      stoppingPoint: 'Step 8 after accessible-name checks',
      extra: { unlabeled },
    };
  });
});

for (const viewport of [
  { caseId: 'TC-AR-A03', label: 'phone', width: 390, height: 844 },
  { caseId: 'TC-AR-A04', label: 'tablet', width: 768, height: 1024 },
]) {
  test(accessCaseTitle(viewport.caseId, `remains operable at the ${viewport.label} viewport`), async ({}, testInfo) => {
    await runLiveAccessCase(testInfo, {
      caseId: viewport.caseId,
      resultType: 'Characterization',
      expected: `Steps 5–8 remain operable without horizontal document overflow at ${viewport.width}×${viewport.height}.`,
      step: 8,
      branch: `${viewport.label}-responsive`,
    }, async ({ page }) => {
      requireCapturedStepsFieldMap();
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      const overflow = [];
      await reachStep8(page, async (step) => {
        const measurement = await documentOverflow(page);
        expect(measurement.horizontalOverflow).toBe(false);
        overflow.push({ step, ...measurement });
      });
      return {
        observed: `The approved path reached Step 8 at the ${viewport.label} viewport without horizontal document overflow.`,
        stoppingPoint: `Step 8 at ${viewport.width}×${viewport.height}`,
        extra: { viewport, overflow },
      };
    });
  });
}

test(accessCaseTitle('TC-AR-A05', 'remains operable at a 200% equivalent viewport with reduced motion'), async ({}, testInfo) => {
  await runLiveAccessCase(testInfo, {
    caseId: 'TC-AR-A05',
    resultType: 'Characterization',
    expected: 'Steps 5–8 remain readable and operable at 200% equivalent layout width with reduced motion.',
    step: 8,
    branch: 'zoom-reduced-motion',
  }, async ({ page }) => {
    requireCapturedStepsFieldMap();
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width: 640, height: 720 });
    await reachStep8(page);
    const reducedMotion = await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
    const overflow = await documentOverflow(page);
    const motionViolations = await reducedMotionViolations(page);
    expect(reducedMotion).toBe(true);
    expect(overflow.horizontalOverflow).toBe(false);
    expect(motionViolations).toEqual([]);
    return {
      observed: 'The reduced-motion preference was active and the 200% equivalent layout remained horizontally operable.',
      stoppingPoint: 'Step 8 at 200% equivalent layout width',
      extra: { reducedMotion, overflow, motionViolations },
    };
  });
});
