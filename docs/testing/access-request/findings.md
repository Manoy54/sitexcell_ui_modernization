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
