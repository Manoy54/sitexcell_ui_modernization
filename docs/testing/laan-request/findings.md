# LAAN Request Findings and Recommendations

## Executive assessment

> The main LAAN pre-submit paths are stable, but the workflow is not robust at the malformed-date boundary and the available evidence is not yet sufficient to claim that it is efficient or easy for users.

The completed automated checks show that the current two-page LAAN Request can be opened, populated with synthetic data, advanced to Page 2, and supplied with required and optional documents without triggering final submission. The current consolidated result is 15/16 passing: all 3 Core tests and 12/13 Wave 2 tests passed. This establishes a useful functional and safety baseline for valid paths. It does not override the confirmed malformed-date defect, which reproducibly produces a WordPress critical-error page instead of inline rejection.

The evidence also identifies improvement opportunities around document-upload consistency, site lookup, cross-step context, and repeated manual entry. Some are directly supported by the observed interface; others require user behavior, business-rule, or authoritative-data validation before implementation.

The recommended decision is to fix malformed-date handling first, preserve the proven safety controls, improve upload feedback and cross-step context, evaluate canonical Site search, and keep authoritative prepopulation, persistent drafts, and declaration simplification behind explicit decision gates.

## Decision framework

### Evidence levels

| Level | Meaning |
|---|---|
| **Observed** | Directly demonstrated by an automated test, captured metric, or live-form inspection. |
| **Inferred** | A reasonable potential user impact supported by the observed design, but not directly measured with users. |
| **Not yet validated** | Requires user research, business rules, authoritative-data mapping, or additional testing. |

### Recommendation statuses

| Status | Meaning |
|---|---|
| **Preserve** | Existing behavior protects submission quality or test safety. |
| **Improve** | Evidence is strong enough to specify and evaluate an incremental improvement. |
| **Investigate** | The opportunity may be valuable but depends on missing evidence or business rules. |
| **Test next** | Additional measurement is required before selecting a solution. |

### Priority and confidence

- **P0:** quality or safety behavior that must not regress.
- **P1:** high-value improvement or investigation.
- **P2:** additional validation and coverage.
- **Confidence:** strength of the evidence behind the finding, not the size of its possible benefit.

## Evidence baseline

Source run:

```text
test case result/history/LAN-20260817-110859-312.json
```

The original four-test baseline below remains the structural reference. A final five-test regression was subsequently completed after the navigation-preservation case was added.

| Measure | Observed result | Interpretation |
|---|---:|---|
| Tests executed | 4 | A focused pre-submit suite, not exhaustive workflow coverage. |
| Tests passed | 4 | The tested paths behaved as expected. |
| Skipped / unexpected / flaky | 0 / 0 / 0 | No instability appeared in this run. |
| Full automated suite runtime | 47.7 seconds | Execution evidence only; not human completion time. |
| Initial form load observation | 4.88 seconds | A single observation; insufficient for a performance conclusion. |
| Visible Page 1 controls | 6 | Includes fields, acceptance, and navigation controls. |
| Required Page 1 controls | 3 | Required status was captured from the rendered controls. |
| Manual field candidates on Page 1 | 2 | A test-derived candidate count, not a complete human-effort metric. |
| Activity options | 4 | A small bounded selection. |
| Site options | 298 | A large native selection set and a lookup-effort candidate. |
| Page 2 values entered by the canonical test | 7 | Carrier, reference, tenant, contact, phone, location, and access areas. |
| Upload paths covered | 2 | Required LAAN and optional Additional Documents. |
| Final submissions attempted | 0 | The safety boundary remained intact. |

### Final five-test regression

```text
Run ID: LAN-20260817-224552-799
Source run: test case result/history/LAN-20260817-224552-799.json
Tests executed: 5
Tests passed: 5
Unexpected / skipped / flaky: 0 / 0 / 0
Runtime: 72.4 seconds
Final submissions attempted: 0
```

The regression covered the baseline map, canonical synthetic Page 2 path, Page 1/Page 2 value preservation, required LAAN upload, and optional Additional Documents upload. This confirms the tested pre-submit paths and both upload controls remained functional together.

