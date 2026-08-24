# LAAN / SAR-LAN Live Field and Variant Matrix

## Capture status

- URL: `https://co-siter.com.au/laan-requests/`
- Observed: 2026-08-16, authenticated session
- Form engine: Gravity Forms, form `gform_1`
- Workflow: two pages; page 1 is active and page 2 is hidden until `Next`
- HTTP form method: `POST`
- Current core baseline: three authenticated synthetic pre-submit tests cover the initial form, canonical Installation path, and back/forward preservation; upload controls are covered by the canonical and Wave 2 recovery paths
- Final consolidated Wave 2 status: 12 tests passed and 1 failed in `LAN-20260822-104424-613`; activity variants, valid date boundaries, keyboard, reload, upload recovery, responsive paths, and the first two validation cases passed, while malformed-date handling remains an intentional failing acceptance test

## Observed workflow

### Page 1 — request/site context

| Field or control | Identifier | Type | Required | Observed behavior / source | Variant coverage |
|---|---|---:|---:|---|---|
| Activity type | `input_1_11` / `input_11` | Select | Yes | Options: Inspection, Installation, Maintenance | Each activity type; invalid/unselected |
| Proposed commencement date | `input_1_12` / `input_12` | Text date | Yes | Placeholder `dd-mm-yyyy`; must align with the date on the attached LAAN | Valid, missing, invalid format, past/edge date |
| Owner name | `input_1_40` / `input_40` | Select | No | Optional owner filter; 53 observed options | No owner vs selected owner; filter usefulness |
| Site name | `input_1_41` / `input_41` | Select | Yes | Historically exposed 298 options. The current public selector is empty, while backing field `input_1_85` exposes the approved non-submitting `siteXcell Pty Ltd` test context (`4127303000002387166`); live helpers mirror only that configured option. | No site, owner-filtered site, direct site selection, similar names |
| Building address | Rendered output | Derived display | N/A | Blank before site selection; expected to resolve from the selected site | Verify authoritative site relationship and persistence |
| Drawing requirements | Rendered link | External reference | N/A | Owner requirements checklist/example drawing link is visible | Discoverability; external navigation burden |
| Site notes to carriers | Rendered output | Derived display | N/A | Blank before site selection | Verify site-specific notes and reviewability |
| Terms and Conditions acceptance | `choice_1_63_1` / `input_63.1` | Checkbox | Yes | Must be accepted before progressing | Missing vs accepted |
| Next | `gform_next_button_1_36` | Button | N/A | Advances from page 1; transition is part of a POST form | Block final submission; measure transition and validation |

### Page 2 — request details and evidence

| Field or control | Identifier | Type | Required | Observed behavior / source | Variant coverage |
|---|---|---:|---:|---|---|
| Registered Carrier Name | `input_1_58` / `input_58` | Text | Yes | 255-character field | Valid, missing, length/format validation |
| Carrier Project Reference | `input_1_18` / `input_18` | Text | Yes | 255-character field | Synthetic unique reference; duplicate/format behavior |
| Tenant Company Name | `input_1_19` / `input_19` | Text | Yes | Tenant/Lessee name | Known company reuse and manual entry |
| Tenant Contact Person | `input_1_83` / `input_83` | Text | Yes | Contact person | Known person reuse and repeated entry |
| Tenant Contact Number | `input_1_87` / `input_87` | Telephone | Yes | Telephone input | Valid, missing, invalid format |
| Tenant Location/Floor | `input_1_22` / `input_22` | Text | Yes | Example: floor/rooftop/tower | Requiredness and clarification burden |
| Areas to be Accessed | `input_1_64` / `input_64` | Text | Yes | 255-character field | Requiredness and relationship to location |
| Cable Run Start | `input_1_69` / `input_69` | Text | Yes | Currently disabled and hidden with page 2 | Determine enabling condition and whether value is site-derived |
| Cable Run End | `input_1_70` / `input_70` | Text | Yes | Currently disabled and hidden with page 2 | Determine enabling condition and whether value is site-derived |
| Riser Utilised | `input_1_71` / `input_71` | Text | Yes | Currently disabled and hidden with page 2; references Riser Plan | Determine applicability and safe `N/A` behavior |
| Fibre Capacity | `input_1_73` / `input_73` | Text | Yes | Currently disabled and hidden with page 2 | Determine enabling condition and validation |
| LAAN upload | `input_1_49` / `input_49` | File | Yes by field label | Maximum observed size: 20 MB; native control does not expose `required` | Missing, valid, invalid type, size limit, preservation after error |
| Additional documents | `html5_1k05eilptq4r19m3gic1t6h1vg13` | File | No | Multi-file-style additional document control; 20 MB text shown | None, one document, multiple documents |
| Drawings uploaded confirmation | `input_1_28_1` / `input_28.1` | Consent checkbox | Yes by field label | Currently disabled and hidden with page 2 | Determine when drawing evidence is required |
| LAAN uploaded confirmation | `input_1_29_1` / `input_29.1` | Consent checkbox | Yes | Visible in page 2 DOM | Missing vs accepted; relationship to file upload |
| Supporting documents confirmation | `input_1_30_1` / `input_30.1` | Consent checkbox | Yes by field label | Currently disabled and hidden with page 2 | Determine enabling condition |
| Information accuracy confirmation | `input_1_45_1` / `input_45.1` | Consent checkbox | Yes | Visible in page 2 DOM | Missing vs accepted |
| Contractor Responses | `input_1_66` / `input_66` | Textarea | No | Optional comments field | Empty vs populated; downstream visibility |
| Final Submit | `gform_submit_button_1` | Submit | N/A | Exists in hidden page 2; must remain blocked in default suite | Never click in baseline/default analysis |

