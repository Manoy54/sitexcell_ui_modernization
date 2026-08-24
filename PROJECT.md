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

### Repository census

The repository currently contains:

- one WordPress plugin bootstrap file;
- two standalone PHP marketing-page templates, Home and About;
- two PHP page orchestrators for those marketing pages;
- fifteen About/Home PHP content sections in total;
- four shared PHP component families: Navbar, Footer, Section Heading, and UI primitives;
- seven local image assets in `assets/images/`: one logo, two Home hero/banner images, one About hero image, one Industry Experts image, and two leadership portraits;
- one shared browser runtime in `assets/js/app.js`;
- one Tailwind source stylesheet and one generated runtime stylesheet;
- one standalone Co-Siter portal HTML prototype;
- nine throwaway HTML explorations under `.scratch/`;
- thirteen content/page placeholders under `pages/advisory/`, `pages/agency/`, `pages/clients/`, and `pages/insights/`;
- npm metadata and a locked Tailwind dependency graph;
- project/domain documentation under `PROJECT.md`, `CONTEXT.md`, and `docs/`.

`node_modules/` is present as generated local development output. It is not part of the application architecture or the source-of-truth implementation.

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

### Current routing and integration configuration

The bootstrap file currently defines these constants:

| Constant | Current value or purpose |
| --- | --- |
| `SITEXCELL_UI_PATH` | Absolute plugin directory path from `plugin_dir_path(__FILE__)`. |
| `SITEXCELL_UI_URL` | Plugin URL from `plugin_dir_url(__FILE__)`. |
| `SITEXCELL_UI_PAGE_SLUG` | `sitexcell-about-prototype`. |
| `SITEXCELL_UI_HOME_SLUG` | `sitexcell-home-prototype`. |

Route detection follows this order:

1. `is_page()` checks for the Home and About slugs.
2. The request URI is read from `$_SERVER['REQUEST_URI']`, stripped of its query string with `strtok()`, and checked for known slug substrings.
3. If no prototype route matches, the plugin checks whether the current singular post contains `[sitexcell_about]` or `[sitexcell_home]`.

The Home and About route keys receive custom standalone templates that explicitly clear the WordPress 404 flag and send HTTP 200. The scratch and portal route keys return their HTML files through `template_include`, but those files are self-contained documents and do not use the shared PHP navbar/footer shell.

The plugin does not register activation hooks, admin pages, custom post types, REST routes, AJAX handlers, database tables, cron jobs, widgets, blocks, or settings pages.

On eligible requests, the enqueue hook loads `https://cdn.jsdelivr.net/npm/@fontsource/geist-sans@5.0.1/index.css`, then `assets/css/style.css` with the font stylesheet as a dependency, then `assets/js/app.js` in the footer. The CSS and JavaScript versions are generated from `filemtime()` of the served files. This is local/deployment cache busting, not an asset-manifest system.

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

The current Home implementation is intentionally mixed in maturity. The Hero, Services, Clients, Sectors, About, and Insights sections are rendered and styled, but several actions remain placeholder anchors (`#`), some visual imagery is loaded from Unsplash URLs, and the client logos are inline illustrative SVG wordmarks rather than a verified production logo system.

Home content currently includes:

- Hero claim: "Australia's Leading Advisors" and a telecommunications property and lease negotiation message, with Contact and View our services actions.
- Eight service cells: Telco lease negotiations; Property access management; Land Access Activity Notices; Identifying unauthorised equipment; Strategy and advice; Co siter Access Management; Telco Site Evaluation Audits; and Full Telco Management Agency.
- A full-service management banner describing carrier-rent collection and mobile-tower lease negotiations.
- A Who we help section with nine illustrative client marks: Jemena, dexus, AusNet, MONASH, NSW Transport, Sydney WATER, ISPT, mirvac, and CITY OF SYDNEY. The first Home implementation renders these as an auto-scrolling duplicated marquee and pauses the animation on hover.
- Four sector panels: Private land owners, REITS & Investment Banks, Critical infrastructure, and Government & education. Each panel expands on hover and contains a placeholder Learn more link.
- An About split between Our story and The siteXcell difference, including the since-2005 claim, client categories, independence positioning, a placeholder capability-statement card, and placeholder customer-story/download actions.
- An Insights and Case Studies section with four proof-point figures, one featured article, and two supporting case-study cards. The visible cards are static and their Read More actions are not routed.

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

The current About implementation is the most structured and reusable page in the repository. It uses the shared Section Heading, Badge, and Feature Card components and references the local About hero, industry-experts, Lisa Hall, and Wayne Sander image assets.

### Secondary page directories

The repository also contains domain-oriented page files for:

- Advisory: negotiating a new lease, managing property access, understanding LAANs, strategy and advice, selling an existing lease, and identifying unauthorised equipment.
- Agency: telecommunications management agency.
- Clients: critical infrastructure, government and education property holdings, private land owners, REITs and investment banks, and testimonials.
- Insights: an orchestrator placeholder without completed section content.

These files show the intended information architecture and content domains. They are currently empty page shells: each defines a `<main>` element and a placeholder comment, initializes an unused section path/list, and does not include content sections. They are not connected to the plugin route map and should not be described as fully wired, production-ready routes.

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

The fallback form fields are:

- required Name;
- required Email address with `type="email"`;
- optional Position;
- required Phone number;
- optional Company;
- optional Property / building address;
- optional Carrier / infrastructure company select with Telstra, Optus, TPG / Vodafone, NBN Co, and Other / unsure options;
- optional Enquiry type select with New or existing lease, Land access or activity notice, Site management or access, Unauthorised equipment, Strategy and advice, and Other options;
- required Message textarea.

