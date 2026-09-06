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

// These IDs are the captured Step 4 contractor sub-form groups. Keeping the
// mapping explicit makes a field-map change fail loudly instead of silently
// filling the wrong contractor group.
const contractorGroups = [
  { name: 130, company: 139, phone: 180, induction: 202, expiry: 192, inducted: 182, upload: 445 },
  { name: 131, company: 157, phone: 179, licence: 372, whiteCard: 211, monash: 362, expiry: 201, inducted: 511, upload: 484 },
  { name: 132, company: 156, phone: 178, licence: 373, whiteCard: 210, monash: 363, expiry: 200, inducted: 512, upload: 485 },
  { name: 134, company: 155, phone: 177, licence: 374, whiteCard: 209, monash: 364, expiry: 199, inducted: 513, upload: 486 },
  { name: 133, company: 154, phone: 176, licence: 375, whiteCard: 208, monash: 365, expiry: 198, inducted: 514, upload: 487 },
  { name: 138, company: 153, phone: 175, licence: 376, whiteCard: 207, monash: 366, expiry: 197, inducted: 515, upload: 488 },
  { name: 137, company: 152, phone: 174, licence: 377, whiteCard: 206, monash: 367, expiry: 196, inducted: 516, upload: 489 },
  { name: 136, company: 151, phone: 173, licence: 378, whiteCard: 205, monash: 368, expiry: 195, inducted: 517, upload: 490 },
  { name: 135, company: 150, phone: 172, licence: 481, whiteCard: 204, monash: 369, expiry: 194, inducted: 518, upload: 491 },
  { name: 160, company: 149, phone: 181, licence: 380, whiteCard: 203, monash: 370, expiry: 193, inducted: 519, upload: 493 },
];

function contractorSelector(fieldId) {
  return `#input_3_${fieldId}`;
}

function contractorRadioSelector(fieldId) {
  return `#choice_3_${fieldId}_0`;
}

function contractorUploadSelector(fieldId) {
  return `#field_3_${fieldId} input[type="file"]`;
}

function contractorValue(index) {
  const sequence = String(index + 1).padStart(2, '0');
  return {
    name: `Synthetic Contractor ${index + 1}`,
    company: `Synthetic Contractor Company ${index + 1}`,
    phone: `04000000${sequence}`,
    induction: `SYN-CARD-${sequence}`,
    licence: `SYN-LIC-${sequence}`,
    whiteCard: `SYN-WHITE-${sequence}`,
    monash: `SYN-MONASH-${sequence}`,
    expiry: '31/12/2035',
  };
}

async function fillVisibleContractorField(page, fieldId, value) {
  if (!fieldId) return false;
  const field = page.locator(contractorSelector(fieldId));
  await expect(field).toHaveCount(1);
  if (!await field.isVisible()) return false;
  await expect(field).toBeEnabled();
  await field.fill(value);
  return true;
}

async function fillContractorGroup(page, index) {
  const group = contractorGroups[index];
  const values = contractorValue(index);
  const filledFields = [];
  const inducted = page.locator(contractorRadioSelector(group.inducted));
  await expect(inducted).toHaveCount(1);
  if (await inducted.isVisible()) {
    await expect(inducted).toBeEnabled();
    await inducted.check();
    filledFields.push('inducted');
  }

  for (const [field, value] of Object.entries(values)) {
    if (await fillVisibleContractorField(page, group[field], value)) filledFields.push(field);
  }

  const upload = page.locator(contractorUploadSelector(group.upload));
  await expect(upload).toHaveCount(1);
  await expect(upload).toBeVisible();
  await upload.setInputFiles(uploadPath);
  await expect(page.locator(`#field_3_${group.upload}`)).toContainText('synthetic-access-document.pdf');
  filledFields.push('upload');

  return { index: index + 1, filledFields };
}

async function assertContractorGroupValues(page, index) {
  const group = contractorGroups[index];
  const values = contractorValue(index);
  for (const [field, value] of Object.entries(values)) {
    if (!group[field]) continue;
    const locator = page.locator(contractorSelector(group[field]));
    if (!await locator.isVisible()) continue;
    await expect(locator).toHaveValue(value);
  }
  for (const field of ['name', 'company', 'phone']) {
    await expect(page.locator(contractorSelector(group[field]))).toBeVisible();
    await expect(page.locator(contractorSelector(group[field]))).toHaveValue(values[field]);
  }
  await expect(page.locator(contractorUploadSelector(group.upload))).toBeVisible();
}

async function captureContractorGroupState(page, index) {
  const group = contractorGroups[index];
  const fields = {};
  for (const [role, fieldId] of Object.entries(group)) {
    const locator = role === 'upload'
      ? page.locator(contractorUploadSelector(fieldId))
      : role === 'inducted'
        ? page.locator(contractorRadioSelector(fieldId))
        : page.locator(contractorSelector(fieldId));
    await expect(locator).toHaveCount(1);
    fields[role] = {
      visible: await locator.isVisible(),
      enabled: await locator.isEnabled(),
      required: await locator.evaluate((element) => element.required),
    };
  }
  return { group: index + 1, fields };
}