## Initial variant matrix

| Variant | Why it matters | Status | Next evidence needed |
|---|---|---|---|
| Inspection activity | May change required fields or evidence | Tested | Reached Stage 2; cable/riser/fibre and drawing-related conditional controls remained hidden and disabled |
| Installation activity | Canonical technical path | Tested | Five-test baseline reached Stage 2 with synthetic values and required upload |
| Maintenance activity | May have different technical/document requirements | Tested | Reached Stage 2; supporting-drawings confirmation became visible/enabled while cable/riser/fibre controls remained hidden/disabled |
| Owner filter omitted | Tests direct site lookup effort | Observed as default | Measure option count, selection effort, and correctness |
| Owner filter selected | Tests dependent filtering | Not tested | Verify site list narrows without losing valid sites |
| Synthetic test site selected | Safe baseline candidate | Tested | Canonical ID selection and navigation persistence passed |
| Missing terms acceptance | Required-field behavior | Tested | One required message appeared; activity, date, and Site persisted; correction advanced to Stage 2 |
| Missing/invalid date | Format and business-rule validation | Finding | `32-13-2026` advanced to Stage 2 in one run and reproducibly produced a WordPress critical-error page in two reruns instead of stable inline rejection |
| Missing LAAN file | Required upload behavior | Not tested at final validation boundary | Requires an explicitly authorised staging-only validation probe if final action must be triggered |
| Missing/invalid confirmations | Evidence and declaration rules | Partial finding | Clearing the required file left its confirmation checked; final gating remains outside the default boundary |
| Mobile/tablet viewport | Responsive effort and control usability | Tested | Phone and tablet critical paths passed with zero measured horizontal document overflow in the final Wave 2 run |
| Stage 1 reload | Recovery and draft behavior | Finding | Activity remained, but date, Site, and terms acceptance were cleared |
| Stage 2 reload | Recovery and draft behavior | Finding | Returned to Stage 1 and cleared all seven tested Stage 2 values |
| Keyboard flow | Accessibility | Tested | Stage 1 and Stage 2 passed in the final Wave 2 run, including the visible Additional Documents Browse control |

## Important unresolved relationships

1. Whether the selected site is the authoritative source for building address, site notes, owner requirements, and any cable/riser/fibre values.
2. Which activity types enable the disabled cable and drawing-related controls.
3. Whether the LAAN upload and “LAAN has been uploaded” consent intentionally duplicate each other or serve different audit purposes.
4. Whether tenant/company/contact values can be reused from existing SiteXcell records or related Access Requests.
5. Whether the visible owner/site selectors are native full lists or can be made searchable without changing the canonical selected-site relationship.
6. Whether “SAR-LAN” is a distinct runtime variant or a project term not represented in this page’s UI.

## Safety boundary for the next pass

Use a separate authenticated tab with synthetic values, intercept or block final submission, and stop at the valid pre-submit state. The current user tab was only inspected and remains unchanged.
