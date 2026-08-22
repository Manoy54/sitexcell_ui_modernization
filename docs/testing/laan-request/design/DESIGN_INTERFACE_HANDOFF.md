# SiteXcell Visual Design Reference

**Use:** Canonical visual standard for SiteXcell marketing and application design.  
**Covers:** Brand, color, theme, typography, layout, spacing, components, imagery, motion, responsiveness, and accessibility.  
**Excludes:** Page copy, business logic, routes, and feature specifications.

## 1. Visual Direction

SiteXcell should feel expert, independent, commercially confident, and trustworthy. The style is editorial and professional: strong typography, generous whitespace, white and cool-neutral surfaces, charcoal structure, focused red accents, real property/infrastructure photography, crisp borders, restrained rounding, and subtle motion.

Follow these principles:

- Create hierarchy with type, spacing, alignment, and contrast before decoration.
- Keep red meaningful; use it for actions, active states, markers, icons, and emphasis.
- Prefer open page bands and simple grids over layers of nested cards.
- Keep standard components slightly rounded, not soft or playful.
- Use shadows only to communicate elevation or interaction.
- Use authentic imagery; avoid generic technology or corporate stock aesthetics.
- Reuse shared tokens and patterns before introducing a new style.
- Treat accessibility as part of the design specification.

### Brand character

| Attribute | Design expression |
| --- | --- |
| Expert | Precise grids, confident headings, disciplined information hierarchy. |
| Independent | Direct layouts, minimal decoration, no carrier-style visual language. |
| Commercial | Clear actions, structured data, restrained emphasis. |
| Trustworthy | High contrast, consistent spacing, authentic photography. |
| Contemporary | Geist Sans, cool neutrals, crisp controls, subtle interaction feedback. |

## 2. Brand and Color

### Logo

- Use the approved logo without stretching, cropping, recoloring, outlining, rotating, or adding effects.
- Preserve its original aspect ratio and clear space equal to approximately one lettering cap height.
- Use the standard logo on white/light surfaces and an approved inverse asset on dark or photographic surfaces.
- Recommended width: **120–132 px in headers**, **180–210 px in footers**, and **120–160 px in compact application shells**.
- Never recreate the logo with styled text.

### Canonical palette

| Token | Value | Role |
| --- | --- | --- |
| `brand/red` | `#FF2D37` | Brand accent, markers, icons, large emphasis, active detail. |
| `brand/red-dark` | `#D8131D` | Primary action surface and small red text. |
| `brand/red-hover` | `#B20F17` | Hover/pressed action state and error text. |
| `brand/red-light` | `#FF5E67` | Accent on charcoal or dark imagery. |
| `neutral/charcoal` | `#18181B` | Headings, strong text, inverse sections. |
| `neutral/foreground` | `#27272A` | Default body text. |
| `neutral/muted-text` | `#71717A` | Secondary text on white. |
| `neutral/muted-text-strong` | `#62626B` | Secondary text on muted surfaces. |
| `neutral/muted-surface` | `#F4F4F5` | Alternate section and subtle hover surface. |
| `neutral/border` | `#E4E4E7` | Standard border and divider. |
| `neutral/input` | `#D4D4D8` | Form-control border. |
| `neutral/white` | `#FFFFFF` | Main canvas and component surface. |

### Usage ratio

- White: approximately **60–70%** of the visual area.
- Cool neutrals: approximately **20–30%**.
- Charcoal: approximately **5–10%**.
- Red: generally **less than 5%**.

Red should feel intentional. Do not use it for large page backgrounds, long paragraphs, or several competing actions.

### Surface themes

| Theme | Background | Heading | Body | Secondary | Accent/border |
| --- | --- | --- | --- | --- | --- |
| Light | White | Charcoal | Foreground | Muted text | Red / neutral border |
| Muted | Muted surface | Charcoal | Foreground | Muted text strong | Red / neutral border |
| Inverse | Charcoal | White | White 85–100% | White 65–75% | Red-light / white 15% |
| Image overlay | Charcoal gradient | White | White 85–95% | White 70–80% | Red or white rule |

