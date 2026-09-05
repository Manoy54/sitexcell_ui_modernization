import { test } from '@playwright/test';

import { accessProbeTitle } from '../../../support/case-catalog.js';
import { reachAccessRequestStep3 } from '../../../support/access-request-path.js';
import {
  blockedExploratoryOutcome,
  visibleAffordances,
} from '../../../support/exploratory-observations.js';
import { requireCapturedStepsFieldMap } from '../../../support/field-map-gate.js';
import { runLiveAccessCase } from '../../../support/live-case.js';

const GENERIC_COPY_TERMS = /\b(copy|reuse|same as|duplicate)\b/i;
const COPY_PROBES = Object.freeze([
  Object.freeze({
    caseId: 'TC-AR-C01',
    description: 'probes for one-action individual copying',
    expected: 'Explicit person-copy controls are identified without assuming an approved source or target.',
    branch: 'copy-individual',
    pattern: /\b(copy|reuse|same as|duplicate)\b.{0,40}\b(person|worker|individual|contact)\b|\b(person|worker|individual|contact)\b.{0,40}\b(copy|reuse|same as|duplicate)\b/i,
  }),
  Object.freeze({
    caseId: 'TC-AR-C02',
    description: 'probes for one-action address copying',
    expected: 'Explicit address-copy controls are identified without assuming an approved source or target.',
    branch: 'copy-address',
    pattern: /\b(copy|reuse|same as|duplicate)\b.{0,40}\baddress\b|\baddress\b.{0,40}\b(copy|reuse|same as|duplicate)\b/i,
  }),
  Object.freeze({
    caseId: 'TC-AR-C03',
    description: 'probes for company or contact copying',
    expected: 'Explicit company/contact-copy controls are identified without assuming an approved source or target.',
    branch: 'copy-company-contact',
    pattern: /\b(copy|reuse|same as|duplicate)\b.{0,40}\b(company|contact)\b|\b(company|contact)\b.{0,40}\b(copy|reuse|same as|duplicate)\b/i,
  }),
  Object.freeze({
    caseId: 'TC-AR-C04',
    description: 'records the copied-value comparison prerequisite',
    expected: 'Copied values are compared only after an explicit source-target pair is approved.',
    branch: 'copy-value-match',
    pattern: GENERIC_COPY_TERMS,
  }),
  Object.freeze({
    caseId: 'TC-AR-C05',
    description: 'records the copied-value editability prerequisite',
    expected: 'Copied-value editability is judged only after an explicit source-target pair is approved.',
    branch: 'copy-editability',
    pattern: GENERIC_COPY_TERMS,
  }),
  Object.freeze({
    caseId: 'TC-AR-C06',
    description: 'records the source-isolation prerequisite',
    expected: 'Source isolation is judged only after an explicit copy source-target pair is approved.',
    branch: 'copy-source-isolation',
    pattern: GENERIC_COPY_TERMS,
  }),
  Object.freeze({
    caseId: 'TC-AR-C07',
    description: 'records the unrelated-value preservation prerequisite',
    expected: 'Unrelated-value preservation is judged only after an explicit copy source-target pair is approved.',
    branch: 'copy-unrelated-preservation',
    pattern: GENERIC_COPY_TERMS,
  }),
  Object.freeze({
    caseId: 'TC-AR-C08',
    description: 'records the forbidden-reuse decision prerequisite',
    expected: 'Forbidden reuse is not inferred without approved eligibility and exclusion rules.',
    branch: 'copy-forbidden-reuse',
    pattern: GENERIC_COPY_TERMS,
  }),
]);

for (const probe of COPY_PROBES) {
  test(accessProbeTitle(probe.caseId, probe.description), async ({}, testInfo) => {
    await runLiveAccessCase(testInfo, {
      caseId: probe.caseId,
      resultType: 'Decision',
      expected: probe.expected,
      step: 3,
      branch: probe.branch,
    }, async ({ page }) => {
      requireCapturedStepsFieldMap();
      await reachAccessRequestStep3(page);
      const observations = await visibleAffordances(page, 3, probe.pattern);
      const visibleCopyUi = observations.length > 0;
      return blockedExploratoryOutcome({
        blockerId: visibleCopyUi ? 'COPY-RULE-AR-01' : 'COPY-UI-AR-01',
        blockerReason: visibleCopyUi
          ? 'Candidate copy UI is visible, but its approved source-target mapping, editability, isolation, and exclusion rules are unavailable.'
          : 'No explicitly labelled copy or reuse control is visible on Step 3.',
        observed: visibleCopyUi
          ? `${observations.length} candidate copy/reuse affordance(s) were visible; no action was taken because the source-target contract is unapproved.`
          : `No explicit copy/reuse affordance matched the ${probe.branch} observation on Step 3.`,
        stoppingPoint: `Step 3 ${probe.branch} UI inventory`,
        observations,
        findingIds: ['F-AR-002'],
        recommendationIds: ['R-AR-002'],
        owner: 'product/business',
      });
    });
  });
}
