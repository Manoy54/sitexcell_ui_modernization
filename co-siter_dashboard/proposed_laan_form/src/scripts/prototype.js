import { activities, owners, sites, uploadRules as prototypeUploadRules } from '../../fixtures/laan-fixtures.js';

const root = document.querySelector('#prototype-root');
const embeddedInPortal = root.dataset.portalEmbedded === 'true';
const nativeConfig = window.SitexcellLaanConfig ?? {};
const isNativeWordPress = Boolean(nativeConfig.native);

const sessionKey = isNativeWordPress ? 'sitexcell-laan-form-session-v1' : 'proposed-laan-form-session-v1';
const draftKey = 'proposed-laan-form-explicit-draft-v1';
const drawingRequirementsUrl = 'https://drive.google.com/file/d/1IrbzzKeussLKHe75Ef0k3-wiiokR2JW5/view?usp=sharing';
const siteRecords = Array.isArray(nativeConfig.sites) && nativeConfig.sites.length
    ? nativeConfig.sites
    : sites;
const uploadRules = nativeConfig.uploadRules ?? prototypeUploadRules;
const pendingFiles = { required: null, additional: [] };
const dateBoundaryInputs = {
    minimum: nativeConfig.minimumCommencementDate ?? new URLSearchParams(window.location.search).get('minDate') ?? '',
    maximum: nativeConfig.maximumCommencementDate ?? new URLSearchParams(window.location.search).get('maxDate') ?? '',
};
const prototypeSearchParams = new URLSearchParams(window.location.search);

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
        additional: [],
    },
    confirmations: {
        uploadReviewed: false,
        siteDetailsReviewed: false,
        workDetailsReviewed: false,
        accuracyAccepted: false,
    },
    errors: {},
    openDropdown: '',
    siteMenuOpen: false,
    calendarOpen: false,
    calendarMenu: '',
    completionShown: false,
    draftMessage: '',
    submitting: false,
    submittedRequestId: 0,
};

const restoreSessionState = () => {
    const saved = sessionStorage.getItem(sessionKey);

    if (!saved) {
        return structuredClone(defaultState);
    }

    const restored = JSON.parse(saved);

    const restoredState = {
        ...structuredClone(defaultState),
        ...restored,
        fields: { ...defaultState.fields, ...restored.fields },
        files: {
            ...defaultState.files,
            ...restored.files,
            additional: Array.isArray(restored.files?.additional)
                ? restored.files.additional
                : restored.files?.additional ? [restored.files.additional] : [],
        },
        confirmations: { ...defaultState.confirmations, ...restored.confirmations },
        errors: {},
        siteMenuOpen: false,
        completionShown: false,
    };

    if (isNativeWordPress) {
        restoredState.files = { ...defaultState.files };
    }

    return restoredState;
};

let state = restoreSessionState();

const escapeHtml = (value = '') => String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

const icon = (name, className = 'icon') => `<svg class="${className}" aria-hidden="true"><use href="#icon-${name}"></use></svg>`;

const selectedSite = () => siteRecords.find(({ id }) => id === state.fields.siteId) ?? null;

if (!isNativeWordPress && prototypeSearchParams.get('step') === '2') {
    const previewSite = selectedSite() ?? siteRecords[0] ?? null;
    state = {
        ...state,
        step: 2,
        fields: {
            ...state.fields,
            activity: state.fields.activity || 'Installation',
            commencementDate: state.fields.commencementDate || '30-09-2026',
            siteId: state.fields.siteId || previewSite?.id || '',
            siteQuery: state.fields.siteQuery || previewSite?.name || '',
            termsAccepted: true,
        },
    };
}

const parseDateValue = (value) => {
    const match = /^(\d{2})-(\d{2})-(\d{4})$/.exec(value.trim());

    return match
        ? { day: Number(match[1]), month: Number(match[2]) - 1, year: Number(match[3]) }
        : null;
};

const parseBoundary = (value, label) => {
    if (!value) {
        return { value: '', time: null, error: '' };
    }

    const parsed = parseDateValue(value);
    const time = parsed ? Date.UTC(parsed.year, parsed.month, parsed.day) : null;
    const calendarValid = parsed && new Date(time).getUTCFullYear() === parsed.year
        && new Date(time).getUTCMonth() === parsed.month
        && new Date(time).getUTCDate() === parsed.day;

    return {
        value,
        time: calendarValid ? time : null,
        error: calendarValid ? '' : `${label} must be a real date in DD-MM-YYYY format.`,
    };
};

const minimumBoundary = parseBoundary(dateBoundaryInputs.minimum, 'The minimum commencement date');
const maximumBoundary = parseBoundary(dateBoundaryInputs.maximum, 'The maximum commencement date');
const dateBoundaryPolicy = { minimum: minimumBoundary.value, maximum: maximumBoundary.value };
const dateBoundaryConfigError = minimumBoundary.error
    || maximumBoundary.error
    || (minimumBoundary.time !== null && maximumBoundary.time !== null && minimumBoundary.time > maximumBoundary.time
        ? 'The configured commencement-date range is invalid.' : '');

const shortMonthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const weekdayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const today = new Date();
const selectedDate = parseDateValue(state.fields.commencementDate);
let calendarView = selectedDate
    ? { year: selectedDate.year, month: selectedDate.month }
    : { year: today.getFullYear(), month: today.getMonth() };

