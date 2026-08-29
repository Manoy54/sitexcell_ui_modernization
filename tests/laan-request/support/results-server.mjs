import { createServer } from 'node:http';
import { readdir, readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, resolve, sep } from 'node:path';

// Integrated compact results dashboard for LAAN Requests and Access Requests results.
const root = resolve(process.cwd(), '.test-artifacts', 'playwright');
const historyRoot = join(root, 'history');
const port = Number(process.env.RESULT_VIEWER_PORT ?? 4173);
const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.png': 'image/png',
};

const dashboardHtml = String.raw`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>SiteXcell test dashboard</title>
  <style>
    @import url('https://cdn.jsdelivr.net/npm/@fontsource/geist-sans@5.0.1/index.css');
    :root {
      color-scheme: light;
      --red: #ff2d37; --red-dark: #d8131d; --red-soft: #fff1f2;
      --charcoal: #18181b; --foreground: #27272a; --muted: #71717a;
      --surface: #f6f6f7; --border: #e4e4e7; --white: #ffffff;
      --success: #187b50; --success-soft: #effaf4;
      --warning: #99620a; --warning-soft: #fff9ed;
      font-family: "Geist Sans", Geist, Inter, "Segoe UI Variable", "Segoe UI", Arial, sans-serif;
    }
    * { box-sizing: border-box; }
    html, body { min-height: 100%; }
    body { margin: 0; background: var(--surface); color: var(--foreground); -webkit-font-smoothing: antialiased; }
    button, select { font: inherit; }
    a { color: inherit; }
    button:focus-visible, a:focus-visible, select:focus-visible, summary:focus-visible { outline: 2px solid var(--red); outline-offset: 2px; }
    .app-shell { min-height: 100vh; display: grid; grid-template-columns: 224px minmax(0, 1fr); grid-template-rows: 62px minmax(0, 1fr); }
    .sidebar { grid-row: 1 / -1; display: flex; flex-direction: column; min-height: 100vh; border-right: 1px solid var(--border); background: var(--white); }
    .brand { min-height: 62px; display: flex; align-items: center; gap: 10px; padding: 0 18px; border-bottom: 1px solid var(--border); text-decoration: none; }
    .brand-mark { display: grid; place-items: center; width: 31px; height: 31px; border-radius: 7px; background: var(--red); color: var(--white); font-size: 11px; font-weight: 700; }
    .brand strong { color: var(--charcoal); font-size: 15px; letter-spacing: -.025em; }
    .brand small { display: block; margin-top: 1px; color: var(--muted); font-size: 9px; letter-spacing: .1em; text-transform: uppercase; }
    .nav-label { margin: 21px 18px 8px; color: #a1a1aa; font-size: 9px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; }
    .nav { display: grid; gap: 2px; padding: 0 9px; }
    .nav-item { width: 100%; min-height: 38px; display: flex; align-items: center; gap: 10px; padding: 0 10px; border: 0; border-radius: 6px; background: transparent; color: #52525b; cursor: pointer; font-size: 12px; text-align: left; text-decoration: none; }
    .nav-item:hover { background: var(--surface); color: var(--charcoal); }
    .nav-item.is-active { background: var(--red-soft); color: var(--red-dark); font-weight: 600; }
    .nav-icon { width: 18px; color: currentColor; font-family: ui-monospace, SFMono-Regular, Consolas, monospace; font-size: 12px; text-align: center; }
    .nav-chevron { margin-left: auto; color: #a1a1aa; transition: transform 160ms ease; }
    .nav-chevron.is-open { transform: rotate(90deg); }
    .nav-sub { display: grid; gap: 2px; margin: 2px 0 8px 28px; padding-left: 10px; border-left: 1px solid var(--border); }
    .nav-sub-item { min-height: 32px; padding: 0 9px; border: 0; border-radius: 5px; background: transparent; color: var(--muted); cursor: pointer; font-size: 10px; text-align: left; }
    .nav-sub-item:hover { background: var(--surface); color: var(--charcoal); }
    .nav-sub-item.is-active { color: var(--red-dark); font-weight: 700; }
    .nav-empty { padding: 7px 9px; color: #a1a1aa; font-size: 9px; line-height: 1.4; }
    .sidebar-bottom { margin-top: auto; padding: 14px; }
    .safety { padding: 13px; border: 1px solid var(--border); border-radius: 8px; background: #fafafa; }
    .safety strong { display: block; color: var(--charcoal); font-size: 11px; }
    .safety p { margin: 6px 0 0; color: var(--muted); font-size: 10px; line-height: 1.5; }
    .topbar { grid-column: 2; display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 0 24px; border-bottom: 1px solid var(--border); background: rgba(255,255,255,.96); }
    .breadcrumb { display: flex; align-items: center; gap: 8px; color: var(--muted); font-size: 11px; }
    .breadcrumb strong { color: var(--charcoal); font-weight: 600; }
    .top-actions { display: flex; align-items: center; gap: 8px; }
    .run-select { max-width: 245px; min-height: 34px; padding: 6px 28px 6px 9px; border: 1px solid var(--border); border-radius: 6px; background: var(--white); color: var(--foreground); font-size: 10px; }
    .button { min-height: 34px; padding: 7px 11px; border: 1px solid var(--border); border-radius: 6px; background: var(--white); color: var(--charcoal); cursor: pointer; font-size: 10px; font-weight: 600; text-decoration: none; }
    .button:hover { background: var(--surface); }
    .button-primary { border-color: var(--red-dark); background: var(--red-dark); color: var(--white); }
    .button-primary:hover { background: #b20f17; }
    .content { grid-column: 2; min-width: 0; padding: 24px 26px 48px; }
    .page-head { display: flex; align-items: flex-end; justify-content: space-between; gap: 20px; margin-bottom: 18px; }
    .page-head h1 { margin: 0; color: #20203f; font-size: 24px; letter-spacing: -.04em; }
    .page-head p { margin: 6px 0 0; color: var(--muted); font-size: 11px; line-height: 1.5; }
    .suite-switch { display: inline-flex; gap: 3px; padding: 3px; border: 1px solid var(--border); border-radius: 7px; background: var(--white); }
    .suite-tab { min-height: 30px; padding: 6px 10px; border: 0; border-radius: 5px; background: transparent; color: var(--muted); cursor: pointer; font-size: 10px; font-weight: 600; }
    .suite-tab.is-active { background: #29293f; color: var(--white); }
    .notice { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 14px; padding: 11px 13px; border-left: 3px solid var(--red-dark); border-radius: 4px; background: var(--red-soft); color: var(--red-dark); font-size: 11px; }
    .notice.is-success { border-left-color: var(--success); background: var(--success-soft); color: var(--success); }
    .notice strong { font-weight: 700; }
    .summary-strip { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); margin-bottom: 14px; border: 1px solid var(--border); border-radius: 8px; background: var(--white); overflow: hidden; }
    .summary-item { min-height: 72px; padding: 13px 15px; border-right: 1px solid var(--border); }
    .summary-item:last-child { border-right: 0; }
    .summary-item span { display: block; color: var(--muted); font-size: 9px; }
    .summary-item strong { display: block; margin-top: 7px; color: var(--charcoal); font-size: 19px; letter-spacing: -.035em; }
    .summary-item.is-failed strong { color: var(--red-dark); }
    .summary-item.is-passed strong { color: var(--success); }
    .workspace-grid { display: grid; grid-template-columns: minmax(0, 1fr) 264px; gap: 14px; align-items: start; }
    .surface { border: 1px solid var(--border); border-radius: 8px; background: var(--white); overflow: hidden; }
    .surface-head { display: flex; align-items: center; justify-content: space-between; gap: 14px; min-height: 52px; padding: 11px 15px; border-bottom: 1px solid var(--border); }
    .surface-head h2 { margin: 0; color: #20203f; font-size: 13px; letter-spacing: -.02em; }
    .surface-head p { margin: 3px 0 0; color: var(--muted); font-size: 9px; }
    .status-pill { display: inline-flex; align-items: center; gap: 6px; width: fit-content; padding: 4px 7px; border-radius: 999px; font-size: 9px; font-weight: 700; white-space: nowrap; }
    .status-pill::before { content: ""; width: 5px; height: 5px; border-radius: 50%; background: currentColor; }
    .status-passed { background: var(--success-soft); color: var(--success); }
    .status-failed { background: var(--red-soft); color: var(--red-dark); }
    .status-skipped, .status-review, .status-blocked, .status-inconclusive { background: var(--warning-soft); color: var(--warning); }
    .test-table { width: 100%; border-collapse: collapse; }
    .test-table th { padding: 9px 14px; border-bottom: 1px solid var(--border); background: #fafafa; color: #a1a1aa; font-size: 8px; font-weight: 700; letter-spacing: .08em; text-align: left; text-transform: uppercase; }
    .test-table td { padding: 12px 14px; border-bottom: 1px solid var(--border); color: var(--foreground); font-size: 10px; vertical-align: middle; }
    .test-table tr:last-child td { border-bottom: 0; }
    .test-table code { color: var(--muted); font-family: ui-monospace, SFMono-Regular, Consolas, monospace; font-size: 8px; }
    .test-name { max-width: 580px; }
    .test-name strong { display: block; color: var(--charcoal); font-size: 11px; line-height: 1.4; }
    .test-name span { display: block; margin-top: 4px; overflow: hidden; color: var(--muted); font-family: ui-monospace, SFMono-Regular, Consolas, monospace; font-size: 8px; text-overflow: ellipsis; white-space: nowrap; }
    .row-action { padding: 5px 7px; border: 0; border-radius: 5px; background: transparent; color: var(--muted); cursor: pointer; font-size: 10px; }
    .row-action:hover { background: var(--surface); color: var(--charcoal); }
    .test-detail td { padding: 0; background: #fcfcfd; }
    .detail-inner { padding: 14px 16px 16px 28px; border-left: 3px solid var(--red-dark); }
    .detail-inner p { margin: 0; color: var(--muted); font-size: 10px; line-height: 1.55; }
    .error { max-height: 160px; margin-top: 10px; padding: 10px; border-radius: 5px; background: var(--red-soft); color: var(--red-dark); font-family: ui-monospace, SFMono-Regular, Consolas, monospace; font-size: 8px; line-height: 1.5; white-space: pre-wrap; overflow: auto; }
    .evidence { margin-top: 10px; }
    .evidence summary { color: var(--charcoal); cursor: pointer; font-size: 9px; font-weight: 600; }
    .evidence pre { max-height: 190px; margin: 8px 0 0; padding: 10px; border-radius: 5px; background: var(--charcoal); color: var(--white); font-size: 8px; line-height: 1.5; overflow: auto; }
    .fact-list { margin: 0; padding: 3px 15px; }
    .fact-list div { display: grid; grid-template-columns: 84px 1fr; gap: 10px; padding: 11px 0; border-bottom: 1px solid var(--border); }
    .fact-list div:last-child { border-bottom: 0; }
    .fact-list dt { color: var(--muted); font-size: 9px; }
    .fact-list dd { margin: 0; color: var(--charcoal); font-size: 9px; font-weight: 600; overflow-wrap: anywhere; }
    .empty { padding: 36px 18px; color: var(--muted); font-size: 11px; text-align: center; }
    .command-bar { display: flex; align-items: center; gap: 10px; padding: 10px 15px; border-bottom: 1px solid var(--border); background: #fafafa; color: var(--muted); font-size: 9px; }
    .command-bar code { color: var(--charcoal); font-family: ui-monospace, SFMono-Regular, Consolas, monospace; font-size: 9px; }
    .overview-list, .insight-list { display: grid; }
    .overview-row { display: grid; grid-template-columns: 150px minmax(0, 1fr) 90px 80px; gap: 16px; align-items: center; padding: 15px; border-bottom: 1px solid var(--border); }
    .overview-row:last-child { border-bottom: 0; }
    .overview-row h3 { margin: 0; color: var(--charcoal); font-size: 12px; }
    .overview-row p { margin: 4px 0 0; color: var(--muted); font-size: 9px; }
    .overview-row code { color: var(--charcoal); font-family: ui-monospace, SFMono-Regular, Consolas, monospace; font-size: 9px; }
    .text-action { border: 0; background: transparent; color: var(--red-dark); cursor: pointer; font-size: 9px; font-weight: 700; text-align: right; }
    .insight-row { display: grid; grid-template-columns: 82px minmax(0, 1fr); gap: 16px; padding: 16px; border-bottom: 1px solid var(--border); }
    .insight-row:last-child { border-bottom: 0; }
    .insight-meta { display: grid; align-content: start; gap: 6px; }
    .insight-id { color: var(--muted); font-family: ui-monospace, SFMono-Regular, Consolas, monospace; font-size: 8px; }
    .priority { width: fit-content; padding: 3px 6px; border-radius: 999px; background: var(--warning-soft); color: var(--warning); font-size: 8px; font-weight: 700; }
    .priority.p0 { background: var(--red-soft); color: var(--red-dark); }
    .insight-copy h3 { margin: 0; color: var(--charcoal); font-size: 12px; }
    .insight-copy p { max-width: 820px; margin: 6px 0 0; color: var(--muted); font-size: 10px; line-height: 1.55; }
    @media (max-width: 920px) {
      .app-shell { grid-template-columns: 180px minmax(0, 1fr); }
      .workspace-grid { grid-template-columns: 1fr; }
      .summary-strip { grid-template-columns: repeat(3, minmax(0, 1fr)); }
      .summary-item:nth-child(3) { border-right: 0; }
      .summary-item:nth-child(n+4) { border-top: 1px solid var(--border); }
    }
    @media (max-width: 700px) {
      .app-shell { display: block; }
      .sidebar { min-height: auto; border-right: 0; border-bottom: 1px solid var(--border); }
      .brand { border-bottom: 0; }
      .nav-label, .sidebar-bottom { display: none; }
      .nav { display: flex; padding: 0 10px 10px; overflow-x: auto; }
      .nav-item { width: auto; flex: 0 0 auto; }
      .topbar { min-height: 58px; padding: 0 14px; }
      .breadcrumb, .run-select { display: none; }
      .content { padding: 19px 14px 88px; }
      .page-head { display: block; }
      .suite-switch { margin-top: 14px; }
      .summary-strip { grid-template-columns: 1fr 1fr; }
      .summary-item { border-top: 1px solid var(--border); }
      .summary-item:nth-child(-n+2) { border-top: 0; }
      .summary-item:nth-child(2n) { border-right: 0; }
      .test-table th:nth-child(2), .test-table td:nth-child(2) { display: none; }
      .overview-row { grid-template-columns: 1fr; gap: 8px; }
      .text-action { text-align: left; }
    }
  </style>
</head>
<body>
  <div id="app"></div>
  <script>
    const REPORTS = {
      core: { file: 'live-results.json', label: 'Core', configuredTests: 3, scenarios: 3 },
      wave2: { file: 'wave2-results.json', label: 'Wave 2', configuredTests: 7, scenarios: 13 },
      access: { file: 'access-request-results.json', label: 'Access Requests', configuredTests: 40, scenarios: 40 }
    };
    const ACCESS_PLAN = [
      { label: 'Core functional', total: 6, implemented: 6, ids: 'TC-AR-001–006' },
      { label: 'Conditional branches', total: 8, implemented: 4, ids: 'TC-AR-B01–B08' },
      { label: 'Recovery and uploads', total: 11, implemented: 11, ids: 'TC-AR-R01–R04, U01–U07' },
      { label: 'Person, document, Site, copy/reuse', total: 21, implemented: 4, ids: 'TC-AR-P01–P05, D01–D04, S01–S04, C01–C08' },
      { label: 'Efficiency', total: 10, implemented: 10, ids: 'TC-AR-E01–E10' },
      { label: 'Accessibility and responsive', total: 5, implemented: 5, ids: 'TC-AR-A01–A05' },
      { label: 'Cross-workflow', total: 3, implemented: 0, ids: 'TC-AR-X01–X03' }
    ];
    const SECTIONS = new Set(['overview', 'results', 'findings', 'recommendations', 'access-plan']);
    const FINDINGS = [
      { id: 'LAN-F09', priority: 'P1', title: 'Malformed dates are not safely rejected', body: 'The invalid date 32-13-2026 produced a WordPress critical-error page instead of inline Page 1 validation. The exact PHP exception remains unproven without server logs.' },
      { id: 'LAN-F08', priority: 'P1', title: 'Reload causes substantial data loss', body: 'Reload cleared the commencement date, Site, and terms on Page 1. On Page 2 it cleared all seven tested access-detail values and returned the workflow to Page 1.' },
      { id: 'LAN-F03', priority: 'P1', title: 'Upload and confirmation state can diverge', body: 'Replacing and clearing uploads preserved access details, but clearing the required LAAN file left its separate confirmation checked.' },
      { id: 'LAN-F05', priority: 'P0', title: 'The automated pre-submit boundary is safe', body: 'Core and Wave 2 use synthetic data and intercept final submissions. No automated case created or submitted a LAAN request.' },
      { id: 'LAN-F06', priority: 'P2', title: 'Confirmation burden requires business validation', body: 'Page 2 contains multiple declarations and conditional confirmations. Their legal and operational purpose has not been assessed, so simplification is not yet justified.' }
    ];
    const RECOMMENDATIONS = [
      { id: 'LAN-R09', priority: 'P1', title: 'Fix calendar validation before Page 2', body: 'Reject impossible dates inline, retain valid activity/Site/terms context, focus the date field, and correlate failures with WordPress/PHP logs.' },
      { id: 'LAN-R08', priority: 'P1', title: 'Protect users from reload data loss', body: 'Add an unsaved-change warning first, then investigate draft or autosave recovery only after retention and ownership rules are approved.' },
      { id: 'LAN-R03', priority: 'P1', title: 'Synchronize upload and declaration state', body: 'Use consistent upload feedback and ensure removing a required document cannot leave its related confirmation in a misleading checked state.' },
      { id: 'LAN-R05', priority: 'P0', title: 'Preserve the non-submitting regression suite', body: 'Keep submission interception enabled by default. Any end-to-end submission test must be separately tagged, synthetic, explicitly authorized, and staging-only.' },
      { id: 'LAN-R06', priority: 'P2', title: 'Validate confirmation hierarchy before simplifying it', body: 'Improve hierarchy and progressive disclosure where permitted, but never remove, combine, hide, or pre-check required declarations without business approval.' }
    ];
    const CHARACTERIZATION_FILES = ['laan-request-reload.wave2.spec.js', 'laan-request-activity-variants.wave2.spec.js'];
    const app = document.querySelector('#app');
    const initialParams = new URLSearchParams(window.location.search);
    let activeSuite = ['core', 'wave2', 'access'].includes(initialParams.get('suite')) ? initialParams.get('suite') : 'core';
    let activeSection = SECTIONS.has(initialParams.get('section')) ? initialParams.get('section') : 'overview';
    let laanExpanded = true;
    let accessExpanded = false;
    let activeReportPath = REPORTS[activeSuite].file;
    let currentReport = null;
    let suiteReports = { core: null, wave2: null, access: null };
    let historyItems = [];
    const expandedCases = new Set();

    function escapeHtml(value) {
      return String(value ?? '').replace(/[&<>'"]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character]));
    }
    function formatDate(value) {
      if (!value) return 'Unknown';
      const date = new Date(value);
      return Number.isNaN(date.valueOf()) ? value : date.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
    }
    function formatDuration(value) {
      const seconds = Number(value || 0) / 1000;
      return seconds < 60 ? seconds.toFixed(1) + 's' : Math.floor(seconds / 60) + 'm ' + Math.round(seconds % 60) + 's';
    }
    function stripAnsi(value) {
      const escapeCharacter = String.fromCharCode(27);
      return String(value || '').split(escapeCharacter).map((part, index) => index ? part.replace(/^\[[0-9;]*m/, '') : part).join('');
    }
    function flattenSuites(suites, output = [], suiteName = activeSuite) {
      const accessReport = suiteName === 'access'
        ? suiteName === activeSuite ? currentReport : suiteReports.access
        : null;
      const accessPreflightBlocked = suiteName === 'access' && reportHasAccessPreflightBlocker(accessReport);
      for (const suite of suites || []) {
        for (const spec of suite.specs || []) {
          const results = (spec.tests || []).flatMap(test => test.results || []);
          const attachments = results.flatMap(result => result.attachments || []);
          const declaredResult = attachments.map(decodeAttachment).find(item => item?.caseId);
          const testStatuses = (spec.tests || []).map(test => test.status);
          const status = declaredResult?.status
            ? declaredResult.status.toLowerCase().replaceAll(' ', '-')
            : results.some(result => ['failed', 'timedOut', 'interrupted'].includes(result.status)) ? 'failed'
              : accessPreflightBlocked && testStatuses.includes('skipped') ? 'blocked'
                : testStatuses.includes('skipped') || (results.length && results.every(result => result.status === 'skipped')) ? 'skipped'
                  : 'passed';
          output.push({
            id: spec.id || spec.file + ':' + spec.line,
            caseId: (spec.tests || []).flatMap(test => test.results || []).flatMap(result => result.attachments || []).map(decodeAttachment).find(item => item?.caseId)?.caseId || null,
            file: spec.file || suite.file || suite.title,
            title: spec.title,
            status,
            duration: results.reduce((total, result) => total + Number(result.duration || 0), 0),
            attachments,
            errors: results.flatMap(result => result.errors || []),
          });
        }
        flattenSuites(suite.suites, output, suiteName);
      }
      return output;
    }
    function reportHasAccessPreflightBlocker(report) {
      const visit = suites => (suites || []).some(suite => {
        const hasBlocker = (suite.specs || []).some(spec => (spec.tests || [])
          .flatMap(test => test.results || [])
          .flatMap(result => result.attachments || [])
          .map(decodeAttachment)
          .some(item => item?.caseId === 'TC-AR-001' && item.status === 'BLOCKED' && item.blockerId));
        return hasBlocker || visit(suite.suites);
      });
      return visit(report?.suites);
    }
    function decodeAttachment(attachment) {
      if (!attachment?.body) return null;
      try {
        const bytes = Uint8Array.from(atob(attachment.body), character => character.charCodeAt(0));
        return JSON.parse(new TextDecoder().decode(bytes));
      } catch {
        return null;
      }
    }
    function isCharacterization(testCase) {
      return CHARACTERIZATION_FILES.some(file => testCase.file.includes(file));
    }
    function statusPill(status, label) {
      return '<span class="status-pill status-' + status + '">' + escapeHtml(label || status) + '</span>';
    }
    function runHistoryOptions() {
      const current = REPORTS[activeSuite];
      const archived = historyItems.filter(item => item.suite === activeSuite);
      return '<option value="' + current.file + '">Current ' + current.label + ' report</option>' + archived.map(item => '<option value="' + escapeHtml(item.path) + '"' + (activeReportPath === item.path ? ' selected' : '') + '>' + escapeHtml(item.id) + ' · ' + escapeHtml(formatDate(item.startTime)) + '</option>').join('');
    }
    function suiteCommand(suite, cases) {
      if (suite === 'access') return 'npm run test:access:live';
      if (suite === 'core') return 'npm run test:laan:live';
      if (cases.length !== 1) return 'npm run test:laan:live:wave2';
      const file = cases[0].file;
      const focusedCommands = {
        'activity-variants': 'npm run test:laan:live:variants',
        'validation': 'npm run test:laan:live:validation',
        'date-boundaries': 'npm run test:laan:live:date-boundaries',
        'upload-recovery': 'npm run test:laan:live:upload-recovery',
        'reload': 'npm run test:laan:live:reload',
        'keyboard': 'npm run test:laan:live:keyboard',
        'responsive': 'npm run test:laan:live:responsive'
      };
      const match = Object.keys(focusedCommands).find(key => file.includes(key));
      return match ? focusedCommands[match] : 'npm run test:laan:live:wave2';
    }
    function sidebar() {
      const laanChildren = laanExpanded ? '<div class="nav-sub"><button class="nav-sub-item ' + (activeSection === 'results' ? 'is-active' : '') + '" data-section="results">Test results</button><button class="nav-sub-item ' + (activeSection === 'findings' ? 'is-active' : '') + '" data-section="findings">Findings</button><button class="nav-sub-item ' + (activeSection === 'recommendations' ? 'is-active' : '') + '" data-section="recommendations">Recommendations</button></div>' : '';
      const accessChildren = accessExpanded ? '<div class="nav-sub"><button class="nav-sub-item ' + (activeSuite === 'access' && activeSection === 'results' ? 'is-active' : '') + '" data-open-access="results">Test results</button><button class="nav-sub-item ' + (activeSuite === 'access' && activeSection === 'access-plan' ? 'is-active' : '') + '" data-open-access="access-plan">Coverage plan</button></div>' : '';
      return '<aside class="sidebar"><a class="brand" href="/"><span class="brand-mark">SX</span><span><strong>SiteXcell</strong><small>Test dashboard</small></span></a><p class="nav-label">Workspace</p><nav class="nav" aria-label="Dashboard sections"><button class="nav-item ' + (activeSection === 'overview' ? 'is-active' : '') + '" data-section="overview"><span class="nav-icon">⌂</span>Overview</button><button class="nav-item ' + (activeSection !== 'overview' ? 'is-active' : '') + '" data-toggle-group="laan"><span class="nav-icon">L</span>LAAN Requests<span class="nav-chevron ' + (laanExpanded ? 'is-open' : '') + '">›</span></button>' + laanChildren + '<button class="nav-item" data-toggle-group="access"><span class="nav-icon">A</span>Access Requests<span class="nav-chevron ' + (accessExpanded ? 'is-open' : '') + '">›</span></button>' + accessChildren + '</nav><div class="sidebar-bottom"><div class="safety"><strong>Safety boundary</strong><p>Synthetic data only. Final submission remains blocked in every automated run.</p></div></div></aside>';
    }
    function topbar() {
      const labels = { overview: 'Overview', results: 'Test results', findings: 'Findings', recommendations: 'Recommendations', 'access-plan': 'Coverage plan' };
      const resultActions = '<select class="run-select" id="run-select" aria-label="Choose a test run">' + runHistoryOptions() + '</select><button class="button button-primary" id="refresh-report" type="button">Refresh</button><a class="button" href="' + REPORTS[activeSuite].file + '">JSON</a>';
      const overviewActions = '<button class="button button-primary" id="refresh-report" type="button">Refresh</button>';
      const actions = activeSection === 'results' ? resultActions : activeSection === 'overview' ? overviewActions : '';
      return '<header class="topbar"><div class="breadcrumb"><span>LAAN Requests</span><span>/</span><strong>' + escapeHtml(labels[activeSection]) + '</strong></div><div class="top-actions">' + actions + '</div></header>';
    }
    function pageHead(title, description, showSuiteSwitch = false) {
      const suiteSwitch = showSuiteSwitch ? '<div class="suite-switch" role="tablist" aria-label="Test suite"><button class="suite-tab ' + (activeSuite === 'core' ? 'is-active' : '') + '" data-suite="core">3 Core</button><button class="suite-tab ' + (activeSuite === 'wave2' ? 'is-active' : '') + '" data-suite="wave2">Wave 2</button><button class="suite-tab ' + (activeSuite === 'access' ? 'is-active' : '') + '" data-suite="access">40 Access 1–8</button></div>' : '';
      return '<div class="page-head"><div><h1>' + escapeHtml(title) + '</h1><p>' + escapeHtml(description) + '</p></div>' + suiteSwitch + '</div>';
    }
    function notice(cases) {
      const failed = cases.filter(item => item.status === 'failed').length;
      if (failed) return '<div class="notice"><span><strong>' + failed + ' failed test' + (failed === 1 ? '' : 's') + '</strong> · open the failed row to review the assertion and evidence.</span><span>No final submission</span></div>';
      return '<div class="notice is-success"><span><strong>Current run passed</strong> · all declarations reached their intended stopping point.</span><span>No final submission</span></div>';
    }
    function summaryStrip(report, cases) {
      const passed = cases.filter(item => item.status === 'passed').length;
      const failed = cases.filter(item => item.status === 'failed').length;
      return '<section class="summary-strip" aria-label="Run summary"><div class="summary-item"><span>Tests in this run</span><strong>' + cases.length + '</strong></div><div class="summary-item"><span>Configured scenarios</span><strong>' + REPORTS[activeSuite].scenarios + '</strong></div><div class="summary-item is-passed"><span>Passed</span><strong>' + passed + '</strong></div><div class="summary-item is-failed"><span>Failed</span><strong>' + failed + '</strong></div><div class="summary-item"><span>Duration</span><strong>' + escapeHtml(formatDuration(report?.stats?.duration)) + '</strong></div></section>';
    }
    function evidenceDetails(testCase) {
      if (!testCase.attachments.length) return '';
      return '<div class="evidence">' + testCase.attachments.map(attachment => {
        const decoded = decodeAttachment(attachment);
        const output = decoded ? JSON.stringify(decoded, null, 2) : 'Attachment is available in the Playwright report.';
        return '<details><summary>' + escapeHtml(attachment.name) + '</summary><pre>' + escapeHtml(output) + '</pre></details>';
      }).join('') + '</div>';
    }
    function resultsTable(cases) {
      if (!cases.length) return '<div class="empty">No results are available for this report.</div>';
      return '<table class="test-table"><thead><tr><th>Test case</th><th>Script</th><th>Duration</th><th>Result</th><th></th></tr></thead><tbody>' + cases.map(testCase => {
        const open = expandedCases.has(testCase.id);
        const errors = stripAnsi(testCase.errors.map(error => error.message || error.stack || JSON.stringify(error)).join(' | '));
        return '<tr><td class="test-name"><strong>' + escapeHtml(testCase.title) + '</strong></td><td><code>' + escapeHtml(testCase.file) + '</code></td><td>' + escapeHtml(formatDuration(testCase.duration)) + '</td><td>' + statusPill(testCase.status, testCase.status) + '</td><td><button class="row-action" type="button" data-toggle-case="' + escapeHtml(testCase.id) + '" aria-expanded="' + open + '">' + (open ? '−' : '+') + '</button></td></tr>' + (open ? '<tr class="test-detail"><td colspan="5"><div class="detail-inner"><p>Playwright status: <strong>' + escapeHtml(testCase.status) + '</strong> · Attachments: <strong>' + testCase.attachments.length + '</strong>' + (isCharacterization(testCase) ? ' · Evidence interpretation required' : '') + '</p>' + (errors ? '<div class="error">' + escapeHtml(errors) + '</div>' : '') + evidenceDetails(testCase) + '</div></td></tr>' : '');
      }).join('') + '</tbody></table>';
    }
    function runFacts(report, cases) {
      const failed = cases.filter(item => item.status === 'failed').length;
      const blocked = cases.filter(item => item.status === 'blocked').length;
      const skipped = cases.filter(item => item.status === 'skipped').length;
      const status = report?.unavailable ? ['review', 'No report'] : failed ? ['failed', 'Needs review'] : blocked ? ['blocked', 'Blocked'] : skipped ? ['skipped', 'Not executed'] : ['passed', 'Passed'];
      return '<section class="surface"><div class="surface-head"><div><h2>Run details</h2><p>Only the essentials</p></div>' + statusPill(status[0], status[1]) + '</div><dl class="fact-list"><div><dt>Started</dt><dd>' + escapeHtml(formatDate(report?.stats?.startTime)) + '</dd></div><div><dt>Suite</dt><dd>' + escapeHtml(REPORTS[activeSuite].label) + '</dd></div><div><dt>Expected size</dt><dd>' + REPORTS[activeSuite].configuredTests + ' tests</dd></div><div><dt>Run scope</dt><dd>' + cases.length + ' ' + (cases.length === 1 ? 'declaration' : 'declarations') + '</dd></div><div><dt>Submission</dt><dd>Blocked</dd></div></dl></section>';
    }
    function shell(content) {
      return '<div class="app-shell">' + sidebar() + topbar() + '<main class="content">' + content + '</main></div>';
    }
    function overviewRow(suite) {
      const report = suiteReports[suite];
      const cases = flattenSuites(report?.suites, [], suite);
      const passed = cases.filter(item => item.status === 'passed').length;
      const failed = cases.filter(item => item.status === 'failed').length;
      const blocked = cases.filter(item => item.status === 'blocked').length;
      const status = failed ? ['failed', passed + ' passed · ' + failed + ' failed']
        : blocked ? ['blocked', blocked + ' blocked']
          : ['passed', passed + ' passed'];
      return '<div class="overview-row"><div><h3>' + escapeHtml(REPORTS[suite].label) + ' suite</h3><p>' + REPORTS[suite].configuredTests + ' configured tests · ' + REPORTS[suite].scenarios + ' scenarios</p></div><code>' + escapeHtml(suiteCommand(suite, cases)) + '</code><span>' + statusPill(status[0], status[1]) + '</span><button class="text-action" type="button" data-open-suite="' + suite + '">View results →</button></div>';
    }
    function overviewView() {
      return shell(pageHead('Test overview', 'Current regression status across LAAN Request and Access Request suites.') + '<section class="surface"><div class="surface-head"><div><h2>Available test suites</h2><p>Latest report files and the commands that produced them</p></div></div><div class="overview-list">' + overviewRow('core') + overviewRow('wave2') + overviewRow('access') + '</div></section>');
    }
    function resultsView(report, cases) {
      return shell(pageHead('LAAN test results', REPORTS[activeSuite].label + ' suite · read-only local evidence dashboard', true) + notice(cases) + summaryStrip(report, cases) + '<div class="workspace-grid"><section class="surface"><div class="surface-head"><div><h2>Tests completed</h2><p>Each row identifies the test script and its result</p></div><span>' + cases.length + ' ' + (cases.length === 1 ? 'result' : 'results') + '</span></div><div class="command-bar"><span>Command</span><code>' + escapeHtml(suiteCommand(activeSuite, cases)) + '</code></div>' + resultsTable(cases) + '</section>' + runFacts(report, cases) + '</div>');
    }
    function accessResultsView(report, cases) {
      const blocked = cases.filter(item => item.status === 'blocked').length;
      const failed = cases.filter(item => item.status === 'failed').length;
      const reportUnavailable = report?.unavailable === true;
      const accessNotice = reportUnavailable
        ? '<div class="notice"><span><strong>No formal Access Request report is available</strong> · run the unified Access Request suite to create current evidence.</span><button class="button" type="button" data-open-access="access-plan">View coverage plan</button></div>'
        : blocked
        ? '<div class="notice"><span><strong>' + blocked + ' blocked case</strong> · authentication must be refreshed before dependent Access Request cases can execute.</span><button class="button" type="button" data-open-access="access-plan">View coverage plan</button></div>'
        : failed
          ? '<div class="notice"><span><strong>' + failed + ' failed case' + (failed === 1 ? '' : 's') + '</strong> · inspect evidence before rerunning.</span><button class="button" type="button" data-open-access="access-plan">View coverage plan</button></div>'
          : '<div class="notice is-success"><span><strong>Current implemented scope passed</strong> · final submission remained blocked.</span><button class="button" type="button" data-open-access="access-plan">View coverage plan</button></div>';
      return shell(pageHead('Access Request results', 'Guarded live characterization and acceptance evidence', true) + accessNotice + summaryStrip(report, cases) + '<div class="workspace-grid"><section class="surface"><div class="surface-head"><div><h2>Access cases completed</h2><p>Each row is a named test case with expandable evidence.</p></div><span>' + cases.length + ' results</span></div><div class="command-bar"><span>Command</span><code>npm run test:access:live</code></div>' + resultsTable(cases) + '</section>' + runFacts(report, cases) + '</div>');
    }
    function accessPlanView() {
      const total = ACCESS_PLAN.reduce((sum, item) => sum + item.total, 0);
      const implemented = ACCESS_PLAN.reduce((sum, item) => sum + item.implemented, 0);
      const rows = ACCESS_PLAN.map(item => '<tr><td><strong>' + escapeHtml(item.label) + '</strong><br><code>' + escapeHtml(item.ids) + '</code></td><td>' + item.total + '</td><td>' + item.implemented + '</td><td>' + (item.total - item.implemented) + '</td><td>' + statusPill(item.implemented ? 'passed' : 'review', item.implemented ? 'In progress' : 'Planned') + '</td></tr>').join('');
      return shell(pageHead('Access Request coverage plan', 'A plain-language view of implemented results versus the approved 64-case matrix.') + '<div class="summary-strip"><div class="summary-item"><span>Planned cases</span><strong>' + total + '</strong></div><div class="summary-item is-passed"><span>Implemented</span><strong>' + implemented + '</strong></div><div class="summary-item"><span>Remaining</span><strong>' + (total - implemented) + '</strong></div><div class="summary-item"><span>Latest run</span><strong>AUTH blocked</strong></div><div class="summary-item"><span>Submissions</span><strong>0</strong></div></div><section class="surface"><div class="surface-head"><div><h2>Coverage by test family</h2><p>Implemented means executable code exists; execution status remains separate.</p></div><button class="button button-primary" type="button" data-open-access="results">View latest results</button></div><table class="test-table"><thead><tr><th>Family</th><th>Planned</th><th>Implemented</th><th>Remaining</th><th>Status</th></tr></thead><tbody>' + rows + '</tbody></table></section>');
    }
    function insightView(title, description, items) {
      return shell(pageHead(title, description) + '<section class="surface"><div class="surface-head"><div><h2>' + escapeHtml(title) + '</h2><p>Evidence-backed LAAN Request review</p></div></div><div class="insight-list">' + items.map(item => '<article class="insight-row"><div class="insight-meta"><span class="insight-id">' + escapeHtml(item.id) + '</span><span class="priority ' + (item.priority === 'P0' ? 'p0' : '') + '">' + escapeHtml(item.priority) + '</span></div><div class="insight-copy"><h3>' + escapeHtml(item.title) + '</h3><p>' + escapeHtml(item.body) + '</p></div></article>').join('') + '</div></section>');
    }
    function updateUrl() {
      const url = new URL(window.location.href);
      url.searchParams.set('suite', activeSuite);
      url.searchParams.set('section', activeSection);
      url.searchParams.delete('variant');
      if (activeSection !== 'results' || activeReportPath === REPORTS[activeSuite].file) url.searchParams.delete('run');
      else url.searchParams.set('run', activeReportPath);
      window.history.replaceState(null, '', url);
    }
    function render() {
      if (!currentReport && activeSection === 'results') {
        app.innerHTML = shell('<div class="empty">Loading report…</div>');
        bindInteractions();
        return;
      }
      const cases = flattenSuites(currentReport.suites);
      if (activeSection === 'overview') app.innerHTML = overviewView();
      if (activeSection === 'results') app.innerHTML = activeSuite === 'access' ? accessResultsView(currentReport, cases) : resultsView(currentReport, cases);
      if (activeSection === 'access-plan') app.innerHTML = accessPlanView();
      if (activeSection === 'findings') app.innerHTML = insightView('Findings', 'Observed behavior from the completed LAAN Request test evidence.', FINDINGS);
      if (activeSection === 'recommendations') app.innerHTML = insightView('Recommendations', 'Prioritized actions derived from the confirmed LAAN Request findings.', RECOMMENDATIONS);
      updateUrl();
      bindInteractions();
    }
    async function fetchReport(path) {
      try {
        const response = await fetch(path + '?t=' + Date.now());
        if (!response.ok) throw new Error('Report unavailable');
        return await response.json();
      } catch {
        return { suites: [], stats: {}, unavailable: true };
      }
    }
    async function loadReport(path) {
      activeReportPath = path;
      currentReport = await fetchReport(path);
      render();
    }
    async function loadSuiteReports() {
      const reports = await Promise.all([fetchReport(REPORTS.core.file), fetchReport(REPORTS.wave2.file), fetchReport(REPORTS.access.file)]);
      suiteReports = { core: reports[0], wave2: reports[1], access: reports[2] };
    }
    async function loadHistory() {
      try {
        const response = await fetch('/api/history?t=' + Date.now());
        historyItems = response.ok ? await response.json() : [];
      } catch {
        historyItems = [];
      }
    }
    async function selectSuite(suite) {
      activeSuite = suite;
      activeReportPath = REPORTS[suite].file;
      currentReport = suiteReports[suite];
      expandedCases.clear();
      render();
    }
    function selectSection(section) {
      activeSection = section;
      if (section !== 'overview') laanExpanded = true;
      render();
    }
    function bindInteractions() {
      document.querySelectorAll('[data-suite]').forEach(button => button.addEventListener('click', () => selectSuite(button.dataset.suite)));
      document.querySelectorAll('[data-section]').forEach(button => button.addEventListener('click', () => selectSection(button.dataset.section)));
      document.querySelectorAll('[data-open-suite]').forEach(button => button.addEventListener('click', () => {
        activeSection = 'results';
        selectSuite(button.dataset.openSuite);
      }));
      document.querySelectorAll('[data-open-access]').forEach(button => button.addEventListener('click', () => {
        activeSuite = 'access';
        activeSection = button.dataset.openAccess;
        activeReportPath = REPORTS.access.file;
        currentReport = suiteReports.access;
        accessExpanded = true;
        render();
      }));
      document.querySelectorAll('[data-toggle-group]').forEach(button => button.addEventListener('click', () => {
        if (button.dataset.toggleGroup === 'laan') laanExpanded = !laanExpanded;
        if (button.dataset.toggleGroup === 'access') accessExpanded = !accessExpanded;
        render();
      }));
      document.querySelectorAll('[data-toggle-case]').forEach(button => button.addEventListener('click', () => {
        const id = button.dataset.toggleCase;
        if (expandedCases.has(id)) expandedCases.delete(id);
        else expandedCases.add(id);
        render();
      }));
      document.querySelector('#run-select')?.addEventListener('change', event => loadReport(event.target.value));
      document.querySelector('#refresh-report')?.addEventListener('click', async () => {
        await loadHistory();
        await loadSuiteReports();
        if (activeSection === 'results') await loadReport(activeReportPath);
        else render();
      });
    }
    (async function boot() {
      await Promise.all([loadHistory(), loadSuiteReports()]);
      const requestedRun = initialParams.get('run');
      const matchingRun = historyItems.find(item => item.path === requestedRun && item.suite === activeSuite);
      activeReportPath = matchingRun ? matchingRun.path : REPORTS[activeSuite].file;
      currentReport = matchingRun ? await fetchReport(activeReportPath) : suiteReports[activeSuite];
      render();
    }());
  </script>
</body>
</html>`;

