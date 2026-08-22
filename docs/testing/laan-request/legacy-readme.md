# SiteXcell request tests

This workspace contains non-submitting Playwright analysis for SiteXcell request workflows.

## Current state

- The LAAN Request suite is implemented under `test_scripts/lan-request/`.
- Access Request requirements and the earlier eight-step form analysis are documented in `docs/ACCESS_REQUEST.md` and `ACCESS_REQUEST_ANALYSIS.md`.
- Access Request automation has not been implemented yet.
- Default automated coverage must stop before final submission.

Test code is grouped as follows:

```text
test_scripts/lan-request/core/   # 3 core tests
test_scripts/lan-request/wave2/  # 13 Wave 2 tests
test_scripts/lan-request/        # shared helpers, fixtures, and Playwright configs
```

## Install

```powershell
npm install
```

## Run LAAN tests

Run the core regression with the stored authenticated session:

```powershell
npm test
```

Run the focused Wave 2 suite:

```powershell
npm run test:lan:wave2
```

Run the valid commencement-date boundary checks:

```powershell
npm run test:lan:date-boundaries
```

Refresh the authenticated session when required:

```powershell
npm run session:setup
```

For a visible Edge run, use one of the focused `test:lan:*` commands or `run-edge-lan-test.ps1`.

## View results

```powershell
npm run results:serve
```

Open `http://127.0.0.1:4173/` to view the latest report in `test case result/playwright-results.json`.

The current inventory is 3 core tests plus 13 Wave 2 tests, for 16 executable test cases. Parameterized activity, date, and viewport checks run as consolidated matrix tests. All automated cases stop before final submission.

## Safety boundary

- Use only synthetic or approved sanitized values and documents.
- Keep the network-level final-submission guard enabled.
- Do not add submission, draft creation, or other persistent actions without separate authorization and an approved environment.
