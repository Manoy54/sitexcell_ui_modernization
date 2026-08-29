import { caseMetadataForCase, coveredStepsForCase } from './case-catalog.js';

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

function summarizeCases(cases, plannedCases, implementedCases = cases.length) {
  const count = (status) => cases.filter((item) => item.status === status).length;
  const failed = count('FAIL');
  const blocked = count('BLOCKED');
  const inconclusive = count('INCONCLUSIVE');
  const executedCases = cases.filter((item) => item.executed !== false);
  const finalSubmissionObserved = executedCases.some((item) => item.finalSubmissionAttempted === true);
  const waveStatus = failed
    ? 'FAIL'
    : blocked
      ? 'BLOCKED'
      : inconclusive
        ? 'INCONCLUSIVE'
        : executedCases.length < plannedCases
          ? 'PARTIAL'
        : 'PASS';

  return {
    plannedCases,
    implementedCases,
    executedCases: executedCases.length,
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
  safety = {},
  plannedCases = cases.length,
  implementedCases = cases.length,
}) {
  for (const item of cases) {
    if (!RESULT_STATUSES.includes(item.status)) {
      throw new Error(`Invalid Access Request result status for ${item.caseId}: ${item.status}`);
    }
  }

  return {
    schemaVersion: 1,
    run,
    summary: summarizeCases(cases, plannedCases, implementedCases),
    safety: { ...DEFAULT_SAFETY, ...safety },
    cases,
    findings,
    recommendations,
    blockers: collectBlockers(cases, blockers),
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
  const preflightBlocker = normalizedCases.find((item) => item.status === 'BLOCKED'
    && item.blockerId === 'AUTH-AR-01');
  if (preflightBlocker) {
    for (const declared of declaredCases) {
      if (extractedCaseIds.has(declared.caseId)) continue;
      const metadata = caseMetadataForCase(declared.caseId) ?? {};
      normalizedCases.push({
        caseId: declared.caseId,
        capability: metadata.capability ?? null,
        executionMode: metadata.executionMode ?? null,
        risk: metadata.risk ?? null,
        prerequisites: metadata.prerequisites ?? [],
        testFile: metadata.testFile ?? null,
        suiteWave: 'Steps 1-8',
        coveredSteps: coveredStepsForCase(declared.caseId),
        resultType: 'Dependency preflight',
        status: 'BLOCKED',
        step: null,
        branch: null,
        durationMs: 0,
        environment: {
          browser: environment.browser ?? null,
          viewport: environment.viewport ?? null,
          url: environment.url ?? null,
          commit: environment.commit ?? null,
          configuration,
        },
        expected: declared.title,
        observed: `Not executed because ${preflightBlocker.blockerId} blocked the authentication preflight.`,
        firstFailure: null,
        retryOutcome: null,
        evidence: [],
        findingIds: [],
        recommendationIds: [],
        blockerId: preflightBlocker.blockerId,
        blockerReason: preflightBlocker.blockerReason ?? preflightBlocker.observed,
        runId: firstCase.runId ?? null,
        startingPoint: 'Authentication/authorization preflight',
        stoppingPoint: 'Authentication/authorization preflight',
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
  }
  return buildConsolidatedResult({
    run: {
      runId: firstCase.runId ?? null,
      targetUrl: environment.url ?? null,
      commit: environment.commit ?? null,
      configuration,
      browser: environment.browser ?? null,
      viewport: environment.viewport ?? null,
      accountClassification: 'approved authenticated session',
      startedAt,
      completedAt,
      fixtureVersion,
    },
    cases: normalizedCases,
    plannedCases: plannedCases ?? (declaredCaseIds.size || normalizedCases.length),
    implementedCases: declaredCaseIds.size || normalizedCases.length,
    findings,
    recommendations,
    blockers,
  });
}
