import assert from 'node:assert/strict';
import test from 'node:test';

import { AccessRequestBlockedError } from '../support/form-helpers.js';
import { classifyLiveCaseError } from '../support/live-case.js';

test('classifies intentional live-case blockers without treating them as assertion failures', () => {
  const error = new AccessRequestBlockedError('Upload contract is unavailable.', {
    blockerId: 'UPLOAD-RULE-AR-01',
    blockerReason: 'The live accepted-type contract is unavailable.',
    owner: 'product/business + QA',
  });

  assert.deepEqual(classifyLiveCaseError(error, { step: 7 }), {
    status: 'BLOCKED',
    observed: 'The live accepted-type contract is unavailable.',
    firstFailure: 'Upload contract is unavailable.',
    stoppingPoint: 'Execution prerequisite',
    blockerId: 'UPLOAD-RULE-AR-01',
    blockerReason: 'The live accepted-type contract is unavailable.',
    owner: 'product/business + QA',
  });
});

test('preserves the exact assertion error for a real live-case failure', () => {
  const error = new Error('Rejected upload changed unrelated controls: input_3_128.');

  assert.deepEqual(classifyLiveCaseError(error, { step: 7 }), {
    status: 'FAIL',
    observed: 'Rejected upload changed unrelated controls: input_3_128.',
    firstFailure: 'Rejected upload changed unrelated controls: input_3_128.',
    stoppingPoint: 'Step 7 assertion',
    blockerId: null,
    blockerReason: null,
    owner: null,
  });
});
