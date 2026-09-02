import { expect, test } from '@playwright/test';

import { accessCaseTitle } from '../../../support/case-catalog.js';
import { captureStepFieldStates } from '../../../support/conditional-controls.js';
import {
  TEST_BUILDING,
  TEST_SITE,
  findTestSiteSelect,
} from '../../../support/form-helpers.js';
import { runLiveAccessCase } from '../../../support/live-case.js';
import { STEP, nextButton } from '../../../support/selectors.js';

async function selectStepOneSite(page) {
  const siteSelect = await findTestSiteSelect(page);
  await siteSelect.selectOption({ label: TEST_SITE });
  await expect(siteSelect).toHaveValue(/.+/);
  return siteSelect;
}

async function advanceToStepTwo(page) {
  await selectStepOneSite(page);
  await page.locator('#choice_3_528_0').check();
  await page.locator('#choice_3_464_1').check();
  await nextButton(page, 1).click();
  await expect(page.locator(STEP[2])).toBeVisible();
}

test(accessCaseTitle('TC-AR-B01', 'enforces the available tenure-confirmation branch'), async ({}, testInfo) => {
  await runLiveAccessCase(testInfo, {
    caseId: 'TC-AR-B01',
    resultType: 'Characterization',
    expected: 'The live tenure branch exposes its supported values and blocks progression until confirmed.',
    step: 1,
    branch: 'tenure-confirmation',
  }, async ({ page }) => {
    await selectStepOneSite(page);
    await page.locator('#choice_3_464_1').check();

    const tenureOptions = page.locator('#field_3_528 input[type="radio"]:enabled');
    await expect(tenureOptions).toHaveCount(1);
    await nextButton(page, 1).click();
    await expect(page.locator(STEP[1])).toBeVisible();
    await expect(page.locator('#field_3_528 .validation_message')).toBeVisible();

    await tenureOptions.first().check();
    await nextButton(page, 1).click();
    await expect(page.locator(STEP[2])).toBeVisible();

    return {
      observed: 'The live form exposes one tenure-confirmation value; omitting it is rejected and confirming it permits Step 2.',
      stoppingPoint: 'Step 2 after tenure branch validation',
      extra: {
        optionCount: await tenureOptions.count(),
        supportedValues: await tenureOptions.evaluateAll((items) => items.map((item) => item.value)),
      },
    };
  });
});

test(accessCaseTitle('TC-AR-B02', 'characterizes the Step 1 emergency/network answer variants'), async ({}, testInfo) => {
  await runLiveAccessCase(testInfo, {
    caseId: 'TC-AR-B02',
    resultType: 'Characterization',
    expected: 'Yes and No are mutually exclusive, and any dependent Step 1 state change is recorded.',
    step: 1,
    branch: 'emergency-network-information',
  }, async ({ page }) => {
    await selectStepOneSite(page);
    const yes = page.locator('#choice_3_532_0');
    const no = page.locator('#choice_3_532_1');
    await expect(yes).toBeVisible();
    await expect(no).toBeVisible();

    const observations = [];
    for (const [answer, control] of [['Yes', yes], ['No', no]]) {
      const before = await captureStepFieldStates(page, 1);
      await control.check();
      await expect(control).toBeChecked();
      await expect(answer === 'Yes' ? no : yes).not.toBeChecked();
      const after = await captureStepFieldStates(page, 1);
      observations.push({
        answer,
        changedFields: after.filter((field) => {
          const previous = before.find((item) => item.id === field.id);
          return previous && (
            previous.visible !== field.visible
            || previous.required !== field.required
            || previous.enabledControls !== field.enabledControls
          );
        }),
      });
    }

    return {
      observed: 'Both live Yes/No variants are selectable and mutually exclusive; dependent Step 1 state changes were captured.',
      stoppingPoint: 'Step 1 after both emergency/network variants',
      extra: { observations },
    };
  });
});

test(accessCaseTitle('TC-AR-B07', 'requires acknowledgement of Site-specific application requirements'), async ({}, testInfo) => {
  await runLiveAccessCase(testInfo, {
    caseId: 'TC-AR-B07',
    resultType: 'Acceptance',
    expected: 'The selected Site context is shown and its application requirements must be acknowledged before Step 3.',
    step: 2,
    branch: 'site-document-requirements',
  }, async ({ page }) => {
    await advanceToStepTwo(page);
    await expect(page.locator('#input_3_9')).toHaveValue(TEST_BUILDING);
    const requirements = page.locator('#field_3_430');
    await expect(requirements).toContainText(/Application Requirements/i);

    const acknowledgement = page.locator('#input_3_430_1');
    await acknowledgement.uncheck();
    await nextButton(page, 2).click();
    await expect(page.locator(STEP[2])).toBeVisible();
    await expect(page.locator('#field_3_430 .validation_message')).toBeVisible();

    await acknowledgement.check();
    await nextButton(page, 2).click();
    await expect(page.locator(STEP[3])).toBeVisible();

    return {
      observed: `${TEST_SITE} populated ${TEST_BUILDING}; Step 2 rejected the unchecked acknowledgement and accepted it when checked.`,
      stoppingPoint: 'Step 3 after Site-specific requirement acknowledgement',
      extra: { site: TEST_SITE, buildingAddress: TEST_BUILDING },
    };
  });
});
