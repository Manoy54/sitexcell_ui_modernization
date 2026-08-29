import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';
import path from 'node:path';

import { accessCaseTitle } from '../../support/case-catalog.js';
import { advanceFromStep, completeBaselineThroughStep4 } from '../../support/access-request-path.js';
import { AccessRequestBlockedError, visibleValidationMessages } from '../../support/form-helpers.js';
import { requireCapturedStepsFieldMap } from '../../support/field-map-gate.js';
import { runLiveAccessCase } from '../../support/live-case.js';
import { completeStepAndAdvance, completeVisibleRequiredControls } from '../../support/required-controls.js';
import { previousButton, STEP, nextButton } from '../../support/selectors.js';
import { snapshotStepState } from '../../support/step-state.js';
import {
  declaredMaximumBytes,
  relevantConfirmations,
  uploadSyntheticFile,
  visibleUploadFields,
} from '../../support/upload-controls.js';

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

async function reachStep7(page) {
  await completeBaselineThroughStep4(page);
  await advanceFromStep(page, 4);
  await completeStepAndAdvance(page, 5, { uploadPath: validFile });
  await completeStepAndAdvance(page, 6, { uploadPath: validFile });
  await expect(page.locator(STEP[7])).toBeVisible();
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
      },
    );
  }
  return { uploads, required };
}

test(accessCaseTitle('TC-AR-U01', 'rejects a missing required Step 7 upload'), async ({}, testInfo) => {
  await runLiveAccessCase(testInfo, {
    caseId: 'TC-AR-U01',
    resultType: 'Acceptance',
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
    resultType: 'Acceptance',
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
    resultType: 'Acceptance',
    expected: 'A file outside the declared accepted types is rejected with specific feedback.',
    step: 7,
    branch: 'invalid-upload-type',
  }, async ({ page }) => {
    requireCapturedStepsFieldMap();
    await reachStep7(page);
    const { required } = await requiredUploads(page);
    const target = required.find((upload) => upload.accept && !upload.accept.toLowerCase().includes('.txt'));
    if (!target) {
      throw new AccessRequestBlockedError(
        'Upload type rejection cannot be asserted because the live field declares no incompatible type.',
        { blockerId: 'UPLOAD-RULE-AR-01', blockerReason: 'The live accepted-type contract is unavailable.' },
      );
    }
    await uploadSyntheticFile(target, invalidFile);
    await completeVisibleRequiredControls(page, 7, { uploadPath: validFile });
    await nextButton(page, 7).click();
    await expect(page.locator(STEP[7])).toBeVisible({ timeout: 30_000 });
    const messages = await visibleValidationMessages(page);
    expect(messages.length).toBeGreaterThan(0);
    return {
      observed: 'The disallowed synthetic text file did not progress beyond Step 7.',
      stoppingPoint: 'Step 7 invalid-type validation',
      extra: { uploadId: target.inputId, accept: target.accept, messages },
    };
  });
});

test(accessCaseTitle('TC-AR-U04', 'enforces the declared upload size boundary'), async ({}, testInfo) => {
  await runLiveAccessCase(testInfo, {
    caseId: 'TC-AR-U04',
    resultType: 'Acceptance',
    expected: 'At-limit evidence is accepted and above-limit evidence is rejected without clearing unrelated state.',
    step: 7,
    branch: 'upload-size-boundary',
  }, async ({ page }) => {
    requireCapturedStepsFieldMap();
    await reachStep7(page);
    const { required } = await requiredUploads(page);
    const target = required.find((upload) => declaredMaximumBytes(upload));
    const maximumBytes = target ? declaredMaximumBytes(target) : null;
    if (!target || !maximumBytes) {
      throw new AccessRequestBlockedError(
        'Upload size-boundary execution requires a declared live maximum.',
        { blockerId: 'UPLOAD-RULE-AR-02', blockerReason: 'The live upload size limit is unavailable.' },
      );
    }
    if (maximumBytes > maximumSafeBoundaryFixtureBytes) {
      throw new AccessRequestBlockedError(
        `The declared ${maximumBytes}-byte limit exceeds the approved local boundary-fixture ceiling.`,
        {
          blockerId: 'UPLOAD-FIXTURE-AR-01',
          blockerReason: `The declared upload limit exceeds the ${maximumSafeBoundaryFixtureBytes}-byte safe fixture ceiling.`,
        },
      );
    }
    const atLimitBuffer = paddedPdfBuffer(maximumBytes);
    if (!atLimitBuffer) {
      throw new AccessRequestBlockedError(
        'The declared upload limit is smaller than the approved synthetic PDF fixture.',
        {
          blockerId: 'UPLOAD-FIXTURE-AR-02',
          blockerReason: 'An exact-boundary valid synthetic PDF cannot be constructed from the approved fixture.',
        },
      );
    }
    for (const upload of required) await uploadSyntheticFile(upload, validFile);
    await target.input.setInputFiles({
      name: 'synthetic-at-limit.pdf',
      mimeType: 'application/pdf',
      buffer: atLimitBuffer,
    });
    await completeVisibleRequiredControls(page, 7, { uploadPath: validFile });
    await nextButton(page, 7).click();
    await expect(page.locator(STEP[8])).toBeVisible({ timeout: 30_000 });
    await previousButton(page, 8).click();
    await expect(page.locator(STEP[7])).toBeVisible({ timeout: 30_000 });

    const refreshedUploads = await visibleUploadFields(page, 7);
    const refreshedTarget = refreshedUploads.find((upload) => upload.inputId === target.inputId);
    if (!refreshedTarget) throw new Error(`Upload input ${target.inputId} was unavailable after returning to Step 7.`);
    for (const upload of refreshedUploads.filter((item) => item.required)) {
      await uploadSyntheticFile(upload, validFile);
    }
    await refreshedTarget.input.setInputFiles({
      name: 'synthetic-above-limit.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.concat([atLimitBuffer, Buffer.from('x')]),
    });
    await completeVisibleRequiredControls(page, 7, { uploadPath: validFile });
    const beforeRejection = await snapshotStepState(page, 7);
    await nextButton(page, 7).click();
    await expect(page.locator(STEP[7])).toBeVisible({ timeout: 30_000 });
    const messages = await visibleValidationMessages(page);
    expect(messages.length).toBeGreaterThan(0);
    const afterRejection = await snapshotStepState(page, 7);
    expect(afterRejection.filter((item) => item.id !== refreshedTarget.inputId))
      .toEqual(beforeRejection.filter((item) => item.id !== refreshedTarget.inputId));
    return {
      observed: 'The exact-limit PDF reached Step 8; the one-byte-over PDF remained on Step 7 without clearing unrelated state.',
      stoppingPoint: 'Step 7 upload size validation',
      extra: { uploadId: target.inputId, maximumBytes, messages, beforeRejection, afterRejection },
    };
  });
});

