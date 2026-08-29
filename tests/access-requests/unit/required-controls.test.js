import assert from 'node:assert/strict';
import test from 'node:test';

import { syntheticValueForField } from '../support/required-controls.js';

const runId = 'test-The-CRM-Carpenters-000040-20260829T110000000Z';

test('chooses deterministic synthetic values by public field semantics', () => {
  assert.equal(syntheticValueForField({ type: 'email', label: 'Contact email' }, runId), 'access.request@example.invalid');
  assert.equal(syntheticValueForField({ type: 'tel', label: 'Contact number' }, runId), '0400000099');
  assert.equal(syntheticValueForField({ type: 'time', label: 'Start time' }, runId), '09:00');
  assert.equal(syntheticValueForField({ type: 'number', min: '2', label: 'Worker count' }, runId), '2');
  assert.equal(syntheticValueForField({ type: 'text', label: 'Project reference' }, runId), runId);
  assert.equal(syntheticValueForField({ type: 'text', label: 'Description' }, runId), 'Synthetic Access Request test value');
  assert.match(syntheticValueForField({ type: 'date', label: 'Access date' }, runId), /^\d{2}-\d{2}-\d{4}$/);
});