### Targeted follow-up result

The first evidence-gap test was run successfully:

```text
Run ID: LAN-20260817-222510-625
Test: preserves entered values while navigating between LAAN pages without submitting
Result: 1 passed / 1 executed
Test duration: 22.0 seconds
```

The test entered synthetic Page 1 and Page 2 values, returned to Page 1, confirmed the activity, date, site, and terms state, returned to Page 2, confirmed all seven Page 2 values, and left final submission untouched.

This upgrades the value-preservation portion of LAN-F01 from an untested assumption to observed evidence. It does not prove that users never backtrack or that the workflow is efficient; those remain usability and timing questions.

### Wave 2 focused results

The final consolidated authenticated run was completed on 2026-08-22 in headless Microsoft Edge mode with the same selectors, assertions, synthetic fixtures, and final-submission guard used by the visible-browser runs:

```text
Core run: LAN-20260822-104333-974 — 3 / 3 passed — 43.6 seconds
Wave 2 run: LAN-20260822-104424-613 — 12 / 13 passed — 3.4 minutes
Overall: 15 / 16 passed — 1 malformed-date acceptance failure
Final submissions attempted: 0
```

Earlier focused authenticated runs were completed on 2026-08-17:

| Group | Run ID | Result | Interpretation |
|---|---|---:|---|
| Activity variants | `LAN-20260817-232432-028` | 2 / 2 passed | Inspection and Maintenance both reached Stage 2. |
| Stage 1 validation | `LAN-20260817-235644-162` | 2 / 3 passed | Required fields and missing terms behaved correctly; the instrumented malformed-date case reproduced the WordPress critical-error page. An earlier run advanced to Stage 2. |
| Upload recovery | `LAN-20260817-232606-435` | 3 / 3 passed | Replacement, clearing, confirmation-state capture, and multi-file selection completed safely. |
| Reload characterization | `LAN-20260817-232654-082` | 2 / 2 probes completed | Evidence shows substantial data loss after reload; a probe pass does not mean preservation passed. |
| Keyboard | `LAN-20260817-234416-180` | 2 / 2 passed | Both stages passed after the Stage 2 assertion was corrected to target the public Browse interaction. |
| Responsive | `LAN-20260817-232821-387` | 2 / 2 passed | Phone and tablet critical paths completed with zero measured horizontal overflow. |

The current consolidated Wave 2 result is 12 passing and 1 acceptance failure. The failed case is intentionally retained: impossible date input must produce safe Stage 1 inline rejection, not a server error. No final submission was attempted.

### Covered scenarios

1. Map the initial LAAN form without entering data.
2. Complete the canonical synthetic Installation path from Page 1 to Page 2.
3. Preserve entered values while navigating Page 1 → Page 2 → Page 1 → Page 2.
4. Upload the required LAAN attachment.
5. Upload an optional Additional Documents attachment.

All scenarios stop before final submission and use synthetic data.

## Summary of findings

| ID | Finding | Evidence level | Priority | Confidence | Decision |
|---|---|---|---|---|---|
| LAN-F01 | Two-page workflow has explicit progress but limited cross-step context | Observed + inferred impact | P1 | Medium | Improve |
| LAN-F02 | Site selection exposes 298 options through a native selector | Observed + inferred impact | P1 | Medium | Investigate |
| LAN-F03 | Required and optional uploads use different interaction models | Observed | P1 | High | Improve |
| LAN-F04 | Seven Page 2 values are manually entered in the canonical path | Observed; reuse unvalidated | P1 | Medium | Investigate |
| LAN-F05 | Automated tests preserve a safe pre-submit boundary | Observed | P0 | High | Preserve |
| LAN-F06 | Terms and confirmations add substantial review content and interaction | Observed; necessity unvalidated | P2 | Medium | Test next |
| LAN-F07 | Current measurements cannot establish human efficiency | Observed limitation | P0 | High | Preserve claim discipline |
| LAN-F08 | Reload clears most request context and all tested Stage 2 values | Observed | P1 | High | Improve recovery |
| LAN-F09 | A malformed commencement date is not safely rejected at Stage 1 | Observed at Stage 1 gate | P1 | High | Fix validation and server handling |

