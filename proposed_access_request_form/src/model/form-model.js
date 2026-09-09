export const STATE_VERSION = 1;

export const DOCUMENT_RULES = Object.freeze({
    qualification: { label: 'Qualifications & training', originalId: 'input_3_445', required: true, maxBytes: 15_000_000, acceptedTypes: ['application/pdf', 'image/jpeg', 'image/png'], confirmation: 'qualificationReviewed', source: 'prototype assumption' },
    authority: { label: 'Letter of Authority', originalId: 'input_3_44', required: true, maxBytes: 10_000_000, acceptedTypes: ['application/pdf'], confirmation: 'authorityReviewed', source: 'U04 executable size scenario; type is a prototype assumption' },
    swms: { label: "Signed 'Site Specific' SWMS", originalId: 'input_3_338', required: true, maxBytes: 20_000_000, acceptedTypes: ['application/pdf'], confirmation: 'swmsReviewed', source: 'prototype assumption' },
    workersComp: { label: 'Workers Compensation Certificate', originalId: 'input_3_42', required: true, maxBytes: 10_000_000, acceptedTypes: ['application/pdf'], confirmation: 'workersCompReviewed', source: 'prototype assumption' },
    liability: { label: 'Public Liability Certificate', originalId: 'input_3_128', required: true, maxBytes: 10_000_000, acceptedTypes: ['application/pdf'], confirmation: 'liabilityReviewed', source: 'prototype assumption' },
    roofPermit: { label: 'Roof or Tower Access Permit', originalId: 'input_3_46', required: false, maxBytes: 15_000_000, acceptedTypes: ['application/pdf', 'image/jpeg', 'image/png'], confirmation: 'roofPermitReviewed', source: 'prototype assumption' },
    supporting: { label: 'Additional Documentation', originalId: 'input_3_494', required: false, maxBytes: 25_000_000, acceptedTypes: ['application/pdf', 'image/jpeg', 'image/png'], confirmation: 'supportingReviewed', source: 'prototype assumption' },
});

const DEFAULT_FIELDS = Object.freeze({
    linkedLaan: '', ownerName: '', siteQuery: '', tenureConfirmed: '', networkRequired: 'no', termsAccepted: false,
    emergencyAccess: 'not-required', buildingAddress: '', requirementsRead: false,
    projectReference: '', tenantCompany: '', tenantContactName: '', tenantContactPhone: '', tenantLocation: '', accessAreas: '',
    carrierName: '', carrierContactName: '', carrierContactPhone: '', carrierAddress: '', accessDate: '', accessStart: '', accessFinish: '', numberOfDays: '',
    requesterName: '', requesterCompany: '', requesterJobTitle: '', requesterPhone: '', requesterEmail: '', requesterAddress: '',
    contractorCount: '1',
    natureOfWorks: '', permitType: '', worksDescription: '', noisyWorks: 'no', noisyDetails: '', disruptiveWorks: 'no', specialAccessAcknowledged: false,
    permitAgreed: false, ownerPermitAgreed: false, worksAtHeight: '', asbestosRisk: '', fireIsolation: '',
    technicalChange: 'not-applicable', technicalDetails: '', cableStart: '', cableEnd: '', riser: '', cableCapacity: '', roofAccess: 'no', roofAreas: '',
    powerRequired: 'no', powerDetails: '', billingArrangement: '', ceilingAccess: '', riserAccess: '', coreDrilling: '', certifierRequired: 'no', certifierName: '',
    technicalRulesAgreed: false, cablingAgreed: false, penetrationsAgreed: false, cleanupAgreed: false,
    sassiNumber: '', workersCompExpiry: '', liabilityExpiry: '', documentsConfirmed: false,
    swms1: false, swms2: false, swms3: false, swms4: false, swms5: false, swms6: false,
    swms7: false, swms8: false, swms9: false, swms10: false, swms11: false, swms12: false,
    siteDeclaration: false, safetyDeclaration: false, invoiceDetails: '', finalDeclaration: false, additionalNotes: '',
});

