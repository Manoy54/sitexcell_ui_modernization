# Access Requests Test Summary

Status: Unified Steps 1–8 baseline executed with truthful PASS, FAIL, BLOCKED, and NOT APPLICABLE classifications.

## Current implementation

- Approved matrix: 64 cases.
- Classified: 64/64 (100%).
- Browser declarations: 34.
- Derived results: 9.
- Decision blockers: 5.
- Remaining planning-only cases: 16.
- Implemented/declared/derived-or-decision coverage: 48/64 (75%).
- Technical field inventory: 392 captured controls grouped into 264 field/rule rows across Steps 1–8.
- Field/rule evidence-backed rows: 0; all rows are explicitly `technical-inventory-only` pending owner approval.
- Final-submit attempts: 0.
- Unit coverage: 40 tests pass.

## Latest live run

Current evidence run: `test-The-CRM-Carpenters-000107-20260904T084003226Z`

- Run ID: `test-The-CRM-Carpenters-000107-20260904T084003226Z`.
- Date: 2026-09-04.
- Scope: Complete serial 34-case Steps 1–8 browser declaration set.
- Target: `https://co-siter.com.au/access-requests/`.
- Result: `FAIL` because five assertions failed after prerequisites passed; five additional cases were blocked by explicit contracts or decisions.
- Executable declarations: 34.
- Executed browser cases: 34.
- Acceptance passes: 5.
- Characterizations: 23.
- Measurements: 3.
- Product/behavior failures: 5.
- Execution/decision blockers: 5.
- NOT APPLICABLE outcomes: 1.
- Final submission attempts: 0; Step 8 remained the maximum boundary.

The run proves the harness, authentication, field-map freshness, serial gating,
and final-submit guard. It does not establish backend acceptance or a clean
product baseline. The five failures are preserved in the consolidated result
for triage; blockers are not converted to failures or passes.

## Evidence and reporting

- Sanitized committed report: [`access-request-results.json`](./access-request-results.json).
- Full Steps 1–8 field map: [`steps-1-8-field-map.json`](./steps-1-8-field-map.json) and [`steps-1-8-field-map.md`](./steps-1-8-field-map.md).
- Field/rule ledger: [`field-rule-ledger.json`](./field-rule-ledger.json) and [`field-rule-ledger.md`](./field-rule-ledger.md).
- Governing specification: [`test-refinement-spec.md`](./test-refinement-spec.md).
- Coverage ledger: [`coverage-ledger.md`](./coverage-ledger.md).

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
