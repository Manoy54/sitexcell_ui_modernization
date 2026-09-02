import { ACCESS_CASE_CATALOG } from './case-catalog.js';

const DERIVED_CASE_SOURCES = Object.freeze({
  'TC-AR-R01': Object.freeze(['TC-AR-005']),
  'TC-AR-D03': Object.freeze(['TC-AR-U05']),
  'TC-AR-E01': Object.freeze(['TC-AR-E02']),
  'TC-AR-E03': Object.freeze(['TC-AR-E02']),
  'TC-AR-E04': Object.freeze(['TC-AR-E02']),
  'TC-AR-E05': Object.freeze(['TC-AR-E02']),
  'TC-AR-E06': Object.freeze(['TC-AR-R03']),
  'TC-AR-E08': Object.freeze(['TC-AR-A01']),
  'TC-AR-E09': Object.freeze(['TC-AR-R03']),
});

export const ACCESS_DERIVED_CASE_SOURCES = DERIVED_CASE_SOURCES;

export const ACCESS_DECISION_BLOCKERS = Object.freeze([
  Object.freeze({
    caseId: 'TC-AR-D01',
    blockerId: 'DOCUMENT-SOURCE-AR-01',
    reason: 'The saved-document source, ownership, and authenticated UI are not approved.',
    owner: 'operations/data + security/privacy',
  }),
  Object.freeze({
    caseId: 'TC-AR-D02',
    blockerId: 'DOCUMENT-VALIDITY-AR-01',
    reason: 'The authoritative document-validity and expiry rules are not approved.',
    owner: 'operations/data',
  }),
  Object.freeze({
    caseId: 'TC-AR-U07',
    blockerId: 'UPLOAD-STAGING-AR-01',
    reason: 'Approved staging or upload fault-injection controls are unavailable.',
    owner: 'developer + security/privacy',
  }),
  Object.freeze({
    caseId: 'TC-AR-E10',
    blockerId: 'COPY-PROTOCOL-AR-01',
    reason: 'Approved copy behavior and the comparable human measurement protocol are unavailable.',
    owner: 'product/business + QA',
  }),
  Object.freeze({
    caseId: 'TC-AR-R04',
    blockerId: 'DECISION-AR-DRAFT',
    reason: 'Draft ownership, expiry, privacy, restore, and discard rules are not approved.',
    owner: 'product/business + security/privacy',
  }),
]);

const DECISION_CASE_IDS = new Set(ACCESS_DECISION_BLOCKERS.map((item) => item.caseId));
const DERIVED_CASE_IDS = new Set(Object.keys(ACCESS_DERIVED_CASE_SOURCES));
const CURRENT_BROWSER_CASE_IDS = new Set([
  'TC-AR-001', 'TC-AR-002', 'TC-AR-003', 'TC-AR-004', 'TC-AR-005', 'TC-AR-006',
  'TC-AR-B01', 'TC-AR-B02', 'TC-AR-B03', 'TC-AR-B04',
  'TC-AR-B05', 'TC-AR-B06', 'TC-AR-B07', 'TC-AR-B08',
  'TC-AR-R02', 'TC-AR-R03',
  'TC-AR-U01', 'TC-AR-U02', 'TC-AR-U03', 'TC-AR-U04', 'TC-AR-U05', 'TC-AR-U06',
  'TC-AR-D04',
  'TC-AR-S01', 'TC-AR-S02', 'TC-AR-S03', 'TC-AR-S04',
  'TC-AR-E02', 'TC-AR-E07',
  'TC-AR-A01', 'TC-AR-A02', 'TC-AR-A03', 'TC-AR-A04', 'TC-AR-A05',
]);

export const ACCESS_BROWSER_CASE_IDS = Object.freeze([...CURRENT_BROWSER_CASE_IDS]);

const PHASE_TWO_CASE_IDS = new Set([
  'TC-AR-R04',
  'TC-AR-P01', 'TC-AR-P02', 'TC-AR-P03', 'TC-AR-P04', 'TC-AR-P05',
  'TC-AR-D01', 'TC-AR-D02',
  'TC-AR-C01', 'TC-AR-C02', 'TC-AR-C03', 'TC-AR-C04',
  'TC-AR-C05', 'TC-AR-C06', 'TC-AR-C07', 'TC-AR-C08',
  'TC-AR-E10',
  'TC-AR-X01', 'TC-AR-X02', 'TC-AR-X03',
]);

