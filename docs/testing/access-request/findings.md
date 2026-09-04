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

## Current execution note — 2026-09-04

Current evidence run: `test-The-CRM-Carpenters-000107-20260904T084003226Z`

The complete serial baseline executed 34 browser cases. It recorded five
failed statuses for triage and five explicit execution/decision blockers. The
focused reruns confirmed B05 and TC-AR-006 after their test-side corrections,
but reproduced upload/state loss in U04 and R03. TC-AR-005 also passed after
its snapshot oracle was corrected. No final submission was attempted.

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

## Historical execution note — 2026-08-29

The earlier 37-declaration later-step run was blocked at `TC-AR-001` because the target
redirected to `/` and did not render `#gform_3`. This is recorded as
`AUTH-AR-01`, not as a product finding. The 36 dependent declarations did not
run, so no Step 5–8 defect or friction finding is supported by the current
evidence. Final submission attempts remained zero.
