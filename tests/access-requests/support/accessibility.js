import { STEP } from './selectors.js';

export async function keyboardReachability(page, stepNumber) {
  const controls = page.locator(`${STEP[stepNumber]} a[href]:visible, ${STEP[stepNumber]} button:visible, ${STEP[stepNumber]} input:visible, ${STEP[stepNumber]} select:visible, ${STEP[stepNumber]} textarea:visible`);
  const expected = [];
  for (let index = 0; index < await controls.count(); index += 1) {
    const control = controls.nth(index);
    if (await control.isDisabled()) continue;
    if (await control.getAttribute('tabindex') === '-1') continue;
    expected.push({
      id: await control.getAttribute('id'),
      name: await control.getAttribute('name'),
      role: await control.getAttribute('role') ?? await control.evaluate((element) => element.tagName.toLowerCase()),
    });
  }

  await page.evaluate(() => {
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
  });
  const sequence = [];
  const reached = new Set();
  const maximumTabs = Math.max(20, await page.locator('a[href]:visible, button:visible, input:visible, select:visible, textarea:visible, [tabindex]:visible').count() * 2);
  for (let index = 0; index < maximumTabs && reached.size < expected.length; index += 1) {
    await page.keyboard.press('Tab');
    const focused = await page.evaluate((stepSelector) => {
      const element = document.activeElement;
      const step = document.querySelector(stepSelector);
      if (!(element instanceof HTMLElement) || !step?.contains(element)) return null;
      return {
        id: element.id || null,
        name: element.getAttribute('name'),
        role: element.getAttribute('role') ?? element.tagName.toLowerCase(),
      };
    }, STEP[stepNumber]);
    if (!focused) continue;
    sequence.push(focused);
    const match = expected.findIndex((item) => item.id
      ? item.id === focused.id
      : item.name === focused.name && item.role === focused.role);
    if (match >= 0) reached.add(match);
  }

  return {
    expected,
    sequence,
    missing: expected.filter((_, index) => !reached.has(index)),
  };
}

export async function reducedMotionViolations(page) {
  return page.evaluate(() => {
    const milliseconds = (value) => value.split(',').map((part) => {
      const duration = part.trim();
      return duration.endsWith('ms') ? Number.parseFloat(duration) : Number.parseFloat(duration) * 1000;
    });
    return [...document.querySelectorAll('body *')]
      .filter((element) => element instanceof HTMLElement && element.offsetParent !== null)
      .map((element) => {
        const style = getComputedStyle(element);
        const animationMs = Math.max(0, ...milliseconds(style.animationDuration));
        const motionTransition = style.transitionProperty.split(',')
          .map((property) => property.trim())
          .some((property) => ['all', 'transform', 'top', 'right', 'bottom', 'left', 'width', 'height'].includes(property));
        const transitionMs = motionTransition ? Math.max(0, ...milliseconds(style.transitionDuration)) : 0;
        return {
          id: element.id || null,
          tag: element.tagName.toLowerCase(),
          animationMs,
          transitionMs,
        };
      })
      .filter((item) => item.animationMs > 100 || item.transitionMs > 100);
  });
}

export async function unlabeledVisibleControls(page, stepNumber) {
  return page.locator(STEP[stepNumber]).evaluate((step) => [...step.querySelectorAll('input, select, textarea')]
    .filter((control) => {
      if (control.type === 'hidden' || control.disabled) return false;
      const style = getComputedStyle(control);
      return style.display !== 'none' && style.visibility !== 'hidden' && control.offsetParent !== null;
    })
    .filter((control) => {
      const labelledBy = control.getAttribute('aria-labelledby');
      const hasLabelledBy = labelledBy && labelledBy.split(/\s+/).every((id) => document.getElementById(id));
      const explicitLabel = control.id && document.querySelector(`label[for="${CSS.escape(control.id)}"]`);
      return !control.getAttribute('aria-label') && !hasLabelledBy && !explicitLabel;
    })
    .map((control) => ({ id: control.id || null, name: control.name || null, type: control.type })));
}

export async function documentOverflow(page) {
  return page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
    horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
  }));
}
