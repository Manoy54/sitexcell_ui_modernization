# Selected LAAN Prototype Direction

## Decision

Promote the reference dashboard formerly identified as Variant A as the sole active prototype direction.

## Why it was selected

- It accurately carries the supplied Co-Siter dashboard shell and visual language.
- The persistent navigation, request header, form canvas, and Request workspace make the two-stage LAAN flow easy to understand.
- It preserves the current LAAN form identity while supporting the approved validation, recovery, upload, and readiness improvements.

## Refinement after selection

- Removed comparison Variants B and C and the floating variant switcher.
- Replaced the fixed 798 px form study with a responsive canvas up to 1220 px.
- Changed the Page 1 leading row to equal-width columns.
- Aligned Owner and Site controls to the same first-column width as the Activity control.
- Increased controls from 33 px to 42 px high.
- Increased form, helper, terms, and status typography.
- Expanded the Terms and Conditions panel to 230 px high.
- Expanded the Request workspace from 236 px to a responsive 280–360 px rail.
- Locked the desktop dashboard frame to the viewport and contained longer content inside the form/workspace panels.
- Placed the required LAAN and optional Additional Documents upload cards in one desktop row; they stack again below 860 px.
- Kept the required LAAN upload single-file and made Additional Documents a multi-file control with per-file status and removal.
- Let the two upload cards keep independent heights so a growing additional-file list does not stretch the required LAAN card.

## Page 2 study

The live Page 2 was inspected directly after the original dashboard direction was selected. That inspection showed the previous Page 2 composition was not faithful: visible technical fields and large named sections had been invented, while the real form uses a flat two-column sequence followed by uploads and four confirmations.

The selected Page 2 direction keeps the live form's vertical sequence inside the main form column and preserves the Request workspace as a persistent right rail. The compact split and three-lane comparison layouts, plus the floating switcher, were removed after selection.

The Page 2 content now shares Page 1's left inset and maximized 810 px form width at the reference viewport. Its labels and helper text use the Page 1 scale instead of the earlier compact study scale.

This deliberately accepts internal scrolling in the form column. At the measured 1361 x 636 viewport, the live Page 2 content is taller than the available panel; keeping the original vertical orientation and the helper rail makes a no-scroll layout physically impossible without shrinking or hiding required content. The Request workspace itself remains fixed and fully visible while the form scrolls independently.

## Boundary

This decision applies to the isolated prototype only. It does not authorize a production WordPress route, real submission, backend integration, or production persistence.
