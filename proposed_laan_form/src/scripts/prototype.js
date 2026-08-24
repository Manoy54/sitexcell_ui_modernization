import { activities, owners, sites, uploadRules } from '../../fixtures/laan-fixtures.js';

const root = document.querySelector('#prototype-root');

const sessionKey = 'proposed-laan-form-session-v1';
const draftKey = 'proposed-laan-form-explicit-draft-v1';

const defaultState = {
    step: 1,
    fields: {
        activity: '',
        commencementDate: '',
        owner: '',
        siteQuery: '',
        siteId: '',
        termsAccepted: false,
        carrier: '',
        projectReference: '',
        tenantCompany: '',
        contactName: '',
        contactPhone: '',
        workLocation: '',
        affectedAreas: '',
        cableStart: '',
        cableEnd: '',
        riser: '',
        fibreDetails: '',
        contractorResponse: '',
    },
    files: {
        required: null,
        additional: null,
    },
    confirmations: {
        uploadReviewed: false,
        siteDetailsReviewed: false,
        workDetailsReviewed: false,
        accuracyAccepted: false,
    },
    errors: {},
    siteMenuOpen: false,
    completionShown: false,
    draftMessage: '',
};

const restoreSessionState = () => {
    const saved = sessionStorage.getItem(sessionKey);

    if (!saved) {
        return structuredClone(defaultState);
    }

    const restored = JSON.parse(saved);

    return {
        ...structuredClone(defaultState),
        ...restored,
        fields: { ...defaultState.fields, ...restored.fields },
        files: { ...defaultState.files, ...restored.files },
        confirmations: { ...defaultState.confirmations, ...restored.confirmations },
        errors: {},
        siteMenuOpen: false,
        completionShown: false,
    };
};

let state = restoreSessionState();

const escapeHtml = (value = '') => String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

const icon = (name, className = 'icon') => `<svg class="${className}" aria-hidden="true"><use href="#icon-${name}"></use></svg>`;

const selectedSite = () => sites.find(({ id }) => id === state.fields.siteId) ?? null;

const dateIsValid = (value) => {
    const match = /^(\d{2})-(\d{2})-(\d{4})$/.exec(value.trim());

    if (!match) {
        return false;
    }

    const [, dayText, monthText, yearText] = match;
    const day = Number(dayText);
    const month = Number(monthText);
    const year = Number(yearText);
    const date = new Date(Date.UTC(year, month - 1, day));

    return date.getUTCFullYear() === year
        && date.getUTCMonth() === month - 1
        && date.getUTCDate() === day;
};

const stageOneChecks = () => ({
    activity: Boolean(state.fields.activity),
    date: dateIsValid(state.fields.commencementDate),
    site: Boolean(selectedSite()),
    terms: state.fields.termsAccepted,
});

const accessDetailsComplete = () => [
    'carrier',
    'projectReference',
    'tenantCompany',
    'contactName',
    'contactPhone',
    'workLocation',
    'affectedAreas',
].every((key) => state.fields[key].trim());

const declarationsComplete = () => Object.values(state.confirmations).every(Boolean);

const requiredUploadComplete = () => state.files.required?.status === 'uploaded';

const formIsReady = () => Object.values(stageOneChecks()).every(Boolean)
    && accessDetailsComplete()
    && requiredUploadComplete()
    && declarationsComplete();

const serializableState = () => ({
    step: state.step,
    fields: state.fields,
    files: state.files,
    confirmations: state.confirmations,
    completionShown: state.completionShown,
    draftMessage: state.draftMessage,
});

const persistSession = () => {
    sessionStorage.setItem(sessionKey, JSON.stringify(serializableState()));
};

const setState = (changes, options = {}) => {
    state = { ...state, ...changes };
    persistSession();
    render(options);
};

const errorFor = (name) => state.errors[name]
    ? `<span class="field-error" id="${name}-error">${escapeHtml(state.errors[name])}</span>`
    : '';

const errorClass = (name) => state.errors[name] ? ' has-error' : '';

const describedBy = (name, helpId = '') => {
    const ids = [helpId, state.errors[name] ? `${name}-error` : ''].filter(Boolean);
    return ids.length ? ` aria-describedby="${ids.join(' ')}"` : '';
};

const renderBrand = () => `
    <div class="portal-brand" aria-label="Co-Siter Telco Site Access Portal">
        <span class="cositer-logo" aria-hidden="true">
            <span class="cositer-wordmark"><span class="cositer-prefix">co-</span>siter<span class="cositer-symbol">TM</span></span>
            <span class="cositer-tagline">Telco Site Access Portal</span>
        </span>
    </div>`;

