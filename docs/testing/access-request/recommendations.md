# Access Requests Recommendations Register

Recommendations become prototype requirements only after evidence and business approval are recorded.

## Recommendation template

```markdown
## R-AR-XXX — Short title

- Status: Candidate | Proposed | Approved | Rejected | Deferred
- Source findings:
- Source test cases:
- Priority: P0 | P1 | P2 | P3
- Impact: High | Medium | Low
- Evidence confidence: High | Medium | Low
- Effort: High | Medium | Low
- Owner:

### Problem

### Proposed change

### Preserve

### Dependencies and data ownership

### Risks

### Success metric and target

### Regression cases

### Prototype acceptance criteria

### Required approvals
```

## Prioritization rules

Prioritize correctness and safety first, then user/operational impact, evidence confidence, effort, and dependency readiness. Do not approve a recommendation that silently changes a business rule or data owner.

## Current execution note — 2026-09-04

Current evidence run: `test-The-CRM-Carpenters-000107-20260904T084003226Z`

The baseline is synchronized and reproducible, but no recommendation is
approved yet. Focused reruns resolved the B05 DNS classification and the
TC-AR-005/006 test-oracle issues. U04 and R03 still require product-owner
triage for collateral upload loss after server-side validation. The field/rule
ledger contains 264 technical-inventory-only rows awaiting owner decisions;
recommendations must preserve required data, ownership, and the Step 8
no-submit boundary.

## Historical execution note — 2026-08-29

No Step 5–8 product recommendation is approved from the current run. The live
suite was blocked by `AUTH-AR-01` before dependent behavior executed. Restore an
approved authenticated session, capture the real field map, and obtain
reproducible case evidence before creating recommendation entries.
