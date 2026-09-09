import test from 'node:test';
import assert from 'node:assert/strict';

import {
    applyCopy,
    changeSite,
    createInitialState,
    removeDocument,
    restoreSession,
    selectDocument,
    serializeSession,
    setBranchActive,
    setContractorCount,
    setContractorField,
    setField,
    undoLastCopy,
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
});
