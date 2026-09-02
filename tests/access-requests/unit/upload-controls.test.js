import assert from 'node:assert/strict';
import test from 'node:test';

import {
  declaredMaximumBytes,
  isRequestSpecificUpload,
} from '../support/upload-controls.js';

test('parses upload limits with provider punctuation and unit casing', () => {
  assert.equal(declaredMaximumBytes({ description: 'Max. file size: 20 MB.' }), 20 * 1024 ** 2);
  assert.equal(declaredMaximumBytes({ description: 'Maximum file size: 1.5 gb' }), Math.floor(1.5 * 1024 ** 3));
  assert.equal(declaredMaximumBytes({ description: 'Max size: 512 KB' }), 512 * 1024);
  assert.equal(declaredMaximumBytes({ description: 'Upload evidence' }), null);
});

test('identifies request-specific uploads from label or provider description', () => {
  assert.equal(isRequestSpecificUpload({ label: 'Additional Documentation', description: '' }), true);
  assert.equal(isRequestSpecificUpload({ label: 'Evidence', description: 'Supporting documents' }), true);
  assert.equal(isRequestSpecificUpload({ label: 'White Card', description: 'Credential upload' }), false);
});
