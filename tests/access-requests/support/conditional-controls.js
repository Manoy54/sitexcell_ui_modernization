import { STEP } from './selectors.js';

export async function captureStepFieldStates(page, stepNumber) {
  return page.locator(STEP[stepNumber]).evaluate((step) => [...step.querySelectorAll('.gfield')]
    .map((field) => {
      const style = getComputedStyle(field);
      const visible = style.display !== 'none'
        && style.visibility !== 'hidden'
        && field.offsetParent !== null;
      const controls = [...field.querySelectorAll('input, select, textarea')]
        .filter((control) => control.type !== 'hidden');
      return {
        id: field.id || null,
        label: field.querySelector('.gfield_label, legend')?.textContent.trim() ?? null,
        visible,
        required: field.classList.contains('gfield_contains_required')
          || Boolean(field.querySelector('[required], [aria-required="true"], .gfield_required')),
        enabledControls: controls.filter((control) => !control.disabled).length,
        valuePresent: controls.some((control) => {
          if (control.type === 'checkbox' || control.type === 'radio') return control.checked;
          if (control.type === 'file') return Boolean(control.files?.length);
          return Boolean(control.value);
        }),
      };
    })
    .sort((left, right) => String(left.id).localeCompare(String(right.id))));
}

async function controllingGroups(page, stepNumber) {
  return page.locator(STEP[stepNumber]).evaluate((step) => {
    const groups = [];
    const seenRadioNames = new Set();
    for (const control of step.querySelectorAll('select, input[type="radio"], input[type="checkbox"]')) {
      if (control.disabled || control.type === 'hidden') continue;
      const field = control.closest('.gfield');
      const label = field?.querySelector('.gfield_label, legend')?.textContent.trim()
        ?? control.getAttribute('aria-label')
        ?? control.id;
      if (control instanceof HTMLSelectElement) {
        groups.push({
          kind: 'select',
          id: control.id,
          label,
          options: [...control.options]
            .filter((option) => option.value && !option.disabled)
            .map((option) => ({ id: option.value, value: option.value, label: option.textContent.trim() })),
        });
        continue;
      }
      if (control.type === 'radio') {
        if (seenRadioNames.has(control.name)) continue;
        seenRadioNames.add(control.name);
        groups.push({
          kind: 'radio',
          id: control.name,
          label,
          options: [...step.querySelectorAll(`input[type="radio"][name="${CSS.escape(control.name)}"]`)]
            .filter((option) => !option.disabled)
            .map((option) => ({ id: option.id, value: option.value, label: option.labels?.[0]?.textContent.trim() ?? option.value })),
        });
        continue;
      }
      groups.push({
        kind: 'checkbox',
        id: control.id,
        label,
        options: [
          { id: control.id, value: false, label: 'Unchecked' },
          { id: control.id, value: true, label: 'Checked' },
        ],
      });
    }
    return groups;
  });
}

function changedFields(before, after) {
  const previous = new Map(before.map((field) => [field.id, field]));
  return after.flatMap((field) => {
    const earlier = previous.get(field.id);
    if (!earlier || !(
      earlier.visible !== field.visible
      || earlier.required !== field.required
      || earlier.enabledControls !== field.enabledControls
      || earlier.valuePresent !== field.valuePresent
    )) return [];
    return [{
      ...field,
      previousVisible: earlier.visible,
      previousRequired: earlier.required,
      previousEnabledControls: earlier.enabledControls,
      previousValuePresent: earlier.valuePresent,
    }];
  });
}

export async function characterizeConditionalControls(page, stepNumber, {
  labelPattern = null,
  populateVisibleRequired = null,
} = {}) {
  const groups = (await controllingGroups(page, stepNumber))
    .filter((group) => !labelPattern || labelPattern.test(group.label));
  const observations = [];

  for (const group of groups) {
    if (group.options.length < 2) continue;
    let before = await captureStepFieldStates(page, stepNumber);
    for (const option of group.options) {
      const control = group.kind === 'select'
        ? page.locator(`#${group.id}`)
        : page.locator(`#${option.id}`);
      if (group.kind === 'select') await control.selectOption(String(option.value));
      if (group.kind === 'radio') await control.check();
      if (group.kind === 'checkbox') {
        if (option.value) await control.check();
        else await control.uncheck();
      }
      await page.waitForTimeout(100);
      const after = await captureStepFieldStates(page, stepNumber);
      if (populateVisibleRequired) await populateVisibleRequired();
      const populated = populateVisibleRequired
        ? await captureStepFieldStates(page, stepNumber)
        : after;
      observations.push({
        controller: group.id,
        label: group.label,
        option: option.label,
        value: option.value,
        changedFields: changedFields(before, after),
        populatedFields: changedFields(after, populated),
      });
      before = populated;
    }
  }

  return observations;
}
