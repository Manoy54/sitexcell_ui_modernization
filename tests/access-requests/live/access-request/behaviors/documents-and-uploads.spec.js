import { expect, test } from '@playwright/test';
import { accessCaseTitle } from '../../../support/case-catalog.js';
import { readFileSync } from 'node:fs';
import path from 'node:path';

import { AccessRequestBlockedError, visibleValidationMessages } from '../../../support/form-helpers.js';
import { requireCapturedStepsFieldMap } from '../../../support/field-map-gate.js';
import { runLiveAccessCase } from '../../../support/live-case.js';
import { completeVisibleRequiredControls } from '../../../support/required-controls.js';
import { previousButton, STEP, nextButton } from '../../../support/selectors.js';
import {
  changedStateIds,
  snapshotStepState,
  stateItemMatchesControl,
} from '../../../support/step-state.js';
import { reachStep, reachStep7 } from '../../../support/journeys/access-request-journeys.js';
import {
  declaredMaximumBytes,
  associatedUploadConfirmations,
  isRequestSpecificUpload,
  uploadSyntheticFile,
  visibleUploadFields,
} from '../../../support/upload-controls.js';

const validFile = path.resolve('tests/access-requests/fixtures/synthetic-access-document.pdf');
const replacementFile = path.resolve('tests/access-requests/fixtures/synthetic-access-document-replacement.pdf');
const invalidFile = path.resolve('tests/access-requests/fixtures/synthetic-access-document.txt');
const maximumSafeBoundaryFixtureBytes = 25 * 1024 * 1024;

function paddedPdfBuffer(size) {
  const baseline = readFileSync(validFile);
  if (size < baseline.length) return null;
  const buffer = Buffer.alloc(size, 0x20);
  baseline.copy(buffer);
  return buffer;
}

async function requiredUploads(page) {
  const uploads = await visibleUploadFields(page, 7);
  const required = uploads.filter((upload) => upload.required);
  if (!required.length) {
    throw new AccessRequestBlockedError(
      'Step 7 upload execution blocked: no required upload field was present in the captured branch.',
      {
          blockerId: 'UPLOAD-FIELD-AR-01',
          blockerReason: 'No required Step 7 upload field was present in the captured branch.',
          owner: 'product/business + operations/data + QA/reviewer',
      },
    );
  }
  return { uploads, required };
}

test(accessCaseTitle('TC-AR-U01', 'rejects a missing required Step 7 upload'), async ({}, testInfo) => {
  await runLiveAccessCase(testInfo, {
    caseId: 'TC-AR-U01',
    resultType: 'Characterization',
    expected: 'Missing required evidence blocks Step 7 progression with associated feedback.',
    step: 7,
    branch: 'missing-required-upload',
  }, async ({ page }) => {
    requireCapturedStepsFieldMap();
    await reachStep7(page);
    const { required } = await requiredUploads(page);
    await completeVisibleRequiredControls(page, 7);
    await nextButton(page, 7).click();
    await expect(page.locator(STEP[7])).toBeVisible({ timeout: 30_000 });
    const messages = await visibleValidationMessages(page);
    expect(messages.length).toBeGreaterThan(0);
    return {
      observed: 'Step 7 remained active and displayed validation while required upload inputs were empty.',
      stoppingPoint: 'Step 7 required-upload validation',
      extra: { requiredUploadIds: required.map((upload) => upload.inputId), messages },
    };
  });
});

test(accessCaseTitle('TC-AR-U02', 'accepts allowed synthetic files without submitting'), async ({}, testInfo) => {
  await runLiveAccessCase(testInfo, {
    caseId: 'TC-AR-U02',
    resultType: 'Characterization',
    expected: 'Every required Step 7 upload accepts the approved synthetic file.',
    step: 7,
    branch: 'valid-upload',
  }, async ({ page }) => {
    requireCapturedStepsFieldMap();
    await reachStep7(page);
    const { required } = await requiredUploads(page);
    const files = [];
    for (const upload of required) files.push(...await uploadSyntheticFile(upload, validFile));
    expect(files.every((file) => file.name === path.basename(validFile))).toBe(true);
    return {
      observed: `${files.length} required Step 7 upload controls accepted the approved synthetic document.`,
      stoppingPoint: 'Step 7 after valid synthetic uploads',
      extra: { files },
    };
  });
});

