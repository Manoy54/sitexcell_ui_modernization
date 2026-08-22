# Access Request — Project Context

## Purpose

This document defines the Playwright testing and optimization context specifically for the **Access Request** workflow.

Access Request must remain a distinct testing scope from LAN / SAR-LAN Request, even though the two workflows are related and may share site, company, person, document, or request context.

The main question for this request is:

> **How can the Access Request filing process be made faster and easier without reducing the correctness, completeness, or quality of the resulting request?**


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

## Access Request Specific Goals

Playwright should help determine:

- whether a user can progress through the entire Access Request correctly;
- how much repetitive person/company data must be entered;
- whether known contractor/person details can be reused safely;
- whether valid documents can be reused instead of uploaded again;
- whether expired/replaced documents are handled correctly;
- how efficiently a user can find and select a site;
- whether "same person" or similar reuse can remove duplicate entry;
- which fields should be conditional;
- whether validation creates unnecessary rework;
- whether mobile/tablet workflows are significantly slower;
- whether information already known from related LAN/SAR-LAN context is requested again unnecessarily;
- whether identical individual/contact/address information can be copied in one click rather than manually re-entered.

---

## Access Request Improvement Areas

### 1. Reusable person / contractor information

Test scenarios should include:

```text
First-time person
Returning person
Person with updated contact details
Person with expired document
Person reused in another role
```

Potential reusable information may include:

- name;
- phone;
- email;
- licence information;
- white-card/construction information;
- company;
- other approved reusable personnel details.

The system should not reuse information blindly.

Check:

- whether the value is still valid;
- whether the user can update it;
- whether it belongs to the selected person;
- whether it creates conflicting data.

### 2. Reusable documents

Investigate whether users repeatedly upload the same valid documents.

Examples may include:

- driver's licence;
- white card;
- certificate of currency;
- workers compensation documentation;
- company documents;
- personnel documents.

Test separately:

```text
Valid saved document
Expired saved document
Replacement document
New request-specific document
```

A speed improvement must never cause stale or expired documents to be submitted.

### 3. Searchable site selection

Test whether the site selector supports efficient lookup.

Measure:

- interactions required;
- time to useful suggestion;
- number of keystrokes;
- keyboard usability;
- whether the correct canonical site is selected;
- whether similarly named sites are distinguishable.

### 4. Same-person reuse

Where one individual fills multiple roles, investigate whether the form can reuse the existing person safely.

Quality guardrails:

- role assignment remains correct;
- user can override role-specific values if required;
- no accidental merging of different people;
- data remains traceable.

### 5. Conditional fields and form length

Identify:

- fields irrelevant to the current request;
- fields only needed after a specific answer;
- repeated questions;
- outdated fields;
- sections that can be better grouped.

Do not hide required business data merely to shorten the form.

---

## Access Request Form Analysis Questions

For each field or section, ask:

1. Is this information already known from the user, company, person, Site, or related request?
2. Has this person been entered before?
3. Is the same person information requested multiple times?
4. Is the same document being uploaded repeatedly?
5. Is the document still valid?
6. Can a saved document be referenced instead?
7. Is site selection efficient?
8. Is the field relevant for every Access Request?
9. Can conditional logic reduce unnecessary visible fields?
10. Does validation explain exactly what is wrong?
11. Does a validation/server failure preserve data?
12. Does the user need to leave the form to retrieve information?
13. Is the same value already available from LAN/SAR-LAN context?
14. Can the form reduce clicks without reducing review quality?
15. Does the workflow remain usable on desktop, tablet, and mobile?

---

## Access Request Efficiency Findings

Use friction categories such as:

```text
Redundant Entry
Duplicate Information
Person Repetition
Document Repetition
Site-Selection Friction
Unnecessary Decision
Navigation Friction
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
Returning contractor must re-enter phone, email, licence, and white-card details.

Category:
Person Repetition

Recommendation:
Allow the user to select a known person and pre-populate reusable valid details.

Quality Guardrail:
The user must be able to verify/update changed information, and expired information must not be reused silently.

Retest:
Compare manual field count and completion time for a returning person before and after.
```

---


---

## One-Click Same-Information Copy Pattern

When two sections of the Access Request require the **same individual information, company/contact information, or address**, the form should be evaluated for a one-click copy/reuse action instead of forcing the user to enter the same values again.

This is a primary optimization concept for Access Request because one person may appear in more than one role and multiple people may share the same company or address.

Example UI concepts:

```text
[ Copy requester information ]

[ Same as primary contact ]

[ Copy contractor information ]

[ Copy address ]

[ Same address as above ]
```

A pattern similar to a checkout form's **"Copy purchaser information"** or **"Same as billing address"** control can be used where appropriate.

### Purpose

This pattern should reduce:

- repeated person entry;
- repeated contact entry;
- repeated address entry;
- filing time;
- spelling differences;
- accidental mismatches between fields that should contain identical information.

### Access Request Examples

#### Same individual in another role

```text
Primary contractor/person
        ↓
Another required person/role
        ↓
[ Copy primary person information ]
```

#### Same address

```text
Company / primary address
        ↓
Person / access address
        ↓
[ Same as company address ]
```

#### Same contact information

```text
Requester
        ↓
Site access contact
        ↓
[ Copy requester information ]
```

### Expected Behavior

When the user activates the copy action:

1. the correct source values populate the target fields;
2. the target fields remain visible for verification;
3. copied fields remain editable where allowed;
4. a clear confirmation is shown;
5. the user can change only the values that are different;
6. unrelated target fields are not overwritten;
7. source values are not changed merely because a copied target is edited;
8. expired, invalid, or inappropriate information is not copied silently.

