# Access Request Test Refinement Specification

Status: Draft for review  
Scope: Access Request Steps 1–8, through the Step 8 pre-submit boundary  
Companion ledger: `coverage-ledger.md`

## 1. Objective

The test program exists to:

> Reduce repeated filing effort while preserving the accuracy, validity,
> completeness, and operational traceability of the Access Request.

The immediate objective is an evidence-grade characterization baseline. The
baseline must explain what the current form requires, how it behaves, where it
creates avoidable work, and which observations are approved requirements.
Regression protection follows approval; it is not inferred from repeated live
behavior.

## 2. Non-negotiable boundary

- Use synthetic, purpose-specific data and the dedicated test Site.
- Never activate final Submit or allow the final Step 8 POST to complete.
- Treat Step 8 readiness as the maximum automated success claim. Backend
  acceptance and downstream processing are not proven.
- Keep authentication state and raw evidence local. Commit only sanitized
  evidence.
- Keep Access Request and LAAN as distinct workflows. Cross-workflow reuse is a
  candidate until source, authority, scope, editability, and freshness are
  approved.

## 3. Delivery phases

### Phase 1 — Standalone baseline

1. Reconcile policy, status, and reporting contradictions.
2. Stabilize authentication and the Step 4→5 prerequisite.
3. Capture a complete authenticated Steps 1–8 technical field map.
4. Overlay owner-approved business rules without modifying captured structure.
5. Complete the field/rule ledger and representative scenario portfolio.
6. Remove duplicate browser traversals and known decision blockers from live
   execution.
7. Implement missing high-risk field, branch, validation, upload, review, and
   accessibility coverage.
8. Produce a clean, reproducible characterization baseline and deduplicated
   findings.

### Phase 2 — Reuse and cross-workflow decisions

Cover returning people, reusable documents, same-person roles, copy actions,
draft lifecycle, and LAAN context only after the relevant data, privacy, and
business owners approve the source and behavior contracts.

## 4. Coverage contract

A field is not covered merely because it appears in the DOM or receives a value
from a generic helper. Each control must have a ledger record containing:

- stable ID, step, label, and type;
- requiredness and technical constraints;
- options and behavior-changing controllers;
- authoritative data source and owner, when known;
- persistence and recovery expectations;
- Step 8 review representation;
- valid, invalid, and boundary partitions;
- mapped case IDs, oracle type, execution state, and evidence; and
- an explicit exclusion or blocker when execution is unavailable or unsafe.

Coverage is risk-based rather than a Cartesian product:

- exercise every behavior-changing option from an independent reset state;
- parameterize only proven behaviorally equivalent options while retaining
  option-level result identity;
- use pairwise combinations for interacting controllers;
- exhaustively combine branches only when the interaction affects safety,
  requiredness, uploads, progression, data validity, or review output; and
- test switching controlling answers after dependent values are populated.

## 5. Behavior oracles

| Oracle | Meaning | Result use |
| --- | --- | --- |
| Safety invariant | Approved execution and data-safety rule | Acceptance gate |
| Approved business rule | Expected behavior approved by the responsible owner | Acceptance gate |
| Live observation | Reproducible current behavior without owner approval | Characterization only |
| Measurement contract | Defined counting or timing method | Reports a value; capture alone is not a product pass |
| Missing decision | Required authority, rule, data source, or safe environment is unavailable | Decision blocker; do not execute a browser test |

Characterization becomes acceptance only after the expected behavior and owner
are recorded. A product `FAIL` requires a passed prerequisite and a violation of
an approved oracle.

## 6. Representative scenarios

The owner-reviewed portfolio should contain:

1. minimal or low-complexity access;
2. standard maintenance with ordinary contractor evidence;
3. isolation, noisy, or after-hours work;
4. technical installation involving cabling, power, or fire rules;
5. rooftop or high-risk access; and
6. a multi-contractor, document-heavy request.

Each fixture must explicitly declare controlling answers, required documents,
expected dependent fields, expected Step 8 review values, and exclusions.
Selecting the first visible option or synthesizing values from labels remains an
exploration convenience and cannot establish acceptance coverage.

## 7. Required validation contract

Every required field must be independently identifiable in data-driven evidence
that proves:

- progression is blocked when it is omitted;
- feedback identifies the correct field and explains the action needed;
- focus or the error summary leads to the field;
- unrelated valid values survive;
- correction restores progression; and
- the value is represented correctly at review when applicable.

Format and boundary partitions are required only where a captured or approved
contract exists. Unknown rules are characterized, never guessed.

## 8. Upload contract

Apply the complete applicable matrix to every required upload field:

| State | Required evidence |
| --- | --- |
| Missing | Progression blocked; associated feedback; unrelated values preserved |
| Valid | Approved synthetic file accepted and represented correctly |
| Invalid type | Extension and MIME contract enforced with specific feedback |
| Size boundary | At-limit accepted and above-limit rejected without collateral loss |
| Replace | Previous identity removed; dependent review/confirmation invalidated |
| Remove | File and dependent readiness/confirmation cleared or invalidated |
| Controlled failure | Retry succeeds and unrelated state persists, when safe controls exist |

Optional upload fields receive the relevant subset based on their own contract.
Rules from one upload control must not be assumed for another.

## 9. Accessibility and responsive contract

