# Co-Siter WordPress prototype

## Status and journey

**Readiness level: Prototype.** This is a reviewable journey hosted by WordPress. It does not authenticate, submit a request, send a contact message, retrieve a document, or use production Co-Siter data. The only browser persistence is the existing form prototypes' tab session state.

The intended path is SiteXcell Home or About → footer **Co-Siter demo login** → placeholder entry → shared Co-Siter dashboard. The login has no password field. Direct dashboard URLs also work because there is no authentication gate to imply one exists.

| URL | PHP view | Purpose |
| --- | --- | --- |
| `/sitexcell-cositer-login-prototype/` | `pages/cositer-demo/template.php` login branch | Placeholder entry and disclosure |
| `/sitexcell-portal-requests-prototype/` | `views/requests.php` | Fictional request register, search, status/type filters |
| `?view=request&id=DEMO-SAR-001` | `views/request.php` | Read-only details and related document names |
| `?view=users` | `views/users.php` | Fictional users with local search |
| `?view=documents` | `views/documents.php` | Fictional Access/LAAN document index |
| `?view=settings` | `views/settings.php` | Non-operational settings view |
| `?view=contact` | `views/contact.php` | Form preview; no send or storage |
| `?view=laan` | Existing `proposed_laan_form` browser module | LAAN form inside shared shell |
| `?view=access` | Existing `proposed_access_request_form` browser module | Access form inside shared shell |

The sidebar reflects the real Co-Siter navigation structure: Requests, Users, Documents, Settings, Contact Us. The top bar exposes LAAN Request and Access Request on dashboard pages, and Back to Requests on form pages. The PHP shell owns that navigation; the form modules omit only their standalone shells when mounted under `#prototype-root[data-portal-embedded]`. Their standalone servers still render their original shells.

## Ownership and boundaries

- `includes/cositer-demo.php` matches the two local routes exactly, allowlists views, and builds links using `home_url()`.
- `sitexcell-ui-prototype.php` selects the PHP template and conditionally enqueues dashboard assets and the appropriate form assets. It does not load the native LAAN submission script or handler on the demo route.
- `pages/cositer-demo/` owns the WordPress document, shared shell, view partials, SVG symbols, and explicitly fictional register fixtures.
- `assets/css/cositer-demo.css` and `assets/js/cositer-demo.js` own shell presentation and local register/contact interaction.
- The existing form modules own their fields, stages, validation, upload simulation, and recovery behavior. They start with blank fields in the dashboard. Back to Requests leaves recoverable browser-tab state intact; Exit demo clears the known prototype form session keys after reaching the entry page.
- `pages/access-portal-page/prototype-ui.html` remains a design reference and is not the served dashboard.
- `/laan-request/` is the separate native WordPress LAAN implementation. It can persist and notify under its own contract in [`LAAN_WORDPRESS_READINESS.md`](LAAN_WORDPRESS_READINESS.md); it is not part of this demo journey.

The fictional data in `fixtures.php` is presentation content, not an administrator-managed registry. Names and email domains are synthetic. Displayed document names are labels; there are no downloadable files. Status and settings controls do not change records.

## Local verification

Run the local WordPress site with this plugin active and open the two routes above. The dashboard routes are plugin-owned, so no WordPress page record is required for them. A valid WordPress database connection is required for a real-host check.

From the repository root:

```powershell
npm.cmd run test:prototype:cositer
npm.cmd run test:prototype:access
npm.cmd run test:prototype:playwright
```

The Co-Siter browser suite uses a test-only PHP shim in `tests/cositer-demo/` because it needs a PHP render while remaining independent of a local WordPress database. It exercises the route journey, shared navigation, blank form entry, and session recovery. This shim is not part of the runtime. Also lint changed PHP with `php -l`, check changed JavaScript with `node --check`, and run `git diff --check`.

## Handoff limits

This route is deliberately public and must not be treated as a login or permission boundary. A production Co-Siter integration would need real identity, authorization, data ownership, server-side validation, storage, document protection, notifications, and administrator workflows under [`WORDPRESS_HANDOFF_READINESS.md`](WORDPRESS_HANDOFF_READINESS.md). No prototype session state or fixture should be promoted as production data.
