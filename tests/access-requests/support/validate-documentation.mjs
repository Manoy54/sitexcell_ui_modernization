import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

import {
  validateAccessDocumentation,
  validateExploratoryDocumentation,
} from './documentation-freshness.js';

const documentationRoot = resolve('docs/testing/access-request');
const result = JSON.parse(await readFile(resolve(documentationRoot, 'access-request-results.json'), 'utf8'));
const exploratoryResult = JSON.parse(await readFile(
  resolve(documentationRoot, 'access-request-exploratory-results.json'),
  'utf8',
));
const fieldMap = JSON.parse(await readFile(resolve(documentationRoot, 'steps-1-8-field-map.json'), 'utf8'));
const fieldRuleLedger = JSON.parse(await readFile(resolve(documentationRoot, 'field-rule-ledger.json'), 'utf8'));
const narrativeNames = [
  'test-summary.md',
  'analysis.md',
  'test-case-matrix.md',
  'findings.md',
  'recommendations.md',
];
const narratives = Object.fromEntries(await Promise.all(narrativeNames.map(async (name) => [
  name,
  await readFile(resolve(documentationRoot, name), 'utf8'),
])));

const errors = [
  ...validateAccessDocumentation({ result, fieldMap, fieldRuleLedger, narratives }),
  ...validateExploratoryDocumentation({ result: exploratoryResult, narratives }),
];
if (errors.length) {
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log(`Access Request documentation is synchronized to ${result.run.runId} and focused exploratory run ${exploratoryResult.run.runId}.`);
}
