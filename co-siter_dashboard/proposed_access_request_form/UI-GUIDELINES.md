# Access Request UI guidelines

Use these rules for every succeeding UI change under `co-siter_dashboard/proposed_access_request_form`. This is an Operate surface: the interface should disappear into the task, keep the current state obvious, and remove avoidable scrolling without making controls cramped or unfamiliar.

## Preserve the contract

- Keep the eight-stage sequence, existing business copy, state transitions, validation behavior, session persistence, and non-submitting prototype boundary intact.
- Preserve semantic labels, keyboard access, visible focus, error associations, and every `data-original-id` mapping.
- Change shared helpers or tokens when the defect repeats. Use a section modifier only when the layout need is genuinely local.
- Keep UI-only state such as open menus and accordions outside the persisted request data.

## Layout and density

- Use `--form-gutter` for the stage header, form, notices, contractor groups, and sticky action bar. Do not introduce independent horizontal page gutters.
- Use the `.field-grid` two-column layout by default. A three-column layout is allowed only at a wide breakpoint when every field remains comfortably readable.
- Use `.field-wide` for textareas, long acknowledgements, inline action rows, and grouped document content. Use `.compact-choice-grid` when related radio or checkbox groups can share a row without awkward wrapping.
- Keep controls aligned within a row. When one field has helper text, give its peer equivalent structural space or move the fields to separate rows.
- Use `.document-grid` through `documentGroup()` for document cards. Direct document cards in a field grid create narrow, misaligned cards.
- Keep related fields close and separate distinct sections with one border and consistent section padding. Avoid one-off margins and position nudges.

## Control sizing and spacing

- Desktop text inputs, selects, and combobox triggers use the compact control token (`32px` currently). Mobile controls and primary actions remain at least `44px` high.
- Desktop textareas start compact (`72px` currently) and remain vertically resizable. Mobile textareas start taller for touch input.
- Labels sit directly above their control; helper text sits between the label and control. Errors sit directly below the affected control.
- Use the existing radii, border colors, focus treatment, and semantic state colors. Every new interactive control needs default, hover, focus, active, disabled, and error behavior where applicable.

## Dropdowns and transient UI

- Combobox option panels are viewport overlays. Keep them `position: fixed`, above the sticky footer and form controls, and position them through `positionOpenComboboxMenus()`.
- Opening a menu must not change field positions or document height. Align the menu width and left edge to its trigger; open above when there is insufficient room below.
- Keep only one combobox open. Close menus on outside pointer interaction, stage changes, selection, and Escape.
- Preserve Arrow Up, Arrow Down, Enter, and Escape behavior with focus remaining on the combobox trigger or query input.
- Motion communicates the open state only, lasts roughly 150–200ms, and respects `prefers-reduced-motion`.

## Scrolling and navigation

- Remove avoidable scroll through compact shared spacing, multi-column choice groups, document grids, and collapsed review details. Dense stages may still scroll; readability and touch access take priority over forcing every stage into one viewport.
- Keep the action bar sticky and ensure it never covers an open dropdown.
- Reset the form scroll position when moving between stages or editing a stage from Review.
- Once a user reaches a stage, backward navigation must not lock a later reachable stage. Review remains reachable after editing an earlier completed stage.
- Keep Review sections collapsed by default and independently expandable so users can verify details without loading the entire request into one long page.

## Responsive behavior

- Wide desktop: retain the sidebar, form, and request summary while prioritizing form width.
- Tablet: allow section headings to stack above fields when the side-by-side section layout would make fields narrow.
- Mobile: use one field column, 44px targets, a collapsible request summary, sticky top controls, and no horizontal overflow.
- Long labels, filenames, addresses, and validation messages must wrap without widening the page.

## Completion checklist

Before finishing an Access Request UI change:

1. Run `npm.cmd run test:prototype:access` with all unit, browser, and evidence checks passing.
2. Inspect all affected stages at approximately 1280×720, 768×900, and 390×844.
3. Verify zero horizontal overflow, logical tab order, visible focus, and no console errors or warnings.
4. Open each affected dropdown and confirm it stays inside the viewport, does not move later fields, and can be selected and dismissed by keyboard.
5. Navigate forward, backward, from the stage list, and from Review; confirm the destination starts at the top and later reachable stages stay enabled.
6. Review the source diff and remove one-off spacing values, obsolete selectors, accidental copy changes, and unrelated edits.
