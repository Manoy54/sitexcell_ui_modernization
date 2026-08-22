# SiteXcell UI Prototype — Project Model

> Comprehensive project description, domain model, architecture reference, and delivery guide.

## 1. Project identity

| Attribute | Definition |
| --- | --- |
| Project name | SiteXcell UI Prototype |
| Repository/package name | sitexcell-ui-prototype |
| Project type | WordPress plugin containing front-end page and application-interface prototypes |
| Product area | SiteXcell telecommunications property advisory, management, and Co-Siter access experiences |
| Current maturity | High-fidelity visual prototype with selected WordPress-rendered page compositions and throwaway HTML explorations |
| Runtime host | WordPress, inside the SiteXcell local/project environment |
| Primary audience | SiteXcell stakeholders, designers, developers, and reviewers evaluating a modernized public website and contractor/portal UI |
| Current release | 1.0.0 |
| License | GPL-2.0-or-later, as declared by the plugin |
| Primary entry point | sitexcell-ui-prototype.php |

The project is a design and implementation laboratory for SiteXcell’s public-facing website and related Co-Siter access-management interface. It makes proposed information architecture, visual language, content hierarchy, responsive behavior, and interaction patterns reviewable in a real WordPress request rather than only in static design files.

The project is intentionally not a complete production application. A page can look complete while still being a prototype. The authoritative distinction is whether the code connects to a real provider, persists data, authenticates a user, or changes a business record. The current project does not implement those capabilities.

## 2. Objective, task, and goal

### Objective

Modernize and validate SiteXcell’s digital interface direction while preserving SiteXcell’s real brand, service language, proof points, contact details, imagery, leadership information, and commercial positioning.

### Core task

Build a reusable, responsive, accessible front-end prototype that demonstrates:

- a modern SiteXcell Home page;
- a detailed SiteXcell About page;
- shared marketing-site navigation and footer patterns;
- service, client, sector, insights, leadership, statistics, contact, and call-to-action sections;
- a Co-Siter requests dashboard concept for access and Land Access Activity Notice workflows;
- alternative visual treatments for CTA, insights, statistics, section transitions, and contact experiences;
- a controlled handoff path from visual-only form behavior to an explicitly configured production form provider.

### Product goal

Give the team a credible, reviewable interface foundation from which production marketing pages and a real access-management product can be designed and implemented without confusing visual hypotheses with live business capability.

### Engineering goals

1. Keep page composition understandable by organizing each major page into named sections.
2. Reuse stable PHP components for navigation, footer, headings, badges, and feature cards.
3. Load prototype CSS and JavaScript only for prototype requests or supported shortcodes.
4. Keep the browser runtime small and dependency-free beyond the WordPress host and generated CSS.
5. Preserve semantic HTML, keyboard behavior, focus treatment, responsive layout, and reduced-motion handling.
6. Make the eventual production contact-form integration explicit and opt-in.
7. Keep exploratory variants available for review without presenting them as live product behavior.

## 3. Nature and scope

### What this project is

- A WordPress plugin used as a UI modernization prototype.
- A server-rendered PHP composition system for marketing pages.
- A visual reference implementation for the SiteXcell brand and design system.
- A lightweight interaction prototype using browser-native HTML and vanilla JavaScript.
- A controlled place to evaluate public-site and portal concepts against real content and local WordPress rendering.
- A handoff artifact that documents which patterns are reusable, which are provisional, and which require production systems.

### What this project is not

- It is not the production SiteXcell website.
- It is not a complete Co-Siter portal.
- It is not an authenticated application.
- It is not a request, lease, access, document, user, or workflow database.
- It does not send, store, route, or process contact submissions when the fallback form is active.
- It does not authorize property access, approve LAAN requests, manage leases, or calculate commercial outcomes.
- It does not replace the production WordPress theme, WordPress core, CRM, email provider, Gravity Forms configuration, or Co-Siter back end.

### Scope boundary

The project owns the prototype presentation layer and the small amount of interaction required to demonstrate that layer. The host WordPress installation owns page availability, WordPress APIs, theme/plugin coexistence, and any eventual production integration. External production systems own real submissions, users, records, documents, notifications, permissions, and business workflows.

## 4. Domain model

