# Access Requests Recommendations Register

Recommendations become prototype requirements only after evidence and business approval are recorded.

## Recommendation template

```markdown
## R-AR-XXX — Short title

- Status: Candidate | Proposed | Approved | Rejected | Deferred
- Source findings:
- Source test cases:
- Priority: P0 | P1 | P2 | P3
- Impact: High | Medium | Low
- Evidence confidence: High | Medium | Low
- Effort: High | Medium | Low
- Owner:

### Problem

### Proposed change

### Preserve

### Dependencies and data ownership

### Risks

### Success metric and target

### Regression cases

### Prototype acceptance criteria

### Required approvals
```

## Prioritization rules

Prioritize correctness and safety first, then user/operational impact, evidence confidence, effort, and dependency readiness. Do not approve a recommendation that silently changes a business rule or data owner.
