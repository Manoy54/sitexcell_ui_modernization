import { expect } from '@playwright/test';
import path from 'node:path';

import { accessRequestBaseline } from '../fixtures/access-request-baseline.js';
import {
  findTestSiteSelect,
  TEST_BUILDING,
  TEST_SITE,
} from './form-helpers.js';
import { STEP, nextButton } from './selectors.js';

async function fillValues(page, values) {
  for (const [selector, value] of Object.entries(values)) {
    await page.locator(selector).fill(value);
  }
}
export async function completeBaselineThroughStep4(page, {
  runId = process.env.ACCESS_RUN_ID,
  qualificationPath = path.resolve('tests/access-requests/fixtures/synthetic-access-document.pdf'),
} = {}) {
  const fixture = accessRequestBaseline(runId);
  const siteSelect = await findTestSiteSelect(page);
  await siteSelect.selectOption({ label: TEST_SITE });
  await page.locator('#choice_3_528_0').check();
  await page.locator('#choice_3_464_1').check();
  await nextButton(page, 1).click();
  await expect(page.locator(STEP[2])).toBeVisible();
  await expect(page.locator('#input_3_9')).toHaveValue(TEST_BUILDING);

  await page.locator('#input_3_430_1').check();
  await nextButton(page, 2).click();
  await expect(page.locator(STEP[3])).toBeVisible();

  await fillValues(page, {
    '#input_3_10': fixture.project.associatedLaanId,
    '#input_3_11': fixture.project.company,
    '#input_3_269': fixture.project.healthAndSafetyContact,
    '#input_3_270': fixture.project.healthAndSafetyPhone,
    '#input_3_12': fixture.project.location,
    '#input_3_527': fixture.project.accessArea,
    '#input_3_440': fixture.project.carrier,
    '#input_3_52': fixture.project.carrierContact,
    '#input_3_53': fixture.project.carrierPhone,
    '#input_3_441': fixture.project.carrierAddress,
    '#input_3_13': fixture.project.accessDate,
    '#input_3_437': fixture.project.startTime,
    '#input_3_438': fixture.project.endTime,
    '#input_3_495': fixture.project.workerCount,
    '#input_3_22': fixture.workers[0].name,
    '#input_3_23': fixture.workers[0].company,
    '#input_3_458': fixture.workers[0].role,
    '#input_3_27': fixture.workers[0].phone,
    '#input_3_25': fixture.workers[0].email,
    '#input_3_28': fixture.workers[0].address,
    '#input_3_29': fixture.workers[1].name,
    '#input_3_298': fixture.workers[1].company,
    '#input_3_32': fixture.workers[1].role,
    '#input_3_31': fixture.workers[1].phone,
    '#input_3_30': fixture.workers[1].email,
    '#input_3_33': fixture.workers[1].address,
  });
  await nextButton(page, 3).click();
  await expect(page.locator(STEP[4])).toBeVisible({ timeout: 30_000 });

  await page.locator('#input_3_536').selectOption({ label: fixture.contractor.countLabel });
  await page.locator('#input_3_158').selectOption(fixture.contractor.identityGroupCount);
  const qualificationUpload = page.locator('#field_3_445 input[type="file"]').first();
  await expect(qualificationUpload).toBeVisible();
  await fillValues(page, {
    '#input_3_130': fixture.contractor.name,
    '#input_3_139': fixture.contractor.company,
    '#input_3_180': fixture.contractor.phone,
    '#input_3_202': fixture.contractor.inductionNumber,
    '#input_3_192': fixture.contractor.inductionExpiry,
  });
  if (fixture.contractor.siteInducted) await page.locator('#choice_3_182_0').check();
  await qualificationUpload.setInputFiles(qualificationPath);
  await expect(page.locator('#field_3_445')).toContainText(fixture.contractor.qualificationFile);

  return {
    fixture,
    siteSelectorId: await siteSelect.getAttribute('id'),
    qualificationFieldId: await qualificationUpload.getAttribute('id'),
  };
}

export async function advanceFromStep(page, stepNumber) {
  await nextButton(page, stepNumber).click();
  await expect(page.locator(STEP[stepNumber + 1])).toBeVisible({ timeout: 30_000 });
}