The following terms are canonical for this repository.

| Term | Meaning in this project |
| --- | --- |
| SiteXcell | The telecommunications property advisory and management brand whose public and portal experiences are being prototyped. |
| Prototype request | A WordPress request recognized by the plugin as one of the supported prototype slugs or as a singular post using the Home/About shortcode. |
| Marketing page | A public, content-led page such as Home or About, rendered as PHP sections with shared navigation and footer. |
| Page orchestrator | A small PHP file that declares the ordered section list and includes each section, such as pages/home/home.php or pages/about/about.php. |
| Section | A named content band responsible for one coherent part of a page, such as Hero, Statistics, Services, Leadership, or Contact. |
| Shared component | A PHP view used by more than one page or intended to provide a stable visual primitive, such as Navbar, Footer, Badge, or Feature Card. |
| Prototype surface | Any route or page fragment intended for visual evaluation rather than production operation. |
| Scratch exploration | A throwaway HTML experiment under .scratch/ used to compare variants or answer a design question. |
| Portal prototype | The Co-Siter requests dashboard mockup at pages/access-portal-page/prototype-ui.html. It presents sample request records and layout variants only. |
| Request | In the portal UI, a sample access-related record such as an SAR or LAAN item. In this repository it is display data, not a domain entity backed by storage. |
| SAR | The sample portal label for a site access request. The prototype does not define or enforce its production workflow. |
| LAAN | Land Access Activity Notice. The website describes advisory and handling capability; the portal mockup displays sample LAAN requests. |
| Production provider | A real external or host-managed service responsible for handling a form submission. Gravity Forms is the currently prepared integration seam. |
| Fallback form | The visual-only form rendered when no positive Gravity Forms ID is configured. It validates required fields in the browser and then reports that no data was sent or stored. |
| Autonomy | The amount of behavior the repository can perform without a database, authentication service, production form provider, or portal API. Current autonomy is presentation-level, not business-process-level. |

### Domain relationships

WordPress request
  → prototype request detection
    → asset loading
    → route selection
      → standalone template or shortcode renderer
        → shared shell
          → page orchestrator
            → ordered sections
              → shared UI primitives and local assets

For the portal concept, the relationship is deliberately incomplete:

sample request data
  → static dashboard rows/cards/drawer
    → visual review of request-management patterns

real user, request, document, status, permission, and workflow state
  → not implemented in this repository

## 5. User and stakeholder value

### Public-site visitors

They should be able to understand SiteXcell’s independent telecommunications property expertise, see the services and client groups it supports, review proof points and leadership, and find a clear contact action.

### Property owners and organisations

The prototype should communicate support for lease negotiations, property access, LAAN matters, unauthorised equipment, strategy, audits, and end-to-end telecommunications property management.

### Portal users and reviewers

The Co-Siter concept should make request registers, request types, statuses, filtering, search, pagination, review details, documents, users, settings, and contact support legible as a potential application shell.

### Designers and developers

The repository should make it easy to inspect a section, identify the intended component boundary, rebuild CSS, test the page in WordPress, and distinguish reusable implementation from experimental markup.

## 6. Capability map

### Implemented prototype capabilities

| Capability | Where it lives | Current behavior |
| --- | --- | --- |
| WordPress plugin bootstrap | sitexcell-ui-prototype.php | Defines constants, hooks asset loading, registers shortcodes, and selects standalone templates. |
| Home page composition | pages/home/ | Renders Hero, Services, Clients, Sectors, About, and Insights sections in order. |
| About page composition | pages/about/ | Renders Hero, Statistics, Client Interests, Industry Experts, Maximising Returns, Adding Value, Leadership, CTA, and Contact sections. |
| Shared marketing shell | components/navbar/, components/footer/ | Provides sticky navigation, responsive mobile menu markup, footer links, contact details, skip link support, and page framing. |
| Section primitives | components/section-heading/, components/ui/ | Provides reusable badges, section headings, numbered feature cards, and check-mark feature cards. |
| Contact form presentation | pages/about/sections/contact/ | Uses a provider adapter. Defaults to the visual-only fallback form. |
| Browser interaction | assets/js/app.js | Handles scroll state, admin-bar hiding, mobile menu, Escape dismissal, focus restoration, breakpoint reset, and fallback form feedback. |
| Design-token CSS | src/css/input.css | Defines Tailwind theme values, SiteXcell colors, typography, shared patterns, focus states, provider styling, and reduced-motion behavior. |
| Generated runtime CSS | assets/css/style.css | Minified CSS output consumed by WordPress. |
| Portal request dashboard concept | pages/access-portal-page/prototype-ui.html | Shows three switchable requests-table variants with sample data and a review drawer concept. |

