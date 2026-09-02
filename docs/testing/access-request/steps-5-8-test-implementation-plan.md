# Access Requests Steps 5–8 Test Implementation Plan

Status: Unified test implementation completed; integrated evidence run recorded on 2026-09-02<br>
Decision date: 2026-08-29<br>
Scope owner: SiteXcell Access Requests testing<br>
Implementation boundary: Automated test cases, evidence, findings, and recommendations only

## 1. Purpose

This document defines the implementation plan for automated characterization and
acceptance coverage of Access Request Steps 5–8. It records the decisions reached
during the planning grill and converts the existing test plan and case matrix into
the unified implementation.

Implementation was explicitly authorized on 2026-08-29. The authorization covers
test code, configuration, guarded field-map capture, result infrastructure, and
documentation. It does not authorize Access Requests prototype UI changes or a
final submission.

The implementation goal is:

> Safely characterize the Access Request workflow through the Step 8 review state,
> preserve reproducible evidence, and produce traceable findings and
> recommendations without creating or submitting an Access Request.

## 2. Source documents

This plan extends, but does not replace:

- [`test-plan.md`](./test-plan.md), which defines the overall testing program,
  safety policy, evidence model, and test waves;
- [`test-case-matrix.md`](./test-case-matrix.md), which owns stable case IDs and
  current execution status;
- [`analysis.md`](./analysis.md), which records the observed eight-step Gravity
  Forms workflow and final-submit boundary;
- [`access-request.md`](./access-request.md), which defines the Access Request
  domain and optimization questions;
- [`findings.md`](./findings.md), which is the human-readable findings register;
- [`recommendations.md`](./recommendations.md), which is the human-readable
  recommendations register; and
- [`test-summary.md`](./test-summary.md), which is reconciled to the latest
  executable evidence by the documentation freshness check.

If these documents conflict, the implementation must stop and reconcile the
conflict in the same change set. Test code must not silently choose a business
rule or execution boundary.

## 3. Decisions from the planning grill

The following decisions are approved for this plan:

1. The deliverable is automated test coverage, results, findings, and
   recommendations only. The Access Requests prototype UI is out of scope until
   separately requested.
2. Tests may traverse Steps 5–8 and reach the Step 8 review state.
3. Tests must never click final Submit or allow a final Step 8 POST to complete.
4. Tests use deterministic synthetic data, the approved test Site, non-deliverable
   `example.invalid` email addresses, and synthetic upload fixtures only.
5. Implementation starts with one complete baseline path, followed by focused
   branch, validation, recovery, upload, accessibility, responsive, and efficiency
   coverage.
6. Every mapped case must have an executable result or an explicit, evidence-backed
   status such as `BLOCKED`, `INCONCLUSIVE`, or `NOT APPLICABLE`.
7. A machine-readable field/branch map and a human-readable field/branch summary
   are required before Step 5–8 assertions execute against the live form; the
   implementation must fail closed while that map is unavailable.
8. Behaviorally equivalent options may share a parameterized scenario. Every
   behavior-changing option must remain separately identifiable in the evidence.
9. The full upload-state matrix applies to every required upload field and to each
   relevant optional upload field.
10. Tests record evidence and candidate finding IDs. Recommendations are produced
    by a separate analysis step and require reproducible evidence or an approved
    business decision.
11. Raw authentication state, traces, screenshots, and entered values remain local
    and ignored. Sanitized results, findings, recommendations, and field maps are
    committed.
12. Live tests run locally through the approved authenticated Microsoft Edge
    session. Unattended CI access is out of scope.
13. Save and Continue Later remains explicitly blocked until its ownership,
    privacy, expiry, restore, and discard rules are approved.
14. Implementation is delivered in reviewable waves. A wave is incomplete until
    its code, machine results, matrix statuses, findings, recommendations, and
    summary agree.

## 4. Current baseline

### Integrated evidence superseding the pre-implementation baseline