The system is light-first. Charcoal bands are inverse surfaces, not a complete dark mode.

### Semantic colors

| State | Text | Surface | Border |
| --- | --- | --- | --- |
| Information | `#2468A8` | `#F0F7FF` | `#BCD7F2` |
| In progress/warning | `#99620A` | `#FFF9ED` | `#F0D29F` |
| Success/completed | `#187B50` | `#EFFAF4` | `#ABD9C3` |
| Neutral/inactive | `#6D7480` | `#F6F7F8` | `#D9DDE2` |
| Error | `#B20F17` | `#FFF1F2` | `#FDA4AF` |

Always pair semantic color with text, an icon, or another non-color indicator.

### Contrast

- Normal text: minimum **4.5:1**.
- Large text and essential graphics: minimum **3:1**.
- `#FF2D37` with white is approximately **3.70:1**; restrict it to large text or non-text accents.
- `#D8131D` with white is approximately **5.21:1**; use it for normal-size primary buttons.
- Test final opacity-based colors against their actual surface.

## 3. Typography

### Font stack

```text
Geist Sans, Geist, Inter, Segoe UI Variable, Segoe UI, Arial, sans-serif
```

Use Geist Sans as the primary family. Use weights **400, 500, 600, and 700**. Avoid making every heading, label, and paragraph bold.

### Type scale

| Style | Mobile | Tablet | Desktop | Weight | Line height |
| --- | ---: | ---: | ---: | ---: | ---: |
| Campaign display | 48 px | 60 px | 72 px | 700 | 1.05–1.10 |
| Page H1 | 44 px | 48 px | 64 px | 700 | 1.04–1.08 |
| Section H2 | 30 px | 36 px | 40 px | 700 | 1.10–1.15 |
| Strong CTA H2 | 30 px | 36 px | 48 px | 700 | 1.08–1.12 |
| Component H3 | 20 px | 22 px | 24 px | 600 | 1.20–1.30 |
| Subheading H4 | 18 px | 18 px | 20 px | 600 | 1.30 |
| Large body | 18 px | 18 px | 20 px | 400–500 | 1.55–1.65 |
| Standard body | 16 px | 16 px | 16 px | 400 | 1.65–1.75 |
| Small/control | 14 px | 14 px | 14 px | 400–600 | 1.45–1.60 |
| Caption/eyebrow | 12 px | 12 px | 12 px | 600 | 1.50–1.65 |

### Typography rules

- Body tracking: `-0.01em`; display tracking: approximately `-0.025em`; statistics: `-0.03em` to `-0.04em`.
- Uppercase eyebrow/application navigation tracking: `0.06em` to `0.10em`.
- Standard paragraph measure: **55–70 characters**; large introductions: maximum approximately **60 characters**.
- Left-align long text. Center only short headings and supporting statements.
- Do not reduce marketing body text below 16 px or persistent application text below 12–14 px.
- Use the 72 px campaign display only for an exceptional landing-page statement.

## 4. Layout and Spacing

### Grid

| Range | Columns | Outer gutter | Grid gap |
| --- | ---: | ---: | ---: |
| Mobile, below 640 px | 4 | 20 px | 16 px |
| Tablet, 640–1023 px | 8 | 24 px | 20–24 px |
| Desktop, 1024 px+ | 12 | 32 px | 24–32 px |

- Main container: centered, full width, maximum **1280 px**.
- Standard text block: maximum **672 px**.
- Wide introduction: maximum **768 px**.
- Centered hero composition: maximum approximately **896 px**.
- Form/reading column: approximately **640–720 px**.

### Section rhythm

| Viewport | Vertical padding |
| --- | ---: |
| Mobile | 48 px |
| Tablet | 64 px |
| Desktop | 80 px |
| Exceptional campaign section | Up to 96 px desktop |