const renderSidebar = () => `
    <aside class="portal-sidebar">
        ${renderBrand()}
        <nav class="portal-nav" aria-label="Portal navigation">
            <button type="button" aria-current="page">${icon('request')}Requests</button>
            <button type="button">${icon('users')}Users</button>
            <button type="button">${icon('document')}Documents</button>
            <button type="button">${icon('settings')}Settings</button>
            <button type="button">${icon('phone')}Contact us</button>
        </nav>
        <div class="portal-user">
            <span class="portal-avatar" aria-hidden="true">PU</span>
            <div><strong>Portal User</strong><span>Requester</span></div>
            <button class="portal-user-more" type="button" aria-label="Open user menu">⋮</button>
        </div>
    </aside>`;

const renderTopbar = () => `
    <header class="portal-topbar">
        <h1 class="portal-title">LAAN REQUESTS</h1>
        <div class="portal-actions">
            <button class="portal-action is-active" type="button">LAAN Request</button>
            <button class="portal-action" type="button">Access Request</button>
        </div>
    </header>`;

const renderProgress = () => `
    <div class="step-heading"><span>Step ${state.step} of 2</span><strong>${state.step === 1 ? 'Request context' : 'Access details'}</strong></div>
    <div class="progress-track" role="progressbar" aria-label="LAAN request progress" aria-valuemin="1" aria-valuemax="2" aria-valuenow="${state.step}">
        <span class="progress-value" data-step="${state.step}"></span>
    </div>`;

const renderErrorSummary = () => {
    const count = Object.keys(state.errors).length;

    if (!count) {
        return '';
    }

    return `<div class="error-summary" role="alert" tabindex="-1" data-error-summary><strong>Please review ${count === 1 ? 'this item' : `these ${count} items`}.</strong><span>Your valid information has been preserved.</span></div>`;
};

const renderActivityOptions = () => [
    '<option value="">Please select</option>',
    ...activities.map(({ value, label }) => `<option value="${escapeHtml(value)}"${state.fields.activity === value ? ' selected' : ''}>${escapeHtml(label)}</option>`),
].join('');

const renderOwnerOptions = () => owners.map(({ value, label }) => `<option value="${escapeHtml(value)}"${state.fields.owner === value ? ' selected' : ''}>${escapeHtml(label)}</option>`).join('');

const filteredSites = () => {
    const query = state.fields.siteQuery.trim().toLowerCase();

    if (!query) {
        return sites;
    }

    return sites.filter((site) => [site.name, site.address, site.id, site.owner]
        .some((value) => value.toLowerCase().includes(query)));
};

const renderSiteResults = () => {
    if (!state.siteMenuOpen) {
        return '';
    }

    const matches = filteredSites();

    return `<div class="site-results" role="listbox" aria-label="Synthetic Site results">
        ${matches.length
            ? matches.map((site, index) => `<button class="site-result${index === 0 ? ' is-highlighted' : ''}" type="button" role="option" data-action="select-site" data-site-id="${escapeHtml(site.id)}"><strong>${escapeHtml(site.name)}</strong><span>${escapeHtml(site.address)} · ${escapeHtml(site.id)}</span></button>`).join('')
            : '<p class="site-no-results">No synthetic Sites match this search.</p>'}
    </div>`;
};

const renderSelectedSite = () => {
    const site = selectedSite();

    if (!site) {
        return '';
    }

    return `<div class="selected-site" aria-live="polite">
        <div><strong>${escapeHtml(site.name)}</strong><span>${escapeHtml(site.address)} · ${escapeHtml(site.id)}</span></div>
        <button type="button" data-action="change-site">Change Site</button>
        <p class="site-note"><strong>Site notes:</strong> ${escapeHtml(site.notes)}</p>
    </div>`;
};

