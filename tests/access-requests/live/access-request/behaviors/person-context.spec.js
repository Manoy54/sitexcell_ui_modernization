import { expect, test } from '@playwright/test';

import { accessProbeTitle } from '../../../support/case-catalog.js';
import { reachAccessRequestStep3 } from '../../../support/access-request-path.js';
import {
  blockedExploratoryOutcome,
  visibleAffordances,
} from '../../../support/exploratory-observations.js';
import { requireCapturedStepsFieldMap } from '../../../support/field-map-gate.js';
import { runLiveAccessCase } from '../../../support/live-case.js';

const FIRST_PERSON_FIELDS = Object.freeze([
  Object.freeze({ key: 'name', label: /^Full Name\*$/i, occurrence: 0 }),
  Object.freeze({ key: 'company', label: /^Company\*$/i, occurrence: 0 }),
  Object.freeze({ key: 'role', label: /^Job Title\*$/i, occurrence: 0 }),
  Object.freeze({ key: 'phone', label: /^Phone \/ Mobile\*$/i, occurrence: 0 }),
  Object.freeze({ key: 'email', label: /^Email\*$/i, occurrence: 0 }),
  // Address is also used for the carrier; the second exact label is the first worker group.
  Object.freeze({ key: 'address', label: /^Address\*$/i, occurrence: 1 }),
]);

const PERSON_SOURCE_TERMS = /\b(returning|existing|known|saved|select)\b.{0,40}\b(person|worker|contractor|contact)\b|\b(person|worker|contractor|contact)\b.{0,40}\b(returning|existing|known|saved|select)\b/i;
const PERSON_AUTHORITY_BLOCKER = Object.freeze({
  blockerId: 'PERSON-AUTHORITY-AR-01',
  blockerReason: 'No approved returning-person source, identity authority, freshness rule, or role-reuse contract is available.',
});

async function prepareStep3(page) {
  requireCapturedStepsFieldMap();
  return reachAccessRequestStep3(page);
}

async function fillAndVerify(page, values) {
  const fieldIds = [];
  for (const { key, label, occurrence } of FIRST_PERSON_FIELDS) {
    const control = page.getByLabel(label, { exact: true }).nth(occurrence);
    await expect(control).toBeVisible();
    await control.fill(values[key]);
    await expect(control).toHaveValue(values[key]);
    fieldIds.push(await control.getAttribute('id'));
  }
  return fieldIds;
}

test(accessProbeTitle('TC-AR-P01', 'characterizes first-time person entry'), async ({}, testInfo) => {
  await runLiveAccessCase(testInfo, {
    caseId: 'TC-AR-P01',
    resultType: 'Characterization',
    expected: 'Visible person fields accept synthetic first-time details without using a saved-person source.',
    step: 3,
    branch: 'first-time-person-entry',
  }, async ({ page }) => {
    const { fixture } = await prepareStep3(page);
    const fieldIds = await fillAndVerify(page, fixture.workers[0]);
    return {
      observed: 'Six visible person fields accepted and retained the synthetic first-time worker details.',
      stoppingPoint: 'Step 3 after synthetic first-time person entry',
      extra: { fieldIds },
    };
  });
});

test(accessProbeTitle('TC-AR-P02', 'probes for a returning-person selector'), async ({}, testInfo) => {
  await runLiveAccessCase(testInfo, {
    caseId: 'TC-AR-P02',
    resultType: 'Characterization',
    expected: 'Any explicit returning-person source is identified without selecting a real person.',
    step: 3,
    branch: 'returning-person-source',
  }, async ({ page }) => {
    await prepareStep3(page);
    const observations = await visibleAffordances(page, 3, PERSON_SOURCE_TERMS);
    if (!observations.length) {
      return blockedExploratoryOutcome({
        ...PERSON_AUTHORITY_BLOCKER,
        observed: 'No explicit returning-person selector was visible on Step 3.',
        stoppingPoint: 'Step 3 returning-person UI inventory',
        findingIds: ['F-AR-001'],
        recommendationIds: ['R-AR-001'],
        owner: 'product/business + operations/data',
      });
    }
    return blockedExploratoryOutcome({
      ...PERSON_AUTHORITY_BLOCKER,
      observed: `${observations.length} candidate returning-person affordance(s) were visible, but identity authority and freshness remain unapproved.`,
      stoppingPoint: 'Step 3 returning-person UI inventory',
      observations,
      findingIds: ['F-AR-001'],
      recommendationIds: ['R-AR-001'],
      owner: 'product/business + operations/data',
    });
  });
});

test(accessProbeTitle('TC-AR-P03', 'records the known-person reuse authority gap'), async ({}, testInfo) => {
  await runLiveAccessCase(testInfo, {
    caseId: 'TC-AR-P03',
    resultType: 'Decision',
    expected: 'Known-person reuse is not judged without an approved identity and freshness authority.',
    step: 3,
    branch: 'known-person-details',
  }, async ({ page }) => {
    await prepareStep3(page);
    const observations = await visibleAffordances(page, 3, PERSON_SOURCE_TERMS);
    return blockedExploratoryOutcome({
      ...PERSON_AUTHORITY_BLOCKER,
      observed: observations.length
        ? `${observations.length} candidate person-source affordance(s) were visible, but their authority and freshness cannot be judged externally.`
        : 'No known-person source was visible, and no identity or freshness authority is approved.',
      stoppingPoint: 'Step 3 known-person source inventory',
      observations,
      findingIds: ['F-AR-001'],
      recommendationIds: ['R-AR-001'],
      owner: 'product/business + operations/data',
    });
  });
});

test(accessProbeTitle('TC-AR-P04', 'characterizes editing entered person details'), async ({}, testInfo) => {
  await runLiveAccessCase(testInfo, {
    caseId: 'TC-AR-P04',
    resultType: 'Characterization',
    expected: 'Visible manually entered person details remain editable before progression.',
    step: 3,
    branch: 'edit-person-details',
  }, async ({ page }) => {
    const { fixture } = await prepareStep3(page);
    await fillAndVerify(page, fixture.workers[0]);
    const changed = {
      ...fixture.workers[0],
      role: 'Synthetic Supervisor',
      phone: '0400000099',
      address: '2 Synthetic Street, Redbank QLD 4301',
    };
    await fillAndVerify(page, changed);
    return {
      observed: 'The visible synthetic person details were changed and the updated values remained in the controls.',
      stoppingPoint: 'Step 3 after editing synthetic person details',
      extra: { changedFields: ['role', 'phone', 'address'] },
    };
  });
});

test(accessProbeTitle('TC-AR-P05', 'probes for same-person role reuse'), async ({}, testInfo) => {
  await runLiveAccessCase(testInfo, {
    caseId: 'TC-AR-P05',
    resultType: 'Decision',
    expected: 'Any explicit same-person role-reuse affordance is recorded without assuming role permissions.',
    step: 3,
    branch: 'same-person-role-reuse',
  }, async ({ page }) => {
    await prepareStep3(page);
    const observations = await visibleAffordances(page, 3, /\b(same person|reuse person|copy person|another role)\b/i);
    return blockedExploratoryOutcome({
      ...PERSON_AUTHORITY_BLOCKER,
      observed: observations.length
        ? `${observations.length} candidate same-person role-reuse affordance(s) were visible, but permitted role reuse is unapproved.`
        : 'No explicit same-person role-reuse affordance was visible on Step 3.',
      stoppingPoint: 'Step 3 role-reuse UI inventory',
      observations,
      findingIds: ['F-AR-001'],
      recommendationIds: ['R-AR-001'],
      owner: 'product/business + operations/data',
    });
  });
});
