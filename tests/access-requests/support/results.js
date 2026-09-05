import { caseMetadataForCase, coveredStepsForCase } from './case-catalog.js';
import {
  ACCESS_DECISION_BLOCKERS,
  ACCESS_DERIVED_CASE_SOURCES,
  ACCESS_COVERAGE_RECORDS,
  summarizeCoverage,
} from './coverage-model.js';

const RESULT_STATUSES = Object.freeze([
  'PASS',
  'FAIL',
  'BLOCKED',
  'INCONCLUSIVE',
  'NOT APPLICABLE',
]);

const DEFAULT_SAFETY = Object.freeze({
  approvedBoundary: 'Step 8 review; final submission prohibited',
  locatorGuardInstalled: true,
  networkGuardInstalled: true,
  finalSubmitClicked: false,
  finalSubmissionAttempted: false,
  finalSubmissionCompleted: false,
  syntheticDataPolicySatisfied: true,
});

function visitResults(node, visitor) {
  if (!node || typeof node !== 'object') return;
  if (Array.isArray(node)) {
    for (const item of node) visitResults(item, visitor);
    return;
  }

  if (Array.isArray(node.attachments)) visitor(node);
  for (const value of Object.values(node)) visitResults(value, visitor);
}

function visitSpecs(node, visitor) {
  if (!node || typeof node !== 'object') return;
  if (Array.isArray(node)) {
    for (const item of node) visitSpecs(item, visitor);
    return;
  }
  for (const spec of node.specs ?? []) visitor(spec);
  visitSpecs(node.suites, visitor);
}

export function extractCaseResults(report) {
  const cases = [];
  visitResults(report?.suites, (result) => {
    for (const attachment of result.attachments) {
      if (!/^TC-AR-[A-Z0-9-]+\.json$/i.test(attachment.name ?? '') || !attachment.body) continue;
      const decoded = Buffer.from(attachment.body, 'base64').toString('utf8');
      cases.push(JSON.parse(decoded));
    }
  });
  return cases;
}

export function extractPrerequisiteResults(report) {
  const prerequisites = [];
  visitResults(report?.suites, (result) => {
    for (const attachment of result.attachments) {
      if (!/^AR-PREREQ-[A-Z0-9-]+\.json$/i.test(attachment.name ?? '') || !attachment.body) continue;
      const decoded = Buffer.from(attachment.body, 'base64').toString('utf8');
      prerequisites.push(JSON.parse(decoded));
    }
  });
  return prerequisites;
}

export function extractDeclaredCases(report) {
  const cases = [];
  const seen = new Set();
  visitSpecs(report?.suites, (spec) => {
    const match = String(spec.title ?? '').match(/^(TC-AR-[A-Z0-9-]+)/i);
    if (!match) return;
    if (seen.has(match[1])) {
      throw new Error(`Duplicate Access Request case declaration: ${match[1]}`);
    }
    seen.add(match[1]);
    cases.push({ caseId: match[1], title: spec.title });
  });
  return cases;
}

const FORBIDDEN_COMMIT_KEYS = new Set([
  'authorization',
  'cookie',
  'cookies',
  'headers',
  'postdata',
  'rawvalues',
  'storagestate',
]);

