# LAN / SAR-LAN Form Efficiency Plan

## Objective

Identify and recommend the best ways to make the LAN / SAR-LAN and related request forms faster and easier to complete while preserving:

- correctness and completeness;
- validation and business rules;
- data quality and traceability;
- user review and control;
- downstream consistency with related workflows.

Playwright is the measurement and verification mechanism. The primary deliverable is an evidence-backed form-optimization plan, not a test suite for its own sake.

## Current status - 2026-08-18

- The authenticated LAAN form, session workflow, synthetic fixtures, and final-submission guard are available.
- The three-test core regression passed 3/3 without final submission.
- The latest pre-consolidation Wave 2 result is 15/16; after consolidation the target is 12/13, with the remaining intentional acceptance failure proving unsafe malformed-date handling and a reproducible WordPress critical-error outcome.
- Navigation, document upload, upload recovery, activity variants, reload characterization, keyboard flow, phone, and tablet evidence have been captured.
- Findings and accepted recommendations are documented in `docs/LAN_FINDINGS_SUMMARY.md`.
- Current findings and retest priorities are documented in `docs/LAN_FINDINGS_SUMMARY.md` and `docs/LAN_VALIDATION_WAVE_2.md`.
- Access Requests, authoritative-data sources, confirmation ownership, draft retention, and human before/after effort remain separate evidence or decision gates.
- The environment's staging/production classification must be confirmed before any destructive or production-state test; all current automated coverage remains non-submitting.

## Scope

### First optimization wave

- Deep analysis of the LAN / SAR-LAN request workflow.
- Coverage of the canonical path and all meaningful variants: paths that change required fields, conditional logic, validation, data relationships, documents, or readiness to submit.
- Mapping of duplicated or reusable information in Access Request and Site Owner Approval.
- Separate LAN and Access Request test scopes with shared context mappings and reusable fixtures/utilities where appropriate.

### Out of scope for the first deliverable

- Production form implementation.
- Default automated submission.
- Full chained LAN-to-Access Request automation.
- Exhaustive combinatorial testing of every possible field combination.

## Deliverables

1. A baseline measurement of the current form experience.
2. A LAN field and variant matrix.
3. A separate LAN Playwright test suite and command.
4. Evidence-backed efficiency and usability findings.
5. A prioritized improvement plan describing the proposed better experience.
6. Before/after metrics, quality guardrails, implementation approach, and retest criteria.
7. An explicit exclusions, assumptions, and limitations section.

## Operating principles

- Reduce the number of decisions, entries, corrections, and waits required to file a correct request.
- Prepopulate only from authoritative, current, reviewable data.
- Keep reused or prepopulated values visible and editable where business rules allow.
- Hide irrelevant fields through safe conditional display; never hide a field that is still required.
- Preserve valid input after navigation, validation, save, or recoverable errors.
- Do not silently resolve conflicts between Site, company, person, and request records.
- Do not recommend removing required business information merely to save time.
- Treat automated timing as comparative evidence, not as a direct measurement of human behavior.

## Test safety

- Use a staging or sandbox environment only.
- Obtain the authenticated LAN URL through configuration, not scattered hardcoded values.
- Reuse the existing Edge CDP or storage-state session approach.
- Use synthetic or sanitized fixtures only.
- Never click the final submit control in the default suite.
- Intercept or block destructive submission requests where feasible.
- Keep any controlled submission test separate, explicitly tagged, and staging-only.

## Test coverage

### Functional coverage

- Open the LAN / SAR-LAN request.
- Complete the primary valid request.
- Verify required-field behavior.
- Verify conditional sections and changing conditions after data entry.
- Navigate backward and forward without losing values.
- Exercise invalid formats and recoverable validation errors.
- Verify server-error recovery where safely mockable.
- Reach a valid ready-to-submit state.
- Verify review values match entered values.
- Verify the submit control is enabled but not activated.

### Efficiency coverage

- Manual field count.
- Clicks and equivalent interactions.
- Navigation transitions and meaningful screens.
- Completion time.
- Lookup and search effort.
- Repeated values and duplicate entry.
- Validation corrections.
- Backtracking and scrolling.
- Data preserved after errors.
- Keyboard-flow friction.

### Device coverage

- Desktop Edge/Chromium: full functional and efficiency matrix.
- Representative phone viewport, such as 390x844: critical path, validation, navigation, upload, and pre-submit checks.
- Representative tablet viewport, such as 768x1024: the same critical-path checks.

## Field matrix

Create a matrix containing at least:

| Field | Selector / identifier | Type | Required? | Conditional rule | Authoritative source | Validation | Reuse candidate | Test coverage |
|---|---|---|---|---|---|---|---|---|

For each field, determine:

1. whether the system already knows the value;
2. whether it exists on the selected Site, account, company, or person record;
3. whether it is repeated elsewhere;
4. whether it is needed by Access Request or Site Owner Approval;
5. whether it can be safely derived, defaulted, or prepopulated;
6. whether it must remain editable or independently confirmed;
7. whether it should be conditionally displayed;
8. whether manual entry creates consistency or rework risk.

If written rules and live behavior disagree, record the discrepancy rather than assuming either one is correct.

