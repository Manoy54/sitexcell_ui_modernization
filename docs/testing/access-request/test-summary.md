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
- Unit coverage: 35 tests pass.

## Latest live run

Current evidence run: `test-The-CRM-Carpenters-000093-20260902T091212639Z`

- Run ID: `test-The-CRM-Carpenters-000088-20260902T044916697Z`.
- Date: 2026-09-02.
- Scope: Complete serial 34-case Steps 1–8 browser declaration set.
- Target: `https://co-siter.com.au/access-requests/`.
- Result: `FAIL` because six approved-oracle assertions failed after prerequisites passed; five additional cases were blocked by explicit contracts or decisions.
- Executable declarations: 34.
- Executed browser cases: 33.
- Acceptance passes: 10.
- Characterizations: 11.
- Measurements: 3.
- Product/behavior failures: 6.
- Execution/decision blockers: 5.
- NOT APPLICABLE outcomes: 3.
- Final submission attempts: 0; Step 8 remained the maximum boundary.

The run proves the harness, authentication, field-map freshness, serial gating,
and final-submit guard. It does not establish backend acceptance or a clean
product baseline. The six failures are preserved in the consolidated result for
triage; blockers are not converted to failures or passes.

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
- U03 and U04 are blocked because the live upload controls expose no accepted
  type or size contract. U05 is blocked because review confirmations are not
  associated with individual uploads. U06 is blocked because no user-facing
  removal action is identifiable. D04 is blocked because no request-specific
  document field is present in the captured branch.
- R03, TC-AR-005/006, A01/A02, and E07 retain their observed failures for
  root-cause triage. R02 timed out before producing a case attachment and is
  therefore not counted as executed. No recommendation is approved solely from
  automated timing.
- The field/rule ledger prevents the captured DOM from being mistaken for
  approved business coverage; every row names an owner and blocker.

### Failure triage before rerun

| Case | Working classification | Required confirmation |
|---|---|---|
| `TC-AR-006` | Harness setup defect fixed after run 000088 | Rerun the corrected Step 8 review assertion |
| `TC-AR-E07` | Transition-timing/harness issue suspected; idle guard added | Rerun with the guarded transition helper |
| `TC-AR-A01` | Accessibility oracle/helper scope issue suspected; save-link exclusion added | Rerun and review any remaining missing controls |
| `TC-AR-A02` | Accessible-name helper gap suspected; native button names now supported | Rerun and classify remaining unlabeled controls |
| `TC-AR-R03` | Potential product validation/state issue | Rerun with field-specific evidence before defect classification |
| `TC-AR-005` | Potential persistence issue; Step 6 values changed after Back | Rerun and compare the approved persistence oracle |

These are provisional triage labels, not approved findings. The next live wave
must preserve the first failure and determine whether the corrected harness,
the live form, or the business oracle is responsible.

## Prototype gate

- Technical inventory complete: Yes, Steps 1–8.
- Automated declarations complete for Phase 1 scope: Yes, 34 browser cases.
- Clean acceptance baseline: No.
- Business-rule overlay complete: No.
- Upload contracts complete: No.
- Prototype approved: No.

## Required next actions

1. Triage the six failed assertions against the attached evidence and decide
   whether each is a product defect or an outdated oracle.
2. Obtain owner approval for requiredness, upload contracts, document sources,
   review mappings, and persistence rules; populate the field/rule ledger.
3. Re-run the full suite after corrections and require two consecutive clean
   serial baselines before considering worker parallelism.
