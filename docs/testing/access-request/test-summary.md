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
- Unit coverage: 42 tests pass.

The 16 exploratory declarations do not promote the person, copy/reuse, or
cross-workflow cases to approved implementation. They record visible behavior
as characterization evidence and unavailable or unapproved behavior as
`BLOCKED`.

## Latest live run

Current evidence run: `test-The-CRM-Carpenters-000124-20260905T080659244Z`

- Run ID: `test-The-CRM-Carpenters-000124-20260905T080659244Z`.
- Date: 2026-09-05.
- Scope: Complete serial 34-case Steps 1–8 browser declaration set.
- Target: `https://co-siter.com.au/access-requests/`.
- Result: `FAIL` because U04 and R03 reproduced live upload-state loss; six browser cases were blocked and one was not applicable.
- Executable declarations: 34.
- Executed browser cases: 32.
- Acceptance passes: 7.
- Characterizations: 21.
- Measurements: 3.
- Direct product/behavior failures: 2.
- Browser blockers: 6.
- NOT APPLICABLE outcomes: 1.
- Final submission attempts: 0; Step 8 remained the maximum boundary.

The run proves the harness, authentication, field-map freshness, serial gating,
and final-submit guard. It does not establish backend acceptance or a clean
product baseline. U04 and R03 remain reproducible live failures; derived E06
and E09 inherit R03's failure without extra browser execution. Blockers are not
converted to failures or passes.

## Focused exploratory run

- Focused evidence run: `test-The-CRM-Carpenters-000131-20260905T133906210Z`.
- Scope: Authentication plus all 16 `P*`, `C*`, and `X*` exploratory probes.
- Technical runner result: 17/17 Playwright tests passed in 10.1 minutes.
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
- R03 still fails because validation clears unrelated uploads. TC-AR-005 and
  TC-AR-006 pass after their test-oracle corrections; B05 passes after the DNS
  recovery rerun. No recommendation is approved solely from automated timing.
- The field/rule ledger prevents the captured DOM from being mistaken for
  approved business coverage; every row names an owner and blocker.

### Focused triage reruns

| Case | Working classification | Required confirmation |
|---|---|---|
| `TC-AR-B05` | Transient DNS failure in baseline | `PASS` in focused run 000108 after confirming DNS/live reachability |
| `TC-AR-006` | Review text did not contain an unapproved run-ID/file-string oracle | `PASS` in focused run 000111; review values remain observational |
| `TC-AR-005` | Snapshot included conditional controls not entered by the harness | `PASS` in focused run 000114 after entered-control filtering |
| `TC-AR-U04` | Live validation clears unrelated Step 7 uploads | `FAIL` in focused run 000116; files `input_3_128` and `input_3_42` were cleared |
| `TC-AR-R03` | Live validation clears unrelated Step 5 uploads | `FAIL` in focused run 000118; files `field_3_444` and `input_3_44` were cleared |

The focused evidence separates corrected harness issues from live upload-state
loss. U04 and R03 require a live-form fix or an owner-approved contract change;
the tests should not be weakened to make those cases green.

## Prototype gate

- Technical inventory complete: Yes, Steps 1–8.
- Automated declarations complete for Phase 1 scope: Yes, 34 browser cases.
- Clean acceptance baseline: No.
- Business-rule overlay complete: No.
- Upload contracts complete: No.
- Prototype approved: No.

## Required next actions

1. Fix or explicitly approve the live upload-state behavior exposed by U04 and
   R03, then rerun those two cases.
2. Obtain owner approval for requiredness, upload contracts, document sources,
   review mappings, and persistence rules; populate the field/rule ledger.
3. Re-run the full suite after corrections and require two consecutive clean
   serial baselines before considering worker parallelism.