const BRANCH_FIELDS = Object.freeze({
    noisyWorks: ['noisyDetails'],
    technicalWork: ['technicalDetails', 'cableStart', 'cableEnd', 'riser', 'cableCapacity'],
    roofAccess: ['roofAreas'],
    powerRequired: ['powerDetails', 'billingArrangement'],
    certifierRequired: ['certifierName'],
});

const COPY_MAPS = Object.freeze({
    'requester:tenant': [
        ['requesterName', 'tenantContactName'],
        ['requesterPhone', 'tenantContactPhone'],
    ],
    'requester:carrier': [
        ['requesterName', 'carrierContactName'],
        ['requesterPhone', 'carrierContactPhone'],
        ['requesterAddress', 'carrierAddress'],
        ['requesterCompany', 'carrierName'],
    ],
    'laan:request': [
        ['linkedLaan', 'projectReference'],
    ],
});

const clone = (value) => structuredClone(value);

const emptyDocument = () => ({
    status: 'missing',
    file: null,
    rememberedName: '',
    version: 0,
    error: '',
    simulatedFailure: false,
    pendingOperation: null,
});

const emptyContractor = (id = 'contractor-1') => ({
    id,
    name: '', company: '', phone: '', licence: '', whiteCard: '', induction: 'no', inductionExpiry: '',
});

export function createInitialState() {
    return {
        version: STATE_VERSION,
        currentStage: 1,
        completedStages: [],
        reviewReturnStage: null,
        fields: clone(DEFAULT_FIELDS),
        selectedSite: null,
        contractors: [emptyContractor()],
        contractorStash: {},
        documents: Object.fromEntries(Object.keys(DOCUMENT_RULES).map((key) => [key, emptyDocument()])),
        confirmations: Object.fromEntries([
            'siteRequirements', 'authorityReviewed', 'qualificationReviewed', 'swmsReviewed', 'workersCompReviewed',
            'liabilityReviewed', 'roofPermitReviewed', 'supportingReviewed',
        ].map((key) => [key, key === 'siteRequirements' ? '' : 0])),
        branches: { noisyWorks: false, technicalWork: false, roofAccess: false, powerRequired: false, certifierRequired: false },
        stashedFields: {},
        restoredFields: [],
        errors: {},
        notices: [],
        copyHistory: [],
        metrics: { interactions: 0, stageTransitions: 0, copyActions: 0, fileSelections: 0, validationCorrections: 0 },
    };
}

const changed = (state) => {
    const next = clone(state);
    next.metrics.interactions += 1;
    return next;
};

export function setField(state, key, value) {
    if (!(key in state.fields)) throw new Error(`Unknown Access Request field: ${key}`);
    const next = changed(state);
    next.fields[key] = value;
    delete next.errors[key];
    return next;
}

export function changeSite(state, site) {
    const next = changed(state);
    const changedIdentity = next.selectedSite?.id !== site?.id;
    next.selectedSite = site ? clone(site) : null;
    next.fields.siteQuery = site?.name ?? '';
    next.fields.buildingAddress = site?.address ?? '';
    if (changedIdentity) {
        next.confirmations.siteRequirements = '';
        next.fields.requirementsRead = false;
        next.notices.push('Site changed. Review the Site-specific requirements again.');
    }
    return next;
}

export function setSiteQuery(state, query) {
    let next = setField(state, 'siteQuery', query);
    if (next.selectedSite && query !== next.selectedSite.name) {
        next.selectedSite = null;
        next.confirmations.siteRequirements = '';
        next.fields.requirementsRead = false;
    }
    return next;
}

export function setSiteRequirementsReviewed(state, reviewed) {
    const next = setField(state, 'requirementsRead', reviewed);
    next.confirmations.siteRequirements = reviewed ? next.selectedSite?.slug ?? '' : '';
    return next;
}

