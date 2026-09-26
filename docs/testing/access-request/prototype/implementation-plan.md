# Access Request prototype implementation plan

Status: Implemented as an isolated prototype on 2026-09-09; production-authority items remain deferred.  
Delivery: Isolated, interactive, synthetic Access Request prototype.  
Implementation evidence and remaining boundaries are recorded in
[implementation-report.md](./implementation-report.md). The companion mappings
remain traceability and productionisation registers; they are not pass claims.

## 1. Goal and authority

Reduce repeated filing effort while preserving the accuracy, validity,
completeness, and operational traceability of the Access Request. Demonstrate
the full eight-stage experience through review, with the existing LAAN form's
visual identity and measurable improvements to input, navigation, validation,
documents, and recovery.

The user accepted Q1–Q4, Q5–Q10, and Q11–Q16 in three planning rounds. Those
decisions authorize this prototype direction and its documented simulation
rules. They do not approve production rules, external configuration changes,
or real submission. This plan is the concrete artifact for the final planning
review before implementation begins.

### Source hierarchy

| Source | Use |
| --- | --- |
| [Access Request goals](../access-request.md) | Filing efficiency, quality, reuse questions, and definition of improvement |
| [Test plan](../test-plan.md) and [refinement specification](../test-refinement-spec.md) | Evidence, coverage, measurement, and execution boundaries |
| [Canonical full result](../access-request-results.json) | Facts from full run 000157 |
| [Findings](../findings.md) and [recommendations](../recommendations.md) | Existing F-AR-001–003 and R-AR-001–003, with their authority limitations |
| [Captured field map](../steps-1-8-field-map.json) and [field/rule ledger](../field-rule-ledger.json) | Original identities, labels, controls, constraints, and unresolved rules |
| [Selected LAAN direction](../../../../co-siter_dashboard/proposed_laan_form/docs/selected-direction.md) and [reference measurements](../../../../co-siter_dashboard/proposed_laan_form/docs/reference-analysis.md) | Application layout and visual fidelity |
| [LAAN application styles](../../../../assets/css/laan-request.css) and [application code](../../../../assets/js/laan-request.js) | Current visual/component reference; production submission logic is outside this prototype |
| [General visual standard](../../../DESIGN_INTERFACE_HANDOFF.md) | Accessibility, states, spacing discipline, and secondary guidance |
| [Upload guidance notes](../../../notes/access-request-upload-guidance.md) and annotated screenshots | Per-file validation, cancellation, removal, and error-copy treatment for qualification uploads |
| [WordPress handoff](../../../WORDPRESS_HANDOFF_READINESS.md) and [project context](../../../../CONTEXT.md) | Distinction between isolated prototype and future production implementation |

The accepted prototype decisions control this isolated study when older
documents would defer all experimentation until business approval. Every such
experiment remains an explicit prototype assumption. Production decisions in
the original registers remain unresolved. This approved plan has now been
implemented; the report linked above is the execution record.

## 2. Evidence baseline and limitations

Full run: `test-The-CRM-Carpenters-000157-20260908T093433695Z`.

| Measure | Recorded value | Interpretation |
| --- | ---: | --- |
| Catalog case IDs | 64 | Source concerns to account for |
| Browser case declarations/executions | 50 | Includes 16 observation-only exploratory declarations |
| Playwright entries | 51 | 50 case declarations, including authentication, plus one readiness setup |
| Raw Playwright result | 49 passed / 2 failed | Technical completion includes probes reporting BLOCKED |
| Executed case classifications | 27 PASS / 2 FAIL / 20 BLOCKED / 1 NOT APPLICABLE | These sum to 50 |
| Derived results | 9 | References to other evidence; not additional browser executions |
| Decision records | 5 | Unavailable production rules or prerequisites |
| Catalog planning-only rules | 16 | These same IDs have exploratory declarations; do not add them to 64 |
| Technical inventory | 264 rows / 392 controls | Inventory accounting, not approved business coverage |
| Field rows with approved evidence in ledger | 0 | All remain technical-inventory-only |
| Final submissions | 0 | Required live boundary |