The adapter is dormant by default because `sitexcell_ui_contact_form_id()` applies the `sitexcell_ui_contact_form_id` filter with a default of `0`. A host can return a positive ID, for example `3`, to activate Gravity Forms. The adapter then calls `gravity_form()` with AJAX enabled, and the enqueue hook calls `gravity_form_enqueue_scripts()` when that function is available. A positive ID without the Gravity Forms plugin still leaves the visual-only fallback active.

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

### Portal prototype detail

`pages/access-portal-page/prototype-ui.html` is a self-contained HTML document with its own inline CSS, inline SVG icon symbols, Geist Sans CDN link, `noindex,nofollow` robots metadata, and inline JavaScript. It does not use the WordPress body class, the shared marketing CSS contract, the shared navbar/footer, or the WordPress lifecycle hooks.

The portal shell currently models:

- a 290px desktop sidebar, reduced to 230px below 1180px;
- a Co-Siter wordmark with the tagline "Telco Site Access Portal" and "by siteXcell" attribution;
- Requests, Users, Documents, Settings, and Contact us navigation;
- a prototype disclosure stating "Sample requests only. No actions are connected.";
- a charcoal account bar showing Wayne Sander;
- a Requests page bar with LAAN Request and Access Request buttons;
- a cool-gray workspace containing filters, search, a wide table, and pagination;
- request columns for ID, Date Requested, Site Name, Type, Status, and Action;
- SAR and LAAN sample request types;
- Submitted, Commenced, Completed, and Withdrawn sample status values;
- sample locations including CRM Tower, Everest Tower, Melbourne Central Tower, and Monash University campuses.

The three selectable portal variants are:

| Variant | Description | Current static behavior |
| --- | --- | --- |
| A | Refined classic table | Displays 11 rows, plain text statuses, and "Showing 1-11 of 84 sample requests" pagination text. |
| B | Status-forward table | Adds four visual status-summary buttons: All requests (84), Submitted (12), Commenced (31), and Completed (38); clicking a summary only changes its selected styling. |
| C | Table with review drawer | Selects SAR - 245873 and shows a review drawer with status, date, type, site, assignment, last-updated metadata, and placeholder Manage request/View documents buttons. |

The portal uses `?variant=A`, `?variant=B`, or `?variant=C`, writes the selected variant with `history.replaceState()`, and supports left/right arrow navigation unless focus is inside an input, textarea, select, or editable element. Every `href="#"` link is prevented locally. The portal has responsive breakpoints at 1180px, 820px, and 520px, stacks the shell on narrow screens, turns the sidebar navigation into a horizontal strip, and allows wide tables to scroll horizontally. Reduced-motion users receive near-zero transition durations.

### Scratch exploration catalog

The `.scratch/` directory contains nine disposable HTML explorations. These are not shared components and should be treated as design questions, not production routes:

| Exploration | Question or content | Variants or behavior |
| --- | --- | --- |
| `.scratch/home-hero/` | Home hero composition using the local cell-tower background image. | Split Screen, Glassmorphism, and Dynamic Grid; selected with `?v=v1|v2|v3`. |
| `.scratch/services/` | Home services matrix and full-service banner. | Light Table and Dark Table; selected with `?v=v1|v2`. |
| `.scratch/clients/` | Who we help/client-logo presentation. | Infinite Marquee, Minimal Grid, and Floating Badges; selected with `?v=v1|v2|v3`. |
| `.scratch/sectors/` | Sector presentation for the four client/industry groups. | Flex Accordion, Bento Hover Grid, and Interactive Tabs; also includes a separate four-tab `switchTab()` experiment. |
| `.scratch/story-difference/` | About story and SiteXcell difference composition. | Split Screen (50/50), Floating Cards, and Minimal Editorial; selected with `?v=v1|v2|v3`. |
| `.scratch/cta-variations/` | Call-to-action wrapper and messaging treatment. | Floating Pillar, Asymmetrical Split, and Minimalist Void; selected with `?v=v1|v2|v3`. |
| `.scratch/insights-prototype/` | Statistics and editorial insights/case-study layouts. | Statistics: Glassmorphism, Dark Strip, Clean White. Insights: Editorial, Slider, Minimalist List. Uses separate `s` and `v` query parameters. |
| `.scratch/contact-prototype/` | Contact information and form layout. | Modern Split Panel, The Floating Card, and Minimalist Side-by-Side; selected with `?v=v1|v2|v3`. Includes placeholder map requests using a `NO_KEY` Google Static Maps URL. |
| `.scratch/section-transitions/` | Visual separation between CTA, story, and difference sections. | The Overlap, SVG Angled Divider, and Soft Gradient Space; selected with `?v=v1|v2|v3`. |

Most scratch files link the generated stylesheet, load Geist Sans from Fontsource, use inline Tailwind CDN configuration and/or inline styles, and rely on placeholder `#` actions. Their `pushState()` variant controls are shareable visual state only; there is no shared state model between files.

## 10. Technology stack

### Runtime stack