const renderTerms = () => `
    <div class="terms-area${errorClass('termsAccepted')}">
        <span class="field-label">Acceptance of Terms and Conditions <span class="required">*</span></span>
        <label class="check-row terms-check">
            <input id="choice_1_63_1" name="termsAccepted" type="checkbox"${state.fields.termsAccepted ? ' checked' : ''}${describedBy('termsAccepted')}>
            <span>I accept the Terms and Conditions of the co-siter Portal</span>
        </label>
        ${errorFor('termsAccepted')}
        <div class="terms-copy" tabindex="0" aria-label="Terms and Conditions">
            <h3>Terms &amp; Conditions</h3>
            <strong>WELCOME TO CO-SITER</strong>
            <p>If you continue to browse and use this Portal you are agreeing to comply with and be bound by the following Disclaimer and our Terms and Conditions of Use.</p>
            <p>You are given permission, in the form of a non-transferable, non-exclusive, revocable licence, to use Co-Siter so long as you provide full and complete details (including contact details) and comply with the Terms and Conditions of Use.</p>
            <p>By accessing, using, registering or submitting applications via this Portal where you submit Land Access and Activity Notices (LAANs) or Access Requests, you confirm that you have read, understood and agree to these Terms of Use in their entirety.</p>
            <p>You must ensure the request identifies the correct Site, activity, proposed date, responsible contacts and supporting evidence before it is submitted.</p>
            <p>You are responsible for keeping your account details secure and for reviewing any Site-specific access instructions made available through the Portal.</p>
            <p>Access to a Site remains subject to the applicable approval process and does not begin merely because information has been entered into this form.</p>
            <p>This prototype contains synthetic information only. No request, document, acknowledgement, or notification is sent to SiteXcell or another party.</p>
        </div>
    </div>`;

const renderDraftActions = () => `
    <div class="draft-actions" aria-label="Prototype draft actions">
        <button class="button-link" type="button" data-action="save-draft">Save draft</button>
        <button class="button-link" type="button" data-action="restore-draft"${sessionStorage.getItem(draftKey) ? '' : ' disabled'}>Restore</button>
        <button class="button-link" type="button" data-action="discard-draft"${sessionStorage.getItem(draftKey) ? '' : ' disabled'}>Discard</button>
        ${state.draftMessage ? `<span class="draft-status" role="status">${escapeHtml(state.draftMessage)}</span>` : ''}
    </div>`;

const renderStageOne = () => `
    ${renderErrorSummary()}
    <h2 class="form-title">LAAN request context</h2>
    <p class="form-intro">Enter the request details and select the Site requiring access.</p>
    <div class="form-grid">
        <div class="field${errorClass('activity')}">
            <label for="input_1_11">What type of activity does this LAAN relate to? <span class="required">*</span></label>
            <div class="control-shell">
                <select class="control-select" id="input_1_11" name="activity"${describedBy('activity')}>${renderActivityOptions()}</select>
                <span class="control-icon no-divider">${icon('chevron', 'icon-small')}</span>
            </div>
            ${errorFor('activity')}
        </div>
        <div class="field${errorClass('commencementDate')}">
            <label for="input_1_12">Proposed Commencement Date <span class="required">*</span></label>
            <div class="control-shell">
                <input class="control" id="input_1_12" name="commencementDate" type="text" inputmode="numeric" placeholder="dd-mm-yyyy" value="${escapeHtml(state.fields.commencementDate)}"${describedBy('commencementDate', 'date-help')}>
                <button class="control-icon no-divider" type="button" aria-label="Use the date format DD-MM-YYYY">${icon('calendar', 'icon-small')}</button>
            </div>
            <span class="field-help" id="date-help">Use DD-MM-YYYY. Impossible dates are rejected before Stage 2.</span>
            ${errorFor('commencementDate')}
        </div>
    </div>
    <div class="field stage-one-owner">
        <label for="input_1_40">Owner Name <span class="field-optional">(optional filter)</span></label>
        <div class="control-shell">
            <select class="control-select" id="input_1_40" name="owner">${renderOwnerOptions()}</select>
            <span class="control-icon">${icon('chevron', 'icon-small')}</span>
        </div>
        <span class="field-help">Search by owner name or open the complete list.</span>
    </div>
    <h3 class="section-title">Find and confirm the canonical Site</h3>
    <div class="field stage-one-site${errorClass('siteId')}">
        <label for="input_1_41">Site name <span class="required">*</span></label>
        <div class="control-shell">
            <input class="control" id="input_1_41" name="siteQuery" type="search" autocomplete="off" placeholder="Type or open Site list" value="${escapeHtml(state.fields.siteQuery)}" role="combobox" aria-expanded="${state.siteMenuOpen}" aria-controls="site-results"${describedBy('siteId', 'site-help')}>
            <button class="control-icon" type="button" data-action="toggle-site-menu" aria-label="Open complete Site list">${icon('chevron', 'icon-small')}</button>
            ${renderSiteResults()}
        </div>
        <span class="field-help" id="site-help">Search by Site name, address or identifier, or open the complete list.</span>
        ${errorFor('siteId')}
        ${renderSelectedSite()}
    </div>
    ${renderTerms()}
    <div class="form-actions">
        <button class="button-primary" type="submit">Continue to access details</button>
        ${renderDraftActions()}
    </div>`;

