# Synthetic fixtures

Prototype fixture inputs belong here. `laan-fixtures.js` contains the captured LAAN activity, owner, and Site choices now used by the isolated prototype. `prototype-fixtures.js` and `site-context.example.js` are committed synthetic examples. `site-context.js` is an ignored local snapshot for private inspection only; it must never be committed, deployed, or treated as a production data store.

The 27 September 2026 authenticated form capture includes 54 owner entries (including the empty prompt), 301 Sites, and each owner's filtered Site IDs. Some owners have no Sites in the live filter, and some Sites appear only in the complete list. The prototype mirrors both cases. This is a dated snapshot, not a live source of truth.

Real Site names, addresses, owners, IDs, and notes must be reviewed before distribution. The native WordPress implementation stores approved Site Notes to Carriers in the managed `LAAN Sites` records.

The fixture set must cover normal and edge states for activities, Sites, dates, uploads, declarations, recovery, and drafts. Existing live-test fixtures under `tests/laan-request/fixtures/` remain unchanged and are not copied into the prototype automatically.
