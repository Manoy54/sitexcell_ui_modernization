import { expect } from '@playwright/test';
import { execFileSync } from 'node:child_process';

import { caseMetadataForCase, coveredStepsForCase } from './case-catalog.js';
import { ACCESS_FORM, FINAL_SUBMIT, STEP } from './selectors.js';

export const ACCESS_REQUEST_URL = process.env.ACCESS_REQUEST_URL
  ?? 'https://co-siter.com.au/access-requests/';
export const TEST_SITE = process.env.ACCESS_TEST_SITE_LABEL ?? 'The CRM Carpenters Test';
export const TEST_BUILDING = process.env.ACCESS_TEST_BUILDING
  ?? 'The CRM Carpenters Test Building, Redbank, QLD, 4301';

export class AccessRequestBlockedError extends Error {
  constructor(message, {
    blockerId = 'AUTH-AR-01',
    blockerReason = message,
    owner = null,
  } = {}) {
    super(message);
    this.name = 'AccessRequestBlockedError';
    this.blockerId = blockerId;
    this.blockerReason = blockerReason;
    this.owner = owner;
  }
}

export async function inspectAccessRequestAvailability(page) {
  try {
    await page.goto(ACCESS_REQUEST_URL, { waitUntil: 'domcontentloaded' });
  } catch (error) {
    // Cloudflare can abort the first navigation while its challenge script
    // replaces the document. A retry is safe; any other navigation error must
    // remain visible to the test as a genuine execution failure.
    if (!String(error?.message ?? error).includes('net::ERR_ABORTED')) throw error;
    await page.waitForTimeout(1_000);
    await page.goto(ACCESS_REQUEST_URL, { waitUntil: 'domcontentloaded' });
  }
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
      { owner: 'security/privacy + QA/reviewer' },
    );
  }

  await expect(page.locator(ACCESS_FORM)).toBeVisible({ timeout: 30_000 });
  await expect(page.locator(STEP[1])).toBeVisible();
  await expect(page.locator(FINAL_SUBMIT)).toBeHidden();
}

export async function testEnvironment(page) {
  return {
    browser: 'Microsoft Edge',
    viewport: page?.viewportSize?.() ?? null,
    url: page?.url?.() ?? ACCESS_REQUEST_URL,
    commit: process.env.ACCESS_COMMIT
      ?? execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(),
    trackedWorktreeDirty: process.env.ACCESS_TRACKED_WORKTREE_DIRTY === 'true',
    configuration: process.env.ACCESS_CONFIG_FILE
      ?? 'tests/access-requests/configs/playwright.access-request.config.js',
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

export async function captureAccessProgress(page) {
  if (!page || page.isClosed()) return { closed: true };
  return {
    url: page.url(),
    visibleSteps: await page.locator('[id^="gform_page_3_"]:visible').evaluateAll(
      (steps) => steps.map((step) => step.id),
    ),
    loadingVisible: await page.locator('#loading').isVisible().catch(() => false),
    visibleNextButtons: await page.locator(`${ACCESS_FORM} .gform_next_button:visible`).count(),
  };
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
  suiteWave = 'Steps 1-8',
  step = null,
  branch = null,
  blockerId = null,
  blockerReason = null,
  owner = null,
  retryOutcome = null,
  timings = {},
  findingIds = [],
  recommendationIds = [],
  coveredSteps = coveredStepsForCase(caseId),
  extra = {},
}) {
  const caseMetadata = caseMetadataForCase(caseId) ?? {};
  const evidenceName = `${caseId}.json`;
  await attachJson(testInfo, evidenceName, {
    caseId,
    capability: caseMetadata.capability ?? null,
    executionMode: caseMetadata.executionMode ?? null,
    risk: caseMetadata.risk ?? null,
    prerequisites: caseMetadata.prerequisites ?? [],
    suiteWave,
    resultType,
    status,
    step,
    coveredSteps,
    branch,
    durationMs: Date.now() - startedAt,
    environment: await testEnvironment(page),
    ...extra,
    entryPoint: caseMetadata.entryPoint ?? 'Authenticated Access Request Step 1',
    expected,
    observed,
    startingPoint: caseMetadata.entryPoint ?? 'Authenticated Access Request Step 1',
    firstFailure,
    retryOutcome,
    evidence: [evidenceName],
    findingIds,
    recommendationIds,
    blockerId,
    blockerReason,
    owner,
    timings,
    runId: process.env.ACCESS_RUN_ID ?? null,
    stoppingPoint,
    locatorGuardInstalled: true,
    networkGuardInstalled: true,
    finalSubmitClicked: false,
    finalSubmissionAttempted,
    finalSubmissionCompleted: false,
    syntheticDataPolicySatisfied: true,
    fixture: {
      version: 1,
      profile: 'synthetic-access-request',
      runId: process.env.ACCESS_RUN_ID ?? null,
    },
    capturedAt: new Date().toISOString(),
  });
}
