import { expect, test } from '@playwright/test';
import { accessCaseTitle } from '../../support/case-catalog.js';
import path from 'node:path';

import { advanceFromStep, completeBaselineThroughStep4 } from '../../support/access-request-path.js';
import { characterizeConditionalControls } from '../../support/conditional-controls.js';
import { requireCapturedStepsFieldMap } from '../../support/field-map-gate.js';
import { runLiveAccessCase } from '../../support/live-case.js';
import {
  completeStepAndAdvance,
  completeVisibleRequiredControls,
} from '../../support/required-controls.js';

const uploadPath = path.resolve('tests/access-requests/fixtures/synthetic-access-document.pdf');

async function reachStep(page, targetStep) {
  await completeBaselineThroughStep4(page);
  await advanceFromStep(page, 4);
  for (let step = 5; step < targetStep; step += 1) {
    await completeStepAndAdvance(page, step, { uploadPath });
  }
}

const branchCases = [
  {
    caseId: 'TC-AR-B03',
    step: 5,
    branch: 'work-isolation-authority-permit-special-access',
    labelPattern: null,
    expected: 'Every Step 5 controlling option records its visibility, requiredness, and enabled-state effects.',
  },
  {
    caseId: 'TC-AR-B05',
    step: 6,
    branch: 'after-hours-high-risk',
    labelPattern: /after|risk|safety|work/i,
    expected: 'After-hours and high-risk controls expose the correct dependent state.',
  },
  {
    caseId: 'TC-AR-B06',
    step: 6,
    branch: 'rooftop-structure-access',
    labelPattern: /roof|structure|height|access/i,
    expected: 'Rooftop and structure-access controls expose the correct dependent state.',
  },
];

for (const scenario of branchCases) {
  test(accessCaseTitle(scenario.caseId, `characterizes ${scenario.branch}`, [scenario.step]), async ({}, testInfo) => {
    await runLiveAccessCase(testInfo, {
      caseId: scenario.caseId,
      resultType: 'Characterization',
      expected: scenario.expected,
      step: scenario.step,
      branch: scenario.branch,
    }, async ({ page }) => {
      requireCapturedStepsFieldMap();
      await reachStep(page, scenario.step);
      const observations = await characterizeConditionalControls(page, scenario.step, {
        labelPattern: scenario.labelPattern,
      });
      expect(observations.length).toBeGreaterThan(0);
      return {
        observed: `${observations.length} behavior-changing option observations were captured on Step ${scenario.step}.`,
        stoppingPoint: `Step ${scenario.step} conditional branch characterization`,
        extra: { observations },
      };
    });
  });
}

test(accessCaseTitle('TC-AR-B08', 'records controlling-answer changes without silently submitting stale state'), async ({}, testInfo) => {
  await runLiveAccessCase(testInfo, {
    caseId: 'TC-AR-B08',
    resultType: 'Characterization',
    expected: 'Changing Step 5–6 controlling answers records dependent visibility and requiredness without submission.',
    step: 6,
    branch: 'controlling-answer-change',
  }, async ({ page }) => {
    requireCapturedStepsFieldMap();
    await reachStep(page, 5);
    await completeVisibleRequiredControls(page, 5, { uploadPath });
    const step5 = await characterizeConditionalControls(page, 5, {
      populateVisibleRequired: () => completeVisibleRequiredControls(page, 5, { uploadPath }),
    });
    await completeStepAndAdvance(page, 5, { uploadPath });
    await completeVisibleRequiredControls(page, 6, { uploadPath });
    const step6 = await characterizeConditionalControls(page, 6, {
      populateVisibleRequired: () => completeVisibleRequiredControls(page, 6, { uploadPath }),
    });
    expect(step5.length + step6.length).toBeGreaterThan(0);
    const hiddenPopulatedFields = [...step5, ...step6].flatMap((observation) => observation.changedFields
      .filter((field) => field.previousVisible
        && field.previousValuePresent
        && !field.visible)
      .map((field) => ({
        step: step5.includes(observation) ? 5 : 6,
        controller: observation.controller,
        option: observation.option,
        ...field,
      })));
    if (!hiddenPopulatedFields.length) {
      return {
        status: 'NOT APPLICABLE',
        observed: 'No populated dependent control became irrelevant during the mapped Step 5–6 option transitions.',
        stoppingPoint: 'Step 6 stale-state applicability check',
        extra: { step5, step6 },
      };
    }
    const silentlySubmittable = hiddenPopulatedFields.filter((field) => field.valuePresent && field.enabledControls > 0);
    expect(silentlySubmittable).toEqual([]);
    return {
      observed: 'Populated dependent values were cleared or disabled when controlling answers made them irrelevant.',
      stoppingPoint: 'Step 6 after controlling-answer transition probes',
      extra: { step5, step6, hiddenPopulatedFields, silentlySubmittable },
    };
  });
});