export function setBranchActive(state, branch, active) {
    const controlledFields = BRANCH_FIELDS[branch];
    if (!controlledFields) throw new Error(`Unknown Access Request branch: ${branch}`);
    const next = changed(state);
    next.branches[branch] = active;
    next.restoredFields = [];

    for (const key of controlledFields) {
        if (!active) {
            if (next.fields[key] !== '') next.stashedFields[key] = next.fields[key];
            next.fields[key] = '';
            delete next.errors[key];
        } else if (Object.hasOwn(next.stashedFields, key)) {
            next.fields[key] = next.stashedFields[key];
            delete next.stashedFields[key];
            next.restoredFields.push(key);
        }
    }

    if (next.restoredFields.length) next.notices.push('Previous branch values were restored. Please review them.');
    return next;
}

export function setContractorCount(state, count) {
    const numeric = Math.max(1, Math.min(10, Number.parseInt(count, 10) || 1));
    const next = changed(state);
    const existing = new Map([...Object.values(next.contractorStash), ...next.contractors].map((person) => [person.id, person]));
    for (const person of next.contractors.slice(numeric)) next.contractorStash[person.id] = person;
    next.contractors = Array.from({ length: numeric }, (_, index) => {
        const id = `contractor-${index + 1}`;
        const person = existing.get(id) ?? emptyContractor(id);
        delete next.contractorStash[id];
        return person;
    });
    next.fields.contractorCount = String(numeric);
    return next;
}

export function setContractorField(state, contractorId, key, value) {
    const next = changed(state);
    const contractor = next.contractors.find((candidate) => candidate.id === contractorId);
    if (!contractor || !(key in contractor) || key === 'id') throw new Error('Unknown contractor field.');
    contractor[key] = value;
    delete next.errors[`${contractorId}.${key}`];
    return next;
}

export function selectDocument(state, documentKey, file, { simulateFailure = false } = {}) {
    const rule = DOCUMENT_RULES[documentKey];
    if (!rule) throw new Error(`Unknown document field: ${documentKey}`);
    const next = changed(state);
    next.metrics.fileSelections += 1;
    const current = next.documents[documentKey];

    if (file.size > rule.maxBytes) {
        current.error = `File must be ${rule.maxBytes / 1_000_000} MB or smaller.`;
        return next;
    }
    if (file.type && !rule.acceptedTypes.includes(file.type)) {
        current.error = `Use ${rule.acceptedTypes.map((type) => type.split('/')[1].toUpperCase()).join(' or ')} for this prototype scenario.`;
        return next;
    }
    if (simulateFailure) {
        current.error = 'The simulated upload failed. Retry this document.';
        current.simulatedFailure = true;
        return next;
    }

    current.file = { name: file.name, size: file.size, type: file.type || 'application/octet-stream' };
    current.rememberedName = file.name;
    current.status = 'selected';
    current.version += 1;
    current.error = '';
    current.simulatedFailure = false;
    current.pendingOperation = null;
    next.confirmations[rule.confirmation] = 0;
    return next;
}

let operationSequence = 0;

export function beginDocumentSelection(state, documentKey, file) {
    if (!DOCUMENT_RULES[documentKey]) throw new Error(`Unknown document field: ${documentKey}`);
    const next = changed(state);
    const operationId = `${documentKey}-${operationSequence += 1}`;
    next.documents[documentKey].pendingOperation = { operationId, file: { name: file.name, size: file.size, type: file.type } };
    return { state: next, operationId };
}

export function resolveDocumentSelection(state, documentKey, operationId, { failed = false } = {}) {
    const pending = state.documents[documentKey]?.pendingOperation;
    if (!pending || pending.operationId !== operationId) return state;
    const next = clone(state);
    next.documents[documentKey].pendingOperation = null;
    return selectDocument(next, documentKey, pending.file, { simulateFailure: failed });
}