const renderContextStrip = () => {
    const site = selectedSite();
    const owner = owners.find(({ value }) => value === state.fields.owner)?.label ?? 'Not provided';

    return `<div class="context-strip" aria-label="Request context summary">
        <div><span>Activity</span><strong>${escapeHtml(state.fields.activity || 'Not selected')}</strong></div>
        <div><span>Date</span><strong>${escapeHtml(state.fields.commencementDate || 'Not entered')}</strong></div>
        <div><span>Site</span><strong>${escapeHtml(site?.name ?? 'Not selected')}</strong></div>
        <div><span>Owner</span><strong>${escapeHtml(owner)}</strong></div>
        <button type="button" data-action="go-stage-one">Edit</button>
    </div>`;
};

const renderTextField = ({ name, id, label, placeholder = '', type = 'text', span = false }) => `
    <div class="field${span ? ' field-span' : ''}${errorClass(name)}">
        <label for="${id}">${label} <span class="required">*</span></label>
        <input class="control" id="${id}" name="${name}" type="${type}" placeholder="${escapeHtml(placeholder)}" value="${escapeHtml(state.fields[name])}"${describedBy(name)}>
        ${errorFor(name)}
    </div>`;

const formatBytes = (bytes) => {
    if (bytes >= 1024 * 1024) {
        return `${(bytes / (1024 * 1024)).toFixed(bytes % (1024 * 1024) === 0 ? 0 : 1)} MB`;
    }

    return `${Math.max(1, Math.round(bytes / 1024))} KB`;
};

const renderUploadCard = (kind, label, required) => {
    const file = state.files[kind];
    const inputId = `${kind}-file-input`;
    const hasError = file?.status === 'error';
    const statusCopy = !file
        ? `${required ? 'Required' : 'Optional'} · PDF, JPG or PNG · maximum ${uploadRules.maximumLabel}`
        : file.status === 'uploading'
            ? `Uploading ${escapeHtml(file.name)}…`
            : file.status === 'error'
                ? escapeHtml(file.error)
                : `${escapeHtml(file.name)} · ${formatBytes(file.size)} · Uploaded`;

    return `<div class="upload-card${hasError ? ' has-error' : ''}">
        <span class="upload-icon">${icon(file ? 'file' : 'upload')}</span>
        <div class="upload-copy"><strong>${label}${required ? ' *' : ''}</strong><span>${statusCopy}</span></div>
        <div class="upload-buttons">
            <input class="sr-only" id="${inputId}" data-upload-kind="${kind}" type="file" accept=".pdf,.jpg,.jpeg,.png">
            <button class="upload-button" type="button" data-action="choose-file" data-upload-kind="${kind}">${file ? 'Replace' : 'Choose file'}</button>
            ${file ? `<button class="icon-button" type="button" data-action="remove-file" data-upload-kind="${kind}" aria-label="Remove ${escapeHtml(file.name)}">${icon('close', 'icon-small')}</button>` : ''}
        </div>
    </div>`;
};

const renderConfirmations = () => {
    const uploadDisabled = !requiredUploadComplete();

    return `<div class="confirmations">
        <label class="confirmation-card check-row${uploadDisabled ? ' is-disabled' : ''}">
            <input name="uploadReviewed" type="checkbox"${state.confirmations.uploadReviewed ? ' checked' : ''}${uploadDisabled ? ' disabled' : ''}>
            <span>I have reviewed the currently attached LAAN document and confirm it is the required version.</span>
        </label>
        <label class="confirmation-card check-row">
            <input name="siteDetailsReviewed" type="checkbox"${state.confirmations.siteDetailsReviewed ? ' checked' : ''}>
            <span>I confirm the selected Site and Site access context are correct for this request.</span>
        </label>
        <label class="confirmation-card check-row">
            <input name="workDetailsReviewed" type="checkbox"${state.confirmations.workDetailsReviewed ? ' checked' : ''}>
            <span>I confirm the proposed work details and affected areas are complete.</span>
        </label>
        <label class="confirmation-card check-row">
            <input name="accuracyAccepted" type="checkbox"${state.confirmations.accuracyAccepted ? ' checked' : ''}>
            <span>I declare that the information provided in this request is accurate.</span>
        </label>
    </div>`;
};

