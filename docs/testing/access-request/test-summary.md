# Access Requests Test Summary

Status: Initial automation implemented; live execution blocked by authentication/authorization preflight.

## Run metadata

- Test period: 2026-08-26
- Repository commit: `327dd34` plus the current Access Request test slice
- Target URL: `https://co-siter.com.au/access-requests/`
- Browser and viewport: Microsoft Edge, Playwright headless default viewport
- Test account classification: approved account/session could not be confirmed
- Test Site: `The CRM Carpenters Test` (not reached)
- Safety boundary: Step 4 required-upload validation; final Submit blocked in DOM and network layers

## Results

| Suite/wave | Passed | Failed | Blocked | Inconclusive | Not applicable |
| --- | ---: | ---: | ---: | ---: | ---: |
| Core | 0 | 0 | 3 | 0 | 0 |
| Conditional and validation | 0 | 0 | 0 | 0 | 0 |
| Recovery and documents | 0 | 0 | 0 | 0 | 0 |
| Accessibility and responsive | 0 | 0 | 0 | 0 | 0 |
| Efficiency and cross-workflow | 0 | 0 | 0 | 0 | 0 |

## Highest-priority findings

No product finding is justified yet. The redirect is an execution prerequisite
block; current evidence cannot distinguish an expired session from a role or
route-access change.

## Approved recommendations

Link to `recommendations.md` entries after business review.

## Prototype gate

- Core coverage complete: No — `TC-AR-001` blocked by `AUTH-AR-01`; dependent
  `TC-AR-003` and `TC-AR-004` did not run
- Relevant branch coverage complete: No
- Validation/recovery/upload evidence complete: No
- Accessibility/responsive evidence complete: No
- Efficiency evidence complete: No
- Business approvals complete: No
- Prototype approved: No

## Open risks and decisions

- `AUTH-AR-01`: refresh and verify the approved Access Request test-account session.
- `BOUNDARY-AR-01`: approve or reject automated traversal beyond Step 4; Step 8
  ready-to-submit coverage is currently prohibited.
- Confirm the exact field/option/branch map after authentication is restored.
- Approve upload types, limits, synthetic fixtures, and traversal boundary before
  any file is transmitted.
- Approve person/document ownership, validity, editability, and provenance rules
  before reuse or copy cases become acceptance tests.
- Provide a shared Site fixture or mapping before cross-workflow consistency is asserted.
