# Access Requests Test and Recommendation Plan

## 1. Purpose

This plan defines how SiteXcell will characterize the existing Access Request workflow, analyze the evidence, and convert validated findings into requirements for an improved Access Requests prototype.

The central goal is:

> Reduce repeated filing effort while preserving the accuracy, validity, completeness, and operational traceability of the Access Request.

The plan is evidence-first. The existing form is tested before interface recommendations are approved. A visual preference, a single failure, or an assumed similarity with LAAN is not sufficient to redefine a business rule.

## 2. Current baseline

The current analysis identifies:

- Live form: `https://co-siter.com.au/access-requests/`
- Provider: Gravity Forms, form `gform_3`
- Workflow: eight steps with POST-based step transitions
- Final control: `#gform_submit_button_3`, present on Step 8
- Dedicated test Site: `The CRM Carpenters Test`
- Dedicated test building: `The CRM Carpenters Test Building, Redbank, QLD, 4301`
- Current safe boundary: Step 8 review with final Submit visible but untouched;
  locator and network guards prohibit final submission
- Final submission: prohibited in all automated runs

Current execution note (2026-09-02): the complete serial 34-declaration baseline
is synchronized to `test-The-CRM-Carpenters-000088-20260902T044916697Z` and
reports 33 executed cases, 10 acceptance passes, 11 characterizations, 3
measurements, 6 failures, 5 blocked cases, and 3 NOT APPLICABLE outcomes. Zero
final submissions were attempted. The earlier 37-declaration later-step suite is
implemented, but the latest guarded run redirected the target URL to the Co-Siter
home page without rendering `#gform_3`. `AUTH-AR-01` blocked the preflight and 36
dependent declarations did not run. The 2026-08-26 4/4 core pass remains the
latest successful behavior evidence, not the current session state.

The eight observed areas are:

1. LAAN linkage, Site and owner selection, tenure, emergency/network information, and terms.
2. Site-specific documentation requirements and acknowledgement.
3. Project, carrier, access date/time, health and safety contact, and on-site contact details.
4. Contractor count, contractor identity/induction, qualifications, and training uploads.
5. Nature of work, isolation, authority documents, permits, and special access.
6. Technical installation, cabling, power, fire-rating, after-hours, high-risk, and rooftop/structure access.
7. SWMS review, safety, insurance, permit, and plan uploads.
8. Additional documents, declarations, invoice details, acknowledgements, and final submission.

## 3. Safety and data rules

Every live run MUST:

- use synthetic values and a unique run identifier;
- use `example.invalid` email addresses;
- use the dedicated test Site only;
- avoid real personal data, Client documents, and deliverable contact details;
- install a final-submit locator guard;
- install a network guard that aborts any final Step 8 submission;
- stop at the approved pre-submit boundary unless a later boundary is separately approved;
- leave “Save and Continue Later” untested unless its safety and data implications are explicitly reviewed;
- keep authentication state, traces, videos, screenshots, and captured form values local and ignored.

The test suite is a characterization tool, not a production submission client. No test may click the final Submit control or allow a final Step 8 POST to complete.

The network guard is a fail-safe, not permission to submit. The approved boundary
now permits traversal through the Step 8 review state and synthetic uploads, but
final Submit must remain untouched and the final Step 8 POST must be blocked.

## 4. Scope boundaries

### In scope

- current workflow structure and step transitions;
- required fields and validation behavior;
- conditional visibility, enabled state, and requiredness;
- Site and LAAN context;
- person and document reuse opportunities;
- upload restrictions and confirmation dependencies;
- back, next, reload, and recoverable-error behavior;
- keyboard and responsive behavior;
- manual effort and repetition measurements;
- cross-workflow context comparison with LAAN.

### Out of scope for the first baseline

- final production submission;
- production notification delivery;
- changing current Gravity Forms configuration;
- implementing the Access Requests prototype;
- claiming that a value is reusable merely because it appears in both workflows;
- replacing business approval with test automation.

## 5. Test architecture

Access Requests remain separate from LAAN tests while sharing only generic utilities.

