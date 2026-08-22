# Domain Docs

How the engineering skills should consume this repo's domain documentation when exploring the codebase.

## Before exploring, read these

- **`CONTEXT.md`** at the repo root or docs folder (if it exists)
- **`docs/adr/`** — read ADRs that touch the area you are about to work in
- **`docs/PROJECT_STRUCTURE_OPTIMIZATION.md`** — repository structure and rendering pipeline
- **`docs/21ST_DEV_DESIGN_REFERENCES.md`** — design system specifications and styling reference

If any of these files do not exist yet, **proceed silently**. The `/domain-modeling` skill (reached via `/grill-with-docs`) creates them lazily when terms or architectural decisions get resolved.

## File Structure (Single-Context Repo)

```
wp-content/plugins/sitexcell-ui-prototype/
├── CONTEXT.md (optional)
├── docs/
│   ├── adr/
│   ├── agents/
│   │   ├── issue-tracker.md
│   │   └── domain.md
│   ├── PROJECT_STRUCTURE_OPTIMIZATION.md
│   └── 21ST_DEV_DESIGN_REFERENCES.md
```

## Use the Domain Vocabulary

When outputting issue titles, refactor proposals, component definitions, or test plans, preserve SiteXcell branding, proof points (`8,000+`, `6,500+`, `>$9M`, `100+`), and documented terminology.
