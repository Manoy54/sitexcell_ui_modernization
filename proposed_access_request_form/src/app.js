import { createCompleteDemoState, LINKED_LAAN, RETURNING_PEOPLE, SITES } from '../fixtures/prototype-fixtures.js';
import {
    DOCUMENT_RULES,
    applyCopy,
    changeSite,
    confirmDocument,
    createInitialState,
    formIsReady,
    goToStage,
    removeDocument,
    restoreSession,
    reviewSections,
    selectDocument,
    serializeSession,
    setBranchActive,
    setContractorCount,
    setContractorField,
    setField,
    setSiteQuery,
    setSiteRequirementsReviewed,
    undoLastCopy,
    validateStage,
} from './model/form-model.js';

const root = document.querySelector('#prototype-root');
const STORAGE_KEY = 'sitexcell-access-request-prototype-v1';
const STAGES = [
    ['Request context', 'Choose the Site and establish the request context.'],
    ['Site requirements', 'Review Site-specific access requirements.'],
    ['Request details', 'Record the access, carrier and contact details.'],
    ['Contractors', 'Identify each person attending the Site.'],
    ['Works & permits', 'Describe the works and required authority.'],
    ['Technical details', 'Record applicable installation and access details.'],
    ['Safety & evidence', 'Review safety evidence and current certificates.'],
    ['Review & declarations', 'Check active information before a future provider submission.'],
];

let state = loadState();
let siteMenuOpen = false;
let activeSiteIndex = -1;
let pendingCopy = null;
let resetPending = false;
let summaryOpen = false;
let statusMessage = '';

function loadState() {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (!saved) return createInitialState();
    try {
        return restoreSession(saved);
    } catch (error) {
        const clean = createInitialState();
        clean.notices.push(error.message);
        return clean;
    }
}

function saveState() {
    sessionStorage.setItem(STORAGE_KEY, serializeSession(state));
}

const escapeHtml = (value = '') => String(value)
    .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;').replaceAll("'", '&#039;');
const icon = (name, className = 'icon') => `<svg class="${className}" aria-hidden="true"><use href="#icon-${name}"></use></svg>`;
const checked = (value) => value ? ' checked' : '';
const selected = (actual, expected) => actual === expected ? ' selected' : '';
const errorId = (key) => `error-${key.replaceAll('.', '-')}`;

function fieldError(key) {
    const message = state.errors[key];
    return message ? `<p class="field-error" id="${errorId(key)}">${escapeHtml(message)}</p>` : '';
}

function textField(key, label, { type = 'text', required = false, originalId = '', hint = '', placeholder = '' } = {}) {
    const error = state.errors[key];
    return `<div class="field ${error ? 'field-invalid' : ''}">
        <label for="field-${key}">${escapeHtml(label)}${required ? '<span aria-hidden="true">*</span>' : ''}</label>
        ${hint ? `<p class="field-hint" id="hint-${key}">${escapeHtml(hint)}</p>` : ''}
        <input id="field-${key}" data-field="${key}" data-original-id="${escapeHtml(originalId)}" type="${type}" value="${escapeHtml(state.fields[key])}" placeholder="${escapeHtml(placeholder)}" ${required ? 'required' : ''} ${error ? `aria-invalid="true" aria-describedby="${errorId(key)}"` : hint ? `aria-describedby="hint-${key}"` : ''}>
        ${fieldError(key)}
    </div>`;
}

function textareaField(key, label, { required = false, originalId = '', hint = '' } = {}) {
    const error = state.errors[key];
    return `<div class="field field-wide ${error ? 'field-invalid' : ''}">
        <label for="field-${key}">${escapeHtml(label)}${required ? '<span aria-hidden="true">*</span>' : ''}</label>
        ${hint ? `<p class="field-hint" id="hint-${key}">${escapeHtml(hint)}</p>` : ''}
        <textarea id="field-${key}" data-field="${key}" data-original-id="${escapeHtml(originalId)}" rows="4" ${required ? 'required' : ''} ${error ? `aria-invalid="true" aria-describedby="${errorId(key)}"` : hint ? `aria-describedby="hint-${key}"` : ''}>${escapeHtml(state.fields[key])}</textarea>
        ${fieldError(key)}
    </div>`;
}

function selectField(key, label, options, { required = false, originalId = '' } = {}) {
    const error = state.errors[key];
    return `<div class="field ${error ? 'field-invalid' : ''}">
        <label for="field-${key}">${escapeHtml(label)}${required ? '<span aria-hidden="true">*</span>' : ''}</label>
        <select id="field-${key}" data-field="${key}" data-original-id="${escapeHtml(originalId)}" ${required ? 'required' : ''} ${error ? `aria-invalid="true" aria-describedby="${errorId(key)}"` : ''}>
            <option value="">Select an option</option>
            ${options.map(([value, optionLabel]) => `<option value="${escapeHtml(value)}"${selected(state.fields[key], value)}>${escapeHtml(optionLabel)}</option>`).join('')}
        </select>${fieldError(key)}
    </div>`;
}

