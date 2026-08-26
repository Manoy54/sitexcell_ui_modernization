import { expect } from '@playwright/test';
import { execFileSync } from 'node:child_process';
import { ACCESS_FORM, FINAL_SUBMIT, STEP } from './selectors.js';

export const ACCESS_REQUEST_URL = process.env.ACCESS_REQUEST_URL
  ?? 'https://co-siter.com.au/access-requests/';
export const TEST_SITE = process.env.ACCESS_TEST_SITE_LABEL ?? 'The CRM Carpenters Test';
export const TEST_BUILDING = process.env.ACCESS_TEST_BUILDING
  ?? 'The CRM Carpenters Test Building, Redbank, QLD, 4301';

export class AccessRequestBlockedError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AccessRequestBlockedError';
  }
}

export async function inspectAccessRequestAvailability(page) {
  await page.goto(ACCESS_REQUEST_URL, { waitUntil: 'load' });
  const landedUrl = page.url();
  const expectedPath = new URL(ACCESS_REQUEST_URL).pathname;
  const landedPath = new URL(landedUrl).pathname;
  const formVisible = await page.locator(ACCESS_FORM).isVisible();

  return {
    available: landedPath === expectedPath && formVisible,
    expectedUrl: ACCESS_REQUEST_URL,
    landedUrl,
    formVisible,
    reason: landedPath !== expectedPath
      ? `Expected ${expectedPath} but landed on ${landedPath}.`
      : formVisible ? null : `${ACCESS_FORM} was not rendered.`,
  };
}

export async function openAccessRequestForm(page) {
  const availability = await inspectAccessRequestAvailability(page);
  if (!availability.available) {
    throw new AccessRequestBlockedError(
      `Access Request execution blocked: ${availability.reason} Refresh the approved authenticated test session.`,
    );
  }

  await expect(page.locator(ACCESS_FORM)).toBeVisible({ timeout: 30_000 });
  await expect(page.locator(STEP[1])).toBeVisible();
  await expect(page.locator(FINAL_SUBMIT)).toBeHidden();
}

export async function testEnvironment(page) {
  return {
    browser: 'Microsoft Edge',
    viewport: page.viewportSize(),
    url: page.url(),
    commit: process.env.ACCESS_COMMIT
      ?? execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(),
    configuration: 'tests/access-requests/configs/playwright.live.config.js',
  };
}

export async function findTestSiteSelect(page) {
  const selects = page.locator(`${STEP[1]} select`);
  let matchingIndex = -1;

  await expect.poll(async () => {
    const count = await selects.count();
    for (let index = 0; index < count; index += 1) {
      const hasTestSite = await selects.nth(index).locator('option').evaluateAll(
        (options, siteLabel) => options.some((option) => option.textContent.trim() === siteLabel),
        TEST_SITE,
      );
      if (hasTestSite) {
        matchingIndex = index;
        return matchingIndex;
      }
    }
    return -1;
  }, {
    timeout: 15_000,
    message: `The approved test Site "${TEST_SITE}" is unavailable on Access Request Step 1.`,
  }).toBeGreaterThanOrEqual(0);

  return selects.nth(matchingIndex);
}

export async function visibleValidationMessages(page) {
  return page.locator(`${ACCESS_FORM} .validation_message:visible`).allTextContents();
}

export async function attachJson(testInfo, name, value) {
  await testInfo.attach(name, {
    body: JSON.stringify(value, null, 2),
    contentType: 'application/json',
  });
}

export async function attachCaseResult(testInfo, page, {
  caseId,
  resultType,
  status,
  startedAt,
  expected,
  observed,
  stoppingPoint,
  finalSubmissionAttempted,
  firstFailure = null,
  extra = {},
}) {
  const evidenceName = `${caseId}.json`;
  await attachJson(testInfo, evidenceName, {
    caseId,
    suiteWave: 'Core',
    resultType,
    status,
    durationMs: Date.now() - startedAt,
    environment: await testEnvironment(page),
    expected,
    observed,
    firstFailure,
    evidence: [evidenceName],
    findingIds: [],
    recommendationIds: [],
    runId: process.env.ACCESS_RUN_ID ?? null,
    stoppingPoint,
    finalSubmissionAttempted,
    capturedAt: new Date().toISOString(),
    ...extra,
  });
}
