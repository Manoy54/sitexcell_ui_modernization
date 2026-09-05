import { expect, test } from '@playwright/test';

import { accessProbeTitle } from '../../../support/case-catalog.js';
import {
  findTestSiteSelect,
  TEST_SITE as ACCESS_TEST_SITE,
} from '../../../support/form-helpers.js';
import {
  blockedExploratoryOutcome,
  installPayloadSubmissionGuard,
  visibleFieldInventory,
} from '../../../support/exploratory-observations.js';
import { requireCapturedStepsFieldMap } from '../../../support/field-map-gate.js';
import { runLiveAccessCase } from '../../../support/live-case.js';

const LAAN_URL = process.env.LAAN_URL ?? 'https://co-siter.com.au/laan-requests/';
const LAAN_TEST_SITE = process.env.LAAN_TEST_SITE_LABEL ?? 'siteXcell Pty Ltd';
const LAAN_FINAL_PAYLOAD = /(?:gform_submit=1|is_submit_1=1|gform_submit_button_1)/;

const CONCEPTS = Object.freeze({
  site: /\bsite\b/i,
  project: /\b(project|laan|reference)\b/i,
  company: /\b(company|carrier|tenant)\b/i,
  contact: /\b(contact|full name|person)\b/i,
  phone: /\b(phone|mobile|contact number)\b/i,
  address: /\b(address|location|floor|area)\b/i,
  date: /\bdate\b/i,
});

function candidateConcepts(accessFields, laanFields) {
  return Object.entries(CONCEPTS).flatMap(([concept, pattern]) => {
    const accessLabels = accessFields.map((field) => field.label).filter((label) => pattern.test(label));
    const laanLabels = laanFields.map((field) => field.label).filter((label) => pattern.test(label));
    if (!accessLabels.length || !laanLabels.length) return [];
    return [{ concept, accessLabels, laanLabels }];
  });
}

async function openLaanObservation(page) {
  await page.goto(LAAN_URL, { waitUntil: 'domcontentloaded' });
  await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {});
  await expect(page.locator('#gform_1')).toBeVisible({ timeout: 30_000 });
  await expect(page.locator('#gform_page_1_1')).toBeVisible();
}

async function visibleOptionLabels(select) {
  if (!await select.isVisible()) return [];
  const labels = await select.locator('option').allTextContents();
  return labels.map((label) => label.trim()).filter(Boolean);
}

async function captureLaanFields(page) {
  const finalSubmissionAttempted = await installPayloadSubmissionGuard(page, {
    pathname: '/laan-requests/',
    payloadPattern: LAAN_FINAL_PAYLOAD,
  });
  await openLaanObservation(page);
  const pageOne = await visibleFieldInventory(page, '#gform_page_1_1');
  const activity = page.getByLabel(/What type of activity does this LAAN relate to/i);
  const commencement = page.getByLabel(/Proposed Commencement Date/i);
  const site = page.getByLabel(/^Site name\*?$/i);
  const terms = page.getByLabel(/terms and conditions/i);
  const next = page.getByRole('button', { name: /next/i }).first();
  const requiredControls = [activity, commencement, site, terms, next];
  const missingRequiredControls = [];
  for (const [index, control] of requiredControls.entries()) {
    if (!await control.isVisible()) missingRequiredControls.push(index);
  }
  const siteOptions = await visibleOptionLabels(site);
  if (missingRequiredControls.length || !siteOptions.includes(LAAN_TEST_SITE)) {
    return {
      pageOne,
      pageTwo: [],
      transitionBlocker: missingRequiredControls.length
        ? `LAAN Step 1 is missing ${missingRequiredControls.length} required visible control(s).`
        : `The visible LAAN Site selector does not offer the dedicated Site "${LAAN_TEST_SITE}".`,
      finalSubmissionAttempted: finalSubmissionAttempted(),
    };
  }

  await activity.selectOption({ label: 'Installation' });
  await commencement.fill('30-09-2026');
  await site.selectOption({ label: LAAN_TEST_SITE });
  await terms.check();
  await next.click();
  await expect(page.locator('#gform_page_1_2')).toBeVisible({ timeout: 30_000 });
  const pageTwo = await visibleFieldInventory(page, '#gform_page_1_2');
  return { pageOne, pageTwo, transitionBlocker: null, finalSubmissionAttempted: finalSubmissionAttempted() };
}

async function captureCrossWorkflowInventory(page) {
  const accessFields = await visibleFieldInventory(page, '#gform_page_3_1');
  const accessLaanFields = accessFields.filter((field) => /\bLAAN\b/i.test(field.label));
  const laanFields = await captureLaanFields(page);
  expect(laanFields.finalSubmissionAttempted).toBe(false);
  const candidates = candidateConcepts(accessFields, [...laanFields.pageOne, ...laanFields.pageTwo]);
  return { accessFields, accessLaanFields, laanFields, candidates };
}

