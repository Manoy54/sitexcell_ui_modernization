# Access Requests Test Case Matrix

This matrix is the execution index for the Access Request characterization
suite. A case is complete only when it has a result or an explicit `BLOCKED`,
`NOT APPLICABLE`, or `INCONCLUSIVE` explanation.

## Result contract

| Result type | Purpose |
| --- | --- |
| Acceptance | Protects known required behavior and safety rules. |
| Characterization | Records current behavior without treating it as an approved rule. |
| Efficiency | Measures comparable user effort; automated duration is supporting evidence only. |
| Decision | Records a data-owner or business-rule question that automation must not guess. |

Live statuses are `PASS`, `FAIL`, `BLOCKED`, `NOT APPLICABLE`, or
`INCONCLUSIVE`. `NOT RUN` is planning state only and must never be counted as a
pass.

## Current execution prerequisite

On 2026-08-29 the 37-declaration Steps 5–8 run redirected the target URL to the
Co-Siter home page without rendering `#gform_3`. `TC-AR-001` recorded
`BLOCKED — AUTH-AR-01`; 36 dependent declarations did not run. The earlier
2026-08-26 authenticated run remains successful historical core evidence, but it
does not make the current session valid. The Step 8 review boundary is approved;
authentication and the resulting empty field map are the current live blockers.

## Core functional cases

| ID | Type | Scenario | Expected safe result | Automation | Current status |
| --- | --- | --- | --- | --- | --- |
| `TC-AR-001` | Acceptance | Open the authenticated Access Request. | Form and Step 1 are visible; final Submit is hidden; zero submission attempts. | Implemented | Latest `BLOCKED — AUTH-AR-01`; historical `PASS` 2026-08-26 |
| `TC-AR-002` | Characterization | Complete required fields through the approved baseline path. | Valid synthetic values reach Step 4 with field-by-field evidence and approved synthetic upload. | Implemented | Historical `PASS`; latest dependency did not run after `AUTH-AR-01` |
| `TC-AR-003` | Characterization | Validate conditional sections; the initial automated slice covers Site-derived context. | The dedicated Site resolves to its canonical building; remaining branch families are mapped by `TC-AR-B*`. | Implemented, partial | Historical `PASS`; latest dependency did not run after `AUTH-AR-01` |
| `TC-AR-004` | Acceptance | Advance from an empty Step 1. | Remain on Step 1 with field-level feedback; Submit remains unavailable. | Implemented | Historical `PASS`; latest dependency did not run after `AUTH-AR-01` |
| `TC-AR-005` | Acceptance | Navigate forward/back across approved steps. | Entered values and derived Site context remain unchanged. | Implemented | `BLOCKED — AUTH-AR-01` / field-map prerequisite |
| `TC-AR-006` | Acceptance | Reach the valid Step 8 pre-submit state. | Review state is complete and final Submit is visible but untouched. | Implemented; boundary approved | `BLOCKED — AUTH-AR-01` / field-map prerequisite |

## Conditional branch cases

| ID | Step | Branch family | Expected result | Current status |
| --- | ---: | --- | --- | --- |
| `TC-AR-B01` | 1 | Tenure confirmation variants. | Visibility, requiredness, and values match the selected tenure branch. | Planned — not implemented |
| `TC-AR-B02` | 1 | Network/emergency information variants. | Only applicable emergency/network controls participate in validation. | Planned — not implemented |
| `TC-AR-B03` | 5 | Nature of work, isolation, authority, permit, and special-access variants. | Each answer exposes the correct dependent controls without stale required values. | Implemented; `BLOCKED — AUTH-AR-01` |
| `TC-AR-B04` | 4 | Contractor-count variants. | The correct number of contractor identity, induction, and qualification groups appears. | Planned — not implemented |
| `TC-AR-B05` | 6 | After-hours and high-risk-work variants. | Required safety details change with the selected risk branch. | Implemented; `BLOCKED — AUTH-AR-01` |
| `TC-AR-B06` | 6 | Rooftop/structure-access variants. | Access-specific questions and confirmations appear only when applicable. | Implemented; `BLOCKED — AUTH-AR-01` |
| `TC-AR-B07` | 2 | Site-specific document requirements and acknowledgement. | Requirements match the selected Site and must be acknowledged before progression. | Planned — not implemented |
| `TC-AR-B08` | 1–7 | Change a controlling answer after entering dependent values. | Hidden/irrelevant values cannot remain silently submittable; still-relevant values persist. | Implemented; `BLOCKED — AUTH-AR-01` / field map |

Exact option-level branch cases must be added after the authenticated field map
is recaptured. The branch families above are not evidence that every option is
already covered.

## Recovery and upload-state cases