| Layer | Technology | Responsibility |
| --- | --- | --- |
| CMS/runtime | WordPress | Request lifecycle, hooks, page context, shortcode execution, asset enqueueing, and host integration. |
| Server rendering | PHP | Plugin bootstrap, templates, page orchestrators, components, escaping, and provider adapter. |
| Styling source | Tailwind CSS v4 | Utility generation, theme tokens, responsive classes, and shared component layers. |
| Styling runtime | Generated CSS in assets/css/style.css | Browser-consumed, minified stylesheet. |
| Browser behavior | Vanilla JavaScript | Shared behavior in assets/js/app.js; scratch pages may contain local inline scripts. |
| Typography | Geist Sans via Fontsource CDN | Prototype font with Geist, Inter, Segoe UI, and Arial fallbacks. |
| Assets | Local PNG/JPG assets | Logo, hero/banner imagery, and leadership portraits. |
| Optional form provider | Gravity Forms | Future/host-configured production contact form integration. |
| Browser testing | Playwright 1.62.1 | Explicitly invoked authenticated live characterization and validation tests. |
| Package tooling | Node.js/npm | Installs Tailwind and Playwright development dependencies and runs CSS/test commands. |

### Package scripts

    npm install
    npm run build:css
    npm run watch:css
    npm run test:laan:live
    npm run test:laan:live:wave2

build:css compiles src/css/input.css to assets/css/style.css with minification. watch:css watches source and template usage during development. There is no JavaScript bundler, TypeScript compiler, React runtime, or client application build.

### Exact package configuration

`package.json` is private, declares version `1.0.0`, uses ESM via `"type": "module"`, and describes the package as "Front-end UI modernization prototype for SiteXcell." Its development dependencies are:

- `@tailwindcss/cli` `^4.3.3`;
- `@playwright/test` `1.62.1`;
- `tailwindcss` `^4.3.3`.

`package-lock.json` locks the npm dependency graph. There are no runtime npm dependencies. `skills-lock.json` is local Codex/agent tooling metadata and is not required by the WordPress runtime.

The CSS source imports both Tailwind CSS and the Geist Sans stylesheet. The `@theme` block defines the SiteXcell font stack and the principal tokens: `sx-red` `#FF2D37`, `sx-red-dark` `#D8131D`, `sx-red-light` `#FF5E67`, `sx-charcoal` `#18181b`, `sx-foreground` `#27272a`, `sx-muted-foreground` `#71717a`, `sx-muted` `#f4f4f5`, `sx-border` `#e4e4e7`, and `sx-input` `#d4d4d8`.

The generated stylesheet includes reusable classes for containers, sections, display typography, badges, cards, buttons, icon buttons, links, risk items, feature cards, leadership cards, form labels/controls, Gravity Forms presentation, footer links, skip links, marquee animation, and the sector accordion physics. It also contains a reduced-motion rule and prototype-specific WordPress admin-toolbar handling.

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

## Expected output

When the plugin is installed and the relevant WordPress requests are available, the expected output is:

1. A standalone Home prototype at the Home prototype slug, with the shared SiteXcell header, six ordered Home sections, and the shared footer.
2. A standalone About prototype at the About prototype slug, with the shared header, nine ordered About sections, and the shared footer.
3. A responsive sticky marketing header with desktop navigation, a Contact action, a keyboard-usable mobile menu, and a skip link to `#main-content`.
4. Local SiteXcell typography, colors, images, proof points, leadership information, and contact details rendered through PHP/Tailwind output.
5. Prototype assets loaded only on recognized prototype routes or singular posts containing the supported Home/About shortcode.
6. A browser-only fallback enquiry flow that checks required fields and email format, displays a status message, and explicitly states that no information was sent or stored.
7. A provider-backed Gravity Forms layout only when the host supplies a positive form ID and the Gravity Forms functions exist.
8. A static Co-Siter requests dashboard concept for the portal route, with three selectable visual variants and clearly disclosed sample data.
9. Scratch routes that expose their own local variant controls when their registered slug is used; unregistered scratch files remain file-level experiments rather than WordPress routes.

The expected output is presentational. A successful render must not be interpreted as successful submission, authentication, authorization, request creation, document access, status transition, notification, or CRM synchronization.

## Current content and asset inventory

### Local images

| Asset | Current use |
| --- | --- |
| `assets/images/sitexcell-logo.png` | Shared marketing header and footer logo. |
| `assets/images/home-hero-bg.png` | Home Hero telecommunications tower image. A duplicate exists at `.scratch/home-hero/bg.png`. |
| `assets/images/services-banner.png` | Home Services full-service banner. A duplicate exists at `.scratch/services/banner.png`. |
| `assets/images/about-hero.jpg` | About hero consultation/property image. |
| `assets/images/industry-experts.jpg` | About Industry Experts image. |
| `assets/images/lisa-hall.jpg` | About leadership portrait for Lisa Hall, Managing Director. |
| `assets/images/wayne-sander.jpg` | About leadership portrait for Wayne Sander, Director Client Advisory Services. |

### Remote and inline visuals

Home sector panels, Home About imagery, Home insights cards, and several scratch explorations reference Unsplash image URLs. The scratch contact exploration references Google Static Maps URLs with `key=NO_KEY`; it is therefore only a visual placeholder and should not be treated as an operational map integration. Client logos in the Home PHP section are inline SVG illustrations with color values declared in the template.

### Brand/content facts represented in the prototype

- SiteXcell is positioned as an independent telecommunications property consultancy and services firm.
- The copy repeatedly frames SiteXcell as acting for property owners and managers rather than telecommunications carriers.
- The public-site contact details are phone `1300 748 395` and `119 Willoughby Rd, Crows Nest NSW 2065`.
- The About page says service is available Australia wide and names offices/coverage in Adelaide, Brisbane, Sydney, and Melbourne.
- The About page includes the proof points `8,000+`, `6,500+`, `>$9M`, and `100+ years`.
- Home copy also presents `$3B+` in advisory deal value.
- Leadership content names Lisa Hall and Wayne Sander with their roles.
- The footer links to the co-siter login, Disclaimer, and Privacy Policy external destinations.