test(accessCaseTitle('TC-AR-U05', 'replaces a reviewed file without retaining the previous filename'), async ({}, testInfo) => {
  await runLiveAccessCase(testInfo, {
    caseId: 'TC-AR-U05',
    resultType: 'Acceptance',
    expected: 'Replacing a file removes the previous file identity and invalidates dependent review state.',
    step: 7,
    branch: 'replace-upload',
  }, async ({ page }) => {
    requireCapturedStepsFieldMap();
    await reachStep7(page);
    const { required } = await requiredUploads(page);
    const target = required[0];
    await uploadSyntheticFile(target, validFile);
    const confirmations = await relevantConfirmations(page, 7);
    if (!confirmations.length) {
      throw new AccessRequestBlockedError(
        'No file-review confirmation was available for the replacement invalidation scenario.',
        {
          blockerId: 'UPLOAD-CONFIRMATION-AR-01',
          blockerReason: 'The live branch exposes no identifiable file-review confirmation on Step 7.',
        },
      );
    }
    for (const confirmation of confirmations) await confirmation.checkbox.check();
    const replacements = await uploadSyntheticFile(target, replacementFile);
    expect(replacements).toHaveLength(1);
    expect(replacements[0].name).toBe(path.basename(replacementFile));
    const staleConfirmations = [];
    for (const confirmation of confirmations) {
      if (await confirmation.checkbox.isChecked()) staleConfirmations.push(confirmation.label);
    }
    expect(staleConfirmations).toEqual([]);
    return {
      observed: 'The replacement synthetic file became the sole selected file and prior confirmations were invalidated.',
      stoppingPoint: 'Step 7 after upload replacement',
      extra: { uploadId: target.inputId, replacements, staleConfirmations },
    };
  });
});

test(accessCaseTitle('TC-AR-U06', 'removes a reviewed file and invalidates related confirmations'), async ({}, testInfo) => {
  await runLiveAccessCase(testInfo, {
    caseId: 'TC-AR-U06',
    resultType: 'Acceptance',
    expected: 'Removing selected evidence clears the file and any related review confirmation.',
    step: 7,
    branch: 'remove-upload',
  }, async ({ page }) => {
    requireCapturedStepsFieldMap();
    await reachStep7(page);
    const { required } = await requiredUploads(page);
    const target = required[0];
    await uploadSyntheticFile(target, validFile);
    const confirmations = await relevantConfirmations(page, 7);
    if (!confirmations.length) {
      throw new AccessRequestBlockedError(
        'No file-review confirmation was available for the removal invalidation scenario.',
        {
          blockerId: 'UPLOAD-CONFIRMATION-AR-01',
          blockerReason: 'The live branch exposes no identifiable file-review confirmation on Step 7.',
        },
      );
    }
    for (const confirmation of confirmations) await confirmation.checkbox.check();
    const removeControl = target.field.locator('button, a').filter({ hasText: /remove|delete|clear/i }).first();
    if (!await removeControl.count()) {
      throw new AccessRequestBlockedError(
        'No user-facing removal control was available for the reviewed-file removal scenario.',
        {
          blockerId: 'UPLOAD-REMOVE-AR-01',
          blockerReason: 'The live upload field has no identifiable removal control.',
        },
      );
    }
    await removeControl.click();
    const files = await target.input.evaluate((input) => input.files?.length ?? 0);
    expect(files).toBe(0);
    const staleConfirmations = [];
    for (const confirmation of confirmations) {
      if (await confirmation.checkbox.isChecked()) staleConfirmations.push(confirmation.label);
    }
    expect(staleConfirmations).toEqual([]);
    return {
      observed: 'The selected file was removed and no related confirmation remained checked.',
      stoppingPoint: 'Step 7 after upload removal',
      extra: { uploadId: target.inputId, staleConfirmations },
    };
  });
});

test(accessCaseTitle('TC-AR-U07', 'records controlled upload failure as blocked until staging controls exist'), async ({}, testInfo) => {
  await runLiveAccessCase(testInfo, {
    caseId: 'TC-AR-U07',
    resultType: 'Acceptance',
    expected: 'A controlled upload failure can be retried without losing unrelated state.',
    step: 7,
    branch: 'controlled-upload-failure',
  }, async () => {
    throw new AccessRequestBlockedError(
      'Controlled upload failure execution requires approved staging or fault-injection controls.',
      {
        blockerId: 'UPLOAD-STAGING-AR-01',
        blockerReason: 'Approved staging or upload fault-injection controls are unavailable.',
      },
    );
  });
});
