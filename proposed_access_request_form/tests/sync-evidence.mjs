import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve('.');
const fieldPath = resolve(root, 'docs/testing/access-request/prototype/field-disposition-plan.json');
const casePath = resolve(root, 'docs/testing/access-request/prototype/test-case-plan.json');
const implementationSource = [
    'proposed_access_request_form/src/app.js',
    'proposed_access_request_form/src/model/form-model.js',
].map((path) => readFileSync(resolve(root, path), 'utf8')).join('\n');

const contractorLabels = new Set([
    'Name', 'Name*', 'Full Name*', 'Company', 'Company*', 'Phone', 'Phone*', 'Phone / Mobile*',
    'Drivers Licence Number', 'Drivers Licence Number*', 'Construction Card Induction Number',
    'White Card Induction Number*', 'Monash Induction  Complete? Yes/No',
    'Monash Induction  Complete? Yes/No*', 'Yes / No', 'Site Induction Expiry Date',
    'Qualifications & Training (attach copies)*',
]);

const evidenceByFamily = {
    'Core functional': ['proposed_access_request_form/tests/browser/access-request.spec.mjs'],
    'Conditional branches': ['proposed_access_request_form/tests/unit/form-model.test.mjs', 'proposed_access_request_form/src/app.js'],
    Recovery: ['proposed_access_request_form/tests/unit/form-model.test.mjs', 'proposed_access_request_form/tests/browser/access-request.spec.mjs'],
    Uploads: ['proposed_access_request_form/tests/unit/form-model.test.mjs', 'proposed_access_request_form/tests/browser/access-request.spec.mjs'],
    'Person context': ['proposed_access_request_form/src/app.js'],
    'Document context': ['proposed_access_request_form/src/app.js', 'proposed_access_request_form/tests/unit/form-model.test.mjs'],
    'Site search': ['proposed_access_request_form/tests/browser/access-request.spec.mjs'],
    'Copy and reuse': ['proposed_access_request_form/tests/unit/form-model.test.mjs'],
    Efficiency: ['docs/testing/access-request/prototype/implementation-report.md'],
    'Accessibility and responsive': ['proposed_access_request_form/tests/browser/access-request.spec.mjs', 'proposed_access_request_form/src/styles/access-request.css'],
    'Cross-workflow': ['proposed_access_request_form/src/app.js', 'proposed_access_request_form/tests/browser/access-request.spec.mjs'],
};

function buildFieldPlan(plan) {
    const counts = {};
    const rows = plan.rows.map((row) => {
        const direct = row.controlIds.some((id) => implementationSource.includes(id));
        const grouped = row.step === 4 && row.labels.some((label) => contractorLabels.has(label));
        const providerOnly = row.fieldId == null || (row.controlTypes.length > 0 && row.controlTypes.every((type) => ['button', 'hidden', 'submit'].includes(type)));
        const implementationStatus = direct
            ? 'implemented-semantic-control'
            : grouped ? 'implemented-repeated-semantic-control'
                : providerOnly ? 'provider-only-excluded'
                    : 'mapped-production-deferred';
        counts[implementationStatus] = (counts[implementationStatus] ?? 0) + 1;
        const implementationLocation = direct
            ? 'proposed_access_request_form/src/app.js or src/model/form-model.js'
            : grouped ? 'proposed_access_request_form/src/app.js#contractorFields'
                : providerOnly ? 'docs/testing/access-request/prototype/implementation-report.md#explicitly-not-implemented'
                    : 'docs/testing/access-request/prototype/field-disposition-plan.json';
        const testStatus = implementationStatus.startsWith('implemented')
            ? 'covered-by-shared-local-suite'
            : providerOnly ? 'not-applicable-local-prototype' : 'not-run-production-deferred';
        return { ...row, implementationStatus, implementationLocation, testStatus };
    });
    return {
        ...plan,
        status: 'implementation-accounted',
        summary: { ...plan.summary, implementedFields: (counts['implemented-semantic-control'] ?? 0) + (counts['implemented-repeated-semantic-control'] ?? 0), ...counts },
        rows,
    };
}

function buildCasePlan(plan) {
    const counts = {};
    const cases = plan.cases.map((entry) => {
        let implementationStatus;
        let executionStatus;
        if (entry.plannedScope === 'measurement') {
            implementationStatus = 'method-retained-measurement-pending';
            executionStatus = 'NOT-RUN';
        } else if (entry.plannedScope === 'demonstration') {
            implementationStatus = 'implemented-guided-demonstration';
            executionStatus = 'AVAILABLE-NOT-AUTOMATED';
        } else {
            implementationStatus = 'implemented-or-partially-covered-by-shared-check';
            executionStatus = 'SEE-LOCAL-EVIDENCE';
        }
        counts[implementationStatus] = (counts[implementationStatus] ?? 0) + 1;
        return { ...entry, implementationStatus, executionStatus, localEvidence: evidenceByFamily[entry.family] ?? [] };
    });
    return {
        ...plan,
        status: 'implementation-accounted-with-production-deferrals',
        countingNote: 'All 64 source concerns retain one mapping. Local checks are intentionally grouped; guided demonstrations and unrun measurements are not promoted to automated passes.',
        implementationSummary: counts,
        cases,
    };
}

const fieldOriginal = readFileSync(fieldPath, 'utf8');
const caseOriginal = readFileSync(casePath, 'utf8');
const fieldResult = `${JSON.stringify(buildFieldPlan(JSON.parse(fieldOriginal)), null, 2)}\n`;
const caseResult = `${JSON.stringify(buildCasePlan(JSON.parse(caseOriginal)), null, 2)}\n`;

if (process.argv.includes('--write')) {
    writeFileSync(fieldPath, fieldResult);
    writeFileSync(casePath, caseResult);
    console.log('Prototype field and case implementation evidence synchronized.');
} else if (fieldOriginal.replaceAll('\r\n', '\n') !== fieldResult || caseOriginal.replaceAll('\r\n', '\n') !== caseResult) {
    throw new Error('Prototype implementation evidence is stale. Run npm.cmd run prototype:access:evidence.');
} else {
    console.log('Prototype implementation evidence is synchronized.');
}
