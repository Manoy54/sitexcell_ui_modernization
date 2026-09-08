import assert from 'node:assert/strict';
import test from 'node:test';

import { keyboardTargetMatches } from '../support/accessibility.js';

test('matches any radio in the same keyboard-reachable radio group', () => {
  assert.equal(keyboardTargetMatches(
    { id: 'choice_3_54_1', name: 'input_54', type: 'radio', role: 'input' },
    { id: 'choice_3_54_0', name: 'input_54', type: 'radio', role: 'input' },
  ), true);
});

test('does not merge different radio groups or radio and non-radio controls', () => {
  assert.equal(keyboardTargetMatches(
    { id: 'choice-a', name: 'input_a', type: 'radio', role: 'input' },
    { id: 'choice-b', name: 'input_b', type: 'radio', role: 'input' },
  ), false);
  assert.equal(keyboardTargetMatches(
    { id: 'choice-a', name: 'input_a', type: 'radio', role: 'input' },
    { id: 'input_a', name: 'input_a', type: 'text', role: 'input' },
  ), false);
});

test('keeps individual non-radio controls matched by their stable id', () => {
  assert.equal(keyboardTargetMatches(
    { id: 'gform_next_button_3_419', name: null, type: 'button', role: 'button' },
    { id: 'gform_next_button_3_419', name: null, type: 'button', role: 'button' },
  ), true);
  assert.equal(keyboardTargetMatches(
    { id: 'gform_next_button_3_419', name: null, type: 'button', role: 'button' },
    { id: 'gform_previous_button_3_419', name: null, type: 'button', role: 'button' },
  ), false);
});
