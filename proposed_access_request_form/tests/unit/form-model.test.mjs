import test from 'node:test';
import assert from 'node:assert/strict';

import {
    applyCopy,
    beginDocumentSelection,
    changeSite,
    confirmDocument,
    createInitialState,
    documentIsReady,
    removeDocument,
    removeDocumentFile,
    reviewSections,
    restoreSession,
    resolveDocumentSelection,
    selectDocument,
    serializeSession,
    setBranchActive,
    setContractorCount,
    setContractorField,
    setField,
    undoLastCopy,
    useSavedDocument,
    validateStage,
} from '../../src/model/form-model.js';

const pdf = (name, size = 1_024) => ({ name, size, type: 'application/pdf' });

test('PA-U04 rejected replacement preserves its prior valid file and unrelated files', () => {
    let state = createInitialState();
    state = selectDocument(state, 'authority', pdf('authority.pdf'));
    state = selectDocument(state, 'workersComp', pdf('workers.pdf'));
    state = selectDocument(state, 'authority', pdf('too-large.pdf', 10_000_001));

    assert.equal(state.documents.authority.file.name, 'authority.pdf');
    assert.equal(state.documents.authority.error, 'File must be 10 MB or smaller.');
    assert.equal(state.documents.workersComp.file.name, 'workers.pdf');
});

test('PA-R03 stage validation preserves unrelated values and documents', () => {
    let state = createInitialState();
    state = setField(state, 'projectReference', 'SX-PROTOTYPE-104');
    state = setField(state, 'worksDescription', 'Inspect rooftop equipment.');
    state = selectDocument(state, 'authority', pdf('authority.pdf'));

    const result = validateStage(state, 5);

    assert.equal(result.valid, false);
    assert.equal(result.state.fields.projectReference, 'SX-PROTOTYPE-104');
    assert.equal(result.state.documents.authority.file.name, 'authority.pdf');
    assert.ok(result.errors.natureOfWorks);
});

test('PA-U05/U06 replacement and removal invalidate only mapped confirmations', () => {
    let state = createInitialState();
    state = selectDocument(state, 'authority', pdf('authority-v1.pdf'));
    state.confirmations.authorityReviewed = state.documents.authority.version;
    state.confirmations.swmsReviewed = 7;
    state = selectDocument(state, 'authority', pdf('authority-v2.pdf'));

    assert.equal(state.confirmations.authorityReviewed, 0);
    assert.equal(state.confirmations.swmsReviewed, 7);

    state.confirmations.authorityReviewed = state.documents.authority.version;
    state = removeDocument(state, 'authority');
    assert.equal(state.documents.authority.status, 'missing');
    assert.equal(state.confirmations.authorityReviewed, 0);
    assert.equal(state.confirmations.swmsReviewed, 7);
});

test('PA-B08 inactive values leave readiness input and restore with a reminder', () => {
    let state = createInitialState();
    state = setBranchActive(state, 'noisyWorks', true);
    state = setField(state, 'noisyDetails', 'Drilling between 10:00 and 11:00.');
    state = setBranchActive(state, 'noisyWorks', false);

    assert.equal(state.fields.noisyDetails, '');
    assert.equal(state.stashedFields.noisyDetails, 'Drilling between 10:00 and 11:00.');

    state = setBranchActive(state, 'noisyWorks', true);
    assert.equal(state.fields.noisyDetails, 'Drilling between 10:00 and 11:00.');
    assert.match(state.notices.at(-1), /restored/i);
});