The authenticated Steps 1–8 field map and the guarded integrated run are now
available. The current matrix contains 64 approved cases: 34 browser
declarations, 9 derived evidence records, 5 decision-gated records, and 16
planning-only cases. The integrated run executed 33 browser cases plus one
readiness setup; five browser cases were direct blockers and six direct cases
failed. Step 8 review was reached where the path allowed it, and the final
Submit control and final Step 8 POST remained untouched.

The 392-control technical inventory is intentionally not treated as approved
behavior: all 264 grouped field/rule rows remain owner-review items until their
business oracle, input contract, and evidence case are approved.

The current repository contains executable live coverage for four core cases:

| Case | Current executable boundary |
| --- | --- |
| `TC-AR-001` | Authenticated Step 1 preflight |
| `TC-AR-002` | Synthetic path through Step 4, including contractor details and qualification upload |
| `TC-AR-003` | Site-derived building context during the Step 1 to Step 2 transition |
| `TC-AR-004` | Empty Step 1 validation |

The latest documented revalidation states that these four cases passed. Before
Step 5–8 implementation, that baseline must be reconciled with the stale portions
of `test-summary.md`, the dashboard, and the latest stored report artifacts.

Known gaps before implementation:

- no committed Step 5–8 field/option/branch inventory;
- no executable Step 5–8 live specifications;
- no Wave 2 Access Requests Playwright configuration;
- no consolidated Access Requests result contract separate from raw Playwright
  output;
- empty `findingIds` and `recommendationIds` in current case attachments;
- exact Step 5–8 upload types, limits, and server-side restrictions have not been
  captured;
- exact option-level selectors and behavior-changing combinations remain unknown
  until the authenticated form is inspected; and
- the current summary and matrix contain historical authentication/boundary text
  that must be reconciled with the latest approved decisions.

## 5. Scope

### 5.1 In scope

- authenticated traversal from Step 1 through the Step 8 review state;
- Step 5 work, isolation, authority, permit, and special-access branches;
- Step 6 installation, cabling, power, fire-rating, after-hours, high-risk, and
  rooftop/structure-access branches that alter behavior;
- Step 7 safety, insurance, permit, plan, and other upload requirements;
- Step 8 additional documents, declarations, invoice details, acknowledgements,
  review state, and final-submit availability;
- requiredness, visibility, enabled state, validation, and step progression;
- changing controlling answers after dependent values have been entered;
- forward/back navigation, reload characterization, validation recovery, and data
  preservation through the approved boundary;
- upload acceptance, rejection, limits, replacement, removal, retry, and related
  confirmation invalidation;
- keyboard, responsive, zoom, reduced-motion, and accessible-error checks after
  the functional baseline is stable;
- comparable effort metrics for the same approved fixture and branch;
- structured results, archived evidence, findings, recommendations, and dashboard
  integration; and
- regression protection for Steps 1–4 while Steps 5–8 are added.

### 5.2 Out of scope

- clicking final Submit;
- allowing a final Step 8 POST to complete;
- creating a production Access Request;
- production notification or email delivery;
- real personal, company, contractor, or client data;
- client documents or deliverable contact details;
- Save and Continue Later behavior;
- changing the live Gravity Forms configuration;
- implementing or modifying the Access Requests prototype UI;
- automatically treating repeated fields as approved reuse opportunities;
- automatically approving recommendations from a test failure;
- CI credentials or unattended authenticated execution; and
- performance or human-effort claims based only on automated runtime.

## 6. Safety boundary

The approved path is:

```text
Open the authenticated Access Request
    → install final-submit locator and network guards
    → populate deterministic synthetic values
    → traverse Steps 1–7
    → enter Step 8 review state
    → verify review, declarations, documents, and Submit availability
    → stop without clicking Submit
    → assert that no final submission was attempted or completed
```

Every live case must:

- install the final-submit network guard before form interaction;
- prohibit programmatic or user-equivalent clicks on the final Submit control;
- record whether a submission attempt was observed;
- fail if the safety guard cannot be installed or verified;
- use a unique synthetic run ID;
- use the approved test Site only;
- keep final-submission evidence in every case record; and
- close its page/context without saving a draft or submitting the request.