const renderReadiness = () => {
    const ready = formIsReady();

    return `<div class="readiness-panel${ready ? ' is-ready' : ''}" role="status">
        <div><strong>${ready ? 'Request details are ready for review' : 'Request details are incomplete'}</strong><span>${ready ? 'All required fields, evidence and confirmations are complete.' : 'The Request workspace lists the outstanding requirements.'}</span></div>
        ${icon(ready ? 'check' : 'info')}
    </div>`;
};

const renderCompletion = () => state.completionShown
    ? `<div class="completion-banner" role="status">${icon('check')}<div><strong>Prototype ready for submission</strong><span>No record was created and no information was sent.</span></div></div>`
    : '';

const renderStageTwo = () => `
    ${renderErrorSummary()}
    ${renderCompletion()}
    <h2 class="form-title">Access details</h2>
    <p class="form-intro">Complete the existing LAAN access details and review the required evidence.</p>
    ${renderContextStrip()}
    <section class="form-section" aria-labelledby="project-heading">
        <h3 class="form-section-heading" id="project-heading">Project and carrier details</h3>
        <div class="page-two-grid">
            ${renderTextField({ name: 'carrier', id: 'input_1_58', label: 'Carrier', placeholder: 'Enter carrier name' })}
            ${renderTextField({ name: 'projectReference', id: 'input_1_18', label: 'Carrier Project Reference No.', placeholder: 'Enter project reference' })}
            ${renderTextField({ name: 'tenantCompany', id: 'input_1_19', label: 'Tenant Company Name', placeholder: 'Enter tenant company' })}
            ${renderTextField({ name: 'contactName', id: 'input_1_83', label: 'Contact Name', placeholder: 'Enter contact name' })}
            ${renderTextField({ name: 'contactPhone', id: 'input_1_87', label: 'Contact Phone', placeholder: 'Enter phone number', type: 'tel' })}
        </div>
    </section>
    <section class="form-section" aria-labelledby="work-heading">
        <h3 class="form-section-heading" id="work-heading">Work location and affected areas</h3>
        <div class="page-two-grid">
            ${renderTextField({ name: 'workLocation', id: 'input_1_22', label: 'Location of Works', placeholder: 'Describe the work location', span: true })}
            ${renderTextField({ name: 'affectedAreas', id: 'input_1_64', label: 'Areas Affected', placeholder: 'Describe the affected areas', span: true })}
        </div>
    </section>
    <section class="form-section" aria-labelledby="technical-heading">
        <h3 class="form-section-heading" id="technical-heading">Technical details</h3>
        <div class="error-summary" role="note"><strong>Conditional rules pending approval.</strong><span>These existing fields remain visible and disabled so the prototype does not invent activity-specific business rules.</span></div>
        <div class="page-two-grid">
            <div class="field"><label for="input_1_69">Cable start</label><input class="control" id="input_1_69" type="text" disabled placeholder="Pending applicability rule"></div>
            <div class="field"><label for="input_1_70">Cable end</label><input class="control" id="input_1_70" type="text" disabled placeholder="Pending applicability rule"></div>
            <div class="field"><label for="input_1_71">Riser details</label><input class="control" id="input_1_71" type="text" disabled placeholder="Pending applicability rule"></div>
            <div class="field"><label for="input_1_73">Fibre details</label><input class="control" id="input_1_73" type="text" disabled placeholder="Pending applicability rule"></div>
        </div>
    </section>
    <section class="form-section" aria-labelledby="documents-heading">
        <h3 class="form-section-heading" id="documents-heading">Documents</h3>
        <div class="upload-stack">
            ${renderUploadCard('required', 'Required LAAN document', true)}
            ${renderUploadCard('additional', 'Additional supporting document', false)}
        </div>
    </section>
    <section class="form-section" aria-labelledby="declarations-heading">
        <h3 class="form-section-heading" id="declarations-heading">Confirmations and declarations</h3>
        ${renderConfirmations()}
        <div class="field" style="margin-top: 12px">
            <label for="contractor-response">Contractor response <span class="field-optional">(optional)</span></label>
            <textarea class="control-textarea" id="contractor-response" name="contractorResponse" placeholder="Add an optional response">${escapeHtml(state.fields.contractorResponse)}</textarea>
        </div>
        ${renderReadiness()}
    </section>
    <div class="form-actions">
        <div class="form-actions-group">
            <button class="button-secondary" type="button" data-action="go-stage-one">Back</button>
            <button class="button-primary" type="submit"${formIsReady() ? '' : ' disabled'}>Review ready request</button>
        </div>
        ${renderDraftActions()}
    </div>`;