function radios(key, legend, options, { required = false, originalId = '' } = {}) {
    const error = state.errors[key];
    return `<fieldset class="field field-wide choice-group ${error ? 'field-invalid' : ''}" data-original-id="${escapeHtml(originalId)}" ${error ? `aria-describedby="${errorId(key)}"` : ''}>
        <legend>${escapeHtml(legend)}${required ? '<span aria-hidden="true">*</span>' : ''}</legend>
        <div class="choice-row">${options.map(([value, label]) => `<label class="choice"><input type="radio" name="${key}" data-field="${key}" value="${escapeHtml(value)}"${checked(state.fields[key] === value)}> <span>${escapeHtml(label)}</span></label>`).join('')}</div>
        ${fieldError(key)}
    </fieldset>`;
}

function checkboxField(key, label, { required = false, originalId = '', hint = '' } = {}) {
    const error = state.errors[key];
    return `<div class="field field-wide ${error ? 'field-invalid' : ''}">
        <label class="check-line"><input type="checkbox" data-field="${key}" data-original-id="${escapeHtml(originalId)}"${checked(state.fields[key])}> <span>${escapeHtml(label)}${required ? '<span aria-hidden="true">*</span>' : ''}</span></label>
        ${hint ? `<p class="field-hint check-hint">${escapeHtml(hint)}</p>` : ''}${fieldError(key)}
    </div>`;
}

function section(title, description, body) {
    return `<section class="form-section"><div class="section-copy"><h2>${escapeHtml(title)}</h2>${description ? `<p>${escapeHtml(description)}</p>` : ''}</div><div class="field-grid">${body}</div></section>`;
}

function filteredSites() {
    const query = state.fields.siteQuery.trim().toLowerCase();
    if (!query) return SITES;
    return SITES.filter((site) => `${site.name} ${site.address} ${site.id}`.toLowerCase().includes(query));
}

function siteCombobox() {
    const matches = filteredSites();
    const error = state.errors.siteQuery;
    const options = siteMenuOpen ? `<div id="site-options" class="combobox-options" role="listbox">
        ${matches.length ? matches.map((site, index) => `<button type="button" role="option" id="site-option-${index}" data-select-site="${site.id}" aria-selected="${index === activeSiteIndex}" class="combobox-option ${index === activeSiteIndex ? 'active' : ''}"><strong>${escapeHtml(site.name)}</strong><span>${escapeHtml(site.address)}</span><small>${escapeHtml(site.id)}</small></button>`).join('') : '<p class="combobox-empty">No fictional Sites match that search.</p>'}
    </div>` : '';
    return `<div class="field field-wide combobox ${error ? 'field-invalid' : ''}">
        <label for="field-siteQuery">Search Site by name or address<span aria-hidden="true">*</span></label>
        <p class="field-hint" id="hint-siteQuery">Search uses fictional records only. Free text is not a selected Site.</p>
        <input id="field-siteQuery" data-site-query data-field="siteQuery" data-original-id="input_3_407" role="combobox" autocomplete="off" aria-autocomplete="list" aria-controls="site-options" aria-expanded="${siteMenuOpen}" aria-activedescendant="${activeSiteIndex >= 0 ? `site-option-${activeSiteIndex}` : ''}" value="${escapeHtml(state.fields.siteQuery)}" ${error ? `aria-invalid="true" aria-describedby="hint-siteQuery ${errorId('siteQuery')}"` : 'aria-describedby="hint-siteQuery"'}>
        ${options}${fieldError('siteQuery')}
        ${state.selectedSite ? `<div class="selected-site" data-testid="selected-site">${icon('check')}<div><strong>${escapeHtml(state.selectedSite.name)}</strong><span>${escapeHtml(state.selectedSite.address)} · ${escapeHtml(state.selectedSite.id)}</span></div></div>` : ''}
    </div>`;
}

function documentCard(key) {
    const rule = DOCUMENT_RULES[key];
    const documentState = state.documents[key];
    const confirmationKey = rule.confirmation;
    const isConfirmed = state.confirmations[confirmationKey] === documentState.version && documentState.status === 'selected';
    const statusCopy = documentState.status === 'selected'
        ? `${documentState.file?.name} · ${(documentState.file?.size / 1_000).toFixed(0)} KB`
        : documentState.status === 'needs-reselection' ? `${documentState.rememberedName} · reselection required` : 'No file selected';
    return `<article class="document-card ${documentState.error ? 'document-error' : ''}" data-testid="document-${key}" data-original-id="${rule.originalId}">
        <div class="document-heading"><span class="document-icon">${icon('document')}</span><div><h3>${escapeHtml(rule.label)}${rule.required ? '<span aria-hidden="true">*</span>' : ''}</h3><p>${escapeHtml(statusCopy)}</p></div></div>
        ${documentState.error ? `<p class="field-error" role="status">${escapeHtml(documentState.error)}</p>` : ''}
        <div class="document-actions">
            <label class="file-button">${icon('upload')}<span>${documentState.status === 'selected' ? 'Replace' : 'Choose file'}</span><input class="sr-only" type="file" data-document="${key}" aria-label="Choose ${escapeHtml(rule.label)} file" accept="${rule.acceptedTypes.join(',')}"></label>
            ${documentState.status !== 'missing' ? `<button type="button" class="button-link" data-remove-document="${key}">Remove</button>` : ''}
        </div>
        <p class="document-contract">${rule.maxBytes / 1_000_000} MB maximum · ${escapeHtml(rule.source)}</p>
        ${documentState.status === 'selected' ? `<label class="check-line document-confirm"><input type="checkbox" data-confirm-document="${key}"${checked(isConfirmed)}> <span>I reviewed this selected file</span></label>` : ''}
    </article>`;
}