### Spacing scale

| Token | Value | Typical use |
| --- | ---: | --- |
| `space/1` | 4 px | Micro-spacing. |
| `space/2` | 8 px | Label/icon gap. |
| `space/3` | 12 px | Compact metadata/control gap. |
| `space/4` | 16 px | Standard repeated-component gap. |
| `space/5` | 20 px | Badge-to-heading or compact padding. |
| `space/6` | 24 px | Standard component padding. |
| `space/7` | 28 px | Spacious card padding. |
| `space/8` | 32 px | Heading group or medium layout gap. |
| `space/10` | 40 px | Section introduction to grid. |
| `space/12` | 48 px | Large internal separation. |
| `space/16` | 64 px | Desktop column gap. |
| `space/20` | 80 px | Desktop section padding. |
| `space/24` | 96 px | Exceptional section spacing. |

Use a 4 px base. Related elements should be closer than unrelated groups. Default to 16 px between cards, 24–32 px inside cards/panels, 40–48 px between an introduction and its grid, and 40/64 px between major mobile/desktop columns.

### Responsive review widths

Design at **390, 768, 1024, and 1440 px**. Also validate **320 px minimum width** and **200% browser zoom**.

## 5. Shape, Border, and Elevation

### Radius

| Token | Value | Use |
| --- | ---: | --- |
| `radius/small` | 4 px | Small indicators and utilities. |
| `radius/control` | 6 px | Buttons, fields, icon controls, messages. |
| `radius/card` | 8 px | Cards, panels, image frames. |
| `radius/pill` | 999 px | Badges and status chips only. |

Keep standard components at 6–8 px. Avoid mixing 6, 8, 12, 16, and 24 px radii in one composition. Large 16–24 px radii require explicit campaign approval. Never round full-width page bands.

### Borders

- Standard: `1px solid #E4E4E7`.
- Inputs: `1px solid #D4D4D8`.
- Inverse divider: white at approximately 15% opacity.
- Active rule: 2–4 px red, proportional to the component.

### Shadows

| Level | Value | Use |
| --- | --- | --- |
| Subtle | `0 1px 2px rgba(24,24,27,.05)` | Inputs and compact controls. |
| Card | `0 1px 3px rgba(24,24,27,.08)` | Cards and framed images. |
| Raised | `0 4px 12px rgba(24,24,27,.10)` | Hovered card or floating utility. |
| Header | `0 3px 10px rgba(24,24,27,.08)` | Sticky header after scroll. |
| Application panel | `0 12px 30px rgba(34,42,55,.08)` | Large data panel only. |

Default surfaces should appear almost flat. Do not combine strong borders, strong shadows, and strong surface contrast without a clear hierarchy reason.

## 6. Component Styling

### Component specification matrix

