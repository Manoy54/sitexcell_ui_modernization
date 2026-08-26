# WordPress Handoff Readiness Standard

This is the repository-wide contract for keeping SiteXcell UI modernization work compatible with WordPress and ready for developer handoff. It applies to every new or modified runtime file, page, form, asset, data source, test, and release package.

Feature-specific documents may add requirements. They must not weaken this standard. The LAAN-specific contract is [`LAAN_WORDPRESS_READINESS.md`](LAAN_WORDPRESS_READINESS.md).

## 1. Readiness levels

Every surface must declare its current level:

| Level | Meaning |
| --- | --- |
| **Prototype** | Isolated design or interaction exploration. It does not submit data, own production routes, or act as a source of truth. |
| **WordPress-integrated** | Rendered through WordPress and connected to WordPress-owned routing, permissions, storage, and asset loading. |
| **Handoff-ready** | Passes the mandatory checks in this document and includes installation, administration, testing, deployment, and rollback documentation. |
| **Production-ready** | Handoff-ready plus verification on the target environment and final security, privacy, mail, operational, and stakeholder approval. |

“WordPress-ready” must not be used as a synonym for “visually complete.” A surface is not handoff-ready while a mandatory requirement or an unresolved release blocker remains.

## 2. Supported platform baseline

Unless a feature document records a stricter target:

- WordPress **6.6 or newer** is the minimum supported baseline.
- PHP **8.1 or newer** is required.
- The local verification environment currently uses WordPress **7.1** and PHP **8.3**.
- The target hosting environment must be checked before production handoff, including PHP extensions, database version, filesystem permissions, mail delivery, HTTPS, cron, caching, and web-server rules.
- The plugin must fail safely when an optional dependency is unavailable. It must not fatal-error because a prototype server, Node.js, Elementor, or Gravity Forms is absent.

The plugin header, readme, and release documentation must state the supported versions. Runtime requirements must be kept consistent across all three.

## 3. Repository boundaries

Use the following ownership model:

| Area | WordPress/runtime ownership | Prototype/test ownership |
| --- | --- | --- |
| Routing and page rendering | PHP templates, shortcodes, hooks, WordPress pages | Prototype server and static HTML only |
| Business rules and validation | Server-side PHP is authoritative | JavaScript mirrors rules for feedback |
| Persistence and records | WordPress posts, options, metadata, and custom tables | Browser state and synthetic fixtures only |
| Authentication and permissions | WordPress users, capabilities, nonces, and server checks | Test login/session helpers only |
| Browser interaction | Scoped JavaScript modules | Prototype JavaScript may explore states |
| Presentation | Enqueued, scoped CSS and approved assets | Prototype CSS and reference assets |
| External providers | Explicit adapters with a provider-independent contract | Characterization tests and provider fixtures |

Production code must never depend on `server.mjs`, browser `sessionStorage`, prototype-relative imports, local authentication state, or an external test fixture.

## 4. Required WordPress integration

Every production page or form MUST:

- have a documented WordPress entry point, such as a page, shortcode, block, or controlled rewrite;
- render through a PHP-owned template or renderer;
- use WordPress enqueue hooks for CSS and JavaScript;
- use prefixed or namespaced functions, classes, constants, options, actions, post types, and database tables;
- protect every directly loaded PHP file with an `ABSPATH` check where appropriate;
- keep public output compatible with the active theme and WordPress admin bar;
- work without Elementor or another page builder being installed;
- document activation, deactivation, upgrade, and uninstall behavior;
- expose an administrator workflow for all content or records that operations staff must manage.

The plugin owns the behavior and scoped presentation of its managed surfaces. A theme or page builder may host the output, but must not be the only way to render it.

## 5. Administration and content management

If a value can change without a code release, it MUST be stored in an appropriate WordPress-managed location. Examples include:

- site names, stable Site IDs, addresses, owners, and formatted carrier notes;
- notification recipients and operational settings;
- statuses, review metadata, and request records;
- approved content links and instructions.

Administrators must be able to create, edit, review, and correct these values with clear labels and help text. Admin screens MUST apply capability checks, nonces, sanitization on input, and escaping on output.

Do not hardcode customer records, contact addresses, notification recipients, or operational codes in JavaScript, templates, or documentation.

## 6. Form and provider independence

The canonical field names, states, validation rules, uploads, confirmation dependencies, and submission outcomes MUST be defined independently of the rendering provider.

The native WordPress implementation is the baseline for this project. Gravity Forms, if introduced later, must be an adapter rather than the business-rule source. A provider change is acceptable only when it preserves:

- server-side validation and error behavior;
- required-field and confirmation dependencies;
- upload restrictions and protected storage;
- persistence and request traceability;
- notifications and operational status;
- recovery, reload, and replacement behavior;
- rollback to the previous working implementation.

Generated provider field IDs must not be used as permanent domain identifiers.

## 7. Data, schemas, and migrations

Every stored data shape MUST have a documented schema owner and version. Changes that affect stored data require:

- an idempotent migration or compatibility path;
- a recorded schema version;
- a rollback or recovery procedure;
- an upgrade test on existing records;
- an uninstall decision.

Deactivation must preserve user records. Uninstall must preserve records by default unless an administrator explicitly chooses a documented deletion operation. Destructive deletion must never occur silently during activation, update, or deactivation.

Use WordPress APIs and `$wpdb->prepare()` for database work. Do not use display labels as stable identifiers.

## 8. Security and privacy

All external input is untrusted. Any write, AJAX action, REST endpoint, upload, or admin operation MUST include the applicable combination of:

- capability or ownership authorization;
- nonce verification where a browser action is involved;
- server-side validation of type, length, range, relationship, and state;
- `wp_unslash()` before processing request values;
- context-appropriate sanitization and escaping;
- prepared SQL for database queries;
- safe error messages that do not disclose sensitive internals.

Uploads MUST validate extension, MIME type, size, error state, and storage destination on the server. Private documents must be stored outside public access or behind a capability-checked download controller. Direct file URLs must not be sent in public markup or notification bodies.

Repository data MUST be synthetic, sanitized, or explicitly approved for distribution. Do not commit:

- authentication state, cookies, tokens, passwords, or API keys;
- personal contact details or customer files;
- production request records;
- unreviewed production exports or operational identifiers;
- private screenshots, traces, videos, or browser reports.

Production-derived notes must be reviewed before they are copied into fixtures, commits, releases, or tests. When a real note is needed for characterization, keep it in a protected local input and commit only a sanitized structural equivalent.

Forms that store personal data must document collection purpose, access control, retention, export, deletion, and privacy-tool integration where applicable.

## 9. Source, dependencies, and build outputs

- Each production asset MUST have one canonical editable source.
- Generated CSS and JavaScript MUST be reproducible from documented commands.
- Deployable compiled assets MUST be present when the target WordPress environment does not run Node.js.
- Generated assets must not be edited directly.
- Dependencies MUST be declared and version-controlled with the appropriate lockfile.
- `node_modules`, local build caches, authentication state, test artifacts, and local environment files MUST not enter the release package.
- Runtime CDN dependencies and remote scripts require explicit approval, integrity controls where available, and a fallback or documented operational dependency.
- Assets MUST be conditionally enqueued only on the pages that use them.

The current LAAN production sources are under `assets/`. The isolated `proposed_laan_form/` server remains a prototype boundary and must not become a runtime dependency.

## 10. Accessibility, compatibility, and performance

Production interfaces MUST target WCAG 2.2 AA and include:

- semantic headings, landmarks, labels, descriptions, and grouped controls;
- keyboard-complete interaction and visible focus;
- accessible menus, dialogs, date controls, uploads, and validation errors;
- an understandable error summary and field-level recovery path;
- sufficient color contrast and non-color status communication;
- support for reduced motion and zoom without clipped or horizontally overflowing content.

CSS MUST be scoped to the feature. Do not alter unrelated theme or admin controls through broad element selectors. JavaScript MUST avoid uncontrolled global state and must degrade to a usable server-rendered experience where feasible.

Use conditional loading, efficient queries, bounded payloads, optimized media, and pagination for large admin datasets. Do not send the entire operational data set to every public browser request.

Handoff verification must cover the latest two major versions of Chrome, Edge, Firefox, and Safari where available, plus current mobile Chrome and Safari. The local Chromium run is useful for development but is not the complete compatibility signoff.

## 11. Localization and text handling

All production-facing PHP text MUST use the plugin text domain and WordPress translation functions. Translated output must be escaped in its final context. JavaScript-facing strings must use the WordPress internationalization mechanism when they are part of a production interface.

Do not concatenate unescaped user data into HTML. Rich content must be passed through the approved WordPress allowlist and links must use safe protocols.

## 12. Verification gates

Every modified production surface MUST pass the checks appropriate to its change:

### Static checks

