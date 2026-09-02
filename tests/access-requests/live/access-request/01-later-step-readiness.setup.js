import { expect, test } from '@playwright/test';
import path from 'node:path';

import { requireCapturedStepsFieldMap } from '../../support/field-map-gate.js';
import { openAccessRequestForm } from '../../support/form-helpers.js';
import { installFinalSubmissionGuard } from '../../support/safety-guards.js';
import {
  closeSharedAuthenticatedBrowser,
  connectToAuthenticatedContext,
} from '../../support/session.js';
import { STEP } from '../../support/selectors.js';
import { startAtStep5 } from '../../support/journeys/access-request-journeys.js';

const uploadPath = path.resolve('tests/access-requests/fixtures/synthetic-access-document.pdf');

async function attachPrerequisite(testInfo, evidence) {
  await testInfo.attach('AR-PREREQ-STEP5.json', {
    body: Buffer.from(JSON.stringify(evidence, null, 2)),
    contentType: 'application/json',
  });
}

test('AR-PREREQ-STEP5 reaches the later-step execution boundary once', async ({}, testInfo) => {
  const startedAt = Date.now();
  const { browser, context, ownsBrowser, ownsContext } = await connectToAuthenticatedContext();
  const page = await context.newPage();
  const wasFinalSubmissionAttempted = await installFinalSubmissionGuard(page);

  try {
    try {
      const fieldMap = requireCapturedStepsFieldMap();
      await openAccessRequestForm(page);
      await startAtStep5(page, { uploadPath });
      await expect(page.locator(STEP[5])).toBeVisible({ timeout: 30_000 });
      const finalSubmissionAttempted = await wasFinalSubmissionAttempted();
      expect(finalSubmissionAttempted).toBe(false);
      await attachPrerequisite(testInfo, {
        prerequisiteId: 'AR-PREREQ-STEP5',
        status: 'PASS',
        observed: 'The controlled baseline reached Step 5 with submission guards intact.',
        blockerId: null,
        blockerReason: null,
        fieldMapCapturedAt: fieldMap.capturedAt ?? null,
        durationMs: Date.now() - startedAt,
        finalSubmissionAttempted,
        executed: true,
      });
    } catch (error) {
      const finalSubmissionAttempted = await wasFinalSubmissionAttempted();
      await attachPrerequisite(testInfo, {
        prerequisiteId: 'AR-PREREQ-STEP5',
        status: 'BLOCKED',
        observed: 'The shared controlled baseline did not reach the Step 5 execution boundary.',
        blockerId: error.blockerId ?? 'STEP5-READINESS-AR-01',
        blockerReason: error.blockerReason ?? String(error?.message ?? error),
        durationMs: Date.now() - startedAt,
        finalSubmissionAttempted,
        executed: true,
      });
      throw error;
    }
  } finally {
    await page.close();
    if (ownsContext) await context.close();
    if (ownsBrowser) await browser.close();
    if (ownsContext && !ownsBrowser) await closeSharedAuthenticatedBrowser();
  }
});