function renderStage1() {
    return section('Site and request link', 'Start with the telecommunications property this request concerns.',
        `${selectField('linkedLaan', 'Linked LAAN request (optional)', [['LAAN-DEMO-204', 'LAAN-DEMO-204 · Southbank Exchange']], { originalId: 'input_3_346' })}
        ${textField('ownerName', 'Owner name (optional)', { originalId: 'input_3_406' })}${siteCombobox()}`)
        + section('Authority and terms', 'These declarations retain the observed Access Request wording.',
            `${radios('tenureConfirmed', 'I confirm tenure via a Licence or LAAN is in place.', [['yes', 'Yes'], ['no', 'No']], { required: true, originalId: 'input_3_528' })}
            ${radios('networkRequired', 'Is network access required?', [['yes', 'Yes'], ['no', 'No']], { originalId: 'input_3_532' })}
            ${checkboxField('termsAccepted', 'I accept the Terms and Conditions of the Co-Siter Portal', { required: true, originalId: 'input_3_464' })}`);
}

function renderStage2() {
    const site = state.selectedSite;
    return section('Application requirements', 'Review the requirements derived from the selected fictional Site.',
        `${radios('emergencyAccess', 'Access type', [['emergency', 'Emergency access'], ['not-required', 'Standard / not emergency']], { originalId: 'input_3_575' })}
        <div class="requirement-panel field-wide"><span class="document-icon">${icon('info')}</span><div><h3>${escapeHtml(site?.name ?? 'No Site selected')}</h3><p>${escapeHtml(site?.requirement ?? 'Return to Stage 1 and select a Site to view its requirements.')}</p></div></div>
        ${textField('buildingAddress', 'Building address', { originalId: 'input_3_9' })}
        ${checkboxField('requirementsRead', 'I have read and understand the application requirements.', { required: true, originalId: 'input_3_430' })}`);
}

function renderStage3() {
    return section('Tenant and access', 'Record who needs access, when and where.',
        `${textField('projectReference', 'Project reference', { required: true, originalId: 'input_3_10' })}
        ${textField('tenantCompany', 'Tenant company name', { required: true, originalId: 'input_3_11' })}
        ${textField('tenantContactName', 'Tenant nominated contact person', { required: true, originalId: 'input_3_269' })}
        ${textField('tenantContactPhone', 'Tenant contact number', { type: 'tel', required: true, originalId: 'input_3_270' })}
        ${textField('tenantLocation', 'Tenant location or floor', { required: true, originalId: 'input_3_12' })}
        ${textField('accessAreas', 'Areas to be accessed', { required: true, originalId: 'input_3_527' })}
        ${textField('accessDate', 'Access date', { required: true, originalId: 'input_3_13', placeholder: 'DD-MM-YYYY' })}
        ${textField('accessStart', 'Access time start', { required: true, originalId: 'input_3_437', placeholder: '09:00' })}
        ${textField('accessFinish', 'Access time finish', { required: true, originalId: 'input_3_438', placeholder: '17:00' })}
        ${textField('numberOfDays', 'Number of days', { originalId: 'input_3_495' })}`)
        + section('Carrier', 'Keep the carrier contact distinct from the tenant and requester.',
            `${textField('carrierName', 'Registered carrier name', { required: true, originalId: 'input_3_440' })}
            ${textField('carrierContactName', 'Nominated contact person', { required: true, originalId: 'input_3_52' })}
            ${textField('carrierContactPhone', 'Contact number', { type: 'tel', required: true, originalId: 'input_3_53' })}
            ${textField('carrierAddress', 'Carrier address', { required: true, originalId: 'input_3_441' })}`)
        + section('Requester', 'Copy is explicit, limited to approved prototype mappings, and reversible.',
            `<div class="inline-actions field-wide"><button type="button" class="button-secondary" data-copy="requester:tenant">Copy requester to tenant contact</button><button type="button" class="button-secondary" data-copy="requester:carrier">Copy requester to carrier</button>${state.copyHistory.length ? '<button type="button" class="button-link" data-undo-copy>Undo last copy</button>' : ''}</div>
            ${textField('requesterName', 'Your full name', { required: true, originalId: 'input_3_16' })}
            ${textField('requesterCompany', 'Your company', { required: true, originalId: 'input_3_17' })}
            ${textField('requesterJobTitle', 'Job title', { originalId: 'input_3_458' })}
            ${textField('requesterPhone', 'Your phone', { type: 'tel', required: true, originalId: 'input_3_19' })}
            ${textField('requesterEmail', 'Your email', { type: 'email', required: true, originalId: 'input_3_18' })}
            ${textField('requesterAddress', 'Your address', { originalId: 'input_3_21' })}`);
}

function contractorFields(contractor, index) {
    const item = (key, label, type = 'text') => {
        const compound = `${contractor.id}.${key}`;
        const error = state.errors[compound];
        return `<div class="field ${error ? 'field-invalid' : ''}"><label for="${compound}">${label}<span aria-hidden="true">*</span></label><input id="${compound}" type="${type}" data-contractor="${contractor.id}" data-contractor-field="${key}" value="${escapeHtml(contractor[key])}" ${error ? `aria-invalid="true" aria-describedby="${errorId(compound)}"` : ''}>${fieldError(compound)}</div>`;
    };
    return `<article class="contractor"><div class="contractor-title"><span>${index + 1}</span><div><h3>Contractor ${index + 1}</h3><p>Stable prototype identity: ${contractor.id}</p></div></div><div class="field-grid">${item('name', 'Full name')}${item('company', 'Company')}${item('phone', 'Phone', 'tel')}${item('licence', 'Driver licence number')}${item('whiteCard', 'White Card induction number')}</div></article>`;
}

