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

## Current evidence run — 2026-09-06

Current evidence run: `test-The-CRM-Carpenters-000143-20260906T033946832Z`

The complete serial 50-declaration baseline executed against the approved
authenticated session, with authentication and Step 5 readiness prerequisites.
It produced 50 executed browser cases, 7 acceptance passes, 27
characterizations, 3 measurements, 3 direct failures, 20 browser blockers, and
1 NOT APPLICABLE outcome. No final submission was attempted. The full Steps 1–8
field map and field/rule ledger remain synchronized to the evidence baseline.

U04 and R03 retain reproducible upload/state-preservation failures. A01 also
fails because two radio controls were not keyboard reachable. A02 passed in the
final run after a focused rerun also passed. B05 and B08 remain blocked because
the current branch did not expose mapped controllers; U03, U05, U06, and D04
remain explicit contract/UI blockers rather than product failures. Derived E06,
E08, and E09 inherit direct failures without another browser traversal.

Focused reruns: B05 passed in `test-The-CRM-Carpenters-000108-20260904T100021457Z`;
TC-AR-006 and TC-AR-005 passed in `test-The-CRM-Carpenters-000111-20260904T100339097Z`
and `test-The-CRM-Carpenters-000114-20260904T103046340Z`; U04 failed with
unrelated files cleared in `test-The-CRM-Carpenters-000116-20260904T103935027Z`;
R03 failed with unrelated files cleared in
`test-The-CRM-Carpenters-000118-20260904T120742537Z`.

Focused exploratory run
`test-The-CRM-Carpenters-000134-20260905T141421125Z` executed all 16 new
observation-only probes plus authentication. `P01` and `P04` passed as
characterizations of manual synthetic entry and editability. `P02`, `P03`, and
`P05` were blocked because no explicit returning-person or role-reuse source was
visible and authority rules are unavailable. All eight `C*` cases were blocked
because no explicit copy/reuse affordance was visible. `X01` and `X03` captured
Site and project/LAAN candidate concepts without asserting equivalence; `X02`
recorded that the configured labels differ and the LAAN target label was not
visible. The focused result contains 14 blockers, no failures, and zero
submission attempts.

The identifier is entered into Associated LAAN ID, Project Reference, test
contact names, and non-deliverable `example.invalid` email addresses.

## Safety boundary

- No Submit click is implemented.
- Any final POST originating from Step 8 is aborted in the browser.
- The core diagnostic baseline stops on Step 4.
- The Steps 5–8 suite may use approved synthetic uploads and stop on Step 8 with
  final Submit visible but untouched.
- Save and Continue Later is not clicked.

## Historical revalidation on 2026-08-29

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