```text
tests/access-requests/
├── configs/
│   ├── playwright.access-request.config.js
│   ├── playwright.live.config.js                 # compatibility alias
│   └── playwright.steps-1-8.config.js            # compatibility alias
├── fixtures/
│   ├── access-request-baseline.js
│   ├── synthetic-access-document.pdf
│   ├── synthetic-access-document-replacement.pdf
│   └── synthetic-access-document.txt
├── live/
│   └── access-request/
│       ├── 00-authentication-preflight.setup.js
│       ├── journeys/
│       ├── behaviors/
│       └── quality/
└── support/
    ├── access-request-path.js
    ├── accessibility.js
    ├── case-catalog.js
    ├── conditional-controls.js
    ├── consolidate-results.mjs
    ├── field-map.js
    ├── field-map-gate.js
    ├── form-helpers.js
    ├── live-case.js
    ├── required-controls.js
    ├── results.js
    ├── selectors.js
    ├── session.js
    ├── safety-guards.js
    ├── step-state.js
    ├── upload-controls.js
    ├── measurements.js
    └── journeys/access-request-journeys.js
```

Documentation is separated by evidence stage:

```text
docs/testing/access-request/
├── access-request-results.json
├── analysis.md
├── access-request.md
├── steps-5-8-field-map.json
├── steps-5-8-field-map.md
├── steps-5-8-test-implementation-plan.md
├── test-plan.md
├── test-case-matrix.md
├── findings.md
├── recommendations.md
└── test-summary.md
```

Generic browser setup, artifact handling, safe guards, and measurement primitives may be shared with LAAN after review. Access Request selectors, fixtures, expectations, and business assertions remain independent.

Implemented initial slice:

- core Playwright configuration and authenticated-session runner;
- `TC-AR-001`, `TC-AR-002`, `TC-AR-003`, and `TC-AR-004`;
- synthetic baseline traversal through the Step 4 required-upload boundary;
- Step 8 locator and network submission guards;
- deterministic synthetic run identifiers;
- local unit coverage for the guard and identifier contract.

Implemented Steps 5–8 slice:

- a dedicated guarded Playwright configuration with 34 browser case declarations
  plus the authentication preflight;
- deterministic shared traversal and synthetic fixture helpers;
- conditional, navigation, recovery, upload, document, efficiency,
  accessibility, responsive, and Step 8 pre-submit coverage;
- authenticated field-map capture with an explicit no-guess gate;
- a versioned consolidated result contract with blocker, finding,
  recommendation, and safety records;
- sanitization and committed machine-readable results; and
- unit coverage for result aggregation, sanitization, catalog integrity,
  field-map rendering, and synthetic values.

The current authenticated Steps 1–8 field map is captured in
`steps-1-8-field-map.json`; its technical controls remain separate from the
owner-reviewed field/rule ledger and do not imply approved business rules.

## 6. Test waves

### Wave 1 — Core workflow

- `TC-AR-001` — Open Access Request.
- `TC-AR-002` — Complete required fields and visible contractor details through the Step 4 upload boundary.
- `TC-AR-003` — Validate conditional sections. The initial automated slice
  covers Site-derived building context; full branch coverage remains partial.
- `TC-AR-004` — Validate required-field behavior.
- `TC-AR-005` — Preserve entered values while navigating.
- `TC-AR-006` — Reach a valid pre-submit state without submitting.

`TC-AR-005` and `TC-AR-006` are implemented. Their latest execution is blocked
because the approved authenticated form is unavailable, not because Step 8 is
outside the approved boundary.

### Wave 2 — Conditional logic and validation

Cover every branch that changes field visibility, enabled state, requiredness, uploads, confirmations, or step progression. Prioritize tenure, emergency/network conditions, access type, contractor count, high-risk work, rooftop/structure access, and documentation requirements.

### Wave 3 — Recovery and documents

- back/next transitions;
- browser reload and state preservation;
- validation correction and repeated navigation;
- valid upload;
- invalid type;
- oversized file;
- missing required file;
- replacement;
- removal;
- confirmation invalidation after replacement or removal.

### Wave 4 — Accessibility and responsive behavior

