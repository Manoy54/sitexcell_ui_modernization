import assert from 'node:assert/strict';
import test from 'node:test';

import {
  validateAccessDocumentation,
  validateExploratoryDocumentation,
} from '../support/documentation-freshness.js';
import { EXPLORATORY_ACCESS_CASE_IDS } from '../support/case-catalog.js';

const runId = 'test-The-CRM-Carpenters-000080-20260902T021521360Z';
const result = {
  schemaVersion: 2,
  run: {
    runId,
    completedAt: '2026-09-02T02:50:05.000Z',
    fieldMap: { schemaVersion: 2, capturedAt: '2026-09-02T02:00:00.000Z', steps: 8, controls: 8, fields: 8 },
    fieldRuleLedger: {
      schemaVersion: 1,
      sourceFieldMapCapturedAt: '2026-09-02T02:00:00.000Z',
      technicalInventoryOnly: 8,
      evidenceBackedFields: 0,
    },
  },
  summary: {
    matrixCases: 64,
    classifiedCases: 64,
    implementedCases: 48,
    decisionBlockers: 5,
    plannedOnlyCases: 16,
  },
  safety: { finalSubmissionAttempted: false, finalSubmissionCompleted: false },
};
const fieldMap = {
  schemaVersion: 2,
  status: 'captured',
  capturedAt: '2026-09-02T02:00:00.000Z',
  steps: [1, 2, 3, 4, 5, 6, 7, 8].map((step) => ({ step, fields: [{ id: `input_${step}` }] })),
};
const fieldRuleLedger = {
  schemaVersion: 1,
  sourceFieldMapCapturedAt: fieldMap.capturedAt,
  summary: { fields: 8, controls: 8, technicalInventoryOnly: 8, evidenceBackedFields: 0 },
  rows: fieldMap.steps.map(({ step }) => ({ fieldKey: `step-${step}:field_${step}` })),
};

test('accepts synchronized execution facts, field inventory, and narrative run markers', () => {
  const narratives = {
    'test-summary.md': `Current evidence run: \`${runId}\``,
    'analysis.md': `Current evidence run: \`${runId}\``,
  };
  assert.deepEqual(validateAccessDocumentation({ result, fieldMap, fieldRuleLedger, narratives }), []);
});

test('rejects stale or misleading Access Request artifacts', () => {
  const errors = validateAccessDocumentation({
    result: {
      ...result,
      schemaVersion: 1,
      summary: { plannedCases: 40 },
      safety: { finalSubmissionAttempted: true },
    },
    fieldMap: {
      ...fieldMap,
      steps: fieldMap.steps.filter((item) => item.step >= 5),
      capturedAt: '2026-09-03T00:00:00.000Z',
    },
    fieldRuleLedger: {
      ...fieldRuleLedger,
      sourceFieldMapCapturedAt: '2026-09-01T00:00:00.000Z',
      summary: { fields: 1, controls: 1 },
    },
    narratives: {
      'test-summary.md': 'Current evidence run: `an-older-run`',
    },
  });

  assert.ok(errors.some((item) => /result schema version 2/i.test(item)));
  assert.ok(errors.some((item) => /missing field-map steps 1, 2, 3, 4/i.test(item)));
  assert.ok(errors.some((item) => /older than the field map/i.test(item)));
  assert.ok(errors.some((item) => /field\/rule ledger is not synchronized/i.test(item)));
  assert.ok(errors.some((item) => /matrixCases must equal 64/i.test(item)));
  assert.ok(errors.some((item) => /final submission attempt/i.test(item)));
  assert.ok(errors.some((item) => /test-summary\.md does not reference/i.test(item)));
});

test('accepts a separately committed exploratory result without promoting planned cases', () => {
  const exploratoryRunId = 'test-The-CRM-Carpenters-000130-20260905T130755200Z';
  const exploratoryResult = {
    schemaVersion: 2,
    run: { runId: exploratoryRunId },
    summary: {
      selectedCases: 16,
      exploratoryProbes: 16,
      plannedOnlyCases: 16,
      zeroSubmissionConfirmed: true,
    },
    safety: {
      finalSubmissionAttempted: false,
      finalSubmissionCompleted: false,
    },
    cases: EXPLORATORY_ACCESS_CASE_IDS.map((caseId) => ({
      caseId,
      status: caseId === 'TC-AR-P01' ? 'PASS' : 'BLOCKED',
      owner: caseId === 'TC-AR-P01' ? null : 'product/business',
      finalSubmissionAttempted: false,
    })),
  };
  const narratives = Object.fromEntries(
    ['test-summary.md', 'analysis.md', 'test-case-matrix.md', 'findings.md', 'recommendations.md']
      .map((name) => [name, `Focused evidence run: \`${exploratoryRunId}\``]),
  );

  assert.deepEqual(validateExploratoryDocumentation({ result: exploratoryResult, narratives }), []);
});