The network guard is a fail-safe, not permission to submit. A test that reaches
Step 8 but does not prove both guard states is incomplete.

## 7. Required planning artifacts

Before Step 5–8 live assertions are written, implementation must add:

### 7.1 Machine-readable field map

Planned path:

```text
docs/testing/access-request/steps-5-8-field-map.json
```

For every observed field or control, record:

- step number;
- stable field identifier;
- accessible name and visible label;
- control type;
- available options and backing values;
- default state;
- requiredness;
- visibility and enabled state;
- controlling fields and conditions;
- downstream dependent fields;
- validation behavior;
- upload restrictions where applicable;
- persistence behavior after back/next and reload;
- review-state representation on Step 8;
- whether the value is user-entered, derived, copied, or uploaded; and
- sanitized capture date, target, account classification, and commit.

### 7.2 Human-readable field and branch summary

Planned path:

```text
docs/testing/access-request/steps-5-8-field-map.md
```

This summary explains branch behavior in business-readable language and records
unknowns that automation must not guess. Raw HTML, authentication state, and
unsanitized values must not be committed.

### 7.3 Decision tables

Decision tables must identify behavior-changing combinations without generating
an unnecessary Cartesian product. Each row records:

- controlling answers;
- expected visible and required controls;
- expected upload requirements;
- expected progression behavior;
- expected Step 8 review output; and
- the stable case ID that owns the assertion.

## 8. Target test architecture

The implemented structure is:

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
│       │   ├── complete-review-path.spec.js
│       │   └── navigation-persistence.spec.js
│       ├── behaviors/
│       │   ├── entry-validation-and-context.spec.js
│       │   ├── conditional-branches.spec.js
│       │   ├── documents-and-uploads.spec.js
│       │   ├── navigation-and-recovery.spec.js
│       │   └── decision-gates.spec.js
│       └── quality/
│           ├── accessibility-and-responsive.spec.js
│           └── efficiency.spec.js
└── support/
    ├── access-request-path.js
    ├── accessibility.js
    ├── case-catalog.js
    ├── conditional-controls.js
    ├── field-map.js
    ├── field-map-gate.js
    ├── form-helpers.js
    ├── live-case.js
    ├── required-controls.js
    ├── results.js
    ├── selectors.js
    ├── session.js
    ├── step-state.js
    ├── upload-controls.js
    ├── measurements.js
    ├── safety-guards.js
    └── journeys/access-request-journeys.js