- keyboard-only completion of the tested path;
- labels, accessible names, focus order, and focus recovery;
- readable validation and conditional messages;
- desktop and mobile layouts;
- no horizontal overflow;
- zoom and reduced-motion checks where applicable.

### Wave 5 — Efficiency and cross-workflow analysis

- `TC-AR-P*` — person reuse;
- `TC-AR-D*` — document reuse;
- `TC-AR-S*` — Site search;
- `TC-AR-E*` — effort and repetition measurements;
- `TC-AR-X*` — LAAN and Access Request context comparison.

## 7. Selector and fixture strategy

Selectors MUST prefer, in order:

1. accessible role and name;
2. associated label and form control;
3. stable field identifiers;
4. controlled Gravity Forms identifiers;
5. CSS classes or DOM position only as a documented last resort.

Every selector fallback must explain why a more stable selector is unavailable.

Fixtures MUST be synthetic, minimal, and purpose-specific. File fixtures must be small and clearly named. No production documents, screenshots, contact details, storage state, or Client records may be committed.

Each run identifier follows the existing pattern:

```text
test-The-CRM-Carpenters-000001-<UTC timestamp>
```

The identifier may be used in synthetic project references, test names, and non-deliverable email addresses.

## 8. Execution protocol

Before a run:

1. Confirm authentication state is valid and belongs to the approved test account.
2. Confirm the target URL and test Site.
3. Confirm final-submit locator and network guards are active.
4. Confirm generated data contains no personal or operational values.
5. Record browser, viewport, commit, configuration, and test wave.

If the target redirects away from `/access-requests/` or `#gform_3` is absent,
classify the authentication/authorization prerequisite as `BLOCKED` and stop
dependent cases. Do not repeat the same failed prerequisite for every case or
classify a skipped dependent case as passed.

Playwright represents that prerequisite as a failed setup dependency so the
process exits non-zero and dependent projects do not run. The attached case
record and the Markdown summary remain authoritative for the domain status
`BLOCKED`; the infrastructure failure must not be reported as a product `FAIL`.

During a run:

1. Start from a clean known form state.
2. Record step transitions and conditional state changes.
3. Capture evidence only when it supports a result or finding.
4. Stop at the wave’s approved boundary.
5. Record the first failure before any diagnostic retry.

After a run:

1. Classify every case as `PASS`, `FAIL`, `BLOCKED`, `NOT APPLICABLE`, or `INCONCLUSIVE`.
2. Link results to evidence and canonical findings.
3. Sanitize any evidence intended for Git.
4. Record environment and known limitations.
5. Never classify a skipped or unstable test as a pass.

Deterministic tests run once per clean session. Retries are diagnostic only and must retain the first failure and retry outcome.

Efficiency comparisons require at least three comparable human sessions (or an
explicitly approved equivalent protocol). Automated browser duration is
supporting regression evidence and cannot by itself substantiate a 20–30% human
completion-time improvement.

## 9. Result model

Every result must capture:

| Field | Requirement |
| --- | --- |
| Case ID | Stable ID such as `TC-AR-004` |
| Suite/wave | Core, conditional, recovery, accessibility, efficiency, or cross-workflow |
| Status | `PASS`, `FAIL`, `BLOCKED`, `NOT APPLICABLE`, or `INCONCLUSIVE` |
| Duration | Recorded when start/end events are reliable |
| Environment | Browser, viewport, URL, commit, and configuration |
| Expected | Behavior from the live form, analysis, or approved rule |
| Observed | What actually occurred |
| Evidence | Local artifact or sanitized committed reference |
| Finding IDs | Canonical findings affected by the result |
| Recommendation IDs | Recommendations supported by the result |

## 10. Finding analysis

Repeated observations of the same root issue must be consolidated into one canonical finding while retaining all affected case IDs.

Each finding must include:

- finding ID;
- title and affected step/field;
- reproduction steps;
- expected result;
- observed result;
- evidence reference;
- user, business, accessibility, correctness, or compliance impact;
- severity: `Blocker`, `High`, `Medium`, or `Low`;
- confidence: `High`, `Medium`, or `Low`;
- likely root cause;
- affected branches and related cases;
- whether the issue is a defect, friction, duplication, ambiguity, or open business decision.