### Partially prepared capabilities

- Production form presentation can be enabled by supplying a positive form ID through the sitexcell_ui_contact_form_id filter and making Gravity Forms available.
- Some business-facing page directories exist under pages/advisory/, pages/agency/, pages/clients/, and pages/insights/, but they are currently content stubs or page-level placeholders rather than complete routed production pages.
- Several scratch concepts are routed for review, but their interaction is local to the static HTML and does not represent a shared application state model.

### Explicitly absent capabilities

- Authentication and authorization.
- User management.
- Database reads and writes.
- Real request creation, editing, filtering, pagination, or status transitions.
- Document storage or retrieval.
- Email, CRM, analytics, notification, or workflow integrations.
- Server-side form validation or submission handling for the fallback form.
- API endpoints.
- Client-side framework or application state management.

## 7. Application and route model

The plugin detects prototype routes using WordPress page checks first and URI substring checks as a fallback. Supported route identifiers are:

| Route slug | Route key | Rendering source | Role |
| --- | --- | --- | --- |
| sitexcell-home-prototype | home | pages/home/template.php | Standalone Home page prototype. |
| sitexcell-about-prototype | about | pages/about/template.php | Standalone About page prototype. |
| sitexcell-cta-prototype | cta | .scratch/cta-variations/prototype-ui.html | CTA composition comparison. |
| sitexcell-insights-prototype | insights | .scratch/insights-prototype/prototype-ui.html | Insights and statistics comparison. |
| sitexcell-contact-prototype | contact | .scratch/contact-prototype/prototype-ui.html | Contact experience comparison. |
| sitexcell-transitions-prototype | transitions | .scratch/section-transitions/prototype-ui.html | Section-transition comparison. |
| sitexcell-portal-requests-prototype | portal-requests | pages/access-portal-page/prototype-ui.html | Co-Siter request-register UI comparison. |

The plugin also registers:

- [sitexcell_home], which buffers and renders pages/home/home.php;
- [sitexcell_about], which buffers and renders pages/about/about.php.

Shortcode rendering is intentionally narrower than standalone template rendering: the shortcode supplies the page main content, while the host page remains responsible for its surrounding document unless a standalone prototype route is used.

### Standalone page rendering flow

WordPress request
  → sitexcell_ui_get_current_prototype()
  → sitexcell_ui_template_include()
  → pages/<page>/template.php
  → shared navbar
  → pages/<page>/<page>.php
  → ordered page sections
  → shared footer
  → wp_head() / wp_footer()

The standalone Home and About templates clear the 404 state and return HTTP 200 when the matching template exists. They also preserve WordPress lifecycle hooks through wp_head(), wp_body_open(), and wp_footer().

## 8. Page and section model

### Home page

pages/home/home.php is the page orchestrator. Its ordered content model is:

1. **Hero** — positions SiteXcell’s offer and establishes the first call to action.
2. **Services** — presents lease negotiation, property access management, LAAN support, unauthorised-equipment identification, strategy and advice, Co-Siter access management, site-evaluation audits, and full telco management agency.
3. **Clients** — describes who SiteXcell helps.
4. **Sectors** — uses an expandable visual panel treatment for sector messaging and closes with a red CTA band.
5. **About** — introduces the SiteXcell story and difference.
6. **Insights** — presents insights and case-study cards.

### About page

pages/about/about.php is the more complete, structured page composition. Its ordered content model is:

