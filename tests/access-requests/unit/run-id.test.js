import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { nextAccessRunIdentifier } from '../support/run-id.js';

test('increments the local sequence and formats a UTC synthetic identifier', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'access-request-run-id-'));
  const sequencePath = join(directory, '.test-run-sequence');
  await writeFile(sequencePath, '41\n', 'utf8');

  const result = await nextAccessRunIdentifier({
    sequencePath,
    now: new Date('2026-08-26T04:05:06.789Z'),
  });

  assert.deepEqual(result, {
    sequence: 42,
    identifier: 'test-The-CRM-Carpenters-000042-20260826T040506789Z',
  });
  assert.equal(await readFile(sequencePath, 'utf8'), '42\n');
});

test('starts at one when the sequence file does not exist', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'access-request-run-id-'));
  const sequencePath = join(directory, '.test-run-sequence');

  const result = await nextAccessRunIdentifier({
    sequencePath,
    now: new Date('2026-01-02T03:04:05.006Z'),
  });

  assert.equal(result.sequence, 1);
  assert.equal(result.identifier, 'test-The-CRM-Carpenters-000001-20260102T030405006Z');
});

test('rejects malformed sequence state instead of risking duplicate identifiers', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'access-request-run-id-'));
  const sequencePath = join(directory, '.test-run-sequence');
  await writeFile(sequencePath, 'not-a-number\n', 'utf8');

  await assert.rejects(
    nextAccessRunIdentifier({ sequencePath }),
    /invalid access request test sequence/i,
  );
});

test('allocates distinct identifiers to concurrent runner launches', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'access-request-run-id-'));
  const sequencePath = join(directory, '.test-run-sequence');

  const results = await Promise.all(
    Array.from({ length: 8 }, () => nextAccessRunIdentifier({
      sequencePath,
      now: new Date('2026-08-26T04:05:06.789Z'),
    })),
  );

  assert.deepEqual(
    results.map(({ sequence }) => sequence).sort((left, right) => left - right),
    [1, 2, 3, 4, 5, 6, 7, 8],
  );
  assert.equal(new Set(results.map(({ identifier }) => identifier)).size, 8);
});
