# ADR-0001: Capability-oriented Access Request test structure

- Status: Accepted
- Date: 2026-08-29
- Scope: Access Request automated test suite

## Context

The Access Request test suite has grown from an initial Step 1–4 effort into a
full Step 1–8 test scope. Organizing source files around the historical progress
boundary makes cross-step journeys difficult to locate and encourages the test
architecture to mirror implementation history rather than the behavior being
verified.

The suite also contains focused behavior checks, continuous journeys, quality
measurements, and cases intentionally blocked by unresolved product or
governance prerequisites. These have different execution boundaries even when
they touch the same workflow steps.

## Decision

Organize live Access Request tests under one `live/access-request/` suite with
three essential areas:

- `journeys/` for continuous and state-preservation workflow paths.
- `behaviors/` for functional, conditional, document, upload, navigation,
  recovery, and decision-gated behavior.
- `quality/` for accessibility, responsive, and efficiency evaluation.

Authentication preflight remains at the suite root. Reusable navigation and
control logic remains in `tests/access-requests/support/`. Steps remain explicit
metadata on each case rather than directory boundaries.

The case catalog remains the authority for stable IDs and coverage. A case has
one canonical source file even when it has multiple capability labels.

## Alternatives considered

### One directory or file per workflow step

Rejected because cross-step journeys would be fragmented or duplicated, and the
structure would remain tied to a UI staging decision.

### One large file per test family

Rejected because unrelated assertions, fixtures, and prerequisite policies would
become difficult to isolate as the catalog grows.

### Separate suites for Step 1–4 and Step 5–8

Rejected because it repeats the historical progress split and obscures the fact
that the Access Request is one workflow. Focused runs should filter one unified
suite instead.

## Consequences

Positive:

- Continuous Step 1→Step 8 journeys are easy to find.
- Focused behavior tests remain isolated and fast to diagnose.
- Step coverage remains explicit and machine-checkable.
- Case IDs and historical results remain stable.
- Future catalog cases can be added by capability without inventing new step
  range folders.

Costs:

- Migration requires careful import and Playwright discovery updates.
- Cases that span multiple capabilities need one canonical home plus metadata.
- The case catalog and result schema must be kept aligned with source files.

## Safety and status rules

This decision does not authorize bypassing authentication, field-map, safety,
staging, document, copy, or draft-lifecycle gates. A blocked prerequisite remains
`BLOCKED` and is distinct from both an assertion failure and a passing result.
The Step 1→Step 8 journey stops at the Step 8 review state and never submits.

## Implementation boundary

The structure plan is documented separately in
`docs/testing/access-request/access-request-test-structure-plan.md`. Source
files and commands now follow that plan. Live evidence remains subject to the
authentication, field-map, safety, staging, document, copy, and draft-lifecycle
prerequisites recorded by the test suite.
