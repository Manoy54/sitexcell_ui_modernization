# LAAN WordPress Readiness Contract

This document is the implementation contract for the native LAAN Request page. Every future LAAN change must preserve this boundary: the approved interface may evolve, but the page must remain a real WordPress feature that can be administered, secured, tested, and handed to developers for a later Gravity Forms integration.

## Current architecture

```text
WordPress Page: /laan-request/
        ↓
[sitexcell_laan_request]
        ↓
Plugin renderer: pages/laan-request/laan-request.php
        ↓
Production UI module: assets/js/laan-request.js
Production static form data: assets/js/laan-data.js
        ↓
Native WordPress AJAX handler
        ├── server-side validation
        ├── protected document storage
        ├── custom LAAN request table
        ├── admin request list
        └── wp_mail notifications
```

The `proposed_laan_form/` directory remains a visual and interaction reference. The production page uses the copied, WordPress-enqueued assets under `assets/`; the prototype server and fixtures must never be treated as a production submission endpoint.

## WordPress entry points

- Public shortcode: `[sitexcell_laan_request]`
- Recommended Page slug: `laan-request`
- Plugin bootstrap: `sitexcell-ui-prototype.php`
- Native implementation: `includes/laan-request.php`
- Page renderer: `pages/laan-request/laan-request.php`
- Full-viewport Page template: `pages/laan-request/template.php`
- Site registry: `LAAN Sites` custom post type
- Submission storage: the `{prefix}sitexcell_laan_requests` custom table
- Admin screens: `LAAN Sites`, `LAAN Sites → Requests`, and `LAAN Sites → Settings`

## Local setup sequence

1. Activate or reactivate the plugin so the native request table and `LAAN Sites` post type are registered.
2. On activation, the plugin creates a draft WordPress Page titled `LAAN Request` with the slug `laan-request` and the content `[sitexcell_laan_request]` if one does not already exist. Review it and publish it when ready.
3. Open `LAAN Sites → Settings` and run `Import prototype Site snapshot` for local development only.
4. Review imported records and edit any notes, links, Site IDs, addresses, or owner filters under `LAAN Sites`.
5. Configure notification recipients under `LAAN Sites → Settings`.
6. Verify the page while signed in as an approved portal user.

The importer is intentionally explicit. It must not silently turn a production-derived prototype snapshot into an operational source of truth.

## Rules for future changes

### WordPress compatibility

- Do not add a production-only route that bypasses WordPress.
- Do not make `server.mjs` or browser fixtures a production dependency.
- Enqueue scripts and styles through WordPress hooks.
- Keep production LAAN assets under `assets/`; do not make the WordPress page depend on `server.mjs` or prototype-relative module imports.
- Keep the public page renderable through the shortcode.
- Keep all PHP files protected with an `ABSPATH` check.
- Use prefixed function names, option names, table names, post types, and AJAX actions.

### Form behavior

- Keep the two-stage LAAN flow unless the business owner approves a workflow change.
- Keep the canonical field map in `proposed_laan_form/docs/field-and-rule-matrix.md` up to date.
- Validate every required field on the server, even when JavaScript already validates it.
- Reject impossible dates using the approved `DD-MM-YYYY` rule.
- A selected Site must resolve to a published LAAN Site record; never trust a display label alone.
- Removing or replacing the required document must invalidate its confirmation.
- Never report a request as submitted until WordPress confirms persistence.

### Site data

- Site ID is the stable identifier; Site name is display text only.
- Address and owner-filter values are stored as Site metadata.
- Site Notes to Carriers are edited as rich content and output with `wp_kses_post()`.
- Links in notes must retain their visible label and use safe `http`, `https`, or `mailto` URLs.
- Prototype snapshots may seed local development, but they are not a live source of truth.
- Review production-derived notes and contact details before committing or deploying imports.

### Uploads and privacy

- Accept only the approved file types and size limit after server-side MIME and size checks.
- Use WordPress upload APIs; do not call `move_uploaded_file()` directly for validation bypasses.
- Store LAAN documents in the private LAAN upload directory.
- Do not expose document URLs directly in the public page or email body.
- Keep the protected download endpoint capability-checked and nonce-protected.
- Confirm the web server denies direct access to the private directory in every deployment environment.

### Administration

- Staff must be able to edit Site name, Site ID, address, owner filter, and formatted carrier notes in WordPress.
- Staff must be able to view request ID, date, Site, activity, requester, status, and uploaded documents.
- Notification recipients must be configurable; do not hardcode operational email addresses.
- Any new admin action requires capability checks, nonce verification, input sanitization, and escaped output.

### Future Gravity Forms handoff

- Keep the canonical field names and business rules independent of the current renderer.
- Do not couple business rules to generated DOM IDs from a provider.
- A Gravity Forms adapter may replace the native handler only after the same acceptance matrix passes.
- Do not remove the native handler until the replacement has equivalent validation, uploads, notifications, storage traceability, and rollback coverage.

## Required verification for every LAAN change

- `php -l sitexcell-ui-prototype.php`
- `php -l includes/laan-request.php`
- `php -l pages/laan-request/laan-request.php`
- `node --check assets/js/laan-request.js`
- `node --check proposed_laan_form/src/scripts/prototype.js`
- `git diff --check`
- Browser verification of Page 1 and Page 2 at desktop and narrow widths
- Site lookup verification for a site with notes, a site with formatted links, and a site without notes
- Invalid date, missing Site, missing terms, missing upload, oversized upload, replacement, and removal checks
- Successful non-production submission in the local WordPress environment
- Admin verification of the saved request, protected files, and notification behavior

## Current limitations

- The prototype Site snapshot is imported manually from `proposed_laan_form/fixtures/` through LAAN Settings.
- Business-specific conditional fields remain intentionally conservative until the field/rule matrix is approved.
- The native handler is the current local implementation; Gravity Forms compatibility is an adapter goal, not an active dependency.
- Production deployment still requires a WordPress environment review, mail configuration, private-directory web-server verification, and security review.