export function removeDocument(state, documentKey) {
    const rule = DOCUMENT_RULES[documentKey];
    if (!rule) throw new Error(`Unknown document field: ${documentKey}`);
    const next = changed(state);
    next.documents[documentKey] = { ...emptyDocument(), version: next.documents[documentKey].version + 1 };
    next.confirmations[rule.confirmation] = 0;
    return next;
}

export function confirmDocument(state, documentKey, checked) {
    const rule = DOCUMENT_RULES[documentKey];
    if (!rule) throw new Error(`Unknown document field: ${documentKey}`);
    const next = changed(state);
    const document = next.documents[documentKey];
    next.confirmations[rule.confirmation] = checked && document.status === 'selected' ? document.version : 0;
    return next;
}

export function applyCopy(state, source, target, { confirmOverwrite = false } = {}) {
    const pairs = COPY_MAPS[`${source}:${target}`];
    if (!pairs) throw new Error('This source and target pair is not permitted by the prototype allowlist.');
    const differingPopulatedTargets = pairs.filter(([sourceKey, targetKey]) => state.fields[targetKey] && state.fields[targetKey] !== state.fields[sourceKey]);
    if (differingPopulatedTargets.length && !confirmOverwrite) {
        return { state, requiresConfirmation: true, affectedFields: differingPopulatedTargets.map(([, targetKey]) => targetKey) };
    }

    const next = changed(state);
    const before = {};
    const copied = {};
    for (const [sourceKey, targetKey] of pairs) {
        before[targetKey] = next.fields[targetKey];
        copied[targetKey] = next.fields[sourceKey];
        next.fields[targetKey] = next.fields[sourceKey];
        delete next.errors[targetKey];
    }
    next.copyHistory.push({ source, target, before, copied });
    next.metrics.copyActions += 1;
    return { state: next, requiresConfirmation: false, affectedFields: Object.keys(copied) };
}

export function undoLastCopy(state, { preserveInterveningEdits = true } = {}) {
    if (!state.copyHistory.length) return state;
    const next = changed(state);
    const transaction = next.copyHistory.pop();
    for (const [key, previousValue] of Object.entries(transaction.before)) {
        const wasEdited = next.fields[key] !== transaction.copied[key];
        if (!preserveInterveningEdits || !wasEdited) next.fields[key] = previousValue;
    }
    return next;
}

const required = (errors, fields, key, message) => {
    if (fields[key] === '' || fields[key] === false || fields[key] == null) errors[key] = message;
};

const allowedValue = (errors, fields, key, values, message) => {
    if (!values.includes(fields[key])) errors[key] = message;
};

const documentReady = (state, key) => {
    const rule = DOCUMENT_RULES[key];
    const document = state.documents[key];
    return document.status === 'selected' && state.confirmations[rule.confirmation] === document.version;
};

