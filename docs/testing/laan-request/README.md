# LAAN Request testing and modernization

This directory contains the evidence, design notes, and test contracts for the LAAN Request modernization. The current UI prototype has been removed; browser tests live under `tests/laan-request/`.

## Test tiers

| Tier | Location | Purpose | Default? |
| --- | --- | --- | --- |
| Live core | `tests/laan-request/live/core/` | Characterizes the authenticated external Gravity Forms LAAN workflow | No; explicit and guarded |
| Live Wave 2 | `tests/laan-request/live/wave2/` | Exercises validation, date boundaries, uploads, reload recovery, keyboard flow, responsive behavior, and activity variants | No; explicit and guarded |

## Commands

```text
npm run test:laan:live
npm run test:laan:live:wave2
npm run test:laan:live:gates
npm run test:laan:live:refresh
npm run build:css
```

Set `WP_BASE_URL` when the local WordPress site does not use the default `http://sitexcell.local`. Set `WP_LAAN_PATH` when the WordPress page uses a different route.

Live tests require an authenticated Edge CDP session or an ignored Playwright storage-state file. They retain the final-submission network guard and must never be treated as ordinary unit tests.

The live Site fixture defaults to the non-submitting `siteXcell Pty Ltd` context (`4127303000002387166`). Override both values together with `LAAN_TEST_SITE_LABEL` and `LAAN_TEST_SITE_ID` when the approved live fixture changes. The shared helper can mirror that exact option from Gravity Forms backing field `input_1_85` when the required public Site selector is rendered empty; it never selects an arbitrary Site.

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

The detailed research outputs are in `findings.md`, `field-matrix.md`, `validation-plan.md`, `wave-2-validation.md`, and [`test-case-matrix.md`](test-case-matrix.md). The matrix is the acceptance contract for deciding whether a future implementation is actually desirable.
