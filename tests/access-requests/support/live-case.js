import {
  AccessRequestBlockedError,
  attachCaseResult,
  openAccessRequestForm,
} from './form-helpers.js';
import { installFinalSubmissionGuard } from './safety-guards.js';
import { connectToAuthenticatedContext } from './session.js';

export async function runLiveAccessCase(testInfo, {
  caseId,
  resultType,
  expected,
  suiteWave = 'Steps 5-8',
  step = null,
  branch = null,
}, exercise) {
  const startedAt = Date.now();
  const { browser, context, ownsBrowser } = await connectToAuthenticatedContext();
  const page = await context.newPage();
  const wasFinalSubmissionAttempted = await installFinalSubmissionGuard(page);

  try {
    try {
      await openAccessRequestForm(page);
      const outcome = await exercise({ page, context }) ?? {};
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
      });
      throw error;
    }
  } finally {
    await page.close();
    if (ownsBrowser) await browser.close();
  }
}
