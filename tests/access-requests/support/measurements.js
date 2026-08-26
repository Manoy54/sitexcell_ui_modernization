export async function collectStepMetrics(stepLocator) {
  return stepLocator.evaluate((step) => {
    const isVisible = (element) => {
      const style = getComputedStyle(element);
      return style.display !== 'none'
        && style.visibility !== 'hidden'
        && element.offsetParent !== null;
    };

    const controls = [...step.querySelectorAll('input, select, textarea, button')]
      .filter(isVisible)
      .map((element) => ({
        id: element.id || null,
        type: element.getAttribute('type') ?? element.tagName.toLowerCase(),
        required: element.required || element.getAttribute('aria-required') === 'true',
        disabled: element.disabled,
      }));

    const manualTypes = new Set([
      'checkbox',
      'date',
      'email',
      'file',
      'number',
      'radio',
      'select-one',
      'tel',
      'text',
      'textarea',
      'time',
    ]);

    return {
      visibleControls: controls.length,
      requiredControls: controls.filter((control) => control.required).length,
      disabledControls: controls.filter((control) => control.disabled).length,
      manualFieldCandidates: controls.filter(
        (control) => !control.disabled && manualTypes.has(control.type),
      ).length,
      controls,
    };
  });
}
