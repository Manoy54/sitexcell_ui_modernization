function numberedCases(prefix, start, end, family, padding = 2) {
  return Array.from({ length: end - start + 1 }, (_, index) => ({
    id: `${prefix}${String(start + index).padStart(padding, '0')}`,
    family,
  }));
}

export const ACCESS_CASE_CATALOG = Object.freeze([
  ...numberedCases('TC-AR-', 1, 6, 'Core functional', 3),
  ...numberedCases('TC-AR-B', 1, 8, 'Conditional branches'),
  ...numberedCases('TC-AR-R', 1, 4, 'Recovery'),
  ...numberedCases('TC-AR-U', 1, 7, 'Uploads'),
  ...numberedCases('TC-AR-P', 1, 5, 'Person context'),
  ...numberedCases('TC-AR-D', 1, 4, 'Document context'),
  ...numberedCases('TC-AR-S', 1, 4, 'Site search'),
  ...numberedCases('TC-AR-C', 1, 8, 'Copy and reuse'),
  ...numberedCases('TC-AR-E', 1, 10, 'Efficiency'),
  ...numberedCases('TC-AR-A', 1, 5, 'Accessibility and responsive'),
  ...numberedCases('TC-AR-X', 1, 3, 'Cross-workflow'),
]);

export const STEPS_5_TO_8_CASE_IDS = Object.freeze([
  'TC-AR-005',
  'TC-AR-006',
  'TC-AR-B03',
  'TC-AR-B05',
  'TC-AR-B06',
  'TC-AR-B08',
  'TC-AR-R01',
  'TC-AR-R02',
  'TC-AR-R03',
  'TC-AR-R04',
  'TC-AR-U01',
  'TC-AR-U02',
  'TC-AR-U03',
  'TC-AR-U04',
  'TC-AR-U05',
  'TC-AR-U06',
  'TC-AR-U07',
  'TC-AR-D01',
  'TC-AR-D02',
  'TC-AR-D03',
  'TC-AR-D04',
  'TC-AR-E01',
  'TC-AR-E02',
  'TC-AR-E03',
  'TC-AR-E04',
  'TC-AR-E05',
  'TC-AR-E06',
  'TC-AR-E07',
  'TC-AR-E08',
  'TC-AR-E09',
  'TC-AR-E10',
  'TC-AR-A01',
  'TC-AR-A02',
  'TC-AR-A03',
  'TC-AR-A04',
  'TC-AR-A05',
]);

export const IMPLEMENTED_ACCESS_CASE_IDS = Object.freeze([
  'TC-AR-001',
  'TC-AR-002',
  'TC-AR-003',
  'TC-AR-004',
  'TC-AR-B01',
  'TC-AR-B02',
  'TC-AR-B04',
  'TC-AR-B07',
  'TC-AR-S01',
  'TC-AR-S02',
  'TC-AR-S03',
  'TC-AR-S04',
  ...STEPS_5_TO_8_CASE_IDS,
]);

const LIVE_CASE_FILE_GROUPS = Object.freeze({
  'live/access-request/00-authentication-preflight.setup.js': Object.freeze(['TC-AR-001']),
  'live/access-request/behaviors/entry-validation-and-context.spec.js': Object.freeze([
    'TC-AR-002', 'TC-AR-003', 'TC-AR-004',
  ]),
  'live/access-request/behaviors/early-conditional-branches.spec.js': Object.freeze([
    'TC-AR-B01', 'TC-AR-B02', 'TC-AR-B07',
  ]),
  'live/access-request/behaviors/site-search.spec.js': Object.freeze([
    'TC-AR-S01', 'TC-AR-S02', 'TC-AR-S03', 'TC-AR-S04',
  ]),
  'live/access-request/journeys/navigation-persistence.spec.js': Object.freeze(['TC-AR-005']),
  'live/access-request/journeys/complete-review-path.spec.js': Object.freeze(['TC-AR-006']),
  'live/access-request/behaviors/conditional-branches.spec.js': Object.freeze([
    'TC-AR-B03', 'TC-AR-B04', 'TC-AR-B05', 'TC-AR-B06', 'TC-AR-B08',
  ]),
  'live/access-request/behaviors/navigation-and-recovery.spec.js': Object.freeze([
    'TC-AR-R02', 'TC-AR-R03',
  ]),
  'live/access-request/behaviors/documents-and-uploads.spec.js': Object.freeze([
    'TC-AR-D04', 'TC-AR-U01', 'TC-AR-U02', 'TC-AR-U03', 'TC-AR-U04',
    'TC-AR-U05', 'TC-AR-U06',
  ]),
  'live/access-request/quality/efficiency.spec.js': Object.freeze([
    'TC-AR-E02', 'TC-AR-E07',
  ]),
  'live/access-request/quality/accessibility-and-responsive.spec.js': Object.freeze([
    'TC-AR-A01', 'TC-AR-A02', 'TC-AR-A03', 'TC-AR-A04', 'TC-AR-A05',
  ]),
});

