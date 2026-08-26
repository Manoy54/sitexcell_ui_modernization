import { mkdir, readFile, rmdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const RUN_PREFIX = 'test-The-CRM-Carpenters';

async function readSequence(sequencePath) {
  let content;
  try {
    content = await readFile(sequencePath, 'utf8');
  } catch (error) {
    if (error.code === 'ENOENT') return 0;
    throw error;
  }

  const sequence = Number(content.trim());
  if (!Number.isSafeInteger(sequence) || sequence < 0) {
    throw new Error(`Invalid Access Request test sequence in ${sequencePath}.`);
  }
  return sequence;
}

function compactUtcTimestamp(now) {
  if (Number.isNaN(now.valueOf())) throw new Error('Access Request run date must be valid.');
  return now.toISOString().replace(/[-:.]/g, '');
}

async function acquireSequenceLock(sequencePath) {
  const lockPath = `${sequencePath}.lock`;
  const deadline = Date.now() + 5_000;

  while (true) {
    try {
      await mkdir(lockPath);
      return async () => rmdir(lockPath);
    } catch (error) {
      if (error.code !== 'EEXIST') throw error;
      if (Date.now() >= deadline) {
        throw new Error(`Timed out waiting for the Access Request sequence lock: ${lockPath}.`);
      }
      await new Promise((resolveDelay) => setTimeout(resolveDelay, 10));
    }
  }
}

export async function nextAccessRunIdentifier({
  sequencePath = resolve(process.cwd(), '.test-run-sequence'),
  now = new Date(),
} = {}) {
  const releaseLock = await acquireSequenceLock(sequencePath);
  let sequence;
  try {
    sequence = (await readSequence(sequencePath)) + 1;
    await writeFile(sequencePath, `${sequence}\n`, 'utf8');
  } finally {
    await releaseLock();
  }

  return {
    sequence,
    identifier: `${RUN_PREFIX}-${String(sequence).padStart(6, '0')}-${compactUtcTimestamp(now)}`,
  };
}
