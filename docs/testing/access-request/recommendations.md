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

## Current execution note — 2026-09-08

Current evidence run: `test-The-CRM-Carpenters-000154-20260908T061810213Z`

Focused evidence run: `test-The-CRM-Carpenters-000134-20260905T141421125Z`

The baseline is synchronized and reproducible, but no recommendation is
approved yet. The refined harness now records intentional blockers without
turning them into unexpected Playwright failures. U04 and R03 still require
product-owner triage for collateral upload loss after server-side validation.
The A01 helper correction and R02 timeout refinement are validated. The
field/rule ledger contains 264 technical-inventory-only rows awaiting owner
decisions; recommendations must preserve required data, ownership, and the Step
8 no-submit boundary.

## R-AR-001 — Define the person-reuse contract before prototyping reuse UI

- Status: Candidate
- Source findings: `F-AR-001`
- Source test cases: `TC-AR-P01`–`P05`
- Priority: P2
- Impact: Medium
- Evidence confidence: High
- Effort: Medium
- Owner: Product + operations/data

### Problem

Step 3 supports manual synthetic person entry but exposes no externally
identifiable returning-person source or approved role-reuse contract. Affected
users are requestors entering the same person repeatedly across contact roles.

### Proposed change

Approve a decision table for authoritative source, identity matching,
freshness, editable fields, role eligibility, and explicit no-reuse cases. Only
then prototype a clearly labelled returning-person action.

### Preserve

Keep manual entry and editing available, preserve unrelated values, and never
replace entered values without an explicit action and visible result.

### Dependencies and data ownership

Product owns workflow intent; operations/data owns identity and freshness;
privacy/security approves exposed lookup data; development owns implementation.

### Risks

Wrong-person selection, stale contact data, privacy leakage, and accidental
reuse across roles could create operational or safety errors.

### Success metric and target

After approval, 100% of `P01`–`P05` have deterministic expected outcomes; no
person-rule case remains blocked, and manual fallback still passes.

### Regression cases

`P01`–`P05`, `C01`–`C08`, and `E10`.

### Prototype acceptance criteria

The source is named, the chosen person is visible, reused fields are editable,
freshness is displayed or enforced, role exclusions are honored, and canceling
the action leaves existing values unchanged.

### Required approvals

Product, operations/data, privacy/security, and QA.

## R-AR-002 — Add copy controls only for approved source-target pairs

- Status: Candidate
- Source findings: `F-AR-002`
- Source test cases: `TC-AR-C01`–`C08`
- Priority: P2
- Impact: Medium
- Evidence confidence: High
- Effort: Medium
- Owner: Product/business + development

### Problem

No explicit Step 3 copy/reuse affordance is visible, so requestors repeat person,
address, and company/contact values and QA cannot validate copy correctness.

### Proposed change

After business approval, expose explicit copy actions only for named
source-target pairs, with source, target, and exclusions visible before action.

### Preserve

Preserve target editability, source isolation, unrelated values, auditability,
manual override, validation behavior, and the Step 8 no-submit boundary.

### Dependencies and data ownership

Product/business approves every pair and prohibited combination;
operations/data confirms field meaning; development implements; QA owns fixtures.

### Risks

Implicit or broad copying can overwrite intentional values, propagate stale
data, or copy a person into a forbidden role.

### Success metric and target

Every approved pair passes exact visible-value comparison and editability checks;
all forbidden pairs expose no action; unrelated-field changes remain zero.

### Regression cases

`C01`–`C08`, `P01`–`P05`, `R03`, and `E10`.

### Prototype acceptance criteria

Each action is explicitly labelled; copied fields match the approved source;
targets remain editable; source and unrelated values do not change; forbidden
pairs cannot be invoked; canceling has no side effect.

### Required approvals

Product/business, operations/data, development, and QA.

## R-AR-003 — Align cross-workflow fixtures before measuring reuse

- Status: Candidate
- Source findings: `F-AR-003`
- Source test cases: `TC-AR-X01`–`X03`
- Priority: P2
- Impact: Medium
- Evidence confidence: High
- Effort: Medium
- Owner: Product + operations/data + QA

### Problem

The Access Request and LAAN suites use different synthetic Sites and have no
approved semantic field mapping or human-effort protocol. Cross-workflow reuse
and efficiency claims would therefore be misleading.

### Proposed change

Provide one shared synthetic Site or an approved fixture mapping, identify each
authoritative LAAN-to-Access Request field, and approve a comparable manual-entry
measurement protocol.

### Preserve

Keep the workflows independently executable, avoid hidden-ID comparisons,
retain manual entry, and do not submit either workflow during evaluation.

### Dependencies and data ownership

Operations/data owns Site and field identity; product owns reuse intent; QA owns
the fixture and protocol; privacy/security reviews transferred data.

### Risks

Mismatched Sites, semantically similar labels, or incomparable sessions could
produce incorrect prefills and false effort-savings claims.

### Success metric and target

`X01` maps 100% of approved fields, `X02` confirms one approved Site identity,
and `X03` uses at least three comparable human sessions with the agreed metric.

### Regression cases

`X01`–`X03`, `S01`–`S04`, `P01`–`P05`, and `E10`.

### Prototype acceptance criteria

Fixtures are aligned, every mapped field has one named owner and direction,
prefilled values are visibly attributable and editable, excluded fields remain
untouched, and the report separates observed effort from inference.

### Required approvals

Product, operations/data, QA, and privacy/security.

## Historical execution note — 2026-08-29

No Step 5–8 product recommendation is approved from the current run. The live
suite was blocked by `AUTH-AR-01` before dependent behavior executed. Restore an
approved authenticated session, capture the real field map, and obtain
reproducible case evidence before creating recommendation entries.
