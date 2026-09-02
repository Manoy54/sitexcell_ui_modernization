import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import { buildFieldRuleLedger, renderFieldRuleLedgerMarkdown } from '../support/field-rule-ledger.js';

test('assigns every captured control to one explicit owner-review field row', async () => {
  const fieldMap = JSON.parse(await readFile('docs/testing/access-request/steps-1-8-field-map.json', 'utf8'));
  const ledger = buildFieldRuleLedger(fieldMap);
  const capturedControls = fieldMap.steps.reduce((count, step) => count + step.fields.length, 0);
  const assignedControls = ledger.rows.reduce((count, row) => count + row.controlIds.length, 0);

  assert.equal(ledger.schemaVersion, 1);
  assert.equal(ledger.summary.steps, 8);
  assert.equal(ledger.summary.controls, capturedControls);
  assert.equal(assignedControls, capturedControls);
  assert.equal(new Set(ledger.rows.map((row) => row.fieldKey)).size, ledger.rows.length);
  assert.ok(ledger.rows.every((row) => row.owner && row.blockerId));
  assert.ok(ledger.rows.every((row) => row.coverageState === 'technical-inventory-only'));
  assert.ok(ledger.rows.every((row) => row.evidenceCaseIds.length === 0));
});

test('renders the unresolved field state without claiming evidence coverage', () => {
  const markdown = renderFieldRuleLedgerMarkdown({
    sourceFieldMapCapturedAt: '2026-09-02T00:00:00.000Z',
    summary: { fields: 1, controls: 1, evidenceBackedFields: 0 },
    rows: [{
      fieldKey: 'step-1:field_3_407', labels: ['Site'], controlTypes: ['select-one'],
      requiredByTechnicalCapture: true, owner: 'product', oracle: 'missing-decision',
      coverageState: 'technical-inventory-only', candidateCaseIds: ['TC-AR-S01'], blockerId: 'FIELD-RULE-AR-1-FIELD_3_407',
    }],
  });
  assert.match(markdown, /Evidence-backed fields: 0/);
  assert.match(markdown, /technical-inventory-only/);
  assert.doesNotMatch(markdown, /Acceptance pass/);
});
