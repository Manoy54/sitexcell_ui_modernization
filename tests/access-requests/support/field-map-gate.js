import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { AccessRequestBlockedError } from './form-helpers.js';

const FIELD_MAP_PATHS = [
  resolve('docs/testing/access-request/steps-1-8-field-map.json'),
  resolve('docs/testing/access-request/steps-5-8-field-map.json'),
];

export function validateCapturedFieldMap(fieldMap) {
  const requiredSteps = [1, 2, 3, 4, 5, 6, 7, 8];
  const byStep = new Map((fieldMap?.steps ?? []).map((item) => [item.step, item]));
  const missingSteps = requiredSteps.filter((step) => !byStep.has(step));
  const emptySteps = requiredSteps.filter((step) => byStep.has(step) && !byStep.get(step).fields?.length);
  return {
    valid: fieldMap?.status === 'captured' && !missingSteps.length && !emptySteps.length,
    missingSteps,
    emptySteps,
  };
}

export function loadStepsFieldMap() {
  for (const fieldMapPath of FIELD_MAP_PATHS) {
    try {
      return JSON.parse(readFileSync(fieldMapPath, 'utf8'));
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
  }
  return null;
}
export function requireCapturedStepsFieldMap() {
  const fieldMap = loadStepsFieldMap();
  const validation = validateCapturedFieldMap(fieldMap);
  if (validation.valid) return fieldMap;

  const blockerId = fieldMap?.blocker?.id ?? 'FIELD-MAP-AR-01';
  const blockerReason = fieldMap?.blocker?.reason
    ?? `The authenticated Steps 1–8 field map is incomplete; missing steps: ${validation.missingSteps.join(', ') || 'none'}; empty steps: ${validation.emptySteps.join(', ') || 'none'}.`;
  throw new AccessRequestBlockedError(
    `Steps 1–8 execution blocked: ${blockerReason}`,
    { blockerId, blockerReason, owner: 'QA/reviewer + developer' },
  );
}