const calendarDateKey = (year, month, day) => `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

const calendarDateFromKey = (key) => {
    const [year, month, day] = key.split('-').map(Number);
    return { year, month: month - 1, day };
};

const dateIsValid = (value) => {
    if (dateBoundaryConfigError) {
        return false;
    }

    const parsed = parseDateValue(value);

    if (!parsed) {
        return false;
    }

    const date = new Date(Date.UTC(parsed.year, parsed.month, parsed.day));

    const calendarValid = date.getUTCFullYear() === parsed.year
        && date.getUTCMonth() === parsed.month
        && date.getUTCDate() === parsed.day;

    if (!calendarValid) {
        return false;
    }

    const valueTime = date.getTime();
    const minimumTime = minimumBoundary.time ?? -Infinity;
    const maximumTime = maximumBoundary.time ?? Infinity;
    return valueTime >= minimumTime && valueTime <= maximumTime;
};

const dateBoundaryError = (value) => {
    if (dateBoundaryConfigError) {
        return dateBoundaryConfigError;
    }

    const parsed = parseDateValue(value);
    if (!parsed || (!dateBoundaryPolicy.minimum && !dateBoundaryPolicy.maximum)) {
        return '';
    }

    const calendarDate = new Date(Date.UTC(parsed.year, parsed.month, parsed.day));
    if (calendarDate.getUTCFullYear() !== parsed.year
        || calendarDate.getUTCMonth() !== parsed.month
        || calendarDate.getUTCDate() !== parsed.day) {
        return '';
    }

    const valueTime = Date.UTC(parsed.year, parsed.month, parsed.day);
    const minimum = parseDateValue(dateBoundaryPolicy.minimum);
    const maximum = parseDateValue(dateBoundaryPolicy.maximum);

    if (minimum && valueTime < Date.UTC(minimum.year, minimum.month, minimum.day)) {
        return `Use a commencement date on or after ${dateBoundaryPolicy.minimum}.`;
    }

    if (maximum && valueTime > Date.UTC(maximum.year, maximum.month, maximum.day)) {
        return `Use a commencement date on or before ${dateBoundaryPolicy.maximum}.`;
    }

    return '';
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

const renderReadinessContent = (ready) => `<div><strong>${ready ? 'Request details are ready for review' : 'Request details are incomplete'}</strong><span>${ready ? 'All required fields, evidence and confirmations are complete.' : 'The Request workspace lists the outstanding requirements.'}</span></div>${icon(ready ? 'check' : 'info')}`;

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
    ? `<span class="field-error" id="${name}-error" data-testid="${name}-error">${escapeHtml(state.errors[name])}</span>`
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
    <div class="step-heading"><span>Step ${state.step} of 2</span><strong>${state.step === 1 ? 'Request context' : '100%'}</strong></div>
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

const renderDropdown = ({ name, id, label, placeholder, options }) => {
    const open = state.openDropdown === name;
    const selectedValue = state.fields[name];
    const selectedLabel = options.find(({ value }) => value === selectedValue)?.label ?? placeholder;
    const menuId = `${name}-options`;

    return `<div class="control-shell dropdown-shell">
        <button class="control dropdown-trigger" id="${id}" data-testid="${name}-control" type="button" role="combobox" aria-haspopup="listbox" aria-expanded="${open}" aria-controls="${menuId}" data-action="toggle-dropdown" data-dropdown="${name}">
            <span class="dropdown-value">${escapeHtml(selectedLabel)}</span>
            ${icon('chevron', `icon-small dropdown-chevron${open ? ' is-open' : ''}`)}
        </button>
        ${open ? `<div class="dropdown-menu" id="${menuId}" role="listbox" aria-label="${escapeHtml(label)}">
            ${options.map(({ value, label: optionLabel }) => `<button class="dropdown-option${selectedValue === value ? ' is-selected' : ''}" type="button" role="option" aria-selected="${selectedValue === value}" data-action="select-dropdown-option" data-dropdown="${name}" data-dropdown-value="${escapeHtml(value)}">${escapeHtml(optionLabel)}</button>`).join('')}
        </div>` : ''}
    </div>`;
};

const renderActivityDropdown = () => renderDropdown({
    name: 'activity',
    id: 'input_1_11',
    label: 'Activity',
    placeholder: 'Please Select',
    options: [{ value: '', label: 'Please Select' }, ...activities],
});

const renderOwnerDropdown = () => renderDropdown({
    name: 'owner',
    id: 'input_1_40',
    label: 'Owner Name',
    placeholder: 'Choose company name',
    options: owners,
});

const renderCalendarMenu = () => {
    if (state.calendarMenu === 'month') {
        return `<div class="calendar-menu calendar-month-menu" role="listbox" aria-label="Choose month">
            ${shortMonthNames.map((label, month) => `<button class="calendar-menu-option${calendarView.month === month ? ' is-selected' : ''}" type="button" data-action="select-calendar-month" data-calendar-month="${month}">${label}</button>`).join('')}
        </div>`;
    }

    if (state.calendarMenu === 'year') {
        const years = Array.from({ length: 11 }, (_, index) => calendarView.year - 5 + index);

        return `<div class="calendar-menu calendar-year-menu" role="listbox" aria-label="Choose year">
            ${years.map((year) => `<button class="calendar-menu-option${calendarView.year === year ? ' is-selected' : ''}" type="button" data-action="select-calendar-year" data-calendar-year="${year}">${year}</button>`).join('')}
        </div>`;
    }

    return '';
};

const renderCalendar = () => {
    if (!state.calendarOpen) {
        return '';
    }

    const firstDay = new Date(Date.UTC(calendarView.year, calendarView.month, 1)).getUTCDay();
    const viewStart = new Date(Date.UTC(calendarView.year, calendarView.month, 1 - firstDay));
    const selected = parseDateValue(state.fields.commencementDate);
    const selectedKey = selected ? calendarDateKey(selected.year, selected.month, selected.day) : '';
    const todayKey = calendarDateKey(today.getFullYear(), today.getMonth(), today.getDate());
    const days = Array.from({ length: 42 }, (_, index) => {
        const date = new Date(viewStart);
        date.setUTCDate(viewStart.getUTCDate() + index);
        const year = date.getUTCFullYear();
        const month = date.getUTCMonth();
        const day = date.getUTCDate();
        const key = calendarDateKey(year, month, day);
        const isOutside = month !== calendarView.month;
        const classes = [
            'calendar-day',
            isOutside ? 'is-outside' : '',
            key === selectedKey ? 'is-selected' : '',
            key === todayKey ? 'is-today' : '',
        ].filter(Boolean).join(' ');

        return `<button class="${classes}" type="button" data-action="select-calendar-date" data-calendar-date="${key}" aria-label="${key}"${key === selectedKey ? ' aria-pressed="true"' : ''}>${day}</button>`;
    }).join('');

    return `<div class="calendar-popover" role="dialog" aria-label="Choose commencement date">
        <div class="calendar-header">
            <button class="calendar-nav" type="button" data-action="calendar-previous" aria-label="Previous month">${icon('chevron-left', 'icon-small')}</button>
            <div class="calendar-caption">
                <button class="calendar-caption-button" type="button" data-action="toggle-calendar-month" aria-label="Choose month">${shortMonthNames[calendarView.month]}${icon('chevron', 'calendar-caption-chevron')}</button>
                <button class="calendar-caption-button" type="button" data-action="toggle-calendar-year" aria-label="Choose year">${calendarView.year}${icon('chevron', 'calendar-caption-chevron')}</button>
            </div>
            <button class="calendar-nav" type="button" data-action="calendar-next" aria-label="Next month">${icon('chevron-right', 'icon-small')}</button>
        </div>
        ${renderCalendarMenu()}
        <div class="calendar-weekdays" aria-hidden="true">${weekdayNames.map((name) => `<span>${name}</span>`).join('')}</div>
        <div class="calendar-days" role="grid">${days}</div>
    </div>`;
};

const filteredSites = () => {
    const query = state.fields.siteQuery.trim().toLowerCase();

    if (!query) {
        return siteRecords;
    }

    return siteRecords.filter((site) => [site.name, site.address, site.id, site.owner]
        .some((value) => (value ?? '').toLowerCase().includes(query)));
};

const siteMeta = (site) => [site.address, site.id].filter(Boolean).join(' · ');

const renderSiteResults = () => {
    if (!state.siteMenuOpen) {
        return '';
    }

    const matches = filteredSites();

    return `<div class="site-results" role="listbox" aria-label="Site results" data-testid="site-results">
        ${matches.length
            ? matches.map((site, index) => `<button class="site-result${index === 0 ? ' is-highlighted' : ''}" type="button" role="option" data-testid="site-result" data-action="select-site" data-site-id="${escapeHtml(site.id)}"><strong>${escapeHtml(site.name)}</strong><span>${escapeHtml(siteMeta(site))}</span></button>`).join('')
            : '<p class="site-no-results">No Sites match this search.</p>'}
    </div>`;
};

const renderSelectedSite = () => {
    return '';
};

const renderSiteRequirements = () => {
    const site = selectedSite();
    const notesHtml = site?.notesHtml?.trim();

    return `<section class="site-requirements" aria-labelledby="site-requirements-heading">
        <p class="drawing-requirements" id="site-requirements-heading"><strong>Drawing Requirements</strong> - <a href="${drawingRequirementsUrl}" target="_blank" rel="noopener noreferrer">click here to view a checklist of owner requirements and an example of a drawing to ensure a speedy review.</a></p>
        <p class="site-notes-heading">Site Notes to Carriers:</p>
        ${site ? `<div class="site-carrier-notes" aria-live="polite">${notesHtml || '<p>No site-specific notes are recorded for this Site.</p>'}</div>` : ''}
    </section>`;
};

const renderTerms = () => `
    <div class="terms-area${errorClass('termsAccepted')}">
        <span class="field-label">Acceptance of Terms and Conditions <span class="required">*</span></span>
        <label class="check-row terms-check">
            <input id="choice_1_63_1" data-testid="terms-confirmation" name="termsAccepted" type="checkbox"${state.fields.termsAccepted ? ' checked' : ''}${describedBy('termsAccepted')}>
            <span>I accept the Terms and Conditions of the co-siter™ Portal</span>
        </label>
        ${errorFor('termsAccepted')}
        <div class="terms-copy" tabindex="0" aria-label="Terms and Conditions">
            <h3>Terms &amp; Conditions</h3>
            <p class="terms-heading"><strong>WELCOME TO CO-SITER</strong></p>
            <p>If you continue to browse and use this Portal you are agreeing to comply with and be bound by the following Disclaimer and our Terms and Conditions of Use.</p>
            <p>You are given permission (in the form of a non-transferable, non-exclusive, revocable licence) to use Co-Siter so long as you provide full and complete details (including contact details) and comply with the Terms and Conditions of Use.</p>
            <p>By accessing, using, registering or submitting applications via this Website and any other area of our Website where you can submit Land Access and Activity Notices (LAANs) or Access Requests, you confirm that you have read, understood and agree to these Terms of Use in its entirety. If you do not agree to these Terms of Use in its entirety, you must not use or access this Website.</p>
            <p>If you are found to have failed to comply with the Terms and Conditions of Use, your access to Co-Siter may be restricted, suspended, or revoked. &nbsp;All rights are reserved by siteXcell in respect of any unauthorised or inappropriate use of Co-Siter.</p>
            <p>An end to your Co-Siter access does not release you from any liability or penalty you may have incurred arising from or in connection with your access or use of Co-Siter.</p>
            <p class="terms-heading"><strong>DISCLAIMER</strong></p>
            <p>While siteXcell endeavours to keep all information up to date and correct, no representations or warranties of any kind, express or implied, are made about the completeness, accuracy, reliability or suitability of the information.&nbsp;</p>
            <p>You are responsible for your use of Co-Siter.&nbsp; siteXcell takes no responsibility and makes no representations or gives any warranty as to the accuracy or reliability of the content of Co-Siter.</p>
            <p>You are responsible for maintaining the confidentiality of your password and account and no liability will be taken for any loss or damage which may arise as a result of any failure by you to protect your password or account.</p>
            <p>In no event will liability for any loss or damage, including without limitation, indirect or consequential loss or damage, or any loss or damage whatsoever arising from loss of data or profits arising out of or in connection with the use of Co-Siter, be accepted.</p>
            <p>Every effort is made to keep Co-Siter up and running smoothly.&nbsp; However, no responsibility is taken for and no liability will be accepted for Co-Siter being unavailable, including but not limited to, on account of technical issues beyond siteXcell’s control.</p>
            <p>Your use of Co-Siter is at your own risk.</p>
            <p class="terms-heading"><strong>TERMS AND CONDITIONS</strong></p>
            <p>siteXcell may monitor your use of Co-Siter and reserves the right to restrict your access and use of Co-Siter, to the extent permitted by law.&nbsp; You agree at all times to use Co-Siter only in accordance with siteXcell’s policies, guidelines and terms and conditions. &nbsp;All rights are reserved by siteXcell in respect of any unauthorised or inappropriate use of Co-Siter.</p>
            <p>&nbsp;</p>
            <p class="terms-heading"><strong><u>PLEASE READ THESE TERMS AND CONDITIONS CAREFULLY BEFORE CONTINUING TO USE CO-SITER</u></strong></p>
            <p>If you continue to browse and use Co-Siter you agree to comply with and be bound by the following Terms and Conditions of Use, together with our privacy policy and disclaimer.</p>
            <p>As a user of Co-Siter, you <strong>must</strong>:</p>
            <ul>
                <li>- provide full and complete contact details;</li>
                <li>- use Co-Siter securely and for a proper and lawful purpose and you must not use it in any way that infringes the rights of anyone else;</li>
                <li>- only use or access information for a lawful and proper purpose;</li>
                <li>- keep information that you obtain through Co-Siter secure and/or confidential;</li>
                <li>- keep your passwords and access details secure and confidential at all times;</li>
                <li>- comply with all laws and policies; and</li>
                <li>- to the extent permitted by any applicable law, you must ensure that all information provided is accurate and up to date and does not infringe the rights of any other party.</li>
            </ul>
            <p>&nbsp;</p>
            <p>As a user of Co-Siter, you <strong>must</strong><strong> not</strong>:</p>
            <ul>
                <li>- make any false or misleading statements or provide any information or documentation which you know to be inaccurate, incomplete or misleading;</li>
                <li>- copy, reproduce, use or otherwise deal with any content on Co-Siter;</li>
                <li>- modify, distribute or re-post any content on Co-Siter for any purpose;</li>
                <li>- use the content of Co-Siter for any commercial exploitation whatsoever; or</li>
                <li>- copy, extract, keep, publish, or share information you obtain through Co-Siter outside the course of your employment.</li>
            </ul>
            <p>&nbsp;</p>
            <p class="terms-heading"><strong>COPYRIGHT TRADEMARKS</strong></p>
            <p>The appearance of the Website including (without limitation) all graphical elements, visual features, colour combinations and layout is owned by siteXcell Pty Ltd. Except where necessary for viewing the material on this Website on your browser, or as permitted under the Copyright Act 1968 or other applicable laws or these Terms of Use, nothing on this Website may be reproduced, adapted, uploaded to a third party, linked to, framed, performed in public, distributed or transmitted in any form by any process without the prior written consent of siteXcell Pty Ltd.</p>
            <p>Various trademarks or other intellectual property displayed on this Website may be owned by siteXcell. Other information and company data mentioned on this Website may be the trademarks or intellectual property of other people or entities reproduced on this Website by permission of the owners to siteXcell.</p>
            <p>These trademarks should not be used or reproduced by you or another party without the permission of the relevant owners. If you believe you own the copyright in any work and that work is displayed on this Website without your permission, please contact us and the matter will be investigated.</p>
            <p>&nbsp;</p>
            <p class="terms-heading"><strong>EMAIL SECURITY&nbsp;</strong></p>
            <p>The transmission of information over the internet is not completely secure or error-free. In particular, emails to or from siteXcell may not be secure. You should use discretion in deciding what information you send to us using these means.</p>
            <p>Emails to/from siteXcell may undergo email filtering and virus scanning, including by third-party contractors. siteXcell does not warrant that such filters and scans will be effective in removing viruses or other potentially harmful code.</p>
            <p class="terms-heading"><strong>VIRUS WARNING</strong></p>
            <p>All care is taken to ensure that this Website is free from viruses. siteXcell cannot guarantee that any file available for download and/or execution from or via this Website is free from viruses or other conditions which could damage or interfere with data, hardware or software with which it might be used. It is your responsibility to scan any such data for viruses. You assume all risk of use of all programs and files on this Website, and you release siteXcell entirely of all responsibility for any consequences of its use.</p>
            <p class="terms-heading"><strong>THIRD-PARTY SITES</strong></p>
            <p>This Website may contain links to third-party sites. siteXcell is not responsible for the condition or content of those sites as they are not under our control. You access those sites and services solely at your own risk. The links are provided solely for your convenience and do not indicate, expressly or impliedly, an endorsement by siteXcell of the other sites or services provided on the site. siteXcell does not permit any linkages to this Website without prior permission.</p>
            <p>No rights, including copyright and other intellectual proprietary rights, in and to Co-Siter are transferred through the use of Co-Siter.</p>
            <p>&nbsp;</p>
        </div>
    </div>`;

const renderDraftActions = () => `
    <div class="draft-actions" aria-label="Prototype draft actions">
        <button class="button-link" type="button" data-testid="save-draft" data-action="save-draft">Save draft</button>
        <button class="button-link" type="button" data-testid="restore-draft" data-action="restore-draft"${sessionStorage.getItem(draftKey) ? '' : ' disabled'}>Restore</button>
        <button class="button-link" type="button" data-testid="discard-draft" data-action="discard-draft"${sessionStorage.getItem(draftKey) ? '' : ' disabled'}>Discard</button>
        ${state.draftMessage ? `<span class="draft-status" role="status">${escapeHtml(state.draftMessage)}</span>` : ''}
    </div>`;

const renderStageOne = () => `
    ${renderErrorSummary()}
    <h2 class="form-title">LAAN request context</h2>

    <div class="form-grid">
        <div class="field${errorClass('activity')}">
            <label for="input_1_11">What type of activity does this LAAN relate to? <span class="required">*</span></label>
            ${renderActivityDropdown()}
            ${errorFor('activity')}
        </div>
        <div class="field stage-one-date${errorClass('commencementDate')}">
            <label for="input_1_12">Proposed Commencement Date <span class="required">*</span></label>
            <div class="control-shell">
                <input class="control" id="input_1_12" data-testid="commencement-date" name="commencementDate" type="text" inputmode="numeric" placeholder="dd-mm-yyyy" value="${escapeHtml(state.fields.commencementDate)}"${describedBy('commencementDate', 'date-help')}>
                <button class="control-icon no-divider" type="button" data-action="toggle-calendar" aria-label="${state.calendarOpen ? 'Close' : 'Open'} commencement date calendar" aria-expanded="${state.calendarOpen}">${icon('calendar', 'icon-small')}</button>
                ${renderCalendar()}
            </div>
            <span class="field-help" id="date-help">Match the activity commencement date on the attached LAAN.</span>
            ${errorFor('commencementDate')}
        </div>
    </div>
    <div class="field stage-one-owner">
        <label for="input_1_40">Owner Name <span class="field-optional">(optional filter)</span></label>
        ${renderOwnerDropdown()}

    </div>
    <div class="field stage-one-site${errorClass('siteId')}">
        <label for="input_1_41">Site name <span class="required">*</span></label>
        <div class="control-shell site-control">
            <input class="control" id="input_1_41" data-testid="site-search" name="siteQuery" type="search" autocomplete="off" placeholder="Type or open Site list" value="${escapeHtml(state.fields.siteQuery)}" role="combobox" aria-expanded="${state.siteMenuOpen}" aria-controls="site-results"${describedBy('siteId', 'site-help')}>
            ${selectedSite() ? `<button class="control-icon site-clear" type="button" data-action="clear-site" aria-label="Clear selected Site">${icon('close', 'icon-small')}</button>` : ''}
            <button class="control-icon${state.siteMenuOpen ? ' is-open' : ''}" type="button" data-action="toggle-site-menu" aria-label="${state.siteMenuOpen ? 'Close' : 'Open'} complete Site list" aria-expanded="${state.siteMenuOpen}">${icon('chevron', `icon-small dropdown-chevron${state.siteMenuOpen ? ' is-open' : ''}`)}</button>
            ${renderSiteResults()}
        </div>
        <span class="field-help" id="site-help">Search by Site name or identifier, or open the complete list.</span>
        ${errorFor('siteId')}
        ${renderSelectedSite()}
    </div>
    ${renderSiteRequirements()}
    ${renderTerms()}
    <div class="form-actions">
        <button class="button-primary" data-testid="stage-one-submit" type="submit">Next</button>
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

