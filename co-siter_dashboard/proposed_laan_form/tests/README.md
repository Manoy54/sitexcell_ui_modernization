# Prototype checks

The deterministic Playwright simulation suite exercises the isolated proposed
LAAN form without authentication, production requests, or external submission.
It covers required-field recovery, valid ready-state progression, configured
date boundaries, keyboard Site search, draft recovery, upload failure,
replacement/removal and multi-file behavior, readiness synchronization, and
phone-width operability.

Run it with:

```text
npm run test:prototype:playwright
```

The suite is serial by design and writes its sanitized Playwright report to
`co-siter_dashboard/proposed_laan_form/.test-artifacts/proposed-laan-results.json`. The existing
live LAAN suite under `tests/laan-request/live/` remains the regression source
of truth for the external form. Boundary simulations can provide validated
`minDate` and `maxDate` query parameters in `DD-MM-YYYY` format.