export function validateStage(state, stage) {
    const next = clone(state);
    const errors = {};
    const fields = next.fields;

    if (stage === 1) {
        if (!next.selectedSite) errors.siteQuery = 'Choose a Site from the search results.';
        required(errors, fields, 'tenureConfirmed', 'Confirm whether tenure is in place.');
        required(errors, fields, 'termsAccepted', 'Accept the Co-Siter terms to continue.');
    }
    if (stage === 2) required(errors, fields, 'requirementsRead', 'Confirm you have read the Site requirements.');
    if (stage === 3) {
        for (const key of ['projectReference', 'tenantCompany', 'tenantContactName', 'tenantContactPhone', 'tenantLocation', 'accessAreas', 'carrierName', 'carrierContactName', 'carrierContactPhone', 'carrierAddress', 'accessDate', 'accessStart', 'accessFinish', 'requesterName', 'requesterCompany', 'requesterPhone', 'requesterEmail']) {
            required(errors, fields, key, 'Complete this required request detail.');
        }
    }
    if (stage === 4) {
        next.contractors.forEach((contractor) => {
            for (const key of ['name', 'company', 'phone', 'licence', 'whiteCard']) {
                if (!contractor[key]) errors[`${contractor.id}.${key}`] = 'Complete this contractor detail.';
            }
        });
        if (!documentReady(next, 'qualification')) errors.qualification = 'Select and review the qualification document.';
    }
    if (stage === 5) {
        allowedValue(errors, fields, 'natureOfWorks', ['inspection', 'maintenance', 'installation', 'removal'], 'Choose the nature of works.');
        allowedValue(errors, fields, 'permitType', ['standard', 'after-hours', 'isolation'], 'Choose the network access permit type.');
        required(errors, fields, 'worksDescription', 'Describe the works to be completed.');
        if (next.branches.noisyWorks) required(errors, fields, 'noisyDetails', 'Describe the noisy or disruptive works.');
        required(errors, fields, 'specialAccessAcknowledged', 'Acknowledge the special access requirements.');
        for (const key of ['permitAgreed', 'ownerPermitAgreed', 'worksAtHeight', 'asbestosRisk', 'fireIsolation']) required(errors, fields, key, 'Complete this works and permit declaration.');
        if (!documentReady(next, 'authority')) errors.authority = 'Select and review the Letter of Authority.';
    }
    if (stage === 6) {
        required(errors, fields, 'technicalChange', 'Choose the technical change type.');
        if (next.branches.technicalWork) {
            for (const key of ['technicalDetails', 'cableStart', 'cableEnd', 'riser', 'cableCapacity']) required(errors, fields, key, 'Complete this technical detail.');
        }
        if (next.branches.roofAccess) required(errors, fields, 'roofAreas', 'Describe the roof or structure areas.');
        for (const key of ['powerRequired', 'ceilingAccess', 'riserAccess', 'coreDrilling', 'certifierRequired', 'technicalRulesAgreed', 'cablingAgreed', 'penetrationsAgreed', 'cleanupAgreed']) required(errors, fields, key, 'Complete this technical access item.');
        if (next.branches.powerRequired) {
            required(errors, fields, 'powerDetails', 'Describe the new or upgraded power source.');
            required(errors, fields, 'billingArrangement', 'Describe the proposed billing arrangement.');
        }
        if (next.branches.certifierRequired) required(errors, fields, 'certifierName', 'Enter the proposed certifier name.');
    }
    if (stage === 7) {
        required(errors, fields, 'sassiNumber', 'Enter the SASSI registration number.');
        required(errors, fields, 'workersCompExpiry', 'Enter the Workers Compensation expiry date.');
        required(errors, fields, 'liabilityExpiry', 'Enter the Public Liability expiry date.');
        for (const key of ['swms', 'workersComp', 'liability']) if (!documentReady(next, key)) errors[key] = `Select and review ${DOCUMENT_RULES[key].label}.`;
        for (let index = 1; index <= 12; index += 1) required(errors, fields, `swms${index}`, 'Confirm this SWMS review item.');
        required(errors, fields, 'documentsConfirmed', 'Confirm the documentation has been provided.');
    }
    if (stage === 8) {
        for (const key of ['siteDeclaration', 'safetyDeclaration', 'invoiceDetails', 'finalDeclaration']) required(errors, fields, key, 'Complete this final declaration.');
    }

    next.errors = errors;
    return { state: next, errors, valid: Object.keys(errors).length === 0 };
}

export function stageIsComplete(state, stage) {
    return validateStage(state, stage).valid;
}

export function formIsReady(state) {
    return Array.from({ length: 8 }, (_, index) => index + 1).every((stage) => stageIsComplete(state, stage));
}