function sanitizeString(value) {
  if (/^[a-z]:[\\/]/i.test(value)) return '[LOCAL_ARTIFACT]';
  return value
    .replace(/[a-z]:\\(?:[^\\\r\n]+\\)*[^\\\r\n:]+(?::\d+){0,2}/gi, '[LOCAL_PATH]')
    .replace(
    /[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+/gi,
    (email) => email.toLowerCase().endsWith('@example.invalid') ? email : '[REDACTED_EMAIL]',
    );
}

export function sanitizeForCommit(value) {
  if (typeof value === 'string') return sanitizeString(value);
  if (Array.isArray(value)) return value.map(sanitizeForCommit);
  if (!value || typeof value !== 'object') return value;

  return Object.fromEntries(
    Object.entries(value)
      .filter(([key]) => !FORBIDDEN_COMMIT_KEYS.has(key.toLowerCase()))
      .map(([key, nestedValue]) => [key, sanitizeForCommit(nestedValue)]),
  );
}

function derivedStatus(sourceCases) {
  const statuses = new Set(sourceCases.map((item) => item.status));
  if (statuses.has('FAIL')) return 'FAIL';
  if (statuses.has('BLOCKED')) return 'BLOCKED';
  if (statuses.has('INCONCLUSIVE')) return 'INCONCLUSIVE';
  if ([...statuses].every((status) => status === 'NOT APPLICABLE')) return 'NOT APPLICABLE';
  return 'PASS';
}

function derivedCaseResult(caseId, sourceCases) {
  const sourceCaseIds = sourceCases.map((item) => item.caseId);
  const first = sourceCases[0] ?? {};
  const metadata = caseMetadataForCase(caseId) ?? {};
  const status = derivedStatus(sourceCases);
  return {
    caseId,
    capability: metadata.capability ?? null,
    executionMode: 'derived',
    risk: metadata.risk ?? null,
    prerequisites: metadata.prerequisites ?? [],
    testFile: metadata.testFile ?? null,
    suiteWave: 'Steps 1-8',
    resultType: 'Derived evidence',
    status,
    coveredSteps: coveredStepsForCase(caseId),
    branch: 'derived-evidence',
    durationMs: 0,
    environment: first.environment ?? null,
    expected: `The ${caseId} result is derived from compatible source evidence.`,
    observed: `Derived from ${sourceCaseIds.join(', ')} without another browser traversal.`,
    firstFailure: sourceCases.find((item) => item.firstFailure)?.firstFailure ?? null,
    retryOutcome: null,
    evidence: [...new Set(sourceCases.flatMap((item) => item.evidence ?? []))],
    findingIds: [...new Set(sourceCases.flatMap((item) => item.findingIds ?? []))],
    recommendationIds: [...new Set(sourceCases.flatMap((item) => item.recommendationIds ?? []))],
    runId: first.runId ?? null,
    startingPoint: first.startingPoint ?? 'Authenticated Access Request Step 1',
    stoppingPoint: sourceCases.at(-1)?.stoppingPoint ?? 'Derived evidence boundary',
    locatorGuardInstalled: sourceCases.every((item) => item.locatorGuardInstalled !== false),
    networkGuardInstalled: sourceCases.every((item) => item.networkGuardInstalled !== false),
    finalSubmitClicked: false,
    finalSubmissionAttempted: sourceCases.some((item) => item.finalSubmissionAttempted === true),
    finalSubmissionCompleted: false,
    syntheticDataPolicySatisfied: sourceCases.every((item) => item.syntheticDataPolicySatisfied !== false),
    capturedAt: first.capturedAt ?? null,
    sourceCaseIds,
    sourceBranches: sourceCases.map((item) => item.branch ?? null),
    fixtureVersion: first.fixture?.version ?? null,
    measurementMethod: first.measurementMethod ?? (metadata.oracle === 'measurement'
      ? 'derived-from-source-case-measurement'
      : 'derived-from-source-case-evidence'),
    sourceProvenance: sourceCases.map((item) => ({
      caseId: item.caseId,
      runId: item.runId ?? null,
      branch: item.branch ?? null,
      fixtureVersion: item.fixture?.version ?? null,
      measurementMethod: item.measurementMethod ?? null,
    })),
    derived: true,
    executed: false,
  };
}

function decisionCaseResult(decision) {
  const metadata = caseMetadataForCase(decision.caseId) ?? {};
  return {
    caseId: decision.caseId,
    capability: metadata.capability ?? 'decision-gate',
    executionMode: 'decision-register',
    risk: metadata.risk ?? 'high',
    prerequisites: metadata.prerequisites ?? ['approved-prerequisite'],
    testFile: null,
    suiteWave: 'Steps 1-8',
    resultType: 'Decision',
    status: 'BLOCKED',
    coveredSteps: coveredStepsForCase(decision.caseId),
    branch: 'decision-register',
    durationMs: 0,
    environment: null,
    expected: 'The named owner approves the missing rule, authority, protocol, or safe environment.',
    observed: decision.reason,
    firstFailure: null,
    retryOutcome: null,
    evidence: [],
    findingIds: [],
    recommendationIds: [],
    blockerId: decision.blockerId,
    blockerReason: decision.reason,
    owner: decision.owner,
    runId: null,
    startingPoint: 'Decision register',
    stoppingPoint: 'Decision prerequisite',
    locatorGuardInstalled: true,
    networkGuardInstalled: true,
    finalSubmitClicked: false,
    finalSubmissionAttempted: false,
    finalSubmissionCompleted: false,
    syntheticDataPolicySatisfied: true,
    executed: false,
  };
}

export function materializeCoverageResults(cases) {
  const materialized = [...cases];
  const byId = new Map(materialized.map((item) => [item.caseId, item]));

  for (const [caseId, sourceCaseIds] of Object.entries(ACCESS_DERIVED_CASE_SOURCES)) {
    if (byId.has(caseId)) continue;
    const sourceCases = sourceCaseIds.map((sourceId) => byId.get(sourceId)).filter(Boolean);
    if (sourceCases.length !== sourceCaseIds.length) continue;
    const derived = derivedCaseResult(caseId, sourceCases);
    materialized.push(derived);
    byId.set(caseId, derived);
  }

  for (const decision of ACCESS_DECISION_BLOCKERS) {
    if (byId.has(decision.caseId)) continue;
    const result = decisionCaseResult(decision);
    materialized.push(result);
    byId.set(decision.caseId, result);
  }

  return materialized;
}

function summarizeCases(cases, { selectedCases, declaredCaseIds, prerequisites }) {
  const executedCases = cases.filter((item) => item.executed !== false && !item.derived);
  const count = (status) => executedCases.filter((item) => item.status === status).length;
  const failed = count('FAIL');
  const blocked = count('BLOCKED');
  const inconclusive = count('INCONCLUSIVE');
  const finalSubmissionObserved = executedCases.some((item) => item.finalSubmissionAttempted === true);
  const waveStatus = failed
    ? 'FAIL'
    : blocked
      ? 'BLOCKED'
      : inconclusive
        ? 'INCONCLUSIVE'
        : executedCases.length < selectedCases
          ? 'PARTIAL'
          : 'PASS';

  const coverage = summarizeCoverage({ declaredCaseIds, cases, prerequisites });
  const implementedCases = ACCESS_COVERAGE_RECORDS.filter((item) => item.automation !== 'planned').length;

  return {
    matrixCases: coverage.matrixCases,
    classifiedCases: coverage.classifiedCases,
    selectedCases,
    plannedCases: coverage.matrixCases,
    implementedCases,
    automatedDeclarations: coverage.automatedDeclarations,
    exploratoryProbes: coverage.exploratoryProbes,
    executableCases: coverage.executableCases,
    executedCases: executedCases.length,
    acceptancePasses: coverage.acceptancePasses,
    characterizations: coverage.characterizations,
    measurements: coverage.measurements,
    derivedResults: coverage.derivedResults,
    decisionBlockers: coverage.decisionBlockers,
    plannedOnlyCases: coverage.plannedCases,
    passed: count('PASS'),
    failed,
    blocked,
    inconclusive,
    notApplicable: count('NOT APPLICABLE'),
    zeroSubmissionConfirmed: !finalSubmissionObserved,
    waveStatus,
  };
}

function collectBlockers(cases, configuredBlockers) {
  const blockersById = new Map(
    configuredBlockers.map((item) => [item.id, { ...item, caseIds: [...(item.caseIds ?? [])] }]),
  );

  for (const item of cases) {
    if (item.status !== 'BLOCKED' || !item.blockerId) continue;
    const blocker = blockersById.get(item.blockerId) ?? {
      id: item.blockerId,
      reason: item.blockerReason ?? item.observed,
      caseIds: [],
    };
    if (!blocker.owner && item.owner) blocker.owner = item.owner;
    if (!blocker.caseIds.includes(item.caseId)) blocker.caseIds.push(item.caseId);
    blockersById.set(blocker.id, blocker);
  }

  return [...blockersById.values()];
}

function normalizeConfigurationPath(value) {
  if (typeof value !== 'string' || !value) return null;
  const normalized = value.replaceAll('\\', '/');
  const repositoryPathStart = normalized.lastIndexOf('tests/access-requests/configs/');
  const repositoryPath = repositoryPathStart >= 0 ? normalized.slice(repositoryPathStart) : normalized;
  return repositoryPath.replace(
    'tests/access-requests/configs/playwright.steps-5-8.config.js',
    'tests/access-requests/configs/playwright.access-request.config.js',
  )
    .replace(
      'tests/access-requests/configs/playwright.steps-1-8.config.js',
      'tests/access-requests/configs/playwright.access-request.config.js',
    )
    .replace(
      'tests/access-requests/configs/playwright.live.config.js',
      'tests/access-requests/configs/playwright.access-request.config.js',
    );
}

export function buildConsolidatedResult({
  run,
  cases,
  findings = [],
  recommendations = [],
  blockers = [],
  prerequisites = [],
  safety = {},
  selectedCases = cases.filter((item) => item.executed !== false && !item.derived).length,
  declaredCaseIds = cases.filter((item) => item.executed !== false && !item.derived).map((item) => item.caseId),
}) {
  for (const item of cases) {
    if (!RESULT_STATUSES.includes(item.status)) {
      throw new Error(`Invalid Access Request result status for ${item.caseId}: ${item.status}`);
    }
  }

  const allEvidence = [...cases, ...prerequisites];
  const safetyFromEvidence = {
    finalSubmitClicked: allEvidence.some((item) => item.finalSubmitClicked === true),
    finalSubmissionAttempted: allEvidence.some((item) => item.finalSubmissionAttempted === true),
    finalSubmissionCompleted: allEvidence.some((item) => item.finalSubmissionCompleted === true),
  };
  const mergedSafety = {
    ...DEFAULT_SAFETY,
    ...safety,
    ...Object.fromEntries(Object.entries(safetyFromEvidence).map(([key, value]) => [
      key,
      Boolean(safety[key] || value),
    ])),
  };
  return {
    schemaVersion: 2,
    run,
    summary: summarizeCases(cases, { selectedCases, declaredCaseIds, prerequisites }),
    safety: mergedSafety,
    cases,
    findings,
    recommendations,
    blockers: collectBlockers(cases, blockers),
    prerequisites,
  };
}

export function consolidatePlaywrightReport(report, {
  plannedCases,
  fixtureVersion,
  findings = [],
  recommendations = [],
  blockers = [],
} = {}) {
  const extractedCases = extractCaseResults(report);
  const prerequisiteResults = extractPrerequisiteResults(report);
  const declaredCases = extractDeclaredCases(report);
  const firstCase = extractedCases[0] ?? {};
  const environment = firstCase.environment ?? {};
  const startedAt = report?.stats?.startTime ?? null;
  const duration = Number(report?.stats?.duration ?? 0);
  const completedAt = startedAt
    ? new Date(new Date(startedAt).valueOf() + duration).toISOString()
    : null;
  const configuration = normalizeConfigurationPath(report?.config?.configFile)
    ?? normalizeConfigurationPath(environment.configuration);
  const normalizedCases = extractedCases.map((item) => {
    const metadata = caseMetadataForCase(item.caseId) ?? {};
    return {
      ...item,
      capability: item.capability ?? metadata.capability ?? null,
      executionMode: item.executionMode ?? metadata.executionMode ?? null,
      risk: item.risk ?? metadata.risk ?? null,
      prerequisites: item.prerequisites ?? metadata.prerequisites ?? [],
      testFile: item.testFile ?? metadata.testFile ?? null,
      suiteWave: 'Steps 1-8',
      coveredSteps: item.coveredSteps ?? coveredStepsForCase(item.caseId),
      startingPoint: item.startingPoint ?? 'Authenticated Access Request Step 1',
      entryPoint: item.entryPoint ?? 'Authenticated Access Request Step 1',
      fixture: item.fixture ?? {
        version: fixtureVersion ?? 1,
        profile: 'synthetic-access-request',
        runId: item.runId ?? null,
      },
      environment: item.environment
        ? { ...item.environment, configuration }
        : item.environment,
    };
  });
  const declaredCaseIds = new Set(declaredCases.map((item) => item.caseId));
  const extractedCaseIds = new Set(normalizedCases.map((item) => item.caseId));
  const blockedPrerequisite = prerequisiteResults.find((item) => item.status === 'BLOCKED')
    ?? normalizedCases.find((item) => item.status === 'BLOCKED' && item.blockerId === 'AUTH-AR-01');
  for (const declared of declaredCases) {
    if (extractedCaseIds.has(declared.caseId)) continue;
    const metadata = caseMetadataForCase(declared.caseId) ?? {};
    const status = blockedPrerequisite ? 'BLOCKED' : 'INCONCLUSIVE';
    const blockerId = blockedPrerequisite?.blockerId ?? null;
    const blockerReason = blockedPrerequisite
      ? (blockedPrerequisite.blockerReason ?? blockedPrerequisite.observed)
      : 'The declaration completed without a case-result attachment; no acceptance claim is made.';
    normalizedCases.push({
      caseId: declared.caseId,
      capability: metadata.capability ?? null,
      executionMode: metadata.executionMode ?? null,
      risk: metadata.risk ?? null,
      prerequisites: metadata.prerequisites ?? [],
      testFile: metadata.testFile ?? null,
      suiteWave: 'Steps 1-8',
      coveredSteps: coveredStepsForCase(declared.caseId),
      resultType: blockedPrerequisite ? 'Dependency prerequisite' : 'Missing evidence',
      status,
      step: null,
      branch: null,
      durationMs: 0,
      environment: {
        browser: environment.browser ?? null,
        viewport: environment.viewport ?? null,
        url: environment.url ?? null,
        commit: environment.commit ?? null,
        trackedWorktreeDirty: environment.trackedWorktreeDirty ?? null,
        configuration,
      },
      expected: declared.title,
      observed: blockedPrerequisite
        ? `Not executed because ${blockedPrerequisite.blockerId} blocked a shared execution prerequisite.`
        : blockerReason,
      firstFailure: null,
      retryOutcome: null,
      evidence: [],
      findingIds: [],
      recommendationIds: [],
      blockerId,
      blockerReason: blockerId ? blockerReason : null,
      runId: firstCase.runId ?? null,
      startingPoint: blockedPrerequisite?.prerequisiteId ?? 'Authenticated Access Request Step 1',
      stoppingPoint: blockedPrerequisite?.prerequisiteId ?? 'Missing case-result attachment',
      locatorGuardInstalled: true,
      networkGuardInstalled: true,
      finalSubmitClicked: false,
      finalSubmissionAttempted: false,
      finalSubmissionCompleted: false,
      syntheticDataPolicySatisfied: true,
      capturedAt: startedAt ?? new Date().toISOString(),
      executed: false,
    });
  }
  const materializedCases = materializeCoverageResults(normalizedCases);
  return buildConsolidatedResult({
    run: {
      runId: firstCase.runId ?? null,
      targetUrl: environment.url ?? null,
      commit: environment.commit ?? null,
      trackedWorktreeDirty: environment.trackedWorktreeDirty ?? null,
      configuration,
      browser: environment.browser ?? null,
      viewport: environment.viewport ?? null,
      accountClassification: 'approved authenticated session',
      startedAt,
      completedAt,
      fixtureVersion,
    },
    cases: materializedCases,
    selectedCases: plannedCases ?? (declaredCaseIds.size || normalizedCases.length),
    declaredCaseIds: [...declaredCaseIds],
    findings,
    recommendations,
    blockers,
    prerequisites: prerequisiteResults,
  });
}