The full artifact records `trackedWorktreeDirty: true`; preserve that provenance.
Focused reproductions 000159 (U04) and 000160 (R03) record the same symptoms
against commit `f8a94d4` with tracked changes absent. Run 000158 was a network
access failure before U04 executed; it is not a U04 behavior verdict.

Important limits on interpretation:

- U04 observed unrelated FileList values clear for `input_3_128` and
  `input_3_42` after rejection. R03 observed `input_3_44` clear at Step 5.
  These are reproducible preservation assertion failures. External server-side
  file retention and the provider's exact root cause were not established.
  The prototype explicitly adopts stronger visible preservation behavior.
- R03's current catalog title/step metadata says Step 7, although its scenario
  loops over Steps 5–7 and fails at Step 5. Local coverage will report actual
  stages and the point reached.
- R02 PASS means reload outcomes were captured; it does not prove persistence.
- A01 records that controls accepted focus; this is not proof of complete
  natural keyboard order or accessibility compliance.
- S01 is N/A because the live selector exposes no search widget. A searchable
  prototype is a proposed improvement with its own local acceptance criteria.
- S04's programmatic selection timing and E02's 32 Steps 5–8 interactions are
  method-specific observations, not human eight-stage completion baselines.
- B05, B08, U03, U05, U06, and D04 have missing-control, identification, or
  contract limits. A blocked matcher cannot establish that a capability never
  exists in another branch or account.

Older narrative sections of the coverage ledger and case matrix still contain
historical counts, despite newer run markers. The findings note also describes
size contracts as absent even though U04 exercised a declared size limit.
Use the named JSON run for execution facts and inspect per-field evidence for
constraints. Reconcile these narrative discrepancies in the evidence phase;
do not rewrite historical results as prototype success.

## 3. Accepted decisions

| Decision | Accepted direction |
| --- | --- |
| Q1 | Isolated `co-siter_dashboard/proposed_access_request_form/`; synthetic data; eight stages through review |
| Q2 | Preserve stage count, observed field order, labels, and declarations; improve grouping and feedback |
| Q3 | Match the existing LAAN application shell and appearance; correct accessibility issues where necessary |
| Q4 | Main observed flow plus optional demonstrations with explicit synthetic assumptions |
| Q5 | Back/completed-stage navigation, stage validation, review Edit-and-return, affected-readiness recalculation |
| Q6 | Preserve unrelated uploads/values and previous valid replacement targets; version-related confirmation review |
| Q7 | Explicit independent copies, selective mapping, overwrite confirmation, Undo, source isolation |
| Q8 | Inactive values retained temporarily, excluded from readiness/review, restored with review reminders |
| Q9 | Same-tab synthetic text/selection recovery; file reselection after reload; explicit Reset |
| Q10 | Field accounting, functional/quality checks, comparable measurements; no assumed percentage claim |
| Q11 | Every captured row receives a destination, original identity, behavior disposition, and check or deferral |
| Q12 | LAAN-style workspace for context/progress/documents/review; collapsible mobile summary |
| Q13 | Fictional Site search by name/address, canonical selection, keyboard support, dependency review |
| Q14 | Fictional person/document/copy/LAAN scenarios through a separate reviewer panel |
| Q15 | Separate local tests mapped to live IDs; preserve live baseline and blocker meanings |
| Q16 | Evidence/mapping, shell/baseline, state/validation, search/demos, validation, and handoff phases |

## 4. Scope and field accounting

[field-disposition-plan.json](./field-disposition-plan.json) accounts for every
source row and its constituent controls. Each row names a planned stage/module,
source identity, original control IDs/types, intended rendering/review
disposition, local field-check key, and remaining mapping work.

| Stage | Source controls | Source rows | Planned subject |
| ---: | ---: | ---: | --- |
| 1 | 15 | 13 | LAAN context, Owner/Site, tenure, emergency/network, terms |
| 2 | 9 | 6 | Site requirements and acknowledgement |
| 3 | 36 | 35 | Project, carrier, dates/times, contacts and people |
| 4 | 124 | 94 | Contractor count, identity, induction and qualification documents |
| 5 | 27 | 17 | Work, isolation, authority, permits and acknowledgements |
| 6 | 71 | 42 | Technical installation, power/cabling, risk and access conditions |
| 7 | 78 | 29 | SWMS, safety/insurance/permit documents and review checks |
| 8 | 32 | 28 | Additional documents, declarations, invoice details and final review |
| Total | 392 | 264 | All source rows accounted for |