| ID | Type | Scenario | Expected result | Current status |
| --- | --- | --- | --- | --- |
| `TC-AR-R01` | Acceptance | Step back/next after valid entry. | Values persist without duplicate lookup or entry. | Implemented; `BLOCKED — AUTH-AR-01` |
| `TC-AR-R02` | Characterization | Reload on each approved step. | Lost/preserved values and recovery effort are recorded per step. | Implemented; `BLOCKED — AUTH-AR-01` |
| `TC-AR-R03` | Acceptance | Correct a validation error. | Unrelated valid values survive and focus returns to actionable feedback. | Implemented; `BLOCKED — AUTH-AR-01` |
| `TC-AR-R04` | Decision | Save and Continue Later lifecycle. | Ownership, expiry, access, privacy, restore, and discard rules are approved before execution. | Implemented explicit blocker — `DECISION-AR-DRAFT` |
| `TC-AR-U01` | Acceptance | Omit a required upload. | Progression is blocked with an exact, associated message. | Implemented; `BLOCKED — AUTH-AR-01` |
| `TC-AR-U02` | Acceptance | Upload an allowed synthetic file. | File is accepted and other entered values persist. | Implemented; `BLOCKED — AUTH-AR-01` |
| `TC-AR-U03` | Acceptance | Upload a disallowed file type. | File is rejected safely with a specific message. | Implemented; auth and accepted-type contract gates remain |
| `TC-AR-U04` | Acceptance | Upload at and above the size limit. | Boundary is enforced without clearing unrelated values. | Implemented; auth and declared-size-limit gates remain |
| `TC-AR-U05` | Acceptance | Replace a reviewed/confirmed file. | Replacement invalidates any review or confirmation tied to the previous file. | Implemented; `BLOCKED — AUTH-AR-01` |
| `TC-AR-U06` | Acceptance | Remove a reviewed/confirmed file. | Removal clears or invalidates the related confirmation/readiness state. | Implemented; `BLOCKED — AUTH-AR-01` |
| `TC-AR-U07` | Acceptance | Recover from a safe, controlled upload failure. | Retry is possible and unrelated state is preserved. | Implemented explicit blocker — staging controls required |

## Person, document, Site, and copy/reuse cases

| Range | Type | Concrete scope | Current status |
| --- | --- | --- | --- |
| `TC-AR-P01`–`TC-AR-P05` | Characterization/Decision | First-time person; returning person; valid known details; updated details; same person in another role. | Planned — not implemented; person source/authority requires approval |
| `TC-AR-D01`–`TC-AR-D04` | Characterization/Decision | Valid saved document; expired document; replacement; request-specific document. | Implemented; live cases blocked by auth and authority/UI decisions remain explicit |
| `TC-AR-S01`–`TC-AR-S04` | Acceptance/Efficiency | Partial search; similar names; keyboard selection; interaction/keystroke effort. | Planned — not implemented |
| `TC-AR-C01`–`TC-AR-C08` | Decision/Acceptance | Copy person, address, and company/contact data; verify match, editability, source isolation, unrelated-value preservation, and forbidden reuse. | Planned — not implemented; copy rules and source/target pairs need approval |

## Efficiency cases

| ID | Measurement | Evidence requirement | Current status |
| --- | --- | --- | --- |
| `TC-AR-E01` | Manual field count. | Same fixture and branch; raw controls plus user-equivalent count. | Implemented; `BLOCKED — AUTH-AR-01` |
| `TC-AR-E02` | Clicks/interactions. | Agreed interaction-counting rules and same fixture. | Implemented; `BLOCKED — AUTH-AR-01` |
| `TC-AR-E03` | Repeated person values. | Field-level repetition map with semantic equivalence confirmed. | Implemented characterization; auth/field-map blocked |
| `TC-AR-E04` | Repeated document handling. | Upload/reference actions and document validity context. | Implemented characterization; auth/document decisions remain |
| `TC-AR-E05` | Steps/screens and backtracking. | Transition log for the same approved path. | Implemented; `BLOCKED — AUTH-AR-01` |
| `TC-AR-E06` | Validation corrections. | First failure retained; retry outcome recorded separately. | Implemented; `BLOCKED — AUTH-AR-01` |
| `TC-AR-E07` | Desktop versus mobile effort. | Same fixture on approved desktop/phone/tablet viewports. | Implemented; `BLOCKED — AUTH-AR-01` |
| `TC-AR-E08` | Keyboard interaction/friction. | Focus order, unreachable controls, and user-equivalent key count. | Implemented; `BLOCKED — AUTH-AR-01` |
| `TC-AR-E09` | Data preservation after error. | Before/after field snapshot and recovery effort. | Implemented; `BLOCKED — AUTH-AR-01` |
| `TC-AR-E10` | Manual repeat entry versus one-click copy. | Approved source/target pair and at least three comparable human sessions. | Implemented explicit blocker — copy behavior/human protocol unavailable |

