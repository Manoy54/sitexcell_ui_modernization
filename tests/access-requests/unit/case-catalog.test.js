import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  ACCESS_CASE_CATALOG,
  STEPS_5_TO_8_CASE_IDS,
  accessCaseTitle,
  coveredStepsForCase,
} from '../support/case-catalog.js';

test('names Access Request cases with their covered step range', () => {
  assert.equal(
    accessCaseTitle('TC-AR-001', 'opens the authenticated Access Request'),
    'TC-AR-001 [Step 1] opens the authenticated Access Request',
  );
  assert.equal(
    accessCaseTitle('TC-AR-005', 'preserves values across navigation'),
    'TC-AR-005 [Steps 1–8] preserves values across navigation',
  );
  assert.equal(
    accessCaseTitle('TC-AR-U01', 'rejects a missing upload'),
    'TC-AR-U01 [Step 7] rejects a missing upload',
  );
});

test('every implemented Steps 5–8 case has explicit step coverage', () => {
  const catalogIds = new Set(ACCESS_CASE_CATALOG.map((item) => item.id));
  for (const caseId of STEPS_5_TO_8_CASE_IDS) {
    assert.equal(catalogIds.has(caseId), true, `${caseId} is in the catalog`);
    assert.ok(coveredStepsForCase(caseId).length > 0, `${caseId} has covered steps`);
  }
});