This is an initial disposition plan. Before implementing each stage, resolve
widget-generated auxiliary inputs, transport controls, conditional variants,
and repeated-group templates. A hidden control is not automatically missing
user-facing content. A captured invisible user field is not automatically
irrelevant. Preserve each original identity even when several controls map to
one semantic component. User-facing navigation controls become local actions;
provider tokens, endpoints, and transport values are mapping references only.

For each field, complete the ledger with:

- semantic key, original ID and source slot, label/type, stage and section;
- exact prototype control or documented provider-only exclusion;
- captured constraints and their evidence, missing contracts and assumption ID;
- per-scenario visibility/requiredness and explicit controlling dependencies;
- active/inactive value policy, persistence, review representation;
- invalid/boundary partitions, local test IDs and current test outcome;
- linked live evidence/finding and owner for eventual business confirmation.

Reuse captured domain labels when appropriate; replace operational Site,
person, company, request, and document records with fictional fixtures. The
Step 1 Owner and Site label maps are retained for dropdown-coverage review, but
are assigned synthetic prototype IDs and carry no provider IDs, authentication
artifacts, or production authority. Preserve existing declaration wording from
its source; record unresolved copy where unavailable instead of inventing legal
wording.

## 5. LAAN visual and layout contract

Use the LAAN application as the visual reference. The application palette
currently includes red `#f5284d`, dark red `#d91c40`, header `#2c3141`, header
rule `#e23152`, canvas `#f5f7f9`, and progress blue `#278abe`. The general brand
guide has different red tokens; Q3 explicitly selected LAAN fidelity for this
prototype. Verify final contrast and adjust the affected component when needed.

- Reuse LAAN's Geist-family typography, application density, border treatment,
  restrained radii, icons, action hierarchy, header, sidebar and form canvas.
- Reference desktop geometry: 209px sidebar, 50px header, workspace rail
  `clamp(280px, 21vw, 360px)`, responsive form area, approximately 42px controls.
  Important touch targets are at least 44px. Dimensions respond to available
  space rather than forcing eight stage names into an overcrowded strip.
- Desktop: independently scrollable form column, stable workspace where it
  fits, completed/current/upcoming stage states, persistent Back/Continue area.
  Focused fields and error summaries must remain visible above sticky controls.
- Preserve the observed content sequence. Improve section headings and helper
  hierarchy without shrinking, deleting, or hiding required content to fit.
- Workspace: Site/project context, stage progress, selected-document state,
  outstanding review items, and links to relevant fields/stages. Limit it to
  actionable context instead of duplicating the entire form.
- Mobile: one-column reading order, collapsible context above the form,
  accessible navigation and no obstructive fixed rail. Long filenames, labels,
  error messages, combobox options and multi-contractor sections must wrap.
- Keep reviewer tools separate from the normal filing flow. The prototype has
  a concise visible identity; detailed assumptions and case IDs belong in the
  reviewer panel and documentation.
- Compare reference screenshots at 1361×636 and a wide desktop size, plus
  390, 768, 1024 and 1440px. Check 320px, 200% zoom, increased text spacing,
  forced colors and reduced motion. Match visual quality, not known defects.

Use a scoped snapshot of the necessary LAAN presentation patterns within the
isolated prototype, with provenance recorded. Avoid changing LAAN assets or
extracting shared production components during this delivery. Future promotion
can resolve shared ownership after the design has been evaluated.

## 6. Interaction and state contracts

### Navigation, validation and review

Maintain one explicit state model for field values, active branches, people,
documents, confirmation versions, current stage, visited stages and review
return location. Validation and review read that state consistently.

Continue validates applicable current-stage rules and focuses a linked error
summary or the first invalid field. Messages name the problem and correction.
Back and revisiting completed stages retain entries. Review Edit records the
origin and returns to review after correction; every change recomputes readiness.
Future stages cannot be marked complete by clicking a progress label.