test(accessCaseTitle('TC-AR-U03', 'rejects a disallowed synthetic file type'), async ({}, testInfo) => {
  await runLiveAccessCase(testInfo, {
    caseId: 'TC-AR-U03',
    resultType: 'Characterization',
    expected: 'A file outside the declared accepted types is rejected with specific feedback.',
    step: 7,
    branch: 'invalid-upload-type',
  }, async ({ page }) => {
    requireCapturedStepsFieldMap();
    await reachStep7(page);
    const { required } = await requiredUploads(page);
    const eligibleIds = required
      .filter((upload) => upload.accept && !upload.accept.toLowerCase().includes('.txt'))
      .map((upload) => upload.inputId);
    const missingContracts = required
      .filter((upload) => !upload.accept)
      .map((upload) => upload.inputId);
    if (!eligibleIds.length) {
      throw new AccessRequestBlockedError(
        'Upload type rejection cannot be asserted because the live field declares no incompatible type.',
        {
          blockerId: 'UPLOAD-RULE-AR-01',
          blockerReason: 'The live accepted-type contract is unavailable.',
          owner: 'product/business + operations/data + QA/reviewer',
        },
      );
    }
    const observations = [];
    for (const inputId of eligibleIds) {
      const current = await visibleUploadFields(page, 7);
      for (const upload of current.filter((item) => item.required)) await uploadSyntheticFile(upload, validFile);
      const target = current.find((upload) => upload.inputId === inputId);
      if (!target) throw new Error(`Required upload ${inputId} disappeared before invalid-type validation.`);
      await uploadSyntheticFile(target, invalidFile);
      await completeVisibleRequiredControls(page, 7, { uploadPath: validFile });
      await nextButton(page, 7).click();
      await expect(page.locator(STEP[7])).toBeVisible({ timeout: 30_000 });
      const messages = await target.field.locator('.validation_message').allTextContents();
      expect(messages.length).toBeGreaterThan(0);
      observations.push({ inputId, accept: target.accept, messages });
    }
    return {
      status: missingContracts.length ? 'BLOCKED' : 'PASS',
      observed: `${observations.length} required upload controls with declared type contracts rejected the synthetic text file.`,
      stoppingPoint: 'Step 7 invalid-type validation',
      blockerId: missingContracts.length ? 'UPLOAD-RULE-AR-01' : null,
      blockerReason: missingContracts.length
        ? `${missingContracts.length} required upload controls have no declared accepted-type contract.`
        : null,
      owner: missingContracts.length ? 'product/business + operations/data + QA/reviewer' : null,
      extra: { observations, missingContracts },
    };
  });
});

