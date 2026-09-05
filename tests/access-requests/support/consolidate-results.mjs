import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

import {
  consolidatePlaywrightReport,
  sanitizeForCommit,
} from './results.js';

function argument(name, fallback = null) {
  const prefix = `--${name}=`;
  const match = process.argv.slice(2).find((value) => value.startsWith(prefix));
  return match ? match.slice(prefix.length) : fallback;
}

const reportPath = resolve(argument(
  'report',
  '.test-artifacts/playwright/access-request-results.json',
));
const localOutputPath = resolve(argument(
  'local-output',
  '.test-artifacts/playwright/access-request-results.json',
));
const committedOutputPath = resolve(argument(
  'committed-output',
  'docs/testing/access-request/access-request-results.json',
));
const plannedCases = Number(argument('planned-cases', '50'));
const fixtureVersion = Number(argument('fixture-version', '1'));

if (!Number.isInteger(plannedCases) || plannedCases < 1) {
  throw new Error(`--planned-cases must be a positive integer; received ${plannedCases}.`);
}
if (!Number.isInteger(fixtureVersion) || fixtureVersion < 1) {
  throw new Error(`--fixture-version must be a positive integer; received ${fixtureVersion}.`);
}

const report = JSON.parse(await readFile(reportPath, 'utf8'));
let previous = {};
try {
  previous = JSON.parse(await readFile(committedOutputPath, 'utf8'));
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}

const consolidated = consolidatePlaywrightReport(report, {
  plannedCases,
  fixtureVersion,
  findings: previous.findings ?? [],
  recommendations: previous.recommendations ?? [],
});
const sanitized = sanitizeForCommit(consolidated);

await mkdir(dirname(localOutputPath), { recursive: true });
await mkdir(dirname(committedOutputPath), { recursive: true });
await writeFile(localOutputPath, `${JSON.stringify(consolidated, null, 2)}\n`);
await writeFile(committedOutputPath, `${JSON.stringify(sanitized, null, 2)}\n`);

console.log(`Consolidated result: ${localOutputPath}`);
console.log(`Sanitized committed result: ${committedOutputPath}`);
