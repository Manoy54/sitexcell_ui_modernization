import assert from 'node:assert/strict';
import { test } from 'node:test';

import { changedStateIds, stateItemMatchesControl } from '../support/step-state.js';

test('reports added, removed, and changed control state IDs', () => {
  const before = [
    { id: 'unchanged', type: 'text', value: 'same' },
    { id: 'changed', type: 'text', value: 'before' },
    { id: 'removed', type: 'text', value: 'gone' },
  ];
  const after = [
    { id: 'unchanged', type: 'text', value: 'same' },
    { id: 'changed', type: 'text', value: 'after' },
    { id: 'added', type: 'text', value: 'new' },
  ];

  assert.deepEqual(changedStateIds(before, after), ['changed', 'removed', 'added']);
});

test('reports no state changes for equivalent snapshots', () => {
  const state = [{ id: 'control', type: 'checkbox', value: true }];
  assert.deepEqual(changedStateIds(state, [...state]), []);
});

test('matches regenerated HTML5 upload controls by their stable field identity', () => {
  assert.equal(
    stateItemMatchesControl(
      { id: 'field_3_444:file:0' },
      { id: 'html5_generated-id', fieldId: 'field_3_444' },
    ),
    true,
  );
  assert.equal(
    stateItemMatchesControl(
      { id: 'field_3_445:file:0' },
      { id: 'html5_generated-id', fieldId: 'field_3_444' },
    ),
    false,
  );
});
