# Access Request prototype implementation report

Status: Implemented and locally verified on 2026-09-09.  
Artifact: [`proposed_access_request_form/`](../../../../proposed_access_request_form/)  
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
- stable contractor identities, one-to-ten groups, count reduction and
  restoration without transferring one contractor's values to another;
- explicit allowlisted copy, populated-target confirmation, independent target
  editing, source isolation, safe Undo, and state-layer rejection of forbidden
  source/target pairs;
- conditional value stashing/restoration, inactive-value exclusion, and a
  visible review reminder;
- independent document identity, 10 MB demonstration limits, type checks,
  prior-valid and unrelated-file preservation, related-confirmation
  invalidation, removal, simulated failure/retry, and reload reselection;
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

Result on 2026-09-09:

| Suite | Result | Public seam |
| --- | ---: | --- |
| State model | 13 passed | preservation, branch, copy, contractor, field-specific documents, stale-file and recovery contracts |
| Browser workflow | 11 passed | visible workflow, focus, Site keyboard use, review, uploads, malformed URLs and responsive reflow |
| Total local declarations | 24 passed | grouped evidence for mapped Access Request concerns |

The browser pass uses the machine's existing local Chromium build because the
installed Playwright package expects a newer optional browser bundle. This is
isolated in the prototype Playwright configuration and does not alter the live
Access Request suite.

Syntax checks passed for the application, state model, fixtures and local
server. Visual captures were inspected at 1440×900, 1361×636 and 390×844.
Automated reflow checks cover 320, 390, 768 and 1024px without unintended
horizontal overflow.

## Coverage accounting

The source inventory remains 264 field rows and 392 captured controls in
[`field-disposition-plan.json`](./field-disposition-plan.json). The prototype
source directly retains 89 unique original input identities. The synchronized
register classifies 56 rows as direct semantic controls and 80 repeated rows as
implemented through the contractor component (136 implemented rows total), 31
as provider-only exclusions, and 97 as mapped production deferrals. Those
remaining rows include widget auxiliaries, hidden transport values, duplicate
navigation/submission controls, inactive branch variants and production-rule
details that cannot honestly become local business truth.

The 64 live catalog IDs remain mapped once each in
[`test-case-plan.json`](./test-case-plan.json). They are concerns, not a demand
for 64 duplicate local executions. The 24 local declarations deliberately
group equivalent public behaviors. The synchronized register records 32 main
concerns as implemented or partially covered by shared checks, 20 as available
guided demonstrations, and 12 as measurement methods that remain unrun.
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
