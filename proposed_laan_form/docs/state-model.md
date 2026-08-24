# Proposed LAAN Form State Model

## Form state

| State | Meaning | Allowed next states |
| --- | --- | --- |
| `stage1-editing` | User is completing request context | `stage1-invalid`, `stage2-editing`, `draft-saved` |
| `stage1-invalid` | Stage 1 has one or more invalid or missing required values | `stage1-editing` |
| `stage2-editing` | Stage 1 is valid and Stage 2 is active | `stage1-editing`, `stage2-invalid`, `ready`, `draft-saved` |
| `stage2-invalid` | Stage 2 has missing, invalid, or unreviewed required information | `stage2-editing` |
| `draft-saved` | Current valid and incomplete state was explicitly saved in the prototype session | `stage1-editing`, `stage2-editing`, `draft-restored` |
| `draft-restored` | A saved state has been restored | `stage1-editing`, `stage2-editing`, `draft-saved` |
| `ready` | All required rules pass for simulated completion | `stage1-editing`, `stage2-editing` |

## Upload state

Each required document tracks its own state:

`missing` → `selected` → `uploaded` → `confirmed`

Replacement or removal always returns the affected document to an unconfirmed state:

- `confirmed` → `selected` when replaced
- `confirmed` → `missing` when removed
- any upload failure → `upload-error`, with retry available

## Invalidation rules

- Changing activity invalidates only fields and confirmations tied to the changed activity.
- Changing Site refreshes derived Site context and marks affected context for review.
- Replacing or removing a required file resets its confirmation.
- A malformed date never advances the form and never reaches a server handler.
- Back navigation does not clear values.
- Reload restoration is session-only in the prototype and is not a production retention decision.

