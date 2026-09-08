# Access Requests Test Summary

Status: Unified Steps 1–8 baseline executed with truthful PASS, FAIL, BLOCKED, and NOT APPLICABLE classifications.

## Current implementation

- Approved matrix: 64 cases.
- Classified: 64/64 (100%).
- Live browser declarations: 50 (34 established cases plus 16 observation-only exploratory probes).
- Derived results: 9.
- Decision blockers: 5.
- Remaining planning-only cases: 16.
- Implemented/declared/derived-or-decision coverage: 48/64 (75%).
- Technical field inventory: 392 captured controls grouped into 264 field/rule rows across Steps 1–8.
- Field/rule evidence-backed rows: 0; all rows are explicitly `technical-inventory-only` pending owner approval.
- Final-submit attempts: 0.
- Unit coverage: 46 tests pass.

The 16 exploratory declarations do not promote the person, copy/reuse, or
cross-workflow cases to approved implementation. They record visible behavior
as characterization evidence and unavailable or unapproved behavior as
`BLOCKED`.

## Latest live run

Current evidence run: `test-The-CRM-Carpenters-000154-20260908T061810213Z`

- Run ID: `test-The-CRM-Carpenters-000154-20260908T061810213Z`.
- Date: 2026-09-08.
- Scope: Complete serial 50-case Steps 1–8 browser declaration set plus authentication and Step 5 readiness prerequisites (51 Playwright entries).
- Target: `https://co-siter.com.au/access-requests/`.
- Result: `FAIL` because U04 and R03 reproduced direct live behavior failures; A01 and R02 passed after test-harness refinement; 20 executed browser cases were blocked and one was not applicable.
- Executable declarations: 50.
- Executed browser cases: 50.
- Acceptance passes: 7.
- Characterizations: 27.
- Measurements: 3.
- Raw Playwright result: 49 passed, 2 failed.
- Direct product/behavior failures: 2.
- Browser blockers: 20.
- NOT APPLICABLE outcomes: 1.
- Final submission attempts: 0; Step 8 remained the maximum boundary.

The run proves the harness, authentication, field-map freshness, serial gating,
and final-submit guard. It does not establish backend acceptance or a clean
product baseline. U04 and R03 reproduce unrelated upload-state loss. R02 and
A01 pass after the reload-timeout and radio-group matching refinements. Derived
E06 and E09 inherit the R03 failure; E08 is now passing. Blockers are not
converted to failures or passes.

## Focused exploratory run

- Focused evidence run: `test-The-CRM-Carpenters-000134-20260905T141421125Z`.
- Scope: Authentication plus all 16 `P*`, `C*`, and `X*` exploratory probes.
- Technical runner result: 17/17 Playwright tests passed in 7.7 minutes.
- Evidence result: 2 characterization passes (`P01`, `P04`), 14 blockers, and 0 failures.
- Copy/reuse result: no explicit Step 3 copy/reuse affordance was visible.
- Person result: manual synthetic entry/editing worked; returning-person and role-reuse sources were absent or unapproved.
- Cross-workflow result: two candidate concept groups were inventoried; the configured Site labels differ, the LAAN target was not visible, and semantic/effort authority is unavailable.
- Safety result: zero final-submit clicks, attempts, or completions.

The technical pass means every probe completed and produced evidence. It does
not convert any `BLOCKED` business result into a feature pass.

## Evidence and reporting

- Sanitized committed report: [`access-request-results.json`](./access-request-results.json).
- Sanitized focused exploratory report: [`access-request-exploratory-results.json`](./access-request-exploratory-results.json).
- Full Steps 1–8 field map: [`steps-1-8-field-map.json`](./steps-1-8-field-map.json) and [`steps-1-8-field-map.md`](./steps-1-8-field-map.md).
- Field/rule ledger: [`field-rule-ledger.json`](./field-rule-ledger.json) and [`field-rule-ledger.md`](./field-rule-ledger.md).
- Governing specification: [`test-refinement-spec.md`](./test-refinement-spec.md).
- Coverage ledger: [`coverage-ledger.md`](./coverage-ledger.md).

Focused exploratory execution uses `npm run test:access:live:exploratory`.
The person, copy/reuse, and cross-workflow families also have separate
`test:access:live:*` commands for isolated diagnosis. Every command stops before
final submission and writes a sanitized focused consolidated result.

## Current interpretation

- Tenure, emergency/network, Site acknowledgement, contractor-count, Site
  selection, conditional branches, and responsive cases now have direct live
  declarations.
- U03 is blocked because the live upload controls expose no accepted type
  contract. U04 has a declared size boundary, but the focused rerun shows that
  rejecting an oversized file clears unrelated files. U05 is blocked because review confirmations are not
  associated with individual uploads. U06 is blocked because no user-facing
  removal action is identifiable. D04 is blocked because no request-specific
  document field is present in the captured branch.
- R02 passes after the characterization timeout was increased to accommodate the
  four-step live reload journey. R03 still fails because validation clears
  unrelated uploads. A01 passes after the keyboard helper was corrected to
  match radio groups by name. A02, A03, A04, and A05 pass in the final run.
  TC-AR-005 and TC-AR-006 pass after their test-oracle
  corrections; B05 and B08 remain branch observations/blockers in the final
  run. No recommendation is approved solely from automated timing.
- The field/rule ledger prevents the captured DOM from being mistaken for
  approved business coverage; every row names an owner and blocker.

### Focused triage reruns

| Case | Working classification | Required confirmation |
|---|---|---|
| `TC-AR-B05` | Transient DNS failure in baseline | `PASS` in focused run 000108 after confirming DNS/live reachability |
| `TC-AR-006` | Review text did not contain an unapproved run-ID/file-string oracle | `PASS` in focused run 000111; review values remain observational |
| `TC-AR-005` | Snapshot included conditional controls not entered by the harness | `PASS` in focused run 000114 after entered-control filtering |
| `TC-AR-U04` | Live validation clears unrelated Step 7 uploads | `FAIL` in focused run 000150; files `input_3_128` and `input_3_42` were cleared |
| `TC-AR-R03` | Live validation clears unrelated Step 5 uploads | `FAIL` in focused run 000152; file `input_3_44` was cleared |
| `TC-AR-R02` | Reload characterization exceeded the former timeout | `PASS` in focused run 000153 after the test timeout was extended |
| `TC-AR-A01` | Radio-group keyboard matching was too strict | `PASS` in focused run 000151 after matching the reachable group by name |

The focused evidence separates corrected harness issues from live upload-state
loss. U04 and R03 require a live-form fix or an owner-approved contract change;
the tests should not be weakened to make those cases green.

## Prototype gate

- Technical inventory complete: Yes, Steps 1–8.
- Automated declarations complete for Phase 1 scope: Yes, 50 browser cases.
- Clean acceptance baseline: No.
- Business-rule overlay complete: No.
- Upload contracts complete: No.
- Prototype approved: No.

## Required next actions

1. Fix or explicitly approve the live upload-state behavior exposed by U04 and
   R03, then rerun those cases.
2. Obtain owner approval for requiredness, upload contracts, document sources,
   review mappings, and persistence rules; populate the field/rule ledger.
3. Re-run the full suite after corrections and require two consecutive clean
   serial baselines before considering worker parallelism.