## Detailed findings

### LAN-F01 — Two-page workflow with limited cross-step context

**Current behavior:** The form is divided into two Gravity Form pages. Page 1 contains activity, commencement date, owner/site context, site information, and terms acceptance. Page 2 contains carrier, tenant, access, documents, and submission confirmations.

**Observed evidence:** The interface already displays `Step 1 of 2` with `50%` and `Step 2 of 2` with `100%`. The canonical test advances between the pages successfully. The targeted navigation follow-up also passed after entering synthetic values: Page 1 and Page 2 values were preserved through Page 1 → Page 2 → Page 1 → Page 2 navigation.

**Potential user impact:** Page 2 does not visibly summarize the selected activity, site, owner, or commencement date. Users may need to navigate backward to verify context. This backtracking risk is inferred; it has not been measured with users.

**Recommendation:** Preserve the existing two-step orientation and progress bar. Add a compact, read-only request-context summary on Page 2 and confirm that Back/Next navigation preserves all valid values.

**Expected benefit:** Better orientation and less avoidable backtracking without changing the familiar workflow.

**Quality guardrail:** The summary must reflect current form state, avoid stale values, and remain reviewable. Editing must occur through the authoritative field rather than an unsynchronised duplicate.

**Retest criteria:**

- Activity, date, owner, and site remain correct after Page 1 → Page 2 → Page 1 navigation.
- The Page 2 summary always matches Page 1 values.
- Recoverable validation errors do not clear valid entries.

**Decision:** Improve · P1 · Medium confidence for the context-summary opportunity; High confidence that existing entered values are preserved on the tested navigation path.

### LAN-F02 — Large site-selection option set

**Current behavior:** The Page 1 Site field exposes 298 options. An optional Owner selector can filter sites, but the Site field remains a native selection control in the observed interface.

**Observed evidence:** `siteOptionCount: 298` was captured by the baseline test. The intended synthetic site was present and selectable.

**Potential user impact:** A large native selector may require substantial scanning and can make similarly named sites difficult to distinguish. Actual lookup time, search strategy, and wrong-site frequency have not been measured.

**Recommendation:** Measure real lookup behavior first. If friction is confirmed, use a searchable selector with site name, address, owner, and stable identifying metadata. Preserve the Owner filter where it meaningfully narrows results.

**Expected benefit:** Less lookup effort and lower risk of selecting the wrong site.

**Quality guardrail:** Search results must map to canonical Site records, expose enough metadata to disambiguate matches, and prevent free-text values from creating invalid site relationships.

**Retest criteria:**

- Users can locate the synthetic site using name, address, or identifier.
- Ambiguous names display differentiating metadata.
- The selected canonical Site ID persists across navigation and validation.
- Before/after lookup interactions and time are measured on comparable tasks.

**Decision:** Investigate · P1 · Medium confidence.

### LAN-F03 — Inconsistent upload interaction models

**Current behavior:** The required LAAN uses a native file input. Additional Documents uses a richer uploader with a drop area and visible progress/filename behavior.

**Observed evidence:** Both baseline upload cases passed and verified the selected filename. Wave 2 also replaced and cleared the required file without clearing the seven access-detail values, and selected two optional files successfully. After the required file was cleared, the separate LAAN confirmation remained checked, demonstrating that file and declaration state can become inconsistent before final validation.

**Potential user impact:** Users may be uncertain whether the required LAAN was accepted because its feedback differs from the supporting-document uploader.

**Recommendation:** Standardize the two controls around consistent accepted-format guidance, size limits, filename display, completion state, remove/replace action, and recoverable error feedback. Required and optional status must remain unmistakable.

**Expected benefit:** Greater upload confidence and fewer unnecessary repeat uploads.