test(accessCaseTitle('TC-AR-U04', 'enforces the declared upload size boundary'), async ({}, testInfo) => {
  test.setTimeout(420_000);
  await runLiveAccessCase(testInfo, {
    caseId: 'TC-AR-U04',
    resultType: 'Characterization',
    expected: 'At-limit evidence is accepted and above-limit evidence is rejected without clearing unrelated state.',
    step: 7,
    branch: 'upload-size-boundary',
  }, async ({ page }) => {
    requireCapturedStepsFieldMap();
    await reachStep7(page);
    const { required } = await requiredUploads(page);
    const boundaryContracts = required.map((upload) => ({
      inputId: upload.inputId,
      maximumBytes: declaredMaximumBytes(upload),
    }));
    const eligible = boundaryContracts.filter((item) => item.maximumBytes);
    if (!eligible.length) {
      throw new AccessRequestBlockedError(
        'Upload size-boundary execution requires a declared live maximum.',
        {
          blockerId: 'UPLOAD-RULE-AR-02',
          blockerReason: 'The live upload size limit is unavailable.',
          owner: 'product/business + operations/data + QA/reviewer',
        },
      );
    }
    const unsupported = boundaryContracts.filter((item) => !item.maximumBytes
      || item.maximumBytes > maximumSafeBoundaryFixtureBytes
      || !paddedPdfBuffer(item.maximumBytes));
    const observations = [];
    for (const contract of eligible.filter((item) => !unsupported.some((blocked) => blocked.inputId === item.inputId))) {
      let current = await visibleUploadFields(page, 7);
      for (const upload of current.filter((item) => item.required)) await uploadSyntheticFile(upload, validFile);
      let target = current.find((upload) => upload.inputId === contract.inputId);
      if (!target) throw new Error(`Upload input ${contract.inputId} was unavailable for at-limit validation.`);
      const atLimitBuffer = paddedPdfBuffer(contract.maximumBytes);
      await target.input.setInputFiles({
        name: 'synthetic-at-limit.pdf', mimeType: 'application/pdf', buffer: atLimitBuffer,
      });
      await completeVisibleRequiredControls(page, 7, { uploadPath: validFile });
      await nextButton(page, 7).click();
      await expect(page.locator(STEP[8])).toBeVisible({ timeout: 30_000 });
      await previousButton(page, 8).click();
      await expect(page.locator(STEP[7])).toBeVisible({ timeout: 30_000 });

      current = await visibleUploadFields(page, 7);
      for (const upload of current.filter((item) => item.required)) await uploadSyntheticFile(upload, validFile);
      target = current.find((upload) => upload.inputId === contract.inputId);
      if (!target) throw new Error(`Upload input ${contract.inputId} was unavailable for above-limit validation.`);
      await target.input.setInputFiles({
        name: 'synthetic-above-limit.pdf',
        mimeType: 'application/pdf',
        buffer: Buffer.concat([atLimitBuffer, Buffer.from('x')]),
      });
      await completeVisibleRequiredControls(page, 7, { uploadPath: validFile });
      const beforeRejection = await snapshotStepState(page, 7);
      await nextButton(page, 7).click();
      await expect(page.locator(STEP[7])).toBeVisible({ timeout: 30_000 });
      const messages = await target.field.locator('.validation_message').allTextContents();
      expect(messages.length).toBeGreaterThan(0);
      const afterRejection = await snapshotStepState(page, 7);
      const targetControl = { id: target.inputId, fieldId: target.fieldId };
      const beforeUnrelated = beforeRejection.filter((item) => !stateItemMatchesControl(item, targetControl));
      const afterUnrelated = afterRejection.filter((item) => !stateItemMatchesControl(item, targetControl));
      const changedUnrelatedIds = changedStateIds(beforeUnrelated, afterUnrelated);
      expect(afterUnrelated, changedUnrelatedIds.length
        ? `Rejected upload changed unrelated controls: ${changedUnrelatedIds.join(', ')}`
        : 'Rejected upload changed unrelated controls.')
        .toEqual(beforeUnrelated);
      observations.push({ ...contract, messages });
    }
    return {
      status: unsupported.length ? 'BLOCKED' : 'PASS',
      observed: `${observations.length} required upload controls accepted an exact-limit PDF and rejected a one-byte-over PDF without clearing unrelated state.`,
      stoppingPoint: 'Step 7 upload size validation',
      blockerId: unsupported.length ? 'UPLOAD-RULE-AR-02' : null,
      blockerReason: unsupported.length
        ? `${unsupported.length} required upload controls lack a safely executable declared size boundary.`
        : null,
      owner: unsupported.length ? 'product/business + operations/data + QA/reviewer' : null,
      extra: { boundaryContracts, observations, unsupported },
    };
  });
});

test(accessCaseTitle('TC-AR-U05', 'replaces a reviewed file without retaining the previous filename'), async ({}, testInfo) => {
  await runLiveAccessCase(testInfo, {
    caseId: 'TC-AR-U05',
    resultType: 'Characterization',
    expected: 'Replacing a file removes the previous file identity and invalidates dependent review state.',
    step: 7,
    branch: 'replace-upload',
  }, async ({ page }) => {
    requireCapturedStepsFieldMap();
    await reachStep7(page);
    const { required } = await requiredUploads(page);
    const requiredIds = required.map((upload) => upload.inputId);
    const observations = [];
    const unassociated = [];
    for (const inputId of requiredIds) {
      const current = await visibleUploadFields(page, 7);
      for (const upload of current.filter((item) => item.required)) await uploadSyntheticFile(upload, validFile);
      const target = current.find((upload) => upload.inputId === inputId);
      if (!target) throw new Error(`Required upload ${inputId} disappeared before replacement validation.`);
      const currentConfirmations = await associatedUploadConfirmations(target);
      if (!currentConfirmations.length) unassociated.push(inputId);
      for (const confirmation of currentConfirmations) await confirmation.checkbox.check();
      const replacements = await uploadSyntheticFile(target, replacementFile);
      expect(replacements).toHaveLength(1);
      expect(replacements[0].name).toBe(path.basename(replacementFile));
      const staleConfirmations = [];
      for (const confirmation of currentConfirmations) {
        if (await confirmation.checkbox.isChecked()) staleConfirmations.push(confirmation.label);
      }
      expect(staleConfirmations).toEqual([]);
      observations.push({ inputId, replacements, staleConfirmations });
    }
    return {
      status: unassociated.length ? 'BLOCKED' : 'PASS',
      observed: `Each of ${observations.length} required uploads was replaced independently; associated confirmations were invalidated where the form exposes an association.`,
      stoppingPoint: 'Step 7 after upload replacement',
      blockerId: unassociated.length ? 'UPLOAD-CONFIRMATION-AR-01' : null,
      blockerReason: unassociated.length
        ? `${unassociated.length} required uploads expose no field-local review confirmation association.`
        : null,
      owner: unassociated.length ? 'product/business + operations/data + QA/reviewer' : null,
      extra: { observations, unassociated },
    };
  });
});

