import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

import {
  ACCESS_CASE_CATALOG,
  EXPLORATORY_ACCESS_CASE_IDS,
  ACCESS_LIVE_CASE_FILE_MAP,
  IMPLEMENTED_ACCESS_CASE_IDS,
  STEPS_5_TO_8_CASE_IDS,
  accessCaseTitle,
  accessProbeTitle,
  caseMetadataForCase,
  coveredStepsForCase,
  probeStepsForCase,
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
  assert.equal(
    accessProbeTitle('TC-AR-X01', 'captures cross-workflow candidates'),
    'TC-AR-X01 [Exploratory Access Request Step 1] captures cross-workflow candidates',
  );
  assert.deepEqual(probeStepsForCase('TC-AR-P01'), [3]);
  assert.deepEqual(probeStepsForCase('TC-AR-X01'), [1]);
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
  const personProbeIds = [
    'TC-AR-P01', 'TC-AR-P02', 'TC-AR-P03', 'TC-AR-P04', 'TC-AR-P05',
  ];
  const copyProbeIds = [
    'TC-AR-C01', 'TC-AR-C02', 'TC-AR-C03', 'TC-AR-C04',
    'TC-AR-C05', 'TC-AR-C06', 'TC-AR-C07', 'TC-AR-C08',
  ];
  const crossWorkflowProbeIds = ['TC-AR-X01', 'TC-AR-X02', 'TC-AR-X03'];
  const exploratoryIds = [...personProbeIds, ...copyProbeIds, ...crossWorkflowProbeIds];
  const mappedIds = Object.keys(ACCESS_LIVE_CASE_FILE_MAP).sort();

  assert.equal(IMPLEMENTED_ACCESS_CASE_IDS.length, 48);
  assert.equal(new Set(IMPLEMENTED_ACCESS_CASE_IDS).size, 48);
  assert.equal(ACCESS_BROWSER_CASE_IDS.length, 34);
  assert.deepEqual(EXPLORATORY_ACCESS_CASE_IDS, exploratoryIds);
  assert.deepEqual(mappedIds, [...browserIds, ...exploratoryIds].sort());

  for (const caseId of ACCESS_BROWSER_CASE_IDS) {
    const metadata = caseMetadataForCase(caseId);
    assert.ok(metadata, `${caseId} has metadata`);
    assert.ok(metadata.capability, `${caseId} has a capability`);
    assert.ok(metadata.executionMode, `${caseId} has an execution mode`);
    assert.ok(metadata.risk, `${caseId} has a risk classification`);
    assert.ok(metadata.prerequisites.length > 0, `${caseId} has prerequisites`);
    assert.ok(existsSync(resolve('tests/access-requests', metadata.testFile)), `${caseId} file exists`);
  }

  for (const caseId of personProbeIds) {
    const metadata = caseMetadataForCase(caseId);
    assert.equal(metadata.capability, 'person-context');
    assert.equal(metadata.executionMode, 'exploratory');
    assert.deepEqual(metadata.prerequisites, ['authenticated-session', 'captured-field-map']);
    assert.deepEqual(metadata.probeSteps, [3]);
    assert.ok(existsSync(resolve('tests/access-requests', metadata.testFile)), `${caseId} probe file exists`);
  }

  for (const caseId of copyProbeIds) {
    const metadata = caseMetadataForCase(caseId);
    assert.equal(metadata.capability, 'copy-and-reuse');
    assert.equal(metadata.executionMode, 'exploratory');
    assert.deepEqual(metadata.prerequisites, ['authenticated-session', 'captured-field-map']);
    assert.deepEqual(metadata.probeSteps, [3]);
    assert.ok(existsSync(resolve('tests/access-requests', metadata.testFile)), `${caseId} probe file exists`);
  }

  for (const caseId of crossWorkflowProbeIds) {
    const metadata = caseMetadataForCase(caseId);
    assert.equal(metadata.capability, 'cross-workflow');
    assert.equal(metadata.executionMode, 'exploratory');
    assert.deepEqual(metadata.prerequisites, ['authenticated-session', 'captured-field-map']);
    assert.deepEqual(metadata.probeSteps, [1]);
    assert.ok(existsSync(resolve('tests/access-requests', metadata.testFile)), `${caseId} probe file exists`);
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

  const expectedIds = [...ACCESS_BROWSER_CASE_IDS, ...EXPLORATORY_ACCESS_CASE_IDS];
  assert.equal(discoveredIds.length, expectedIds.length);
  assert.deepEqual([...new Set(discoveredIds)].sort(), expectedIds.sort());
});