function renderStage4() {
    return section('Contractor group', 'Adjusting the count preserves stable records for contractors that remain active.',
        `${selectField('contractorCount', 'Number of contractors', Array.from({ length: 10 }, (_, index) => [String(index + 1), String(index + 1)]), { required: true, originalId: 'input_3_158' })}
        <p class="field-hint field-wide">For more than ten contractors, the production rule remains unresolved; this prototype does not invent an eleventh repeated group.</p>`)
        + state.contractors.map(contractorFields).join('')
        + section('Qualifications and training', 'The file stays selected through navigation and validation. Reload requires reselection.', documentCard('qualification'));
}

function renderStage5() {
    return section('Works and permit', 'Only active conditional details participate in review and readiness.',
        `${selectField('natureOfWorks', 'Nature of works', [['inspection', 'Inspection'], ['maintenance', 'Inspection and minor maintenance'], ['installation', 'Installation'], ['removal', 'Removal']], { required: true, originalId: 'input_3_397' })}
        ${selectField('permitType', 'Network access permit type', [['standard', 'Standard access permit'], ['after-hours', 'After-hours permit'], ['isolation', 'Isolation permit']], { required: true, originalId: 'input_3_409' })}
        ${textareaField('worksDescription', 'Describe the works to be completed', { required: true, originalId: 'input_3_35' })}
        ${radios('noisyWorks', 'Will the works be noisy or disruptive?', [['yes', 'Yes'], ['no', 'No']], { required: true, originalId: 'input_3_36' })}
        ${state.branches.noisyWorks ? textareaField('noisyDetails', 'Noisy or disruptive works details', { required: true, originalId: 'input_3_442' }) : ''}
        ${checkboxField('specialAccessAcknowledged', 'I acknowledge that security, parking, goods lift and deliveries must be pre-arranged with the Site contact.', { required: true, originalId: 'input_3_435' })}`)
        + section('Works declarations', 'Confirm the observed operational requirements for this fictional scenario.',
            `${checkboxField('permitAgreed', 'I agree to obtain the required network access permit.', { required: true, originalId: 'input_3_447' })}
            ${checkboxField('ownerPermitAgreed', 'I agree to obtain applicable Owner permits and inductions.', { required: true, originalId: 'input_3_354' })}
            ${radios('worksAtHeight', 'Will the work involve working at heights?', [['yes', 'Yes'], ['no', 'No']], { required: true, originalId: 'input_3_37' })}
            ${radios('asbestosRisk', 'Could the work disturb asbestos-containing material?', [['yes', 'Yes'], ['no', 'No'], ['na', 'Not applicable']], { required: true, originalId: 'input_3_38' })}
            ${radios('fireIsolation', 'Is a fire-system isolation required?', [['yes', 'Yes'], ['no', 'No']], { required: true, originalId: 'input_3_355' })}`)
        + section('Authority documents', 'Replacing or removing a document affects only its mapped review confirmation.', documentCard('authority'));
}

function renderStage6() {
    return section('Technical scope', 'Select Not applicable when no telecommunications installation change is proposed.',
        `${selectField('technicalChange', 'Technical work type', [['not-applicable', 'Not applicable'], ['installation', 'Installation'], ['removal', 'Removal'], ['upgrade', 'Upgrade'], ['change', 'Change']], { required: true, originalId: 'input_3_56' })}
        ${state.branches.technicalWork ? `${textareaField('technicalDetails', 'Additional technical details', { required: true, originalId: 'input_3_57' })}${textField('cableStart', 'Cable run start', { required: true, originalId: 'input_3_552' })}${textField('cableEnd', 'Cable run end', { required: true, originalId: 'input_3_553' })}${textField('riser', 'Riser utilised', { required: true, originalId: 'input_3_554' })}${textField('cableCapacity', 'Cable capacity', { required: true, originalId: 'input_3_556' })}` : ''}
        ${radios('roofAccess', 'Will roof or structure areas be accessed?', [['yes', 'Yes'], ['no', 'No']], { required: true, originalId: 'input_3_54' })}
        ${state.branches.roofAccess ? textareaField('roofAreas', 'Areas of roof or structure to be accessed', { required: true, originalId: 'input_3_67' }) : ''}`)
        + section('Power and building access', 'Only active follow-up fields are required and shown in the final review.',
            `${radios('powerRequired', 'Is a new or upgraded power source required?', [['yes', 'Yes'], ['no', 'No']], { required: true, originalId: 'input_3_69' })}
            ${state.branches.powerRequired ? `${textareaField('powerDetails', 'New or upgraded power source details', { required: true, originalId: 'input_3_443' })}${textareaField('billingArrangement', 'Owner power billing arrangement', { required: true, originalId: 'input_3_272' })}` : ''}
            ${radios('ceilingAccess', 'Will ceiling space be accessed?', [['yes', 'Yes'], ['no', 'No']], { required: true, originalId: 'input_3_73' })}
            ${radios('riserAccess', 'Will existing risers or pathways be used?', [['yes', 'Yes'], ['no', 'No']], { required: true, originalId: 'input_3_75' })}
            ${radios('coreDrilling', 'Is core drilling or penetration work proposed?', [['yes', 'Yes'], ['no', 'No']], { required: true, originalId: 'input_3_78' })}
            ${radios('certifierRequired', 'Is a building certifier required?', [['yes', 'Yes'], ['no', 'No']], { required: true, originalId: 'input_3_382' })}
            ${state.branches.certifierRequired ? textField('certifierName', 'Proposed certifier name', { required: true, originalId: 'input_3_384' }) : ''}`)
        + section('Technical acknowledgements', 'These confirmations retain the observed technical review boundary.',
            `${checkboxField('technicalRulesAgreed', 'I agree to comply with Site technical requirements.', { required: true, originalId: 'input_3_81' })}
            ${checkboxField('cablingAgreed', 'I agree that cabling and equipment will meet applicable standards.', { required: true, originalId: 'input_3_80' })}
            ${checkboxField('penetrationsAgreed', 'I agree that penetrations will be sealed and documented.', { required: true, originalId: 'input_3_83' })}
            ${checkboxField('cleanupAgreed', 'I agree to leave work areas safe and clean.', { required: true, originalId: 'input_3_85' })}`)
        + (state.branches.roofAccess ? section('Roof access evidence', 'This document is required only in the synthetic roof-access scenario.', documentCard('roofPermit')) : '');
}