The Stage 8 review shows active user data, people and roles, document identity
and status, and outstanding confirmations. Every value has an explicit mapping
or reason for exclusion. Unknown business decisions are visible to reviewers;
fixture readiness only means the selected prototype scenario is complete.
The final Submit label may remain for fidelity, but its action stays disabled
with a clear prototype explanation. Readiness is distinct from submission.

### Documents: U04/R03 improvements

Represent document selection, validation errors, availability and confirmation
as separate state. A browser-selected file is not labelled server-uploaded.
Local selected files remain available in memory through navigation and errors.

Apply captured size limits per field where evidenced. Missing type, size,
multiplicity, expiry or confirmation associations require a named demonstration
contract. Do not inherit a single generic rule across all documents.

- Rejection retains the previous valid file and unrelated files/values.
- Successful replacement changes file identity/version and invalidates only
  mapped dependent confirmations.
- Removal changes only the targeted document and its dependent readiness.
- Invalid, expired, unavailable or removed documents cannot satisfy readiness.
- Confirmation is linked to the reviewed content/version. Display text explains
  what changed and what must be reviewed.
- Local failure/retry demonstrations are deterministic. If file B replaces file
  A before a delayed result completes, A's result must not overwrite B.
- Simulated saved documents have fictional availability/status, clearly visible
  in their demonstration; filename metadata alone is never file availability.

The external U04/R03 assertions remain as recorded. Passing local regressions
demonstrate the proposed improvement, not repair of the external provider.

### Conditional dependencies and contractors

Use explicit scenario decision tables, never label-regex guessing as the
business oracle. Record evidenced dependencies and synthetic assumptions
separately. High-risk or unobserved branches are reviewer demonstrations until
their production rules are confirmed.

Retain inactive entries in a session stash. Exclude them from applicable
requiredness, readiness and final review. Restoring a branch restores its data
with a review reminder. Site/controller changes flag only known affected
documents and confirmations; uncertainty appears in reviewer assumptions.

Contractors have stable identities independent of array positions. Reducing a
count does not transfer one contractor's data to another. Exercise the captured
minimum, multiple, maximum bounded groups and the above-ten branch. Do not
invent an eleventh detailed group if the captured branch handles it differently.

### Copy and fictional person reuse

Define an allowlist of source-target field pairs. Initial demonstrations may
use the mapped name, contact, company and address fields. Never infer sameness
from matching names or treat job title, training, role eligibility and
declarations as transferable personal details.

Copy is an explicit independent snapshot. Show its source, affected fields,
and exclusions. Confirmation is needed for differing populated targets;
cancel makes no change. Copied fields remain editable and editable targets
do not mutate the source or fictional directory.

Undo restores only the last copy's affected values. If the user edited those
values afterwards, offer selective restoration or a clear conflict confirmation
rather than discarding newer edits. Missing/invalid source fields remain blank
or flagged; copying cannot bypass validation. Recheck a forbidden pair in state
logic as well as disabling its UI action.

### Site search and LAAN demonstrations

Build an accessible combobox over fictional Sites, searching name/address and
disambiguating similar names. Support query, no results, selected state,
keyboard arrows/Enter/Escape and visible canonical selection. Free text does
not count as a selected Site.

Optional LAAN demonstrations use an explicit fictional mapping and shared
fictional Site identity. Show source attribution, freshness and conflicts.
Existing values are not silently overwritten; forbidden/unmapped fields stay
untouched. Use a fictional LAAN summary within the demonstration rather than
connecting to the live LAAN form or requiring changes to its implementation.

### Refresh, Reset and isolation

Use versioned same-tab session storage for synthetic text, selections, branch
state and document metadata only. File bytes remain in memory. After reload,
previously selected local files are marked as needing reselection and related
confirmations/readiness are invalidated. Allow replacement with an actual newly
selected file; displaying an old filename is not restoration.

Reset clears active/inactive state, copy history, session data, files and
confirmations. Confirm Reset when it would discard entered work. Distinct
sessions have no shared mutable state; browser-tab duplication is not promised
as a production isolation boundary. Corrupt/incompatible stored data produces
a visible recovery choice and never a false ready state.

## 7. Scenario and test portfolio

