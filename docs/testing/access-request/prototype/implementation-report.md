# Access Request prototype implementation report

Status: Implemented and locally verified on 2026-09-09.  
Artifact: [`co-siter_dashboard/proposed_access_request_form/`](../../../../co-siter_dashboard/proposed_access_request_form/)
Authority: Isolated prototype behavior only; no production business-rule approval.

## Delivered outcome

The accepted 16-part direction is implemented as an autonomous eight-stage
Co-Siter Access Request prototype. It follows the selected LAAN application
shell, palette, density, typography, progress treatment and responsive
workspace pattern. It runs from one command, uses only fictional records,
stores recoverable values in the current browser tab, and cannot submit.

Implemented behavior includes:

- all eight observed stages through review, Back navigation, completed-stage
  revisits, error summaries, first-error focus, Edit-and-return, and
  recalculated readiness;
- searchable fictional Site selection by name, address and canonical ID with
  arrow-key/Enter/Escape operation and Site-specific acknowledgement reset;
- complete captured Step 1 Owner and Site dropdown label inventories mapped into
  searchable synthetic comboboxes, without provider IDs or production directory
  authority;
- stable contractor identities, one-to-ten groups, count reduction and
  restoration without transferring one contractor's values to another;
- explicit allowlisted copy, populated-target confirmation, independent target
  editing, source isolation, safe Undo, and state-layer rejection of forbidden
  source/target pairs;
- conditional value stashing/restoration, inactive-value exclusion, and a
  visible review reminder;
- independent document identity, field-specific size/type/multiplicity contracts,
  current-expiry checks, current/expired saved-document demonstrations,
  prior-valid and unrelated-file preservation, related-confirmation
  invalidation, removal, simulated failure/retry, and reload reselection;
- notes-guided multi-file qualification uploads with per-file status, compact
  red validation copy, explicit per-file Remove actions, driver-licence
  rejection, valid-file preservation, picker cancellation feedback and honest
  reload reselection messaging;
- fictional returning-person and linked-LAAN demonstrations that preserve
  populated conflicting values instead of silently overwriting them;
- a separate reviewer panel, synthetic complete scenario, live-baseline facts,
  original field identities, and an always-disabled final submission action;
- desktop, narrow-reference and phone layouts with a collapsible mobile request
  summary, wrapping filenames, touch-sized controls, focus states, reduced
  motion support and forced-colors fallbacks.

## Verification result

Command:

```powershell
npm.cmd run test:prototype:access
```

Result on 2026-09-11:

| Suite | Result | Public seam |
| --- | ---: | --- |
| State model and server | 18 passed | preservation, branch, copy, contractor, saved/local documents, complete Owner/Site option mapping, multi-file upload states, hostile session rejection, stale-file, recovery and malformed-request contracts |
| Browser workflow | 17 passed | visible workflow, focus, Owner/Site keyboard use, complete captured option lookup, review, notes-guided upload feedback, cancellation/reselection, saved/local uploads, malformed paths, responsive reflow and accessibility preference layouts |
| Total local declarations | 35 passed | grouped evidence for explicitly named Access Request concerns |

The browser pass uses the machine's existing local Chromium build because the
installed Playwright package expects a newer optional browser bundle. This is
isolated in the prototype Playwright configuration and does not alter the live
Access Request suite.

Syntax checks passed for the application, state model, fixtures and local
server. Visual captures were inspected at 1440×900, 1361×636 and 390×844.
Automated reflow checks cover 320, 390, 640, 768 and 1024px without unintended
horizontal overflow; 640px is the automated reflow equivalent of a 1280px
viewport at 200% zoom. Actual browser-chrome zoom remains a manual review item
and is not represented as a full PA-A05 pass.

## Coverage accounting

The source inventory remains 264 field rows and 392 captured controls in
[`field-disposition-plan.json`](./field-disposition-plan.json). The prototype
source directly retains 89 unique original input identities. Exact-ID matching
in the synchronized register classifies 48 rows as direct semantic controls
and 80 repeated rows as implemented through the contractor component (128
implemented rows total), 31 as provider-only exclusions, and 105 as mapped
production deferrals. These are implementation dispositions, not 264
individual field executions: all 128 present rows still identify their
field-level checks as NOT-RUN. The remaining rows include widget auxiliaries,
hidden transport values, duplicate
navigation/submission controls, inactive branch variants and production-rule
details that cannot honestly become local business truth.

The 64 live catalog IDs remain mapped once each in
[`test-case-plan.json`](./test-case-plan.json). They are concerns, not a demand
for 64 duplicate local executions. The 35 local declarations deliberately
group equivalent public behaviors. Evidence is not inferred from family or
scope: five concerns have a full automated PASS, 28 have narrower automated
PARTIAL-PASS evidence, five are available but unexecuted guided demonstrations,
14 are implemented only partially and remain NOT-RUN, and 12 are measurement
methods that remain NOT-RUN.
Decision-gated and measurement entries keep
their external deferrals; a local demonstration does not rewrite their live
PASS, FAIL, BLOCKED or NOT APPLICABLE classifications.

## Explicitly not implemented

These items require authority or systems outside the external-tester boundary:

- approved production rules, role permissions and final legal wording;
- real authentication, person/Site/document directories or LAAN integration;
- server uploads, malware scanning, persistence, notifications or submission;
- provider configuration or a repair to the external U04/R03 behavior;
- production draft expiry, cross-device recovery and multi-user isolation;
- claims of percentage or time savings without comparable participant sessions.

The prototype is ready for interface and behavior evaluation. It is not ready
to replace or connect to the production provider without the unresolved owners
and decision gates in the implementation plan.
