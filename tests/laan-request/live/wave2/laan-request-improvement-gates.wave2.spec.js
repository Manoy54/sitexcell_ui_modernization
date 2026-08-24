import { expect, test } from '@playwright/test';
import {
  REQUIRED_UPLOAD,
  REPLACEMENT_UPLOAD,
  completePageOne,
  fillPageTwoCore,
  openLaanForm,
  openPageTwo,
  readPageOneState,
  selectedFileNames,
} from '../../support/form-helpers.js';
import { connectToAuthenticatedContext, installFinalSubmissionGuard } from '../../support/session.js';

test('goal gate: removing a confirmed required upload invalidates its confirmation', async ({}, testInfo) => {
  const { browser, context, ownsBrowser } = await connectToAuthenticatedContext();
  const page = await context.newPage();
  const wasFinalSubmissionAttempted = await installFinalSubmissionGuard(page);

  try {
    await openPageTwo(page);
    await fillPageTwoCore(page, 'UPLOAD-GATE');

    const requiredUpload = page.locator('#input_1_49');
    const uploadConfirmation = page.locator('#input_1_29_1');
    await requiredUpload.setInputFiles(REQUIRED_UPLOAD);
    await uploadConfirmation.check();
    await expect(uploadConfirmation).toBeChecked();

    await requiredUpload.setInputFiles([]);
    await expect.poll(() => selectedFileNames(requiredUpload)).toEqual([]);

    await testInfo.attach('laan-upload-confirmation-goal-gate.json', {
      body: JSON.stringify({
        fileNames: await selectedFileNames(requiredUpload),
        confirmationChecked: await uploadConfirmation.isChecked(),
        capturedAt: new Date().toISOString(),
        resultType: 'acceptance',
      }, null, 2),
      contentType: 'application/json',
    });

    await expect(uploadConfirmation, 'Removing the required file must invalidate its confirmation.').not.toBeChecked();
    expect(wasFinalSubmissionAttempted()).toBe(false);
  } finally {
    await page.close();
    if (ownsBrowser) await browser.close();
  }
});

test('goal gate: replacing a confirmed required upload requires re-review', async ({}, testInfo) => {
  const { browser, context, ownsBrowser } = await connectToAuthenticatedContext();
  const page = await context.newPage();
  const wasFinalSubmissionAttempted = await installFinalSubmissionGuard(page);

  try {
    await openPageTwo(page);
    await fillPageTwoCore(page, 'UPLOAD-REPLACE-GATE');

    const requiredUpload = page.locator('#input_1_49');
    const uploadConfirmation = page.locator('#input_1_29_1');
    await requiredUpload.setInputFiles(REQUIRED_UPLOAD);
    await uploadConfirmation.check();
    await expect(uploadConfirmation).toBeChecked();

    await requiredUpload.setInputFiles(REPLACEMENT_UPLOAD);
    await expect.poll(() => selectedFileNames(requiredUpload)).toEqual(['synthetic-laan-replacement.txt']);

    await testInfo.attach('laan-upload-replacement-goal-gate.json', {
      body: JSON.stringify({
        fileNames: await selectedFileNames(requiredUpload),
        confirmationChecked: await uploadConfirmation.isChecked(),
        capturedAt: new Date().toISOString(),
        resultType: 'acceptance',
      }, null, 2),
      contentType: 'application/json',
    });

    await expect(uploadConfirmation, 'Replacing the required file must require confirmation again.').not.toBeChecked();
    expect(wasFinalSubmissionAttempted()).toBe(false);
  } finally {
    await page.close();
    if (ownsBrowser) await browser.close();
  }
});

test('goal gate: reload preserves the completed Stage 1 request context', async ({}, testInfo) => {
  const { browser, context, ownsBrowser } = await connectToAuthenticatedContext();
  const page = await context.newPage();
  const wasFinalSubmissionAttempted = await installFinalSubmissionGuard(page);

  try {
    await openLaanForm(page);
    await completePageOne(page);
    const beforeReload = await readPageOneState(page);

    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(page.locator('#gform_page_1_1')).toBeVisible({ timeout: 30_000 });
    const afterReload = await readPageOneState(page);

    await testInfo.attach('laan-stage-one-reload-goal-gate.json', {
      body: JSON.stringify({
        beforeReload,
        afterReload,
        capturedAt: new Date().toISOString(),
        resultType: 'acceptance',
      }, null, 2),
      contentType: 'application/json',
    });

    expect(afterReload, 'Reload must preserve the completed Stage 1 context.').toEqual(beforeReload);
    expect(wasFinalSubmissionAttempted()).toBe(false);
  } finally {
    await page.close();
    if (ownsBrowser) await browser.close();
  }
});

test('goal gate: reload preserves completed Stage 2 access details and active stage', async ({}, testInfo) => {
  const { browser, context, ownsBrowser } = await connectToAuthenticatedContext();
  const page = await context.newPage();
  const wasFinalSubmissionAttempted = await installFinalSubmissionGuard(page);

  try {
    await openPageTwo(page);
    const beforeReload = await fillPageTwoCore(page, 'STAGE-TWO-RELOAD-GATE');

    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(page.locator('#gform_1')).toBeVisible({ timeout: 30_000 });
    await expect(page.locator('#gform_page_1_2'), 'Reload must retain the active Stage 2 context.').toBeVisible();

    const afterReload = {};
    for (const selector of Object.keys(beforeReload)) {
      afterReload[selector] = await page.locator(selector).inputValue();
    }

    await testInfo.attach('laan-stage-two-reload-goal-gate.json', {
      body: JSON.stringify({
        beforeReload,
        afterReload,
        capturedAt: new Date().toISOString(),
        resultType: 'acceptance',
      }, null, 2),
      contentType: 'application/json',
    });

    expect(afterReload, 'Reload must preserve completed Stage 2 access details.').toEqual(beforeReload);
    expect(wasFinalSubmissionAttempted()).toBe(false);
  } finally {
    await page.close();
    if (ownsBrowser) await browser.close();
  }
});