const renderTextField = ({ name, id, label, placeholder = '', type = 'text', span = false, help = '', count = false }) => `
    <div class="field${span ? ' field-span' : ''}${errorClass(name)}">
        <label for="${id}">${label} <span class="required">*</span></label>
        <input class="control" id="${id}" data-testid="${name}-field" name="${name}" type="${type}" placeholder="${escapeHtml(placeholder)}" value="${escapeHtml(state.fields[name])}"${describedBy(name)}>
        ${help || count ? `<span class="field-help field-meta">${help ? `<span>${escapeHtml(help)}</span>` : '<span></span>'}${count ? `<span data-character-count="${name}">${state.fields[name].length} of 255 max characters</span>` : ''}</span>` : ''}
        ${errorFor(name)}
    </div>`;

const formatBytes = (bytes) => {
    if (bytes >= 1024 * 1024) {
        return `${(bytes / (1024 * 1024)).toFixed(bytes % (1024 * 1024) === 0 ? 0 : 1)} MB`;
    }

    return `${Math.max(1, Math.round(bytes / 1024))} KB`;
};

const renderUploadCard = (kind, label, required) => {
    const files = kind === 'additional'
        ? state.files.additional
        : state.files.required ? [state.files.required] : [];
    const file = files[0] ?? null;
    const inputId = `${kind}-file-input`;
    const hasError = files.some((item) => item.status === 'error');
    const statusCopy = !files.length
        ? `${required ? 'Required' : 'Optional'} · PDF, JPG or PNG · maximum ${uploadRules.maximumLabel}`
        : '';
    const fileRows = files.map((item, index) => {
        const status = item.status === 'uploading'
            ? `Uploading ${escapeHtml(item.name)}…`
            : item.status === 'error'
                ? escapeHtml(item.error)
                : `${escapeHtml(item.name)} · ${formatBytes(item.size)} · Uploaded`;
        return `<div class="upload-file-row" data-testid="${kind}-file-${index}"><span>${status}</span><button class="icon-button" type="button" data-testid="${kind}-remove-${index}" data-action="remove-file" data-upload-kind="${kind}" data-upload-index="${index}" aria-label="Remove ${escapeHtml(item.name)}">${icon('close', 'icon-small')}</button></div>`;
    }).join('');

    return `<div class="upload-card${hasError ? ' has-error' : ''}">
        <span class="upload-icon">${icon(files.length ? 'file' : 'upload')}</span>
        <div class="upload-copy"><strong>${label}${required ? ' *' : ''}</strong><span>${statusCopy}</span>${fileRows}</div>
        <div class="upload-buttons">
            <input class="sr-only" id="${inputId}" data-testid="${kind}-upload" data-upload-kind="${kind}" type="file" accept=".pdf,.jpg,.jpeg,.png"${kind === 'additional' ? ' multiple' : ''}>
            <button class="upload-button" type="button" data-action="choose-file" data-upload-kind="${kind}">${kind === 'additional' ? 'Add files' : files.length ? 'Replace' : 'Choose file'}</button>
        </div>
    </div>`;
};