These claims and details are prototype content copied into templates, not values retrieved from a CMS or verified at runtime.

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
    │   ├── agents/                         # Domain and issue-tracking guidance
    │   └── testing/laan-request/           # LAAN research, test contract, and curated evidence
    ├── tests/laan-request/
    │   ├── live/core/                      # Authenticated external characterization tests
    │   ├── live/wave2/                     # Expanded live validation tests
    │   ├── support/                        # Sessions, runners, helpers, and result server
    │   ├── configs/                        # Playwright configurations by live tier
    │   └── fixtures/                       # Synthetic upload fixtures
    └── .scratch/
        ├── cta-variations/
        ├── insights-prototype/
        ├── contact-prototype/
        ├── section-transitions/
        └── other visual explorations and local assets

The complete scratch directory currently contains `clients/prototype-ui.html`, `contact-prototype/prototype-ui.html`, `cta-variations/prototype-ui.html`, `home-hero/prototype-ui.html` with `bg.png`, `insights-prototype/prototype-ui.html`, `section-transitions/prototype-ui.html`, `sectors/prototype-ui.html`, `services/prototype-ui.html` with `banner.png`, and `story-difference/prototype-ui.html`.

node_modules/ is generated development output and is not application source. assets/css/style.css is generated output and should be rebuilt from src/css/input.css rather than edited directly.

## Detailed directory and code inventory

This section explains what each project folder contains, what each code file does, and how the folders participate in the application. The repository has four different kinds of content:

1. **Runtime source**: PHP, JavaScript, CSS source, HTML prototypes, and local images used to render the experience.
2. **Generated output**: compiled CSS and `node_modules/`.
3. **Design/content exploration**: `.scratch/` and the unconnected page shells.
4. **Documentation and agent tooling**: Markdown references, local skills, and package metadata.

### Root-level files

| Path | Type | Function in the project |
| --- | --- | --- |
| `sitexcell-ui-prototype.php` | PHP plugin entry point | Registers the plugin, defines path/URL/slug constants, detects prototype requests, conditionally loads assets, registers Home/About shortcodes, selects standalone templates, and exposes the optional Gravity Forms filter. |
| `PROJECT.md` | Markdown documentation | The comprehensive project model, architecture guide, directory map, runtime boundary, development workflow, risks, and verification checklist. |
| `CONTEXT.md` | Domain glossary | Defines canonical business terms such as Client, Property owner, Advisory, Agency, Co-Siter, SAR, LAAN, Prototype, and Productionisation. It intentionally avoids implementation details. |
| `package.json` | npm configuration | Declares the private package, version `1.0.0`, GPL license, Tailwind dependencies, and `build:css`/`watch:css` scripts. |
| `package-lock.json` | npm lockfile | Locks the exact npm dependency graph used to build the generated CSS. |
| `skills-lock.json` | Local tooling metadata | Records Codex/agent skill lock information. It is not loaded by WordPress and is not part of the browser runtime. |

There is no root-level application entry file for React, Vue, TypeScript, a REST API, a database schema, a test runner, a bundler, or a server-side application outside WordPress. The PHP plugin file is the only runtime bootstrap.

### `assets/` - browser-consumed runtime assets

`assets/` contains files that WordPress or the standalone HTML prototypes serve to the browser.

#### `assets/css/`

| File | Function |
| --- | --- |
| `assets/css/style.css` | Generated, minified Tailwind v4 stylesheet. It contains the compiled theme tokens, utility classes, reusable component classes, responsive rules, focus states, reduced-motion behavior, marquee animation, sector accordion behavior, Gravity Forms styling, and WordPress admin-toolbar styling. Do not hand-edit this file; rebuild it from `src/css/input.css`. |

#### `assets/js/`

| File | Function |
| --- | --- |
| `assets/js/app.js` | Canonical shared vanilla-JavaScript runtime for the WordPress-rendered Home/About pages. It updates scroll state, adds sticky-header elevation, hides the WordPress admin bar after scrolling, opens/closes the mobile menu, manages `aria-expanded`, closes the menu on link selection/Escape/desktop breakpoint changes, restores focus after Escape, and handles visual-only fallback-form validation feedback. |

#### `assets/images/`

| File | Function |
| --- | --- |
| `assets/images/sitexcell-logo.png` | SiteXcell logo used by the shared Navbar and Footer. |
| `assets/images/home-hero-bg.png` | Local telecommunications tower image used by the Home Hero section. |
| `assets/images/services-banner.png` | Local telecommunications tower image used by the Home Services banner. |
| `assets/images/about-hero.jpg` | Local consultation/property image used by the About Hero section. |
| `assets/images/industry-experts.jpg` | Local telecommunications infrastructure image used by the About Industry Experts section. |
| `assets/images/lisa-hall.jpg` | Local leadership portrait for Lisa Hall. |
| `assets/images/wayne-sander.jpg` | Local leadership portrait for Wayne Sander. |

The local images are stable plugin assets. Some Home sections and most scratch prototypes additionally use remote Unsplash images, and the scratch Contact prototype uses a Google Static Maps URL with a placeholder `NO_KEY` value.

### `src/` - stylesheet authoring source

#### `src/css/`

