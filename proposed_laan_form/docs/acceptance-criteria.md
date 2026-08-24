# Proposed LAAN Form Acceptance Criteria

## P0 criteria

- A valid Installation request can progress through both stages without losing values.
- Inspection and Maintenance remain selectable activity variants.
- Missing required values and terms prevent progression with inline recovery guidance.
- Impossible dates such as `32-13-2026` are rejected inline without a server error.
- Valid date boundaries remain accepted according to the approved date policy.
- Back and forward navigation preserve valid values.
- Activity changes invalidate only affected conditional values and confirmations.
- Replacing a confirmed required upload requires re-review.
- Removing a confirmed required upload makes the request incomplete.
- Upload failures provide retry without resetting unrelated fields.
- Required confirmations and declarations contribute correctly to readiness.
- The ready state is simulated and does not submit externally.

## P1 efficiency criteria

- Site lookup effort is measurable and improves over the current unfiltered selection experience.
- The Stage 1 context remains visible on Stage 2.
- Keyboard users can complete the workflow and reach all critical controls.
- The layout remains usable on responsive viewports.
- Draft save, restore, discard, and unsaved-change behavior are explicit.
- Invalid file type, exact-size, over-size, replacement, removal, and retry states are testable.

## Evaluation gate

The prototype is successful only when all P0 criteria pass, no required behavior is lost, and comparable user testing shows at least a 20% improvement in completion effort or time without a material secondary regression.