const renderConfirmations = () => {
    const uploadDisabled = !requiredUploadComplete();

    return `<div class="confirmations">
        <label class="confirmation-card check-row">
            <input data-testid="site-details-reviewed" name="siteDetailsReviewed" type="checkbox"${state.confirmations.siteDetailsReviewed ? ' checked' : ''}>
            <span>Drawings have been uploaded? <span class="required">*</span></span>
        </label>
        <label class="confirmation-card check-row${uploadDisabled ? ' is-disabled' : ''}">
            <input data-testid="upload-reviewed" name="uploadReviewed" type="checkbox"${state.confirmations.uploadReviewed ? ' checked' : ''}${uploadDisabled ? ' disabled' : ''}>
            <span>LAAN has been uploaded <span class="required">*</span></span>
        </label>
        <label class="confirmation-card check-row">
            <input data-testid="work-details-reviewed" name="workDetailsReviewed" type="checkbox"${state.confirmations.workDetailsReviewed ? ' checked' : ''}>
            <span>Additional supporting documents have been provided as required? <span class="required">*</span></span>
        </label>
        <label class="confirmation-card check-row">
            <input data-testid="accuracy-accepted" name="accuracyAccepted" type="checkbox"${state.confirmations.accuracyAccepted ? ' checked' : ''}>
            <span>I confirm that the information provided is true and accurate. <span class="required">*</span></span>
        </label>
    </div>`;
};

