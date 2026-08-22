# SiteXcell Code Quality and Completion Standard

## Purpose

Use this document whenever creating, changing, refactoring, or reviewing code in the SiteXcell UI Prototype plugin. Its purpose is to keep every change professional, readable, correctly allocated, secure, accessible, and thoroughly verified before the work is declared complete.

The goal is not merely to make code pass. The result must remain logical, easy to understand, appropriately optimized, consistent with the project, and safe for another developer to maintain.

## Project Context

This repository is a front-end-focused WordPress plugin that renders standalone SiteXcell prototype pages. Its current stack and architecture are:

- WordPress and PHP for plugin registration, routing, page composition, templates, and reusable components.
- Tailwind CSS v4 for styling.
- Lightweight vanilla JavaScript for browser interactions.
- No React, TypeScript, JavaScript framework, JavaScript bundler, or component runtime.
- `sitexcell-ui-prototype.php` as the WordPress plugin bootstrap and routing entry point.
- `pages/<page-name>/` for standalone page templates, page orchestrators, and page-owned sections.
- `components/` for genuinely reusable PHP presentation components.
- `src/css/input.css` as the editable Tailwind and design-system source.
- `assets/css/style.css` as generated runtime CSS.
- `assets/js/app.js` as the canonical browser JavaScript file loaded directly by WordPress.
- `assets/images/` for local runtime image assets.

Before making a structural or visual change, read the relevant project documentation when it exists:

- `docs/PROJECT_STRUCTURE_OPTIMIZATION.md`
- `docs/21ST_DEV_DESIGN_REFERENCES.md`
- `docs/agents/domain.md`
- Relevant files under `docs/adr/`
- `CONTEXT.md` at the repository root or under `docs/`

Preserve SiteXcell terminology, branding, real content, and documented proof points. Do not invent claims, biographies, client relationships, statistics, integrations, or production behavior.

## Instruction Priority

Apply requirements in this order:

1. The user's current request and acceptance criteria.
2. Existing repository instructions and documented architectural decisions.
3. Existing behavior and public contracts that are not intentionally being changed.
4. The rules in this document.
5. General preferences or stylistic improvements.

When rules conflict, preserve correctness and explicit requirements first. Never make an unrelated cleanup that changes behavior simply to satisfy a style preference.

## Core Engineering Principles

### Professional code

- Write code that another developer can confidently read, review, test, and extend.
- Use direct control flow, cohesive functions, clear names, and predictable data movement.
- Avoid spaghetti code, deeply nested conditions, hidden side effects, duplicated branches, and unrelated responsibilities in one file or function.
- Prefer the simplest complete implementation that meets the requirement.
- Do not confuse fewer lines with better code. Concise code is valuable only when it remains clear, correct, and maintainable.
- Do not add clever abstractions, dense one-liners, or metaprogramming where straightforward code is easier to understand.
- Keep the level of abstraction consistent within a function or template.
- Make invalid or unsupported states difficult to represent where practical.

### Correctness and logic

- Understand the existing rendering and interaction flow before editing it.
- Preserve behavior outside the requested scope.
- Cover success, empty, missing, invalid, and failure states that are relevant to the change.
- Keep conditions mutually understandable and avoid contradictory state.
- Return early when it reduces nesting and makes guard conditions clear.
- Do not silently swallow errors that should be visible or handled.
- Do not assume an optional WordPress plugin, function, DOM node, asset, or external service exists. Guard optional dependencies explicitly.
- Keep prototype-only behavior clearly identified. Do not imply that the visual contact form submits, sends, or stores data when it does not.

### Focused changes

- Make the smallest coherent change that fully solves the task.
- Do not reformat, rename, or refactor unrelated code.
- Do not mix feature work with broad cleanup unless the cleanup is necessary for a safe implementation.
- Preserve existing public hooks, shortcodes, route slugs, file paths, DOM hooks, and CSS contracts unless the task explicitly changes them.
- If a public contract must change, update every consumer and document the migration or compatibility impact.

## Required Work Process

### 1. Understand before editing

Before writing code:

- Identify the requested behavior and the observable acceptance criteria.
- Inspect the entry point, direct consumers, nearby patterns, and relevant documentation.
- Trace the complete path affected by the change: WordPress request, route or shortcode, template, section/component, CSS, JavaScript, and assets as applicable.
- Identify existing behavior that must remain unchanged.
- Check whether the working area already contains user changes and preserve them.
- Determine which file owns the responsibility instead of adding code to the most convenient file.

Do not start a new abstraction until at least one real responsibility boundary or repeated pattern justifies it.

### 2. Plan the smallest coherent implementation

Decide:

- Which existing files require modification.
- Whether a new file is truly needed.
- What data enters and leaves each changed unit.
- Which failure and responsive states need coverage.
- Which checks can prove the change works.

Prefer modifying an appropriate existing unit over creating a pass-through wrapper, single-use utility, or empty directory.

### 3. Implement by responsibility

- Keep WordPress hooks and route registration in the plugin layer.
- Keep full-document structure in page templates.
- Keep page ordering and composition in page orchestrators.
- Keep page-specific markup and local data in that page's sections.
- Keep truly shared presentation in components.
- Keep reusable design tokens and shared CSS patterns in the Tailwind source.
- Keep browser behavior in the canonical JavaScript file and scope it through stable DOM hooks.
- Keep generated files and dependencies out of manual editing.

### 4. Self-review the complete change

Read the final change as a reviewer, not as its author:

- Is every changed line necessary?
- Is the logic obvious without reconstructing hidden assumptions?
- Is any responsibility in the wrong layer or file?
- Is behavior duplicated?
- Are names precise and consistent?
- Are dynamic values escaped at output?
- Are keyboard, focus, responsive, and reduced-motion behaviors intact?
- Are there stale comments, unused variables, temporary logging, placeholder links, or dead code?
- Did the change accidentally alter content, routes, design tokens, or public contracts?

### 5. Verify before finishing

Run the checks relevant to the changed files. Do not claim a check passed unless it was actually run and its result was inspected. If a check cannot run, state exactly what remains unverified and why.

## File and Responsibility Allocation

### Plugin bootstrap: `sitexcell-ui-prototype.php`

This file owns WordPress integration, including:

- Plugin metadata and shared constants.
- Prototype request detection.
- Asset registration and enqueueing.
- Shortcode registration.
- Standalone template routing.
- Small plugin-wide helpers and documented filters.

Keep visual section markup, page-specific content arrays, and browser interaction logic out of this file. If bootstrap logic becomes too large, extract a cohesive plugin concern only when the new file creates a clear boundary; do not split code merely to reduce line count.

### Page directories: `pages/<page-name>/`

Use this structure for standalone pages:

- `template.php`: the full HTML document integration for WordPress, shared navbar/footer includes, `wp_head()`, `wp_body_open()`, and `wp_footer()`.
- `<page-name>.php`: a lightweight page orchestrator that renders sections in their intended order.
- `sections/<section-name>/<section-name>.php`: markup, local data, and presentation logic owned by one page section.

New sections belong under their owning page. Do not place one page's unique section in `components/` just because it is visually large.

### Shared components: `components/`

Create or extend a component when it is reused, has a stable presentation contract, or isolates meaningful behavior. Examples in this project include the navbar, footer, section heading, badge, and feature card.

Component rules:

- Give each component one clear purpose.
- Document required and optional input variables when the component uses included-file variables.
- Supply intentional defaults only when they are safe and meaningful.
- Escape all dynamic output according to context.
- Avoid reading unrelated global state when the caller can pass the required value.
- Clean up temporary included-file variables if they could leak into the caller's scope.
- Do not create components that only rename a single HTML element or delegate immediately to another file.

### CSS: `src/css/input.css` and PHP templates

- Edit `src/css/input.css` for Tailwind imports, theme tokens, base rules, shared component classes, utilities, keyframes, and global accessibility behavior.
- Use Tailwind utility classes in PHP templates for local layout and presentation.
- Reuse existing `sx-` tokens and component classes before inventing near-duplicates.
- Keep one-off styles close to their owning markup through utilities when practical.
- Extract a shared CSS class when a stable pattern is repeated or a complex state cannot be expressed clearly inline.
- Rebuild CSS after changing Tailwind classes or `src/css/input.css`.