export const ACCESS_LIVE_CASE_FILE_MAP = Object.freeze(
  Object.fromEntries(
    Object.entries(LIVE_CASE_FILE_GROUPS).flatMap(([file, caseIds]) => caseIds.map((caseId) => [caseId, file])),
  ),
);

function metadataForGroup(caseIds, metadata) {
  return caseIds.map((caseId) => [caseId, Object.freeze({ ...metadata })]);
}

const ACCESS_CASE_METADATA = Object.fromEntries([
  ...metadataForGroup(['TC-AR-001'], {
    capability: 'functional', executionMode: 'smoke', risk: 'medium', prerequisites: ['authenticated-session'],
  }),
  ...metadataForGroup(['TC-AR-002', 'TC-AR-003', 'TC-AR-004'], {
    capability: 'functional', executionMode: 'focused', risk: 'medium', prerequisites: ['authenticated-session'],
  }),
  ...metadataForGroup(['TC-AR-B01', 'TC-AR-B02', 'TC-AR-B07'], {
    capability: 'conditional', executionMode: 'focused', risk: 'high', prerequisites: ['authenticated-session'],
  }),
  ...metadataForGroup(['TC-AR-S01', 'TC-AR-S02', 'TC-AR-S03', 'TC-AR-S04'], {
    capability: 'site-search', executionMode: 'focused', risk: 'medium', prerequisites: ['authenticated-session'],
  }),
  ...metadataForGroup(['TC-AR-005', 'TC-AR-006'], {
    capability: 'journey', executionMode: 'e2e', risk: 'high', prerequisites: ['authenticated-session', 'captured-field-map'],
  }),
  ...metadataForGroup(['TC-AR-B03', 'TC-AR-B04', 'TC-AR-B05', 'TC-AR-B06', 'TC-AR-B08'], {
    capability: 'conditional', executionMode: 'focused', risk: 'high', prerequisites: ['authenticated-session', 'captured-field-map'],
  }),
  ...metadataForGroup(['TC-AR-D03', 'TC-AR-D04', 'TC-AR-U01', 'TC-AR-U02', 'TC-AR-U03', 'TC-AR-U04', 'TC-AR-U05', 'TC-AR-U06'], {
    capability: 'documents', executionMode: 'focused', risk: 'high', prerequisites: ['authenticated-session', 'captured-field-map', 'synthetic-fixtures'],
  }),
  ...metadataForGroup(['TC-AR-R01', 'TC-AR-R02', 'TC-AR-R03'], {
    capability: 'recovery', executionMode: 'focused', risk: 'high', prerequisites: ['authenticated-session', 'captured-field-map'],
  }),
  ...metadataForGroup(['TC-AR-E01', 'TC-AR-E02', 'TC-AR-E03', 'TC-AR-E04', 'TC-AR-E05', 'TC-AR-E06', 'TC-AR-E07', 'TC-AR-E08', 'TC-AR-E09'], {
    capability: 'efficiency', executionMode: 'focused', risk: 'medium', prerequisites: ['authenticated-session', 'captured-field-map', 'measurement-fixture'],
  }),
  ...metadataForGroup(['TC-AR-A01', 'TC-AR-A02', 'TC-AR-A03', 'TC-AR-A04', 'TC-AR-A05'], {
    capability: 'quality', executionMode: 'focused', risk: 'medium', prerequisites: ['authenticated-session', 'captured-field-map'],
  }),
  ...metadataForGroup(['TC-AR-D01', 'TC-AR-D02', 'TC-AR-U07', 'TC-AR-E10', 'TC-AR-R04'], {
    capability: 'decision-gate', executionMode: 'gated', risk: 'high', prerequisites: ['authenticated-session', 'approved-prerequisite'],
  }),
]);

export function caseMetadataForCase(caseId) {
  const metadata = ACCESS_CASE_METADATA[caseId];
  return metadata ? { ...metadata, testFile: ACCESS_LIVE_CASE_FILE_MAP[caseId] ?? null } : null;
}