```

The source tree is organized by test intent: journeys prove end-to-end paths,
behaviors isolate capability assertions, and quality cases measure cross-cutting
interaction concerns. Step coverage is recorded in the case catalog and result
metadata rather than encoded as separate source directories.

### 8.1 Test independence

- Every focused test starts from a clean page in the approved authenticated
  context.
- Tests may share deterministic setup helpers but may not depend on mutable state
  left by another test.
- Test ordering must not be required beyond the existing authentication preflight
  dependency.
- Every run uses a unique synthetic identifier.
- Parameterized scenarios emit separate evidence records for stable case IDs.

### 8.2 Shared traversal helpers

Shared helpers may populate known-valid preceding steps and assert checkpoint
state after every transition. They must use visible user interactions and the
live form contract. They must not:

- seed hidden browser state to skip steps;
- manipulate the DOM to reveal hidden fields;
- bypass validation through direct form submission;
- reuse a partially completed form from another test; or
- hide a live-form failure behind defaults, retries, or catch-all recovery.

## 9. Baseline path through Step 8

The first executable Step 5–8 case is the valid pre-submit baseline represented
by `TC-AR-006`.

It must:

1. pass the authenticated preflight;
2. populate the approved Step 1–4 synthetic baseline;
3. complete the observed required Step 5 fields;
4. complete the observed required Step 6 fields;
5. upload the minimum valid synthetic Step 7 evidence;
6. reach Step 8;
7. populate required Step 8 details and declarations;
8. verify that entered values and required documents are represented correctly in
   the review state;
9. verify that final Submit is visible but untouched;
10. verify that no final POST occurred; and
11. emit one complete result record with checkpoint evidence for Steps 5–8.

`TC-AR-002` remains the Step 4 baseline and must not be silently expanded or
renamed. This preserves a smaller diagnostic boundary when later-step coverage
fails.

## 10. Step-specific coverage

### 10.1 Step 5 — Nature of work and authority

Primary mapped cases:

- `TC-AR-B03` — nature of work, isolation, authority, permit, and special-access
  variants;
- `TC-AR-B08` — changing a controlling answer after dependent values are entered;
- relevant `TC-AR-R*`, `TC-AR-U*`, `TC-AR-E*`, and `TC-AR-A*` cases.

Coverage must include every option that changes:

- dependent-field visibility;
- requiredness;
- authority or permit evidence;
- upload requirements;
- acknowledgement requirements;
- permitted progression; or
- Step 8 review output.

Options with identical observable behavior may be parameterized together, but
the field map must prove their equivalence. When a controlling answer changes,
tests must record whether stale values are cleared, ignored, rejected, or remain
silently eligible for submission.

### 10.2 Step 6 — Technical and risk conditions

Primary mapped cases:

- `TC-AR-B05` — after-hours and high-risk-work variants;
- `TC-AR-B06` — rooftop and structure-access variants;
- `TC-AR-B08` — controlling-answer changes;
- relevant recovery, efficiency, accessibility, and responsive cases.

Coverage uses a decision table rather than an exhaustive Cartesian product:

1. establish the all-default baseline;
2. exercise every individual behavior-changing branch;
3. add combinations only when interactions alter visibility, requiredness,
   uploads, progression, or review output; and
4. retain a stable evidence record for each matrix case and meaningful branch.

Negative and boundary coverage applies to dates, times, numbers, and text fields
only where the live map shows that they influence validation or data integrity.

### 10.3 Step 7 — Documents and upload state

Primary mapped cases:

- `TC-AR-U01` — omit a required upload;
- `TC-AR-U02` — upload an allowed synthetic file;
- `TC-AR-U03` — upload a disallowed file type;
- `TC-AR-U04` — upload at and above the observed size limit;
- `TC-AR-U05` — replace a reviewed or confirmed file;
- `TC-AR-U06` — remove a reviewed or confirmed file;
- `TC-AR-U07` — recover from a safe, controlled upload failure; and
- `TC-AR-B08` — change answers that control upload requirements.

For every required upload field, implement the complete applicable matrix:

| State | Required evidence |
| --- | --- |
| Missing | Progression is blocked with associated feedback; unrelated values persist |
| Valid | Approved synthetic file is accepted and represented correctly |
| Invalid type | File is rejected safely with specific feedback |
| Size boundary | At-limit and above-limit behavior is recorded without clearing unrelated state |
| Replace | Old file is replaced and dependent confirmation/review state is invalidated where required |
| Remove | File and dependent readiness/confirmation state are cleared or invalidated |
| Controlled failure | Retry is possible and unrelated values remain intact |

Optional upload fields receive the relevant subset, including valid, invalid,
replacement, removal, and any branch-controlled requiredness. Exact MIME types,
extensions, and size limits must come from the live field map; they must not be
guessed from another workflow.

### 10.4 Step 8 — Review and pre-submit state

Primary mapped cases:

- `TC-AR-006` — valid Step 8 pre-submit state;
- relevant `TC-AR-U*` cases;
- declaration and review cases added to the matrix after the field map is
  approved;
- relevant validation, recovery, accessibility, responsive, and efficiency
  cases.

Step 8 assertions must verify:

- required fields, documents, declarations, and acknowledgements;
- correct representation of values entered in earlier steps;
- omission of values that became irrelevant after a branch change;
- clear, associated validation when required review data is incomplete;
- preservation of unrelated valid data after correction;
- visibility and accessible name of final Submit;
- zero Submit clicks;
- zero completed final POSTs; and
- an explicit stopping point in the result record.

The test may prove that Submit is available. It may not activate it.

## 11. Cross-cutting coverage

### 11.1 Navigation and recovery

Implement relevant `TC-AR-R01`–`TC-AR-R03` coverage across Steps 5–8:

- back/next persistence;
- reload characterization at each approved step;
- correction after validation failure;
- preservation of unrelated values;
- focus recovery to actionable feedback; and
- repeated navigation without duplicate uploads or stale state.

`TC-AR-R04` Save and Continue Later remains `BLOCKED` until a separate decision
approves its data lifecycle.

### 11.2 Accessibility

After the functional and upload baselines are stable, implement:

- `TC-AR-A01` keyboard-only traversal;
- `TC-AR-A02` labels, names, instructions, error association, and focus recovery;
- `TC-AR-A03` phone viewport `390 × 844`;
- `TC-AR-A04` tablet viewport `768 × 1024`; and
- `TC-AR-A05` 200% zoom and reduced-motion behavior.

Critical controls include conditional inputs, upload interactions, document
removal/replacement, declarations, navigation actions, and the final Submit
control. The test stops before activating Submit.

### 11.3 Efficiency

Relevant `TC-AR-E*` cases record:

- manual field candidates;
- interactions and backtracking;
- steps/screens;
- validation corrections;
- repeated person/document entry;
- keyboard effort;
- data recovery effort; and
- comparable desktop/mobile friction.

Automated duration is supporting regression evidence only. Human-effort claims
require the separate protocol already defined by the main test plan.

## 12. Fixtures

### 12.1 Baseline fixture

Use one versioned deterministic fixture for the valid Steps 1–8 path. It must:

- use the approved test Site and expected building context;
- contain only synthetic people, contractors, companies, addresses, identifiers,
  and phone numbers;
- use `example.invalid` addresses;
- use future dates computed consistently at runtime where live validation requires
  them;
- reference approved synthetic documents only; and
- expose named branch overrides rather than requiring tests to duplicate the full
  fixture.

### 12.2 Branch fixtures

Branch fixtures contain only the values that differ from the baseline and must be
named by behavior, not by selector. For example, use concepts such as
`requiresIsolation`, `afterHoursHighRisk`, or `rooftopAccess` after the live field
map confirms those concepts.

### 12.3 Upload fixtures

The fixture set must provide:

- a valid file for every accepted category that materially changes behavior;
- a disallowed-type fixture;
- at-limit and above-limit fixtures generated or selected according to observed
  live limits;
- replacement files with clearly distinguishable synthetic names; and
- a controlled-failure mechanism only if it can be executed safely without
  affecting production records or other users.

Do not commit realistic client documents, authentication material, or oversized
binary files when they can be generated locally from deterministic metadata.

## 13. Selector policy

Selectors must prefer, in order:

1. accessible role and name;
2. associated label and control;
3. stable field identifier;
4. controlled Gravity Forms identifier; and
5. CSS class or DOM position only as a documented last resort.

Exact text assertions are appropriate only when wording is an approved contract.
Validation tests otherwise assert:

- the correct field is identified;
- feedback is visible and associated;
- focus reaches actionable feedback where expected;
- progression is blocked or allowed correctly; and
- unrelated values are preserved.

## 14. Results and evidence contract

### 14.1 Two-tier result model

Raw local result files:

```text
.test-artifacts/playwright/access-request-results.json
.test-artifacts/playwright/access-request-<suite>-focused-results.json
.test-artifacts/playwright/history/<run-id>.json
```

Committed sanitized result:

```text
docs/testing/access-request/access-request-results.json
```

The consolidated result is separate from raw Playwright output. Raw Playwright
reports remain execution evidence; the consolidated result is the stable
machine-readable project contract. The committed copy must be sanitized and
must not contain authentication state, raw traces, unsanitized screenshots, or
entered personal data.

### 14.2 Consolidated schema

The consolidated result uses this top-level shape:

```json
{
  "schemaVersion": 1,
  "run": {},
  "summary": {},
  "safety": {},
  "cases": [],
  "findings": [],
  "recommendations": [],
  "blockers": []
}
```

Required `run` fields:

- run ID;
- target URL;
- commit;
- configuration;
- browser;
- viewport;
- account classification;
- started and completed timestamps; and
- fixture version.

Required `summary` fields:

- planned cases;
- implemented cases;
- executed cases;
- passed, failed, blocked, inconclusive, and not-applicable counts;
- zero-submission count/confirmation; and
- wave status.

Required `safety` fields:

- approved boundary;
- final-submit locator guard installed;
- final POST guard installed;
- final Submit clicked;
- final submission attempted;
- final submission completed; and
- synthetic-data policy satisfied.

Required case fields:

- stable case ID;
- suite/wave;
- result type;
- status;
- step and branch;
- expected behavior;
- observed behavior;
- starting point and stopping point;
- duration as supporting evidence;
- first failure;
- retry outcome, if a controlled retry was part of the case;
- environment and fixture metadata;
- sanitized evidence references;
- finding IDs;
- recommendation IDs;
- blocker ID where applicable;
- final-submission guard state; and
- capture timestamp.

Parameterized tests must emit one result record for each stable case ID. Aggregate
pass counts are not a substitute for individual evidence.

### 14.3 Status definitions

| Status | Meaning |
| --- | --- |
| `PASS` | Observed behavior matches the approved expectation |
| `FAIL` | The live form was available, but an assertion or required product behavior failed |
| `BLOCKED` | Authentication, approval, boundary, fixture, or environment prerequisite prevented execution |
| `INCONCLUSIVE` | Evidence is contradictory or insufficient for classification |
| `NOT APPLICABLE` | The case is deliberately excluded with a documented reason |

`NOT RUN` is a planning state only and must not appear as a completed result.
Infrastructure and authentication failures must not be classified as product
failures. A characterization probe may pass because it captured evidence; its
observed product behavior must remain explicit and must not be presented as an
acceptance success.

## 15. Findings and recommendations workflow

The workflow is:

```text
Test result
    → reproducible observation
    → deduplicated finding
    → candidate recommendation
    → business/product review
    → approved, rejected, or deferred recommendation
    → linked regression and acceptance cases
