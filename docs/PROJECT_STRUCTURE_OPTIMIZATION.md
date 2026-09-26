# SiteXcell Project Structure Optimization

## Purpose

This document describes the optimized structure of the SiteXcell UI Modernization prototype. The plugin remains a front-end-only WordPress/PHP prototype with Tailwind CSS and lightweight vanilla JavaScript.

## Refactoring Goals

- Keep the standalone About page content and rendering contract stable while allowing approved UI refinements.
- Load prototype assets only when the prototype is rendered.
- Keep one canonical runtime JavaScript file.
- Remove empty directories and one-off abstractions.
- Retain only meaningful PHP components and used image assets.
- Make the CSS and JavaScript workflows explicit for handoff.

## Before Structure

```text
sitexcell-ui-prototype/
|-- assets/
|   |-- css/style.css
|   |-- images/                  (5 used images)
|   `-- js/                      (empty)
|-- components/                 (4 active PHP components)
|-- doc/
|   `-- PROJECT_STRUCTURE_OPTIMIZATION_PROMPT.md
|-- mock-data/                   (empty)
|-- pages/
|   |-- about.php
|   `-- prototype-template.php
|-- src/
|   |-- css/input.css
|   `-- js/about.js
|-- sitexcell-ui-prototype.php
|-- package.json
`-- package-lock.json
```

## After Structure

```text
sitexcell-ui-prototype/
|-- assets/
|   |-- css/style.css            (generated)
|   |-- images/                  (5 used images)
|   `-- js/app.js                (served directly)
|-- components/
|   |-- footer/footer.php
|   |-- navbar/navbar.php
|   |-- section-heading/section-heading.php
|   `-- ui/
|       |-- badge/badge.php
|       `-- feature-card/feature-card.php
|-- docs/
|   `-- PROJECT_STRUCTURE_OPTIMIZATION.md
|-- pages/
|   `-- about/
|       |-- about.php
|       |-- template.php
|       `-- sections/
|           |-- adding-value/adding-value.php
|           |-- call-to-action/call-to-action.php
|           |-- client-interests/client-interests.php
|           |-- contact/
|           |   |-- contact.php
|           |   |-- form-adapter.php
|           |   `-- prototype-form.php
|           |-- hero/hero.php
|           |-- industry-experts/industry-experts.php
|           |-- leadership/leadership.php
|           |-- maximising-returns/maximising-returns.php
|           `-- statistics/statistics.php
|-- src/
|   `-- css/input.css            (Tailwind source)
|-- sitexcell-ui-prototype.php
|-- package.json
`-- package-lock.json
```

`node_modules/` is a generated local development dependency directory. It is not application source and can be recreated with `npm install`.

The original Co-Siter dashboard layout reference remains at `pages/access-portal-page/prototype-ui.html` for historical comparison. The `/sitexcell-portal-requests-prototype/` route now renders the shared PHP demo shell from `co-siter_dashboard/pages/cositer-demo/template.php`, with fictional data and non-submitting form prototypes. See [`COSITER_WORDPRESS_PROTOTYPE.md`](COSITER_WORDPRESS_PROTOTYPE.md) for the current route map and boundaries.

## Files Removed

- `src/js/about.js`: removed because there is no JavaScript build pipeline. Its behavior moved to `assets/js/app.js`, which WordPress loads directly. Mobile navigation, Escape-key handling, responsive menu closing, admin-toolbar scroll state, and prototype form feedback were preserved.
- `doc/PROJECT_STRUCTURE_OPTIMIZATION_PROMPT.md`: removed after the refactor because it was an execution brief. Its useful project responsibilities and final decisions are documented here.
- `mock-data/`: removed because it was empty and no implemented page consumes mock data.
- `src/js/`: removed after its only runtime file moved to `assets/js/app.js`.

## Files Merged

No meaningful PHP component was merged. Each retained component is reused, substantial, interactive, or likely to support later pages.

Two one-off CSS abstractions were consolidated into their owning templates:

- `.sx-mobile-menu` moved into `components/navbar/navbar.php` as Tailwind utilities.
- `.sx-form-status` moved into `pages/about/sections/contact/prototype-form.php` as Tailwind utilities.

Unused semantic-only classes on the hero and header were removed without changing styling.

## Files Retained

- `sitexcell-ui-prototype.php`: plugin metadata, shared path constants, request detection, asset enqueueing, shortcode registration, and standalone template routing.
- `pages/about/template.php`: complete standalone HTML document and shared page composition.
- `pages/about/about.php`: lightweight About page orchestrator that renders the section list in order.
- `pages/about/sections/`: one named directory per About page section, keeping markup and local data together.
- `components/navbar/navbar.php`: reusable navigation and accessible mobile menu markup.
- `components/footer/footer.php`: reusable company footer.
- `pages/about/sections/contact/contact.php`: provider-neutral contact layout.
- `pages/about/sections/contact/form-adapter.php`: selects a configured production provider or the prototype fallback.
- `pages/about/sections/contact/prototype-form.php`: visual-only form with semantic labels and prototype disclosure.
- `components/section-heading/section-heading.php`: reused across five content sections.
- `components/ui/badge/badge.php`: shadcn-inspired compact label primitive rendered entirely in PHP.
- `components/ui/feature-card/feature-card.php`: reusable PHP feature-card primitive with number and check-marker variants.
- `src/css/input.css`: Tailwind source, brand tokens, shared patterns, focus behavior, toolbar state, and reduced-motion behavior.
- `assets/css/style.css`: generated CSS required by WordPress at runtime.
- `assets/js/app.js`: canonical browser interaction source loaded directly by WordPress.
- All five files in `assets/images/`: each is referenced by the About page, navbar, or footer.

## WordPress Rendering Flow

```text
WordPress request
-> sitexcell-ui-prototype.php
-> is_page('sitexcell-about-prototype')
-> pages/about/template.php
-> components/navbar/navbar.php
-> pages/about/about.php
-> pages/about/sections/<section-name>/<section-name>.php
-> components/section-heading/section-heading.php where needed
-> components/footer/footer.php
```

The `template_include` filter preserves the standalone page and bypasses the active theme template. The `[sitexcell_about]` shortcode remains available for compatibility. The plugin constants `SITEXCELL_UI_PATH` and `SITEXCELL_UI_URL` provide consistent include and asset paths.

## Tailwind Workflow

Edit only `src/css/input.css` and Tailwind classes in PHP templates.

Development watcher:

```powershell
npm run watch:css
```

One-time minified build:

```powershell
npm run build:css
```

Equivalent direct watcher:

```powershell
npx @tailwindcss/cli -i ./src/css/input.css -o ./assets/css/style.css --watch
```

The design system uses an Inter-first sans-serif stack and shadcn-inspired neutral tokens, borders, focus rings, shadows, and 6px to 8px radii. Google Fonts provides Inter on the prototype route, with Segoe UI and Arial fallbacks if the request is unavailable.

## JavaScript Workflow

There is no JavaScript bundler or compilation step. Edit `assets/js/app.js` directly. WordPress loads this file in the footer only for the prototype page or a singular page containing `[sitexcell_about]`.

The script owns:

- hiding the WordPress admin toolbar after scrolling;
- opening, closing, and responsively resetting the mobile menu;
- Escape-key menu dismissal and focus restoration;
- visual-only contact form validation and feedback.

## Asset Loading

`sitexcell_ui_is_prototype_request()` limits CSS and JavaScript loading to the prototype page and shortcode use. `filemtime()` supplies development cache-busting versions. Ordinary WordPress frontend pages do not receive prototype assets.

Images are local files under `assets/images/`; no unused image was found.

## Behavioral Invariants

- The URL remains `http://sitexcell.local/sitexcell-about-prototype/`.
- The standalone template remains active with no theme header or footer.
- All About page sections, content, statistics, images, and leadership details remain present.
- Mobile navigation retains ARIA state, Escape-key support, link-close behavior, and desktop reset behavior.
- The admin toolbar hides after scrolling while the SiteXcell header remains sticky.
- The default contact form remains a non-persistent visual prototype and clearly states that data is not sent or stored.
- Production form integration remains dormant until a provider and positive form ID are explicitly configured.
- Semantic landmarks, one H1, labels, focus styles, and reduced-motion handling remain intact.

