import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { AccessRequestBlockedError } from './form-helpers.js';

const FIELD_MAP_PATH = resolve('docs/testing/access-request/steps-5-8-field-map.json');

export function loadStepsFieldMap() {
  try {
    return JSON.parse(readFileSync(FIELD_MAP_PATH, 'utf8'));
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    return null;
  }
}
export function requireCapturedStepsFieldMap() {
  const fieldMap = loadStepsFieldMap();
  if (fieldMap?.status === 'captured') return fieldMap;

  const blockerId = fieldMap?.blocker?.id ?? 'FIELD-MAP-AR-01';
  const blockerReason = fieldMap?.blocker?.reason
    ?? 'The authenticated Steps 5–8 field map has not been captured.';
  throw new AccessRequestBlockedError(
    `Steps 5–8 execution blocked: ${blockerReason}`,
    { blockerId, blockerReason },
  );
}