export const ACCESS_CASE_STEP_COVERAGE = Object.freeze({
  'TC-AR-001': Object.freeze([1]),
  'TC-AR-002': Object.freeze([1, 2, 3, 4]),
  'TC-AR-003': Object.freeze([1, 2]),
  'TC-AR-004': Object.freeze([1]),
  'TC-AR-005': Object.freeze([1, 2, 3, 4, 5, 6, 7, 8]),
  'TC-AR-006': Object.freeze([1, 2, 3, 4, 5, 6, 7, 8]),
  'TC-AR-B01': Object.freeze([1]),
  'TC-AR-B02': Object.freeze([1]),
  'TC-AR-B03': Object.freeze([5]),
  'TC-AR-B04': Object.freeze([4]),
  'TC-AR-B05': Object.freeze([6]),
  'TC-AR-B06': Object.freeze([6]),
  'TC-AR-B07': Object.freeze([2]),
  'TC-AR-B08': Object.freeze([5, 6, 7]),
  'TC-AR-R01': Object.freeze([5, 6, 7]),
  'TC-AR-R02': Object.freeze([5, 6, 7, 8]),
  'TC-AR-R03': Object.freeze([7]),
  'TC-AR-R04': Object.freeze([5, 6, 7, 8]),
  'TC-AR-U01': Object.freeze([7]),
  'TC-AR-U02': Object.freeze([7]),
  'TC-AR-U03': Object.freeze([7]),
  'TC-AR-U04': Object.freeze([7]),
  'TC-AR-U05': Object.freeze([7]),
  'TC-AR-U06': Object.freeze([7]),
  'TC-AR-U07': Object.freeze([7]),
  'TC-AR-P01': Object.freeze([3]),
  'TC-AR-P02': Object.freeze([3]),
  'TC-AR-P03': Object.freeze([3]),
  'TC-AR-P04': Object.freeze([3]),
  'TC-AR-P05': Object.freeze([3]),
  'TC-AR-D01': Object.freeze([7]),
  'TC-AR-D02': Object.freeze([7]),
  'TC-AR-D03': Object.freeze([7]),
  'TC-AR-D04': Object.freeze([8]),
  'TC-AR-S01': Object.freeze([1]),
  'TC-AR-S02': Object.freeze([1]),
  'TC-AR-S03': Object.freeze([1]),
  'TC-AR-S04': Object.freeze([1]),
  'TC-AR-C01': Object.freeze([3]),
  'TC-AR-C02': Object.freeze([3]),
  'TC-AR-C03': Object.freeze([3]),
  'TC-AR-C04': Object.freeze([3]),
  'TC-AR-C05': Object.freeze([3]),
  'TC-AR-C06': Object.freeze([3]),
  'TC-AR-C07': Object.freeze([3]),
  'TC-AR-C08': Object.freeze([3]),
  'TC-AR-E01': Object.freeze([5, 6, 7, 8]),
  'TC-AR-E02': Object.freeze([5, 6, 7, 8]),
  'TC-AR-E03': Object.freeze([5, 6, 7, 8]),
  'TC-AR-E04': Object.freeze([7]),
  'TC-AR-E05': Object.freeze([5, 6, 7, 8]),
  'TC-AR-E06': Object.freeze([7]),
  'TC-AR-E07': Object.freeze([5, 6, 7, 8]),
  'TC-AR-E08': Object.freeze([5, 6, 7, 8]),
  'TC-AR-E09': Object.freeze([5, 6, 7]),
  'TC-AR-E10': Object.freeze([5, 6, 7, 8]),
  'TC-AR-A01': Object.freeze([5, 6, 7, 8]),
  'TC-AR-A02': Object.freeze([5, 6, 7, 8]),
  'TC-AR-A03': Object.freeze([5, 6, 7, 8]),
  'TC-AR-A04': Object.freeze([5, 6, 7, 8]),
  'TC-AR-A05': Object.freeze([5, 6, 7, 8]),
  'TC-AR-X01': Object.freeze([1, 2, 3, 4, 5, 6, 7, 8]),
  'TC-AR-X02': Object.freeze([1, 2, 3, 4, 5, 6, 7, 8]),
  'TC-AR-X03': Object.freeze([1, 2, 3, 4, 5, 6, 7, 8]),
});

export function coveredStepsForCase(caseId) {
  return [...(ACCESS_CASE_STEP_COVERAGE[caseId] ?? [])];
}

export function formatCoveredSteps(steps) {
  const normalized = [...new Set(steps)].sort((left, right) => left - right);
  if (!normalized.length) return 'Unknown steps';
  if (normalized.length === 1) return `Step ${normalized[0]}`;
  return `Steps ${normalized[0]}–${normalized[normalized.length - 1]}`;
}

export function accessCaseTitle(caseId, description, steps = coveredStepsForCase(caseId)) {
  return `${caseId} [${formatCoveredSteps(steps)}] ${description}`;
}
