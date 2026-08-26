# Access Requests Test Summary

Status: Core authenticated slice executed successfully; approved expansion cases remain to be implemented.

## Run metadata

- Test period: 2026-08-26
- Repository commit: `9ab6421` plus the current Site-derived assertion correction
- Target URL: `https://co-siter.com.au/access-requests/`
- Browser and viewport: Microsoft Edge, Playwright headless default viewport
- Test account classification: approved authenticated session
- Test Site: `The CRM Carpenters Test`
- Safety boundary: Step 2 for the current core slice; final Submit blocked in DOM and network layers

## Results

| Suite/wave | Passed | Failed | Blocked | Inconclusive | Not applicable |
| --- | ---: | ---: | ---: | ---: | ---: |
| Core | 3 | 0 | 0 | 0 | 0 |
| Conditional and validation | 0 | 0 | 0 | 0 | 0 |
| Recovery and documents | 0 | 0 | 0 | 0 | 0 |
| Accessibility and responsive | 0 | 0 | 0 | 0 | 0 |
| Efficiency and cross-workflow | 0 | 0 | 0 | 0 | 0 |

## Highest-priority findings

The documented building-context expectation was corrected after observation: the
Site selection populates hidden field `input_3_9` during the Step 1 to Step 2
transition; it does not render the address as visible text on Step 1.

## Approved recommendations

Link to `recommendations.md` entries after business review.

## Prototype gate

- Core coverage complete: No — `TC-AR-001` blocked by `AUTH-AR-01`; dependent
  `TC-AR-003` and `TC-AR-004` did not run
- Relevant branch coverage complete: No
- Validation/recovery/upload evidence complete: No
- Accessibility/responsive evidence complete: No
- Efficiency evidence complete: No
- Business approvals complete: Yes (recorded in the execution thread)
- Prototype approved: No

## Open risks and decisions

- `AUTH-AR-01`: refreshed session is valid for the current run; refresh again if
  the form redirects to the home page.
- `BOUNDARY-AR-01`: Steps 5–8 and synthetic uploads are approved, but the
  corresponding expansion cases are not yet implemented.
- Confirm the exact field/option/branch map after authentication is restored.
- Upload types, limits, synthetic fixtures, and traversal boundary are approved;
  confirm the live field-level restrictions while implementing the upload wave.
- Person/document ownership, validity, editability, and provenance rules are
  approved; implement reuse cases against synthetic records only.
- The shared Site mapping is approved; cross-workflow assertions still need their
  fixture adapter.
