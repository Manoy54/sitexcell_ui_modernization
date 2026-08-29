# Access Requests Test Summary

Status: Steps 5–8 automation is implemented; live execution is blocked by the current authenticated session.

## Current implementation

- Approved matrix: 64 cases.
- Executable cases: 40.
- Remaining planned cases without executable declarations: 24.
- Core implementation: `TC-AR-001`–`TC-AR-006`.
- Steps 5–8 implementation: 36 cases across conditional branches, recovery,
  uploads, document context, efficiency, accessibility, and responsive behavior.
- Formal Steps 1–8 Playwright run size: 40 declarations including the
  authentication preflight dependency.
- Unit coverage: 19 tests for run IDs, final-submission guards, result
  consolidation/sanitization, case catalog integrity, field-map rendering, and
  deterministic synthetic field values.

## Latest live run

- Run ID: `test-The-CRM-Carpenters-000041-20260829T111406111Z`.
- Date: 2026-08-29.
- Scope: Earlier later-step run captured before the formal Steps 1–8 consolidation.
- Target: `https://co-siter.com.au/access-requests/`.
- Result: `BLOCKED` by `AUTH-AR-01`.
- Observed route: `https://co-siter.com.au/`.
- Executed: 1 authentication preflight.
- Dependent cases not run: 36.
- Product failures: 0 established.
- Final submission attempts: 0.
- Consolidated result counts: 37 declared/implemented, 1 executed, 37
  classified `BLOCKED`, 0 passed, 0 failed.

The target redirected to `/` and did not render `#gform_3`. This is an
authentication/authorization prerequisite failure, not an Access Request product
defect. A visible refresh attempt also timed out before the authenticated form
became available.

## Previous successful evidence

The refreshed authenticated run on 2026-08-26 remains the latest successful core
behavior evidence:

- `TC-AR-001` passed the authenticated Step 1 preflight.
- `TC-AR-002` reached Step 4 with synthetic contractor details and qualification
  upload.
- `TC-AR-003` confirmed the Site-derived hidden building context.
- `TC-AR-004` confirmed empty Step 1 validation.
- No final submission was attempted.

That historical 4/4 result does not override the current `AUTH-AR-01` blocker.

## Steps 5–8 coverage implemented

| Family | Executable cases | Current live status |
| --- | ---: | --- |
| Core navigation and pre-submit | 2 | Blocked by authentication/field-map prerequisite |
| Conditional branches | 4 | Blocked by authentication/field-map prerequisite |
| Recovery | 4 | Implemented; current run blocked by authentication; draft lifecycle remains explicitly blocked |
| Uploads | 7 | Live cases blocked; size/failure cases retain explicit rule/staging gates |
| Document context | 4 | Live cases blocked; saved-document authority decisions remain explicit |
| Efficiency | 10 | Live evidence blocked; copy/human protocol remains explicitly blocked |
| Accessibility and responsive | 5 | Blocked by authentication/field-map prerequisite |

## Evidence and reporting

- Raw Playwright report:
  `.test-artifacts/playwright/access-request-steps-1-8-results.json`.
- Archived raw report:
  `.test-artifacts/playwright/history/test-The-CRM-Carpenters-000041-20260829T111406111Z-steps-5-8.json`.
- Local consolidated report:
  `.test-artifacts/playwright/access-request-results.json`.
- Sanitized committed report: [`access-request-results.json`](./access-request-results.json).
- Field-map JSON: [`steps-5-8-field-map.json`](./steps-5-8-field-map.json).
- Field-map summary: [`steps-5-8-field-map.md`](./steps-5-8-field-map.md).

The field-map capture is currently `BLOCKED` and contains no guessed Step 5–8
selectors. Once authentication is restored, `npm run
test:access:capture:steps-5-8` captures the real fields before live behavior
assertions execute.

## Findings and recommendations

No Step 5–8 product finding or recommendation is approved from the blocked run.
The result contract supports linked findings and recommendations, but those
collections remain empty until reproducible live evidence exists.

## Prototype gate

- Core implementation complete: Yes.
- Latest core execution available: No — `AUTH-AR-01`.
- Steps 5–8 implementation complete: Yes for the approved 36-case scope.
- Steps 5–8 live evidence complete: No.
- Field/branch map complete: No — `AUTH-AR-01`.
- Upload restrictions verified: No.
- Accessibility/responsive evidence complete: No.
- Efficiency evidence complete: No.
- Prototype implementation authorized: No.
- Prototype approved: No.

## Required next action

Refresh an approved account/session that can render
`https://co-siter.com.au/access-requests/`, then run:

```powershell
npm run test:access:capture:steps-5-8
npm run test:access:live:steps-1-8
```

Review focused failures before claiming a full pass. The suite must not bypass the
field-map gate, weaken final-submission guards, or classify skipped dependent
cases as passed.