1. **Hero** — About SiteXcell positioning, real imagery, and introductory copy.
2. **Statistics** — proof points including 8,000+, 6,500+, >$9M, and 100+ years of combined experience.
3. **Client interests** — establishes that the client’s commercial interests come first.
4. **Industry experts** — describes specialist telecommunications-property capability and associated risks.
5. **Maximising returns** — expresses commercial outcomes and advantages.
6. **Adding value** — presents end-to-end support through reusable feature cards.
7. **Leadership** — presents Lisa Hall and Wayne Sander with real portraits and roles.
8. **Call to action** — invites visitors to speak with an experienced professional.
9. **Contact** — provides contact context and a provider-neutral form layout.

### Secondary page directories

The repository also contains domain-oriented page files for:

- Advisory: negotiating a new lease, managing property access, understanding LAANs, strategy and advice, selling an existing lease, and identifying unauthorised equipment.
- Agency: telecommunications management agency.
- Clients: critical infrastructure, government and education property holdings, private land owners, REITs and investment banks, and testimonials.
- Insights: an orchestrator placeholder without completed section content.

These files show the intended information architecture and content domains. They should not be described as fully wired, production-ready routes until the plugin route map and template composition explicitly include them.

## 9. Component architecture

### Plugin bootstrap and integration layer

sitexcell-ui-prototype.php owns the WordPress boundary:

- aborting direct access when ABSPATH is unavailable;
- defining SITEXCELL_UI_PATH, SITEXCELL_UI_URL, SITEXCELL_UI_PAGE_SLUG, and SITEXCELL_UI_HOME_SLUG;
- identifying the current prototype;
- deciding whether prototype assets should load;
- enqueueing the external Geist Sans stylesheet, generated CSS, and browser runtime;
- optionally enqueueing Gravity Forms scripts;
- registering Home and About shortcodes;
- returning standalone template files through template_include.

This file is an integration boundary, not a page-content file. New page content belongs under pages/, and reusable markup belongs under components/.

### Shared shell components

#### Navbar

components/navbar/navbar.php provides:

- SiteXcell logo and branding;
- desktop navigation for Home, About, Advisory, Agency, Clients, and Insights;
- a Contact action;
- sticky header styling;
- mobile navigation markup;
- aria-expanded, aria-controls, and accessible menu labels;
- current-page styling for the Home and About prototype routes.

The navigation contains both local prototype URLs and external production SiteXcell URLs. That is a deliberate handoff boundary: this prototype is allowed to demonstrate the route relationship without claiming that every destination is implemented locally.

#### Footer

components/footer/footer.php provides:

- SiteXcell identity statement;
- services links;
- phone number and office address;
- enquiry link;
- About, Co-Siter login, Disclaimer, and Privacy Policy links;
- current-year output through wp_date().

### Shared UI primitives

#### Section heading

components/section-heading/section-heading.php expects section_eyebrow, section_title, and section_id, with optional copy and inverse-surface mode. It composes the badge primitive with an accessible section heading and optional supporting copy.

#### Badge

components/ui/badge/badge.php is a small PHP-rendered label primitive. It supports the default light variant and an inverse variant for dark surfaces. The red dot is decorative and the visible label carries the meaning.

#### Feature card

components/ui/feature-card/feature-card.php renders a title and description with either a numbered marker or a check icon. It is used for capability and commercial-outcome collections and is intentionally content-led rather than application-state-driven.

### Contact components

The Contact section separates layout from submission provider:

contact.php
  → form-adapter.php
     → Gravity Forms when a positive configured ID exists
     → prototype-form.php otherwise

The fallback form has visible labels, browser-required fields, a status region, and a disclosure stating that information is not sent or stored. Its JavaScript intercepts the submit event and reports completion only after browser validity succeeds.

### Portal UI structures

The portal prototype is a standalone HTML page rather than a PHP component tree. It contains:

- a Co-Siter-branded application shell;
- a sidebar with Requests, Users, Documents, Settings, and Contact us;
- account and page bars;
- LAAN Request and Access Request actions;
- request type filtering;
- search controls;
- request tables with ID, date, site, type, status, and action columns;
- status-summary filters;
- pagination controls;
- a selected-request review drawer in variant C;
- three visual variants selected through the query-string variant parameter and keyboard arrows.

These are screen and interaction hypotheses. Buttons and table data are not connected to a portal API.

## 10. Technology stack

### Runtime stack

