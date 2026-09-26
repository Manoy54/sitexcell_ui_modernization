# Live LAAN Page 2 Map

## Source and safety boundary

- Source: authenticated `https://co-siter.com.au/laan-requests/`
- Inspected: 2026-08-25 at a 1361 × 636 viewport
- Activity path: Installation, synthetic Site context, no final submission
- Final submission guard: installed; no final submission was attempted
- Evidence screenshots: `.test-artifacts/live-laan-page2-1361x636.png` and `.test-artifacts/live-laan-page2-full.png` (ignored local QA artifacts)

The previous prototype did not have a real Page 2 visual reference. It extrapolated Page 2 from the supplied Page 1/dashboard images. This live inspection replaces that assumption with measured structure.

## Measured frame

| Element | Measurement |
| --- | ---: |
| Viewport | 1361 × 636 px |
| Live Page 2 form canvas | 790 px wide |
| Live Page 2 content height | 1,043 px |
| Document height | 1,491 px |
| Form top | 106 px |
| First input height | 41 px |
| Two-column input width | 348 px |
| Page footer | 790 × 59 px |

The original cannot fit a 636 px-high viewport without scrolling because its form content alone is about 1.8 times the available post-header height.

## Real field order and orientation

The live form is one flat Gravity Forms flow rather than a set of named cards or product sections.

| Row | Left column | Right column |
| --- | --- | --- |
| 1 | Registered Carrier Name | Carrier Project Reference |
| 2 | Tenant Company Name | Tenant Contact Person |
| 3 | Tenant Contact Number | Tenant Location/Floor |
| 4 | Areas to be Accessed | Empty |
| 5 | Upload a Copy of the LAAN | Empty |
| 6 | Additional Documents multi-file drop zone, full width | — |
| 7 | “Please confirm your submission”, full width | — |
| 8 | Previous and Submit | — |

Visible confirmations on the inspected Installation path:

1. Drawings have been uploaded?
2. LAAN has been uploaded
3. Additional supporting documents have been provided as required?
4. I confirm that the information provided is true and accurate.

The cable-run, riser, and fibre fields existed in the DOM but were hidden and disabled. `Contractor Responses` was also hidden. They therefore do not belong in the default visible Page 2 composition.

## Mismatch in the previous prototype

The previous Page 2 was structurally different from the real form:

- It introduced large “Project and carrier”, “Work location”, “Technical details”, “Documents”, and “Confirmations” sections that the live form does not have.
- It made work location and affected areas full-width, while the live form keeps Tenant Location/Floor in the right column and Areas to be Accessed in the left half.
- It exposed a four-field disabled technical section that is hidden in the live Installation state.
- It added a large request-context strip, readiness card, contractor-response area, and generous vertical spacing. These increased height without preserving original orientation.
- It did not reconcile the supplied dashboard helper rail with the live Page 2 sequence. The selected direction now preserves both: the live form orientation in the main column and the Request workspace in the right rail.

## Prototype decision

The selected direction is available at `/?step=2`:

- The main form preserves the live Page 2 top-to-bottom sequence and measured two-column field orientation.
- Uploads and confirmations remain below the access fields, matching the original hierarchy.
- The dashboard's Request workspace remains visible as the right rail and keeps request context and readiness checks available.
- The main form and helper scroll independently; the helper remains visible while the taller form moves.

The compact split and three-lane experiments were removed after this direction was selected.

## Responsive and recovery rules

- Desktop Page 2 keeps the Request workspace at its responsive 280–360 px width and scrolls only the main form column.
- Validation and completion banners remain inside that recoverable form scroll.
- At 860 px and below, the layout becomes a single vertical flow. Mobile scrolling is intentional; horizontal overflow is not.
- The 390 px verification produced a 390 px document width with no horizontal overflow.

## Known rule gap

The live Installation capture exposed all four confirmations, while earlier characterization notes recorded some drawing confirmations as conditional or hidden for specific runs. This indicates live conditional behavior may have changed or depends on state not yet mapped. The prototype preserves the currently observed labels but does not claim the activity-to-confirmation rules are authoritative.
