# LAN / SAR-LAN Request — Project Context

## Purpose

This document defines the Playwright testing and optimization context specifically for the **LAN / SAR-LAN Request** workflow.

The LAN Request must remain a distinct testing scope from Access Request, even though the two workflows are related and may reuse common site, company, person, or request context.

The main question for this request is:

> **How can the LAN / SAR-LAN filing process be made faster and easier without reducing the correctness, completeness, or quality of the resulting request?**


## Shared Playwright Analysis Principles

This request is part of the wider SiteXcell form-efficiency initiative. Although LAN Request and Access Request are documented separately, both follow the same testing philosophy.

### 1. Simulate the full filing flow and stop before final submission

The default Playwright analysis flow should behave like a real user and progress through the form until the final pre-submit state.

```text
Open form
    ↓
Complete relevant fields
    ↓
Navigate sections / steps
    ↓
Trigger validation where useful
    ↓
Reach final review / ready-to-submit state
    ↓
STOP BEFORE FINAL SUBMIT
```

Unless a test is explicitly marked as a controlled submission test, Playwright should **not perform the final action that creates, lodges, sends, or confirms the request**.

The analysis suite may verify that:

- all required fields are complete;
- the form reaches a valid ready-to-submit state;
- the final submit control is enabled;
- review data matches the values entered;
- validation has passed;
- the request could be submitted successfully if the final action were performed.

Full-submit tests should be separated and explicitly tagged, for example:

```text
@submission
@destructive
@staging-only
```

### 2. Analyze speed, efficiency, and functionality

Each workflow should be assessed in three dimensions.

#### Speed

Measure where time is spent, such as:

- total simulated completion time;
- slow sections;
- site/person/document lookup delays;
- validation delays;
- repeated loading;
- unnecessary navigation;
- waiting for dependent fields.

#### Efficiency

Measure how much work the user performs, such as:

- manual fields;
- clicks/interactions;
- dropdown selections;
- repeated information;
- duplicate entry;
- navigation/screens;
- scrolling;
- backtracking;
- repeated document handling;
- repeated person/company information;
- unnecessary edit states.

#### Functionality

Verify that the form behaves correctly while progressing through it, including:

- required-field behavior;
- conditional fields;
- validation;
- value persistence;
- dependency behavior;
- field relationships;
- review state;
- ability to reach a valid pre-submit state.

A form may be:

```text
Functionally correct
but
slow or inefficient
```

Both results must be documented.

### 3. Optimize without compromising submission quality

The purpose is not to make the form faster by removing necessary information or bypassing important business rules.

Every recommendation must preserve or improve:

- correctness;
- completeness;
- data quality;
- data integrity;
- validation;
- traceability;
- downstream processing;
- user understanding;
- relationship consistency.

A successful optimization follows:

```text
User effort decreases
AND
submission quality is maintained or improved
```

Acceptable examples include:

- pre-populating known values;
- reusing valid data;
- searchable selectors;
- safe defaults;
- conditional fields;
- clearer grouping;
- fewer unnecessary screens;
- preserving entered values after errors;
- clearer validation;
- removing duplicate data entry.

Unacceptable examples include:

- skipping required business data only to save time;
- suppressing validation;
- reusing stale or expired information;
- auto-selecting values that cannot be determined reliably;
- hiding required information;
- bypassing necessary approval/confirmation controls.

### 4. Produce recommendations and an improvement plan

Playwright results should not stop at PASS/FAIL.

Each meaningful finding should capture:

```text
Current behavior
↓
Observed friction
↓
Evidence / metric
↓
Why it matters
↓
Recommended improvement
↓
Expected benefit
↓
Quality / business-rule considerations
↓
Priority
↓
Suggested implementation approach
↓
Retest criteria
```

Recommendations should be prioritized based on:

- user effort saved;
- frequency of the workflow;
- error reduction;
- implementation complexity;
- business risk;
- data-quality impact;
- cross-workflow benefit.

### Shared core metrics

Where practical, capture:

```text
Manual fields
Auto-populated fields
Redundant fields
Clicks / interactions
Completion time
Navigation / screens
Validation corrections
Backtracking
Scroll effort
Lookup/search effort
Data preserved after errors
```

The purpose of these metrics is to establish a baseline and support before-vs-after comparison after an improvement is implemented.


---

## LAN / SAR-LAN Specific Goals

Playwright should help determine:

- whether a user can progress through the entire LAN Request correctly;
- how many fields must be entered manually;
- which values already exist elsewhere in the system;
- which values can be pre-populated;
- which values can be safely defaulted;
- which fields are repeated or unnecessary;
- which fields should be conditional;
- whether users must leave the form to retrieve information;
- whether validation creates unnecessary rework;
- whether desktop/mobile workflows differ substantially;
- whether LAN Request data can be reused safely by related downstream workflows;
- whether repeated individual/contact/address information can be copied in one click when the source and target are legitimately the same.

---

## LAN / SAR-LAN Form Analysis Questions

For each important field or section, ask:

1. Does the system already know this value?
2. Does the value exist on the selected Site?
3. Does it exist on the related account/company?
4. Is it repeated in another section?
5. Is the same value later requested in Access Request?
6. Is the same value later needed by Site Owner Approval?
7. Can it be pre-populated safely?
8. Can it be derived?
9. Can it use a safe default?
10. Should it be read-only?
11. Is it only relevant in certain cases?
12. Can conditional display reduce visual/form complexity?
13. Does manual entry introduce data-consistency risk?
14. Does the user need another screen or record to find the value?
15. Does a validation or server error preserve completed work?

---

## LAN / SAR-LAN as a Source of Reusable Context

LAN/SAR-LAN may contain values that should be reusable by related workflows.

Examples may include:

- request reference;
- site;
- site owner;
- address/location;
- request details;
- other approved request metadata.

Do not assume every field should be copied.

For each candidate reusable value, determine:

- which record is authoritative;
- whether the value can become stale;
- whether the downstream workflow needs a live reference or snapshot;
- whether the user needs override capability;
- whether reusing the value can create conflicting records.

---

## LAN / SAR-LAN Efficiency Findings

Use friction categories such as:

```text
Redundant Entry
Duplicate Information
Unnecessary Decision
Navigation Friction
Discoverability Problem
Excessive Interaction
Validation Friction
Error-Recovery Problem
Performance Friction
Accessibility / Keyboard Friction
Mobile / Responsive Friction
Cross-Workflow Duplication
```

Example:

```text
Finding:
User manually types Site Owner even though Site Owner is already linked to the selected Site.

Category:
Redundant Entry

Recommendation:
Pre-populate Site Owner from the canonical Site relationship.

Quality Guardrail:
The value must come from the authoritative Site record and remain consistent with downstream workflows.

Retest:
Compare manual field count and completion time before and after.
```

---


---

## One-Click Same-Information Copy Pattern

When two sections of the LAN / SAR-LAN Request require the **same person, contact information, company information, or address**, the form should be evaluated for a one-click copy/reuse action instead of forcing the user to type the same values again.

Example UI concepts:

```text
[ Copy requester information ]

[ Same as site contact ]

[ Copy primary contact address ]

[ Same address as above ]
```

The exact label should match the business context of the form.

### Purpose

This pattern is intended to reduce:

- repeated typing;
- duplicate data entry;
- spelling inconsistencies;
- accidental differences between fields that are meant to be identical;
- unnecessary filing time.

### LAN / SAR-LAN Examples

Potential situations include:

```text
Primary contact
        ↓
Secondary / related contact section
        ↓
[ Copy primary contact information ]
```

or:

```text
Site address
        ↓
Work / correspondence address
        ↓
[ Same as site address ]
```

or:

```text
Requester details
        ↓
Another role uses the same individual
        ↓
[ Copy requester information ]
```

This concept should only be recommended where the values are genuinely allowed to be the same under the business rules.

### Expected Behavior

When the user activates the copy action:

1. the intended source fields are copied into the target fields;
2. all mapped values remain visible for review;
3. the copied values remain editable when business rules allow;
4. the form clearly communicates that the values were copied;
5. the action must not overwrite unrelated fields;
6. the action must not silently copy stale or incorrect data;
7. the user should be able to change any field that differs.