test(accessProbeTitle('TC-AR-X01', 'captures cross-workflow semantic candidates'), async ({}, testInfo) => {
  await runLiveAccessCase(testInfo, {
    caseId: 'TC-AR-X01',
    resultType: 'Decision',
    expected: 'Visible Access Request and LAAN labels identify reuse candidates without declaring semantic equivalence.',
    step: 1,
    branch: 'cross-workflow-semantic-candidates',
  }, async ({ page }) => {
    requireCapturedStepsFieldMap();
    const inventory = await captureCrossWorkflowInventory(page);
    return blockedExploratoryOutcome({
      blockerId: 'CROSS-WORKFLOW-AUTHORITY-AR-01',
      blockerReason: 'Candidate labels are externally observable, but authoritative semantic mappings and source ownership are not approved.',
      observed: `${inventory.candidates.length} cross-workflow concept group(s) and ${inventory.accessLaanFields.length} Access Request LAAN-labelled field(s) were observed; none are asserted equivalent.`,
      stoppingPoint: inventory.laanFields.pageTwo.length
        ? 'LAAN Step 2 after cross-workflow field inventory'
        : 'LAAN Step 1 after cross-workflow field inventory',
      observations: inventory.candidates,
      findingIds: ['F-AR-003'],
      recommendationIds: ['R-AR-003'],
      owner: 'product/business + operations/data',
      extra: inventory,
    });
  });
});

test(accessProbeTitle('TC-AR-X02', 'checks whether both suites share one synthetic Site'), async ({}, testInfo) => {
  await runLiveAccessCase(testInfo, {
    caseId: 'TC-AR-X02',
    resultType: 'Characterization',
    expected: 'The configured Access Request and LAAN fixtures use the same externally visible synthetic Site label.',
    step: 1,
    branch: 'cross-workflow-site-context',
  }, async ({ page }) => {
    requireCapturedStepsFieldMap();
    const accessSiteSelect = await findTestSiteSelect(page);
    const accessSiteLabels = await visibleOptionLabels(accessSiteSelect);
    const accessSiteObserved = accessSiteLabels.includes(ACCESS_TEST_SITE);

    const finalSubmissionAttempted = await installPayloadSubmissionGuard(page, {
      pathname: '/laan-requests/',
      payloadPattern: LAAN_FINAL_PAYLOAD,
    });
    await openLaanObservation(page);
    const laanSiteLabels = await visibleOptionLabels(page.getByLabel(/^Site name\*?$/i));
    const laanSiteObserved = laanSiteLabels.includes(LAAN_TEST_SITE);
    expect(finalSubmissionAttempted()).toBe(false);

    const sharedFixture = accessSiteObserved
      && laanSiteObserved
      && ACCESS_TEST_SITE === LAAN_TEST_SITE;
    if (!sharedFixture) {
      return blockedExploratoryOutcome({
        blockerId: 'CROSS-WORKFLOW-FIXTURE-AR-01',
        blockerReason: 'The visible Access Request and LAAN suites do not expose the same dedicated synthetic Site label.',
        observed: [
          `Access Request configured Site "${ACCESS_TEST_SITE}" was ${accessSiteObserved ? '' : 'not '}visible`,
          `LAAN configured Site "${LAAN_TEST_SITE}" was ${laanSiteObserved ? '' : 'not '}visible`,
        ].join('; '),
        stoppingPoint: 'LAAN Step 1 after visible Site-label comparison',
        findingIds: ['F-AR-003'],
        recommendationIds: ['R-AR-003'],
        owner: 'product/business + operations/data + QA',
        extra: { accessSiteObserved, laanSiteObserved },
      });
    }

    return {
      observed: `Both visible Site selectors exposed the same dedicated synthetic label: ${LAAN_TEST_SITE}.`,
      stoppingPoint: 'LAAN Step 1 after visible Site-label comparison',
      extra: { accessSiteObserved, laanSiteObserved },
    };
  });
});

test(accessProbeTitle('TC-AR-X03', 'captures duplicate-entry measurement candidates'), async ({}, testInfo) => {
  await runLiveAccessCase(testInfo, {
    caseId: 'TC-AR-X03',
    resultType: 'Efficiency',
    expected: 'Duplicate-entry candidates are inventoried without claiming human effort savings.',
    step: 1,
    branch: 'cross-workflow-duplicate-entry',
  }, async ({ page }) => {
    requireCapturedStepsFieldMap();
    const inventory = await captureCrossWorkflowInventory(page);
    return blockedExploratoryOutcome({
      blockerId: 'CROSS-WORKFLOW-PROTOCOL-AR-01',
      blockerReason: 'A shared fixture and approved comparable human-effort protocol are unavailable.',
      observed: `${inventory.candidates.length} candidate duplicate-entry concept group(s) were inventoried; no effort or reuse conclusion was made.`,
      stoppingPoint: inventory.laanFields.pageTwo.length
        ? 'LAAN Step 2 after duplicate-entry candidate inventory'
        : 'LAAN Step 1 after duplicate-entry candidate inventory',
      observations: inventory.candidates,
      findingIds: ['F-AR-003'],
      recommendationIds: ['R-AR-003'],
      owner: 'product/business + operations/data + QA',
      extra: {
        accessVisibleFields: inventory.accessFields.length,
        laanVisibleFields: inventory.laanFields.pageOne.length + inventory.laanFields.pageTwo.length,
        transitionBlocker: inventory.laanFields.transitionBlocker,
      },
    });
  });
});
