# Proposed LAAN Form

This directory is the isolated planning and prototype boundary for the improved LAAN request form.

The native WordPress implementation contract is maintained in [`docs/LAAN_WORDPRESS_READINESS.md`](../docs/LAAN_WORDPRESS_READINESS.md). Any future UI or rule change must be checked against that document before it is promoted into the WordPress page.

## Current status

Runnable throwaway UI prototype. Its local server remains isolated from production: it has no production route, backend submission, record creation, or notification. The approved interaction code is copied into the WordPress-owned `assets/js/laan-request.js` implementation during promotion.

Run it from the repository root:

```text
npm run prototype:laan
```

Then open `http://127.0.0.1:4177/`.

The same non-submitting prototype can also render inside the shared Co-Siter WordPress demo shell at `/sitexcell-portal-requests-prototype/?view=laan`. That route uses the existing fields and stages, begins blank, and does not use the native `/laan-request/` submission handler. See [`docs/COSITER_WORDPRESS_PROTOTYPE.md`](../docs/COSITER_WORDPRESS_PROTOTYPE.md).

Open Page 2 directly at `http://127.0.0.1:4177/?step=2`. The selected layout uses the original vertical form flow and preserves the Request workspace on the right.

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

The reference dashboard remains the selected shell. Page 2 is informed by a direct live-form inspection and uses the original vertical field sequence with the persistent Request workspace rail. See `docs/page-two-live-map.md` for the measured source map and tradeoff analysis.
