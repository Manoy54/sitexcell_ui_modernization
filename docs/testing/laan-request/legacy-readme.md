# SiteXcell request tests

This workspace contains non-submitting Playwright analysis for SiteXcell request workflows.

## Current state

- The LAAN Request suite is implemented under `tests/laan-request/live/`.
- Access Request requirements and the earlier eight-step form analysis are documented in `docs/ACCESS_REQUEST.md` and `ACCESS_REQUEST_ANALYSIS.md`.
- Access Request automation has not been implemented yet.
- Default automated coverage must stop before final submission.

Test code is grouped as follows:

```text
tests/laan-request/live/core/   # 3 core tests
tests/laan-request/live/wave2/  # Expanded Wave 2 tests
tests/laan-request/             # shared helpers, fixtures, and Playwright configs
```

## Install

```powershell
npm install
```

## Run LAAN tests

Run the core regression with the stored authenticated session:

```powershell
npm run test:laan:live
```

Run the focused Wave 2 suite:

```powershell
npm run test:laan:live:wave2
```

Run the valid commencement-date boundary checks:

```powershell
npm run test:laan:live:date-boundaries
```

Refresh the authenticated session when required:

```powershell
npm run session:setup
```

For a visible Edge run, use one of the focused `test:laan:live:*` commands or the live session runner under `tests/laan-request/support/`.

## View results

```powershell
npm run results:serve
```

Open `http://127.0.0.1:4173/` to view the latest report in `test case result/playwright-results.json`.

The current inventory is 3 core tests plus 11 Wave 2 declarations covering 17 scenario checks. Parameterized activity, date, and viewport checks run as consolidated matrix tests. All automated cases stop before final submission.

## Safety boundary

- Use only synthetic or approved sanitized values and documents.
- Keep the network-level final-submission guard enabled.
- Do not add submission, draft creation, or other persistent actions without separate authorization and an approved environment.
