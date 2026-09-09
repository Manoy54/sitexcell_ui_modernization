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

## Verify

```powershell
npm.cmd run test:prototype:access
```

The unit suite covers the state model and live-regression proposals. The
browser suite covers the public workflow, keyboard Site selection, validation
focus, non-submission, document replacement preservation, and phone reflow.

## Evidence boundary

- Original field identities are retained as `data-original-id` attributes on
  the rendered semantic controls.
- The full 264-row / 392-control source inventory remains in
  `docs/testing/access-request/prototype/field-disposition-plan.json`.
- Prototype rules are demonstrations, not approved production business rules.
- A local pass does not change the recorded live results for U04 or R03.