**Quality guardrail:** Preserve required-document validation, file restrictions, malware/security handling, and traceability. Do not imply upload completion until the server or uploader has actually accepted the file.

**Retest criteria:**

- Correct filename and completion state appear for both upload controls.
- Invalid type, excessive size, removal, replacement, and retry behavior are covered.
- A recoverable upload error does not clear unrelated form data.

**Decision:** Improve · P1 · High confidence. This is the strongest immediately supported improvement.

### LAN-F04 — Manual Page 2 entry and possible reuse opportunities

**Current behavior:** The canonical test manually enters seven values: Registered Carrier Name, Carrier Project Reference, Tenant Company Name, Tenant Contact Person, Tenant Contact Number, Tenant Location/Floor, and Areas to be Accessed.

**Observed evidence:** All seven controls accepted synthetic values. The system records available to supply those values were not inspected.

**Potential user impact:** Re-entering known company or contact information may increase typing and inconsistency. It is not yet known which values are authoritative, current, legally independent, or request-specific.

**Recommendation:** Create an authoritative-source map before proposing prepopulation. Candidate sources include Site, account/company, person/contact, and the current LAAN request. Use safe prepopulation or explicit copy actions only where identity and precedence rules are confirmed.

**Expected benefit:** Fewer manual entries and fewer mismatches in legitimately reusable data.

**Quality guardrail:** Never silently choose between conflicting records. Label the source, keep values visible, preserve editability where permitted, and ensure editing a copied target does not mutate the source.

**Retest criteria:**

- Each reused value matches its authoritative source.
- Conflicting or stale values require explicit review.
- Copy actions do not overwrite unrelated fields.
- Manual-field count is measured before and after implementation.

**Decision:** Investigate · P1 · Medium confidence.

### LAN-F05 — Safe automated pre-submit boundary

**Current behavior:** The tests reach Page 2 and exercise file selection without activating the final Submit control.

**Observed evidence:** The final five-test regression passed and the submission guard recorded no final submission attempt.

**Why it matters:** This allows future versions of the form to be compared safely without creating live requests.

**Recommendation:** Preserve the default non-submit suite and submission interception. Any controlled end-to-end submission must remain separately tagged, synthetic, explicitly authorised, and staging-only.

**Retest criteria:** All baseline and improvement tests reach their intended stopping points with zero unintended submissions.

**Decision:** Preserve · P0 · High confidence.

### LAN-F06 — Terms and confirmation burden

**Current behavior:** Page 1 contains acceptance plus a large Terms and Conditions region. Page 2 includes four submission confirmations in addition to document controls.

**Observed evidence:** These controls and their visual footprint were captured during live-form inspection. Inspection and Maintenance both reached Stage 2. The Maintenance path additionally exposed the supporting-drawings confirmation (`input_1_30_1`), while the tested cable, riser, fibre, and drawing-upload controls remained hidden and disabled. Their legal and business necessity was not assessed.

**Potential user impact:** Long policy content and repeated confirmations can increase scrolling and cognitive load. This is not evidence that any confirmation should be removed.

**Recommendation:** Validate the business purpose of each confirmation. Improve hierarchy and progressive disclosure where allowed, while keeping required acceptance visible and accessible.

**Quality guardrail:** Do not remove, combine, pre-check, or hide legally or operationally required confirmations without explicit business approval.

**Retest criteria:** Keyboard users can reach and understand every required confirmation, errors identify the exact missing confirmation, and accepted values persist after recoverable errors.

**Decision:** Test next · P2 · Medium confidence.

### LAN-F07 — Efficiency is not yet measured

**Current behavior:** The suite records automated execution duration and some structural metrics.

**Observed evidence:** The original four-test baseline took 47.7 seconds; the final five-test regression took 72.4 seconds. The initial load observation was 4.88 seconds. These values combine automation and application/network behavior and do not represent human completion time.

**Why it matters:** Passing tests prove the covered paths work; they do not prove the form is fast, understandable, or easy to complete.

**Recommendation:** Capture user-equivalent interaction counts and comparable task timing. Use at least three comparable runs where practical and separate application wait from user work.