| Layer | Technology | Responsibility |
| --- | --- | --- |
| CMS/runtime | WordPress | Request lifecycle, hooks, page context, shortcode execution, asset enqueueing, and host integration. |
| Server rendering | PHP | Plugin bootstrap, templates, page orchestrators, components, escaping, and provider adapter. |
| Styling source | Tailwind CSS v4 | Utility generation, theme tokens, responsive classes, and shared component layers. |
| Styling runtime | Generated CSS in assets/css/style.css | Browser-consumed, minified stylesheet. |
| Browser behavior | Vanilla JavaScript | Small progressive-enhancement behaviors in assets/js/app.js; scratch pages may contain local inline scripts. |
| Typography | Geist Sans via Fontsource CDN | Prototype font with Geist, Inter, Segoe UI, and Arial fallbacks. |
| Assets | Local PNG/JPG assets | Logo, hero/banner imagery, and leadership portraits. |
| Optional form provider | Gravity Forms | Future/host-configured production contact form integration. |
| Package tooling | Node.js/npm | Installs Tailwind CLI dependencies and runs CSS build/watch scripts. |

### Package scripts

    npm install
    npm run build:css
    npm run watch:css

build:css compiles src/css/input.css to assets/css/style.css with minification. watch:css watches source and template usage during development. There is no JavaScript bundler, TypeScript compiler, React runtime, or client application build.

### Styling principles

The visual system is SiteXcell-specific and uses a restrained editorial language:

- Geist Sans first, with system fallbacks;
- SiteXcell red for actions, active states, markers, icons, and emphasis;
- charcoal for headings and inverse surfaces;
- cool neutral surfaces and one-pixel borders;
- 6px control and approximately 8px card rounding;
- restrained shadows for elevation and sticky-header state;
- authentic property, infrastructure, consultation, and leadership imagery;
- responsive stacking and readable table overflow;
- visible keyboard focus and reduced-motion handling.

The project also records 21st.dev, shadcn-inspired, and Stripe-inspired visual references. Those references inform composition, density, and component patterns; they are not runtime dependencies and do not replace SiteXcell content or brand rules.

## 11. Runtime behavior and interaction model

assets/js/app.js is the canonical runtime for WordPress-rendered prototype pages.

### Scroll and header state

- Reads window.scrollY and toggles sx-page-scrolled on body and html after a small scroll threshold.
- Allows CSS to add sticky-header elevation.
- Hides the WordPress admin toolbar after scrolling on prototype pages so it does not compete with the sticky SiteXcell header.

### Mobile navigation

- Toggles aria-expanded on the menu button.
- Toggles the menu’s hidden state.
- Updates the screen-reader label from “Open navigation menu” to “Close navigation menu”.
- Closes when a mobile link is selected.
- Closes on Escape and returns focus to the toggle.
- Closes when the viewport enters the desktop breakpoint.

### Prototype form

- Prevents network submission.
- Delegates required-field and email checks to reportValidity().
- Displays a status message only after valid browser-side input.
- Explicitly states that information was not sent or stored.

### Scratch-page interaction

Scratch HTML prototypes may carry their own inline JavaScript. For example, the portal page switches variants using ?variant=A|B|C, updates browser history, and supports left/right arrow navigation. These scripts are local exploration code and are not part of the shared application runtime.

## 12. Autonomy and external dependencies

### Autonomy level

The project is autonomous for:

- rendering known static page compositions;
- displaying local images and content;
- applying the documented visual system;
- demonstrating responsive behavior;
- opening and closing the mobile menu;
- presenting local form validation feedback;
- comparing static visual variants;
- serving sample request tables and drawer layouts.

The project is not autonomous for:

- determining the identity or permissions of a portal user;
- retrieving current request records;
- creating or changing an SAR or LAAN request;
- uploading or viewing documents;
- sending or storing contact information;
- notifying SiteXcell staff;
- integrating with a CRM;
- enforcing legal, lease, access, or commercial rules;
- keeping displayed statuses synchronized with a source of truth.

### Dependency matrix