| Component | Size and spacing | Surface and shape | Typography | Interaction |
| --- | --- | --- | --- | --- |
| Primary button | 40 px minimum; 44–48 px preferred; 16–24 px horizontal padding | Dark red, 6 px radius, 1 px matching border | 14–16 px semibold, white | Hover red-hover; visible red focus ring; pressed; disabled; loading |
| Secondary button | Same as primary | White, neutral border, 6 px radius | 14–16 px semibold, charcoal | Muted hover; same focus/state coverage |
| Inverse button | Same as primary | White/charcoal or transparent/white border | High-contrast label | Never use low-opacity label text |
| Icon button | 40–44 px square | White or transparent, 6 px radius | 20–24 px icon | Accessible name; hover, focus, pressed, disabled |
| Text link | At least 40 px interactive height when standalone | Transparent | Charcoal/dark red; underline offset about 4 px | Underline/color strengthens on hover and focus |
| Badge | 12 px horizontal, 4 px vertical padding | White, neutral border, pill, subtle shadow | 12 px semibold | Optional 6 px red marker; inverse variant on dark |
| Standard card | 24 px mobile; 28–32 px desktop padding | White, neutral border, 8 px radius, card shadow | Left-aligned hierarchy | Static unless it represents one action |
| Interactive card | Standard card sizing | Card-to-raised shadow; maximum 2 px lift | Same as standard | Hover and focus must be equivalent |
| Feature icon tile | 36–48 px | Red-tinted surface, 6 px radius | 20–24 px red outline icon | Decorative unless it controls an action |
| Major panel | 32–40 px desktop padding | White, border, 8 px radius, subtle shadow | Uses standard heading/body scale | Prefer dividers over nested cards |
| Marketing header | Approximately 80 px high | White 90–100%, border, optional blur | 14 px medium/semibold navigation | Sticky allowed; dark-red hover/active; 44 px mobile items |
| Input/select | 52 px marketing; 40–44 px application | White, input border, 6 px radius, subtle shadow | 14–16 px; visible 14 px label | Hover border; dark-red focus + translucent ring; error/disabled |
| Textarea | 160–176 px minimum | Same as input; vertical resize | Same as input | Same states as input |
| Status badge | 24–28 px minimum height | Semantic soft surface/border, pill | 10–12 px semibold | Include label and optional 5–6 px dot |
| Data row | 44–52 px high; 10–16 px horizontal padding | White, neutral divider | 12–14 px | Light hover; selected soft red + red edge marker |

### Buttons

- Use one primary action per visual group.
- Pair primary with a secondary or text action when needed.
- Icons are 16 px with an 8 px label gap.
- Include default, hover, focus-visible, pressed, disabled, loading, and confirmation states.
- Disabled controls must remain readable and cannot rely only on opacity.

### Cards and panels

- Keep cards open and text-led; do not place every section inside a card.
- Feature cards may use a number, check, or icon before the title.
- Typical feature-card height is approximately 224 px on desktop.
- Use 32 px marker-to-title and 12 px title-to-description spacing.
- Equal-height grid rows are preferred, but never truncate essential text to force equality.

### Forms

- Labels remain visible above controls with an 8 px gap.
- Required marker and errors use dark red.
- Placeholder text never replaces the label.
- Form row/column gap: 20–24 px.
- Stack to one column when controls become narrow.
- Long or important fields span the full width.
- Design default, hover, focus, filled, disabled, error, loading, and success states.

### Navigation

- Desktop navigation gap: approximately 28–32 px.
- Default link: charcoal; hover/active: dark red.
- Selected application items use red plus a visible marker, not color alone.
- Mobile menu controls and links should be at least 44 px high.
- All destinations must remain reachable at every viewport.

### Data and application UI

- Use a cool gray canvas with white panels and a charcoal structural bar.
- Keep dense text at 12–14 px and important targets at least 44 px.
- Use 1 px row dividers and restrained hover/selection surfaces.
- Allow horizontal table scrolling instead of compressing columns into unreadable widths.
- Search/filter controls use 40–44 px height and the standard focus treatment.

## 7. Iconography, Imagery, and Motion

### Icons

- Simple outline style; 24 × 24 view box; `currentColor` stroke; 1.8–2.25 px stroke; rounded caps/joins.
- Sizes: 16 px in buttons, 16–18 px in navigation, 20–24 px for standard features, 24–32 px for large features.
- Use one icon family. Avoid filled, cartoon, gradient, or three-dimensional styles.
- Decorative icons are hidden from assistive technology; icon-only actions require an accessible name.

### Photography

Prefer authentic Australian commercial property, telecommunications infrastructure in a property context, professional consultation, and consistent leadership portraits. Use natural color, credible environments, clear architectural lines, and useful negative space.

Avoid generic handshakes, unrelated technology imagery, oversaturated stock, low-resolution assets, carrier-like branding, or inconsistent filters.

Image rules:

- Use cover cropping while protecting faces and meaningful subjects.
- Define focal points for responsive crops.
- Use consistent square/portrait crops for people and wide crops for heroes/banners.
- Use charcoal gradients to support white text; keep the underlying image visible.
- Use red overlays only as a subtle atmosphere layer.
- Deliver intrinsic dimensions/aspect ratio, responsive crop notes, modern formats, and alternative-text intent.

### Motion

| Motion | Duration |
| --- | ---: |
| Control color/focus | 120–180 ms |
| Button/card hover | 180–220 ms |
| Menu/small panel | 200–300 ms |
| Editorial image effect | 500–700 ms |
| Major expansion | Maximum about 600 ms |

- Use ease-out for controls and `cubic-bezier(0.25,1,0.5,1)` for larger expansion.
- Keep card movement to 2 px and image zoom to approximately 105%.
- Never hide essential information behind hover.
- Avoid parallax, bouncing, flashing, and uncontrolled looping.
- Disable continuous animation and reduce nonessential transitions for reduced-motion users.

## 8. Responsive and Accessibility Rules

### Responsive behavior

- Stack multi-column layouts on mobile while preserving reading order.
- Collapse repeated grids from four to two to one column.
- Stack form fields before they become cramped.
- Remove or reposition decorative imagery before reducing content readability.
- Preserve intentional table scrolling for wide data.
- Never shrink touch targets just to make a layout fit.
- Use special application adjustments near 820 and 1180 px only when sidebars or data drawers require them.

### Accessibility requirements

- WCAG 2.2 AA contrast for text, controls, and meaningful graphics.
- Visible keyboard focus with a 2–3 px red outline and approximately 2 px offset.
- At least 44 × 44 px for important touch targets.
- Keyboard equivalent for every pointer interaction.
- Labels remain visible when fields contain values.
- Error, success, disabled, loading, empty, and selected states are designed explicitly.
- Status never depends on color alone.
- Heading hierarchy and responsive reading order remain logical.
- Informative images receive meaningful alternative text; decorative images use empty alternative text.
- Content remains usable at 320 px, 200% zoom, increased text spacing, forced colors, and reduced motion.

## 9. Design Handoff Standard

### Design-file structure

```text
00 Cover & Principles
01 Logo & Color
02 Typography
03 Grid & Spacing
04 Radius, Borders & Shadows
05 Buttons, Links & Badges
06 Cards & Panels
07 Navigation & Forms
08 Tables & Status
09 Iconography & Photography
10 Motion & Responsive
11 Accessibility States
12 Approved and Deprecated Patterns
```

### Component naming

```text
Button / Primary / [State]
Button / Secondary / [State]
Button / Inverse / [State]
Button / Icon / [State]
Link / Text / [State]
Badge / [Theme]
Card / [Type] / [State]
Form / [Control] / [State]
Navigation / [Type] / [Viewport or State]
Status / Badge / [Type]
Table / Row / [State]
```

Each component handoff must include anatomy, dimensions, token bindings, variants, interaction states, surface themes, responsive behavior, and accessibility notes.

### Final checklist

- [ ] Uses the canonical palette and correct bright/dark red roles.
- [ ] Uses Geist Sans and the approved scale, weights, tracking, and line height.
- [ ] Uses the 1280 px container, responsive gutters, and spacing scale.
- [ ] Uses 6 px control and 8 px card radii consistently.
- [ ] Uses one-pixel borders and restrained shadows.
- [ ] Includes all states for buttons, links, forms, navigation, cards, and data controls.
- [ ] Uses approved icon and photography direction.
- [ ] Includes 390, 768, 1024, and 1440 px designs where relevant.
- [ ] Meets contrast, focus, target-size, zoom, and reduced-motion requirements.
- [ ] Documents any deliberate extension before applying it across the system.

This reference is the visual standard for new SiteXcell design work. Extend it only when a requirement cannot be expressed through the existing foundations, and document the new token or component before broad use.
