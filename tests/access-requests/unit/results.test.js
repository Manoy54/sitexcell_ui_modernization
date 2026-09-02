import assert from 'node:assert/strict';
import test from 'node:test';

import {
  buildConsolidatedResult,
  consolidatePlaywrightReport,
  extractDeclaredCases,
  extractCaseResults,
  extractPrerequisiteResults,
  materializeCoverageResults,
  sanitizeForCommit,
} from '../support/results.js';
import {
  ACCESS_CASE_CATALOG,
  STEPS_5_TO_8_CASE_IDS,
} from '../support/case-catalog.js';

const passingCase = {
  caseId: 'TC-AR-006',
  suiteWave: 'Steps 5-8',
  resultType: 'Acceptance',
  status: 'PASS',
  step: 8,
  branch: 'valid-pre-submit',
  expected: 'The synthetic request reaches review without submitting.',
  observed: 'Step 8 review was visible and final Submit remained untouched.',
  stoppingPoint: 'Step 8 review',
  finalSubmissionAttempted: false,
  capturedAt: '2026-08-29T00:00:00.000Z',
};

test('builds the stable Access Request result contract from case evidence', () => {
  const result = buildConsolidatedResult({
    run: {
      runId: 'test-The-CRM-Carpenters-000001-20260829T000000000Z',
      targetUrl: 'https://co-siter.com.au/access-requests/',
      commit: 'abc123',
      configuration: 'tests/access-requests/configs/playwright.steps-1-8.config.js',
      browser: 'Microsoft Edge',
      viewport: { width: 1280, height: 720 },
      accountClassification: 'approved authenticated session',
      startedAt: '2026-08-29T00:00:00.000Z',
      completedAt: '2026-08-29T00:01:00.000Z',
      fixtureVersion: 1,
    },
    cases: [passingCase],
  });

  assert.equal(result.schemaVersion, 2);
  assert.deepEqual(result.summary, {
    matrixCases: 64,
    classifiedCases: 64,
    selectedCases: 1,
    plannedCases: 64,
    implementedCases: 48,
    automatedDeclarations: 1,
    executableCases: 1,
    executedCases: 1,
    acceptancePasses: 1,
    characterizations: 0,
    measurements: 0,
    derivedResults: 0,
    decisionBlockers: 5,
    plannedOnlyCases: 16,
    passed: 1,
    failed: 0,
    blocked: 0,
    inconclusive: 0,
    notApplicable: 0,
    zeroSubmissionConfirmed: true,
    waveStatus: 'PASS',
  });
  assert.deepEqual(result.safety, {
    approvedBoundary: 'Step 8 review; final submission prohibited',
    locatorGuardInstalled: true,
    networkGuardInstalled: true,
    finalSubmitClicked: false,
    finalSubmissionAttempted: false,
    finalSubmissionCompleted: false,
    syntheticDataPolicySatisfied: true,
  });
  assert.deepEqual(result.cases, [passingCase]);
  assert.deepEqual(result.findings, []);
  assert.deepEqual(result.recommendations, []);
  assert.deepEqual(result.blockers, []);
});

test('extracts stable case attachments from a Playwright JSON report', () => {
  const report = {
    suites: [{
      specs: [{
        tests: [{
          results: [{
            attachments: [
              {
                name: 'TC-AR-006.json',
                contentType: 'application/json',
                body: Buffer.from(JSON.stringify(passingCase)).toString('base64'),
              },
              {
                name: 'trace',
                contentType: 'application/zip',
                path: 'local-only-trace.zip',
              },
            ],
          }],
        }],
      }],
    }],
  };

  assert.deepEqual(extractCaseResults(report), [passingCase]);
});

test('propagates a later-step readiness blocker without repeating the browser journey', () => {
  const prerequisite = {
    prerequisiteId: 'AR-PREREQ-STEP5',
    status: 'BLOCKED',
    blockerId: 'STEP5-READINESS-AR-01',
    blockerReason: 'The controlled baseline did not reach Step 5.',
    observed: 'Step 4 remained visible after progression.',
    executed: true,
  };
  const report = {
    stats: { startTime: '2026-09-02T00:00:00.000Z', duration: 1_000 },
    suites: [{
      specs: [
        {
          title: 'AR-PREREQ-STEP5 reaches the later-step execution boundary',
          tests: [{ status: 'unexpected', results: [{ attachments: [{
            name: 'AR-PREREQ-STEP5.json',
            body: Buffer.from(JSON.stringify(prerequisite)).toString('base64'),
          }] }] }],
        },
        {
          title: 'TC-AR-005 preserves values while navigating',
          tests: [{ status: 'skipped', results: [] }],
        },
      ],
    }],
  };

  assert.deepEqual(extractPrerequisiteResults(report), [prerequisite]);
  const result = consolidatePlaywrightReport(report, { plannedCases: 1, fixtureVersion: 1 });
  const blocked = result.cases.find((item) => item.caseId === 'TC-AR-005');
  assert.equal(blocked.status, 'BLOCKED');
  assert.equal(blocked.executed, false);
  assert.equal(blocked.blockerId, 'STEP5-READINESS-AR-01');
  assert.deepEqual(result.prerequisites, [prerequisite]);
});