## Developer Handoff Notes

- Run `npm install` after obtaining the project if `node_modules/` is absent.
- Run `npm run build:css` after changing Tailwind classes or `src/css/input.css`.
- Keep WordPress-facing PHP inside this plugin; do not modify WordPress core or the active theme for prototype UI changes.
- Preserve WordPress escaping for dynamic URLs, attributes, and text.
- The active fallback form and interactions are demonstrations only; no backend, storage, email, authentication, or CRM integration is enabled.

## Future Form Provider Handoff

The contact section uses a provider adapter so production form infrastructure can be introduced without changing its page layout. The default form ID is zero, which keeps `prototype-form.php` active.

When Gravity Forms is installed and a form has been created, the host project can activate it from a site-specific plugin or theme integration:

```php
add_filter('sitexcell_ui_contact_form_id', static fn (): int => 3);
```

Replace `3` with the production form ID. The adapter then calls Gravity Forms with AJAX enabled, and `sitexcell_ui_enqueue_assets()` prepares that form's scripts. If Gravity Forms is missing or the configured ID is zero, the polished prototype remains visible.

Provider-specific presentation is scoped under `.sx-gravity-form` in `src/css/input.css`. Keep field definitions, validation, notifications, anti-spam, and data handling inside the production form provider rather than duplicating them in the page template.