async function observeReducedContractorGroup(page, index) {
  const group = contractorGroups[index];
  const values = {};
  for (const fieldId of Object.values(group)) {
    if (typeof fieldId !== 'number' || fieldId === group.inducted || fieldId === group.upload) continue;
    const locator = page.locator(contractorSelector(fieldId));
    await expect(locator).toHaveCount(1);
    values[fieldId] = await locator.inputValue();
  }
  const radio = page.locator(contractorRadioSelector(group.inducted));
  await expect(radio).toHaveCount(1);
  const upload = page.locator(contractorUploadSelector(group.upload));
  await expect(upload).toHaveCount(1);
  await expect(upload).toBeHidden();
  return {
    group: index + 1,
    values,
    inductedChecked: await radio.isChecked(),
    uploadFiles: await upload.evaluate((input) => input.files?.length ?? 0),
  };
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

test(accessCaseTitle('TC-AR-B04', 'maps contractor-count variants to the matching identity groups'), async ({}, testInfo) => {
  await runLiveAccessCase(testInfo, {
    caseId: 'TC-AR-B04',
    resultType: 'Characterization',
    expected: 'Count 1 follows the minimum path; 1→2 adds and preserves contractor data; count 10 renders and accepts data in every group; 10→2 and 2→1 hide removed groups and record stale-value behavior; more-than-ten hides the bounded count.',
    step: 4,
    branch: 'contractor-count',
  }, async ({ page }) => {
    requireCapturedStepsFieldMap();
    await completeBaselineThroughStep4(page, { qualificationPath: uploadPath });
    const groupSize = page.locator('#input_3_536');
    const contractorCount = page.locator('#input_3_158');
    await groupSize.selectOption('Up to ten contractors');

    const observations = [];
    const selectCount = async (count) => {
      await contractorCount.selectOption(String(count));
      await expect(page.locator(`${STEP[4]} .gfield:visible input[type="file"]`)).toHaveCount(count);
    };

    // Count 1: minimum path, including the first contractor's complete data set.
    await selectCount(1);
    const countOneFill = await fillContractorGroup(page, 0);
    await assertContractorGroupValues(page, 0);
    observations.push({ count: 1, filledGroups: [1], filledFields: [countOneFill], preservedGroups: [] });

    // Count 2: add the second group and verify the first group's values survive.
    await selectCount(2);
    const countTwoFill = await fillContractorGroup(page, 1);
    await assertContractorGroupValues(page, 0);
    await assertContractorGroupValues(page, 1);
    observations.push({ count: 2, filledGroups: [1, 2], filledFields: [countTwoFill], preservedGroups: [1] });

    // Sweep intermediate bounded options without repeating the full journey;
    // count 10 below performs the complete maximum-data exercise.
    const intermediateOptions = [];
    for (const count of [3, 4, 5, 6, 7, 8, 9]) {
      await selectCount(count);
      intermediateOptions.push({
        count,
        visibleQualificationGroups: await page.locator(`${STEP[4]} .gfield:visible input[type="file"]`).count(),
      });
    }
    observations.push({ count: '3-to-9-option-sweep', intermediateOptions, preservedGroups: [1, 2] });

    // Count 10: bounded maximum path; every contractor group is filled and checked.
    await selectCount(10);
    const filledGroups = [];
    const filledFields = [];
    const groupStates = [];
    for (let index = 0; index < contractorGroups.length; index += 1) {
      filledFields.push(await fillContractorGroup(page, index));
      await assertContractorGroupValues(page, index);
      groupStates.push(await captureContractorGroupState(page, index));
      filledGroups.push(index + 1);
    }
    observations.push({ count: 10, filledGroups, filledFields, groupStates, preservedGroups: [1, 2] });

    // Reduction 10→2 hides removed groups while preserving 1 and 2. Whether
    // hidden values are cleared or retained is recorded for product review.
    await selectCount(2);
    await assertContractorGroupValues(page, 0);
    await assertContractorGroupValues(page, 1);
    const tenToTwoStates = [];
    for (let index = 2; index < contractorGroups.length; index += 1) {
      tenToTwoStates.push(await observeReducedContractorGroup(page, index));
    }
    observations.push({ count: '10-to-2', filledGroups: [1, 2], preservedGroups: [1, 2], reducedGroupStates: tenToTwoStates });

    // Reduction 2→1 repeats the same observation for the second group.
    await selectCount(1);
    await assertContractorGroupValues(page, 0);
    const twoToOneState = await observeReducedContractorGroup(page, 1);
    observations.push({ count: '2-to-1', filledGroups: [1], preservedGroups: [1], reducedGroupStates: [twoToOneState] });

    await groupSize.selectOption('More than ten contractors');
    await expect(page.locator('#field_3_158')).toBeHidden();
    observations.push({
      count: 'more-than-ten',
      boundedCountVisible: await contractorCount.isVisible(),
      visibleQualificationGroups: await page.locator(`${STEP[4]} .gfield:visible input[type="file"]`).count(),
    });

    return {
      observed: 'The minimum, add-and-preserve, maximum, reduction, and more-than-ten contractor-count branches were exercised; every bounded group was filled, preserved values were checked, and removed-group visibility plus stale-value state were recorded.',
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
          owner: 'product/business + QA/reviewer',
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
        owner: 'product/business + QA/reviewer',
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