const renderForm = () => `
    <form class="form-wrap" id="laan-prototype-form" novalidate>
        ${renderProgress()}
        ${state.step === 1 ? renderStageOne() : renderStageTwo()}
    </form>`;

const checklistItem = (complete, label) => `<li class="${complete ? 'is-complete' : ''}"><span class="check-dot">${icon('check', 'icon-small')}</span><span>${escapeHtml(label)}</span></li>`;

const renderWorkspace = () => {
    const checks = stageOneChecks();
    const site = selectedSite();
    const items = state.step === 1
        ? [
            [checks.activity, 'Activity selected'],
            [checks.date, 'Valid date entered'],
            [checks.site, 'Site selected'],
            [checks.terms, 'Terms accepted'],
        ]
        : [
            [accessDetailsComplete(), 'Access details complete'],
            [requiredUploadComplete(), 'Required LAAN uploaded'],
            [state.confirmations.uploadReviewed, 'Current upload reviewed'],
            [declarationsComplete(), 'Declarations accepted'],
            [formIsReady(), 'Ready for review'],
        ];

    return `<aside class="request-workspace" aria-labelledby="workspace-title">
        <h2 id="workspace-title">Request workspace</h2>
        <p class="workspace-kicker">Request context</p>
        <dl class="workspace-context">
            <div><dt>Activity</dt><dd class="${state.fields.activity ? '' : 'is-empty'}">${escapeHtml(state.fields.activity || '—')}</dd></div>
            <div><dt>Date</dt><dd class="${state.fields.commencementDate ? '' : 'is-empty'}">${escapeHtml(state.fields.commencementDate || '—')}</dd></div>
            <div><dt>Site</dt><dd class="${site ? '' : 'is-empty'}" title="${escapeHtml(site?.name ?? '')}">${escapeHtml(site?.name ?? '—')}</dd></div>
        </dl>
        <p class="workspace-kicker">Required items</p>
        <ul class="workspace-checklist">${items.map(([complete, label]) => checklistItem(complete, label)).join('')}</ul>
        <details class="state-inspector">
            <summary>Prototype state and edge controls</summary>
            ${state.step === 2 ? `<div class="draft-actions"><button class="button-link" type="button" data-action="fixture-valid-upload">Valid file</button><button class="button-link" type="button" data-action="fixture-upload-failure">Failed upload</button><button class="button-link" type="button" data-action="fixture-oversize-upload">Over 20 MB</button></div>` : ''}
            <pre data-state-json></pre>
        </details>
    </aside>`;
};

const renderApplication = () => `<main class="portal-app">${renderSidebar()}<section class="portal-stage">${renderTopbar()}<div class="page-layout"><div class="form-surface">${renderForm()}</div>${renderWorkspace()}</div></section></main>`;

const render = ({ focusSite = false, focusError = false, scrollTop = false } = {}) => {
    root.innerHTML = renderApplication();
    const inspector = root.querySelector('[data-state-json]');

    if (inspector) {
        inspector.textContent = JSON.stringify(serializableState(), null, 2);
    }

    document.title = 'Reference dashboard · LAAN Request Prototype';

    if (focusSite) {
        requestAnimationFrame(() => {
            const input = root.querySelector('#input_1_41');
            input?.focus();
            input?.setSelectionRange(input.value.length, input.value.length);
        });
    }

    if (focusError) {
        requestAnimationFrame(() => root.querySelector('[data-error-summary]')?.focus());
    }

    if (scrollTop) {
        requestAnimationFrame(() => {
            window.scrollTo({ top: 0, behavior: 'instant' });
            const formSurface = root.querySelector('.form-surface');
            if (formSurface) {
                formSurface.scrollTop = 0;
            }
        });
    }
};

const validateStageOne = () => {
    const errors = {};

    if (!state.fields.activity) {
        errors.activity = 'Select the activity this LAAN relates to.';
    }

    if (!state.fields.commencementDate.trim()) {
        errors.commencementDate = 'Enter the proposed commencement date.';
    } else if (!dateIsValid(state.fields.commencementDate)) {
        errors.commencementDate = 'Enter a real date in DD-MM-YYYY format, for example 05-09-2026.';
    }

    if (!selectedSite()) {
        errors.siteId = 'Find and select the canonical Site.';
    }

    if (!state.fields.termsAccepted) {
        errors.termsAccepted = 'Accept the Terms and Conditions to continue.';
    }

    if (Object.keys(errors).length) {
        setState({ errors }, { focusError: true });
        return;
    }

    setState({ step: 2, errors: {}, siteMenuOpen: false, completionShown: false }, { scrollTop: true });
};

