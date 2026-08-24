import { expect, test } from '@playwright/test';
import {
  ADDITIONAL_UPLOAD,
  REPLACEMENT_UPLOAD,
  REQUIRED_UPLOAD,
  attachJson,
  fillPageTwoCore,
  openPageTwo,
  selectedFileNames,
} from '../../support/form-helpers.js';
import { connectToAuthenticatedContext, installFinalSubmissionGuard } from '../../support/session.js';

async function assertPageTwoCoreValues(page, valuesBySelector) {
  for (const [selector, value] of Object.entries(valuesBySelector)) {
    await expect(page.locator(selector)).toHaveValue(value);
  }
}

test('preserves access details and confirmation state across upload recovery cases', async ({}, testInfo) => {
  const { browser, context, ownsBrowser } = await connectToAuthenticatedContext();
  const page = await context.newPage();
  const wasFinalSubmissionAttempted = await installFinalSubmissionGuard(page);

  try {
    await test.step('replaces the required LAAN file without clearing access details', async () => {
      await openPageTwo(page);
      const valuesBySelector = await fillPageTwoCore(page, 'UPLOAD-REPLACE');
      const requiredUpload = page.locator('#input_1_49');
      const uploadConfirmation = page.locator('#input_1_29_1');

      await requiredUpload.setInputFiles(REQUIRED_UPLOAD);
      await expect.poll(() => selectedFileNames(requiredUpload)).toEqual(['synthetic-laan-attachment.txt']);
      await expect(uploadConfirmation).not.toBeChecked();

      await requiredUpload.setInputFiles(REPLACEMENT_UPLOAD);
      await expect.poll(() => selectedFileNames(requiredUpload)).toEqual(['synthetic-laan-replacement.txt']);
      await assertPageTwoCoreValues(page, valuesBySelector);

      await uploadConfirmation.check();
      await expect(uploadConfirmation).toBeChecked();
      await expect.poll(() => selectedFileNames(requiredUpload)).toEqual(['synthetic-laan-replacement.txt']);

      await attachJson(testInfo, 'laan-required-upload-replacement.json', {
        originalFile: 'synthetic-laan-attachment.txt',
        replacementFile: 'synthetic-laan-replacement.txt',
        accessDetailsPreserved: true,
        confirmationRequiredSeparately: true,
        capturedAt: new Date().toISOString(),
      });
      expect(wasFinalSubmissionAttempted()).toBe(false);
    });
    await test.step('clears the required LAAN file without clearing access details', async () => {
      await openPageTwo(page);
      const valuesBySelector = await fillPageTwoCore(page, 'UPLOAD-CLEAR');
      const requiredUpload = page.locator('#input_1_49');
      const uploadConfirmation = page.locator('#input_1_29_1');

      await requiredUpload.setInputFiles(REQUIRED_UPLOAD);
      await uploadConfirmation.check();
      await requiredUpload.setInputFiles([]);

      await expect.poll(() => selectedFileNames(requiredUpload)).toEqual([]);
      await assertPageTwoCoreValues(page, valuesBySelector);
      const confirmationCheckedAfterRemoval = await uploadConfirmation.isChecked();

      await attachJson(testInfo, 'laan-required-upload-clear.json', {
        fileCleared: true,
        accessDetailsPreserved: true,
        confirmationCheckedAfterRemoval,
        interpretation: confirmationCheckedAfterRemoval
          ? 'The file control and declaration can become inconsistent before final validation.'
          : 'The declaration follows the cleared file state.',
        capturedAt: new Date().toISOString(),
      });
      expect(wasFinalSubmissionAttempted()).toBe(false);
    });
    await test.step('accepts multiple supporting documents without submitting', async () => {
      await openPageTwo(page);
      const additionalField = page.locator('#field_1_59');
      const additionalInput = additionalField.locator('input[type="file"]');

      expect(await additionalInput.evaluate((input) => input.multiple)).toBe(true);
      await additionalInput.setInputFiles([ADDITIONAL_UPLOAD, REPLACEMENT_UPLOAD]);
      await expect.poll(
        () => additionalField.locator('.gfield_fileupload_filename').allTextContents(),
        { timeout: 30_000 },
      ).toEqual(expect.arrayContaining([
        'synthetic-additional-document.txt',
        'synthetic-laan-replacement.txt',
      ]));

      const visibleFileNames = await additionalField.locator('.gfield_fileupload_filename').allTextContents();
      await expect(page.locator('#gform_submit_button_1')).toBeVisible();

      await attachJson(testInfo, 'laan-additional-documents-multiple.json', {
        selectedFiles: ['synthetic-additional-document.txt', 'synthetic-laan-replacement.txt'],
        visibleFileNames,
        capturedAt: new Date().toISOString(),
        stoppingPoint: 'Stage 2 before final submission',
      });
      expect(wasFinalSubmissionAttempted()).toBe(false);
    });

    expect(wasFinalSubmissionAttempted()).toBe(false);
  } finally {
    await page.close();
    if (ownsBrowser) await browser.close();
  }
});