Example success feedback:

```text
✓ Information copied from requester.
```

or:

```text
✓ Address copied from site address.
```

### Quality Guardrails

Do not use one-click copying as a shortcut when:

- the target information is legally/business-required to be independently confirmed;
- the target represents a different entity;
- the source may be stale or unverified;
- copying would create misleading duplicate data;
- the relationship between source and target is ambiguous.

The optimization is valid only when:

```text
User effort decreases
AND
the copied information remains correct, reviewable, and traceable.
```

### Playwright Analysis

Playwright should detect opportunities where the user currently enters identical values in multiple sections.

Useful measurements:

```text
Fields manually repeated
Keystrokes avoided
Clicks before copy feature
Clicks after copy feature
Time saved
Corrections caused by mismatched duplicate values
```

Recommended tests:

```text
TC-LAN-C01 — Copy same individual/contact information in one click
TC-LAN-C02 — Copy same address in one click
TC-LAN-C03 — Verify copied values match source fields
TC-LAN-C04 — Verify copied values remain editable when allowed
TC-LAN-C05 — Verify changing a copied target does not incorrectly alter the source
TC-LAN-C06 — Verify copy action does not overwrite unrelated fields
TC-LAN-E10 — Compare repeated manual entry vs one-click copy efficiency
```

### Recommendation Rule

When Playwright finds multiple target fields containing the same values as an earlier section, record an optimization opportunity such as:

```text
Finding:
The user manually re-enters 6 values already entered for the requester.

Current effort:
6 manual field entries.

Recommendation:
Add a "Copy requester information" action.

Expected improvement:
1 click replaces 6 repeated entries.

Quality guardrail:
Copied values remain visible and editable before final submission.
```

This pattern should be considered an important form-efficiency optimization for LAN / SAR-LAN Request where duplicate information is common.


## LAN / SAR-LAN Recommended Playwright Test Areas

### Functional

```text
TC-LAN-001 — Open LAN/SAR-LAN Request
TC-LAN-002 — Complete required fields
TC-LAN-003 — Validate required-field behavior
TC-LAN-004 — Validate conditional sections
TC-LAN-005 — Preserve entered values while navigating
TC-LAN-006 — Reach valid pre-submit state
```

### Efficiency

```text
TC-LAN-E01 — Measure manual field count
TC-LAN-E02 — Measure clicks/interactions
TC-LAN-E03 — Measure navigation/screens
TC-LAN-E04 — Detect redundant/derivable fields
TC-LAN-E05 — Detect repeated values
TC-LAN-E06 — Measure validation corrections
TC-LAN-E07 — Measure desktop vs mobile effort
TC-LAN-E08 — Test keyboard flow
TC-LAN-E09 — Test data preservation after error
```

### Cross-workflow

```text
TC-LAN-X01 — Identify LAN values repeated in Access Request
TC-LAN-X02 — Identify LAN values reused by Site Owner Approval
TC-LAN-X03 — Verify shared Site context remains consistent
```

---

## LAN / SAR-LAN Before vs After Comparison

For meaningful improvements, compare the same logical workflow.

Example:

```text
Metric                    Before    After
-----------------------------------------
Manual fields                14        9
Clicks                       21       15
Repeated fields               5        1
Screens visited               4        2
Validation corrections        2        0
Completion time            2m40s    1m45s
```

Do not judge an improvement only by appearance.

The preferred conclusion is evidence-based:

> The improved LAN Request reduced manual entry and navigation while preserving all required request information.

---

## LAN / SAR-LAN Definition of Done

An improvement is verified when:

- the relevant functional behavior still works;
- the form reaches a valid pre-submit state;
- the intended efficiency metric improves;
- no required information is lost;
- validation remains correct;
- related workflows are not made inconsistent;
- evidence is recorded;
- the recommendation can be clearly justified.

---

## LAN / SAR-LAN Guiding Principle

> **Reduce the work required to file a correct LAN / SAR-LAN Request, not the quality of the request itself.**