| Dependency | Required now | Failure or fallback behavior |
| --- | --- | --- |
| WordPress | Yes | Plugin exits without ABSPATH; no standalone runtime exists outside WordPress for PHP pages. |
| Active WordPress host/theme context | Yes for routes and hooks | Shortcodes may render inside a host page; standalone templates use WordPress lifecycle functions. |
| Node.js/npm | Only for development | Generated CSS can be served if already built; source changes require a local build. |
| Fontsource CDN | No for core rendering | Typography falls back to the declared system stack if the CDN is unavailable. |
| Gravity Forms | No by default | Fallback visual-only form remains active when absent or unconfigured. |
| WordPress database | Not used by current prototype behavior | Static content continues to render; no live records are available. |
| Portal/API/CRM | No | Portal and contact experiences remain static or visual-only. |

### Important operational distinction

filemtime() is used for CSS and JavaScript versioning. This is useful for local cache busting but assumes the generated files exist and are readable. A deployment process must build or package assets/css/style.css before serving the plugin.

## 13. Data, security, and correctness model

### Data model today

The project has no application data model. Content is embedded in PHP templates and static HTML. Portal request rows are sample presentation data. No data is written to WordPress or an external service by the current default flow.

### Input handling today

- Static PHP values are escaped with WordPress functions where they become URLs, attributes, or visible text.
- The fallback form uses semantic labels, required, type=email, browser validity reporting, and an explicit non-persistence disclosure.
- No server-side form endpoint exists for the fallback form.
- No portal query, mutation, or user-supplied record filter is sent to a back end.

### Security boundaries for future work

Any productionization must add, rather than infer, the following:

- authenticated sessions and capability checks;
- server-side validation and sanitization;
- nonces/CSRF protection for mutations;
- authorization for requests, documents, users, and settings;
- safe pagination and search parameters;
- audit logging for status or access changes;
- provider-specific spam protection and privacy handling;
- explicit data-retention and consent behavior;
- failure states that do not falsely report completion.

The current prototype status message is safe only because the form is intentionally non-persistent. It must not be retained as the success path after a real provider is connected.

## 14. Repository structure

    sitexcell-ui-prototype/
    ├── PROJECT.md                         # This project/domain model
    ├── sitexcell-ui-prototype.php         # WordPress plugin bootstrap and routing
    ├── package.json                        # Tailwind scripts and dev dependencies
    ├── package-lock.json                   # Locked npm dependency graph
    ├── skills-lock.json                    # Local skill/tooling lock metadata
    ├── assets/
    │   ├── css/style.css                   # Generated runtime CSS; do not hand-edit
    │   ├── js/app.js                       # Canonical WordPress browser runtime
    │   └── images/                         # Logo, hero, banner, and leadership assets
    ├── src/
    │   └── css/input.css                   # Tailwind source, tokens, components, utilities
    ├── components/
    │   ├── navbar/navbar.php               # Shared marketing navigation
    │   ├── footer/footer.php               # Shared marketing footer
    │   ├── section-heading/section-heading.php
    │   └── ui/
    │       ├── badge/badge.php
    │       └── feature-card/feature-card.php
    ├── pages/
    │   ├── home/                           # Structured Home composition
    │   ├── about/                          # Structured About composition
    │   ├── access-portal-page/             # Standalone portal prototype
    │   ├── advisory/                       # Advisory page content stubs
    │   ├── agency/                         # Agency page content stub
    │   ├── clients/                        # Client page content stubs
    │   └── insights/                       # Insights orchestrator placeholder
    ├── docs/
    │   ├── PROJECT_STRUCTURE_OPTIMIZATION.md
    │   ├── DESIGN_INTERFACE_HANDOFF.md
    │   ├── 21ST_DEV_DESIGN_REFERENCES.md
    │   └── agents/                         # Domain and issue-tracking guidance
    └── .scratch/
        ├── cta-variations/
        ├── insights-prototype/
        ├── contact-prototype/
        ├── section-transitions/
        └── other visual explorations and local assets

node_modules/ is generated development output and is not application source. assets/css/style.css is generated output and should be rebuilt from src/css/input.css rather than edited directly.

## 15. Development workflow

### Change a marketing page

1. Identify the page orchestrator and section that owns the content.
2. Reuse existing shared components before adding a new primitive.
3. Edit PHP templates and/or src/css/input.css.
4. Run npm run build:css when Tailwind source or template classes change.
5. Load the relevant prototype route in WordPress.
6. Check desktop, tablet, mobile, keyboard, focus, and reduced-motion behavior.
7. Confirm that no prototype assets load on an ordinary non-prototype page.

