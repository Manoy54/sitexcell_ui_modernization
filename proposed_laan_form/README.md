# Proposed LAAN Form

This directory is the isolated planning and prototype boundary for the improved LAAN request form.

## Current status

Runnable throwaway UI prototype. It remains isolated from production: no production route, backend submission, record creation, notification, or WordPress hook is connected.

Run it from the repository root:

```text
npm run prototype:laan
```

Then open `http://127.0.0.1:4177/`.

## Compatibility promise

- Preserve the current two-stage LAAN form.
- Preserve field order, labels, declarations, primary actions, and recognizable visual language.
- Add only targeted improvements for validation, recovery, Site lookup, uploads, context, accessibility, and responsive behavior.
- Use synthetic data and a simulated ready-to-submit state.
- Never submit to the production LAAN workflow.

## Directory map

| Directory | Responsibility |
| --- | --- |
| `docs/` | Approved planning, state, field, and acceptance documents |
| `fixtures/` | Synthetic sites, contacts, dates, and upload metadata |
| `src/` | Future isolated prototype implementation |
| `src/components/` | Future form components that preserve the current structure |
| `src/scripts/` | Future state and interaction logic |
| `src/styles/` | Future scoped prototype styles |
| `assets/` | Future prototype-only visual assets |
| `tests/` | Future prototype-specific checks |

The existing live LAAN tests under `tests/laan-request/live/` remain the external regression suite and are not moved or duplicated here.

## Selected direction

The reference dashboard formerly identified as Variant A is the selected interface. Comparison variants and the floating switcher have been removed from the active artifact. The selected layout keeps the reference dashboard identity while allowing the form and Request workspace to scale for larger screens.
