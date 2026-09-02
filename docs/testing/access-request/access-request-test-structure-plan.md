# Access Request Test Structure Implementation Plan

Status: Implemented; integrated authenticated evidence is recorded and refreshed by the guarded runner
Scope: Access Request automated test cases and supporting test infrastructure
Decision basis: grilling session and domain-modeling review

## 1. Objective

Reorganize the Access Request tests around the behavior being evaluated rather
than the historical implementation split between Steps 1–4 and Steps 5–8.
The result must keep the complete workflow in one formal suite, preserve every
case ID and historical result, and make the full Step 1→Step 8 journey easy to
find without forcing every test to navigate through every step.

This implementation changes organization and test infrastructure boundaries only.
Assertions, safety controls, case IDs, and blocked-case handling remain intact.
Prototype UI work remains outside this scope.

## 2. Decisions from the grilling session

1. The stable **test case** is the primary unit. It has one case ID, one
   behavior under evaluation, and one evidence record.
2. A **step** is a workflow stage and a coverage attribute, not the primary
   directory boundary.
3. A **journey** is reusable navigation/setup through the workflow. It prepares
   state for a test and does not replace the test's assertions.
4. A **capability** is the behavior family being evaluated, such as documents,
   recovery, or accessibility.
5. The live suite is one unified Access Request suite. Focused runs are filters
   over that suite, not separate step-range suites.
6. One test declaration represents one case ID. Related cases may share a file.
7. A case may use a controlled later-step entry point when that is the correct
   isolation boundary. At least one protected journey must still cover Step 1
   continuously through Step 8.
8. Authentication, field-map, safety, staging, document, copy, and draft
   prerequisites remain explicit blockers. A blocked case is not a pass.
9. Existing case IDs, result schema, safety behavior, and command compatibility
   are preserved during migration.
10. The 34 currently implemented browser cases are migrated first. The complete
    catalog of 64 cases remains the coverage source of truth; unimplemented
    cases remain catalog-only until their behavior and prerequisites exist.

The legacy `test:access:capture:steps-5-8` command is retained as a compatibility
alias, but intentionally writes the authoritative Steps 1–8 field-map outputs;
use `test:access:capture:steps-1-8` for the unambiguous command name.

## 3. Target directory structure

```text
tests/access-requests/
├─ configs/
│  ├─ playwright.access-request.config.js
│  ├─ playwright.live.config.js                 # compatibility alias
│  └─ playwright.steps-1-8.config.js            # compatibility alias
├─ fixtures/
│  ├─ access-request-baseline.js
│  └─ synthetic-access-document*.pdf
├─ live/
│  └─ access-request/
│     ├─ 00-authentication-preflight.setup.js
│     ├─ journeys/
│     │  ├─ complete-review-path.spec.js
│     │  └─ navigation-persistence.spec.js
│     ├─ behaviors/
│     │  ├─ entry-validation-and-context.spec.js
│     │  ├─ conditional-branches.spec.js
│     │  ├─ documents-and-uploads.spec.js
│     │  ├─ navigation-and-recovery.spec.js
│     └─ quality/
│        ├─ accessibility-and-responsive.spec.js
│        └─ efficiency.spec.js
├─ support/
│  ├─ journeys/
│  │  └─ access-request-journeys.js
│  ├─ access-request-path.js
│  ├─ accessibility.js
│  ├─ case-catalog.js
│  ├─ conditional-controls.js
│  ├─ consolidate-results.mjs
│  ├─ field-map.js
│  ├─ field-map-gate.js
│  ├─ form-helpers.js
│  ├─ live-case.js
│  ├─ required-controls.js
│  ├─ results.js
│  ├─ selectors.js
│  ├─ session.js
│  ├─ step-state.js
│  ├─ upload-controls.js
│  ├─ measurements.js
│  └─ safety-guards.js
└─ unit/
   └─ *.test.js
```

The exact shared-helper filenames may remain unchanged where they already have
the correct responsibility. The important boundary is that reusable journeys
and controls do not become assertion-heavy test files.

## 4. Case-to-file mapping