```powershell
php -l sitexcell-ui-prototype.php
php -l includes/laan-request.php
php -l pages/laan-request/laan-request.php
node --check assets/js/laan-request.js
node --check proposed_laan_form/src/scripts/prototype.js
git diff --check
```

Run additional checks for every changed PHP, JavaScript, CSS, build, migration, or packaging path. A failed MUST check blocks the WordPress-ready classification.

### Behavioral checks

Verify, as applicable:

- fresh activation and safe reactivation;
- page creation, routing, shortcode rendering, and theme compatibility;
- admin creation and editing of managed content;
- permissions for anonymous, ordinary authenticated, and administrator users;
- required, invalid, boundary, replacement, removal, reload, and recovery states;
- successful non-production persistence and notification behavior;
- protected upload storage and download authorization;
- responsive, keyboard, focus, and accessible error behavior;
- upgrade, migration, rollback, and uninstall expectations.

External authenticated tests remain characterization tests. Keep them separate from local WordPress implementation tests and never allow them to submit real production requests without an explicit guard and approval.

## 13. Release packaging and handoff evidence

Every handoff package MUST include:

- the plugin version and change log;
- supported WordPress, PHP, database, browser, and dependency versions;
- the exact build and packaging commands;
- installation, activation, configuration, and admin setup steps;
- schema and migration status;
- permissions and notification requirements;
- data/privacy review status;
- test commands and real results;
- known limitations and open risks;
- rollback instructions;
- the list of included runtime files and excluded development artifacts.

The release artifact must be generated from Git. Manual server edits are emergency changes only and must be reconciled into a reviewed commit before the next release.

## 14. Pull request checklist

The author MUST confirm:

- [ ] The affected surface and readiness level are documented.
- [ ] WordPress routing, rendering, admin, and asset boundaries remain intact.
- [ ] Server-side validation and authorization cover every write path.
- [ ] Stored data, migrations, retention, and uninstall behavior are documented.
- [ ] No secrets, authentication state, personal data, production records, or unreviewed fixtures are staged.
- [ ] Canonical source and generated asset rules are preserved.
- [ ] Accessibility, responsive, keyboard, and error states were checked.
- [ ] Static and behavioral checks were run, with failures recorded honestly.
- [ ] Feature-specific documentation and this standard remain accurate.
- [ ] Any exception includes an owner, mitigation, expiry, and required approvals.

## 15. Current repository inventory and tracked gaps

### WordPress-integrated areas

- Plugin bootstrap: `sitexcell-ui-prototype.php`
- Native LAAN implementation: `includes/laan-request.php`
- LAAN renderer and template: `pages/laan-request/`
- LAAN production assets: `assets/css/laan-request.css`, `assets/js/laan-data.js`, and `assets/js/laan-request.js`
- LAAN-specific contract: `docs/LAAN_WORDPRESS_READINESS.md`

### Isolated areas

- `proposed_laan_form/` is a visual and interaction prototype boundary.
- `tests/laan-request/` contains external characterization and live-session tooling.
- Prototype servers, browser fixtures, authentication state, reports, traces, screenshots, and videos are not production dependencies.

### Open gaps before final handoff

1. Add and verify explicit WordPress/PHP requirements in the plugin metadata and release documentation.
2. Resolve or formally document the duplicate prototype-versus-production LAAN asset source until a canonical promotion/build path exists.
3. Review existing fixture data and keep production-derived snapshots local, ignored, sanitized, or moved into approved WordPress-managed seed data.
4. Complete authenticated local WordPress verification for activation, Site administration, notes, submission, uploads, notifications, and protected downloads.
5. Classify placeholder pages under `pages/` as planned, prototype, or WordPress-integrated; do not describe placeholders as handoff-ready.
6. Complete cross-browser, accessibility, privacy, and target-host verification before production-ready approval.

These gaps are tracked deliberately. A future change may close them, but must not conceal or bypass them.

## 16. Exceptions and ownership

An exception is valid only when it records:

- the unmet requirement;
- why it is necessary;
- the affected surface and risk;
- mitigation and verification plan;
- an owner and expiry date;
- developer and QA approval;
- product and security approval when business behavior, personal data, authentication, or uploads are affected.

The author of a code change owns updates to this document and the relevant feature document in the same pull request. Reviewers must reject a change when the implementation, readiness classification, or documentation no longer agrees with the repository.

## Definition of done

A change is complete only when it is WordPress-integrated at the appropriate level, secure on the server, manageable in WordPress, reproducibly buildable, accessible, tested, documented, and packaged without hidden local dependencies or unreviewed data.