export function goToStage(state, stage, { validateCurrent = false } = {}) {
    if (stage < 1 || stage > 8) throw new Error('Stage must be between 1 and 8.');
    if (validateCurrent && stage > state.currentStage) {
        const result = validateStage(state, state.currentStage);
        if (!result.valid) return { state: result.state, moved: false };
    }
    const next = changed(state);
    if (stage > state.currentStage && !next.completedStages.includes(state.currentStage)) next.completedStages.push(state.currentStage);
    next.currentStage = stage;
    next.metrics.stageTransitions += 1;
    next.errors = {};
    return { state: next, moved: true };
}

export function reviewSections(state) {
    const display = (value) => typeof value === 'boolean' ? (value ? 'Confirmed' : '') : value;
    const values = (pairs) => pairs.map(([label, key]) => [label, display(state.fields[key])]).filter(([, value]) => value !== '' && value != null);
    const contractorValues = state.contractors.flatMap((person, index) => [
        [`Contractor ${index + 1} · Full name`, person.name], [`Contractor ${index + 1} · Company`, person.company],
        [`Contractor ${index + 1} · Phone`, person.phone], [`Contractor ${index + 1} · Driver licence`, person.licence],
        [`Contractor ${index + 1} · White Card`, person.whiteCard], [`Contractor ${index + 1} · Induction`, person.induction],
        [`Contractor ${index + 1} · Induction expiry`, person.inductionExpiry],
    ]).filter(([, value]) => value);
    const documentValues = Object.entries(DOCUMENT_RULES)
        .filter(([key, rule]) => rule.required || state.documents[key].status !== 'missing')
        .map(([key, rule]) => {
            const document = state.documents[key];
            const reviewed = state.confirmations[rule.confirmation] === document.version && document.status === 'selected';
            const identity = document.status === 'selected' ? document.file?.name : document.status;
            return [`${rule.label} status`, `${identity} · ${reviewed ? 'reviewed' : 'review required'} · version ${document.version}`];
        });
    return [
        { stage: 1, title: 'Request context', values: [['Site', state.selectedSite?.name], ...values([['Linked LAAN', 'linkedLaan'], ['Owner', 'ownerName'], ['Tenure', 'tenureConfirmed'], ['Network access', 'networkRequired'], ['Terms', 'termsAccepted']])] },
        { stage: 2, title: 'Site requirements', values: values([['Access type', 'emergencyAccess'], ['Building address', 'buildingAddress'], ['Requirements reviewed', 'requirementsRead']]) },
        { stage: 3, title: 'Request details', values: values([['Project reference', 'projectReference'], ['Tenant company', 'tenantCompany'], ['Tenant contact', 'tenantContactName'], ['Tenant phone', 'tenantContactPhone'], ['Tenant location', 'tenantLocation'], ['Access areas', 'accessAreas'], ['Carrier', 'carrierName'], ['Carrier contact', 'carrierContactName'], ['Carrier phone', 'carrierContactPhone'], ['Carrier address', 'carrierAddress'], ['Access date', 'accessDate'], ['Start time', 'accessStart'], ['Finish time', 'accessFinish'], ['Number of days', 'numberOfDays'], ['Requester', 'requesterName'], ['Requester company', 'requesterCompany'], ['Requester role', 'requesterJobTitle'], ['Requester phone', 'requesterPhone'], ['Requester email', 'requesterEmail'], ['Requester address', 'requesterAddress']]) },
        { stage: 4, title: 'Contractors', values: contractorValues },
        { stage: 5, title: 'Works & permits', values: values([['Nature of works', 'natureOfWorks'], ['Permit type', 'permitType'], ['Works description', 'worksDescription'], ['Noisy works', 'noisyWorks'], ...(state.branches.noisyWorks ? [['Noisy works details', 'noisyDetails']] : []), ['Special access', 'specialAccessAcknowledged'], ['Network permit', 'permitAgreed'], ['Owner permits', 'ownerPermitAgreed'], ['Working at heights', 'worksAtHeight'], ['Asbestos risk', 'asbestosRisk'], ['Fire isolation', 'fireIsolation']]) },
        { stage: 6, title: 'Technical details', values: values([['Technical change', 'technicalChange'], ...(state.branches.technicalWork ? [['Technical details', 'technicalDetails'], ['Cable run start', 'cableStart'], ['Cable run end', 'cableEnd'], ['Riser', 'riser'], ['Cable capacity', 'cableCapacity']] : []), ['Roof access', 'roofAccess'], ...(state.branches.roofAccess ? [['Roof areas', 'roofAreas']] : []), ['Power required', 'powerRequired'], ...(state.branches.powerRequired ? [['Power details', 'powerDetails'], ['Billing arrangement', 'billingArrangement']] : []), ['Ceiling access', 'ceilingAccess'], ['Riser access', 'riserAccess'], ['Core drilling', 'coreDrilling'], ['Certifier required', 'certifierRequired'], ...(state.branches.certifierRequired ? [['Certifier', 'certifierName']] : []), ['Technical requirements', 'technicalRulesAgreed'], ['Cabling', 'cablingAgreed'], ['Penetrations', 'penetrationsAgreed'], ['Clean-up', 'cleanupAgreed']]) },
        { stage: 7, title: 'Safety & evidence', values: [...values([['SASSI registration', 'sassiNumber'], ['Workers Compensation expiry', 'workersCompExpiry'], ['Public Liability expiry', 'liabilityExpiry'], ...Array.from({ length: 12 }, (_, index) => [`SWMS review ${index + 1}`, `swms${index + 1}`]), ['Documentation declaration', 'documentsConfirmed']]), ...documentValues] },
        { stage: 8, title: 'Declarations', values: values([['Site declaration', 'siteDeclaration'], ['Safety declaration', 'safetyDeclaration'], ['Invoice details', 'invoiceDetails'], ['Final declaration', 'finalDeclaration'], ['Additional notes', 'additionalNotes']]) },
    ];
}