function renderStage7() {
    const swmsItems = [
        ['swms1', 'input_3_498', 'Site and address details are included.'],
        ['swms2', 'input_3_502', 'Contractor company and contact details are included.'],
        ['swms3', 'input_3_501', 'The responsible person for SWMS compliance is identified.'],
        ['swms4', 'input_3_500', 'The activity and high-risk work scope are described.'],
        ['swms5', 'input_3_499', 'Required competencies, training and licences are included.'],
        ['swms6', 'input_3_503', 'The work activity is broken into steps or tasks.'],
        ['swms7', 'input_3_504', 'Hazards are identified and risks assessed for each task.'],
        ['swms8', 'input_3_497', 'Control measures follow the hierarchy of controls.'],
        ['swms9', 'input_3_505', 'Relevant legislation, standards and guidance are specified.'],
        ['swms10', 'input_3_508', 'Task-specific emergency and rescue procedures are included.'],
        ['swms11', 'input_3_506', 'Required plant and equipment are listed.'],
        ['swms12', 'input_3_507', 'Competent contractor names, positions and signatures are included.'],
    ];
    return section('Safety record', 'Dates and identifiers are synthetic. Production validity rules remain outside this prototype.',
        `${textField('sassiNumber', 'SASSI registration number', { required: true, originalId: 'input_3_522' })}
        ${textField('workersCompExpiry', 'Workers Compensation expiry date', { required: true, originalId: 'input_3_300', placeholder: 'DD-MM-YYYY' })}
        ${textField('liabilityExpiry', 'Public Liability expiry date', { required: true, originalId: 'input_3_342', placeholder: 'DD-MM-YYYY' })}`)
        + section('SWMS review', 'Confirm each observed Site-specific SWMS criterion.', swmsItems.map(([key, originalId, label]) => checkboxField(key, label, { required: true, originalId })).join(''))
        + section('Required evidence', 'Each selected file has independent identity, validation and confirmation state.', `${documentCard('swms')}${documentCard('workersComp')}${documentCard('liability')}`)
        + section('Documentation declaration', '', checkboxField('documentsConfirmed', 'I confirm that copies of the documentation above are selected and reviewed.', { required: true, originalId: 'input_3_402' }));
}

function renderReview() {
    const sections = reviewSections(state);
    return `<div class="review-sections">${sections.map((item) => `<section class="review-section"><div class="review-heading"><h2>${escapeHtml(item.title)}</h2><button type="button" class="button-link" data-edit-stage="${item.stage}">Edit</button></div>${item.values.length ? `<dl>${item.values.map(([label, value]) => `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd></div>`).join('')}</dl>` : '<p class="empty-copy">No active values in this section.</p>'}</section>`).join('')}</div>`;
}

function renderStage8() {
    const ready = formIsReady(state);
    return section('Final declarations', 'These declarations make the fictional scenario reviewable; they do not authorize submission.',
        `${checkboxField('siteDeclaration', 'I confirm the Site and access details are accurate for this prototype scenario.', { required: true, originalId: 'input_3_547' })}
        ${checkboxField('safetyDeclaration', 'I confirm the safety evidence has been reviewed.', { required: true, originalId: 'input_3_357' })}
        ${textareaField('invoiceDetails', 'Invoice details', { required: true, originalId: 'input_3_359' })}
        ${checkboxField('finalDeclaration', 'I agree this information is ready for prototype review.', { required: true, originalId: 'input_3_360' })}
        ${textareaField('additionalNotes', 'Additional relevant information', { originalId: 'input_3_309' })}
        ${documentCard('supporting')}`)
        + `<div class="readiness ${ready ? 'ready' : ''}">${icon(ready ? 'check' : 'info')}<div><strong>${ready ? 'Ready for prototype review' : 'Not ready for prototype review'}</strong><p>${ready ? 'All synthetic rules are satisfied. Final submission remains unavailable.' : 'Complete the highlighted prototype requirements before review.'}</p></div></div>`
        + renderReview();
}

const stageRenderers = [renderStage1, renderStage2, renderStage3, renderStage4, renderStage5, renderStage6, renderStage7, renderStage8];

