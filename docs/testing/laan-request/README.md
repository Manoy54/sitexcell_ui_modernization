# LAAN Request testing and modernization

This directory contains the evidence, design notes, and test contracts for the LAAN Request UI modernization. The production-facing prototype surface lives under `pages/laan-request/`; browser tests live under `tests/laan-request/`.

## Test tiers

| Tier | Location | Purpose | Default? |
| --- | --- | --- | --- |
| Prototype | `tests/laan-request/prototype/` | Isolated local behavioral reference with no WordPress, authentication, persistence, or submission | Yes, through `npm test` |
| WordPress | `tests/laan-request/wordpress/` | Verifies the parent plugin route, semantic selectors, two-stage flow, date rejection, and non-submission boundary | No; run explicitly |
| Live core | `tests/laan-request/live/core/` | Characterizes the authenticated external Gravity Forms LAAN workflow | No; explicit and guarded |
| Live Wave 2 | `tests/laan-request/live/wave2/` | Exercises validation, date boundaries, uploads, reload recovery, keyboard flow, responsive behavior, and activity variants | No; explicit and guarded |

## Commands

```text
npm test
npm run test:laan:prototype
npm run test:laan:wordpress
npm run test:laan:live
npm run test:laan:live:wave2
npm run test:laan:live:refresh
npm run build:css
```

Set `WP_BASE_URL` when the local WordPress site does not use the default `http://sitexcell.local`. Set `WP_LAAN_PATH` when the WordPress page uses a different route.

Live tests require an authenticated Edge CDP session or an ignored Playwright storage-state file. They retain the final-submission network guard and must never be treated as ordinary unit tests.

## Safety boundary

Synthetic values and synthetic documents are used by default. No test should submit a LAAN request, create a draft, alter a production record, or commit authentication state. Generated reports and browser artifacts belong under `.test-artifacts/` and are ignored by Git.

## Modernization contract

- Preserve the two-stage request-context and access-details workflow.
- Reject impossible dates inline while preserving entered context.
- Keep the Page 2 request-context summary synchronized.
- Keep upload feedback and required confirmations explicit.
- Use semantic `data-testid` selectors for new UI code.
- Retain `data-original-id` mappings for Gravity Forms field compatibility.
- Keep final submission disabled until an explicitly authorized integration exists.

The detailed research outputs are in `findings.md`, `field-matrix.md`, `validation-plan.md`, and `wave-2-validation.md`.
