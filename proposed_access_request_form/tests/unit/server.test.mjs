import test from 'node:test';
import assert from 'node:assert/strict';

import { parseRequestPath } from '../../server.mjs';

test('malformed paths and Host headers are rejected without throwing', () => {
    assert.deepEqual(parseRequestPath('/%', 'localhost'), { ok: false, status: 400 });
    assert.deepEqual(parseRequestPath('/', '['), { ok: false, status: 400 });
    assert.deepEqual(parseRequestPath('/', 'localhost'), { ok: true, relativePath: 'index.html' });
});