function errorSummary() {
    const entries = Object.entries(state.errors);
    if (!entries.length) return '';
    return `<div class="error-summary" role="alert" tabindex="-1"><div>${icon('info')}</div><div><h2>Check ${entries.length} ${entries.length === 1 ? 'item' : 'items'} before continuing</h2><ul>${entries.map(([key, message]) => `<li><button type="button" data-focus-error="${escapeHtml(key)}">${escapeHtml(message)}</button></li>`).join('')}</ul></div></div>`;
}

function stageNavigation() {
    return `<ol class="stage-list">${STAGES.map(([title], index) => {
        const stage = index + 1;
        const complete = state.completedStages.includes(stage) || (stage < state.currentStage && !Object.keys(validateStage(state, stage).errors).length);
        const enabled = stage === state.currentStage || complete;
        return `<li><button type="button" data-stage="${stage}" ${enabled ? '' : 'disabled'} aria-current="${stage === state.currentStage ? 'step' : 'false'}"><span>${complete ? icon('check', 'icon-small') : stage}</span><span><strong>Stage ${stage}</strong>${escapeHtml(title)}</span></button></li>`;
    }).join('')}</ol>`;
}

function workspace() {
    const completed = Array.from({ length: 8 }, (_, index) => index + 1).filter((stage) => validateStage(state, stage).valid).length;
    const selectedDocs = Object.values(state.documents).filter((document) => document.status === 'selected').length;
    return `<aside class="workspace ${summaryOpen ? 'mobile-open' : ''}" aria-label="Request summary">
        <button type="button" class="summary-toggle" aria-expanded="${summaryOpen}" data-summary-toggle>${summaryOpen ? 'Hide' : 'Show'} request summary ${icon('chevron')}</button>
        <div class="workspace-inner">
            <section class="workspace-context"><h2>Request summary</h2><div class="context-id">SAR · PROTOTYPE</div><dl><div><dt>Site</dt><dd>${escapeHtml(state.selectedSite?.name ?? 'Not selected')}</dd></div><div><dt>Project</dt><dd>${escapeHtml(state.fields.projectReference || 'Not entered')}</dd></div><div><dt>Documents</dt><dd>${selectedDocs} selected</dd></div></dl></section>
            <section class="workspace-progress"><div class="progress-copy"><h2>Progress</h2><span>${completed} of 8 ready</span></div><div class="progress-track progress-${completed}" aria-hidden="true"><span></span></div>${stageNavigation()}</section>
            <details class="reviewer-tools"><summary>Reviewer demonstrations</summary><div class="reviewer-body"><p>All records are fictional. These tools demonstrate proposed behavior where live business rules remain unresolved.</p><div class="reviewer-actions"><button type="button" class="button-secondary full" data-load-demo>Load complete scenario</button><button type="button" class="button-secondary full" data-load-person>Use returning person</button><button type="button" class="button-secondary full" data-load-laan>Apply linked LAAN context</button><button type="button" class="button-secondary full" data-simulate-failure>Simulate authority failure</button><button type="button" class="button-link full" data-retry-authority>Retry authority demo</button></div><dl class="evidence-list"><div><dt>Live baseline</dt><dd>27 pass · 2 fail · 20 blocked · 1 N/A</dd></div><div><dt>Field inventory</dt><dd>264 rows · 392 controls mapped</dd></div><div><dt>Submission</dt><dd>Disabled by design</dd></div></dl><p class="source-note">Linked LAAN demo: ${LINKED_LAAN.id}<br>${escapeHtml(LINKED_LAAN.source)}</p></div></details>
        </div>
    </aside>`;
}

function pendingAction() {
    if (pendingCopy) return `<div class="inline-confirm" role="alert"><div><strong>Replace populated target fields?</strong><p>Only the mapped fields will be copied. Unrelated values stay unchanged.</p></div><div><button type="button" class="button-primary" data-confirm-copy>Replace mapped fields</button><button type="button" class="button-secondary" data-cancel-copy>Cancel</button></div></div>`;
    if (resetPending) return `<div class="inline-confirm" role="alert"><div><strong>Reset this prototype session?</strong><p>Text, selections, files, stashed branches and copy history will be cleared.</p></div><div><button type="button" class="button-danger" data-confirm-reset>Reset session</button><button type="button" class="button-secondary" data-cancel-reset>Keep working</button></div></div>`;
    return '';
}