Never edit `assets/css/style.css` by hand. It is generated by `npm run build:css` and manual changes will be overwritten.

### JavaScript: `assets/js/app.js`

There is no JavaScript compilation pipeline. Edit `assets/js/app.js` directly.

- Keep the script framework-free and dependency-free unless the project architecture is explicitly changed.
- Scope behavior behind a relevant DOM query so pages without the feature remain unaffected.
- Treat queried elements as optional and guard them before use.
- Group selectors and behavior by feature.
- Use small named functions for repeated actions or state transitions.
- Keep ARIA attributes, visible labels, `hidden`, CSS state classes, and focus behavior synchronized.
- Use event delegation only where it meaningfully simplifies dynamic or repeated content.
- Prefer passive scroll listeners when the handler does not call `preventDefault()`.
- Avoid layout thrashing, repeated DOM queries inside hot paths, global variables, and duplicate listeners.
- Do not add a framework, package, transpiler, or bundler to solve a small interaction.

### Images and other assets

- Store runtime images under `assets/images/` with descriptive, stable filenames.
- Reuse a suitable existing asset before adding a duplicate.
- Optimize large image files when this can be done without visible quality loss.
- Provide accurate alternative text for informative images and empty alternative text for purely decorative images.
- Include intrinsic width and height when known to reduce layout shift.
- Remove a superseded asset only after confirming that no PHP, CSS, JavaScript, documentation, or prototype route references it.

### Generated and development-only locations

- Do not manually edit `node_modules/`.
- Change npm dependencies through `package.json` and keep `package-lock.json` consistent.
- Treat `.scratch/` as temporary prototype material, not the default home for maintained application code.
- Do not modify WordPress core, the active theme, or unrelated plugins for a change owned by this prototype plugin.

## PHP and WordPress Standards

### Structure and naming

- Start executable PHP files with `<?php` and guard direct access with `if (!defined('ABSPATH')) { exit; }` where appropriate.
- Follow the existing `sitexcell_ui_` prefix for global functions, hooks, constants, and public identifiers owned by this plugin.
- Use descriptive `snake_case` PHP variables and functions consistent with the repository.
- Use strict comparisons when the type is known.
- Keep functions focused and prefer early returns for guard clauses.
- Add return and parameter types where they match project compatibility and make the contract clearer.
- Use PHPDoc for WordPress-facing functions, non-obvious behavior, or included templates with an input contract. Do not add comments that merely repeat the code.
- Avoid unnecessary classes in this small procedural plugin. Introduce a class only when it provides real state ownership, lifecycle control, or a clearer cohesive boundary.

### WordPress integration

- Use WordPress APIs instead of reimplementing platform behavior.
- Register hooks in a predictable place and use named callbacks when they improve traceability.
- Load prototype assets only on requests that render the prototype.
- Use `SITEXCELL_UI_PATH` for filesystem includes and `SITEXCELL_UI_URL` for browser asset URLs.
- Check `file_exists()` before optional template inclusion when absence can be handled safely.
- Guard optional integrations with `function_exists()`, positive identifiers, and clear fallback behavior.
- Preserve shortcode output buffering so shortcode callbacks return markup instead of printing it outside the expected flow.
- Preserve `wp_head()`, `wp_body_open()`, `wp_footer()`, `language_attributes()`, `bloginfo('charset')`, and `body_class()` in standalone templates.
- Keep route detection, HTTP status changes, and template selection deterministic.

### Escaping, sanitization, and security

Escape output as late as possible and for the exact HTML context:

- `esc_html()` for visible text.
- `esc_attr()` for attribute values.
- `esc_url()` for URLs.
- `wp_kses_post()` only when a controlled value intentionally allows safe HTML.

Additional rules:

- Do not output untrusted data directly.
- Sanitize input before use and validate it against the expected domain.
- Treat `$_GET`, `$_POST`, `$_REQUEST`, `$_SERVER`, and stored WordPress values as untrusted.
- When reading slashed WordPress request data, unslash before applying the appropriate sanitizer.
- Use nonces and capability checks for any future state-changing WordPress action.
- Use prepared database queries if database access is ever introduced.
- Never expose secrets, credentials, internal paths, stack traces, or personal data to the browser.
- Do not add data storage, email delivery, CRM submission, authentication, or production form handling unless explicitly required and designed.