**Quality guardrail:** Treat the intended 20–30% reduction in time and manual effort as a future success target, not an achieved result.

**Decision:** Preserve claim discipline · P0 · High confidence.

### LAN-F08 — Reload causes substantial data loss

**Current behavior:** Reloading Stage 1 returns the form with only the Installation activity retained. Reloading from Stage 2 returns the user to Stage 1.

**Observed evidence:** After Stage 1 reload, commencement date, Site, and terms acceptance were cleared. After Stage 2 reload, all seven tested access-detail values were cleared and the active stage returned to Stage 1.

**Potential user impact:** An accidental refresh, interrupted browser session, or recovery attempt can force the user to re-enter request context and access details. The actual frequency of reload or interruption has not been measured.

**Recommendation:** Add an explicit unsaved-change warning immediately. Investigate draft or autosave recovery using synthetic data and an approved retention model.

**Quality guardrail:** Draft storage must protect sensitive request information, respect access controls and retention rules, identify staleness, and never restore values into the wrong request or Site.

**Retest criteria:** Stage 1 and Stage 2 values survive approved recovery paths, stale drafts are identified, and users can deliberately discard a draft without affecting submitted records.

**Decision:** Improve recovery · P1 · High confidence.

### LAN-F09 — Malformed commencement date is not safely rejected at Stage 1

**Current behavior:** Stage 1 requires a commencement date and explains that it should align with the attached LAAN.

**Observed evidence:** The controlled test entered `32-13-2026` with otherwise valid Stage 1 context. In the original focused run, the form navigated to the Installation Stage 2 URL rather than showing a date-field error. Reruns `LAN-20260817-234509-287` and `LAN-20260817-235644-162` both displayed WordPress's `There has been a critical error on this website` page. The instrumented rerun recorded `critical-error`, no visible LAAN form, neither stage visible, no inline validation messages, and no retained date value. The empty-field and missing-terms cases immediately before it passed.

**Potential user impact:** A normal date-entry mistake can produce a dead-end server-error page, lose request context, or carry invalid data deeper into the workflow. Final-submission validation was intentionally not tested, so ultimate persistence remains unknown.

**Recommendation:** Validate calendar correctness and any approved business-date rules before leaving Stage 1. Keep the user's other valid context intact, focus the date field with a specific message, and correlate the latest failing run with WordPress/PHP logs to identify the server exception.

**Quality guardrail:** Do not silently rewrite ambiguous dates. Date rules must match the accepted locale, LAAN document requirements, and any permitted past/future range.

**Retest criteria:** Impossible dates remain on Stage 1, receive a field-specific message, preserve activity/Site/terms, never produce a server error, and valid boundary dates continue to Stage 2.

**Decision:** Fix validation · P1 · High confidence for the Stage 1 gate; final-submit behavior remains untested.

## Prioritized recommendation roadmap

| ID | Recommendation | Status | Priority | Evidence confidence | Implementation consideration |
|---|---|---|---|---|---|
| LAN-R01 | Preserve submission blocking, validation, traceability, and required-data controls | Preserve | P0 | High | Keep automated default tests non-destructive. |
| LAN-R02 | Standardize required and optional upload feedback | Improve | P1 | High | Align states while preserving required/optional semantics and security rules. |
| LAN-R03 | Add a synchronized Page 2 request-context summary | Improve | P1 | Medium | Preserve the familiar two-page orientation. |
| LAN-R04 | Measure and improve the 298-option site lookup | Investigate | P1 | Medium | Validate user behavior before selecting a search interaction. |
| LAN-R05 | Map authoritative sources for Page 2 values | Investigate | P1 | Medium | Resolve identity, staleness, conflict, and editability rules first. |
| LAN-R06 | Validate terms and confirmation hierarchy | Test next | P2 | Medium | Business/legal approval can veto simplification. |
| LAN-R07 | Maintain validation, recovery, keyboard, phone, and tablet regression coverage | Preserve | P0 | High | Wave 2 coverage is complete; retain it while the form changes. |
| LAN-R08 | Reject impossible commencement dates before Stage 2 | Fix | P0 | High | Release blocker for a recommended production experience; preserve other valid context and avoid server errors or ambiguous normalization. |
| LAN-R09 | Warn about unsaved changes and investigate secure draft recovery | Improve | P1 | High | Define retention, access, staleness, and discard behavior first. |

