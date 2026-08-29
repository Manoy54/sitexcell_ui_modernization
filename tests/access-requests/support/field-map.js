import { STEP } from './selectors.js';

function markdownCell(value) {
  return String(value ?? '—').replaceAll('|', '\\|').replaceAll('\n', ' ');
}
function fieldOptions(field) {
  if (!field.options?.length) return '—';
  return field.options
    .map((option) => option.value ? `${option.label} (${option.value})` : option.label)
    .join('; ');
}

export function renderFieldMapMarkdown(fieldMap) {
  const status = fieldMap.status === 'captured' ? 'Captured' : 'Blocked';
  const lines = [
    '# Access Requests Steps 5–8 Field and Branch Map',
    '',
    `Status: ${status}  `,
    `Captured at: ${fieldMap.capturedAt ?? 'Not captured'}  `,
    `Target: ${fieldMap.targetUrl ?? 'Not available'}  `,
    `Account classification: ${fieldMap.accountClassification ?? 'Not available'}`,
    '',
    'This document is generated from the authenticated live form structure. It records no entered values, authentication material, or client data.',
    '',
  ];

  if (fieldMap.blocker) {
    lines.push(
      '## Capture blocker',
      '',
      `- ID: \`${markdownCell(fieldMap.blocker.id)}\``,
      `- Reason: ${markdownCell(fieldMap.blocker.reason)}`,
      '',
    );
  }

  for (const step of fieldMap.steps ?? []) {
    lines.push(
      `## Step ${step.step}`,
      '',
      '| Field ID | Label | Type | Required | Default visibility | Options / constraints |',
      '| --- | --- | --- | --- | --- | --- |',
    );
    if (!step.fields.length) {
      lines.push('| — | No fields captured | — | — | — | — |');
    }
    for (const field of step.fields) {
      const constraints = [
        fieldOptions(field),
        field.accept ? `accept=${field.accept}` : null,
        field.multiple ? 'multiple' : null,
      ].filter(Boolean).join('; ');
      lines.push(
        `| \`${markdownCell(field.id ?? field.name)}\` | ${markdownCell(field.label)} | \`${markdownCell(field.type)}\` | ${field.required ? 'Yes' : 'No'} | ${field.visibleByDefault ? 'Visible' : 'Hidden'} | ${markdownCell(constraints)} |`,
      );
    }
    lines.push('');
  }

  lines.push(
    '## Interpretation boundary',
    '',
    '- Static visibility is only the captured default state; focused branch tests must prove behavior after controlling answers change.',
    '- Requiredness and upload restrictions remain characterization evidence until confirmed by progression and validation cases.',
    '- Final Submit may be observed on Step 8 but must never be activated.',
    '',
  );

  return `${lines.join('\n')}\n`;
}

export async function captureStepsFieldMap(page, stepNumbers = [5, 6, 7, 8]) {
  const steps = [];
  for (const stepNumber of stepNumbers) {
    const step = page.locator(STEP[stepNumber]);
    const exists = await step.count() > 0;
    if (!exists) {
      steps.push({ step: stepNumber, fields: [] });
      continue;
    }

    const fields = await step.evaluate((stepElement) => {
      const controls = [...stepElement.querySelectorAll('input, select, textarea, button')];
      return controls.map((control) => {
        const field = control.closest('.gfield');
        const explicitLabel = control.id
          ? stepElement.querySelector(`label[for="${CSS.escape(control.id)}"]`)
          : null;
        const groupLabel = field?.querySelector('.gfield_label, legend');
        const style = getComputedStyle(control);
        const visible = style.display !== 'none'
          && style.visibility !== 'hidden'
          && control.offsetParent !== null;
        const type = control.getAttribute('type')
          ?? (control instanceof HTMLSelectElement ? 'select-one' : control.tagName.toLowerCase());
        const options = control instanceof HTMLSelectElement
          ? [...control.options].map((option) => ({
            label: option.textContent.trim(),
            value: option.value,
          }))
          : [];

        return {
          id: control.id || null,
          name: control.getAttribute('name'),
          label: explicitLabel?.textContent.trim()
            || groupLabel?.textContent.trim()
            || control.getAttribute('aria-label')
            || null,
          type,
          required: control.required || control.getAttribute('aria-required') === 'true',
          disabled: control.disabled,
          visibleByDefault: visible,
          options,
          accept: control.getAttribute('accept'),
          multiple: control.hasAttribute('multiple'),
          min: control.getAttribute('min'),
          max: control.getAttribute('max'),
          maxLength: control.getAttribute('maxlength'),
          pattern: control.getAttribute('pattern'),
          fieldId: field?.id ?? null,
          fieldClasses: field?.className ?? null,
          conditionalLogic: field?.getAttribute('data-conditional-logic') ?? null,
        };
      });
    });
    steps.push({ step: stepNumber, fields });
  }
  return steps;
}
