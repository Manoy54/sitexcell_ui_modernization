import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

import {
  ACCESS_CASE_CATALOG,
  ACCESS_LIVE_CASE_FILE_MAP,
  IMPLEMENTED_ACCESS_CASE_IDS,
  STEPS_5_TO_8_CASE_IDS,
  accessCaseTitle,
  caseMetadataForCase,
  coveredStepsForCase,
} from '../support/case-catalog.js';
import {
  ACCESS_BROWSER_CASE_IDS,
  ACCESS_DECISION_BLOCKERS,
  ACCESS_DERIVED_CASE_SOURCES,
} from '../support/coverage-model.js';

test('names Access Request cases with their covered step range', () => {
  assert.equal(
    accessCaseTitle('TC-AR-001', 'opens the authenticated Access Request'),
    'TC-AR-001 [Step 1] opens the authenticated Access Request',
  );
  assert.equal(
    accessCaseTitle('TC-AR-005', 'preserves values across navigation'),
    'TC-AR-005 [Steps 1–8] preserves values across navigation',
  );
  assert.equal(
    accessCaseTitle('TC-AR-U01', 'rejects a missing upload'),
    'TC-AR-U01 [Step 7] rejects a missing upload',
  );
});

test('every implemented Steps 5–8 case has explicit step coverage', () => {
  const catalogIds = new Set(ACCESS_CASE_CATALOG.map((item) => item.id));
  for (const caseId of STEPS_5_TO_8_CASE_IDS) {
    assert.equal(catalogIds.has(caseId), true, `${caseId} is in the catalog`);
    assert.ok(coveredStepsForCase(caseId).length > 0, `${caseId} has covered steps`);
  }
});

test('maps every browser case to one existing capability test file', () => {
  const browserIds = [...ACCESS_BROWSER_CASE_IDS].sort();
  const mappedIds = Object.keys(ACCESS_LIVE_CASE_FILE_MAP).sort();

  assert.equal(IMPLEMENTED_ACCESS_CASE_IDS.length, 48);
  assert.equal(new Set(IMPLEMENTED_ACCESS_CASE_IDS).size, 48);
  assert.equal(ACCESS_BROWSER_CASE_IDS.length, 34);
  assert.deepEqual(mappedIds, browserIds);

  for (const caseId of ACCESS_BROWSER_CASE_IDS) {
    const metadata = caseMetadataForCase(caseId);
    assert.ok(metadata, `${caseId} has metadata`);
    assert.ok(metadata.capability, `${caseId} has a capability`);
    assert.ok(metadata.executionMode, `${caseId} has an execution mode`);
    assert.ok(metadata.risk, `${caseId} has a risk classification`);
    assert.ok(metadata.prerequisites.length > 0, `${caseId} has prerequisites`);
    assert.ok(existsSync(resolve('tests/access-requests', metadata.testFile)), `${caseId} file exists`);
  }

  for (const caseId of [
    ...Object.keys(ACCESS_DERIVED_CASE_SOURCES),
    ...ACCESS_DECISION_BLOCKERS.map((item) => item.caseId),
  ]) {
    assert.equal(caseMetadataForCase(caseId).testFile, null, `${caseId} has no browser declaration`);
  }
});

test('discovers each browser case declaration exactly once', () => {
  const output = execFileSync(
    process.execPath,
    [
      'node_modules/@playwright/test/cli.js',
      'test',
      '--config=tests/access-requests/configs/playwright.access-request.config.js',
      '--list',
    ],
    { encoding: 'utf8' },
  );
  const discoveredIds = [...output.matchAll(/\b(TC-AR-[A-Z0-9-]+)\b/g)].map((match) => match[1]);

  assert.equal(discoveredIds.length, ACCESS_BROWSER_CASE_IDS.length);
  assert.deepEqual([...new Set(discoveredIds)].sort(), [...ACCESS_BROWSER_CASE_IDS].sort());
});
