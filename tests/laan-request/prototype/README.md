# Improved LAAN Request prototype

This is an isolated, local, non-submitting prototype based on the LAAN findings. It does not connect to WordPress, Gravity Forms, authentication, production records, or the external LAAN form.

## Run it

From the repository root:

```powershell
npm run prototype:serve
```

Open `http://127.0.0.1:4174/`.

Run the separate prototype tests:

```powershell
npm run test:prototype
```

## Improvements represented

- Original request-context order and familiar field labels are retained.
- Site selection supports Owner filtering and search by Site, address, owner, or canonical ID.
- Selected Site context is visible for review.
- Impossible dates are rejected inline before Stage 2.
- Stage 2 includes a read-only request-context summary and an explicit edit action.
- Activity-specific confirmation behavior is progressively disclosed without silently clearing values.
- Required and optional uploads use consistent status feedback.
- Removing the required LAAN file clears its dependent confirmation.
- Draft save/restore/discard is simulated in memory only.
- The ready-to-submit state is visible, but the real submit action is disabled.
- Keyboard, phone, and tablet paths are covered by separate prototype tests.

## Deferred production decisions

Authoritative data sources, conflict precedence, upload type/size rules, draft retention and security, activity business rules, and the malformed-date WordPress failure still require production-owner decisions and implementation outside this prototype.