The representative Steps 1–8 critical path must cover keyboard reachability,
logical focus order, accessible names, error association, focus recovery,
horizontal overflow, 200% equivalent layout, and responsive operability.
Conditional branches that introduce new controls receive representative checks.
Desktop, tablet, and phone measurements use the same fixture and branch oracle.

## 10. Execution tiers

| Tier | Contents | Target |
| --- | --- | --- |
| Preflight/smoke | Authentication, form availability, safety guards, field-map freshness, Step 4→5 readiness | At most 3 minutes |
| Focused regression | Approved core, high-risk conditional, validation, persistence, upload, review, and critical accessibility rules | At most 10 minutes |
| Full characterization | Inventories, unapproved branches, recovery, optional controls, accessibility, and responsive behavior | On demand/scheduled; at most 30 minutes |
| Measurement | One instrumented automated baseline plus human evidence | Separate from release gating |
| Decision register | Unavailable authority, rules, data, or safe infrastructure | No browser execution |

Live execution remains at one worker until two consecutive clean baselines are
recorded. Parallelism requires a dedicated experiment proving isolation of
session state, nonces, uploads, and progression.

## 11. Shared prerequisites and status rules

- Authentication, form availability, field-map freshness, guard installation,
  and Step 4→5 readiness run once as prerequisites.
- A prerequisite failure is `BLOCKED` and propagates to dependants without
  executing them.
- `FAIL` means approved behavior was violated after prerequisites passed.
- Unapproved behavior is characterization or `INCONCLUSIVE`, not acceptance.
- `NOT APPLICABLE` requires evidence that the approved scenario does not exist;
  a weak matcher or selector failure is not sufficient.
- Retries are diagnostic and retain the first failure.

## 12. Duplicate-execution policy

Stable case IDs remain reportable, but compatible results may be derived from a
single captured journey:

- map `TC-AR-R01` to the stronger `TC-AR-005` navigation evidence;
- capture `TC-AR-D03` and `TC-AR-U05` during one replacement journey;
- derive `TC-AR-E05` from `TC-AR-E02` transition evidence;
- derive `TC-AR-E08` from `TC-AR-A01` keyboard evidence;
- derive `TC-AR-E09` from `TC-AR-R03`, with correction effort from `TC-AR-E06`;
- capture the phone portion of `TC-AR-E07` during `TC-AR-A03`; and
- derive compatible `TC-AR-E01`–`TC-AR-E05` measurements from one instrumented
  baseline.

Separate live execution is retained only when setup or product risk materially
differs. Derived results must reference the source run and evidence record.

## 13. Human-efficiency evidence

Automation supplies reproducible mechanical counts, not a complete user-effort
claim. Use at least three comparable participants; five representative users is
preferred. Compare the current workflow and prototype with:

- the same controlled scenario and synthetic data;
- counterbalanced order;
- setup and authentication excluded;
- completion time, interactions, corrections, backtracking, task failures, and
  assistance recorded separately;
- desktop as the primary comparison and a dedicated phone comparison where
  mobile use is realistic; and
- concise qualitative friction notes.

Set targets per recommendation after establishing its baseline. No universal
percentage is an approval rule. Every optimization must preserve required data,
safety, valid associations, task success, and review quality.

## 14. Evidence authority and freshness

| Artifact | Authority |
| --- | --- |
| `test-plan.md` | Policy, boundaries, ownership, and approval rules |
| Captured field map | Current technical structure only |
| Owner-reviewed field/rule ledger and case catalog | Intended coverage and approved oracles |
| Consolidated result JSON | Latest execution facts |
| Findings and recommendations | Approved interpretation of a named run |

Execution-dependent documentation must include the run ID, timestamp, field-map
version, matrix count, classified count, automated count, executable count,
executed count, acceptance passes, characterizations, decision blockers, and
unclassified fields/rules. Freshness validation must reject disagreement rather
than allowing stale summaries to remain authoritative.

## 15. Prototype evidence gate

Prototype requirements may be evidence-backed when:

- every field and rule is classified;
- core flows have reproducible results;
- high-risk behavior-changing branches have results;
- validation, recovery, upload, review, accessibility, and responsive risks are
  understood;
- unresolved decisions are visible with an owner and decision needed;
- high-priority efficiency findings have evidence; and
- recommendations preserve required information and ownership.

All 64 matrix cases do not need to pass. No coverage may remain silently
unclassified.

## 16. Ownership

| Responsibility | Decisions |
| --- | --- |
| Product/business owner | Requiredness, conditional behavior, role reuse, and copy permission |
| Operations/data owner | Authoritative Site, person, contractor, and document validity |
| Security/privacy reviewer | Authentication, saved data, drafts, uploads, and cross-user access |
| QA/reviewer | Coverage classification, evidence quality, and reproducibility |
| Developer | Deterministic harness behavior and testability |

A blocked decision is complete only when it records the responsible role and the
specific decision or prerequisite needed.

## 17. Refinement definition of done

This refinement is ready for implementation when:

- the companion ledger contains the authenticated Steps 1–8 inventory;
- every field/rule has an oracle or explicit owner/blocker;
- representative fixtures and decision tables are reviewed;
- duplicate-execution mappings are approved;
- tier membership and runtime budgets are accepted;
- reporting freshness rules are testable; and
- the final-submit prohibition is consistent across all documents.
