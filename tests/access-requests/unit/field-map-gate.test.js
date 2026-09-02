import assert from 'node:assert/strict';
import test from 'node:test';

import { validateCapturedFieldMap } from '../support/field-map-gate.js';

function fieldMap(steps) {
  return {
    schemaVersion: 2,
    status: 'captured',
    capturedAt: '2026-09-02T00:00:00.000Z',
    steps: steps.map((step) => ({ step, fields: [{ id: `input_${step}` }] })),
  };
}

test('requires a non-empty authenticated inventory for every Access Request step', () => {
  assert.deepEqual(validateCapturedFieldMap(fieldMap([1, 2, 3, 4, 5, 6, 7, 8])), {
    valid: true,
    missingSteps: [],
    emptySteps: [],
  });
  assert.deepEqual(validateCapturedFieldMap(fieldMap([5, 6, 7, 8])), {
    valid: false,
    missingSteps: [1, 2, 3, 4],
    emptySteps: [],
  });
  assert.deepEqual(validateCapturedFieldMap({
    ...fieldMap([1, 2, 3, 4, 5, 6, 7, 8]),
    steps: fieldMap([1, 2, 3, 4, 5, 6, 7, 8]).steps.map((item) => (
      item.step === 4 ? { ...item, fields: [] } : item
    )),
  }), {
    valid: false,
    missingSteps: [],
    emptySteps: [4],
  });
});
