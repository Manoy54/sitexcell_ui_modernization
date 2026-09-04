import { STEP } from './selectors.js';

export async function snapshotStepState(page, stepNumber, {
  includeFiles = true,
  controlIds = null,
} = {}) {
  return page.locator(STEP[stepNumber]).evaluate(
    (step, options) => [...step.querySelectorAll('input, select, textarea')]
      .filter((control) => control.type !== 'hidden')
      .filter((control) => options.includeFiles || control.type !== 'file')
      .filter((control) => !options.controlIds
        || options.controlIds.includes(control.id || control.name))
      .map((control) => {
        const field = control.closest('.gfield');
        const fieldControls = field
          ? [...field.querySelectorAll('input, select, textarea')]
            .filter((item) => item.type !== 'hidden')
          : [];
        const fieldControlIndex = fieldControls.indexOf(control);
        let id = control.id || control.name;
        // The HTML5 uploader regenerates its input ID after a server response.
        if (control.id?.startsWith('html5_')) {
          if (!field?.id || fieldControlIndex < 0) {
            throw new Error('HTML5 upload control is missing a stable field identity.');
          }
          id = `${field.id}:${control.type}:${fieldControlIndex}`;
        }
        if (!id) throw new Error('Form control is missing both an id and name.');
        const value = control.type === 'file'
          ? [...(control.files ?? [])].map((file) => file.name)
          : (control.type === 'checkbox' || control.type === 'radio')
            ? control.checked
            : control.value;
        return {
          id,
          type: control.type || control.tagName.toLowerCase(),
          value,
        };
      })
      .sort((left, right) => String(left.id).localeCompare(String(right.id))),
    { includeFiles, controlIds },
  );
}

export function changedStateIds(before, after) {
  const stateById = (state) => new Map(state.map((item) => [item.id, item]));
  const beforeById = stateById(before);
  const afterById = stateById(after);
  return [...new Set([...beforeById.keys(), ...afterById.keys()])]
    .filter((id) => JSON.stringify(beforeById.get(id)) !== JSON.stringify(afterById.get(id)));
}

export function stateItemMatchesControl(item, control) {
  if (item.id === control.id) return true;
  return control.id?.startsWith('html5_')
    && item.id.startsWith(`${control.fieldId}:`);
}
