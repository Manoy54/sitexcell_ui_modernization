import {
  AccessRequestBlockedError,
  attachCaseResult,
  captureAccessProgress,
  openAccessRequestForm,
} from './form-helpers.js';
import { caseMetadataForCase } from './case-catalog.js';
import { requireCapturedStepsFieldMap } from './field-map-gate.js';
import { installFinalSubmissionGuard } from './safety-guards.js';
import { connectToAuthenticatedContext } from './session.js';

export async function runLiveAccessCase(testInfo, {
  caseId,
  resultType,
  expected,
  suiteWave = 'Steps 1-8',
  step = null,
  branch = null,
  skipOpen = false,
}, exercise) {
  const startedAt = Date.now();
  const timings = {};
  const contextStartedAt = Date.now();
  let connection;
  try {
    connection = await connectToAuthenticatedContext();
  } catch (error) {
    const blockerReason = String(error?.message ?? error);
    testInfo.annotations.push({ type: 'result-status', description: 'BLOCKED' });
    await attachCaseResult(testInfo, null, {
      caseId,
      resultType,
      status: 'BLOCKED',
      startedAt,
      expected,
      observed: blockerReason,
      stoppingPoint: 'Authentication/authorization preflight',
      finalSubmissionAttempted: false,
      blockerId: 'AUTH-AR-01',
      blockerReason,
      timings: { contextSetupMs: Date.now() - contextStartedAt },
    });
    throw new AccessRequestBlockedError(`Access Request execution blocked: ${blockerReason}`, {
      blockerId: 'AUTH-AR-01',
      blockerReason,
    });
  }
  const { browser, context, ownsBrowser, ownsContext } = connection;
  timings.contextSetupMs = Date.now() - contextStartedAt;
  const page = await context.newPage();
  const wasFinalSubmissionAttempted = await installFinalSubmissionGuard(page);

  try {
    try {
      const prerequisiteStartedAt = Date.now();
      const caseMetadata = caseMetadataForCase(caseId);
      if (caseMetadata?.prerequisites.includes('captured-field-map')) {
        requireCapturedStepsFieldMap();
      }
      timings.prerequisiteCheckMs = Date.now() - prerequisiteStartedAt;
      if (skipOpen) {
        timings.openFormMs = 0;
        timings.formNavigationSkipped = true;
      } else {
        const openStartedAt = Date.now();
        await openAccessRequestForm(page);
        timings.openFormMs = Date.now() - openStartedAt;
      }
      const exerciseStartedAt = Date.now();
      const outcome = await exercise({ page, context }) ?? {};
      timings.exerciseMs = Date.now() - exerciseStartedAt;
      const finalSubmissionAttempted = await wasFinalSubmissionAttempted();
      if (finalSubmissionAttempted) {
        throw new Error('The final submission guard observed a prohibited submission attempt.');
      }
      await attachCaseResult(testInfo, page, {
        caseId,
        resultType,
        status: outcome.status ?? 'PASS',
        startedAt,
        expected,
        observed: outcome.observed ?? 'The expected Access Request behavior was observed.',
        stoppingPoint: outcome.stoppingPoint ?? `Step ${step ?? 'unknown'}`,
        finalSubmissionAttempted,
        firstFailure: outcome.firstFailure ?? null,
        suiteWave,
        step: outcome.step ?? step,
        branch: outcome.branch ?? branch,
        blockerId: outcome.blockerId ?? null,
        blockerReason: outcome.blockerReason ?? null,
        retryOutcome: outcome.retryOutcome ?? null,
        findingIds: outcome.findingIds ?? [],
        recommendationIds: outcome.recommendationIds ?? [],
        timings,
        extra: outcome.extra ?? {},
      });
      return outcome;
    } catch (error) {
      const status = error instanceof AccessRequestBlockedError ? 'BLOCKED' : 'FAIL';
      testInfo.annotations.push({ type: 'result-status', description: status });
      await attachCaseResult(testInfo, page, {
        caseId,
        resultType,
        status,
        startedAt,
        expected,
        observed: status === 'BLOCKED'
          ? error.blockerReason
          : 'The live Access Request behavior did not satisfy the case expectation.',
        firstFailure: String(error?.message ?? error),
        stoppingPoint: status === 'BLOCKED'
          ? 'Execution prerequisite'
          : `Step ${step ?? 'unknown'} assertion`,
        finalSubmissionAttempted: await wasFinalSubmissionAttempted(),
        suiteWave,
        step,
        branch,
        blockerId: status === 'BLOCKED' ? error.blockerId : null,
        blockerReason: status === 'BLOCKED' ? error.blockerReason : null,
        timings,
        extra: { progress: await captureAccessProgress(page) },
      });
      throw error;
    }
  } finally {
    await page.close();
    if (ownsContext) await context.close();
    if (ownsBrowser) await browser.close();
  }
}