async function historyReportSummaries() {
  let entries = [];
  try {
    entries = await readdir(historyRoot, { withFileTypes: true });
  } catch {
    return [];
  }
  const reports = [];
  for (const entry of entries) {
    if (!entry.isFile() || extname(entry.name) !== '.json') continue;
    try {
      const report = JSON.parse(await readFile(join(historyRoot, entry.name), 'utf8'));
      const stats = report.stats || {};
      reports.push({
        id: entry.name.replace(/\.json$/, ''),
        path: 'history/' + entry.name,
        suite: String(report.config?.configFile || '').includes('access-request') ? 'access' : String(report.config?.configFile || '').includes('wave2') ? 'wave2' : 'core',
        startTime: stats.startTime || null,
        duration: stats.duration || 0,
        unexpected: stats.unexpected || 0,
      });
    } catch {
      // A report can be briefly incomplete while the runner archives it.
    }
  }
  return reports.sort((left, right) => String(right.startTime).localeCompare(String(left.startTime)));
}

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url, 'http://' + request.headers.host);
    if (url.pathname === '/') {
      response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
      response.end(dashboardHtml);
      return;
    }
    if (url.pathname === '/api/history') {
      response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
      response.end(JSON.stringify(await historyReportSummaries()));
      return;
    }
    const relativePath = decodeURIComponent(url.pathname.slice(1));
    const target = normalize(resolve(root, relativePath));
    if (target !== root && !target.startsWith(root + sep)) {
      response.writeHead(403).end('Forbidden');
      return;
    }
    const targetStat = await stat(target);
    if (!targetStat.isFile()) throw new Error('Not a file');
    response.writeHead(200, { 'Content-Type': mimeTypes[extname(target)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    response.end(await readFile(target));
  } catch {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Not found');
  }
});

server.on('error', error => {
  if (error.code === 'EADDRINUSE') {
    console.log('Test result dashboard is already running at http://127.0.0.1:' + port + '/');
    process.exit(0);
  }
  throw error;
});

server.listen(port, '127.0.0.1', () => {
  console.log('Test result dashboard: http://127.0.0.1:' + port + '/');
  console.log('Press Ctrl+C to stop the local server.');
});