| File | Function |
| --- | --- |
| `src/css/input.css` | Authoring source for the generated stylesheet. Imports Tailwind CSS and Geist Sans, declares SiteXcell theme tokens, defines base typography and focus rules, adds reusable component classes, configures Gravity Forms presentation, implements marquee/accordion utilities, and handles reduced motion. |

The CSS source is the styling source of truth. PHP templates contain Tailwind utility classes that are scanned by the Tailwind CLI; changing those classes also requires `npm run build:css`.

### `components/` - reusable PHP views

Every component is a PHP view included by a page/template. Components exit immediately when `ABSPATH` is unavailable, so they are intended to run inside WordPress rather than as direct public PHP files.

| Directory/file | Function |
| --- | --- |
| `components/navbar/navbar.php` | Shared SiteXcell marketing header. Defines local Home/About prototype links, external Advisory/Agency/Clients/Insights links, the Contact action, logo markup, desktop navigation, mobile navigation, current-page styling, and accessible mobile-menu attributes. |
| `components/footer/footer.php` | Shared SiteXcell footer. Renders the logo, company positioning, service links, phone/address details, enquiry link, current year, Co-Siter login, Disclaimer, and Privacy Policy links. |
| `components/section-heading/section-heading.php` | Shared section-heading view. Receives `$section_eyebrow`, `$section_title`, `$section_id`, and optional `$section_copy`/`$section_inverse`; renders a Badge plus an accessible `h2` and supporting copy. |
| `components/ui/badge/badge.php` | Small label primitive. Receives `$badge_label` and optional `$badge_variant`; supports default and inverse surfaces with a decorative SiteXcell-red dot. |
| `components/ui/feature-card/feature-card.php` | Content card primitive. Receives `$card_title`, `$card_copy`, `$card_marker`, and optional `$card_marker_type`; renders either a numbered marker or a check icon. |

The component layer deliberately contains presentation primitives, not domain services, database queries, API clients, authentication, or workflow logic.

### `pages/home/` - Home marketing page

`pages/home/` is a structured PHP page composition. The directory separates the standalone document shell, page orchestrator, and visual sections.

| File/directory | Function |
| --- | --- |
| `pages/home/template.php` | Standalone WordPress document template. Emits the HTML document, viewport metadata, WordPress head/body/footer hooks, skip link, shared Navbar, Home orchestrator, and shared Footer. |
| `pages/home/home.php` | Home page orchestrator. Defines the ordered section list and includes each existing section inside the `main#main-content` landmark. |
| `pages/home/sections/hero/hero.php` | Home Hero. Presents the advisor positioning, headline, supporting copy, primary Contact action, services action, and local tower image on desktop. |
| `pages/home/sections/services/services.php` | Services Snapshot. Renders eight service cells and a full-service management banner with carrier-rent and tower-lease messaging. |
| `pages/home/sections/clients/clients.php` | Who we help. Renders nine inline illustrative client wordmarks in a duplicated marquee track: Jemena, dexus, AusNet, MONASH, NSW Transport, Sydney WATER, ISPT, mirvac, and CITY OF SYDNEY. |
| `pages/home/sections/sectors/sectors.php` | Sector showcase. Renders four hover-expanding sector panels for Private land owners, REITS & Investment Banks, Critical infrastructure, and Government & education, followed by a red CTA band. |
| `pages/home/sections/about/about.php` | Home About split. Presents the SiteXcell story, independence positioning, client categories, a capability-statement card, and placeholder story/customer actions. |
| `pages/home/sections/insights/insights.php` | Home proof-points and insights. Renders four statistics plus a featured article and two supporting case-study cards. |

The Home page is more exploratory than the About page. Several utility-heavy sections use one-off markup and placeholder `#` links rather than the shared component layer.

### `pages/about/` - About marketing page

`pages/about/` is the most complete and reusable PHP page composition in the project.

| File/directory | Function |
| --- | --- |
| `pages/about/template.php` | Standalone WordPress document template. Emits the document shell, WordPress lifecycle hooks, skip link, shared Navbar, About orchestrator, and shared Footer. |
| `pages/about/about.php` | About page orchestrator. Includes nine sections in their defined order inside `main#main-content`. |
| `pages/about/sections/hero/hero.php` | About Hero. Renders the Australia wide badge, About SiteXcell H1, positioning statement, CTA links, and local consultation image. |
| `pages/about/sections/statistics/statistics.php` | Proven Experience section. Renders the four proof points `8,000+`, `6,500+`, `>$9M`, and `100+ years`. |
| `pages/about/sections/client-interests/client-interests.php` | Who We Represent section. Describes client categories, independence, conflict-free service, and commercial/operational priority protection. |
| `pages/about/sections/industry-experts/industry-experts.php` | Specialist Capability section. Uses the local infrastructure image and lists three risks: substantial revenue loss, missed revenue opportunities, and onerous operational/access obligations. |
| `pages/about/sections/maximising-returns/maximising-returns.php` | Commercial Outcomes section. Uses four check-marker Feature Cards: Commercial potential, Transparent dealings, Renewal strategy, and Portfolio perspective. |
| `pages/about/sections/adding-value/adding-value.php` | End-to-End Support section. Uses four numbered Feature Cards: Commercial decisions, Operational decisions, Specialist network, and Lifecycle support. |
| `pages/about/sections/leadership/leadership.php` | Experienced Leadership section. Renders local portraits and roles for Lisa Hall and Wayne Sander, plus Australia-wide office coverage copy. |
| `pages/about/sections/call-to-action/call-to-action.php` | Dark inverse CTA band inviting visitors to contact an experienced professional. |
| `pages/about/sections/contact/contact.php` | Contact layout. Renders the dark contact-information panel, phone number, office coverage, enquiry limitation, and the form adapter. |
| `pages/about/sections/contact/form-adapter.php` | Provider switch. Chooses Gravity Forms when a positive configured form ID and `gravity_form()` function are available; otherwise includes the fallback form. |
| `pages/about/sections/contact/prototype-form.php` | Visual-only fallback enquiry form with visible labels, browser validation, provider disclosure, and a status region. |