test('PA-C01-C08 copy uses an allowlist, stays independent, and supports safe undo', () => {
    let state = createInitialState();
    state = setField(state, 'requesterName', 'Alex Morgan');
    state = setField(state, 'requesterPhone', '0400 123 456');
    state = setField(state, 'tenantContactName', 'Existing person');

    const preview = applyCopy(state, 'requester', 'tenant', { confirmOverwrite: false });
    assert.equal(preview.requiresConfirmation, true);
    assert.equal(preview.state.fields.tenantContactName, 'Existing person');

    const copied = applyCopy(state, 'requester', 'tenant', { confirmOverwrite: true });
    assert.equal(copied.state.fields.tenantContactName, 'Alex Morgan');
    assert.equal(copied.state.fields.tenantContactPhone, '0400 123 456');

    let edited = setField(copied.state, 'tenantContactName', 'Edited target');
    assert.equal(edited.fields.requesterName, 'Alex Morgan');

    const undone = undoLastCopy(edited, { preserveInterveningEdits: true });
    assert.equal(undone.fields.tenantContactName, 'Edited target');
    assert.equal(undone.fields.tenantContactPhone, '');
    assert.equal(undone.fields.requesterName, 'Alex Morgan');
});

test('PA-B07 changing Site invalidates only Site-specific acknowledgement', () => {
    let state = createInitialState();
    state.confirmations.siteRequirements = 'site-southbank';
    state.confirmations.declaration = true;
    state = changeSite(state, { id: 'site-collins', name: 'Collins Exchange' });

    assert.equal(state.confirmations.siteRequirements, '');
    assert.equal(state.confirmations.declaration, true);
});

test('PA-R02 reload restores text and selection but marks files for reselection', () => {
    let state = createInitialState();
    state = setField(state, 'projectReference', 'SX-RECOVER-1');
    state = changeSite(state, { id: 'site-southbank', name: 'Southbank Exchange' });
    state = selectDocument(state, 'authority', pdf('authority.pdf'));
    state.confirmations.authorityReviewed = state.documents.authority.version;

    const restored = restoreSession(serializeSession(state));

    assert.equal(restored.fields.projectReference, 'SX-RECOVER-1');
    assert.equal(restored.selectedSite.id, 'site-southbank');
    assert.equal(restored.documents.authority.status, 'needs-reselection');
    assert.equal(restored.documents.authority.file, null);
    assert.equal(restored.confirmations.authorityReviewed, 0);
});

test('PA-B04 contractor count changes preserve stable identities and restore reduced records', () => {
    let state = createInitialState();
    state = setContractorCount(state, 3);
    state = setContractorField(state, 'contractor-2', 'name', 'Jordan Lee');
    state = setContractorCount(state, 1);
    state = setContractorCount(state, 3);

    assert.deepEqual(state.contractors.map(({ id }) => id), ['contractor-1', 'contractor-2', 'contractor-3']);
    assert.equal(state.contractors[1].name, 'Jordan Lee');
});

test('PA-C08 forbidden copy pair is rejected in state logic', () => {
    assert.throws(() => applyCopy(createInitialState(), 'tenant', 'requester'), /not permitted/);
});