## Template and Markup Standards

- Use semantic elements such as `header`, `nav`, `main`, `section`, `article`, `footer`, headings, lists, buttons, and links according to their purpose.
- Keep one clear `h1` per standalone page and maintain a logical heading hierarchy.
- Use a button for an action and a link for navigation.
- Avoid invalid nesting and duplicate IDs.
- Ensure internal fragment links point to IDs rendered on the same page or to an intentional destination.
- Keep repeated content in structured PHP arrays and loops when doing so improves consistency and editing safety.
- Do not hide important content exclusively behind hover.
- Do not add decorative wrapper elements without a layout, semantic, or interaction purpose.
- Keep markup readable. Break long tags and conditions consistently when they become difficult to scan.
- Use comments only to explain a meaningful section boundary, constraint, or non-obvious decision. Remove tutorial-style, redundant, and stale comments.
- Preserve real SiteXcell wording and capitalization unless content changes are part of the request.

## CSS and Design-System Standards

- Preserve the SiteXcell visual language: SiteXcell red for primary actions and accents, charcoal and neutral surfaces for structure, restrained borders and shadows, and deliberate typography.
- Use theme tokens such as `sx-red`, `sx-charcoal`, `sx-foreground`, `sx-muted-foreground`, `sx-muted`, `sx-border`, and `sx-input` rather than scattering similar hardcoded colors.
- Use the shared `sx-container`, `sx-section`, display, button, card, label, and control patterns where they fit.
- Avoid arbitrary values when an existing token or standard Tailwind utility expresses the same design.
- Do not create several nearly identical button, card, container, or heading styles.
- Keep selectors scoped under `.sitexcell-ui-prototype`, `body.sitexcell-ui-prototype`, or a specific `sx-` component when a global rule could leak into the host WordPress site.
- Avoid `!important` unless overriding host or third-party CSS requires it and the reason is documented.
- Prefer transform and opacity for motion. Avoid animating expensive layout properties unless the effect specifically requires it and remains performant.
- Respect `prefers-reduced-motion` for non-essential animation and transitions.
- Verify hover, focus-visible, active, disabled, empty, and error states relevant to the component.
- Keep layouts responsive without relying on fixed viewport assumptions.
- Avoid horizontal overflow at narrow widths.
- Rebuild generated CSS and inspect the page after changing class names; Tailwind can only generate utilities it discovers in the source.

## JavaScript Quality Standards

- Keep behavior progressive: core content and navigation should remain understandable without JavaScript where practical.
- Model each interaction with a small, explicit state transition.
- Keep the DOM as the source of truth only when that state is already represented by attributes such as `hidden` or `aria-expanded`; otherwise use one clear state owner.
- Never let visible state and accessibility state disagree.
- Restore focus when dismissing an overlay or menu if the user's focus would otherwise be lost.
- Support Escape dismissal for appropriate temporary UI.
- Close or reset responsive UI when crossing breakpoints if stale mobile state could affect desktop rendering.
- Check `event.target` safely before calling element methods.
- Do not use inline JavaScript in PHP templates for behavior that belongs in `assets/js/app.js`.
- Remove `console.log`, debugger statements, test timers, and temporary instrumentation before completion.
- Run `node --check assets/js/app.js` after JavaScript changes.

## Accessibility Requirements

Accessibility is part of correctness, not an optional polish pass.

- Preserve the skip link and the `main` landmark.
- Maintain one logical page title and heading sequence.
- Give navigation regions useful accessible labels.
- Ensure controls have visible text or an accurate accessible name.
- Keep labels programmatically associated with form fields.
- Use `aria-expanded`, `aria-controls`, live regions, and other ARIA only when needed, and keep them accurate.
- Never replace native semantic behavior with ARIA unnecessarily.
- Ensure every interactive element is keyboard reachable and usable.
- Keep focus visible against every background.
- Verify focus order follows the visual and reading order.
- Do not rely on color alone to communicate meaning.
- Provide sufficient contrast for text, controls, borders that convey state, and focus indicators.
- Provide meaningful image alternatives without repeating adjacent text unnecessarily.
- Respect reduced-motion preferences.
- Confirm touch targets and spacing remain usable on mobile.
- If an interaction works only on hover, provide an equivalent focus, click, or always-visible path.