### `pages/access-portal-page/` - standalone Co-Siter portal prototype

| File | Function |
| --- | --- |
| `pages/access-portal-page/prototype-ui.html` | Complete standalone HTML/CSS/JavaScript portal concept. Defines the Co-Siter shell, sidebar, account bar, Requests page, request table, status summary, review drawer, sample request rows, inline SVG icons, responsive breakpoints, reduced-motion rules, and three switchable layout variants. |

This directory intentionally contains one self-contained HTML file rather than PHP components because it is a disposable application-interface exploration. It has no WordPress database access, authentication, API calls, or real actions.

### `pages/advisory/` - advisory information architecture placeholders

Each file below is a PHP page shell with a WordPress guard, an empty section list, an unused section-rendering closure, and a `main` placeholder. None is currently routed by `sitexcell-ui-prototype.php` or populated with sections.

| File | Intended page function |
| --- | --- |
| `pages/advisory/identifying-unauthorised-equipment/identifying-unauthorised-equipment.php` | Intended page for identifying unauthorised telecommunications equipment. |
| `pages/advisory/managing-access-to-your-property/managing-access-to-your-property.php` | Intended page for managing access to a property. |
| `pages/advisory/negotiating-a-new-lease/negotiating-a-new-lease.php` | Intended page for negotiating a new telecommunications lease. |
| `pages/advisory/selling-your-existing-lease/selling-your-existing-lease.php` | Intended page for selling or transferring an existing lease. |
| `pages/advisory/strategy-and-advice/strategy-and-advice.php` | Intended page for strategy and advice services. |
| `pages/advisory/understanding-land-access-activity-notices-laan/understanding-land-access-activity-notices-laan.php` | Intended page for explaining and handling LAAN matters. |

### `pages/agency/` - agency information architecture placeholder

| File | Intended page function |
| --- | --- |
| `pages/agency/telecommunications-management-agency/telecommunications-management-agency.php` | Intended page for SiteXcell's ongoing telecommunications management agency service. It is currently only a placeholder shell. |

### `pages/clients/` - client-segment information architecture placeholders

| File | Intended page function |
| --- | --- |
| `pages/clients/critical-infrastructure/critical-infrastructure.php` | Intended page for critical infrastructure owners. |
| `pages/clients/government-and-education-property-holdings/government-and-education-property-holdings.php` | Intended page for government and education property holdings. |
| `pages/clients/private-land-owners/private-land-owners.php` | Intended page for private land owners. |
| `pages/clients/reits-and-investment-banks/reits-and-investment-banks.php` | Intended page for REIT and investment-bank clients. |
| `pages/clients/testimonials/testimonials.php` | Intended page for client testimonials. |

All five are currently empty shells and are not registered routes.

### `pages/insights/` - insights information architecture placeholder

| File | Intended page function |
| --- | --- |
| `pages/insights/insights.php` | Intended Insights page orchestrator. It currently contains only a guarded empty `main` shell and no insight sections. The routed Insights prototype is instead `.scratch/insights-prototype/prototype-ui.html`. |

### `.scratch/` - disposable design experiments

`.scratch/` contains throwaway HTML explorations used to compare visual directions before migrating an approved pattern into `pages/` and `components/`. Each HTML file generally includes its own inline styles/scripts, loads the generated CSS and Geist Sans, uses static content, and exposes local query-string variant state.

| Directory/file | Code and function |
| --- | --- |
| `.scratch/clients/prototype-ui.html` | Compares Infinite Marquee, Minimal Grid, and Floating Badges presentations for the client-logo section. |
| `.scratch/contact-prototype/prototype-ui.html` | Compares Modern Split Panel, The Floating Card, and Minimalist Side-by-Side contact layouts; includes placeholder map visuals. |
| `.scratch/cta-variations/prototype-ui.html` | Compares Floating Pillar, Asymmetrical Split, and Minimalist Void CTA treatments. |
| `.scratch/home-hero/prototype-ui.html` | Compares Split Screen, Glassmorphism, and Dynamic Grid Home Hero compositions. Uses `.scratch/home-hero/bg.png`, a duplicate of the local Home hero asset. |
| `.scratch/insights-prototype/prototype-ui.html` | Compares three statistics treatments (Glassmorphism, Dark Strip, Clean White) and three insights layouts (Editorial, Slider, Minimalist List). |
| `.scratch/section-transitions/prototype-ui.html` | Compares The Overlap, SVG Angled Divider, and Soft Gradient Space transitions between page sections. |
| `.scratch/sectors/prototype-ui.html` | Compares Flex Accordion, Bento Hover Grid, and Interactive Tabs for sector presentation; also contains a separate `switchTab()` four-sector experiment. |
| `.scratch/services/prototype-ui.html` | Compares Light Table and Dark Table treatments for the services matrix. Uses `.scratch/services/banner.png`, a duplicate of the local Services banner asset. |
| `.scratch/story-difference/prototype-ui.html` | Compares Split Screen (50/50), Floating Cards, and Minimal Editorial treatments for the story/difference section. |

