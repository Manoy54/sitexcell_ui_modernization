# LAAN Request goal-defined test-case matrix

## Goal

Reduce the human effort and completion time needed to file a correct LAAN / SAR-LAN Request by approximately 20–30%, without reducing:

- required information or completeness;
- validation and business-rule enforcement;
- accuracy, traceability, or downstream consistency;
- user review and control;
- the ability to reach a valid pre-submit state.

The same logical request fixture must be measured before and after an improvement. Automated browser duration is supporting evidence only; human effort claims require comparable human sessions.

## Test result contract

Every case has one of these result types:

| Result type | Meaning | Can support an improvement decision? |
|---|---|---|
| **Acceptance** | The expected quality and behavior guardrails must pass. | Yes, when all P0 cases pass. |
| **Efficiency** | Captures comparable user-equivalent effort. | Yes, after at least three comparable runs or human sessions. |
| **Characterization** | Records current behavior, including an existing defect or unresolved rule. | No; it identifies work or a decision gate. |
| **Decision** | Requires an owner to define an authoritative source or business rule. | No; automation must not guess. |

An improvement is **green** only when:

1. all P0 acceptance cases pass;
2. no required value, validation rule, confirmation, or traceability is lost;
3. the request reaches a valid ready-to-submit state for every approved P0 path;
4. the targeted primary metric improves by at least 20%—completion time and manual effort where both are relevant;
5. no secondary metric regresses materially, including corrections, backtracking, lookup errors, or preservation after recovery.

An impossible date reaching Stage 2, a server critical-error page, a cleared upload retaining its confirmation, or reload data loss is a **failed acceptance result**, not a successful test run.

## Shared fixture and safety rules

- Use the authenticated synthetic Site configured by `LAAN_TEST_SITE_LABEL` and `LAAN_TEST_SITE_ID`.
- Use synthetic request values and documents only.
- Use the same activity, date, Site, Page 2 values, and document set for before/after comparisons.
- Install the final-submission guard in every default live test.
- Stop at the valid pre-submit state. Do not create, lodge, send, or confirm a request.
- Controlled final-boundary checks, if authorised, must be separate, staging-only, explicitly tagged, and blocked from production.
- Do not infer an accepted date range, upload policy, authoritative source, or copy relationship without a documented business rule.

## P0 acceptance cases

| ID | Scenario and edge case | Expected result | Evidence / failure condition | Current status |
|---|---|---|---|---|
| `TC-LAN-P0-01` | Open the form with an authenticated session. | Form and Stage 1 are visible; final submit is not visible. | Form state, URL, and zero submission attempts. | Automated |
| `TC-LAN-P0-02` | Complete the valid Installation path with the approved synthetic Site. | Stage 2 opens and all required Page 2 controls are available; final action is visible but untouched. | Field values, stage, upload state, guard result. | Automated |
| `TC-LAN-P0-03` | Repeat the valid path for Inspection and Maintenance. | Each approved activity reaches the correct stage and exposes only the controls allowed by its rule. | Conditional field state and zero stale required controls. | Automated, partial |
| `TC-LAN-P0-04` | Submit Stage 1 with all required values missing. | Stay on Stage 1 with field-specific feedback; do not lose entered values. | Stage remains 1, visible messages identify missing fields. | Automated |
| `TC-LAN-P0-05` | Omit terms acceptance, then correct it. | Stay on Stage 1; activity, date, and Site remain; correction advances to Stage 2. | Preservation map and correction count. | Automated |
| `TC-LAN-P0-06` | Enter `32-13-2026`, `31-04-2027`, `29-02-2027`, `2027-01-01`, and `1-1-2027`. | Each unsupported/impossible format is rejected inline on Stage 1 with a specific message; valid context remains. | Any Stage 2 advance, critical error, silent normalization, or lost context fails. | One case automated; expand matrix |
| `TC-LAN-P0-07` | Enter valid boundary dates `01-01-2027`, `31-12-2027`, and an approved leap-day case. | Each approved valid boundary reaches Stage 2 unchanged. | Exact retained date and stage. | Partial; leap rule pending |
| `TC-LAN-P0-08` | Change activity after Page 2 values have been entered. | Fields that become irrelevant are hidden/disabled and cannot submit stale values; still-relevant values remain; newly required controls appear. | Before/after field state, values, requiredness, and review state. | Not automated |
| `TC-LAN-P0-09` | Navigate Stage 1 → Stage 2 → Stage 1 → Stage 2. | All valid values, Site context, and confirmations remain unchanged. | Field-by-field preservation map and no extra lookup/re-entry. | Automated |
| `TC-LAN-P0-10` | Replace a required LAAN file after confirming it, then remove it. | Replacement requires re-review; removal clears or invalidates the confirmation and cannot leave the request apparently ready. | File/confirmation state, readiness state, no inconsistent pair. | Partial; current inconsistency is known |
| `TC-LAN-P0-11` | Leave the required LAAN file or required confirmations incomplete at the ready boundary. | The request is not ready; a controlled validation attempt would identify the exact missing requirement without a server error. | Readiness state or controlled validation evidence. | Final boundary pending authorisation |
| `TC-LAN-P0-12` | Trigger a recoverable validation error after filling valid context. | Error is inline, focusable, and recoverable; unrelated valid values survive. | Before/after field snapshot and correction count. | Partial |
| `TC-LAN-P0-13` | Reach Page 2 with all approved required data, upload, and confirmations. | Review values match entered values, required controls pass, and final submit is enabled but not activated. | Review snapshot and final-submission guard. | Automated, partial |

