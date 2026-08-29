import { execFileSync } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

import {
  ACCESS_REQUEST_URL,
  inspectAccessRequestAvailability,
} from './form-helpers.js';
import {
  captureStepsFieldMap,
  renderFieldMapMarkdown,
} from './field-map.js';
import { installFinalSubmissionGuard } from './safety-guards.js';
import { connectToAuthenticatedContext } from './session.js';

const jsonPath = resolve('docs/testing/access-request/steps-5-8-field-map.json');
const markdownPath = resolve('docs/testing/access-request/steps-5-8-field-map.md');

process.env.ACCESS_STORAGE_STATE ??= resolve('.auth/access-request-storage-state.json');

const { browser, context, ownsBrowser } = await connectToAuthenticatedContext();
const page = await context.newPage();
const wasFinalSubmissionAttempted = await installFinalSubmissionGuard(page);

try {
  const availability = await inspectAccessRequestAvailability(page);
  const base = {
    schemaVersion: 1,
    capturedAt: new Date().toISOString(),
    targetUrl: ACCESS_REQUEST_URL,
    landedUrl: availability.landedUrl,
    accountClassification: 'approved authenticated session',
    commit: execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(),
    safety: {
      approvedBoundary: 'Step 8 review; final submission prohibited',
      locatorGuardInstalled: true,
      networkGuardInstalled: true,
      finalSubmissionAttempted: await wasFinalSubmissionAttempted(),
    },
  };
  const capturedSteps = availability.available ? await captureStepsFieldMap(page) : [];
  const completeCapture = capturedSteps.length === 4
    && capturedSteps.every((step) => step.fields.length > 0);
  const fieldMap = completeCapture
    ? { ...base, status: 'captured', steps: capturedSteps }
    : {
      ...base,
      status: 'blocked',
      blocker: {
        id: availability.available ? 'FIELD-MAP-AR-01' : 'AUTH-AR-01',
        reason: availability.available
          ? 'One or more Steps 5–8 were not present in the captured form DOM.'
          : availability.reason,
      },
      steps: capturedSteps.length
        ? capturedSteps
        : [5, 6, 7, 8].map((step) => ({ step, fields: [] })),
    };

  await mkdir(dirname(jsonPath), { recursive: true });
  await writeFile(jsonPath, `${JSON.stringify(fieldMap, null, 2)}\n`);
  await writeFile(markdownPath, renderFieldMapMarkdown(fieldMap));

  console.log(`Field map JSON: ${jsonPath}`);
  console.log(`Field map Markdown: ${markdownPath}`);
  if (!completeCapture) process.exitCode = 2;
} finally {
  await page.close();
  if (ownsBrowser) await browser.close();
}