### Journeys

| File | Cases | Purpose |
|---|---|---|
| `journeys/complete-review-path.spec.js` | `TC-AR-006` | Continuous valid Step 1→Step 8 path; stop at Step 8 review; never submit. |
| `journeys/navigation-persistence.spec.js` | `TC-AR-005` | Continuous workflow path with Back/Next state-preservation checks. |

### Behaviors

| File | Cases | Purpose |
|---|---|---|
| `00-authentication-preflight.setup.js` | `TC-AR-001` | Authenticated Access Request entry and no-submit preflight. |
| `behaviors/entry-validation-and-context.spec.js` | `TC-AR-002`–`TC-AR-004` | Step 1 validation, Site-derived context, and baseline reachability. |
| `behaviors/conditional-branches.spec.js` | `TC-AR-B03`, `TC-AR-B05`, `TC-AR-B06`, `TC-AR-B08` | Conditional controls and controlling-answer changes. |
| `behaviors/documents-and-uploads.spec.js` | `TC-AR-D04`, `TC-AR-U01`–`TC-AR-U06` | Request-specific documents, replacement/removal, and ordinary upload behavior. `TC-AR-D03` is derived from `TC-AR-U05`. |
| `behaviors/navigation-and-recovery.spec.js` | `TC-AR-R01`–`TC-AR-R03` | Back/Next, reload characterization, and recoverable validation behavior. |
| Decision register (no live spec) | `TC-AR-D01`, `TC-AR-D02`, `TC-AR-U07`, `TC-AR-E10`, `TC-AR-R04` | Cases whose execution depends on an approved product, governance, staging, or human protocol decision. |

### Quality

| File | Cases | Purpose |
|---|---|---|
| `quality/accessibility-and-responsive.spec.js` | `TC-AR-A01`–`TC-AR-A05` | Keyboard access, names/errors, phone/tablet layouts, zoom, and reduced motion. |
| `quality/efficiency.spec.js` | `TC-AR-E01`–`TC-AR-E09` | Interaction, field, transition, correction, keyboard, and recovery measurements. |

Cases with multiple concerns still have one canonical file. Secondary concerns
are represented in metadata or tags; cases are never duplicated to make them
appear in multiple folders.

## 5. Canonical case model

`case-catalog.js` remains the authoritative registry. Each implemented case
should expose or derive these fields:

```js
{
  id: 'TC-AR-006',
  capability: 'journey',
  coveredSteps: [1, 2, 3, 4, 5, 6, 7, 8],
  entryPoint: 'Step 1',
  stoppingPoint: 'Step 8 review before final Submit',
  executionMode: 'e2e',
  prerequisites: ['authenticated-session', 'captured-field-map'],
  risk: 'high'
}
```

The result record must continue to distinguish `PASS`, `FAIL`, `BLOCKED`,
`INCONCLUSIVE`, and `NOT_APPLICABLE`. A Playwright process exit caused by a
blocked prerequisite must not be converted into a false assertion failure in
the consolidated report.

## 6. Helper contracts

### Journey helpers

- `baselineThroughStep4(page)` prepares the approved synthetic baseline and
  returns fixture/evidence context. It may stop at Step 4 because it is a
  reusable preparation boundary.
- `reachStep7(page, options)` starts from the approved baseline and reaches the
  Step 7 boundary only when the required field map is available.
- `reachStep8Review(page, options)` completes the valid path through Step 8 and
  returns review evidence without clicking final Submit.

Names should describe the business workflow boundary, not implementation
details such as a particular provider field index.

### Control helpers

Control helpers own semantic field lookup, required-value completion, conditional
branch handling, uploads, state snapshots, and metrics. They must not silently
swallow missing fields or substitute a default value when the field map is
incomplete.

### Safety and gates

The final-submission guard, network guard, synthetic-data checks, authentication
preflight, and field-map gate remain centralized. Individual test files may
request a gate but may not bypass it.

## 7. Execution model

Maintain one primary full-suite command and focused capability commands. The
commands use the same configuration, storage-state rules, safety guards, and
result consolidation.

