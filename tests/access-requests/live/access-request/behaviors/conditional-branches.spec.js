import { expect, test } from '@playwright/test';
import { accessCaseTitle } from '../../../support/case-catalog.js';
import path from 'node:path';

import { characterizeConditionalControls } from '../../../support/conditional-controls.js';
import { completeBaselineThroughStep4 } from '../../../support/access-request-path.js';
import { requireCapturedStepsFieldMap } from '../../../support/field-map-gate.js';
import { runLiveAccessCase } from '../../../support/live-case.js';
import {
  completeStepAndAdvance,
  completeVisibleRequiredControls,
} from '../../../support/required-controls.js';
import { reachStep } from '../../../support/journeys/access-request-journeys.js';
import { STEP } from '../../../support/selectors.js';

const uploadPath = path.resolve('tests/access-requests/fixtures/synthetic-access-document.pdf');

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

test(accessCaseTitle('TC-AR-B04', 'maps contractor-count variants to the matching identity groups'), async ({}, testInfo) => {
  await runLiveAccessCase(testInfo, {
    caseId: 'TC-AR-B04',
    resultType: 'Characterization',
    expected: 'Counts 1, 2, and 10 expose the same number of contractor qualification groups; the more-than-ten branch hides the bounded count.',
    step: 4,
    branch: 'contractor-count',
  }, async ({ page }) => {
    requireCapturedStepsFieldMap();
    await completeBaselineThroughStep4(page, { qualificationPath: uploadPath });
    const groupSize = page.locator('#input_3_536');
    const contractorCount = page.locator('#input_3_158');
    await groupSize.selectOption('Up to ten contractors');

    const observations = [];
    for (const count of [1, 2, 10]) {
      await contractorCount.selectOption(String(count));
      await page.waitForTimeout(100);
      const qualificationFields = page.locator(`${STEP[4]} .gfield:visible input[type="file"]`);
      await expect(qualificationFields).toHaveCount(count);
      observations.push({
        count,
        qualificationFieldIds: await qualificationFields.evaluateAll((items) => items.map((item) => item.closest('.gfield')?.id ?? null)),
      });
    }

    await groupSize.selectOption('More than ten contractors');
    await expect(page.locator('#field_3_158')).toBeHidden();
    observations.push({
      count: 'more-than-ten',
      boundedCountVisible: await contractorCount.isVisible(),
      visibleQualificationGroups: await page.locator(`${STEP[4]} .gfield:visible input[type="file"]`).count(),
    });

    return {
      observed: 'Contractor counts 1, 2, and 10 exposed matching qualification groups; the more-than-ten branch removed the bounded count selector.',
      stoppingPoint: 'Step 4 after contractor-count branch probes',
      extra: { observations },
    };
  });
});

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
      if (!observations.length) {
        return {
          status: 'BLOCKED',
          blockerId: 'BRANCH-MATCH-AR-01',
          blockerReason: `No mapped Step ${scenario.step} controller matched the ${scenario.branch} branch pattern; the branch cannot be classified safely.`,
          observed: `The branch probe could not identify a mapped Step ${scenario.step} controller for ${scenario.branch}.`,
          stoppingPoint: `Step ${scenario.step} conditional branch identification`,
          extra: { labelPattern: scenario.labelPattern?.toString() ?? null },
        };
      }
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
    let populatedOnce = false;
    const populateVisibleRequiredOnce = async (stepNumber) => {
      if (populatedOnce) return;
      populatedOnce = true;
      await completeVisibleRequiredControls(page, stepNumber, { uploadPath });
    };
    const step5 = await characterizeConditionalControls(page, 5, {
      populateVisibleRequired: () => populateVisibleRequiredOnce(5),
    });
    await completeStepAndAdvance(page, 5, { uploadPath });
    await completeVisibleRequiredControls(page, 6, { uploadPath });
    const step6 = await characterizeConditionalControls(page, 6, {
      populateVisibleRequired: () => populateVisibleRequiredOnce(6),
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
        status: 'BLOCKED',
        blockerId: 'BRANCH-DEPENDENCY-AR-01',
        blockerReason: 'No populated dependent control became irrelevant during the mapped Step 5–6 transitions; stale-state behavior cannot be classified safely.',
        observed: 'The controlling-answer probe did not identify a populated dependent control whose state changed.',
        stoppingPoint: 'Step 6 stale-state identification',
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
