import { ACCESS_CASE_CATALOG, coveredStepsForCase } from './case-catalog.js';

function reviewOwner(controls) {
  if (controls.some((control) => control.type === 'file')) {
    return 'operations/data + security/privacy';
  }
  if (controls.every((control) => control.type === 'hidden')) {
    return 'operations/data + developer';
  }
  return 'product/business + operations/data';
}

function fieldKey(step, fieldId, controls, index) {
  if (fieldId) return `step-${step}:${fieldId}`;
  const control = controls[0] ?? {};
  return `step-${step}:ungrouped:${control.id ?? control.name ?? index}`;
}

export function buildFieldRuleLedger(fieldMap) {
  const rows = [];
  let totalControls = 0;

  for (const step of fieldMap.steps ?? []) {
    const groups = new Map();
    for (const [index, control] of (step.fields ?? []).entries()) {
      totalControls += 1;
      const group = control.fieldId ?? `ungrouped:${control.id ?? control.name ?? index}`;
      if (!groups.has(group)) groups.set(group, []);
      groups.get(group).push({ ...control, sourceIndex: index });
    }

    for (const [index, [group, controls]] of [...groups.entries()].entries()) {
      const fieldId = group.startsWith('ungrouped:') ? null : group;
      const candidateCaseIds = ACCESS_CASE_CATALOG
        .filter(({ id }) => coveredStepsForCase(id).includes(step.step))
        .map(({ id }) => id);
      rows.push({
        fieldKey: fieldKey(step.step, fieldId, controls, index),
        step: step.step,
        fieldId,
        labels: [...new Set(controls.map((control) => control.label).filter(Boolean))],
        controlIds: controls.map((control) => control.id ?? control.name ?? `source-index-${control.sourceIndex}`),
        controlTypes: [...new Set(controls.map((control) => control.type))],
        requiredByTechnicalCapture: controls.some((control) => control.required),
        constraints: controls.map((control) => ({
          id: control.id ?? control.name ?? null,
          options: control.options ?? [],
          accept: control.accept ?? null,
          multiple: control.multiple === true,
          min: control.min ?? null,
          max: control.max ?? null,
          maxLength: control.maxLength ?? null,
          pattern: control.pattern ?? null,
          conditionalLogic: control.conditionalLogic ?? null,
        })),
        owner: reviewOwner(controls),
        oracle: 'missing-decision',
        coverageState: 'technical-inventory-only',
        reviewMapping: 'unapproved',
        persistenceContract: 'unapproved',
        partitionContract: 'unapproved',
        candidateCaseIds,
        evidenceCaseIds: [],
        blockerId: `FIELD-RULE-AR-${step.step}-${fieldId ?? index}`.toUpperCase(),
      });
    }
  }

  return {
    schemaVersion: 1,
    sourceFieldMapCapturedAt: fieldMap.capturedAt ?? null,
    generatedAt: new Date().toISOString(),
    summary: {
      steps: [...new Set(rows.map((row) => row.step))].length,
      fields: rows.length,
      controls: totalControls,
      technicalInventoryOnly: rows.filter((row) => row.coverageState === 'technical-inventory-only').length,
      evidenceBackedFields: rows.filter((row) => row.evidenceCaseIds.length).length,
    },
    rows,
  };
}

function cell(value) {
  return String(value ?? '—').replaceAll('|', '\\|').replaceAll('\n', ' ');
}

export function renderFieldRuleLedgerMarkdown(ledger) {
  const lines = [
    '# Access Request Field/Rule Ledger',
    '',
    `Generated from field map: ${ledger.sourceFieldMapCapturedAt ?? 'unknown'}  `,
    `Fields: ${ledger.summary.fields}  `,
    `Controls: ${ledger.summary.controls}  `,
    `Evidence-backed fields: ${ledger.summary.evidenceBackedFields}`,
    '',
    'Every captured field is explicit below. `Technical inventory only` means the live structure is known, but requiredness, partitions, persistence, and Step 8 review behavior still need owner approval and field-specific evidence.',
    '',
    '| Field key | Labels | Types | Required in capture | Owner | Oracle | Coverage | Candidate cases | Blocker |',
    '| --- | --- | --- | --- | --- | --- | --- | --- | --- |',
  ];
  for (const row of ledger.rows) {
    lines.push(`| \`${cell(row.fieldKey)}\` | ${cell(row.labels.join('; '))} | ${cell(row.controlTypes.join(', '))} | ${row.requiredByTechnicalCapture ? 'Yes' : 'No'} | ${cell(row.owner)} | ${cell(row.oracle)} | ${cell(row.coverageState)} | ${cell(row.candidateCaseIds.join(', '))} | \`${cell(row.blockerId)}\` |`);
  }
  lines.push('');
  return `${lines.join('\n')}\n`;
}
