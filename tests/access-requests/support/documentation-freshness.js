import { validateCapturedFieldMap } from './field-map-gate.js';
import { EXPLORATORY_ACCESS_CASE_IDS } from './case-catalog.js';

function validTimestamp(value) {
  const timestamp = Date.parse(value ?? '');
  return Number.isNaN(timestamp) ? null : timestamp;
}

export function validateAccessDocumentation({ result, fieldMap, fieldRuleLedger, narratives = {} }) {
  const errors = [];
  if (result?.schemaVersion !== 2) errors.push('The consolidated result schema version 2 is required.');
  if (fieldMap?.schemaVersion !== 2) errors.push('The Steps 1–8 field-map schema version 2 is required.');
  if (fieldRuleLedger?.schemaVersion !== 1) errors.push('The field/rule ledger schema version 1 is required.');

  const fieldValidation = validateCapturedFieldMap(fieldMap);
  if (fieldValidation.missingSteps.length) {
    errors.push(`Missing field-map steps ${fieldValidation.missingSteps.join(', ')}.`);
  }
  if (fieldValidation.emptySteps.length) {
    errors.push(`Empty field-map steps ${fieldValidation.emptySteps.join(', ')}.`);
  }

  const completedAt = validTimestamp(result?.run?.completedAt);
  const capturedAt = validTimestamp(fieldMap?.capturedAt);
  if (completedAt !== null && capturedAt !== null && completedAt < capturedAt) {
    errors.push('The consolidated result is older than the field map and must be rerun.');
  }
  if (fieldRuleLedger?.sourceFieldMapCapturedAt !== fieldMap?.capturedAt) {
    errors.push('The field/rule ledger is not synchronized to the current field map.');
  }
  const capturedControls = (fieldMap?.steps ?? [])
    .reduce((count, step) => count + (step.fields?.length ?? 0), 0);
  if (fieldRuleLedger?.summary?.controls !== capturedControls) {
    errors.push(`The field/rule ledger must account for all ${capturedControls} captured controls.`);
  }
  if (fieldRuleLedger?.summary?.fields !== fieldRuleLedger?.rows?.length) {
    errors.push('The field/rule ledger field count does not match its rows.');
  }

  const resultFieldMap = result?.run?.fieldMap;
  const resultLedger = result?.run?.fieldRuleLedger;
  if (resultFieldMap?.schemaVersion !== fieldMap?.schemaVersion
    || resultFieldMap?.capturedAt !== fieldMap?.capturedAt
    || resultFieldMap?.steps !== fieldMap?.steps?.length
    || resultFieldMap?.controls !== fieldRuleLedger?.summary?.controls
    || resultFieldMap?.fields !== fieldRuleLedger?.summary?.fields) {
    errors.push('The consolidated result field-map metadata is not synchronized to the current field map.');
  }
  if (resultLedger?.schemaVersion !== fieldRuleLedger?.schemaVersion
    || resultLedger?.sourceFieldMapCapturedAt !== fieldRuleLedger?.sourceFieldMapCapturedAt
    || resultLedger?.technicalInventoryOnly !== fieldRuleLedger?.summary?.technicalInventoryOnly
    || resultLedger?.evidenceBackedFields !== fieldRuleLedger?.summary?.evidenceBackedFields) {
    errors.push('The consolidated result field/rule metadata is not synchronized to the current ledger.');
  }

  const expectedSummary = {
    matrixCases: 64,
    classifiedCases: 64,
    implementedCases: 48,
    decisionBlockers: 5,
    plannedOnlyCases: 16,
  };
  for (const [key, expected] of Object.entries(expectedSummary)) {
    if (result?.summary?.[key] !== expected) {
      errors.push(`${key} must equal ${expected}; received ${result?.summary?.[key] ?? 'missing'}.`);
    }
  }

  if (result?.safety?.finalSubmissionAttempted === true
    || result?.safety?.finalSubmissionCompleted === true) {
    errors.push('A final submission attempt or completion invalidates the safe evidence baseline.');
  }
  for (const item of result?.cases ?? []) {
    if (item.status === 'BLOCKED' && item.executed !== false && !item.owner) {
      errors.push(`${item.caseId} is blocked without a responsible owner.`);
    }
  }

  const runId = result?.run?.runId;
  if (!runId) {
    errors.push('The consolidated result has no run ID.');
  } else {
    for (const [name, contents] of Object.entries(narratives)) {
      if (!String(contents).includes(`Current evidence run: \`${runId}\``)) {
        errors.push(`${name} does not reference current evidence run ${runId}.`);
      }
    }
  }

  return errors;
}

export function validateExploratoryDocumentation({ result, narratives = {} }) {
  const errors = [];
  const expectedIds = new Set(EXPLORATORY_ACCESS_CASE_IDS);
  const cases = (result?.cases ?? []).filter((item) => expectedIds.has(item.caseId));
  const actualIds = new Set(cases.map((item) => item.caseId));

  if (result?.schemaVersion !== 2) errors.push('The exploratory result schema version 2 is required.');
  if (result?.summary?.selectedCases !== expectedIds.size) {
    errors.push(`The exploratory result must select ${expectedIds.size} cases.`);
  }
  if (result?.summary?.exploratoryProbes !== expectedIds.size) {
    errors.push(`exploratoryProbes must equal ${expectedIds.size}.`);
  }
  if (result?.summary?.plannedOnlyCases !== expectedIds.size) {
    errors.push(`The ${expectedIds.size} exploratory cases must remain planning-only.`);
  }
  for (const caseId of expectedIds) {
    if (!actualIds.has(caseId)) errors.push(`The exploratory result is missing ${caseId}.`);
  }
  for (const item of cases) {
    if (item.status === 'BLOCKED' && !item.owner) {
      errors.push(`${item.caseId} is blocked without a responsible owner.`);
    }
    if (item.finalSubmissionAttempted === true) {
      errors.push(`${item.caseId} recorded a prohibited final submission attempt.`);
    }
  }
  if (result?.summary?.zeroSubmissionConfirmed !== true
    || result?.safety?.finalSubmissionAttempted === true
    || result?.safety?.finalSubmissionCompleted === true) {
    errors.push('The exploratory result must confirm zero final submissions.');
  }

  const runId = result?.run?.runId;
  if (!runId) {
    errors.push('The exploratory result has no run ID.');
  } else {
    for (const [name, contents] of Object.entries(narratives)) {
      if (!String(contents).includes(runId)) {
        errors.push(`${name} does not reference focused evidence run ${runId}.`);
      }
    }
  }

  return errors;
}
