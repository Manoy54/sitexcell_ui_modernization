# Access Request form analysis

Analyzed URL: `https://co-siter.com.au/access-requests/`

The page contains Gravity Form `gform_3`, an eight-step POST form. The final
submission control is `#gform_submit_button_3` and is present only on Step 8.
The core baseline stops on Step 4. The implemented Steps 5–8 suite may navigate
through the Step 8 review state after the authenticated field map is captured.
Gravity Forms uses POST for normal transitions between steps, so the network
guard allows those transitions but blocks any final submission originating from
Step 8.

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
- The core diagnostic baseline stops on Step 4.
- The Steps 5–8 suite may use approved synthetic uploads and stop on Step 8 with
  final Submit visible but untouched.
- Save and Continue Later is not clicked.

## Revalidation on 2026-08-29

The 37-declaration Steps 5–8 configuration used the saved Playwright state and
requested `/access-requests/`. It redirected to `/`, where `#gform_3` was not
rendered. A visible refresh attempt also timed out before the form appeared. The
run therefore stopped at the authentication/authorization preflight; 36
dependent declarations did not run. No form values were entered and no
submission was attempted.

This is classified as `BLOCKED`, not as a product defect or a passing test. The
current evidence does not distinguish an expired/invalid test session from a
role or route-access change. A refreshed approved test-account session is
required before live behavior can be characterized again.

## Plan reconciliation

- The approved automated boundary is now the Step 8 review state. `TC-AR-006`
  is implemented but remains blocked by authentication and the uncaptured field
  map. The network guard remains a fail-safe and never authorizes submission.
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