const validateStageTwo = () => {
    const errors = {};
    const requiredFields = {
        carrier: 'Enter the carrier name.',
        projectReference: 'Enter the carrier project reference.',
        tenantCompany: 'Enter the tenant company name.',
        contactName: 'Enter the contact name.',
        contactPhone: 'Enter the contact phone number.',
        workLocation: 'Describe the location of the works.',
        affectedAreas: 'Describe the affected areas.',
    };

    Object.entries(requiredFields).forEach(([name, message]) => {
        if (!state.fields[name].trim()) {
            errors[name] = message;
        }
    });

    if (!requiredUploadComplete()) {
        errors.requiredFile = 'Attach a valid required LAAN document.';
    }

    if (!declarationsComplete()) {
        errors.declarations = 'Review and accept each required confirmation.';
    }

    if (Object.keys(errors).length) {
        setState({ errors }, { focusError: true });
        return;
    }

    setState({ errors: {}, completionShown: true });
};

const updateFieldWithoutRender = (name, value) => {
    state.fields[name] = value;
    state.draftMessage = '';
    state.completionShown = false;
    delete state.errors[name];
    persistSession();

    const inspector = root.querySelector('[data-state-json]');
    if (inspector) {
        inspector.textContent = JSON.stringify(serializableState(), null, 2);
    }
};

const applyFile = (kind, file) => {
    const extension = file.name.includes('.') ? file.name.split('.').pop().toLowerCase() : '';
    const acceptedType = uploadRules.acceptedTypes.includes(file.type) || uploadRules.acceptedExtensions.includes(extension);
    const withinLimit = file.size <= uploadRules.maximumBytes;

    state.confirmations.uploadReviewed = kind === 'required' ? false : state.confirmations.uploadReviewed;
    state.completionShown = false;

    if (!acceptedType || !withinLimit) {
        state.files[kind] = {
            name: file.name,
            size: file.size,
            type: file.type,
            status: 'error',
            error: !acceptedType ? 'Unsupported file type. Use PDF, JPG or PNG.' : `File is larger than ${uploadRules.maximumLabel}.`,
        };
        persistSession();
        render();
        return;
    }

    state.files[kind] = { name: file.name, size: file.size, type: file.type, status: 'uploading' };
    persistSession();
    render();

    window.setTimeout(() => {
        if (state.files[kind]?.name !== file.name || state.files[kind]?.status !== 'uploading') {
            return;
        }

        state.files[kind] = { ...state.files[kind], status: 'uploaded' };
        persistSession();
        render();
    }, 420);
};

const applyUploadFixture = (fixture) => {
    state.confirmations.uploadReviewed = false;
    state.completionShown = false;

    if (fixture === 'valid') {
        state.files.required = { name: 'synthetic-laan-notice.pdf', size: 640 * 1024, type: 'application/pdf', status: 'uploaded' };
    } else if (fixture === 'failure') {
        state.files.required = { name: 'synthetic-laan-notice.pdf', size: 640 * 1024, type: 'application/pdf', status: 'error', error: 'Upload interrupted. Choose the file again to retry.' };
    } else {
        state.files.required = { name: 'synthetic-laan-over-limit.pdf', size: uploadRules.maximumBytes + 1, type: 'application/pdf', status: 'error', error: `File is larger than ${uploadRules.maximumLabel}.` };
    }

    persistSession();
    render();
};

root.addEventListener('submit', (event) => {
    event.preventDefault();
    state.step === 1 ? validateStageOne() : validateStageTwo();
});

root.addEventListener('input', (event) => {
    const target = event.target;

    if (!(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement)) {
        return;
    }

    if (target.name === 'siteQuery') {
        state.fields.siteQuery = target.value;
        state.fields.siteId = '';
        state.siteMenuOpen = true;
        state.completionShown = false;
        delete state.errors.siteId;
        persistSession();
        render({ focusSite: true });
        return;
    }

    if (Object.hasOwn(state.fields, target.name) && target.type !== 'checkbox') {
        updateFieldWithoutRender(target.name, target.value);
    }
});