Example success feedback:

```text
✓ Person information copied.
```

or:

```text
✓ Address copied from primary contact.
```

### Relationship to Remembered-Person Reuse

This concept is related to, but different from, selecting a previously saved person.

```text
Remembered person reuse:
Reuse data from an existing stored person/profile.

One-click same-information copy:
Reuse data already entered earlier in the current form/session.
```

Both patterns may exist in the same Access Request.

Example:

```text
Select known contractor
        ↓
Known details pre-populate
        ↓
Second role is the same person
        ↓
[ Copy contractor information ]
```

This can remove two different kinds of repetition.

### Quality Guardrails

One-click copying should not be used when:

- the second role must be held by a different person;
- independent confirmation is required;
- copied information may be expired;
- source and target represent different legal/business entities;
- automatic copying could hide a required distinction;
- the user could reasonably assume the values stay permanently linked when they do not.

The form should make the behavior clear.

For example:

```text
Information copied. You can edit any field that is different.
```

### Playwright Analysis

Playwright should identify sections where identical information is currently re-entered manually.

Useful metrics include:

```text
Repeated fields
Repeated keystrokes
Repeated dropdown selections
Manual-entry time
Copy-action time
Fields changed after copying
Mismatch errors prevented
```

Recommended tests:

```text
TC-AR-C01 — Copy same individual information in one click
TC-AR-C02 — Copy same address in one click
TC-AR-C03 — Copy same company/contact information in one click
TC-AR-C04 — Verify copied values match the selected source
TC-AR-C05 — Verify copied values remain editable when allowed
TC-AR-C06 — Verify editing copied target does not incorrectly change source
TC-AR-C07 — Verify unrelated target values are preserved
TC-AR-C08 — Verify copy action is unavailable when business rules forbid reuse
TC-AR-E10 — Compare manual repeated entry vs one-click copy efficiency
```

### Before vs After Example

```text
CURRENT

Second person uses same details:
First name       manual
Last name        manual
Email            manual
Phone            manual
Company          manual
Address          manual

Manual actions: 6+


IMPROVED

[ Copy primary person information ]

Manual actions: 1
Then edit only fields that differ.
```

### Recommendation Rule

When Playwright observes the same values being entered repeatedly in the current Access Request, record an optimization opportunity such as:

```text
Finding:
The second person/role uses the same individual and address information as the primary contact.

Current effort:
8 fields are manually repeated.

Recommendation:
Add "Copy primary person information" and/or "Same as primary address".

Expected improvement:
Replace repeated entry with one explicit user action.

Quality guardrail:
Copied fields remain visible, editable, and correct before final submission.
```

This pattern should be considered a key Access Request optimization wherever identical individual or address information is legitimately reused.


## Access Request Recommended Playwright Test Areas

### Functional

```text
TC-AR-001 — Open Access Request
TC-AR-002 — Complete required fields
TC-AR-003 — Validate conditional sections
TC-AR-004 — Validate required-field behavior
TC-AR-005 — Preserve entered values while navigating
TC-AR-006 — Reach valid pre-submit state
```

### Person reuse

```text
TC-AR-P01 — Add first-time person
TC-AR-P02 — Select returning person
TC-AR-P03 — Reuse valid known details
TC-AR-P04 — Update changed person details
TC-AR-P05 — Reuse same person for another role when supported
```

### Document reuse

```text
TC-AR-D01 — Select valid reusable document
TC-AR-D02 — Reject/flag expired reusable document
TC-AR-D03 — Upload replacement document
TC-AR-D04 — Upload new request-specific document
```

### Site search

```text
TC-AR-S01 — Search site using partial text
TC-AR-S02 — Select correct site from similar results
TC-AR-S03 — Use site search with keyboard
TC-AR-S04 — Measure site-selection effort
```

### Efficiency

```text
TC-AR-E01 — Measure manual field count
TC-AR-E02 — Measure clicks/interactions
TC-AR-E03 — Measure person repetition
TC-AR-E04 — Measure document repetition
TC-AR-E05 — Measure navigation/screens
TC-AR-E06 — Measure validation corrections
TC-AR-E07 — Measure desktop vs mobile effort
TC-AR-E08 — Test keyboard flow
TC-AR-E09 — Test data preservation after error
```

### Cross-workflow

```text
TC-AR-X01 — Identify values repeated from LAN/SAR-LAN
TC-AR-X02 — Verify shared Site context remains consistent
TC-AR-X03 — Measure duplicate data entry across related requests
```

---

## Access Request Before vs After Comparison

Example:

```text
Metric                         Before    After
----------------------------------------------
Manual fields                     18        9
Clicks                            26       15
Repeated person fields             6        0
Repeated document uploads          3        0
Site-selection interactions        9        3
Screens visited                    5        3
Completion time                 4m10s    2m05s
```

The improvement is acceptable only if the resulting Access Request remains complete and correct.

---

## Access Request Definition of Done

An improvement is verified when:

- functional behavior still works;
- the form reaches a valid pre-submit state;
- required information is preserved;
- reusable data is valid and correctly associated;
- expired/stale information is not silently reused;
- the intended efficiency metric improves;
- related LAN/SAR-LAN context remains consistent;
- evidence is recorded;
- the recommendation can be clearly justified.

---

## Access Request Guiding Principle

> **Reduce repeated filing effort while preserving the accuracy, validity, and completeness of the Access Request.**