export function serializeSession(state) {
    const persisted = clone(state);
    for (const document of Object.values(persisted.documents)) document.file = null;
    return JSON.stringify(persisted);
}

export function restoreSession(serialized) {
    let parsed;
    try {
        parsed = JSON.parse(serialized);
    } catch {
        throw new Error('The saved prototype session is unreadable. Reset it to continue.');
    }
    if (parsed.version !== STATE_VERSION) throw new Error('The saved prototype session is from an incompatible version.');
    const isRecord = (value) => value && typeof value === 'object' && !Array.isArray(value);
    const initial = createInitialState();
    const documentKeys = Object.keys(DOCUMENT_RULES);
    const validShape = isRecord(parsed) && isRecord(parsed.fields) && isRecord(parsed.documents)
        && isRecord(parsed.confirmations) && isRecord(parsed.branches) && Array.isArray(parsed.contractors)
        && Object.keys(parsed.documents).every((key) => documentKeys.includes(key))
        && documentKeys.every((key) => isRecord(parsed.documents[key]));
    if (!validShape) throw new Error('The saved prototype session is unreadable. Reset it to continue.');
    const restored = {
        ...initial,
        ...parsed,
        fields: { ...initial.fields, ...parsed.fields },
        documents: Object.fromEntries(documentKeys.map((key) => [key, { ...initial.documents[key], ...parsed.documents[key] }])),
        confirmations: { ...initial.confirmations, ...parsed.confirmations },
        branches: { ...initial.branches, ...parsed.branches },
    };
    for (const [key, document] of Object.entries(restored.documents)) {
        if (document.status === 'selected' || document.rememberedName) {
            document.status = 'needs-reselection';
            document.file = null;
            document.error = 'Reselect this file after reload; browsers do not restore file bytes.';
            restored.confirmations[DOCUMENT_RULES[key].confirmation] = 0;
        }
    }
    restored.notices.push('Text and selections were restored. Local files must be reselected.');
    return restored;
}