test('classifies dependency-skipped declarations as blocked without counting them as executed', () => {
  const blockedCase = {
    ...passingCase,
    caseId: 'TC-AR-001',
    suiteWave: 'Core',
    status: 'BLOCKED',
    blockerId: 'AUTH-AR-01',
    blockerReason: 'The approved session did not reach the Access Request route.',
    runId: 'test-The-CRM-Carpenters-000003-20260829T000000000Z',
    environment: {
      browser: 'Microsoft Edge',
      viewport: { width: 1280, height: 720 },
      url: 'https://co-siter.com.au/',
      commit: 'abc123',
      configuration: 'tests/access-requests/configs/playwright.live.config.js',
    },
  };
  const report = {
    config: { configFile: 'C:\\workspace\\tests\\access-requests\\configs\\playwright.steps-1-8.config.js' },
    stats: { startTime: '2026-08-29T00:00:00.000Z', duration: 1_000 },
    suites: [{
      specs: [
        {
          title: 'TC-AR-001 opens the authenticated Access Request without submitting',
          tests: [{ status: 'unexpected', results: [{
            attachments: [{
              name: 'TC-AR-001.json',
              body: Buffer.from(JSON.stringify(blockedCase)).toString('base64'),
            }],
          }] }],
        },
        {
          title: 'TC-AR-006 reaches the valid Step 8 review state without submitting',
          tests: [{ status: 'skipped', results: [] }],
        },
      ],
    }],
  };

  assert.deepEqual(extractDeclaredCases(report), [
    { caseId: 'TC-AR-001', title: 'TC-AR-001 opens the authenticated Access Request without submitting' },
    { caseId: 'TC-AR-006', title: 'TC-AR-006 reaches the valid Step 8 review state without submitting' },
  ]);
  const result = consolidatePlaywrightReport(report, { plannedCases: 2, fixtureVersion: 1 });
  assert.equal(result.summary.matrixCases, 64);
  assert.equal(result.summary.selectedCases, 2);
  assert.equal(result.summary.implementedCases, 48);
  assert.equal(result.summary.automatedDeclarations, 2);
  assert.equal(result.summary.executedCases, 1);
  assert.equal(result.summary.blocked, 1);
  assert.equal(result.summary.decisionBlockers, 5);
  assert.equal(result.summary.waveStatus, 'BLOCKED');
  assert.equal(result.cases.find((item) => item.caseId === 'TC-AR-006').executed, false);
  assert.deepEqual(result.blockers.find((item) => item.id === 'AUTH-AR-01'), {
    id: 'AUTH-AR-01',
    reason: 'The approved session did not reach the Access Request route.',
    caseIds: ['TC-AR-001', 'TC-AR-006'],
  });
});

test('removes authentication material and local paths from committed results', () => {
  const sanitized = sanitizeForCommit({
    run: {
      storageState: { cookies: [{ name: 'wordpress', value: 'secret' }] },
      authorization: 'Bearer secret',
    },
    cases: [{
      caseId: 'TC-AR-006',
      contactEmail: 'worker@example.invalid',
      leakedEmail: 'person@example.com',
      evidence: ['C:\\Users\\tester\\trace.zip', 'evidence/TC-AR-006.json'],
      message: 'failed at C:\\Users\\tester\\repo\\file.js:12',
      rawValues: { name: 'Sensitive Person' },
    }],
  });

  assert.deepEqual(sanitized, {
    run: {},
    cases: [{
      caseId: 'TC-AR-006',
      contactEmail: 'worker@example.invalid',
      leakedEmail: '[REDACTED_EMAIL]',
      evidence: ['[LOCAL_ARTIFACT]', 'evidence/TC-AR-006.json'],
      message: 'failed at [LOCAL_PATH]',
    }],
  });
});

test('consolidates Playwright evidence without treating a partial run as complete', () => {
  const caseWithEnvironment = {
    ...passingCase,
    runId: 'test-The-CRM-Carpenters-000002-20260829T000000000Z',
    environment: {
      browser: 'Microsoft Edge',
      viewport: { width: 1280, height: 720 },
      url: 'https://co-siter.com.au/access-requests/',
      commit: 'abc123',
      configuration: 'tests/access-requests/configs/playwright.live.config.js',
    },
  };
  const report = {
    config: {
      configFile: 'C:\\workspace\\tests\\access-requests\\configs\\playwright.steps-1-8.config.js',
    },
    stats: {
      startTime: '2026-08-29T00:00:00.000Z',
      duration: 60_000,
    },
    suites: [{
      specs: [{
        tests: [{
          results: [{
            attachments: [{
              name: 'TC-AR-006.json',
              contentType: 'application/json',
              body: Buffer.from(JSON.stringify(caseWithEnvironment)).toString('base64'),
            }],
          }],
        }],
      }],
    }],
  };

  const result = consolidatePlaywrightReport(report, {
    plannedCases: 17,
    fixtureVersion: 1,
  });

  assert.equal(result.run.runId, caseWithEnvironment.runId);
  assert.equal(
    result.run.configuration,
    'tests/access-requests/configs/playwright.access-request.config.js',
  );
  assert.equal(
    result.cases[0].environment.configuration,
    'tests/access-requests/configs/playwright.access-request.config.js',
  );
  assert.equal(result.cases[0].capability, 'journey');
  assert.equal(result.cases[0].executionMode, 'e2e');
  assert.equal(result.cases[0].risk, 'high');
  assert.deepEqual(result.cases[0].prerequisites, ['authenticated-session', 'captured-field-map']);
  assert.equal(
    result.cases[0].testFile,
    'live/access-request/journeys/complete-review-path.spec.js',
  );
  assert.deepEqual(result.cases[0].coveredSteps, [1, 2, 3, 4, 5, 6, 7, 8]);
  assert.equal(result.run.completedAt, '2026-08-29T00:01:00.000Z');
  assert.equal(result.summary.matrixCases, 64);
  assert.equal(result.summary.selectedCases, 17);
  assert.equal(result.summary.implementedCases, 48);
  assert.equal(result.summary.executedCases, 1);
  assert.equal(result.summary.waveStatus, 'PARTIAL');
});