## Accessibility and responsive cases

| ID | Scenario | Expected result | Current status |
| --- | --- | --- | --- |
| `TC-AR-A01` | Keyboard-only approved path. | All critical controls are reachable in logical order with visible focus. | Implemented; `BLOCKED — AUTH-AR-01` |
| `TC-AR-A02` | Labels, names, and error association. | Controls have usable accessible names and errors identify/focus the affected field. | Implemented; `BLOCKED — AUTH-AR-01` |
| `TC-AR-A03` | Phone viewport `390×844`. | No horizontal overflow or unreachable critical control through the approved boundary. | Implemented; `BLOCKED — AUTH-AR-01` |
| `TC-AR-A04` | Tablet viewport `768×1024`. | Same quality gates as desktop through the approved boundary. | Implemented; `BLOCKED — AUTH-AR-01` |
| `TC-AR-A05` | 200% zoom and reduced motion. | Content remains operable/readable; motion preferences are respected where animation exists. | Implemented; `BLOCKED — AUTH-AR-01` |

## Cross-workflow cases

| ID | Type | Scenario | Current status |
| --- | --- | --- | --- |
| `TC-AR-X01` | Decision | Map semantically equivalent LAAN values to authoritative Access Request sources. | Planned — not implemented; source ownership not approved |
| `TC-AR-X02` | Acceptance/Decision | Verify shared Site context remains consistent. | Planned — not implemented; suites use different dedicated Sites |
| `TC-AR-X03` | Efficiency | Measure duplicate entry across related requests. | Planned — not implemented; shared fixture and human protocol missing |

## Step coverage map

| Step | Mapped case families | Execution boundary |
| ---: | --- | --- |
| 1 | `TC-AR-001`–`005`, `B01`, `B02`, `S*`, `R*`, `E*`, `A*` | Approved after authentication refresh |
| 2 | `TC-AR-002`, `B07`, `R*`, `E*`, `A*` | Approved after authentication refresh |
| 3 | `TC-AR-002`, `005`, `P*`, `C*`, `E*`, `R*`, `A*` | Approved after authentication refresh |
| 4 | `TC-AR-002`, `B04`, `P*`, `U01`–`U04`, `R*`, `A*` | Approved synthetic baseline and upload |
| 5 | `TC-AR-B03`, `B08`, `R*`, `E*`, `A*` | Approved through Step 8 review; current auth/field-map blocked |
| 6 | `TC-AR-B05`, `B06`, `B08`, `R*`, `E*`, `A*` | Approved through Step 8 review; current auth/field-map blocked |
| 7 | `TC-AR-U*`, `D*`, `B08`, `R*`, `E*`, `A*` | Approved synthetic uploads; final submission prohibited |
| 8 | `TC-AR-006`, declarations/review, `E*`, `A*` | Review allowed; final Submit visible but untouched and POST blocked |

## Case evidence record

Every executed case records its ID, result type, status, environment, viewport,
URL, commit, synthetic run ID, expected/observed state, stopping point, first
failure, retry outcome if any, sanitized evidence, finding/recommendation links,
and final-submission-guard state. Raw authentication state, traces, and entered
form values remain local and ignored.

## Revalidation update (2026-08-26)

The refreshed authenticated run supersedes the earlier authentication-block
snapshot for the implemented core slice:

- `TC-AR-001`, `TC-AR-002`, `TC-AR-003`, and `TC-AR-004` passed.
- `TC-AR-002` now covers synthetic traversal through Steps 1–4, visible contractor
  details, and the approved qualification upload; it does not click Step 4 Next.
- `TC-AR-005`, `TC-AR-006`, and all branch, recovery, upload, reuse,
  accessibility, efficiency, and cross-workflow cases remain unimplemented or
  awaiting their approved execution wave.

## Steps 5–8 implementation update (2026-08-29)

This update supersedes the final bullet above for the implemented Steps 5–8
scope:

- 36 stable Steps 5–8 case declarations are implemented;
- the dedicated run contains 37 declarations including `TC-AR-001` preflight;
- implemented families are `TC-AR-005`, `TC-AR-006`, `B03`, `B05`, `B06`,
  `B08`, `R01`–`R04`, `U01`–`U07`, `D01`–`D04`, `E01`–`E10`, and
  `A01`–`A05`;
- the latest run `test-The-CRM-Carpenters-000041-20260829T111406111Z`
  recorded `TC-AR-001` as `BLOCKED — AUTH-AR-01` and did not execute the 36
  dependent declarations;
- the authenticated field-map capture is also blocked and contains no guessed
  selectors;
- zero final submissions were attempted; and
- the remaining 24 matrix cases are still planning-only or outside the Steps
  5–8 implementation scope.
