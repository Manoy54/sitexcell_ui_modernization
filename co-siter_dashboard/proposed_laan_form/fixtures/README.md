# Synthetic fixtures

Prototype fixture inputs belong here. `prototype-fixtures.js` and `site-context.example.js` are committed synthetic inputs used by the isolated prototype. `site-context.js` is an ignored local snapshot for private inspection only; it must never be committed, deployed, or treated as a production data store.

Real Site names, addresses, owners, IDs, and notes must be reviewed before distribution. The native WordPress implementation stores approved Site Notes to Carriers in the managed `LAAN Sites` records.

The fixture set must cover normal and edge states for activities, Sites, dates, uploads, declarations, recovery, and drafts. Existing live-test fixtures under `tests/laan-request/fixtures/` remain unchanged and are not copied into the prototype automatically.
