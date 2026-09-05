import { STEP } from './selectors.js';

const DEFAULT_REUSE_TERMS = /\b(copy|reuse|same as|returning|existing person|known person|select person)\b/i;

export async function visibleAffordances(page, stepNumber, pattern = DEFAULT_REUSE_TERMS) {
  const controls = page.locator(
    `${STEP[stepNumber]} button:visible, ${STEP[stepNumber]} a:visible, `
    + `${STEP[stepNumber]} input:visible, ${STEP[stepNumber]} select:visible`,
  );
  const candidates = await controls.evaluateAll((elements) => elements.map((element) => {
    const labels = element.labels ? [...element.labels].map((label) => label.textContent ?? '') : [];
    const fieldLabel = element.closest('.gfield')?.querySelector('.gfield_label')?.textContent ?? '';
    const text = [
      ...labels,
      fieldLabel,
      element.getAttribute('aria-label') ?? '',
      element.getAttribute('title') ?? '',
      element.getAttribute('value') ?? '',
      element.textContent ?? '',
    ].join(' ').replace(/\s+/g, ' ').trim();
    return {
      id: element.id || null,
      fieldId: element.closest('.gfield')?.id || null,
      tag: element.tagName.toLowerCase(),
      type: element.getAttribute('type') ?? element.tagName.toLowerCase(),
      text,
    };
  }));

  return candidates.filter((candidate) => pattern.test(candidate.text));
}

export async function visibleFieldInventory(page, rootSelector) {
  return page.locator(`${rootSelector} .gfield:visible`).evaluateAll((fields) => fields.map((field) => {
    const label = field.querySelector('.gfield_label, legend')?.textContent?.replace(/\s+/g, ' ').trim() ?? '';
    const controls = [...field.querySelectorAll('input, select, textarea')].filter((control) => {
      const style = getComputedStyle(control);
      return style.display !== 'none' && style.visibility !== 'hidden' && control.offsetParent !== null;
    });
    return {
      fieldId: field.id || null,
      label,
      controls: controls.map((control) => ({
        id: control.id || null,
        type: control.getAttribute('type') ?? control.tagName.toLowerCase(),
        required: control.required || control.getAttribute('aria-required') === 'true',
      })),
    };
  }).filter((field) => field.controls.length > 0));
}

export async function installPayloadSubmissionGuard(page, { pathname, payloadPattern }) {
  let attempted = false;
  await page.route('**/*', async (route) => {
    const request = route.request();
    const isGuardedPost = request.method() === 'POST'
      && new URL(request.url()).pathname === pathname
      && payloadPattern.test(request.postData() ?? '');
    if (isGuardedPost) {
      attempted = true;
      await route.abort('blockedbyclient');
      return;
    }
    await route.fallback();
  });
  return () => attempted;
}

export function blockedExploratoryOutcome({
  blockerId,
  blockerReason,
  observed,
  stoppingPoint,
  observations = [],
  findingIds = [],
  recommendationIds = [],
  owner,
  extra = {},
}) {
  return {
    status: 'BLOCKED',
    observed,
    stoppingPoint,
    blockerId,
    blockerReason,
    findingIds,
    recommendationIds,
    owner,
    extra: { ...extra, observations },
  };
}
