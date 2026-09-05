# Access Requests Findings Register

This is the canonical evidence-backed findings register. Do not add a recommendation here without a reproducible result or an explicitly approved business decision.

## Finding template

```markdown
## F-AR-XXX — Short title

- Category: defect | friction | duplication | ambiguity | business decision
- Affected steps/fields:
- Source cases:
- Severity: Blocker | High | Medium | Low
- Confidence: High | Medium | Low
- Status: Open | Confirmed | Resolved | Rejected | Blocked

### Reproduction

1.
2.
3.

### Expected

### Observed

### Evidence

### Impact

### Likely root cause

### Affected branches

### Related recommendations

### Follow-up owner and decision needed
```

## Rules

- Consolidate repeated symptoms under one root finding.
- Preserve every affected test-case reference.
- Keep raw reports and authenticated artifacts out of this file.
- Sanitize screenshots, copied values, and notes before committing.

## Current execution note — 2026-09-05

Current evidence run: `test-The-CRM-Carpenters-000124-20260905T080659244Z`

The complete serial baseline declared 34 browser cases and executed 32. It
recorded two direct failures, six browser blockers, and one not-applicable
outcome. Focused reruns reproduced upload/state loss in U04 and R03 after
test-side corrections cleared B05 and TC-AR-005/006. No final submission was
attempted.

The remaining live behavior is not silently promoted to a product finding:
U04 clears unrelated Step 7 files `input_3_128` and `input_3_42` after an
oversized-file rejection, while R03 clears `field_3_444` and `input_3_44` after
validation. Both require product-owner confirmation of the intended upload
retention contract before a finding is opened.

The upload and document gaps are recorded as blockers in the consolidated
report: accepted type and size contracts are absent, upload confirmations are
not field-associated, removal controls are not identifiable, and no
request-specific document field is present in the captured branch. These are
not silently promoted to product findings.

## Focused exploratory execution note — 2026-09-05

Focused evidence run: `test-The-CRM-Carpenters-000134-20260905T141421125Z`

The authenticated run executed all 16 person, copy/reuse, and cross-workflow
probes plus authentication. It recorded two characterization passes and 14
explicit blockers, with no assertion failures and no final submission attempt.

## F-AR-001 — Returning-person and role-reuse capability is unavailable externally

- Category: business decision
- Affected steps/fields: Step 3 person identity, contact, company, role, and address fields
- Source cases: `TC-AR-P01`–`P05`
- Severity: Medium
- Confidence: High
- Status: Blocked

### Reproduction

1. Open the authenticated Access Request and select the dedicated synthetic Site.
2. Navigate to Step 3 without submitting.
3. Enter and edit synthetic person details, then inspect visible controls and
   actions for returning-person or role-reuse behavior.

### Expected

If returning-person reuse is supported, an explicit source and its editable,
fresh, role-eligible fields must be externally identifiable.

### Observed

Synthetic first-time entry and editing worked in `P01` and `P04`. No explicit
returning-person selector, known-person source, or same-person role-reuse
affordance was visible for `P02`, `P03`, or `P05`.

### Evidence

Focused run `test-The-CRM-Carpenters-000134-20260905T141421125Z`: `P01` and
`P04` retained synthetic manual values; `P02`, `P03`, and `P05` recorded
owner-linked blockers. See
[`access-request-exploratory-results.json`](./access-request-exploratory-results.json).

### Impact

Users must currently repeat visible person details, and the tester cannot
establish identity ownership, freshness, or permitted role reuse externally.

### Likely root cause

The public form exposes manual person fields but no externally identifiable
person-source contract. The source may be absent, unavailable to this account,
or intentionally out of scope; external evidence cannot distinguish these.

### Affected branches

Step 3 first-time entry, returning-person entry, known-person freshness, edited
details, and one person appearing in multiple roles. Related cases: `C01`–`C08`
and `X01`–`X03`.

### Related recommendations

`R-AR-001`.

### Follow-up owner and decision needed

Product and operations/data must define the authoritative person source,
freshness, editable fields, and permitted role reuse.

## F-AR-002 — No explicit copy/reuse affordance is visible on Step 3