const renderReadiness = () => {
    const ready = formIsReady();

    return `<div class="readiness-panel${ready ? ' is-ready' : ''}" data-testid="readiness-panel" role="status">${renderReadinessContent(ready)}</div>`;
};

const renderCompletion = () => state.completionShown
    ? `<div class="completion-banner" role="status">${icon('check')}<div><strong>${isNativeWordPress ? 'LAAN request submitted' : 'Prototype ready for submission'}</strong><span>${isNativeWordPress ? `Request ID #${escapeHtml(state.submittedRequestId)}` : 'No record was created and no information was sent.'}</span></div></div>`
    : '';

const renderPageTwoFields = () => `<div class="page-two-grid original-field-grid">
    ${renderTextField({ name: 'carrier', id: 'input_1_58', label: 'Registered Carrier Name', count: true })}
    ${renderTextField({ name: 'projectReference', id: 'input_1_18', label: 'Carrier Project Reference', count: true })}
    ${renderTextField({ name: 'tenantCompany', id: 'input_1_19', label: 'Tenant Company Name', help: 'Tenant/Lessee Name', count: true })}
    ${renderTextField({ name: 'contactName', id: 'input_1_83', label: 'Tenant Contact Person', help: 'Tenant Contact Person' })}
    ${renderTextField({ name: 'contactPhone', id: 'input_1_87', label: 'Tenant Contact Number', type: 'tel' })}
    ${renderTextField({ name: 'workLocation', id: 'input_1_22', label: 'Tenant Location/Floor', help: 'EG L14, Rooftop, Tower', count: true })}
    ${renderTextField({ name: 'affectedAreas', id: 'input_1_64', label: 'Areas to be Accessed', help: 'EG: MDF L6, L14. Plant Roof and rooftop.', count: true, span: true })}
</div>`;

