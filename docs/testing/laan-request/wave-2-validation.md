# LAAN Validation Wave 2 — Execution and Evidence Guide

## Objective

Wave 2 tests the LAAN questions that remained unresolved after the five-test functional baseline. It expands evidence without changing the live form, creating a request, or treating automated runtime as human usability evidence.

## Current status

- Latest repaired Core run: **3 / 3 passed** in `LAN-20260824-115125-612` after adapting the approved test Site to the live form's backing-field contract.
- Latest repaired Wave 2 run: **6 / 7 passed** in `LAN-20260824-115207-405`; all Site-dependent paths now reach their intended assertions, and only the malformed-date application defect remains.
- Core regression: **3 tests**, **3 / 3 passed** in the final authenticated run `LAN-20260822-104333-974`.
- Wave 2: **11 test declarations across 8 files**: the original 7 consolidated tests plus 4 strict improvement goal gates.
- The suite now preserves the original 13 scenario checks and adds acceptance gates for upload replacement/removal confirmation drift and Stage 1/Stage 2 reload data loss.
- Historical pre-consolidation Wave 2 result: **12 / 13 passed** in `LAN-20260822-104424-613`.
- Historical pre-consolidation combined result: **15 / 16 passed**; the only failure was the malformed-date acceptance test.
- Date-boundary and responsive checks passed in the final headless run; earlier visible-browser timeouts were not reproduced.
- Keyboard rerun: **2 / 2 passed** in `LAN-20260817-234416-180` after targeting the public Browse interaction.
- Remaining failure: the malformed-date acceptance test. The original run advanced to Stage 2; reruns `LAN-20260817-234509-287` and `LAN-20260817-235644-162` displayed a WordPress critical-error page instead of inline rejection.
- Final submission: excluded and guarded in every automated case.
- Data: synthetic fixtures only.

## Test boundary

The public seam is the authenticated LAAN form:

```text
Open authenticated form
    → enter synthetic values
    → exercise a visible workflow behavior
    → collect assertions and evidence
    → stop before final submission
```

Wave 2 has its own Playwright configuration. This keeps the proven three-test core command stable while the additional behavior is investigated.

## Automated groups

### 1. Activity variants — 1 matrix test

Command:

```powershell
npm run test:laan:live:variants
```

Tests:

- Inspection and Maintenance each reach Stage 2 and record conditional field state within one isolated matrix test.

Expected evidence:

- whether each activity can progress with the synthetic Site;
- which cable, riser, fibre, drawing, and confirmation controls are visible or enabled;
- zero final submission attempts.

### 2. Stage 1 validation — 3 tests

Command:

```powershell
npm run test:laan:live:validation
```

Tests:

- empty required fields keep the user on Stage 1 and show feedback;
- missing terms preserves valid activity, date, and Site values, then recovers after correction;
- malformed date is rejected without clearing valid request context.

Expected evidence:

- visible validation messages;
- field-level error identification;
- value preservation after a recoverable validation error;
- successful correction without final submission.

### 3. Valid date boundaries — 1 matrix test

Command:

```powershell
npm run test:laan:live:date-boundaries
```

Tests:

- first and last days of a future year each advance to Stage 2.

These checks cover valid day-of-year boundaries without attempting final submission. Impossible-date rejection remains covered by the malformed-date test and remains an application defect until the live form rejects it inline.

### 4. Upload and confirmation recovery — 3 tests

Command:

```powershell
npm run test:laan:live:upload-recovery
```

Tests:

- replace the required LAAN attachment without clearing access details;
- clear the required attachment and record whether the separate LAAN confirmation remains checked;
- select two optional supporting documents through the multi-file control.

Expected evidence:

- filename replacement and removal behavior;
- preservation of the seven core Stage 2 values;
- whether file and declaration states can become inconsistent;
- multi-file selection behavior;
- zero final submission attempts.

File-type, file-size, malware/security, and server-retry behavior are not inferred from these tests. The live file inputs do not expose a declared accepted-type list, and final validation remains outside the default boundary.

### 5. Reload characterization — 2 tests

Command:

```powershell
npm run test:laan:live:reload
```

Tests:

- record Stage 1 values before and after reload;
- record Stage 2 values and active stage before and after reload.

These are characterization tests. A passing Playwright result means the probe completed and evidence was captured; inspect the attached JSON to determine which values were actually preserved. It does not automatically mean draft recovery exists.

### 6. Keyboard flow — 2 tests

Command:

```powershell
npm run test:laan:live:keyboard
```

Tests:

- verify Stage 1 critical controls are reachable in logical order;
- verify Stage 2 fields, both uploaders, confirmations, and final action are keyboard reachable.

Expected evidence:

- ordered focus sequence;
- missing or unreachable controls as explicit failures;
- zero final submission attempts.

### 7. Responsive critical paths — 1 matrix test

Command:

```powershell
npm run test:laan:live:responsive
```

Viewports:

- phone: `390 × 844`;
- tablet: `768 × 1024`.

The matrix test completes the synthetic path through Stage 2 at both viewports, fills the seven core access-detail values, selects the required LAAN file, verifies both upload areas and the final action are visible, and checks for horizontal document overflow.