## Variant matrix

Prioritize variants by frequency, business risk, conditional complexity, user impact, and error potential.

Mandatory first-pass variants include:

- the common valid request;
- every request type that changes required fields;
- every conditional branch that changes the request data;
- alternate requester or contact relationships;
- document-required and document-not-required paths;
- missing and invalid required values;
- conditional changes after values have been entered;
- recoverable validation or server errors;
- navigation, reload, and data-preservation paths where safe.

Use P0 for core and high-risk paths. Use P1 for lower-frequency paths if time permits. Document every exclusion.

## Baseline metrics

Measure the same logical workflow before and after any proposed improvement.

| Metric | Definition |
|---|---|
| Manual fields | Fields actively typed, selected, uploaded, or confirmed by the user |
| Auto-populated fields | Values supplied from an authoritative source |
| Repeated fields | Values manually entered more than once |
| Interactions | User-equivalent clicks, selections, typing actions, and uploads |
| Completion time | First meaningful form interaction to valid ready-to-submit state |
| Navigation | Transitions between meaningful form steps or sections |
| Validation corrections | Corrections required after validation feedback |
| Lookup effort | Search, selection, and disambiguation work |
| Backtracking | Returning to earlier sections to correct or retrieve information |
| Preservation | Valid data retained after navigation or recoverable errors |

Use the median of at least three comparable runs where practical. Keep application/network wait time separate from user-equivalent work. Do not silently remove outliers.

## Improvement areas to evaluate

Evaluate each against observed evidence rather than assuming it is appropriate:

- prepopulation from Site, company, person, or request records;
- searchable selectors with disambiguating metadata;
- safe defaults;
- conditional fields and progressive disclosure;
- fewer unnecessary screens;
- clearer grouping around user decisions and dependencies;
- one-click same-information reuse;
- inline and section-level validation;
- preservation after errors or interrupted saves;
- draft or autosave behavior where safe;
- keyboard accessibility;
- phone and tablet layout and upload behavior;
- safe reuse of LAN context in related workflows.

## Reuse and prepopulation guardrails

Recommended sources of authority:

- Site record for site, location, address, and site relationships;
- account/company record for company information;
- person/contact record for identity information;
- current LAN request for request-specific values.

When records conflict:

- do not silently choose a value;
- show or record the conflict;
- require an explicit choice or documented precedence rule;
- preserve traceability to the source.

For one-click reuse:

- copy only legitimately identical entities or addresses;
- show the copied values for review;
- keep targets editable where allowed;
- do not overwrite unrelated fields;
- make the action and result clear to the user;
- verify that changing the target does not change the source unexpectedly.

## Recommendation format

Every meaningful finding should contain:

- current behavior;
- friction category;
- observed evidence and metric;
- why it matters;
- proposed improved experience;
- expected benefit;
- source and business-rule considerations;
- quality guardrail;
- priority;
- implementation approach;
- retest criteria.

Prioritize recommendations using:

- user effort saved;
- workflow frequency;
- error reduction;
- implementation complexity;
- business risk;
- data-quality impact.

High business or data-quality risk can veto an otherwise attractive speed improvement.

## Recommended improvement sequence

1. Remove redundant entry and genuinely unnecessary decisions.
2. Establish safe context selection and authoritative prepopulation.
3. Improve conditional logic and progressive disclosure.
4. Add explicit copy/reuse actions for legitimate duplicates.
5. Improve validation and error recovery.
6. Reduce unnecessary navigation and preserve drafts where safe.
7. Address keyboard, phone, tablet, and visual interaction polish.

Keep improvements incremental and independently testable. Evaluate high-impact recommendations in a controlled, non-submitting environment before production implementation.

## Success criteria

The first-pass goal is approximately:

- 20–30% lower completion time;
- 20–30% lower manual effort where the workflow permits it;
- fewer repeated entries and validation corrections;
- no loss of required information;
- no regression in validation, accuracy, traceability, or downstream consistency;
- a valid ready-to-submit state for all P0 scenarios.

These are targets for investigation, not claims to make before measurement.

## Definition of done

The plan is complete when:

- the authenticated LAN URL and safe test fixtures are available;
- the field and variant matrices are documented;
- P0 scenarios reach a valid pre-submit state;
- desktop and responsive critical paths are covered;
- baseline metrics and artifacts are captured;
- duplicate and reusable context is mapped to Access Request and Site Owner Approval;
- findings are reproducible and prioritized;
- each recommendation has a quality guardrail and retest criterion;
- limitations and excluded variants are explicit;
- the final report supports a clear implement, defer, reject, or investigate decision.

## Remaining prerequisites for production implementation

- Correct the malformed-date server failure and verify inline Stage 1 rejection.
- Confirm whether the target environment is staging/sandbox before any controlled submission or destructive test.
- Approve the activity-to-field/declaration rule matrix.
- Map authoritative Site, company, person, and current-request sources before prepopulation or one-click reuse.
- Approve draft ownership, retention, expiry, security, shared-device, and discard rules before persistent recovery is implemented.
- Measure representative Site lookup and human completion effort before claiming the 20-30% target.
- Test Access Requests separately before claiming or implementing cross-workflow reuse.