The plugin routes only the CTA, Insights, Contact, and Section Transitions scratch files. The other scratch files remain file-level experiments unless explicitly opened from the filesystem or later added to the route map.

### `docs/` - project, design, and handoff documentation

| Path | Function |
| --- | --- |
| `docs/DESIGN_INTERFACE_HANDOFF.md` | Canonical visual standard: brand character, colors, typography, grid, spacing, radii, borders, shadows, components, imagery, motion, responsive behavior, and accessibility requirements. |
| `docs/21ST_DEV_DESIGN_REFERENCES.md` | Records the 21st.dev, shadcn-inspired, and Stripe-inspired reference patterns and explains how they were adapted to SiteXcell, WordPress, PHP, Tailwind, and vanilla JavaScript. |
| `docs/PROJECT_STRUCTURE_OPTIMIZATION.md` | Explains the intended optimized structure, rendering flow, Tailwind workflow, JavaScript workflow, asset loading, behavioral invariants, form-provider handoff, new-page workflow, and prior validation notes. Some historical token/font wording may differ from current source files. |
| `docs/agents/domain.md` | Agent-facing guidance for domain terminology and modeling. |
| `docs/agents/issue-tracker.md` | Agent-facing guidance for issue tracking and project-task conventions. |

### `.agents/` - local Codex/agent development tooling

`.agents/` is not loaded by WordPress. It contains repository-local instructions and skill packages that guide automated development work.

| Path | Function |
| --- | --- |
| `.agents/code-format.md` | Repository-local formatting guidance. |
| `.agents/skills/code-review/` | Code-review skill package with an `openai.yaml` agent manifest and `SKILL.md` instructions. |
| `.agents/skills/grill-with-docs/` | Documentation-oriented plan-stress-testing skill with an agent manifest and `SKILL.md`. |
| `.agents/skills/prototype/` | Prototype skill package with an agent manifest and `SKILL.md`, `LOGIC.md`, and `UI.md` guidance. |
| `.agents/skills/setup-matt-pocock-skills/agents/openai.yaml` | Agent manifest for the skill-setup package. |
| `.agents/skills/setup-matt-pocock-skills/SKILL.md` | Instructions for setting up and maintaining the local skill package. |
| `.agents/skills/setup-matt-pocock-skills/domain.md` | Domain-modeling guidance used by the local setup skill. |
| `.agents/skills/setup-matt-pocock-skills/issue-tracker-github.md` | GitHub issue-tracker integration guidance. |
| `.agents/skills/setup-matt-pocock-skills/issue-tracker-gitlab.md` | GitLab issue-tracker integration guidance. |
| `.agents/skills/setup-matt-pocock-skills/issue-tracker-local.md` | Local issue-tracker integration guidance. |
| `.agents/skills/setup-matt-pocock-skills/triage-labels.md` | Triage-label conventions for local agent workflows. |
| `.agents/skills/to-spec/` | Specification-conversion skill package with an agent manifest and `SKILL.md`. |

The files in `.agents/skills/*/agents/openai.yaml` describe agent metadata. The Markdown skill files describe how an agent should work; they do not participate in the website runtime.

### `node_modules/` - generated development dependencies

`node_modules/` is generated by npm from `package.json` and `package-lock.json`. It contains Tailwind CLI and transitive packages used only during CSS development. It is not included in the WordPress request, does not ship as a browser runtime, and should not be edited manually. The lockfile is the authoritative dependency inventory.

### Folder ownership and change rules

| Change needed | Authoring location | Generated/consumed result |
| --- | --- | --- |
| Change route detection, shortcodes, hooks, asset loading, or provider configuration | `sitexcell-ui-prototype.php` | WordPress plugin behavior. |
| Change Home composition/order | `pages/home/home.php` | Home page section sequence. |
| Change About composition/order | `pages/about/about.php` | About page section sequence. |
| Change a structured page section | `pages/<page>/sections/<section>/` | Server-rendered section markup. |
| Change shared navigation/footer/primitives | `components/` | All pages using the component. |
| Change colors, typography, spacing, responsive utilities, or interaction CSS | `src/css/input.css` and template classes | Rebuilt `assets/css/style.css`. |
| Change shared marketing-page browser behavior | `assets/js/app.js` | WordPress prototype interactions. |
| Explore an unapproved visual direction | `.scratch/` | Disposable static HTML experiment. |
| Change design rules or handoff standards | `docs/` | Human/agent design and implementation guidance. |

The normal runtime dependency direction is:

```text
WordPress request
  -> sitexcell-ui-prototype.php
  -> route/shortcode decision
  -> standalone template or page orchestrator
  -> shared components and page sections
  -> src/css/input.css -> assets/css/style.css
  -> assets/js/app.js
  -> browser-rendered prototype surface
```

`components/` and `pages/` may depend on WordPress functions and plugin constants. `assets/js/app.js` depends only on browser DOM APIs. `src/css/input.css` is compiled by npm/Tailwind. `.scratch/` files are intentionally less coupled and may use their own inline CSS/JavaScript.

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
- The routed scratch set is smaller than the scratch directory: the plugin routes CTA, Insights, Contact, and Section Transitions, but not the Clients, Home Hero, Services, Sectors, or Story/Difference scratch files.
- Home and About use different generations of composition: Home contains older one-off utility-heavy sections, while About uses the newer shared component system. The project should not assume that every Home pattern already conforms to the canonical design handoff.
- The portal status-summary totals do not include a Withdrawn summary button even though Withdrawn appears in sample rows. This is a prototype content/model decision that must be resolved before defining a production status model.
- Several polished actions are intentionally inert: many public-site links use `#`, portal controls do not query or mutate data, and scratch cards/links are not routed.
- Remote Unsplash and Fontsource assets can fail, change, or be unavailable; local images are the more stable runtime assets.

