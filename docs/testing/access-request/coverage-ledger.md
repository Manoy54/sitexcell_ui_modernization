# Access Request Coverage Ledger

Status: Draft — inventory and oracle review required  
Governing specification: `test-refinement-spec.md`

## 1. Truthful current baseline

The approved matrix contains 64 cases. The current catalog contains 50 browser
declarations, 9 derived results, 5 decision blockers, and 16 planning-only cases.
Declaration, execution, and coverage are different states and must not be
reported as interchangeable. The current full run is
`test-The-CRM-Carpenters-000157-20260908T093433695Z`.

That run executed all 50 selected browser cases and recorded 2 direct failures,
20 executed blockers, 1 NOT APPLICABLE outcome, and zero final submissions.

The generated Steps 1–8 field map contains 392 controls grouped into 264
field/rule rows. It supplies technical structure only; the companion
`field-rule-ledger.md` assigns every row an owner and explicit missing-decision
blocker. No row is currently evidence-backed until business rules are approved.

## 2. Field/rule inventory readiness

| Step | Current source | Technical inventory | Business-rule overlay | Refined coverage state | Required next evidence |
| ---: | --- | --- | --- | --- | --- |
| 1 | Preflight metrics and hard-coded baseline selectors | Partial | Missing | Unclassified | Capture every field, option, constraint, Site-search state, controller, and review mapping |
| 2 | Hard-coded acknowledgement and derived building assertion | Partial | Missing | Unclassified | Capture Site-specific requirements, acknowledgement rules, dependencies, and review mapping |
| 3 | One hard-coded valid project/person fixture | Partial | Missing | Unclassified | Capture all project, date/time, company, contact, worker, person, format, and relationship rules |
| 4 | One contractor branch and qualification upload plus generic traversal | Partial | Missing | Unclassified | Capture contractor-count groups, induction branches, expiry rules, upload contracts, and review mapping |
| 5 | Generated Steps 5–8 field map and branch probes | Captured technical structure | Missing | Characterization incomplete | Approve controller decision table; reset option probes; map stale-value and review behavior |
| 6 | Generated Steps 5–8 field map and pattern-filtered probes | Captured technical structure | Missing | Characterization incomplete | Map all technical/risk controllers and interaction-sensitive combinations without label regex as the oracle |
| 7 | Generated field map and upload/recovery cases | Captured technical structure | Missing | Characterization incomplete | Record per-field upload contracts, SWMS checklist, insurance/expiry, confirmation, and review rules |
| 8 | Generated field map and limited review assertions | Captured technical structure | Missing | Characterization incomplete | Map every declaration, invoice branch, additional document, earlier-value review representation, and readiness rule |

## 3. Required field-level record

The authenticated Steps 1–8 capture must populate one row per control using this
schema. Do not populate unknown values by inference.

| Column | Required content |
| --- | --- |
| Field key | Stable form ID plus step |
| Label/type | Current technical label and control type |
| Requiredness | Default and controller-dependent states |
| Constraints | Options, min/max, length, pattern, MIME, size, multiplicity |
| Controller | Controlling field, option, and observable effect |
| Data source/owner | User, Site, person, company, document, related request, or unresolved owner |
| Persistence | Next/Back, validation, reload, recovery, and controlling-answer expectations |
| Review mapping | Step 8 label/value/document representation or explicit absence |
| Partitions | Valid, invalid, exact boundaries, and excluded inputs |
| Oracle | Safety, approved business, characterization, measurement, or decision blocker |
| Cases/evidence | Stable case IDs, run ID, evidence record, and current result |

## 4. Case-family ledger