const MEASUREMENT_CASE_IDS = new Set([
  'TC-AR-S04',
  'TC-AR-E01', 'TC-AR-E02', 'TC-AR-E03', 'TC-AR-E04', 'TC-AR-E05',
  'TC-AR-E06', 'TC-AR-E07', 'TC-AR-E08', 'TC-AR-E09',
  'TC-AR-X03',
]);

const CHARACTERIZATION_CASE_IDS = new Set([
  'TC-AR-002', 'TC-AR-003',
  'TC-AR-B01', 'TC-AR-B02', 'TC-AR-B03', 'TC-AR-B04',
  'TC-AR-B05', 'TC-AR-B06', 'TC-AR-B07', 'TC-AR-B08',
  'TC-AR-R02',
  'TC-AR-D04',
]);

function oracleForCase(caseId) {
  if (DECISION_CASE_IDS.has(caseId)) return 'decision';
  if (MEASUREMENT_CASE_IDS.has(caseId)) return 'measurement';
  if (CHARACTERIZATION_CASE_IDS.has(caseId)) return 'characterization';
  if (/^TC-AR-(P|C|X0[12])/.test(caseId)) return 'decision';
  return 'acceptance';
}

function tierForCase(caseId, oracle) {
  if (caseId === 'TC-AR-001') return 'smoke';
  if (oracle === 'decision') return 'decision-register';
  if (oracle === 'measurement') return 'measurement';
  if (oracle === 'characterization') return 'characterization';
  return 'regression';
}

function automationForCase(caseId) {
  if (CURRENT_BROWSER_CASE_IDS.has(caseId)) return 'browser';
  if (DERIVED_CASE_IDS.has(caseId)) return 'derived';
  if (DECISION_CASE_IDS.has(caseId)) return 'decision';
  return 'planned';
}

export const ACCESS_COVERAGE_RECORDS = Object.freeze(ACCESS_CASE_CATALOG.map(({ id, family }) => {
  const oracle = oracleForCase(id);
  return Object.freeze({
    caseId: id,
    family,
    phase: PHASE_TWO_CASE_IDS.has(id) ? 2 : 1,
    oracle,
    tier: tierForCase(id, oracle),
    automation: automationForCase(id),
  });
}));

const COVERAGE_BY_CASE = new Map(ACCESS_COVERAGE_RECORDS.map((item) => [item.caseId, item]));

export function coverageRecordForCase(caseId) {
  const record = COVERAGE_BY_CASE.get(caseId);
  return record ? { ...record } : null;
}

export function summarizeCoverage({ declaredCaseIds = [], cases = [], prerequisites = [] } = {}) {
  const executed = cases.filter((item) => item.executed !== false && !item.derived);
  const blockedPrerequisiteIds = new Set(
    prerequisites.filter((item) => item.status === 'BLOCKED').map((item) => item.prerequisiteId),
  );
  const eligibleDeclarations = declaredCaseIds.filter((caseId) => {
    const metadata = ACCESS_COVERAGE_RECORDS.find((item) => item.caseId === caseId);
    const prerequisitesForCase = metadata ? (metadata.prerequisites ?? []) : [];
    return !prerequisitesForCase.some((prerequisite) => blockedPrerequisiteIds.has(prerequisite));
  });
  return {
    matrixCases: ACCESS_CASE_CATALOG.length,
    classifiedCases: ACCESS_COVERAGE_RECORDS.length,
    automatedDeclarations: new Set(declaredCaseIds).size,
    executableCases: new Set(eligibleDeclarations).size,
    executedCases: executed.length,
    acceptancePasses: executed.filter((item) => item.resultType === 'Acceptance' && item.status === 'PASS').length,
    characterizations: executed.filter((item) => item.resultType === 'Characterization').length,
    measurements: executed.filter((item) => item.resultType === 'Efficiency').length,
    derivedResults: cases.filter((item) => item.derived === true).length,
    decisionBlockers: ACCESS_DECISION_BLOCKERS.length,
    plannedCases: ACCESS_COVERAGE_RECORDS.filter((item) => item.automation === 'planned').length,
  };
}