```

Rules:

- tests do not automatically generate approved recommendations;
- a failure is not automatically a recommendation;
- findings consolidate repeated symptoms under one likely root issue;
- every finding references affected case IDs and sanitized evidence;
- every recommendation references one or more findings and affected cases;
- candidate and approved recommendations are distinct statuses;
- recommendations record preservation requirements, dependencies, risks, success
  metrics, and regression cases;
- case records link back through `findingIds` and `recommendationIds`; and
- the JSON result and Markdown registers must agree.

## 16. Planned implementation waves

### Wave 0 — Baseline reconciliation

Deliverables:

- reconcile the latest four core case results;
- correct stale summary and matrix language;
- verify the dashboard against the latest full core report;
- confirm the approved Step 8 review boundary in the source documents; and
- run unit coverage for run IDs and submission guards.

Exit gate: one authoritative 4-case baseline with no conflicting status text.

### Wave 1 — Field map and result contract

Deliverables:

- authenticated Steps 5–8 field/branch capture;
- JSON and Markdown field maps;
- decision tables;
- consolidated result schema and writer;
- sanitized result export;
- dashboard support for consolidated results; and
- unit tests for result aggregation, sanitization, and status counting.

Exit gate: the live contract is mapped and one synthetic result file validates
against the schema without exposing sensitive data.

### Wave 2 — Valid pre-submit baseline

Deliverables:

- shared Steps 1–8 traversal helper;
- baseline fixture and branch overrides;
- executable `TC-AR-006` through Step 8 review;
- Step 5–8 checkpoints;
- final-submit safety verification; and
- archived and sanitized result output.

Exit gate: the valid synthetic path reaches Step 8 review, stops safely, and
produces a complete case record.

### Wave 3 — Conditional logic and stale-state coverage

Deliverables:

- Step 5 branch cases;
- Step 6 decision-table cases;
- controlling-answer change cases;
- validation and progression assertions; and
- Step 8 review-output verification for branch values.

Exit gate: every behavior-changing Step 5–6 branch has an individual result or
explicit blocker.

### Wave 4 — Upload and recovery coverage

Deliverables:

- Step 7 required and optional upload matrices;
- missing, valid, invalid, boundary, replace, remove, and controlled-failure
  cases;
- confirmation/readiness invalidation assertions;
- back/next and reload characterization; and
- correction-after-error cases.

Exit gate: every mapped upload/recovery case has a result and no test submits a
request.

### Wave 5 — Step 8 validation and review integrity

Deliverables:

- incomplete review validation;
- declaration and acknowledgement coverage;
- earlier-step value representation;
- stale-value exclusion;
- unrelated-value preservation after correction; and
- final Submit visibility/accessibility without activation.

Exit gate: Step 8 review accurately reflects every tested path and safety remains
proven.

### Wave 6 — Accessibility, responsive, and efficiency evidence

Deliverables:

- keyboard-only critical path;
- accessible names, errors, and focus recovery;
- phone and tablet viewports;
- 200% zoom and reduced motion;
- comparable interaction and recovery measurements; and
- findings/recommendations derived only from reproducible evidence.

Exit gate: presentation and effort risks through Step 8 are recorded without
changing the live form or making unsupported human-effort claims.

### Wave 7 — Consolidation and regression

Deliverables:

- full formal Steps 1–8 run;
- current and archived reports;
- consolidated sanitized JSON;
- synchronized matrix, summary, findings, recommendations, and dashboard;
- confirmed zero-submission status; and
- explicit prototype gate status without implementing the prototype.

Exit gate: all mapped cases are classified, evidence is traceable, and no source
disagrees with the final result.

## 17. Planned commands

These command interfaces are implemented. Focused document and efficiency commands
are also available for their respective suites:

```text
npm run test:access:unit
npm run test:access:live
npm run test:access:live:journeys
npm run test:access:live:functional
npm run test:access:live:behaviors
npm run test:access:live:quality
npm run test:access:live:branches
npm run test:access:live:uploads
npm run test:access:live:recovery
npm run test:access:live:documents
npm run test:access:live:efficiency
npm run test:access:live:accessibility
npm run test:access:live:responsive
```

Focused commands must use the same result contract, safety guards, fixtures, and
history policy as the complete run. A focused run must not overwrite a complete
run and make the dashboard appear fully green with partial evidence. Current and
focused report identities must remain distinguishable.

## 18. Verification strategy

Every implementation wave requires proportionate verification:

1. syntax and unit tests for helpers, result aggregation, sanitization, run IDs,
   and safety guards;
2. an authenticated focused live run for the added behavior;
3. a core regression run for `TC-AR-001`–`TC-AR-004`;
4. a combined run after focused failures are understood;
5. schema validation of the consolidated result;
6. verification that current and archived reports contain the intended cases;
7. verification that dashboard totals match the result JSON;
8. review of every `BLOCKED`, `INCONCLUSIVE`, and `NOT APPLICABLE` explanation;
9. review that raw or sensitive evidence was not committed; and
10. explicit confirmation that final submission was neither attempted nor
    completed.

Retries must not hide product failures. A retry is allowed only for a documented,
safe transient condition and both the first failure and retry outcome must be
recorded.

## 19. Documentation synchronization

Each wave updates, as applicable:

- this implementation plan;
- `test-plan.md` when boundaries, architecture, or ownership change;
- `test-case-matrix.md` with implementation and execution status;
- `analysis.md` with newly observed live behavior;
- `findings.md` with reproducible findings;
- `recommendations.md` with evidence-backed candidates and decisions;
- `test-summary.md` with current totals and prototype-gate status;
- `access-request-results.json` with sanitized machine-readable evidence; and
- the results dashboard configuration and coverage totals.

Documentation updates belong in the same change set as the evidence that changed
them. Historical evidence must not be rewritten to look like a current run.

## 20. Risks and controls

| Risk | Control |
| --- | --- |
| Accidental production submission | Locator guard, Step 8 POST interception, explicit per-case safety assertions |
| Expired or unauthorized session | Classify as `BLOCKED`; refresh only through the approved local workflow |
| Guessed selectors or business rules | Require authenticated field map before assertions |
| Combinatorial explosion | Decision tables and behavior-equivalence grouping |
| Brittle exact-copy assertions | Assert behavior/association by default; exact text only for approved contracts |
| Hidden stale values | Dedicated controlling-answer change cases and Step 8 review verification |
| Upload side effects | Synthetic files, no submission, explicit replacement/removal cleanup behavior |
| Partial report presented as full coverage | Separate focused/full report identities and explicit configured/executed counts |
| Raw data committed | Sanitization checks and ignored local artifact paths |
| Recommendations without evidence | Finding-first workflow and explicit recommendation statuses |
| Automated runtime presented as human effort | Treat runtime as supporting evidence; require separate human protocol |
| Existing core regression | Run core cases after each functional wave |

## 21. Definition of done

The Steps 5–8 test implementation is complete only when:

- the authenticated field/branch map is committed and current;
- every behavior-changing branch is represented by a stable case or documented
  parameterized scenario;
- the valid synthetic baseline reaches Step 8 review safely;
- all mapped Step 5–8 cases have `PASS`, `FAIL`, `BLOCKED`, `INCONCLUSIVE`, or
  `NOT APPLICABLE` results;
- no completed result uses `NOT RUN`;
- upload, recovery, validation, stale-state, review, accessibility, responsive,
  and efficiency coverage is complete or explicitly blocked;
- every case includes the required evidence and safety fields;
- final Submit was never clicked and no final Step 8 POST completed;
- the consolidated local and sanitized committed result files validate against
  the agreed schema;
- findings and recommendations are evidence-linked and statused;
- raw authentication and unsanitized evidence remain local;
- core Steps 1–4 regressions pass or are explicitly classified;
- the matrix, summary, dashboard, result JSON, findings, and recommendations agree;
  and
- the prototype gate is stated explicitly without implementing the prototype.

## 22. Implementation checklist

Implementation must proceed in this order:

- [x] Receive explicit authorization to implement this plan.
- [x] Reconcile the current 4-case core baseline.
- [x] Confirm the approved authenticated session and Step 8 review boundary.
- [x] Capture the authenticated Steps 1–8 field/branch map and produce a
  sanitized technical inventory; unresolved business rules remain gated.
- [x] Approve the behavior-equivalence groups and decision tables.
- [x] Implement and unit-test the consolidated result contract.
- [x] Implement shared deterministic fixtures and traversal helpers.
- [x] Implement `TC-AR-006` through Step 8 review; execution evidence is
  recorded with its review-integrity failure.
- [x] Implement Step 5 branch and stale-state cases.
- [x] Implement Step 6 decision-table and stale-state cases.
- [x] Implement Step 7 upload and recovery cases.
- [x] Implement Step 8 validation and review-integrity cases.
- [x] Implement accessibility and responsive cases.
- [ ] Capture efficiency evidence without making unsupported usability claims.
- [ ] Run focused suites and core regression after each wave.
- [x] Run the complete consolidated suite; the result records executed,
  failed, blocked, and not-applicable cases without inflating coverage.
- [x] Produce sanitized results, findings, and recommendations.
- [x] Reconcile all documentation and dashboard totals.
- [x] Confirm zero submissions and report the final known/unknown/blocked state.

## 23. Authorization gate

The test implementation was authorized and completed. The current execution gate
is operational: an approved session must render `#gform_3` before the field map
and dependent Steps 5–8 behavior can execute.

The following remain unauthorized:

- clicking final Submit or allowing a final Step 8 POST to complete;
- creating a production Access Request;
- using real personal data or client documents;
- weakening or bypassing the authentication, field-map, or submission guards;
- guessing unresolved document ownership, validity, draft, or copy rules; and
- implementing or modifying the Access Requests prototype UI without a separate
  user instruction.