## Responsive and Cross-Context Requirements

At minimum, reason about and visually check narrow mobile, tablet, and desktop layouts.

- Content must not clip or produce unintended horizontal scrolling.
- Grids and multi-column sections must collapse into a logical reading order.
- Typography must wrap without obscuring controls or overflowing containers.
- Navigation must remain usable at the breakpoint where desktop and mobile variants switch.
- Images must crop intentionally and must not obscure critical text.
- Forms must remain readable and operable in a single-column layout when space is limited.
- Sticky elements must not cover anchors, focus targets, or content.
- The WordPress admin toolbar state must not break the prototype header behavior for signed-in users.
- Prototype assets must not leak onto ordinary WordPress pages.

## Performance and Optimization Standards

Optimize meaningful costs while keeping the code understandable. Do not optimize based only on intuition.

### PHP and WordPress

- Avoid repeated filesystem checks, expensive queries, or route calculations inside loops when the value can be computed once.
- Enqueue only the assets required for prototype requests.
- Keep included page data local and avoid unnecessary global state.
- Do not introduce remote requests into template rendering without an explicit requirement, timeout strategy, caching, and failure behavior.

### CSS

- Reuse tokens and shared patterns to limit unnecessary generated utilities.
- Remove source classes and rules only after confirming they are unused across PHP, JavaScript, and dynamically produced states.
- Avoid broad selectors that force excessive style recalculation or leak beyond the plugin.
- Avoid decorative effects whose rendering cost is disproportionate to their value.

### JavaScript

- Cache repeatedly used DOM references.
- Avoid repeated layout reads and writes in the same hot path.
- Keep scroll and resize handlers small, passive where possible, and throttled when they perform substantial work.
- Attach listeners only when the associated UI exists.
- Avoid loading new libraries for behavior that can be expressed clearly with the existing small script.

### Media and loading

- Use appropriately sized and compressed assets.
- Avoid adding duplicate font or image downloads.
- Preserve intrinsic image dimensions to reduce cumulative layout shift.
- Verify every referenced CSS, JavaScript, font, and image asset returns successfully.

An optimization is acceptable when it improves an observed or credible bottleneck without making the architecture harder to maintain. Document non-obvious performance tradeoffs.

## Code Smells to Prevent

Treat these as review prompts, not automatic reasons to create an abstraction:

- **Mysterious names:** identifiers that do not reveal their purpose or unit.
- **Long functions:** functions that perform several phases or responsibilities.
- **Deep nesting:** multiple levels of conditions that hide the primary path.
- **Duplicated logic:** the same decision or markup structure maintained in multiple places.
- **Shotgun changes:** one feature requiring unrelated edits across many files because ownership is unclear.
- **Divergent files:** one file changing frequently for several unrelated reasons.
- **Primitive obsession:** loose strings or arrays whose valid values and meaning are unclear.
- **Boolean blindness:** calls with multiple unexplained true/false arguments.
- **Feature envy:** code that mainly manipulates another unit's data and likely belongs there.
- **Hidden coupling:** included files depending on undocumented variables or global state.
- **Speculative generality:** extension points, options, factories, or wrappers with no current requirement.
- **Middle-man abstractions:** files or functions that only forward a call without adding a stable boundary.
- **Magic values:** unexplained route fragments, dimensions, delays, IDs, or repeated strings.
- **Dead code:** unused variables, unreachable branches, stale assets, commented-out implementations, or obsolete selectors.
- **Comment dependence:** code that needs a lengthy comment because its structure and names do not communicate its behavior.

Refactor only when the improvement is clear and the behavior can be verified.

## Comments and Documentation

- Explain why a non-obvious constraint or tradeoff exists; let the code show what it does.
- Keep file headers concise and accurate.
- Document public filters, shortcodes, component input contracts, generated-file workflows, and unusual integration requirements.
- Update documentation when a change alters project structure, rendering flow, build commands, runtime behavior, or known limitations.
- Remove or update comments in the same change when the behavior they describe changes.
- Do not leave TODOs without enough context to act on them. Complete necessary work now unless it is explicitly out of scope.

