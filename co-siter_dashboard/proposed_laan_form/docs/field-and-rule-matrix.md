# Proposed LAAN Form Field and Rule Matrix

This matrix preserves the observed LAAN field contract while separating confirmed behavior from rules that still require business approval.

## Stage 1

| Field | Current role | Required | Prototype behavior | Rule status |
| --- | --- | --- | --- | --- |
| Activity (`input_1_11`) | Inspection, Installation, or Maintenance | Yes | Preserve position and options; activity changes trigger affected-field review | Confirmed interaction; conditional mapping pending where applicable |
| Commencement date (`input_1_12`) | LAAN commencement date | Yes | Accept strict `DD-MM-YYYY`; reject impossible dates inline; preserve correction value; enforce configured `minimumCommencementDate`/`maximumCommencementDate` boundaries when supplied | Calendar policy is the safe default; business range remains configurable until approved |
| Owner (`input_1_40`) | Optional owner selection | No | Preserve current selector and optional status | Confirmed |
| Site (`input_1_41`) | Selected approved Site | Yes | Search by name, address, or identifier; support keyboard selection; show selected-site context | Lookup improvement approved; authoritative source pending |
| Derived Site context | Address and Site notes | Derived | Show after Site selection; update when Site changes | Presentation and drawing-requirements link added; real Site ID, address, and notes snapshot integrated for all 297 Sites |
| Terms (`choice_1_63_1`) | Terms acknowledgement | Yes | Preserve declaration and block progression until accepted | Confirmed |

## Stage 2

| Field | Current role | Required | Prototype behavior | Rule status |
| --- | --- | --- | --- | --- |
| Carrier (`input_1_58`) | Carrier details | Yes | Preserve field and validation behavior | Confirmed |
| Project reference (`input_1_18`) | Project identifier | Yes | Preserve field and value through navigation/recovery | Confirmed |
| Tenant company (`input_1_19`) | Tenant/company details | Yes | Preserve field and value through navigation/recovery | Authoritative source pending |
| Contact (`input_1_83`) | Primary contact | Yes | Preserve field and value through navigation/recovery | Authoritative source pending |
| Phone (`input_1_87`) | Contact phone | Yes | Preserve field and validation behavior | Confirmed |
| Location (`input_1_22`) | Work location | Yes | Preserve field and value through navigation/recovery | Confirmed |
| Areas (`input_1_64`) | Affected areas | Yes | Preserve field and value through navigation/recovery | Confirmed |
| Cable start/end (`input_1_69`, `input_1_70`) | Conditional technical details | Pending | Keep current position and conditional behavior; do not invent applicability rules | Business approval required |
| Riser/fibre (`input_1_71`, `input_1_73`) | Conditional technical details | Pending | Keep current position and conditional behavior; do not invent applicability rules | Business approval required |
| Required LAAN upload (`input_1_49`) | Primary evidence | Yes | Show file status, accepted limits, retry, replacement, removal, and confirmation invalidation | 20 MB observation; final policy pending |
| Optional documents | Supporting evidence | No | Preserve optional status and show per-file status | Confirmed interaction |
| Required confirmations (`input_1_28_1`, `input_1_29_1`, `input_1_30_1`) | Evidence/work confirmations | Yes where applicable | File replacement/removal resets affected confirmation | Confirmation hierarchy approved; exact business mapping pending |
| Accuracy (`input_1_45_1`) | Accuracy declaration | Yes | Preserve declaration and include in readiness calculation | Confirmed |
| Contractor response | Additional response | No | Preserve optional status | Confirmed |

## Global rules

- A required value must be valid before progression.
- A removed or replaced required upload is unconfirmed until reviewed again.
- Invalidated conditional values cannot silently contribute to readiness.
- Validation errors preserve unaffected values.
- Ready state is simulated and never submits externally.
