# Access Request form analysis

Analyzed URL: `https://co-siter.com.au/access-requests/`

The page contains Gravity Form `gform_3`, an eight-step POST form. The final
submission control is `#gform_submit_button_3` and is present only on Step 8.
The automated test never navigates beyond Step 4. Gravity Forms uses POST for
normal transitions between steps, so the network guard allows those transitions
but blocks any final submission originating from Step 8.

## Observed workflow

1. LAAN linkage, owner/site selection, tenure confirmation, network emergency
   information, and Terms and Conditions acceptance.
2. Site-specific documentation requirements and acknowledgement.
3. Project, carrier, access date/time, health and safety contact, and on-site
   contact details.
4. Contractor count, contractor identity/induction information, and mandatory
   qualifications/training uploads.
5. Nature of work, isolation requirements, authority documents, permits, and
   special-access acknowledgement.
6. Technical installation, cabling, power, fire-rating, after-hours, high-risk,
   and rooftop/structure access questions.
7. SWMS review checklist plus safety, insurance, permit, and plan uploads.
8. Additional documents, declarations, invoice details, final acknowledgements,
   and the Submit button.

## Dedicated test path

The Site Name list contains `The CRM Carpenters Test`. Selecting it resolves the
test building address to `The CRM Carpenters Test Building, Redbank, QLD, 4301`.
The script uses this site exclusively.

Each run increments `.test-run-sequence` and creates a unique identifier in the
following form:

`test-The-CRM-Carpenters-000001-<UTC timestamp>`

The identifier is entered into Associated LAAN ID, Project Reference, test
contact names, and non-deliverable `example.invalid` email addresses.

## Safety boundary

- No Submit click is implemented.
- Any final POST originating from Step 8 is aborted in the browser.
- The test stops on Step 4 by intentionally verifying the mandatory upload
  validation message.
- No file is uploaded and Save and Continue Later is not clicked.

## Revalidation on 2026-08-26

The available Playwright storage state and the connected Edge session were both
checked against the documented URL. In both cases, requesting
`/access-requests/` redirected to `/`, where `#gform_3` was not rendered. The
core execution therefore stopped at the authentication/authorization preflight.
No form values were entered and no submission was attempted.

This is classified as `BLOCKED`, not as a product defect or a passing test. The
current evidence does not distinguish an expired/invalid test session from a
role or route-access change. A refreshed approved test-account session is
required before live behavior can be characterized again.

## Plan reconciliation

- The approved automated boundary is Step 4, while `TC-AR-006` asks for the
  Step 8 ready-to-submit state. `TC-AR-006` is blocked until a later boundary is
  explicitly approved; the network guard is not approval to traverse Steps 5-8.
- The original case matrix omitted the one-click copy cases (`TC-AR-C*` and
  `TC-AR-E10`) already required by `access-request.md`, and did not assign IDs
  to branch, recovery, upload-state, accessibility, or responsive coverage.
- Person reuse, saved-document reuse, and cross-workflow prefill are not known
  capabilities of the current Gravity Forms workflow. Those cases must begin as
  characterization or decision cases, not acceptance tests for an assumed UI.
- The LAAN suite and Access Request suite currently use different dedicated
  Sites. Cross-workflow Site consistency cannot be asserted until a shared
  synthetic fixture or an approved mapping between the fixtures exists.
- Automated browser duration is useful for regression comparison but is not a
  defensible human-effort baseline by itself. Efficiency claims require at
  least three comparable human sessions or an approved equivalent protocol.