Severity describes impact. Confidence describes evidence strength. They must not be conflated.

## 11. Recommendation analysis

Each recommendation must state:

- recommendation ID;
- source finding and test cases;
- problem being solved;
- proposed change;
- behavior and information that must be preserved;
- affected users and workflow steps;
- dependencies and data ownership;
- implementation risk;
- success metric and target;
- regression cases;
- prototype acceptance criteria;
- required product/business approval.

Recommendations are prioritized by:

1. correctness, safety, and compliance risk;
2. user and operational impact;
3. evidence confidence;
4. implementation effort;
5. dependency and data-source readiness.

High-impact, high-confidence, low-to-moderate effort recommendations lead the prototype backlog. A recommendation must not silently redefine a required field, conditional rule, or data owner.

## 12. Efficiency measurement model

Measure the same controlled path and dataset for before/after comparison. Report raw values and context for:

- manual field count;
- clicks and other interactions;
- steps/screens visited;
- repeated person values;
- repeated document uploads;
- Site-search interactions;
- validation corrections;
- reliable completion time;
- desktop versus mobile effort;
- keyboard interaction count and friction.

Completion time must exclude setup and authentication. Interruptions, retries, validation corrections, and blocked states must be reported separately.

## 13. Cross-workflow analysis

LAAN and Access Requests must remain distinct test scopes. Cross-workflow cases may identify possible reuse of Site, company, person, document, or request context, but reuse is recommended only when the value is:

- semantically equivalent;
- current and authoritative;
- correctly scoped to the user and Site;
- editable when it has changed;
- traceable to its source;
- safe to copy or reference;
- not silently stale.

The result of a cross-workflow test is a reuse candidate or a no-reuse decision, not automatic implementation.

The current LAAN and Access Request suites use different dedicated test Sites.
`TC-AR-X02` remains blocked until a shared synthetic Site or an approved fixture
mapping is available.

## 14. Dashboard and reporting

Dashboard integration follows stable case IDs and result shapes. Access Requests receive a separate suite namespace and navigation group.

The dashboard summary must show:

- suite and wave;
- case ID;
- status;
- duration;
- severity and confidence where a finding exists;
- evidence reference;
- finding and recommendation links;
- blocked or inconclusive explanation.
- exploratory-probe count, kept separate from approved implementation coverage.

The dashboard summarizes evidence; the committed Markdown records remain authoritative for reasoning and decisions.

## 15. Prototype gate

The Access Requests prototype may begin when:

- all core cases have a result;
- relevant conditional branches have been covered or explicitly blocked;
- validation, recovery, and upload behavior is understood;
- accessibility and responsive risks are recorded;
- the highest-priority efficiency findings have evidence;
- recommendations preserve required information and business ownership;
- product/business approval exists for changed rules;
- open gaps are visible in the summary.

An exploratory idea may be prototyped earlier only when clearly labeled as unvalidated exploration and not presented as an evidence-based requirement.

## 16. Ownership and change control

- Test author: owns cases, fixtures, execution records, measurements, and evidence links.
- Developer: owns test implementation, shared utilities, compatibility, and testability fixes.
- Product/business owner: approves changed workflow requirements, requiredness, conditional logic, and data reuse.
- QA/reviewer: verifies reproducibility, safety, status classification, and evidence quality.
- Security/privacy reviewer: participates when authentication, personal data, uploads, or protected records are involved.

Any change to the workflow, test boundary, fixture policy, result model, or recommendation criteria requires an update to this plan in the same change set.

## 17. Definition of done

The testing program is complete when:

- the planned baseline and relevant branches have results;
- no unclassified coverage remains;
- findings are deduplicated and evidence-backed;
- recommendations have measurable success criteria;
- business decisions and unresolved questions are recorded;
- the dashboard and Markdown records agree;
- the prototype gate is explicitly met or blocked;
- raw artifacts remain local and sanitized evidence is committed;
- the final summary states what is known, unknown, and approved.