## Thorough Verification Checklist

Choose every check relevant to the change. A change is not thoroughly verified merely because one syntax command passes.

### Source review

- [ ] Re-read the user's request and confirm every requirement is implemented.
- [ ] Inspect the complete final diff or changed-file set.
- [ ] Confirm no unrelated user work was overwritten.
- [ ] Search for stale references after renaming or moving anything.
- [ ] Search for temporary logging, placeholder content, conflict markers, and dead code.
- [ ] Confirm generated files and dependencies were not edited manually.

### PHP and WordPress

- [ ] Run `php -l` on every changed PHP file.
- [ ] When the change is broad, run PHP lint across all plugin PHP files.
- [ ] Confirm direct-access guards where appropriate.
- [ ] Confirm dynamic output uses context-appropriate escaping.
- [ ] Confirm optional integrations and missing files have safe fallbacks.
- [ ] Confirm hooks, filters, shortcodes, route slugs, and includes resolve correctly.
- [ ] Confirm prototype routes return the intended standalone templates and HTTP status.
- [ ] Confirm ordinary WordPress pages do not receive prototype-only assets.

Suggested PowerShell lint command:

```powershell
Get-ChildItem -Recurse -Filter *.php | ForEach-Object { php -l $_.FullName }
```

### Tailwind and CSS

- [ ] Run `npm run build:css` after changing CSS source or Tailwind classes.
- [ ] Confirm the build completes without errors.
- [ ] Confirm `assets/css/style.css` changed only as generated output.
- [ ] Inspect affected pages at mobile, tablet, and desktop widths.
- [ ] Check overflow, wrapping, spacing, layout shifts, hover, focus, and reduced-motion behavior.
- [ ] Confirm CSS remains scoped and does not alter unrelated WordPress pages.

### JavaScript

- [ ] Run `node --check assets/js/app.js` after JavaScript changes.
- [ ] Test the interaction with mouse, keyboard, and touch-sized viewport behavior where relevant.
- [ ] Test missing-element guards on pages that do not render the feature.
- [ ] Confirm ARIA, `hidden`, labels, focus restoration, and visible state stay synchronized.
- [ ] Confirm there are no console errors or duplicate event effects.

### Accessibility and content

- [ ] Confirm one `h1`, a logical heading hierarchy, and semantic landmarks.
- [ ] Confirm the skip link reaches `#main-content`.
- [ ] Confirm every control has an accessible name and every field has a label.
- [ ] Confirm keyboard focus is visible and ordered logically.
- [ ] Confirm interactive behavior does not require hover alone.
- [ ] Confirm image alternatives and link labels describe their purpose.
- [ ] Confirm SiteXcell names, claims, proof points, contact details, and prototype disclosures remain accurate.

### Runtime and asset checks

- [ ] Load every affected route and confirm an HTTP 200 response when expected.
- [ ] Confirm changed CSS, JavaScript, image, and font assets load successfully.
- [ ] Confirm there are no PHP warnings, notices, JavaScript errors, broken links, or missing files.
- [ ] Confirm caching/version behavior still updates changed runtime assets.
- [ ] Confirm the contact fallback remains non-persistent unless a production provider was explicitly requested and configured.

## Definition of Done

Do not declare the work complete until all of the following are true:

- The requested behavior is fully implemented and matches the acceptance criteria.
- The implementation is clear, professional, cohesive, and free of unnecessary complexity.
- Code and assets are located in the correct project layer.
- Existing behavior outside the requested scope remains intact.
- Dynamic data is handled securely and escaped correctly.
- Accessibility, responsive behavior, and interaction states have been considered and checked.
- Relevant syntax, build, lint, runtime, and visual checks pass.
- Generated output is current where source changes require it.
- No dead code, temporary debugging, stale comments, unused imports or variables, placeholder links, or accidental artifacts remain.
- Documentation is updated when architecture or workflow changed.
- Any check that could not be completed is clearly disclosed, along with the exact reason and remaining risk.

The final completion report should be concise but specific: state what changed, name the important files, list the checks actually run, and disclose anything not verified. Never say "fully tested," "optimized," or "no issues" without evidence.