[test-case-plan.json](./test-case-plan.json) maps all 64 catalog IDs exactly once
to a proposed local concern and a `PA-` check ID. It currently contains 32 main
flow concerns, 20 demonstration concerns and 12 measurement concerns. These
are dispositions, not 64 implemented tests. Parameterization and shared evidence
will determine the actual executable count.

| Family | Source concerns | Planned verification |
| --- | ---: | --- |
| Core functional | 6 | Open, field completion, Site context, validation, eight-stage navigation and review |
| Conditional branches | 8 | Mapped options, contractor counts, Site acknowledgement, stale-state treatment |
| Recovery | 4 | Navigation, refresh/reselection, validation preservation and synthetic draft scenario |
| Uploads | 7 | Missing/valid/type/size/replace/remove/failure-retry with per-field applicability |
| Person context | 5 | Manual entry/editing and fictional selection/freshness/role reuse |
| Document context | 4 | Fictional valid/expired reuse, replacement and optional request-specific evidence |
| Site search | 4 | Search, disambiguation, keyboard and measured selection effort |
| Copy/reuse | 8 | Explicit mappings, equality, editability, isolation, overwrite/Undo and forbidden pairs |
| Efficiency | 10 | Defined counts, correction/recovery cost, devices and copy comparison |
| Accessibility/responsive | 5 | Full path keyboard, semantics, phone, tablet and zoom/reflow preferences |
| Cross-workflow | 3 | Fictional mapping, Site consistency/conflicts and duplicate-entry measurement |
| Total | 64 | Every source concern has a disposition |

Representative fixtures: minimal access, standard maintenance, isolation/noisy
or after-hours, technical installation, rooftop/high-risk, and multi-contractor
document-heavy. Unknown branch rules must be named assumptions in those
fixtures. Optional person/copy/document/LAAN demonstrations supply valid,
changed, expired, conflicting and forbidden examples with deterministic dates.

Tests must assert state and user-visible outcomes at real seams. Parameterize
required-field omissions and boundaries where a field contract exists. Verify
every behavior-changing controller from reset state, use pairwise interaction
coverage where suitable, and fully exercise combinations affecting safety,
requiredness, documents, review or progression.

Keyboard tests use actual Tab/Shift+Tab, arrows, Enter and Escape. Focusing every
control programmatically alone does not meet the keyboard gate. Responsive
checks include conditional content, error summaries and long/repeated lists.
Visual inspection complements assertions; automation alone does not establish
complete accessibility compliance.

## 8. Measurements and evidence

Record fixture/version, prototype revision, browser, viewport, scope, action
counting method, duration and completion outcome. Count manual fields,
populated fields, keystrokes, selections, copy/overwrite actions, navigation,
backtracking, correction attempts, file reselection and defined scroll effort.
Setup/authentication and instrumentation overhead are separate.

Compare like-for-like data and scenario intent. Where archived live counts are
not comparable, record the missing baseline rather than manufacturing a delta.
A manual-versus-copy comparison within the prototype can measure mechanical
effort without pretending it is a live production comparison.

Set each quantitative target after its baseline is established. No universal
20–30% threshold is inherited from LAAN. Report increases and unsuccessful
tasks too; faster completion cannot compensate for missing required information.

Human completion-time claims require comparable trials: at least three
participants, five preferred, counterbalanced order, matching fixtures and
devices, assistance/error notes, and separate desktop/phone results. If
participants are unavailable, deliver automated evidence and an explicitly
pending human study without blocking the runnable prototype.

Store local results separately under the prototype. Report local passes,
failures, excluded scenarios and deferred production claims explicitly. Do not
overwrite the external report or turn its blocked cases green through simulation.

## 9. Proposed implementation structure

```text
co-siter_dashboard/proposed_access_request_form/
  index.html
  server.mjs
  src/
    app.js
    styles/access-request.css
    model/                 # state, validation, dependencies, files, copy, recovery
    components/            # LAAN-style shell, fields, search, uploads, workspace
    stages/                # eight stage modules named in the field plan
  fixtures/                # fictional records, scenarios and explicit rule assumptions
  tests/
    unit/                  # meaningful state/validation/copy/document checks
    browser/               # user journeys, recovery, quality, demonstrations
    support/               # isolated setup and measurement helpers
  docs/                    # usage, decisions, findings, measurements and handoff
```