const renderPageTwoEvidence = () => `<div class="page-two-evidence">
    <section aria-labelledby="documents-heading">
        <h3 class="sr-only" id="documents-heading">Documents</h3>
        <div class="upload-stack">
            ${renderUploadCard('required', 'Upload a Copy of the LAAN', true)}
            ${renderUploadCard('additional', 'Additional Documents', false)}
        </div>
    </section>
    <section class="submission-confirmation" aria-labelledby="declarations-heading">
        <h3 class="form-section-heading" id="declarations-heading">Please confirm your submission</h3>
        ${renderConfirmations()}
        ${renderReadiness()}
    </section>
</div>`;

const renderStageTwoActions = () => `<div class="form-actions stage-two-actions">
    <div class="form-actions-group">
        <button class="button-secondary" data-testid="stage-two-back" type="button" data-action="go-stage-one">Previous</button>
        <button class="button-primary" data-testid="stage-two-submit" type="submit"${formIsReady() && !state.submitting && !state.submittedRequestId ? '' : ' disabled'}>${state.submitting ? 'Submitting&hellip;' : (state.submittedRequestId ? 'Request submitted' : 'Submit')}</button>
    </div>
    <span class="stage-two-status">${formIsReady() ? 'All required details are complete.' : 'Complete all required details to continue.'}</span>
</div>`;

const renderStageTwoOriginal = () => `<div class="page-two-prototype page-two-original" data-testid="stage-two">
    <h2 class="sr-only">Access details and evidence</h2>
    ${renderPageTwoFields()}
    ${renderPageTwoEvidence()}
    ${renderStageTwoActions()}
</div>`;

const renderStageTwo = () => {
    return `${renderErrorSummary()}${renderCompletion()}${renderStageTwoOriginal()}`;
};

const renderForm = () => `
    <form class="form-wrap${state.step === 2 ? ' is-stage-two' : ''}" id="laan-prototype-form" data-testid="laan-form" novalidate>
        ${renderProgress()}
        ${state.step === 1 ? `<div data-testid="stage-one">${renderStageOne()}</div>` : renderStageTwo()}
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
        ${!isNativeWordPress ? `<details class="state-inspector">
            <summary>Prototype state and edge controls</summary>
            ${state.step === 2 ? `<div class="draft-actions"><button class="button-link" type="button" data-action="fixture-valid-upload">Valid file</button><button class="button-link" type="button" data-action="fixture-upload-failure">Failed upload</button><button class="button-link" type="button" data-action="fixture-oversize-upload">Over 20 MB</button></div>` : ''}
            <pre data-state-json></pre>
        </details>` : ''}
    </aside>`;
};

