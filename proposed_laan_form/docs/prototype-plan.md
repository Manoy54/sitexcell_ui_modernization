# Proposed LAAN Form Prototype Plan

## Status

The isolated prototype is implemented. The selected reference dashboard remains the shell. Page 2 now follows the live form's vertical flow and preserves the Request workspace rail.

## Goal

Improve the current LAAN request flow so users can complete it with approximately 20–30% less human effort and completion time, without reducing completeness, validation, traceability, review controls, or valid pre-submit behavior.

## Prototype boundary

This is a throwaway, isolated, non-submitting prototype. It must not add a WordPress route, call the production form handler, create records, send notifications, or use real personal, company, site, or document data.

The target location is the repository-local `proposed_laan_form/` directory.

`?step=2` opens the selected Page 2 direction with synthetic request context.

## Compatibility requirements

The prototype keeps the current LAAN form recognizable:

- Two stages remain in place.
- Existing field order and labels remain in place.
- Existing declarations remain in place unless wording is separately approved.
- Existing primary actions remain in place.
- Current visual language remains the baseline.
- New UI is limited to small context, status, helper, error, and recovery additions.

## Workflow

1. Stage 1 collects activity, commencement date, owner, Site, derived Site context, and terms.
2. Stage 2 collects the existing access details, technical fields where applicable, required and optional documents, confirmations, declarations, and the simulated completion state.
3. Back navigation preserves entered values.
4. Changing Stage 1 causes only affected downstream values or confirmations to require review.
5. Completion is available only when every required rule passes.

## Planned implementation order

1. Recreate the unchanged baseline structure with synthetic data.
2. Add the state model and preservation rules.
3. Add date and field validation with recovery.
4. Add Site lookup assistance without changing the selector's role or position.
5. Add upload lifecycle and confirmation invalidation.
6. Add the compact Stage 1 context summary and readiness feedback.
7. Add keyboard, responsive, and accessibility behavior.
8. Run the refined acceptance suite and compare effort against the current form.

## Stop conditions

Pause implementation when behavior depends on an unapproved:

- Activity or conditional-field rule
- Legal or business declaration
- Authoritative Site, company, or person source
- Draft retention, expiry, privacy, or shared-device rule
- Production submission or notification behavior

Record the decision required in the planning documents instead of guessing.