test('keeps the approved 64-case matrix and the Steps 5-8 scope explicit', () => {
  assert.equal(ACCESS_CASE_CATALOG.length, 64);
  assert.equal(new Set(ACCESS_CASE_CATALOG.map((item) => item.id)).size, 64);
  assert.deepEqual(
    STEPS_5_TO_8_CASE_IDS.slice(0, 6),
    ['TC-AR-005', 'TC-AR-006', 'TC-AR-B03', 'TC-AR-B05', 'TC-AR-B06', 'TC-AR-B08'],
  );
  assert.ok(STEPS_5_TO_8_CASE_IDS.includes('TC-AR-U07'));
  assert.ok(STEPS_5_TO_8_CASE_IDS.includes('TC-AR-A05'));
});

test('promotes blocked case evidence into the consolidated blocker register', () => {
  const result = buildConsolidatedResult({
    run: {},
    cases: [{
      ...passingCase,
      status: 'BLOCKED',
      blockerId: 'AUTH-AR-01',
      blockerReason: 'The authenticated Access Request form was unavailable.',
    }],
  });

  assert.deepEqual(result.blockers, [{
    id: 'AUTH-AR-01',
    reason: 'The authenticated Access Request form was unavailable.',
    caseIds: ['TC-AR-006'],
  }]);
});

test('materializes derived evidence and decision blockers without inventing browser execution', () => {
  const sources = [
    { ...passingCase, caseId: 'TC-AR-005' },
    { ...passingCase, caseId: 'TC-AR-U05' },
    { ...passingCase, caseId: 'TC-AR-E02', resultType: 'Efficiency' },
    { ...passingCase, caseId: 'TC-AR-A01', status: 'FAIL' },
    { ...passingCase, caseId: 'TC-AR-R03' },
  ];

  const materialized = materializeCoverageResults(sources);
  const byId = new Map(materialized.map((item) => [item.caseId, item]));

  assert.equal(materialized.length, 19);
  assert.deepEqual(byId.get('TC-AR-R01').sourceCaseIds, ['TC-AR-005']);
  assert.equal(byId.get('TC-AR-R01').derived, true);
  assert.equal(byId.get('TC-AR-R01').executed, false);
  assert.equal(byId.get('TC-AR-D03').status, 'PASS');
  assert.equal(byId.get('TC-AR-E08').status, 'FAIL');
  assert.equal(byId.get('TC-AR-E08').resultType, 'Derived evidence');

  const decision = byId.get('TC-AR-R04');
  assert.equal(decision.status, 'BLOCKED');
  assert.equal(decision.executed, false);
  assert.equal(decision.resultType, 'Decision');
  assert.equal(decision.blockerId, 'DECISION-AR-DRAFT');
  assert.match(decision.owner, /product\/business/);
});

test('separates matrix, declaration, execution, derived, and decision counts', () => {
  const cases = materializeCoverageResults([
    { ...passingCase, caseId: 'TC-AR-001' },
    { ...passingCase, caseId: 'TC-AR-005', status: 'FAIL' },
    { ...passingCase, caseId: 'TC-AR-E02', resultType: 'Efficiency' },
  ]);
  const result = buildConsolidatedResult({
    run: {},
    cases,
    selectedCases: 3,
    declaredCaseIds: ['TC-AR-001', 'TC-AR-005', 'TC-AR-E02'],
  });

  assert.equal(result.schemaVersion, 2);
  assert.deepEqual(result.summary, {
    matrixCases: 64,
    classifiedCases: 64,
    selectedCases: 3,
    plannedCases: 64,
    implementedCases: 48,
    automatedDeclarations: 3,
    executableCases: 3,
    executedCases: 3,
    acceptancePasses: 1,
    characterizations: 0,
    measurements: 1,
    derivedResults: 5,
    decisionBlockers: 5,
    plannedOnlyCases: 16,
    passed: 2,
    failed: 1,
    blocked: 0,
    inconclusive: 0,
    notApplicable: 0,
    zeroSubmissionConfirmed: true,
    waveStatus: 'FAIL',
  });
});
