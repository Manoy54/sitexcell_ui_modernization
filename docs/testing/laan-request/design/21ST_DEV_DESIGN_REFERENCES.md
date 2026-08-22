# 21st.dev Design References

## Purpose

This document records the 21st.dev components inspected for the SiteXcell About page redesign and explains how their visual patterns were adapted to WordPress, PHP, Tailwind CSS, and vanilla JavaScript.

The implementation uses SiteXcell's existing identity, content, photography, contact details, leadership, and proof points. No demo content, brands, biographies, social links, testimonials, or product claims from the reference components were copied.

## Selected References

### Header

**Primary reference:** [Centered Nav Header by 7ovr](https://21st.dev/@7ovr/components/centered-nav-header)

- Selected pattern: three-part desktop composition with brand at left, centered navigation, and actions at right.
- SiteXcell adaptation: SiteXcell logo, real navigation destinations, phone number, co-siter login, red Contact action, and an accessible mobile menu.

**Supporting reference:** [Sticky Header by Ozer](https://21st.dev/@ddoemonn/components/sticky-header)

- Selected pattern: a restrained sticky navigation state with clearer separation after scrolling.
- SiteXcell adaptation: the white navigation remains sticky and gains a subtle shadow. The WordPress admin bar is hidden after scrolling so the black bar does not remain above the SiteXcell header.

### Hero / About

**Primary reference:** [Editorial Hero by Felipe Menezes](https://21st.dev/@felipemenezes098/components/hero-05)

- Selected pattern: editorial hierarchy, asymmetric text columns, large display typography, and a wide image beneath the introduction.
- SiteXcell adaptation: "About SiteXcell" remains the page heading, the existing consultancy positioning remains the supporting copy, and the existing SiteXcell consultation image is the main visual.
- Deliberate change: the image height is constrained so the first proof-point section remains discoverable without an excessively tall hero.

### Statistics

**Primary reference:** [Bold Stats by UI Layout](https://21st.dev/@uilayout.contact/components/stats-bold)

- Selected pattern: one dominant proof point followed by a structured row of supporting statistics.
- SiteXcell adaptation: 8,000+ access requests is the lead statistic, followed by 6,500+ Land Access and Activity Notices, more than $9M in back rent identified, and 100+ years of combined team experience.
- Deliberate change: decorative gradient artwork was removed in favour of a flat neutral background and SiteXcell red accents.

### Industry Experts

**Primary reference:** [Feature with Image by Tommy Jepsen](https://21st.dev/@tommyjepsen/components/feature-with-image)

- Selected pattern: a strong image block paired with focused explanatory content.
- SiteXcell adaptation: the existing telecommunications infrastructure image is paired with SiteXcell's specialist capability copy and the three real property-owner risks.
- Deliberate change: the reference's decorative background treatment was removed to keep the page appropriate for a professional advisory firm.

### Maximising Returns

**Primary reference:** [Feature with Advantages by Tommy Jepsen](https://21st.dev/@tommyjepsen/components/feature-with-advantages)

- Selected pattern: an open, check-led advantages grid with generous spacing and minimal framing.
- SiteXcell adaptation: the advantages describe commercial potential, transparent dealings, renewal strategy, and portfolio perspective using the existing SiteXcell service proposition.

### Adding Value

**Primary reference:** [Enterprise-Grade Feature Grid by Unique Sonu](https://21st.dev/@uniquesonu/components/feature-grid-enterprise-grade)

- Selected pattern: a clear feature matrix with concise titles, descriptions, and restrained hover feedback.
- SiteXcell adaptation: four capability cells cover commercial decisions, operational decisions, SiteXcell's specialist professional network, and lifecycle support.
- Deliberate change: the implementation uses flat borders and square cells instead of app-style cards or decorative effects.

**Supporting reference:** [Feature Service Section by UI Layout](https://21st.dev/@uilayout.contact/components/feature-service)

- Selected pattern: strong section introduction followed by quickly scannable service areas.
- SiteXcell adaptation: the hierarchy is retained without highlighting one service above the others.

### Leadership

**Primary reference:** [Team Section by Ravi Katiyar](https://21st.dev/@ravikatiyar162/components/team-section-1)

- Selected pattern: a dark editorial band, circular portraits, and concise name/role presentation.
- SiteXcell adaptation: only Lisa Hall and Wayne Sander are shown, using the existing SiteXcell portraits and titles.
- Deliberate change: demo social links, registration actions, and invented biographies were excluded.

### Call to Action

**Primary reference:** [Centered Call to Action by Felipe Menezes](https://21st.dev/@felipemenezes098/components/cta-01)

- Selected pattern: a focused, centered statement with a single clear action.
- SiteXcell adaptation: the CTA uses SiteXcell red as a full-width page band and links directly to the contact section.
- Deliberate change: the rounded floating panel was converted to a full-width band to fit the page architecture and avoid a decorative card treatment.

### Contact

**Primary reference:** [Contact Card by Shaban Haider](https://21st.dev/@sshahaider/components/contact-card)

- Selected pattern: a dark contact-information panel beside a clean form area.
- SiteXcell adaptation: the left panel contains SiteXcell's real phone number, office coverage, and enquiry limitation. The right side retains all existing prototype fields and its visual-only disclosure.
- Deliberate change: the form remains non-functional by design and does not transmit or store personal information.

### Footer

**Primary reference:** [Minimal Footer by Nevsky](https://21st.dev/@nevsky118/components/footer)

- Selected pattern: generous whitespace, strong brand presence, restrained navigation, and a separated legal row.
- SiteXcell adaptation: the footer uses the SiteXcell logo, service links, real phone and address details, co-siter login, disclaimer, and privacy links.

**Supporting reference:** [Business Footer by Emdadul Islam](https://21st.dev/community/components/mdadul/footer)

- Selected pattern: practical service and contact groupings.
- SiteXcell adaptation: only relevant SiteXcell links and contact information were retained; demo newsletter, social, and gradient treatments were excluded.

## Design System Adaptation

- **Colour:** SiteXcell red is reserved for active navigation, actions, checks, labels, and the CTA. Charcoal, white, and a cool neutral grey provide the primary page structure.
- **Typography:** Segoe UI Variable, with Segoe UI and Arial fallbacks, is used across interface, body, display, and statistic typography.
- **Shape:** Buttons and form controls use a restrained 4px radius. Content sections are open page bands rather than nested cards.
- **Motion:** Interaction is limited to colour, underline, shadow, and background transitions. Reduced-motion preferences are respected.
- **Accessibility:** The page keeps semantic section headings, descriptive image alternatives, visible focus treatment, labelled form fields, mobile-menu ARIA state, and a live form-status message.
- **Responsive behaviour:** Editorial columns collapse into a single reading order; statistics and capability grids reflow; leadership profiles remain readable; and all contact fields become a single column on narrow screens.

## Shadcn-Inspired PHP Component Pass

Shadcn/ui is used as a visual reference, not as a runtime dependency. No React, TSX, Radix UI, hooks, contexts, or React form libraries are included. WordPress continues to render the complete page from PHP templates.

- **Reusable primitives:** `components/ui/badge/badge.php` supplies compact section labels, and `components/ui/feature-card/feature-card.php` supplies number and check variants used by capability grids.
- **Visual language:** White and zinc-like neutral surfaces, crisp one-pixel borders, subtle shadows, compact controls, visible red focus rings, and 6px to 8px radii reflect shadcn conventions while preserving SiteXcell red.
- **Typography:** Inter is loaded on the prototype route with system sans-serif fallbacks. Headings use strong 700 weight and body copy uses compact, readable measures.
- **Page composition:** The hero uses a centered badge, direct actions, and a bounded photographic surface. Statistics, principles, capabilities, and leadership are repeated card collections; page sections remain open bands rather than nested cards.
- **Forms:** The prototype and future Gravity Forms provider share the same compact labels, input proportions, borders, focus treatment, and button language. The provider adapter and visual-only disclosure remain unchanged.
- **Behavior:** Existing sticky navigation, mobile menu, WordPress toolbar handling, and prototype form feedback remain vanilla JavaScript and accessible HTML.

## Stripe-Inspired Typography and Density Refinement

Stripe was used only as a secondary visual reference for typographic confidence, information density, proportion, and content occupancy. SiteXcell's red, charcoal and neutral palette, logo, imagery, wording, page sections, and 21st.dev-inspired compositions remain unchanged.

### Typography Scale

- **Hero H1:** 44px on mobile, 48px on small screens, and 64px on desktop.
- **Section H2:** 30px on mobile, 36px on small screens, and 42px on desktop.
- **Card and feature H3:** 20px on mobile and 24px on larger screens.
- **Large body copy:** 18px to 20px with approximately 1.55 line height.
- **Standard body copy:** 16px with a 28px line height for service and feature descriptions.
- **Navigation:** 15px at medium weight.
- **Statistics:** 44px supporting values and a 64px lead value on desktop.

This increase prevents important text from appearing fragile while keeping mobile headings within a controlled scale.

### Font-Weight Hierarchy

- Display headings and statistics use a 650 semibold weight.
- Section and card headings, buttons, labels, and key statements use semibold weight.
- Navigation and prominent introductory copy use medium weight.
- Standard paragraphs and muted descriptions remain regular weight.

This creates hierarchy through deliberate contrast instead of making every element bold.

### Container-Width Strategy

The main container now uses the full available width up to 1320px, with 20px mobile, 24px tablet, and 32px desktop gutters. Important copy can extend to wider readable measures, while long paragraphs remain constrained enough for comfortable reading.

### Section-Spacing Strategy

Standard sections now use 48px mobile, 64px tablet, and 80px desktop vertical padding. Related headings, descriptions, lists, and grids use 16px to 48px internal spacing. This replaces repeated oversized gaps with a continuous page rhythm.

### Density and Visual Volume

- The desktop header was reduced to 76px.
- Statistics use stronger labels and a more controlled number scale.
- Maximising Returns now uses a substantial two-column feature grid rather than four narrow columns.
- Feature descriptions increased from 14px to 16px.
- Leadership portraits increased to 160px on larger screens.
- Contact copy and office details increased in size while retaining the split layout.
- The footer uses a neutral surface, larger logo, larger body text, and stronger navigation headings.

### Responsive Adjustments

Mobile sections use compact 48px vertical padding and 20px side gutters. The hero and section headings step down predictably, two-column feature grids collapse to one column, leadership portraits reduce without becoming avatar-sized, and the contact form remains single-column until enough width is available.