## Recommended next test sequence

1. **Completed — Back/forward preservation:** Page 1 and Page 2 values survived the tested navigation path; extend this later to reload, draft, and interrupted-session recovery.
2. **Completed with finding — Required-field validation:** empty and missing-terms behavior passed; an impossible date advanced to Stage 2 in one run and produced a WordPress critical error in the latest rerun. Safe inline rejection remains an open defect.
3. **Completed with finding — Upload recovery:** replacement, removal, multi-file selection, and data preservation passed; clearing the required file left its confirmation checked. Invalid type, excessive size, and server retry still require safe evidence.
4. **Manual measurement required — Site lookup effort:** record interactions and elapsed task time for representative lookup tasks.
5. **Completed — Keyboard flow:** both stages passed in `LAN-20260817-234416-180`, including the visible Additional Documents Browse interaction.
6. **Completed — Phone and tablet critical paths:** 390x844 and 768x1024 pre-submit paths passed with zero measured horizontal document overflow.
7. **Business decision required — Authoritative-data mapping:** document which Site, company, person, and request records can supply values before approving reuse.
8. **Human study required — Comparable effort baseline:** record manual fields, interactions, lookup effort, backtracking, scrolling, corrections, and user task time.

The execution order, expected evidence, and interpretation rules are documented in `wave-2-validation.md`.

## Evidence gaps and limitations

- Installation, Inspection, and Maintenance reached Stage 2 with the synthetic Site; other activity/Site combinations remain untested.
- Human completion time and perceived ease were not measured.
- Interaction count, keystrokes, scrolling, and backtracking were not captured comprehensively.
- Required-field, malformed-date, upload replacement/removal, and reload probes were executed; invalid file type/size and recoverable server errors remain untested.
- Reload data loss was observed; draft preservation and interrupted-session recovery mechanisms remain untested.
- Stage 1 and Stage 2 keyboard paths passed, and phone/tablet critical paths passed.
- WordPress/PHP logs were not available, so the exact server-side cause of the malformed-date critical error remains unproven.
- Authoritative sources and conflict rules for Page 2 values remain unknown.
- Access Requests has not been tested, so cross-workflow duplication cannot yet be claimed.
- Final submission was intentionally excluded.
- The 4.88-second initial load is a single observation, not a performance baseline.

## Success target for a future improved form

The intended investigation target remains approximately 20–30% lower human completion time and manual effort, with:

- no loss of required information;
- no validation regression;
- no reduction in accuracy, traceability, or downstream consistency;
- fewer repeated entries and corrections;
- preserved values after navigation and recoverable errors;
- a valid pre-submit state for all approved P0 scenarios.

This is a target to validate through before/after measurement, not a current result.

## Decision and project gate

**Gate status:** the evidence baseline and recommendation analysis are complete; production implementation is not yet approved.

1. Evidence report published and updated after targeted Wave 2 tests - complete.
2. Findings and recommendation actions accepted - complete.
3. Validate any approved form changes against the established baseline and quality guardrails - pending.
4. Resolve server, business-rule, authoritative-data, retention, and human-measurement gates before production approval - pending.

## Test-contract refinement

The acceptance contract is now separated from characterization evidence in `docs/testing/laan-request/test-case-matrix.md`. Four strict non-submitting goal gates were added to Wave 2 for:

- invalidating the LAAN confirmation when its required file is removed;
- requiring confirmation again when a confirmed LAAN file is replaced;
- preserving completed Stage 1 context after reload;
- preserving completed Stage 2 values and active stage after reload.

These cases are expected to remain red until the known defects are fixed. A completed browser probe is not counted as an acceptable result when it loses request data or leaves required upload state inconsistent.