## P1 efficiency and usability cases

| ID | Scenario | Primary measure | Required decision or evidence |
|---|---|---|---|
| `TC-LAN-E01` | Complete the canonical fixture three times before and after a change. | Median human completion time, excluding application wait. | Same fixture and task instructions. |
| `TC-LAN-E02` | Count typed fields, selections, uploads, confirmations, clicks, and keystrokes. | Manual effort and interaction count. | Define whether a confirmation is an independent business decision. |
| `TC-LAN-E03` | Find the approved Site with no owner filter and with an owner filter. | Lookup time, option scans, wrong selections, and backtracking. | Confirm canonical Site and inactive/duplicate behavior. |
| `TC-LAN-E04` | Compare repeated Page 2 values with a legitimate one-click reuse action. | Repeated fields, keystrokes, clicks, time, and corrections. | Authoritative source and target editability must be approved first. |
| `TC-LAN-E05` | Review Page 2 with a synchronized request-context summary. | Backtracking and external lookup effort. | Summary must remain consistent with Stage 1 and editable source data. |
| `TC-LAN-E06` | Use keyboard only through both stages and the upload controls. | Focus order, unreachable controls, and keyboard-only completion time. | No final submission; visible focus required. |
| `TC-LAN-E07` | Complete the critical path at 390×844 and 768×1024. | Overflow, scroll effort, target reachability, and upload usability. | No critical control may be hidden or clipped. |
| `TC-LAN-E08` | Reload at Stage 1 and Stage 2; separately test an authorised draft flow. | Preserved fields, recovery time, and lost work. | Draft retention, expiry, access, and discard rules required before implementation. |
| `TC-LAN-E09` | Exercise invalid file type, exactly 20 MB, over 20 MB, and recoverable upload failure. | Error clarity, retry effort, and preservation of other values. | Confirm server limits and security behavior; use staging controls where needed. |

## P1 cross-workflow and data-quality cases

| ID | Scenario | Pass condition |
|---|---|---|
| `TC-LAN-X01` | Compare LAN values with the related Access Request. | Reuse candidates are mapped to an authoritative source; no stale snapshot is copied silently. |
| `TC-LAN-X02` | Compare LAN values with Site Owner Approval. | Shared Site, owner, address, and request-reference relationships remain consistent. |
| `TC-LAN-X03` | Create a source/target conflict for a proposed prefill or copy action. | Conflict is visible and explicitly resolved; the system does not silently choose a value. |
| `TC-LAN-X04` | Edit a copied target after reuse. | Target changes do not mutate the source; provenance remains reviewable. |

## Edge-case data set

| Area | Inputs / state changes |
|---|---|
| Date | blank; whitespace; impossible day/month; non-leap February 29; leap-day approved by rule; ISO format; single-digit day/month; first/last approved date; past/future boundary if business rules allow. |
| Activity | each supported activity; activity changed after Page 2 entry; activity changed twice; conditional confirmation checked before the branch is removed. |
| Site | no Site; owner filter omitted; owner filter selected; similar names; inactive/duplicate candidate; Site changed after derived context appears. |
| Upload | no required file; valid file; replacement after confirmation; removal after confirmation; zero/one/multiple optional files; invalid type; exactly-at-limit size; over-limit size; recoverable server retry. |
| Recovery | missing terms; missing required Page 2 value; validation correction; back/forward; Stage 1 reload; Stage 2 reload; interrupted session; authorised draft restore/discard. |
| Device/accessibility | phone; tablet; zoom; keyboard-only path; visible focus; long text; long filenames; assistive error association. |

## Evidence record

Each case should attach:

- scenario ID and fixture version;
- environment and viewport;
- before/after field snapshot;
- stage and URL at the stopping point;
- validation messages and focused control;
- file names and confirmation state where relevant;
- manual fields, interactions, lookup effort, corrections, backtracking, and scroll effort;
- final-submission guard result;
- result type, pass/fail status, and unresolved business-rule assumptions.

Never report a green optimization result from a test count alone. The result must show both reduced effort and preserved request quality.
