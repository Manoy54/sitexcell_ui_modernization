# Access Request prototype

This is an isolated, non-submitting prototype of the eight-stage Co-Siter
Access Request. It uses fictional records and browser-tab session state. It
does not authenticate, call the production provider, upload files, send
notifications, or create a real request.

## Run

```powershell
npm.cmd run prototype:access
```

Open `http://127.0.0.1:4178/`. Use **Load complete scenario** to inspect the
review state without entering every synthetic field.

The same form also renders inside the shared Co-Siter WordPress demo shell at `/sitexcell-portal-requests-prototype/?view=access`. That route begins blank, retains the existing stages and field behavior, and does not submit. See [`docs/COSITER_WORDPRESS_PROTOTYPE.md`](../docs/COSITER_WORDPRESS_PROTOTYPE.md).

## Verify

```powershell
npm.cmd run test:prototype:access
```

The unit suite covers the state model, hostile session/request rejection and
live-regression proposals, including the complete captured Owner/Site option
map and notes-guided multi-file qualification upload state. The browser suite
covers the public workflow, keyboard Owner/Site selection, validation focus,
non-submission, local and saved document states, replacement preservation,
responsive reflow and a 200% zoom equivalent.

## Evidence boundary

- Original field identities are retained as `data-original-id` attributes on
  the rendered semantic controls.
- The full 264-row / 392-control source inventory remains in
  `docs/testing/access-request/prototype/field-disposition-plan.json`.
- Prototype rules are demonstrations, not approved production business rules.
- A recorded prototype PASS requires an explicit named automated check;
  available demonstrations and unrun measurements remain visibly distinct.
- A local pass does not change the recorded live results for U04 or R03.