### Add a new structured page

1. Add pages/<page-name>/<page-name>.php as the orchestrator.
2. Add pages/<page-name>/template.php if it needs a standalone document shell.
3. Add sections under pages/<page-name>/sections/<section-name>/.
4. Reuse Navbar, Footer, Section Heading, Badge, and Feature Card where appropriate.
5. Add a route key and template branch in sitexcell-ui-prototype.php.
6. Extend sitexcell_ui_is_prototype_request() through the route map so assets load.
7. Keep page-specific JavaScript behind DOM checks in assets/js/app.js, unless the feature is explicitly a scratch exploration.
8. Rebuild CSS and verify the route returns HTTP 200.

### Add a scratch exploration

Use .scratch/<feature-slug>/prototype-ui.html for a deliberately disposable design question or variant comparison. Scratch work may use inline styles/scripts and static sample data, but it must be labeled as a prototype and must not be treated as a production implementation without an explicit migration step.

## 16. Goals and task backlog

### Current success criteria

- Home and About render as coherent standalone WordPress prototype pages.
- Shared navigation and footer work across the structured pages.
- Prototype assets are scoped to recognized prototype requests or supported shortcodes.
- About sections preserve real SiteXcell content, proof points, imagery, leadership, and contact details.
- Mobile navigation is keyboard-usable and restores focus after Escape dismissal.
- The fallback form cannot silently imply data persistence.
- The portal prototype clearly communicates that requests are sample data and actions are not connected.
- CSS is reproducible from source with the documented npm commands.
- PHP and JavaScript remain parseable after changes.

### Near-term implementation tasks

1. Complete a manual browser pass at 390px, 768px, 1024px, and 1440px, including 320px minimum width and 200% zoom.
2. Resolve any mismatch between the canonical design handoff and implementation tokens, especially where older sections use one-off utility values.
3. Decide which Home and About content is approved for production migration.
4. Decide whether the advisory, agency, clients, and insights page files should become routed structured pages or remain content references.
5. Select one portal requests-table variant for further interaction modeling.
6. Define the real portal domain model before adding API or state-management code.
7. Configure a production contact provider only after privacy, validation, notification, spam, and failure behavior are specified.

### Productionization tasks, if this prototype is promoted

- Introduce a real content source or approved WordPress content strategy.
- Replace static portal rows with an authenticated API-backed data model.
- Define users, organisations, properties, sites, requests, request types, statuses, documents, events, and permissions.
- Define workflow transitions for SAR and LAAN records, including invalid transitions and audit history.
- Add server-side form submission and validation.
- Add tests for route detection, asset scoping, permissions, provider failures, and workflow rules.
- Establish privacy, retention, monitoring, accessibility, and deployment requirements.
- Migrate accepted design decisions out of scratch HTML into the shared component/page structure.

## 17. Decisions and trade-offs

### PHP templates over a client framework

PHP was chosen because the project runs inside WordPress and the main goal is a realistic, low-friction front-end prototype. A React/TypeScript application would add build and runtime complexity without providing value for the current static page compositions. A client framework may become appropriate for a real portal once authenticated state, API data, and workflow interactions exist.

### Direct JavaScript over a JavaScript build pipeline

The shared runtime is small and DOM-oriented, so assets/js/app.js is served directly. This keeps the prototype easy to inspect and avoids a bundler for a handful of progressive-enhancement behaviors. If portal state or cross-component behavior grows, that decision should be revisited rather than extending one global file indefinitely.

### Generated CSS over hand-edited runtime CSS

Tailwind source and PHP utility classes remain the authoring surface; assets/css/style.css is generated. This preserves a reproducible build and prevents the runtime file from becoming a second, conflicting source of truth.

### Provider adapter over hard-coded production form markup

The contact section keeps layout independent from submission infrastructure. Gravity Forms can be enabled through a positive configured ID, while the fallback remains clearly visual-only. This preserves the prototype review path and avoids inventing a fake backend.

### Scratch variants over premature abstraction

Variants are kept as local experiments until a design direction is selected. Abstracting every experimental difference into a shared component too early would encode unapproved decisions and make the core model harder to read.