| Cases | Count | Phase | Current declaration state | Refined execution treatment | Primary uncovered decision or work |
| --- | ---: | --- | --- | --- | --- |
| `TC-AR-001`–`006` | 6 | 1 | Declared | Retain; split prerequisite evidence from product assertions | Full field-level requiredness and complete Step 8 review oracle |
| `TC-AR-B01`, `B02`, `B04`, `B07` | 4 | 1 | Implemented | Direct live branch checks | Tenure, emergency/network, contractor count, and Site-document rules |
| `TC-AR-B03`, `B05`, `B06`, `B08` | 4 | 1 | Declared | Refactor to reset-state option probes and approved decision tables | Exact option effects and interaction oracles |
| `TC-AR-R01` | 1 | 1 | Declared | Derive from `TC-AR-005`; no separate traversal | Preserve stable recovery traceability |
| `TC-AR-R02`, `R03` | 2 | 1 | Declared | Retain focused characterization/acceptance after oracle review | Reload contract and per-field validation recovery |
| `TC-AR-R04` | 1 | 2 | Declared blocker | Move to decision register | Draft ownership, privacy, expiry, restore, and discard |
| `TC-AR-U01`–`U06` | 6 | 1 | Declared | Refactor into per-upload-field matrix | Exact MIME, extension, size, confirmation, and state-preservation rules |
| `TC-AR-U07` | 1 | 1 | Declared blocker | Move to decision register | Safe staging or upload fault injection |
| `TC-AR-P01`–`P05` | 5 | 2 | Exploratory probes declared | Run visible Step 3 entry/reuse inventory; keep authority-dependent outcomes blocked | Person identity, freshness, editability, and role reuse |
| `TC-AR-D01`, `D02` | 2 | 2 | Declared blockers | Move to decision register until document contract exists | Saved-document source and validity authority |
| `TC-AR-D03`, `D04` | 2 | 1 | Declared | Share evidence with upload journeys where setup matches | Replacement identity and request-specific document rules |
| `TC-AR-S01`–`S04` | 4 | 1 | Implemented | S01 N/A; S02–S04 direct live checks | Native select has no partial-text search widget; exact, keyboard, and effort evidence retained |
| `TC-AR-C01`–`C08` | 8 | 2 | Exploratory probes declared | Inventory explicit copy UI; do not exercise unapproved source-target behavior | Copy permission, editability, isolation, forbidden reuse, preservation |
| `TC-AR-E01`–`E05` | 5 | 1 | Declared | Derive compatible records from one instrumented baseline | Stable fixture, counting contract, and source evidence links |
| `TC-AR-E06`–`E09` | 4 | 1 | Declared | Share validation, responsive, keyboard, and preservation evidence where equivalent | Human-equivalent metric definitions and stronger assertions |
| `TC-AR-E10` | 1 | 2 | Declared blocker | Move to decision register/human protocol | Approved copy behavior and comparable participant protocol |
| `TC-AR-A01`–`A05` | 5 | 1 | Declared | Extend from Steps 5–8 to the representative Steps 1–8 path | Early-step accessibility, conditional controls, and consistent fixtures |
| `TC-AR-X01`–`X03` | 3 | 2 | Exploratory probes declared | Compare visible fields and configured synthetic Sites; keep semantic/effort conclusions blocked | Semantic equivalence, shared Site context, and cross-workflow effort |
| **Total** | **64** | — | **48 accounted for / 16 planning-only** | Declaration is not evidence | Current result: 33 executed, 10 acceptance passes, 11 characterizations, 3 measurements, 6 failures, 5 blocked, 3 N/A |

## 5. Representative scenario ledger

| Scenario | Phase | Status | Required owner decisions | Minimum branch intent |
| --- | --- | --- | --- | --- |
| Minimal access | 1 | Fixture required | Confirm minimum legitimate request | Lowest-complexity valid branch; no irrelevant dependent fields |
| Standard maintenance | 1 | Existing fixture is only a partial candidate | Confirm ordinary contractor/document requirements | Valid standard path with expected persistence and complete review |
| Isolation/noisy/after-hours | 1 | Decision table required | Confirm notice, acknowledgement, permit, and invoice rules | Each controller independently plus interaction-sensitive pairs |
| Technical installation | 1 | Fixture required | Confirm cabling, power, fire, plan, and authority rules | Install/removal/upgrade/NA partitions and dependent evidence |
| Rooftop/high-risk | 1 | Fixture required | Confirm access permit, safety, and qualification rules | Positive, negative, and stale-dependent-state transitions |
| Multi-contractor/document-heavy | 1 | Fixture required | Confirm count limits, repeated groups, induction, and document requirements | Minimum, representative multiple, and maximum supported contractor counts |
| Returning person/document reuse | 2 | Decision blocked | Approve identity, ownership, validity, and editability | Valid, changed, expired, replaced, different-role, and forbidden reuse |
| Cross-workflow reuse | 2 | Decision blocked | Approve shared sources and aligned synthetic Site | Equivalent, conflicting, stale, unowned, and no-reuse outcomes |