Implemented command interface:

```powershell
npm run test:access:unit
npm run test:access:live
npm run test:access:live:refresh
npm run test:access:live:journeys
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

Focused commands must not silently change the target URL, account
classification, submission boundary, or report schema. Existing command names
remain as compatibility aliases while the migration is adopted.

## 8. Migration sequence and completion

1. Add the approved terminology and structure decision to project documentation. **Complete.**
2. Create the target directory tree without deleting the current suite. **Complete.**
3. Extract or rename reusable journey helpers, preserving their contracts and
   synthetic fixture behavior. **Complete.**
4. Move and, where appropriate, merge test files according to the mapping above. **Complete.**
5. Update imports, Playwright discovery, config paths, package scripts, and
   focused-run selection. **Complete.**
6. Add capability/execution/risk metadata without changing case IDs. **Complete.**
7. Update result consolidation and dashboard inputs only where needed to retain
   the existing result schema and add the new capability metadata. **Complete.**
8. Run the full unit suite and compare the discovered case inventory against the
   34-case browser manifest plus derived/decision records. **Complete: 35 unit tests pass; Playwright lists 34 browser cases.**
9. Run a no-submission structural smoke check. **Complete: final-submit guards remain covered by unit tests.**
10. Refresh the approved session and recapture the Steps 5–8 field map before
    attempting live Steps 5–8 execution. **Pending external authentication.**
11. Run the full live suite and inspect both the raw Playwright report and the
    sanitized committed result. **Pending external authentication.**

No migration step may remove a case merely because its live prerequisite is
blocked. Blocked evidence remains visible and attributable to its blocker.

## 9. Validation gates

The migration is acceptable only when all of the following are true:

- All 34 browser case IDs are discovered exactly once; 48 cases are accounted for when derived and decision records are included.
- The 64-case catalog remains internally consistent.
- Every implemented case has non-empty step coverage.
- `TC-AR-006` is discoverable as the canonical Step 1→Step 8 journey.
- Step 4 baseline preparation is not mistaken for the end of the full suite.
- No test directly clicks final Submit or produces a final submission request.
- Unit tests pass.
- Blocked cases remain `BLOCKED`, not `PASS` or an unclassified failure.
- Full and focused commands use the same safety and result contracts.
- Results contain no credentials, cookies, authorization headers, or local-only
  paths.

## 10. Risks and mitigations

| Risk | Mitigation |
|---|---|
| A case is duplicated across capability files | Enforce one canonical case-to-file manifest in unit tests. |
| A cross-step test is forced into one step folder | Put it in `journeys/` and declare its full coverage boundary. |
| Shared helpers hide real failures | Require explicit errors for missing fields, incomplete maps, and unavailable controls. |
| A blocked test is reported as passed | Preserve blocker IDs and consolidated status classification. |
| Live tests depend on execution order | Use isolated contexts and independent fixtures per case. |
| Historical result comparisons break | Preserve case IDs, result schema, run IDs, and compatibility commands. |
| Planned cases are mistaken for implemented coverage | Keep catalog status separate from live implementation status. |

## 11. Rollback strategy

Perform the migration as one reviewable change set after the plan is approved.
If validation fails, restore the prior test-file paths, config discovery, and
package aliases from that change set while preserving any newly generated test
results as historical artifacts. Do not reset unrelated working-tree changes.

## 12. Explicit non-goals

- No prototype UI changes.
- No production Access Request changes.
- No removal of safety guards.
- No forced execution against an unauthorized or unstable live route.
- No conversion of policy blockers into passing assertions.
- No implementation of the 16 catalog-only cases without their required
  behavior, fixtures, or approvals.

## 13. Approval boundary

Implementation of this plan was approved on 2026-08-29 and is now applied. The
current synchronized baseline is run `test-The-CRM-Carpenters-000088-20260902T044916697Z`:
34 browser declarations, 48 accounted cases including derived/decision records,
16 planning-only cases, and 35 passing unit tests. Any
future structural changes require a new reviewable plan or an explicit update
to this decision record.