root.addEventListener('change', (event) => {
    const target = event.target;

    if (target instanceof HTMLInputElement && target.dataset.uploadKind && target.files?.[0]) {
        applyFile(target.dataset.uploadKind, target.files[0]);
        return;
    }

    if (target instanceof HTMLSelectElement && Object.hasOwn(state.fields, target.name)) {
        const previousActivity = state.fields.activity;
        state.fields[target.name] = target.value;
        state.draftMessage = '';
        state.completionShown = false;
        delete state.errors[target.name];

        if (target.name === 'activity' && previousActivity && previousActivity !== target.value) {
            state.confirmations.workDetailsReviewed = false;
        }

        persistSession();
        render();
        return;
    }

    if (target instanceof HTMLInputElement && target.type === 'checkbox') {
        if (Object.hasOwn(state.fields, target.name)) {
            state.fields[target.name] = target.checked;
            delete state.errors[target.name];
        } else if (Object.hasOwn(state.confirmations, target.name)) {
            state.confirmations[target.name] = target.checked;
            delete state.errors.declarations;
        }

        state.completionShown = false;
        persistSession();
        render();
    }
});

root.addEventListener('focusin', (event) => {
    if (event.target instanceof HTMLInputElement && event.target.name === 'siteQuery' && !state.siteMenuOpen) {
        state.siteMenuOpen = true;
        render({ focusSite: true });
    }
});

root.addEventListener('keydown', (event) => {
    if (!(event.target instanceof HTMLInputElement) || event.target.name !== 'siteQuery' || event.key !== 'Enter' || !state.siteMenuOpen) {
        return;
    }

    const firstSite = filteredSites()[0];
    if (firstSite) {
        event.preventDefault();
        state.fields.siteId = firstSite.id;
        state.fields.siteQuery = firstSite.name;
        state.siteMenuOpen = false;
        delete state.errors.siteId;
        persistSession();
        render();
    }
});

root.addEventListener('click', (event) => {
    const control = event.target.closest('[data-action]');

    if (!control) {
        return;
    }

    const action = control.dataset.action;

    if (action === 'toggle-site-menu') {
        state.siteMenuOpen = !state.siteMenuOpen;
        render({ focusSite: state.siteMenuOpen });
    }

    if (action === 'select-site') {
        const site = sites.find(({ id }) => id === control.dataset.siteId);
        if (site) {
            state.fields.siteId = site.id;
            state.fields.siteQuery = site.name;
            state.siteMenuOpen = false;
            state.confirmations.siteDetailsReviewed = false;
            state.completionShown = false;
            delete state.errors.siteId;
            persistSession();
            render();
        }
    }

    if (action === 'change-site') {
        state.fields.siteId = '';
        state.fields.siteQuery = '';
        state.siteMenuOpen = true;
        state.confirmations.siteDetailsReviewed = false;
        state.completionShown = false;
        persistSession();
        render({ focusSite: true });
    }

    if (action === 'go-stage-one') {
        setState({ step: 1, errors: {}, completionShown: false, siteMenuOpen: false }, { scrollTop: true });
    }

    if (action === 'choose-file') {
        root.querySelector(`#${control.dataset.uploadKind}-file-input`)?.click();
    }

    if (action === 'remove-file') {
        const kind = control.dataset.uploadKind;
        state.files[kind] = null;
        if (kind === 'required') {
            state.confirmations.uploadReviewed = false;
        }
        state.completionShown = false;
        persistSession();
        render();
    }

    if (action === 'save-draft') {
        sessionStorage.setItem(draftKey, JSON.stringify(serializableState()));
        setState({ draftMessage: 'Draft saved in this prototype session.' });
    }

    if (action === 'restore-draft') {
        const savedDraft = sessionStorage.getItem(draftKey);
        if (savedDraft) {
            const draft = JSON.parse(savedDraft);
            state = {
                ...structuredClone(defaultState),
                ...draft,
                fields: { ...defaultState.fields, ...draft.fields },
                files: { ...defaultState.files, ...draft.files },
                confirmations: { ...defaultState.confirmations, ...draft.confirmations },
                errors: {},
                draftMessage: 'Draft restored.',
            };
            persistSession();
            render();
        }
    }

    if (action === 'discard-draft') {
        sessionStorage.removeItem(draftKey);
        setState({ draftMessage: 'Saved draft discarded.' });
    }

    if (action === 'fixture-valid-upload') {
        applyUploadFixture('valid');
    }

    if (action === 'fixture-upload-failure') {
        applyUploadFixture('failure');
    }

    if (action === 'fixture-oversize-upload') {
        applyUploadFixture('oversize');
    }
});

window.addEventListener('beforeunload', (event) => {
    const hasUnsavedInput = Object.values(state.fields).some(Boolean) || state.files.required || state.files.additional;
    const explicitDraft = sessionStorage.getItem(draftKey);

    if (hasUnsavedInput && !explicitDraft) {
        event.preventDefault();
    }
});

render();
