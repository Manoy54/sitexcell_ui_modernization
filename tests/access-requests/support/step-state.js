import { STEP } from './selectors.js';

export async function snapshotStepState(page, stepNumber) {
  return page.locator(STEP[stepNumber]).evaluate((step) => [...step.querySelectorAll('input, select, textarea')]
    .filter((control) => control.type !== 'hidden')
    .map((control) => {
      const value = control.type === 'file'
        ? [...(control.files ?? [])].map((file) => file.name)
        : (control.type === 'checkbox' || control.type === 'radio')
          ? control.checked
          : control.value;
      return {
        id: control.id || control.name,
        type: control.type || control.tagName.toLowerCase(),
        value,
      };
    })
    .sort((left, right) => String(left.id).localeCompare(String(right.id))));
}