test(accessCaseTitle('TC-AR-U06', 'removes a reviewed file and invalidates related confirmations'), async ({}, testInfo) => {
  await runLiveAccessCase(testInfo, {
    caseId: 'TC-AR-U06',
    resultType: 'Characterization',
    expected: 'Removing selected evidence clears the file and any related review confirmation.',
    step: 7,
    branch: 'remove-upload',
  }, async ({ page }) => {
    requireCapturedStepsFieldMap();
    await reachStep7(page);
    const { required } = await requiredUploads(page);
    const requiredIds = required.map((upload) => upload.inputId);
    const observations = [];
    const missingRemovalControls = [];
    const unassociated = [];
    for (const inputId of requiredIds) {
      const current = await visibleUploadFields(page, 7);
      for (const upload of current.filter((item) => item.required)) await uploadSyntheticFile(upload, validFile);
      const target = current.find((upload) => upload.inputId === inputId);
      if (!target) throw new Error(`Required upload ${inputId} disappeared before removal validation.`);
      const currentConfirmations = await associatedUploadConfirmations(target);
      if (!currentConfirmations.length) unassociated.push(inputId);
      for (const confirmation of currentConfirmations) await confirmation.checkbox.check();
      const removeControl = target.field.locator('button, a').filter({ hasText: /remove|delete|clear/i }).first();
      if (!await removeControl.count()) {
        missingRemovalControls.push(inputId);
        continue;
      }
      await removeControl.click();
      const files = await target.input.evaluate((input) => input.files?.length ?? 0);
      expect(files).toBe(0);
      const staleConfirmations = [];
      for (const confirmation of currentConfirmations) {
        if (await confirmation.checkbox.isChecked()) staleConfirmations.push(confirmation.label);
      }
      expect(staleConfirmations).toEqual([]);
      observations.push({ inputId, staleConfirmations });
    }
    return {
      status: missingRemovalControls.length || unassociated.length ? 'BLOCKED' : 'PASS',
      observed: `${observations.length} required uploads were removed independently; related confirmations were checked where the form exposes an association.`,
      stoppingPoint: 'Step 7 after upload removal',
      blockerId: missingRemovalControls.length ? 'UPLOAD-REMOVE-AR-01' : unassociated.length ? 'UPLOAD-CONFIRMATION-AR-01' : null,
      blockerReason: missingRemovalControls.length
        ? `${missingRemovalControls.length} required upload controls expose no identifiable removal action.`
        : unassociated.length
          ? `${unassociated.length} required uploads expose no field-local review confirmation association.`
          : null,
      owner: missingRemovalControls.length || unassociated.length
        ? 'product/business + operations/data + QA/reviewer'
        : null,
      extra: { observations, missingRemovalControls, unassociated },
    };
  });
});
test(accessCaseTitle('TC-AR-D04', 'characterizes request-specific supporting documents'), async ({}, testInfo) => {
  await runLiveAccessCase(testInfo, {
    caseId: 'TC-AR-D04',
    resultType: 'Characterization',
    expected: 'Request-specific supporting document fields are identified separately from saved-document sources.',
    step: 8,
    branch: 'request-specific-document',
  }, async ({ page }) => {
    requireCapturedStepsFieldMap();
    await reachStep(page, 8);
    const uploads = await visibleUploadFields(page, 8);
    const requestSpecific = uploads.filter(isRequestSpecificUpload);
    if (!requestSpecific.length) {
      throw new AccessRequestBlockedError('No request-specific document field was identified in the captured branch.', {
        blockerId: 'DOCUMENT-UI-AR-01',
        blockerReason: 'The request-specific document UI is absent or not identified in the captured branch.',
        owner: 'product/business + operations/data + QA/reviewer',
      });
    }
    const evidence = [];
    for (const upload of requestSpecific) evidence.push(...await uploadSyntheticFile(upload, validFile));
    return {
      observed: `${requestSpecific.length} request-specific document fields were identified and populated with synthetic evidence.`,
      stoppingPoint: 'Step 8 request-specific document characterization',
      extra: {
        fields: requestSpecific.map(({ inputId, label, required, accept }) => ({ inputId, label, required, accept })),
        evidence,
      },
    };
  });
});