function render() {
    const [stageTitle, stageIntro] = STAGES[state.currentStage - 1];
    root.innerHTML = `<div class="portal-app">
        <aside class="portal-sidebar"><div class="portal-brand"><span class="cositer-wordmark"><span>co-</span>siter<sup>™</sup></span><small>Property access coordination</small></div><nav class="portal-nav" aria-label="Co-Siter"><button aria-current="page">${icon('request')} Access requests</button><button disabled>${icon('users')} Contacts</button><button disabled>${icon('document')} Documents</button></nav><div class="portal-user"><span class="portal-avatar">AM</span><div><strong>Alex Morgan</strong><span>Prototype reviewer</span></div></div></aside>
        <main class="portal-stage"><header class="portal-topbar"><h1>${icon('request')} Access Request</h1><div class="topbar-actions"><button type="button" class="topbar-button" data-load-demo>Load complete scenario</button><button type="button" class="topbar-button" data-reset>Reset</button></div></header>
            <div class="prototype-banner">${icon('info')}<strong>Prototype only — no request will be submitted.</strong><span>Fictional data · local browser state · no external integration</span></div>
            <div class="request-layout"><div class="form-column"><div class="stage-header"><p>Stage ${state.currentStage} of 8</p><h1>${escapeHtml(stageTitle)}</h1><span>${escapeHtml(stageIntro)}</span></div>${pendingAction()}${errorSummary()}${state.notices.slice(-1).map((notice) => `<div class="notice" role="status">${icon('info')}<span>${escapeHtml(notice)}</span></div>`).join('')}<form novalidate>${stageRenderers[state.currentStage - 1]()}</form>
                <footer class="form-actions"><button type="button" class="button-secondary" data-back ${state.currentStage === 1 ? 'disabled' : ''}>Back</button><span class="save-status">Saved in this tab</span>${state.currentStage < 8 ? `<button type="button" class="button-primary" data-continue>Continue to ${escapeHtml(STAGES[state.currentStage][0])}</button>` : '<button type="button" class="button-primary" disabled aria-describedby="submit-note">Submit access request</button><span id="submit-note" class="sr-only">Submission is disabled in this prototype.</span>'}</footer>
            </div>${workspace()}</div>
        </main>
        <div class="sr-only" aria-live="polite">${escapeHtml(statusMessage)}</div>
    </div>`;
}

function updateFieldFromControl(control) {
    const key = control.dataset.field;
    const value = control.type === 'checkbox' ? control.checked : control.value;
    state = key === 'requirementsRead' ? setSiteRequirementsReviewed(state, value) : setField(state, key, value);
    if (key === 'noisyWorks') state = setBranchActive(state, 'noisyWorks', value === 'yes');
    if (key === 'technicalChange') state = setBranchActive(state, 'technicalWork', value !== 'not-applicable' && value !== '');
    if (key === 'roofAccess') state = setBranchActive(state, 'roofAccess', value === 'yes');
    if (key === 'powerRequired') state = setBranchActive(state, 'powerRequired', value === 'yes');
    if (key === 'certifierRequired') state = setBranchActive(state, 'certifierRequired', value === 'yes');
    if (key === 'contractorCount') state = setContractorCount(state, value);
}

root.addEventListener('input', (event) => {
    const contractor = event.target.closest('[data-contractor]');
    if (contractor) {
        state = setContractorField(state, contractor.dataset.contractor, contractor.dataset.contractorField, contractor.value);
        saveState();
        return;
    }
    const control = event.target.closest('[data-field]');
    if (!control || control.matches('[type="radio"], [type="checkbox"], select')) return;
    if (control.hasAttribute('data-site-query')) {
        state = setSiteQuery(state, control.value);
        siteMenuOpen = true;
        activeSiteIndex = -1;
        saveState();
        render();
        const query = root.querySelector('[data-site-query]');
        query?.focus();
        query?.setSelectionRange(query.value.length, query.value.length);
        return;
    }
    updateFieldFromControl(control);
    saveState();
});

root.addEventListener('change', (event) => {
    const fileInput = event.target.closest('[data-document]');
    if (fileInput) {
        const file = fileInput.files?.[0];
        if (file) state = selectDocument(state, fileInput.dataset.document, file);
        statusMessage = state.documents[fileInput.dataset.document].error || `${file?.name} selected.`;
        saveState(); render(); return;
    }
    const confirmation = event.target.closest('[data-confirm-document]');
    if (confirmation) {
        state = confirmDocument(state, confirmation.dataset.confirmDocument, confirmation.checked);
        saveState(); render(); return;
    }
    const contractor = event.target.closest('[data-contractor]');
    if (contractor) {
        state = setContractorField(state, contractor.dataset.contractor, contractor.dataset.contractorField, contractor.value);
        saveState(); return;
    }
    const control = event.target.closest('[data-field]');
    if (control) {
        updateFieldFromControl(control);
        saveState();
        if (control.matches('[type="radio"], [type="checkbox"], select')) render();
    }
});

root.addEventListener('keydown', (event) => {
    if (!event.target.hasAttribute('data-site-query')) return;
    const matches = filteredSites();
    if (event.key === 'ArrowDown') {
        event.preventDefault(); siteMenuOpen = true; activeSiteIndex = Math.min(activeSiteIndex + 1, matches.length - 1); render(); root.querySelector('[data-site-query]')?.focus();
    } else if (event.key === 'ArrowUp') {
        event.preventDefault(); activeSiteIndex = Math.max(activeSiteIndex - 1, 0); render(); root.querySelector('[data-site-query]')?.focus();
    } else if (event.key === 'Enter' && activeSiteIndex >= 0 && matches[activeSiteIndex]) {
        event.preventDefault(); state = changeSite(state, matches[activeSiteIndex]); siteMenuOpen = false; activeSiteIndex = -1; saveState(); render(); root.querySelector('[data-site-query]')?.focus();
    } else if (event.key === 'Escape') {
        siteMenuOpen = false; activeSiteIndex = -1; render(); root.querySelector('[data-site-query]')?.focus();
    }
});

