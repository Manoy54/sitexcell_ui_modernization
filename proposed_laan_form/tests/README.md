# Prototype checks

The deterministic Playwright simulation suite exercises the isolated proposed
LAAN form without authentication, production requests, or external submission.
It covers required-field recovery, valid ready-state progression, date
validation, keyboard Site search, upload failure/replacement/removal behavior,
and phone-width operability.

Run it with:

```text
npm run test:prototype:playwright
```

The suite is serial by design and writes its sanitized Playwright report to
`proposed_laan_form/.test-artifacts/proposed-laan-results.json`. The existing
live LAAN suite under `tests/laan-request/live/` remains the regression source
of truth for the external form.