test('PA-R04 corrupt and incompatible sessions never restore a false ready state', () => {
    assert.throws(() => restoreSession('{broken'), /unreadable/);
    assert.throws(() => restoreSession(JSON.stringify({ version: 99 })), /incompatible/);
    assert.throws(() => restoreSession(JSON.stringify({ version: 1, documents: null })), /unreadable/);
    assert.throws(() => restoreSession(JSON.stringify({ version: 1, documents: { unknown: {} } })), /unreadable/);
    assert.throws(() => restoreSession(JSON.stringify({ ...createInitialState(), currentStage: 99 })), /unreadable/);
    assert.throws(() => restoreSession(JSON.stringify({ ...createInitialState(), fields: { ...createInitialState().fields, siteQuery: {} } })), /unreadable/);
    assert.throws(() => restoreSession(JSON.stringify({ ...createInitialState(), metrics: null })), /unreadable/);
    assert.throws(() => restoreSession(JSON.stringify({ ...createInitialState(), contractors: [null] })), /unreadable/);
    const missingSavedFile = createInitialState();
    missingSavedFile.documents.liability = {
        ...missingSavedFile.documents.liability,
        status: 'selected', origin: 'saved-demo', availability: 'available', file: null, version: 1,
    };
    missingSavedFile.confirmations.liabilityReviewed = 1;
    assert.throws(() => restoreSession(JSON.stringify(missingSavedFile)), /unreadable/);
    const invalidSavedFile = createInitialState();
    invalidSavedFile.documents.authority = {
        ...invalidSavedFile.documents.authority,
        status: 'selected', origin: 'saved-demo', availability: 'available', version: 1,
        file: { name: 'payload.exe', size: 50_000_000, type: 'application/x-msdownload' },
    };
    invalidSavedFile.confirmations.authorityReviewed = 1;
    assert.throws(() => restoreSession(JSON.stringify(invalidSavedFile)), /unreadable/);
    invalidSavedFile.documents.authority.file = { name: '', size: 1, type: 'application/pdf' };
    assert.throws(() => restoreSession(JSON.stringify(invalidSavedFile)), /unreadable/);
    const zeroVersionSavedFile = createInitialState();
    zeroVersionSavedFile.documents.liability = {
        ...zeroVersionSavedFile.documents.liability,
        status: 'selected', origin: 'saved-demo', availability: 'available', version: 0,
        expiresOn: '31-12-2026', file: { name: 'saved.pdf', size: 1, type: 'application/pdf' },
    };
    assert.throws(() => restoreSession(JSON.stringify(zeroVersionSavedFile)), /unreadable/);
    zeroVersionSavedFile.documents.liability.version = 1;
    zeroVersionSavedFile.documents.liability.expiresOn = '01-01-2025';
    zeroVersionSavedFile.confirmations.liabilityReviewed = 1;
    assert.throws(() => restoreSession(JSON.stringify(zeroVersionSavedFile)), /unreadable/);
    assert.throws(() => restoreSession(JSON.stringify({ ...createInitialState(), copyHistory: [{}] })), /unreadable/);
});

test('PA-006 review contains every active field, contractor attribute and document status', () => {
    let state = createInitialState();
    state = setField(state, 'projectReference', 'SX-REVIEW-1');
    state = setField(state, 'requirementsRead', true);
    state = setContractorField(state, 'contractor-1', 'name', 'Sam Rivera');
    state = setContractorField(state, 'contractor-1', 'licence', 'VIC-DEMO-1');

    const sections = reviewSections(state);
    assert.deepEqual(sections.map(({ stage }) => stage), [1, 2, 3, 4, 5, 6, 7, 8]);
    assert.ok(sections.find(({ stage }) => stage === 3).values.some(([label]) => label === 'Project reference'));
    assert.ok(sections.find(({ stage }) => stage === 4).values.some(([label]) => label === 'Contractor 1 · Driver licence'));
    assert.ok(sections.find(({ stage }) => stage === 7).values.some(([label]) => label === 'Letter of Authority status'));
});

test('PA-U07 a stale delayed file result cannot replace a newer selection', () => {
    let state = createInitialState();
    const first = beginDocumentSelection(state, 'authority', pdf('authority-a.pdf'));
    const second = beginDocumentSelection(first.state, 'authority', pdf('authority-b.pdf'));
    state = resolveDocumentSelection(second.state, 'authority', second.operationId, { failed: false });
    state = resolveDocumentSelection(state, 'authority', first.operationId, { failed: true });

    assert.equal(state.documents.authority.file.name, 'authority-b.pdf');
    assert.equal(state.documents.authority.error, '');
});

test('PA-U03 document contracts are field-specific prototype assumptions', () => {
    let state = createInitialState();
    state = selectDocument(state, 'authority', { name: 'authority.jpg', size: 100_000, type: 'image/jpeg' });
    assert.match(state.documents.authority.error, /PDF/);

    state = selectDocument(state, 'qualification', { name: 'qualification.jpg', size: 100_000, type: 'image/jpeg' });
    assert.equal(state.documents.qualification.status, 'selected');
    state = selectDocument(state, 'qualification', pdf('large-qualification.pdf', 12_000_000));
    assert.equal(state.documents.qualification.status, 'selected');
});

