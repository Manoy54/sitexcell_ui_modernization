import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

import { buildFieldRuleLedger, renderFieldRuleLedgerMarkdown } from './field-rule-ledger.js';

const fieldMapPath = resolve('docs/testing/access-request/steps-1-8-field-map.json');
const jsonPath = resolve('docs/testing/access-request/field-rule-ledger.json');
const markdownPath = resolve('docs/testing/access-request/field-rule-ledger.md');
const fieldMap = JSON.parse(await readFile(fieldMapPath, 'utf8'));
const ledger = buildFieldRuleLedger(fieldMap);

await writeFile(jsonPath, `${JSON.stringify(ledger, null, 2)}\n`);
await writeFile(markdownPath, renderFieldRuleLedgerMarkdown(ledger));
console.log(`Generated ${ledger.summary.fields} field rows from ${ledger.summary.controls} controls.`);
