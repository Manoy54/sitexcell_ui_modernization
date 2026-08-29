import { test } from '@playwright/test';
import { accessCaseTitle } from '../../../support/case-catalog.js';
import { AccessRequestBlockedError } from '../../../support/form-helpers.js';
import { runLiveAccessCase } from '../../../support/live-case.js';

const decisionCases = [
  {
    caseId: 'TC-AR-D01',
    expected: 'A valid saved document can be selected with source and ownership evidence.',
    reason: 'The saved-document source, ownership, and authenticated UI are not approved.',
    blockerId: 'DOCUMENT-SOURCE-AR-01',
    step: 7,
    branch: 'saved-document-source',
  },
  {
    caseId: 'TC-AR-D02',
    expected: 'An expired saved document is rejected according to an approved validity rule.',
    reason: 'The authoritative document-validity and expiry rules are not approved.',
    blockerId: 'DOCUMENT-VALIDITY-AR-01',
    step: 7,
    branch: 'saved-document-validity',
  },
  {
    caseId: 'TC-AR-U07',
    expected: 'A controlled upload failure can be retried without losing unrelated state.',
    reason: 'Approved staging or upload fault-injection controls are unavailable.',
    blockerId: 'UPLOAD-STAGING-AR-01',
    step: 7,
    branch: 'controlled-upload-failure',
  },
  {
    caseId: 'TC-AR-E10',
    expected: 'Manual repeat entry and one-click copy are compared using an approved source/target pair and human protocol.',
    reason: 'Approved copy behavior and the human measurement protocol are unavailable.',
    blockerId: 'COPY-PROTOCOL-AR-01',
    step: 8,
    branch: 'manual-versus-copy',
  },
  {
    caseId: 'TC-AR-R04',
    expected: 'Save and Continue Later has approved ownership, expiry, privacy, restore, and discard rules before execution.',
    reason: 'Draft ownership, expiry, privacy, restore, and discard rules are not approved.',
    blockerId: 'DECISION-AR-DRAFT',
    step: 8,
    branch: 'save-and-continue-later',
  },
];

for (const scenario of decisionCases) {
  test(accessCaseTitle(scenario.caseId, 'records the unresolved execution prerequisite'), async ({}, testInfo) => {
    await runLiveAccessCase(testInfo, {
      caseId: scenario.caseId,
      resultType: 'Decision',
      expected: scenario.expected,
      step: scenario.step,
      branch: scenario.branch,
    }, async () => {
      throw new AccessRequestBlockedError(scenario.reason, {
        blockerId: scenario.blockerId,
        blockerReason: scenario.reason,
      });
    });
  });
}