test('PA-NOTES qualification uploads keep valid files and failed files independently visible', () => {
    let state = createInitialState();
    state = selectDocument(state, 'qualification', { name: 'valid-training.pdf', size: 100_000, type: 'application/pdf' });
    state = selectDocument(state, 'qualification', { name: 'drivers-licence.jpg', size: 100_000, type: 'image/jpeg' });
    state = selectDocument(state, 'qualification', { name: 'slightly-over-limit.pdf', size: 15_000_001, type: 'application/pdf' });

    assert.deepEqual(state.documents.qualification.files.map(({ file, status }) => [file.name, status]), [
        ['valid-training.pdf', 'selected'],
        ['drivers-licence.jpg', 'invalid'],
        ['slightly-over-limit.pdf', 'invalid'],
    ]);
    assert.equal(state.documents.qualification.file.name, 'valid-training.pdf');
    assert.match(state.documents.qualification.files[1].error, /Driver licence-related/);
    assert.match(state.documents.qualification.files[2].error, /15 MB/);

    const invalidId = state.documents.qualification.files[1].id;
    state = removeDocumentFile(state, 'qualification', invalidId);
    assert.deepEqual(state.documents.qualification.files.map(({ file }) => file.name), ['valid-training.pdf', 'slightly-over-limit.pdf']);
    assert.equal(state.documents.qualification.status, 'selected');

    const restored = restoreSession(serializeSession(state));
    assert.ok(restored.documents.qualification.files.every(({ status, file }) => status === 'needs-reselection' && file === null));
});

test('PA-D01/D02 saved-document demos distinguish available and expired evidence', () => {
    let state = createInitialState();
    state = useSavedDocument(state, 'liability', {
        name: 'saved-liability-current.pdf',
        availability: 'available',
        expiresOn: '31-12-2026',
        owner: 'Example Billing Pty Ltd',
        source: 'Fictional Document Library',
    });
    assert.equal(state.documents.liability.origin, 'saved-demo');
    assert.equal(state.documents.liability.status, 'selected');
    assert.equal(state.documents.liability.owner, 'Example Billing Pty Ltd');
    assert.equal(state.documents.liability.source, 'Fictional Document Library');
    state = confirmDocument(state, 'liability', true);
    assert.equal(documentIsReady(state, 'liability'), true);

    state = useSavedDocument(state, 'liability', {
        name: 'saved-liability-expired.pdf',
        availability: 'expired',
        expiresOn: '01-01-2025',
    });
    state = confirmDocument(state, 'liability', true);
    assert.equal(state.documents.liability.status, 'invalid');
    assert.equal(documentIsReady(state, 'liability'), false);
    assert.match(state.documents.liability.error, /expired/i);
});

test('PA-B08 inactive roof evidence is excluded from review and restored when reactivated', () => {
    let state = createInitialState();
    state = setBranchActive(state, 'roofAccess', true);
    state = selectDocument(state, 'roofPermit', pdf('roof-permit.pdf'));
    state = confirmDocument(state, 'roofPermit', true);
    assert.ok(reviewSections(state).find(({ stage }) => stage === 7).values.some(([label]) => label === 'Roof or Tower Access Permit status'));

    state = setBranchActive(state, 'roofAccess', false);
    assert.equal(reviewSections(state).find(({ stage }) => stage === 7).values.some(([label]) => label === 'Roof or Tower Access Permit status'), false);
    assert.equal(state.confirmations.roofPermitReviewed, 0);

    state = setBranchActive(state, 'roofAccess', true);
    assert.ok(reviewSections(state).find(({ stage }) => stage === 7).values.some(([label]) => label === 'Roof or Tower Access Permit status'));
    assert.equal(state.documents.roofPermit.file.name, 'roof-permit.pdf');
    assert.match(state.notices.at(-1), /roof.*review/i);
    assert.ok(validateStage(state, 6).errors.roofPermit);
});
