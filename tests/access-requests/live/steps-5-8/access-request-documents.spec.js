import { expect, test } from '@playwright/test';
import path from 'node:path';

import { advanceFromStep, completeBaselineThroughStep4 } from '../../support/access-request-path.js';
import { AccessRequestBlockedError } from '../../support/form-helpers.js';
import { requireCapturedStepsFieldMap } from '../../support/field-map-gate.js';
import { runLiveAccessCase } from '../../support/live-case.js';
import { completeStepAndAdvance } from '../../support/required-controls.js';
import { STEP } from '../../support/selectors.js';
import { uploadSyntheticFile, visibleUploadFields } from '../../support/upload-controls.js';

const validFile = path.resolve('tests/access-requests/fixtures/synthetic-access-document.pdf');
const replacementFile = path.resolve('tests/access-requests/fixtures/synthetic-access-document-replacement.pdf');

async function reachStep7(page) {
  await completeBaselineThroughStep4(page);
  await advanceFromStep(page, 4);
  await completeStepAndAdvance(page, 5, { uploadPath: validFile });
  await completeStepAndAdvance(page, 6, { uploadPath: validFile });
  await expect(page.locator(STEP[7])).toBeVisible();
}

for (const scenario of [
  {
    caseId: 'TC-AR-D01',
    blockerId: 'DOCUMENT-SOURCE-AR-01',
    expected: 'A valid saved document can be selected with source and ownership evidence.',
    reason: 'The saved-document source, ownership, and authenticated UI are not approved.',
  },
  {
    caseId: 'TC-AR-D02',
    blockerId: 'DOCUMENT-VALIDITY-AR-01',
    expected: 'An expired saved document is rejected according to an approved validity rule.',
    reason: 'The authoritative document-validity and expiry rules are not approved.',
  },
]) {
  test(`${scenario.caseId} records the unresolved saved-document decision`, async ({}, testInfo) => {
    await runLiveAccessCase(testInfo, {
      caseId: scenario.caseId,
      resultType: 'Decision',
      expected: scenario.expected,
      step: 7,
      branch: 'saved-document',
    }, async () => {
      throw new AccessRequestBlockedError(scenario.reason, {
        blockerId: scenario.blockerId,
        blockerReason: scenario.reason,
      });
    });
  });
}

test('TC-AR-D03 replaces a request document with explicit file identity evidence', async ({}, testInfo) => {
  await runLiveAccessCase(testInfo, {
    caseId: 'TC-AR-D03',
    resultType: 'Acceptance',
    expected: 'Replacing a request document removes the previous file identity.',
    step: 7,
    branch: 'document-replacement',
  }, async ({ page }) => {
    requireCapturedStepsFieldMap();
    await reachStep7(page);
    const uploads = await visibleUploadFields(page, 7);
    if (!uploads.length) {
      throw new AccessRequestBlockedError('No visible Step 7 document input was available.', {
        blockerId: 'UPLOAD-FIELD-AR-01',
        blockerReason: 'No visible Step 7 document input was available.',
      });
    }
    await uploadSyntheticFile(uploads[0], validFile);
    const replacement = await uploadSyntheticFile(uploads[0], replacementFile);
    expect(replacement).toHaveLength(1);
    expect(replacement[0].name).toBe(path.basename(replacementFile));
    return {
      observed: 'The replacement document became the sole selected file.',
      stoppingPoint: 'Step 7 after document replacement',
      extra: { uploadId: uploads[0].inputId, replacement },
    };
  });
});
test('TC-AR-D04 characterizes request-specific supporting documents', async ({}, testInfo) => {
  await runLiveAccessCase(testInfo, {
    caseId: 'TC-AR-D04',
    resultType: 'Characterization',
    expected: 'Request-specific supporting document fields are identified separately from saved-document sources.',
    step: 7,
    branch: 'request-specific-document',
  }, async ({ page }) => {
    requireCapturedStepsFieldMap();
    await reachStep7(page);
    const uploads = await visibleUploadFields(page, 7);
    const requestSpecific = uploads.filter((upload) => /additional|request|support|other/i.test(upload.label ?? ''));
    if (!requestSpecific.length) {
      throw new AccessRequestBlockedError('No request-specific document field was identified in the captured branch.', {
        blockerId: 'DOCUMENT-UI-AR-01',
        blockerReason: 'The request-specific document UI is absent or not identified in the captured branch.',
      });
    }
    const evidence = [];
    for (const upload of requestSpecific) evidence.push(...await uploadSyntheticFile(upload, validFile));
    return {
      observed: `${requestSpecific.length} request-specific document fields were identified and populated with synthetic evidence.`,
      stoppingPoint: 'Step 7 request-specific document characterization',
      extra: {
        fields: requestSpecific.map(({ inputId, label, required, accept }) => ({ inputId, label, required, accept })),
        evidence,
      },
    };
  });
});