## Adding a New Page

1. Add a named page directory under `pages/`, with a page orchestrator and template.
2. Add each visual section under `pages/<page-name>/sections/<section-name>/`.
3. Reuse the existing navbar, footer, and section-heading components where appropriate.
4. Add an explicit WordPress page-slug route in `sitexcell-ui-prototype.php`.
5. Extend `sitexcell_ui_is_prototype_request()` so assets load for the new route.
6. Add page-specific JavaScript to `assets/js/app.js` behind a relevant DOM check.
7. Rebuild Tailwind and repeat the validation checks below.

## Do Not Edit

- `assets/css/style.css` by hand; it is generated output.
- Files under `wp-admin/`, `wp-includes/`, or other WordPress core directories.
- `node_modules/`; update dependencies through `package.json` and npm.
- Production data, authentication, or integrations as part of this front-end prototype.

## Validation Performed

- Parsed all current plugin PHP files with `php -l`; no syntax errors were reported.
- Ran `npm install --package-lock-only`; the lockfile is consistent and npm reported zero vulnerabilities.
- Ran `npm run build:css`; Tailwind v4.3.3 generated `assets/css/style.css` successfully.
- Ran `node --check assets/js/app.js`; JavaScript syntax passed.
- Requested the prototype URL and received HTTP 200.
- Confirmed the prototype loads `assets/css/style.css` and `assets/js/app.js` and no longer references `src/js/about.js`.
- Requested the ordinary WordPress front page and received HTTP 200; prototype CSS and JavaScript were absent.
- Requested every CSS, JavaScript, and image asset; each returned HTTP 200.
- Confirmed one header, one main landmark, one footer, and one H1 in rendered markup.
- Confirmed all internal fragment links resolve to rendered IDs.
- Confirmed nine form labels, mobile-menu ARIA wiring, form status markup, required proof points, leadership names, and prototype disclosure.
- Searched source files for stale old JavaScript paths, removed directories, and removed one-off class names; no stale references remained.

## Known Limitations

- Automated browser screenshot and viewport interaction testing was not available in this session. Responsive behavior was preserved in source and rendered markup, but desktop, tablet, and mobile visual comparison still requires a manual browser pass.
- The form does not submit or store data by design.
- WordPress database access was unavailable from the standalone CLI environment, so stored shortcode usage could not be queried directly; the shortcode was retained to avoid a compatibility regression.