## 18. Known limitations and risks

### Current limitations

- Automated browser screenshot and viewport-interaction testing is not part of the current repository workflow.
- The fallback form is intentionally non-functional.
- The portal UI is static sample-data presentation.
- Several page directories are not connected to the main route map.
- The external font CDN introduces a network dependency for the preferred font.
- Some scratch pages use local inline Tailwind CDN scripts or styles independent of the main generated CSS.
- The repository is not itself a Git worktree in the current workspace, so version-history-based review cannot be inferred from local Git commands.

### Risks to manage

- A reviewer may mistake a polished static control for a working business action.
- A future developer may edit generated CSS and lose changes on the next build.
- A positive Gravity Forms ID may activate real submission behavior without complete privacy and failure-state review.
- Static links can point to production URLs while local prototype routes remain incomplete.
- Reusing the global app.js for growing portal logic could create unrelated page coupling.
- URI substring detection is convenient for local prototype routes but should be tightened if the plugin is used in a public production routing context.

## 19. Verification checklist

### Static checks

- [ ] Run php -l against all plugin PHP files.
- [ ] Run node --check assets/js/app.js.
- [ ] Run npm run build:css after source/style changes.
- [ ] Confirm generated assets/css/style.css exists and is newer than the relevant source change.
- [ ] Search for stale paths such as src/js/about.js.

### WordPress checks

- [ ] Home prototype returns HTTP 200.
- [ ] About prototype returns HTTP 200.
- [ ] Supported scratch routes return HTTP 200 when their files exist.
- [ ] Ordinary WordPress pages do not receive prototype CSS or JavaScript.
- [ ] Home/About shortcodes render without PHP warnings.
- [ ] The standalone templates retain WordPress head/body/footer hooks.

### UI and accessibility checks

- [ ] One logical H1 exists per standalone marketing page.
- [ ] Header, main, and footer landmarks are present.
- [ ] Skip link reaches #main-content.
- [ ] Mobile menu state is reflected in aria-expanded and hidden.
- [ ] Escape closes the menu and restores focus.
- [ ] Form labels remain visible and required fields validate.
- [ ] Status messages do not rely on color alone.
- [ ] Focus-visible treatment is visible.
- [ ] Layout works at 320px, 390px, 768px, 1024px, and 1440px.
- [ ] Reduced-motion preferences suppress nonessential animation.
- [ ] Portal tables remain usable through horizontal scrolling at narrow widths.

### Product-boundary checks

- [ ] Prototype disclosures are present wherever actions are non-functional.
- [ ] No form or portal interaction claims success without a real provider response.
- [ ] No authentication, permission, document, or workflow behavior is implied to be live.
- [ ] Sample data is not mistaken for production records.

## 20. Source-of-truth map

| Question | Source of truth |
| --- | --- |
| What routes exist? | sitexcell-ui-prototype.php |
| What sections make up Home? | pages/home/home.php |
| What sections make up About? | pages/about/about.php |
| What shared markup is reusable? | components/ |
| What browser behavior is shared? | assets/js/app.js |
| What design tokens and shared CSS patterns exist? | src/css/input.css |
| What CSS does WordPress serve? | assets/css/style.css |
| What are the visual standards? | docs/DESIGN_INTERFACE_HANDOFF.md |
| What reference patterns were adapted? | docs/21ST_DEV_DESIGN_REFERENCES.md |
| What structure and handoff constraints exist? | docs/PROJECT_STRUCTURE_OPTIMIZATION.md |
| What terms should future work use? | This document’s domain model and docs/agents/domain.md |
| What is exploratory rather than core? | .scratch/ and the route table in this document |

## 21. Final project statement

SiteXcell UI Prototype is a WordPress-based, high-fidelity front-end prototype for a telecommunications property advisory website and a related Co-Siter access-management experience. It combines server-rendered PHP page composition, reusable UI primitives, Tailwind-generated styling, local brand assets, and small vanilla-JavaScript enhancements. Its purpose is to validate structure, content, design, accessibility, and interaction direction with real SiteXcell context. Its autonomy ends at the presentation boundary: it can show how the experience should work, but it does not yet own the authenticated data, integrations, workflows, or business decisions required to make the experience operational.