### 8. Improvement goal gates — 4 acceptance tests

Command:

```powershell
npm run test:laan:live:gates
```

These tests are intentionally strict. They must fail while the known defects remain:

- removing a confirmed required LAAN file must invalidate its confirmation;
- replacing a confirmed required LAAN file must require confirmation again;
- reloading Stage 1 must preserve the completed activity, date, Site, and terms state;
- reloading Stage 2 must preserve the active stage and completed access details.

The goal-gate tests are acceptance tests, not characterization tests. A browser process that completes while losing values is a failed product result. They remain non-submitting and retain the final-action guard.

## Complete Wave 2 run

After the focused groups have been understood, run all 11 test declarations together:

```powershell
npm run test:laan:live:wave2
```

The consolidated suite retains 13 scenario checks inside the original 7 test declarations and adds 4 goal-gate declarations. The historical pre-consolidation run ended as follows:

```text
Running 13 tests using 1 worker
12 passed
1 failed — malformed commencement date was not safely rejected at Stage 1
Run status: FAILED
```

After the date, upload-state, and reload behaviors are corrected, all 17 scenario checks should pass within the 11 test declarations. Do not add retries or mark a goal gate as expected-to-fail merely to turn the suite green. The run wrapper archives the JSON report under `.test-artifacts/playwright/history/` and refreshes the current Wave 2 report at `.test-artifacts/playwright/wave2-results.json`.

## Focused reruns after diagnosis

The keyboard test was corrected to assert the public Browse interaction rather than the uploader's native file-input implementation:

```powershell
npm run test:laan:live:keyboard
```

Confirmed result: `2 passed` in `LAN-20260817-234416-180`.

The validation test now classifies and attaches the visible outcome before preserving the malformed-date failure: inline rejection, Stage 2 advancement, WordPress critical error, or unknown state.

```powershell
npm run test:laan:live:validation
```

Confirmed final result in `LAN-20260822-104424-613`: `2 passed, 1 failed` within the validation file. The failure explicitly recorded a WordPress critical error instead of inline rejection. This test should become green only after the form rejects impossible dates inline at the Stage 1 gate while preserving valid context.

The two critical-error outcomes should be correlated with WordPress/PHP logs around **2026-08-17 23:45** and **23:57 Asia/Manila**. Browser evidence proves the repeatable visible failure mode but cannot identify the failing server function or plugin without those logs.

## Core regression after Wave 2

After interpreting or correcting Wave 2 issues, rerun the current three-test Core regression:

```powershell
npm run test:laan:live
```

Final observed result:

```text
3 passed
Run status: PASSED
```

## Fresh-session recovery

If authentication has expired, run the relevant command through a refreshed session:

```powershell
.\tests\laan-request\support\run-live-session.ps1 -RefreshSession -ShowBrowser -SlowMo 300 -ConfigFile tests/laan-request/configs/playwright.wave2.config.js
```

## Non-automation task 1 — authoritative data workshop

Playwright can show what the form accepts, but it cannot decide which business record is authoritative. A product/data owner must resolve the following matrix before prepopulation or cross-workflow reuse is approved:

| Value | Candidate source | Decision required |
|---|---|---|
| Site and canonical ID | Site record | Confirm canonical relationship and inactive/duplicate handling. |
| Building address | Site record | Confirm whether the form uses a live value or request snapshot. |
| Site owner and requirements | Site relationship | Define precedence when ownership records conflict. |
| Site notes | Site record | Define freshness and whether notes must be acknowledged. |
| Carrier | Company/account record | Confirm identity, editability, and stale-record handling. |
| Tenant company/contact | Company/person records | Confirm whether these are reusable or request-specific. |
| Tenant location and areas accessed | Current request | Confirm that these remain request-specific. |
| Cable/riser/fibre details | Site, drawing, or request | Identify the authoritative source and activity conditions. |
| LAAN reference and documents | Current LAAN Request | Define snapshot, replacement, retention, and traceability rules. |

For every approved source, document freshness, conflict behavior, editability, audit trace, and whether downstream Access Requests need a live reference or a snapshot.

## Non-automation task 2 — human-effort baseline

Automated duration is not human completion time. Run at least three comparable user sessions using the same synthetic scenario and record:

- task start to ready-to-submit time;
- application wait time separately;
- manual fields and keystrokes;
- selections, clicks, uploads, and confirmations;
- scrolling distance or meaningful scroll actions;
- Site lookup time and wrong selections;
- validation corrections;
- backward navigation and external lookups;
- user-reported confidence and difficulty.

Use the median for comparison. The proposed 20–30% improvement remains a target until the same scenario is measured on a recommended form.

## Decision rule

Resume final LAAN form design when:

1. Wave 2 results have been interpreted and added to the findings report.
2. Any P0/P1 validation, responsive, upload-state, or data-loss issue has an explicit response.
3. Authoritative source decisions are documented for every proposed prepopulation or reuse feature.
4. A human-effort baseline exists for any claim about speed or ease of use.