root.addEventListener('click', (event) => {
    const target = event.target.closest('button, [data-select-site]');
    if (!target) return;
    if (target.dataset.selectSite) {
        const site = SITES.find((candidate) => candidate.id === target.dataset.selectSite);
        state = changeSite(state, site); siteMenuOpen = false; activeSiteIndex = -1; saveState(); render(); return;
    }
    if (target.hasAttribute('data-continue')) {
        const result = validateStage(state, state.currentStage);
        state = result.state;
        if (!result.valid) {
            state.metrics.validationCorrections += 1;
            render();
            const firstKey = Object.keys(result.errors)[0];
            requestAnimationFrame(() => (root.querySelector(`[data-field="${CSS.escape(firstKey)}"]`) || root.querySelector(`[data-testid="document-${CSS.escape(firstKey)}"] input`) || root.querySelector('.error-summary'))?.focus());
            return;
        }
        const destination = state.reviewReturnStage ? 8 : state.currentStage + 1;
        state.reviewReturnStage = null;
        state = goToStage(state, destination).state;
        saveState(); render(); root.querySelector('.form-column')?.scrollTo(0, 0); return;
    }
    if (target.hasAttribute('data-back')) {
        state = goToStage(state, state.currentStage - 1).state; saveState(); render(); return;
    }
    if (target.dataset.stage) {
        state = goToStage(state, Number(target.dataset.stage)).state; saveState(); render(); return;
    }
    if (target.dataset.editStage) {
        state.reviewReturnStage = Number(target.dataset.editStage); state = goToStage(state, Number(target.dataset.editStage)).state; saveState(); render(); return;
    }
    if (target.dataset.focusError) {
        const key = target.dataset.focusError;
        (root.querySelector(`[data-field="${CSS.escape(key)}"]`) || root.querySelector(`[data-testid="document-${CSS.escape(key)}"] input`) || root.querySelector(`[id="${CSS.escape(key)}"]`))?.focus(); return;
    }
    if (target.hasAttribute('data-load-demo')) {
        state = createCompleteDemoState(); saveState(); statusMessage = 'Complete fictional scenario loaded.'; render(); return;
    }
    if (target.hasAttribute('data-load-person')) {
        const person = RETURNING_PEOPLE[0];
        const mapping = { requesterName: person.name, requesterCompany: person.company, requesterPhone: person.phone, requesterEmail: person.email };
        const skipped = [];
        for (const [key, value] of Object.entries(mapping)) {
            if (state.fields[key] && state.fields[key] !== value) skipped.push(key);
            else state = setField(state, key, value);
        }
        state.notices.push(skipped.length ? `Returning person loaded without replacing ${skipped.length} populated field(s).` : `Returning person loaded: ${person.name} · ${person.freshness}.`);
        saveState(); render(); return;
    }
    if (target.hasAttribute('data-load-laan')) {
        const linkedSite = SITES.find((candidate) => candidate.id === LINKED_LAAN.siteId);
        if (state.selectedSite && state.selectedSite.id !== linkedSite.id) {
            state.notices.push(`Linked LAAN Site conflict detected. ${state.selectedSite.name} was preserved; no LAAN values were merged.`);
            saveState(); render(); return;
        }
        state = setField(state, 'linkedLaan', LINKED_LAAN.id);
        if (!state.fields.projectReference) state = setField(state, 'projectReference', LINKED_LAAN.projectReference);
        state = changeSite(state, linkedSite);
        state.notices.push(state.fields.projectReference === LINKED_LAAN.projectReference ? 'Mapped fictional LAAN context applied.' : 'Linked LAAN recorded; the populated project reference was preserved for review.');
        saveState(); render(); return;
    }
    if (target.hasAttribute('data-simulate-failure')) {
        state = selectDocument(state, 'authority', { name: 'authority-retry-demo.pdf', size: 320_000, type: 'application/pdf' }, { simulateFailure: true });
        state.notices.push('Simulated authority upload failed; any previous valid selection was preserved.');
        saveState(); render(); return;
    }
    if (target.hasAttribute('data-retry-authority')) {
        state = selectDocument(state, 'authority', { name: 'authority-retry-demo.pdf', size: 320_000, type: 'application/pdf' });
        state.notices.push('Simulated authority retry succeeded. Review its new version before readiness.');
        saveState(); render(); return;
    }
    if (target.hasAttribute('data-reset')) { resetPending = true; pendingCopy = null; render(); return; }
    if (target.hasAttribute('data-confirm-reset')) { state = createInitialState(); sessionStorage.removeItem(STORAGE_KEY); resetPending = false; statusMessage = 'Prototype session reset.'; render(); return; }
    if (target.hasAttribute('data-cancel-reset')) { resetPending = false; render(); return; }
    if (target.dataset.copy) {
        const [source, destination] = target.dataset.copy.split(':');
        const result = applyCopy(state, source, destination);
        if (result.requiresConfirmation) pendingCopy = { source, destination };
        else state = result.state;
        saveState(); render(); return;
    }
    if (target.hasAttribute('data-confirm-copy')) {
        state = applyCopy(state, pendingCopy.source, pendingCopy.destination, { confirmOverwrite: true }).state; pendingCopy = null; saveState(); render(); return;
    }
    if (target.hasAttribute('data-cancel-copy')) { pendingCopy = null; render(); return; }
    if (target.hasAttribute('data-undo-copy')) { state = undoLastCopy(state); saveState(); render(); return; }
    if (target.dataset.removeDocument) { state = removeDocument(state, target.dataset.removeDocument); saveState(); render(); return; }
    if (target.hasAttribute('data-summary-toggle')) { summaryOpen = !summaryOpen; render(); return; }
});

render();
