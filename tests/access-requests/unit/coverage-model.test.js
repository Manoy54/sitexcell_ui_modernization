import assert from 'node:assert/strict';
import test from 'node:test';

import {
  ACCESS_CASE_CATALOG,
  EXPLORATORY_ACCESS_CASE_IDS,
} from '../support/case-catalog.js';
import {
  ACCESS_BROWSER_CASE_IDS,
  ACCESS_COVERAGE_RECORDS,
  ACCESS_DECISION_BLOCKERS,
  ACCESS_DERIVED_CASE_SOURCES,
  coverageRecordForCase,
  summarizeCoverage,
} from '../support/coverage-model.js';

test('classifies every approved Access Request case without treating declarations as coverage', () => {
  assert.equal(ACCESS_CASE_CATALOG.length, 64);
  assert.equal(ACCESS_COVERAGE_RECORDS.length, 64);
  assert.equal(new Set(ACCESS_COVERAGE_RECORDS.map((item) => item.caseId)).size, 64);

  for (const { id } of ACCESS_CASE_CATALOG) {
    const record = coverageRecordForCase(id);
    assert.ok(record, `${id} has a coverage record`);
    assert.ok([1, 2].includes(record.phase), `${id} has a delivery phase`);
    assert.ok(
      ['acceptance', 'characterization', 'measurement', 'decision'].includes(record.oracle),
      `${id} has an oracle classification`,
    );
    assert.ok(
      ['smoke', 'regression', 'characterization', 'measurement', 'decision-register'].includes(record.tier),
      `${id} has an execution tier`,
    );
    assert.ok(
      ['browser', 'derived', 'decision', 'planned'].includes(record.automation),
      `${id} has an automation treatment`,
    );
  }
});

test('keeps browser, derived, decision, and planned states mutually exclusive', () => {
  const counts = ACCESS_COVERAGE_RECORDS.reduce((result, item) => {
    result[item.automation] += 1;
    return result;
  }, { browser: 0, derived: 0, decision: 0, planned: 0 });

  assert.deepEqual(counts, {
    browser: 34,
    derived: 9,
    decision: 5,
    planned: 16,
  });
  assert.equal(ACCESS_BROWSER_CASE_IDS.length, 34);
  assert.equal(Object.keys(ACCESS_DERIVED_CASE_SOURCES).length, 9);
  assert.equal(ACCESS_DECISION_BLOCKERS.length, 5);
  assert.equal(EXPLORATORY_ACCESS_CASE_IDS.length, 16);
  for (const caseId of EXPLORATORY_ACCESS_CASE_IDS) {
    assert.equal(coverageRecordForCase(caseId).automation, 'planned');
  }
});

test('maps derived evidence to executable source cases without cycles', () => {
  const browserIds = new Set(ACCESS_BROWSER_CASE_IDS);
  const derivedIds = new Set(Object.keys(ACCESS_DERIVED_CASE_SOURCES));

  for (const [caseId, sourceIds] of Object.entries(ACCESS_DERIVED_CASE_SOURCES)) {
    assert.ok(sourceIds.length > 0, `${caseId} names an evidence source`);
    assert.equal(browserIds.has(caseId), false, `${caseId} is not separately executed`);
    for (const sourceId of sourceIds) {
      assert.equal(derivedIds.has(sourceId), false, `${sourceId} is not another derived result`);
      assert.equal(browserIds.has(sourceId), true, `${sourceId} is executable`);
    }
  }
});

test('reports truthful matrix and evidence-state counts', () => {
  const summary = summarizeCoverage({
    declaredCaseIds: ['TC-AR-001', 'TC-AR-005', 'TC-AR-E02'],
    cases: [
      { caseId: 'TC-AR-001', resultType: 'Acceptance', status: 'PASS', executed: true },
      { caseId: 'TC-AR-005', resultType: 'Acceptance', status: 'FAIL', executed: true },
      { caseId: 'TC-AR-R01', resultType: 'Derived evidence', status: 'FAIL', executed: false, derived: true },
      { caseId: 'TC-AR-E02', resultType: 'Efficiency', status: 'PASS', executed: true },
    ],
  });

  assert.deepEqual(summary, {
    matrixCases: 64,
    classifiedCases: 64,
    automatedDeclarations: 3,
    exploratoryProbes: 0,
    executableCases: 3,
    executedCases: 3,
    acceptancePasses: 1,
    characterizations: 0,
    measurements: 1,
    derivedResults: 1,
    decisionBlockers: 5,
    plannedCases: 16,
  });
});

test('counts exploratory declarations without promoting planned rules or blocked measurements', () => {
  const summary = summarizeCoverage({
    declaredCaseIds: ['TC-AR-P01', 'TC-AR-C01', 'TC-AR-X01', 'TC-AR-X03'],
    cases: [
      { caseId: 'TC-AR-P01', resultType: 'Characterization', status: 'PASS', executed: true },
      { caseId: 'TC-AR-C01', resultType: 'Decision', status: 'BLOCKED', executed: true },
      { caseId: 'TC-AR-X01', resultType: 'Decision', status: 'BLOCKED', executed: true },
      { caseId: 'TC-AR-X03', resultType: 'Efficiency', status: 'BLOCKED', executed: true },
    ],
  });

  assert.equal(summary.automatedDeclarations, 4);
  assert.equal(summary.exploratoryProbes, 4);
  assert.equal(summary.executedCases, 4);
  assert.equal(summary.measurements, 0);
  assert.equal(summary.plannedCases, 16);
});