### Risks to manage

- A reviewer may mistake a polished static control for a working business action.
- A future developer may edit generated CSS and lose changes on the next build.
- A positive Gravity Forms ID may activate real submission behavior without complete privacy and failure-state review.
- Static links can point to production URLs while local prototype routes remain incomplete.
- Reusing the global app.js for growing portal logic could create unrelated page coupling.
- URI substring detection is convenient for local prototype routes but should be tightened if the plugin is used in a public production routing context.
- The route helper assumes `filemtime()` can read the generated CSS and JavaScript files; a packaging/deployment failure that omits `assets/css/style.css` can surface as an enqueue-time warning or an invalid version value.
- The portal is returned as an HTML template with its own complete document. Any future WordPress-wide hooks, analytics, consent handling, or security headers must be verified separately for that route.
- Documentation under `docs/` includes historical implementation notes whose font/token wording may differ from the current `Geist Sans` and SiteXcell token configuration. `src/css/input.css`, the PHP templates, and the plugin bootstrap are authoritative for current behavior.

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
| What WordPress hooks, constants, shortcodes, and form filter exist? | sitexcell-ui-prototype.php |
| What sections make up Home? | pages/home/home.php |
| What sections make up About? | pages/about/about.php |
| What secondary page shells exist? | pages/advisory/, pages/agency/, pages/clients/, pages/insights/ |
| What shared markup is reusable? | components/ |
| What browser behavior is shared? | assets/js/app.js |
| What design tokens and shared CSS patterns exist? | src/css/input.css |
| What CSS does WordPress serve? | assets/css/style.css |
| What npm dependencies and commands exist? | package.json and package-lock.json |
| What the portal screen renders and how its variants work? | pages/access-portal-page/prototype-ui.html |
| What scratch explorations exist? | .scratch/ |
| What terms and domain boundaries are canonical? | CONTEXT.md |
| What are the visual standards? | docs/DESIGN_INTERFACE_HANDOFF.md |
| What reference patterns were adapted? | docs/21ST_DEV_DESIGN_REFERENCES.md |
| What structure and handoff constraints exist? | docs/PROJECT_STRUCTURE_OPTIMIZATION.md |
| What terms should future work use? | This document’s domain model and docs/agents/domain.md |
| What is exploratory rather than core? | .scratch/ and the route table in this document |

## 21. Final project statement

SiteXcell UI Prototype is a WordPress-based, high-fidelity front-end prototype for a telecommunications property advisory website and a related Co-Siter access-management experience. It combines server-rendered PHP page composition, reusable UI primitives, Tailwind-generated styling, local brand assets, and small vanilla-JavaScript enhancements. Its purpose is to validate structure, content, design, accessibility, and interaction direction with real SiteXcell context. Its autonomy ends at the presentation boundary: it can show how the experience should work, but it does not yet own the authenticated data, integrations, workflows, or business decisions required to make the experience operational.

## 22. LAAN Request modernization integration

The LAAN Request surface is now a first-class modernization area inside the parent plugin repository. It is deliberately split into implementation, local verification, live characterization, and evidence so that research code cannot silently become production behavior.

### Test allocation

| Path | Function |
| --- | --- |
| `tests/laan-request/live/core/` | Three authenticated external-form characterization specs. They use existing Gravity Forms IDs through shared helpers. |
| `tests/laan-request/live/wave2/` | Eleven live test declarations covering 17 scenario checks for variants, dates, keyboard flow, reload, responsive behavior, upload recovery, validation, and strict improvement gates. |
| `tests/laan-request/support/form-helpers.js` | Live URL, synthetic values, field completion helpers, state readers, and fixture paths. |
| `tests/laan-request/support/session.js` | Authenticated Edge CDP/storage-state connection and final-submission network guard. |
| `tests/laan-request/support/run-live-session.ps1` | Explicit live-session runner, session setup, artifact archiving, and optional report serving. |
| `tests/laan-request/configs/` | Separate core and Wave 2 Playwright configurations. |
| `tests/laan-request/fixtures/` | Synthetic documents only. No real customer or production files belong here. |

### Selector compatibility contract

The live test helpers retain explicit mappings to the external Gravity Forms identifiers, including `input_1_11`, `input_1_12`, and `input_1_49`. A future UI implementation may introduce semantic selectors while preserving these mappings for integration work.

### Safety and rollout contract

The LAAN implementation surface is intentionally unowned while the workflow is being redesigned. Live tests are opt-in and retain a final-submission guard. Generated Playwright reports, traces, screenshots, videos, authentication state, and run history are ignored under `.test-artifacts/`; only sanitized findings and curated evidence are committed under `docs/testing/laan-request/`.

The accepted rollout order is: preserve the two-stage workflow and safety boundary; reject impossible dates; add a synchronized Page 2 summary; standardize upload feedback; preserve navigation and recoverable errors; investigate draft recovery; measure Site lookup effort; approve authoritative prepopulation sources; then validate a future UI implementation against the live characterization results.

### Parent repository ownership

The parent directory is the only Git root. The former `Sitexcell testcases/` nested repository is a migration source only and is removed after verification. The parent uses the existing `origin` remote, while authentication state and generated test output remain local and ignored.