## 6. Duplicate-execution ledger

| Reported cases | One live evidence source | Separate result concern |
| --- | --- | --- |
| `TC-AR-005`, `R01` | Navigation-persistence journey | End-to-end navigation versus recovery classification |
| `TC-AR-D03`, `U05` | Document replacement journey | File identity versus confirmation invalidation |
| `TC-AR-E01`–`E05` | Instrumented baseline journey | Fields, interactions, repetition, documents, and screens |
| `TC-AR-A01`, `E08` | Keyboard journey | Reachability gate versus effort metric |
| `TC-AR-R03`, `E06`, `E09` | Validation-recovery journey | Preservation assertion, correction effort, and recovery measurement |
| `TC-AR-A03`, phone portion of `E07` | Phone journey | Responsive operability versus interaction comparison |

Derived results must name the source case, run ID, fixture version, branch, and
measurement method. They must not be counted as additional browser executions.

## 7. Decision register

| Decision | Affected cases | Owner | Current state | Required resolution |
| --- | --- | --- | --- | --- |
| Person reuse source and freshness | `P01`–`P05`, `C*` | Product + operations/data | Unapproved | Authoritative identity, editable fields, freshness, roles, and forbidden reuse |
| Saved-document validity | `D01`, `D02`, `E04` | Operations/data + security/privacy | Unapproved | Source, expiry, replacement, access, and traceability contract |
| Copy source-target pairs | `C01`–`C08`, `E10` | Product/business | Unapproved | Exact pairs, one-click semantics, override, isolation, and exclusions |
| Draft lifecycle | `R04` | Product + security/privacy | Unapproved | Ownership, privacy, expiry, restore, discard, and cross-user access |
| Upload fault injection | `U07` | Developer + security/privacy | Environment unavailable | Safe controlled failure and retry mechanism |
| Upload contracts | `U01`–`U06`, `D03`, `D04` | Operations/data | Partially captured | Per-field MIME, extension, size, multiplicity, and confirmation rules |
| Cross-workflow authority | `X01`–`X03` | Product + operations/data | Unapproved | Semantic mapping, aligned synthetic Site, owner, freshness, and no-reuse rules |
| Human comparison protocol | `E10` and recommendation targets | Product + QA | Defined in principle | Participants, scenarios, devices, counterbalancing, counting, and target per finding |

## 8. Status and reporting ledger

Every summary must report these values independently:

| Metric | Meaning |
| --- | --- |
| Matrix cases | All approved case IDs; currently 64 |
| Classified cases | Cases with phase, oracle, tier, owner, and intended evidence |
| Automated declarations | Browser or non-browser executable declarations |
| Exploratory probes | Executable observation-only declarations that do not promote planning or decision-gated cases |
| Executable cases | Declarations whose prerequisites are currently satisfied |
| Executed cases | Cases that actually exercised behavior in the named run |
| Acceptance passes | Approved rules that passed |
| Characterizations | Current behavior captured without acceptance approval |
| Measurements | Values produced under an approved method |
| Decision blockers | Explicit unresolved authority, rule, data, or environment |
| Untested fields/rules | Inventory items without current evidence |

`implementedCases` or `plannedCases` alone is not a coverage claim.

## 9. Entry gate for implementation

Do not begin broad test implementation until:

- the authenticated Steps 1–8 field capture exists;
- the field-level rows and representative scenarios are populated;
- high-risk rules have named owners and oracles;
- preflight and Step 4→5 readiness are deterministic in serial execution;
- duplicate-evidence mappings are accepted; and
- execution-dependent documents agree on the current run and inventory version.

Small prerequisite, inventory, and reporting-freshness work may proceed before
the full ledger is approved because it enables, rather than assumes, coverage.
