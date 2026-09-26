# Reference Image Analysis

## Sources

The Page 2 source of truth is an authenticated live-form inspection completed on 2026-08-25 at a 1361 x 636 viewport with a final-submission guard. See `page-two-live-map.md` for the measured map.

- `docs/laanreq_prototype_ref/step1.png` — 821 × 626 cropped Page 1 form panel
- `docs/laanreq_prototype_ref/step2, with the whole dashboard design reference.png` — 1361 × 636 dashboard shell and workspace reference

## Measured dashboard geometry

| Element | Reference target | Selected dashboard at 1361 px | Selected dashboard at 1920 px |
| --- | ---: | ---: | ---: |
| Sidebar | 209 px | 209 px | 209 px |
| Top header | 50 px | 50 px | 50 px |
| Request workspace | 236 px | 286 px | 360 px |
| Main form | approximately 798 px | 810 px | 1220 px |
| Activity control | approximately 390 × 33 px | 394 × 42 px | 599 × 42 px |
| Date control | approximately 274 × 33 px | 394 × 42 px | 599 × 42 px |
| Owner and Site controls | approximately 390 × 33 px | 394 × 42 px | 599 × 42 px |
| Terms panel | approximately 798 × 158 px | 810 × 230 px | 1220 × 230 px |

## Visual mapping

- Charcoal header: `#2c3141`
- Header rule: `#e23152`
- Primary red: `#f5284d`
- Workspace surface: `#f5f7f9`
- Progress blue: `#278abe`
- White sidebar and form canvas
- Compact Geist/Segoe UI typographic scale
- Thin neutral control borders and small-radius controls
- Existing Co-Siter wordmark treatment recreated as prototype text, not a production brand asset

## Interpretation

The cropped image defines Page 1's internal hierarchy, Terms and Conditions treatment, and primary action. The full-width image defines the application shell, navigation, header, form workspace, and live request-summary rail. The authenticated live inspection now defines Page 2; the earlier Page 2 implementation was only an extrapolation because no Page 2 image had been supplied.

The reference dashboard remains selected. Both pages keep the responsive form canvas and Request workspace. Page 2 preserves the live form's vertical sequence in the main column while the helper rail stays visible on the right. At the reference viewport the form column scrolls internally; this is the necessary tradeoff for retaining the original orientation and all required content without shrinking the workspace.