Use vanilla ES modules and the existing Node/Playwright dependencies. Keep the
local server on loopback, with a dedicated configurable port selected after
checking availability. Package commands will cover serve, static checks, unit,
smoke and full local browser tests. Those commands are now available through
the package scripts documented in the implementation report. Human timing and
efficiency measurements remain methods, not completed results.

The prototype must not import production submission handlers, write WordPress
records, send notifications, or call live form endpoints. Local browser tests
assert that simulated filing generates no external submission traffic. No
production route, authentication refresh, plugin installation or database is
needed to run the prototype.

## 10. Delivery phases and exit criteria

| Phase | Deliverables | Exit evidence |
| --- | --- | --- |
| 1. Evidence and mapping | Resolve field widgets/aliases, define scenario dependency and copy tables, complete constraint/assumption entries, reconcile relevant stale narrative facts | All 264 rows/392 controls and 64 source IDs accounted for; exclusions explicit; no unknown rule silently made authoritative |
| 2. LAAN shell and baseline | Eight stages, captured content sequence, synthetic fixtures, workspace, normal navigation | One complete local journey through review; initial desktop/mobile visual comparison |
| 3. State and correctness | Validation, error focus, U04/R03 preservation, document lifecycle, branches/contractors, Edit-and-return, session recovery | Focused regressions pass; review matches active state; inactive data excluded; zero submitting behavior |
| 4. Efficiency and demonstrations | Site search, copy/person/document/LAAN scenarios, reviewer panel | Source isolation, cancel/overwrite/Undo, freshness/conflict/rejection and manual fallback checks pass |
| 5. Full verification | Entire local suite, visual inspection, keyboard/responsive variants, measurements | All in-scope gates pass; every deferral/failure reported; comparable measurements recorded |
| 6. Handoff | Runnable instructions, source mappings, results, screenshots, implementation boundaries, future production questions | Another developer/reviewer can run and evaluate the prototype from the written instructions |

Run static and targeted checks during development, relevant unit tests after
state changes, a short smoke journey at integration points, and the complete
local suite at the final integration gate. Run independent local tests in
parallel only with isolated fixture/session state. Reuse results for derived
metrics; preserve per-case identity without duplicate browser traversals.

Do not repeat the 52-minute external suite for presentation-only local changes.
External reruns are justified by changed live behavior or a specific unresolved
observation. Local tests are independent of the external authenticated session.

## 11. Definition of done and deferrals

- Eight stages are complete for the agreed synthetic portfolio, with all
  applicable mapped fields, meaningful validation, preservation and accurate
  review. Missing source details have an explicit disposition, never a silent
  omission or fabricated production rule.
- LAAN visual fidelity is checked at reference desktop sizes and representative
  responsive/error/empty/populated/review states.
- U04/R03 local preservation regressions pass, including rejected replacement
  preservation and unrelated file isolation. Refresh shows honest reselection.
- Required local tests, static checks and visual review are complete. Any
  unexecuted check is identified; declarations alone are not passing evidence.
- Main flow and optional demonstrations are independently usable. Reviewer
  notes distinguish observation, proposed improvement, simulation and deferral.
- Field/test mappings point to implemented locations and actual outcomes before
  their status changes from planned to implemented.
- Results, measurement method, unresolved issues, run commands and handoff are
  recorded. Human study status is reported separately.

Deferred production work: authoritative person/Site/document sources, role and
legal permissions, real upload storage and scanning, document expiry policy,
cross-user/cross-device drafts, production LAAN mappings, real submission,
notifications and operational processing. External administrators/developers
own provider changes. This prototype evaluates proposed user experience within
the accepted synthetic scope.

## 12. Final planning review

The design tree is resolved through Q1–Q16. Remaining field-level decisions are
explicit implementation work governed by captured evidence and named synthetic
assumptions; unavailable production contracts are recorded deferrals.

After the user confirms this consolidated plan reflects the shared
understanding, implementation proceeds through the six phases above. A future
scope change affecting stage structure, production integration or authoritative
business behavior requires an explicit plan update.