- Category: friction
- Affected steps/fields: Step 3 person, address, company, and contact fields
- Source cases: `TC-AR-C01`–`C08`
- Severity: Medium
- Confidence: High
- Status: Blocked

### Reproduction

1. Open the authenticated Access Request and navigate to Step 3 with synthetic data.
2. Inspect visible buttons, links, checkboxes, radios, and labelled controls for
   copy, reuse, same-as, or duplicate actions.
3. Do not infer behavior from hidden fields or activate unrelated controls.

### Expected

Copy behavior, when supported, must expose an explicit source-target action and
preserve editability, source isolation, unrelated values, and exclusions.

### Observed

None of the eight probes found an explicitly labelled copy, reuse, same-as, or
duplicate control. The tests did not infer hidden behavior or click unrelated
controls.

### Evidence

Focused run `test-The-CRM-Carpenters-000134-20260905T141421125Z`: all eight
`C*` probes completed technically and recorded `BLOCKED`, with a responsible
product/business owner and zero submit attempts. See
[`access-request-exploratory-results.json`](./access-request-exploratory-results.json).

### Impact

Repeated fields remain manual and copy correctness cannot be tested without
visible UI and approved source-target rules.

### Likely root cause

No explicit copy/reuse interaction is exposed in the observed Step 3 branch,
and there is no approved source-target decision table. External testing cannot
determine whether this is an omitted feature or intentional design.

### Affected branches

Individual, address, and company/contact duplication; copied-value equality and
editability; source isolation; unrelated-value preservation; and prohibited
reuse. Related cases: `P01`–`P05` and `E10`.

### Related recommendations

`R-AR-002`.

### Follow-up owner and decision needed

Product/business must approve source-target pairs, editability, isolation,
preservation, and forbidden-reuse rules.

## F-AR-003 — Cross-workflow reuse lacks shared authority and fixture context

- Category: business decision
- Affected steps/fields: Access Request Step 1 and LAAN Steps 1–2
- Source cases: `TC-AR-X01`–`X03`
- Severity: Medium
- Confidence: High
- Status: Blocked

### Reproduction

1. Open Access Request Step 1 and inventory visible Site and LAAN-labelled controls.
2. Open the external LAAN workflow and inventory only visible labelled controls.
3. Compare visible Site labels and candidate concept names without comparing
   hidden identifiers or asserting semantic equivalence.

### Expected

Cross-workflow consistency requires approved semantic mappings, the same
synthetic Site identity, and a comparable duplicate-entry measurement method.

### Observed

The probes identified Site and project/LAAN candidate label groups, but did not
assert equivalence. The configured labels differ: Access Request exposed
`The CRM Carpenters Test`, while the configured LAAN target `siteXcell Pty Ltd`
was not visible. No approved human-effort protocol was available.

### Evidence

Focused run `test-The-CRM-Carpenters-000134-20260905T141421125Z`: two candidate
concept groups were observed; Access Request exposed `The CRM Carpenters Test`
while the configured LAAN target `siteXcell Pty Ltd` was not visible.
`X01`–`X03` remained owner-linked blockers.
See [`access-request-exploratory-results.json`](./access-request-exploratory-results.json).

### Impact

Cross-workflow reuse and efficiency cannot be validated without conflating
different Sites or inventing field ownership.

### Likely root cause

The workflows use separate synthetic fixtures and expose no approved mapping or
shared data-owner contract. The absence of a human comparison protocol also
prevents a defensible duplicate-effort measurement.

### Affected branches

Access Request Step 1, LAAN Steps 1–2, cross-workflow Site consistency,
candidate prefill/reuse fields, and manual-effort comparison. Related case:
`E10`.

### Related recommendations

`R-AR-003`.

### Follow-up owner and decision needed

Product and operations/data must approve semantic ownership and an aligned
synthetic Site; QA must approve the comparison protocol.

## Historical execution note — 2026-08-29

The earlier 37-declaration later-step run was blocked at `TC-AR-001` because the target
redirected to `/` and did not render `#gform_3`. This is recorded as
`AUTH-AR-01`, not as a product finding. The 36 dependent declarations did not
run, so no Step 5–8 defect or friction finding is supported by the current
evidence. Final submission attempts remained zero.
