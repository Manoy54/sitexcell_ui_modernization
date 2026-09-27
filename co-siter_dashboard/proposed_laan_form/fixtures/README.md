# Synthetic fixtures

Prototype fixture inputs belong here. `laan-fixtures.js` contains the captured LAAN activity, owner, and Site choices now used by the isolated prototype. `prototype-fixtures.js` and `site-context.example.js` are committed synthetic examples. `site-context.js` is an ignored local snapshot for private inspection only; it must never be committed, deployed, or treated as a production data store.

The captured choices include 53 owner entries (including the empty prompt) and 297 Sites. They do not include owner-to-Site relationships, so the prototype's Site search remains unfiltered when an owner is selected. Refresh and review the snapshot against the authenticated form before treating it as current.

Real Site names, addresses, owners, IDs, and notes must be reviewed before distribution. The native WordPress implementation stores approved Site Notes to Carriers in the managed `LAAN Sites` records.

The fixture set must cover normal and edge states for activities, Sites, dates, uploads, declarations, recovery, and drafts. Existing live-test fixtures under `tests/laan-request/fixtures/` remain unchanged and are not copied into the prototype automatically.
