import { expect, test } from '@playwright/test';
import {
  SYNTHETIC_SITE,
  SYNTHETIC_SITE_ID,
  attachJson,
  completePageOne,
  openLaanForm,
} from '../../support/form-helpers.js';
import { connectToAuthenticatedContext, installFinalSubmissionGuard } from '../../support/session.js';

async function visibleValidationMessages(page) {
  return page.locator('#gform_1 .validation_message:visible').allTextContents();
}

async function observeInvalidDateOutcome(page) {
  return Promise.any([
    page.locator('#field_1_12.gfield_error').waitFor({ state: 'visible', timeout: 30_000 })
      .then(() => 'inline-rejection'),
    page.locator('#gform_page_1_2').waitFor({ state: 'visible', timeout: 30_000 })
      .then(() => 'stage-two'),
    page.getByText('There has been a critical error on this website.', { exact: false })
      .waitFor({ state: 'visible', timeout: 30_000 })
      .then(() => 'critical-error'),
  ]).catch(() => 'unknown');
}

test('empty Stage 1 shows required-field feedback and does not advance', async ({}, testInfo) => {
  const { browser, context, ownsBrowser } = await connectToAuthenticatedContext();
  const page = await context.newPage();
  const wasFinalSubmissionAttempted = await installFinalSubmissionGuard(page);

  try {
    await openLaanForm(page);
    await page.locator('#gform_next_button_1_36').click();

    await expect(page.locator('#gform_page_1_1')).toBeVisible({ timeout: 30_000 });
    await expect(page.locator('#gform_page_1_2')).toBeHidden();
    await expect.poll(async () => (await visibleValidationMessages(page)).length).toBeGreaterThan(0);
    expect(wasFinalSubmissionAttempted()).toBe(false);

    await attachJson(testInfo, 'laan-empty-stage-one-validation.json', {
      messages: await visibleValidationMessages(page),
      capturedAt: new Date().toISOString(),
    });
  } finally {
    await page.close();
    if (ownsBrowser) await browser.close();
  }
});

test('missing terms preserves valid Stage 1 context and can be corrected', async ({}, testInfo) => {
  const { browser, context, ownsBrowser } = await connectToAuthenticatedContext();
  const page = await context.newPage();
  const wasFinalSubmissionAttempted = await installFinalSubmissionGuard(page);

  try {
    await openLaanForm(page);
    await completePageOne(page, { activity: 'Installation', acceptTerms: false });
    await page.locator('#gform_next_button_1_36').click();

    await expect(page.locator('#gform_page_1_1')).toBeVisible({ timeout: 30_000 });
    await expect(page.locator('#field_1_63')).toHaveClass(/gfield_error/);
    await expect(page.locator('#input_1_11')).toHaveValue('Installation');
    await expect(page.locator('#input_1_12')).toHaveValue('30-09-2026');
    await expect(page.locator('#input_1_41')).toHaveValue(SYNTHETIC_SITE_ID);
    await expect(page.locator('#choice_1_63_1')).not.toBeChecked();

    const messagesBeforeCorrection = await visibleValidationMessages(page);
    await page.locator('#choice_1_63_1').check();
    await page.locator('#gform_next_button_1_36').click();
    await expect(page.locator('#gform_page_1_2')).toBeVisible({ timeout: 30_000 });
    expect(wasFinalSubmissionAttempted()).toBe(false);

    await attachJson(testInfo, 'laan-terms-recovery.json', {
      preservedValues: {
        activity: 'Installation',
        commencementDate: '30-09-2026',
        site: SYNTHETIC_SITE,
      },
      messagesBeforeCorrection,
      correctedToStageTwo: true,
      capturedAt: new Date().toISOString(),
    });
  } finally {
    await page.close();
    if (ownsBrowser) await browser.close();
  }
});

test('malformed commencement date is rejected without clearing valid context', async ({}, testInfo) => {
  const { browser, context, ownsBrowser } = await connectToAuthenticatedContext();
  const page = await context.newPage();
  const wasFinalSubmissionAttempted = await installFinalSubmissionGuard(page);

  try {
    await openLaanForm(page);
    await page.locator('#input_1_11').selectOption({ label: 'Installation' });
    await page.locator('#input_1_12').fill('32-13-2026');
    await page.locator('#input_1_41').selectOption({ label: SYNTHETIC_SITE });
    await page.locator('#choice_1_63_1').check();
    await page.locator('#gform_next_button_1_36').click();

    const observedOutcome = await observeInvalidDateOutcome(page);
    const formVisible = await page.locator('#gform_1').isVisible();
    const stageOneVisible = await page.locator('#gform_page_1_1').isVisible();
    const stageTwoVisible = await page.locator('#gform_page_1_2').isVisible();
    const criticalErrorVisible = await page
      .getByText('There has been a critical error on this website.', { exact: false })
      .isVisible();
    const retainedDateValue = formVisible
      ? await page.locator('#input_1_12').inputValue().catch(() => null)
      : null;
    const messages = formVisible ? await visibleValidationMessages(page) : [];

    await attachJson(testInfo, 'laan-invalid-date-validation.json', {
      rejectedValue: '32-13-2026',
      messages,
      outcome: {
        observedOutcome,
        formVisible,
        stageOneVisible,
        stageTwoVisible,
        criticalErrorVisible,
        retainedDateValue,
        url: page.url(),
      },
      capturedAt: new Date().toISOString(),
    });

    expect(wasFinalSubmissionAttempted()).toBe(false);
    expect(
      criticalErrorVisible,
      `Malformed date produced a WordPress critical error instead of inline rejection. URL: ${page.url()}`,
    ).toBe(false);
    expect(formVisible, `LAAN form disappeared after malformed date. URL: ${page.url()}`).toBe(true);
    expect(
      stageTwoVisible,
      `Malformed date advanced to Stage 2 with retained value "${retainedDateValue}".`,
    ).toBe(false);
    expect(stageOneVisible).toBe(true);
    await expect(page.locator('#field_1_12')).toHaveClass(/gfield_error/);
    await expect(page.locator('#input_1_11')).toHaveValue('Installation');
    await expect(page.locator('#input_1_41')).toHaveValue(SYNTHETIC_SITE_ID);
    await expect(page.locator('#choice_1_63_1')).toBeChecked();
  } finally {
    await page.close();
    if (ownsBrowser) await browser.close();
  }
});