const renderApplication = () => {
    const overflowState = Object.keys(state.errors).length || state.completionShown ? ' has-overflow-state' : '';
    const formLayout = `<div class="page-layout${state.step === 2 ? ` is-stage-two${overflowState}` : ''}"><div class="form-surface">${renderForm()}</div>${renderWorkspace()}</div>`;
    return embeddedInPortal ? formLayout : `<main class="portal-app">${renderSidebar()}<section class="portal-stage">${renderTopbar()}${formLayout}</section></main>`;
};

const render = ({ focusSite = false, focusError = false, scrollTop = false } = {}) => {
    root.innerHTML = renderApplication();
    const inspector = root.querySelector('[data-state-json]');

    if (inspector) {
        inspector.textContent = JSON.stringify(serializableState(), null, 2);
    }

    document.title = embeddedInPortal ? 'LAAN Request · Co-Siter demo' : isNativeWordPress ? 'LAAN Request' : 'Reference dashboard · LAAN Request Prototype';

    if (focusSite) {
        requestAnimationFrame(() => {
            const input = root.querySelector('[data-testid="site-search"]');
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
        const boundaryError = dateBoundaryError(state.fields.commencementDate);
        if (boundaryError) {
            errors.commencementDate = boundaryError;
        } else {
            errors.commencementDate = 'Enter a real date in DD-MM-YYYY format, for example 05-09-2026.';
        }
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

    if (isNativeWordPress) {
        submitNativeRequest();
        return;
    }

    setState({ errors: {}, completionShown: true });
};

const submitNativeRequest = async () => {
    if (state.submitting || !nativeConfig.ajaxUrl || !nativeConfig.nonce) {
        return;
    }

    state.submitting = true;
    state.errors = {};
    state.completionShown = false;
    persistSession();
    render();

    const formData = new FormData();
    formData.append('action', 'sitexcell_ui_laan_submit');
    formData.append('_ajax_nonce', nativeConfig.nonce);
    formData.append('payload', JSON.stringify({ fields: state.fields, confirmations: state.confirmations }));

    if (pendingFiles.required) {
        formData.append('required', pendingFiles.required, pendingFiles.required.name);
    }

    pendingFiles.additional.forEach((file) => {
        formData.append('additional[]', file, file.name);
    });

    try {
        const response = await fetch(nativeConfig.ajaxUrl, { method: 'POST', body: formData, credentials: 'same-origin' });
        const result = await response.json();

        if (!response.ok || !result.success) {
            state.submitting = false;
            state.errors = result.data?.errors ?? { submit: result.data?.message ?? 'The request could not be submitted.' };
            persistSession();
            render({ focusError: true });
            return;
        }

        state.submitting = false;
        state.completionShown = true;
        state.submittedRequestId = result.data?.requestId ?? 0;
        pendingFiles.required = null;
        pendingFiles.additional = [];
        sessionStorage.removeItem(sessionKey);
        render({ scrollTop: true });
    } catch (error) {
        state.submitting = false;
        state.errors = { submit: 'The request could not be submitted. Check your connection and try again.' };
        persistSession();
        render({ focusError: true });
    }
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

    const characterCount = root.querySelector(`[data-character-count="${name}"]`);
    if (characterCount) {
        characterCount.textContent = `${value.length} of 255 max characters`;
    }

    // Text input intentionally avoids a full render so the caret is not lost.
    // Keep readiness controls synchronized with the in-memory state instead.
    const submit = root.querySelector('button[type="submit"]');
    if (submit && state.step === 2) {
        submit.disabled = !formIsReady() || state.submitting || Boolean(state.submittedRequestId);
    }
    const status = root.querySelector('.stage-two-status');
    if (status && state.step === 2) {
        status.textContent = formIsReady()
            ? 'All required details are complete.'
            : 'Complete all required details to continue.';
    }

    const readiness = root.querySelector('[data-testid="readiness-panel"]');
    if (readiness && state.step === 2) {
        const ready = formIsReady();
        readiness.classList.toggle('is-ready', ready);
        readiness.innerHTML = renderReadinessContent(ready);
    }
};

const applyFile = (kind, file) => {
    const extension = file.name.includes('.') ? file.name.split('.').pop().toLowerCase() : '';
    const acceptedType = uploadRules.acceptedTypes.includes(file.type) || uploadRules.acceptedExtensions.includes(extension);
    const withinLimit = file.size <= uploadRules.maximumBytes;

    state.confirmations.uploadReviewed = kind === 'required' ? false : state.confirmations.uploadReviewed;
    state.completionShown = false;
    if (kind === 'required') {
        pendingFiles.required = null;
    }

    if (kind === 'additional') {
        const entry = !acceptedType || !withinLimit
            ? {
                name: file.name,
                size: file.size,
                type: file.type,
                status: 'error',
                error: !acceptedType ? 'Unsupported file type. Use PDF, JPG or PNG.' : `File is larger than ${uploadRules.maximumLabel}.`,
            }
            : { name: file.name, size: file.size, type: file.type, status: 'uploading' };
        state.files.additional = [...state.files.additional, entry];
        if (!entry.error) {
            pendingFiles.additional.push(file);
        }
        persistSession();
        render();
        if (!entry.error) {
            window.setTimeout(() => {
                const current = state.files.additional.find((item) => item.name === file.name && item.status === 'uploading');
                if (!current) return;
                current.status = 'uploaded';
                persistSession();
                render();
            }, 420);
        }
        return;
    }

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
    pendingFiles[kind] = file;
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

    if (target instanceof HTMLInputElement && target.dataset.uploadKind && target.files?.length) {
        if (target.dataset.uploadKind === 'additional') {
            Array.from(target.files).forEach((file) => applyFile('additional', file));
        } else {
            applyFile(target.dataset.uploadKind, target.files[0]);
        }
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
    if (event.key === 'Escape' && (state.openDropdown || state.siteMenuOpen || state.calendarOpen)) {
        event.preventDefault();
        state.openDropdown = '';
        state.siteMenuOpen = false;
        state.calendarOpen = false;
        state.calendarMenu = '';
        render();
        return;
    }

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
        if (state.openDropdown || state.siteMenuOpen || state.calendarOpen) {
            state.openDropdown = '';
            state.siteMenuOpen = false;
            state.calendarOpen = false;
            state.calendarMenu = '';
            render();
        }
        return;
    }

    const action = control.dataset.action;

    if (action === 'toggle-dropdown') {
        state.openDropdown = state.openDropdown === control.dataset.dropdown ? '' : control.dataset.dropdown;
        state.siteMenuOpen = false;
        state.calendarOpen = false;
        state.calendarMenu = '';
        render();
    }

    if (action === 'select-dropdown-option') {
        const name = control.dataset.dropdown;
        const previousActivity = state.fields.activity;
        state.fields[name] = control.dataset.dropdownValue;
        state.openDropdown = '';
        state.draftMessage = '';
        state.completionShown = false;
        delete state.errors[name];

        if (name === 'activity' && previousActivity && previousActivity !== state.fields.activity) {
            state.confirmations.workDetailsReviewed = false;
        }

        persistSession();
        render();
    }

    if (action === 'toggle-site-menu') {
        state.openDropdown = '';
        state.siteMenuOpen = !state.siteMenuOpen;
        state.calendarOpen = false;
        render({ focusSite: state.siteMenuOpen });
    }

    if (action === 'select-site') {
        const site = siteRecords.find(({ id }) => id === control.dataset.siteId);
        if (site) {
            state.fields.siteId = site.id;
            state.fields.siteQuery = site.name;
            state.openDropdown = '';
            state.siteMenuOpen = false;
            state.confirmations.siteDetailsReviewed = false;
            state.completionShown = false;
            delete state.errors.siteId;
            persistSession();
            render();
        }
    }

    if (action === 'clear-site' || action === 'change-site') {
        state.fields.siteId = '';
        state.fields.siteQuery = '';
        state.openDropdown = '';
        state.siteMenuOpen = true;
        state.confirmations.siteDetailsReviewed = false;
        state.completionShown = false;
        persistSession();
        render({ focusSite: true });
    }

    if (action === 'go-stage-one') {
        setState({ step: 1, errors: {}, completionShown: false, openDropdown: '', siteMenuOpen: false }, { scrollTop: true });
    }

    if (action === 'toggle-calendar') {
        state.calendarOpen = !state.calendarOpen;
        state.openDropdown = '';
        state.calendarMenu = '';
        state.siteMenuOpen = false;

        if (state.calendarOpen) {
            const selected = parseDateValue(state.fields.commencementDate);
            calendarView = selected
                ? { year: selected.year, month: selected.month }
                : { year: today.getFullYear(), month: today.getMonth() };
        }

        render();
    }

    if (action === 'calendar-previous' || action === 'calendar-next') {
        const direction = action === 'calendar-previous' ? -1 : 1;
        const nextMonth = new Date(Date.UTC(calendarView.year, calendarView.month + direction, 1));
        calendarView = { year: nextMonth.getUTCFullYear(), month: nextMonth.getUTCMonth() };
        state.calendarMenu = '';
        render();
    }

    if (action === 'toggle-calendar-month' || action === 'toggle-calendar-year') {
        const menu = action === 'toggle-calendar-month' ? 'month' : 'year';
        state.calendarMenu = state.calendarMenu === menu ? '' : menu;
        render();
    }

    if (action === 'select-calendar-month') {
        calendarView.month = Number(control.dataset.calendarMonth);
        state.calendarMenu = '';
        render();
    }

    if (action === 'select-calendar-year') {
        calendarView.year = Number(control.dataset.calendarYear);
        state.calendarMenu = '';
        render();
    }

    if (action === 'select-calendar-date') {
        const selected = calendarDateFromKey(control.dataset.calendarDate);
        state.fields.commencementDate = `${String(selected.day).padStart(2, '0')}-${String(selected.month + 1).padStart(2, '0')}-${selected.year}`;
        state.calendarOpen = false;
        state.calendarMenu = '';
        state.completionShown = false;
        delete state.errors.commencementDate;
        persistSession();
        render();
    }

    if (action === 'choose-file') {
        root.querySelector(`#${control.dataset.uploadKind}-file-input`)?.click();
    }

    if (action === 'remove-file') {
        const kind = control.dataset.uploadKind;
        if (kind === 'additional') {
            const index = Number(control.dataset.uploadIndex);
            state.files.additional = state.files.additional.filter((_, fileIndex) => fileIndex !== index);
            pendingFiles.additional = pendingFiles.additional.filter((file) => state.files.additional.some((item) => item.name === file.name));
        } else {
            state.files[kind] = null;
            pendingFiles[kind] = null;
        }
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
                files: {
                    ...defaultState.files,
                    ...draft.files,
                    additional: Array.isArray(draft.files?.additional)
                        ? draft.files.additional
                        : draft.files?.additional ? [draft.files.additional] : [],
                },
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
    const hasUnsavedInput = Object.values(state.fields).some(Boolean) || state.files.required || state.files.additional.length;
    const explicitDraft = sessionStorage.getItem(draftKey);
    const hasUnrecoverableFiles = pendingFiles.required || pendingFiles.additional.length;

    if (embeddedInPortal && !hasUnrecoverableFiles && sessionStorage.getItem(sessionKey)) {
        return;
    }

    if (hasUnsavedInput && !explicitDraft) {
        event.preventDefault();
    }
});

render();
