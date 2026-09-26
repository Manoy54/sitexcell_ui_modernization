import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve('.');
const fieldPath = resolve(root, 'docs/testing/access-request/prototype/field-disposition-plan.json');
const casePath = resolve(root, 'docs/testing/access-request/prototype/test-case-plan.json');
const appPath = 'co-siter_dashboard/proposed_access_request_form/src/app.js';
const modelPath = 'co-siter_dashboard/proposed_access_request_form/src/model/form-model.js';
const appSource = readFileSync(resolve(root, appPath), 'utf8');
const modelSource = readFileSync(resolve(root, modelPath), 'utf8');
const implementationSource = `${appSource}\n${modelSource}`;
const exactOriginalIds = new Set(implementationSource.match(/input_3_\d+/g) ?? []);
const appOriginalIds = new Set(appSource.match(/input_3_\d+/g) ?? []);
const modelOriginalIds = new Set(modelSource.match(/input_3_\d+/g) ?? []);

const contractorLabels = new Set([
    'Name', 'Name*', 'Full Name*', 'Company', 'Company*', 'Phone', 'Phone*', 'Phone / Mobile*',
    'Drivers Licence Number', 'Drivers Licence Number*', 'Construction Card Induction Number',
    'White Card Induction Number*', 'Monash Induction  Complete? Yes/No',
    'Monash Induction  Complete? Yes/No*', 'Yes / No', 'Site Induction Expiry Date',
    'Qualifications & Training (attach copies)*',
]);

const automatedEvidence = new Map();
const addAutomated = (ids, evidence) => ids.forEach((id) => automatedEvidence.set(id, evidence));
const unitEvidence = 'co-siter_dashboard/proposed_access_request_form/tests/unit/form-model.test.mjs';
const browserEvidence = 'co-siter_dashboard/proposed_access_request_form/tests/browser/access-request.spec.mjs';
addAutomated(['PA-001', 'PA-004', 'PA-005', 'PA-006'], browserEvidence);
addAutomated(['PA-B04', 'PA-B07', 'PA-B08', 'PA-R02', 'PA-R03', 'PA-R04', 'PA-U03', 'PA-U05', 'PA-U06', 'PA-U07', 'PA-D03'], unitEvidence);
addAutomated(['PA-U04'], `${unitEvidence}; ${browserEvidence}`);
addAutomated(['PA-D01', 'PA-D02'], `${unitEvidence}; ${browserEvidence}`);
addAutomated(['PA-S01', 'PA-S02', 'PA-S03'], browserEvidence);
addAutomated(['PA-C01', 'PA-C02', 'PA-C03', 'PA-C04', 'PA-C05', 'PA-C06', 'PA-C07', 'PA-C08'], unitEvidence);
addAutomated(['PA-A03', 'PA-A04', 'PA-A05', 'PA-X02'], browserEvidence);

const guidedDemonstrations = new Set(['PA-P02', 'PA-P03', 'PA-P04', 'PA-D04', 'PA-X01']);
const fullyAsserted = new Set(['PA-001', 'PA-D01', 'PA-D02', 'PA-A04', 'PA-X02']);

function buildFieldPlan(plan) {
    const counts = {};
    const rows = plan.rows.map((row) => {
        const direct = row.controlIds.some((id) => exactOriginalIds.has(id));
        const grouped = row.step === 4 && row.labels.some((label) => contractorLabels.has(label));
        const providerOnly = row.fieldId == null || (row.controlTypes.length > 0 && row.controlTypes.every((type) => ['button', 'hidden', 'submit'].includes(type)));
        const implementationStatus = direct
            ? 'implemented-semantic-control'
            : grouped ? 'implemented-repeated-semantic-control'
                : providerOnly ? 'provider-only-excluded'
                    : 'mapped-production-deferred';
        counts[implementationStatus] = (counts[implementationStatus] ?? 0) + 1;
        const exactLocations = row.controlIds.flatMap((id) => [
            ...(appOriginalIds.has(id) ? [`${appPath}#data-original-id=${id}`] : []),
            ...(modelOriginalIds.has(id) ? [`${modelPath}#originalId=${id}`] : []),
        ]);
        const implementationLocation = direct
            ? [...new Set(exactLocations)].join('; ')
            : grouped ? 'co-siter_dashboard/proposed_access_request_form/src/app.js#contractorFields'
                : providerOnly ? 'docs/testing/access-request/prototype/implementation-report.md#explicitly-not-implemented'
                    : 'docs/testing/access-request/prototype/field-disposition-plan.json';
        const testStatus = implementationStatus.startsWith('implemented')
            ? 'implementation-present-field-check-not-individually-run'
            : providerOnly ? 'not-applicable-local-prototype' : 'not-run-production-deferred';
        const dependencyStatus = implementationStatus.startsWith('implemented')
            ? 'prototype-control-present-scenario-dependency-not-individually-validated'
            : row.dependencyStatus;
        const localCheckExecutionStatus = implementationStatus.startsWith('implemented') ? 'NOT-RUN' : 'NOT-APPLICABLE';
        return { ...row, implementationStatus, implementationLocation, dependencyStatus, testStatus, localCheckExecutionStatus };
    });
    return {
        ...plan,
        status: 'prototype-disposition-recorded-with-partial-field-validation',
        summary: { ...plan.summary, implementedFields: (counts['implemented-semantic-control'] ?? 0) + (counts['implemented-repeated-semantic-control'] ?? 0), individuallyValidatedFields: 0, ...counts },
        rows,
    };
}

function buildCasePlan(plan) {
    const counts = {};
    const cases = plan.cases.map((entry) => {
        let implementationStatus = 'implemented-partial-unverified';
        let executionStatus = 'NOT-RUN';
        let localEvidence = [];
        if (automatedEvidence.has(entry.localCheckId)) {
            const isFullyAsserted = fullyAsserted.has(entry.localCheckId);
            implementationStatus = isFullyAsserted ? 'implemented-automated' : 'implemented-automated-partial';
            executionStatus = isFullyAsserted ? 'PASS' : 'PARTIAL-PASS';
            localEvidence = automatedEvidence.get(entry.localCheckId).split('; ');
        } else if (entry.plannedScope === 'measurement') {
            implementationStatus = 'method-retained-measurement-pending';
            executionStatus = 'NOT-RUN';
        } else if (guidedDemonstrations.has(entry.localCheckId)) {
            implementationStatus = 'implemented-guided-demonstration';
            executionStatus = 'AVAILABLE-NOT-EXECUTED';
            localEvidence = ['co-siter_dashboard/proposed_access_request_form/src/app.js'];
        }
        counts[implementationStatus] = (counts[implementationStatus] ?? 0) + 1;
        return { ...entry, implementationStatus, executionStatus, localEvidence };
    });
    return {
        ...plan,
        status: 'implementation-accounted-with-production-deferrals',
        countingNote: 'All 64 source concerns retain one mapping. PASS requires an explicitly named local automated check; guided demonstrations, partial implementations and measurements are not promoted to passes.',
        implementationSummary: counts,
        cases,
    };
}

const fieldOriginal = readFileSync(fieldPath, 'utf8');
const caseOriginal = readFileSync(casePath, 'utf8');
const fieldResult = `${JSON.stringify(buildFieldPlan(JSON.parse(fieldOriginal)), null, 2)}\n`;
const caseResult = `${JSON.stringify(buildCasePlan(JSON.parse(caseOriginal)), null, 2)}\n`;
const builtCases = JSON.parse(caseResult);
if (builtCases.cases.some((entry) => ['PASS', 'PARTIAL-PASS'].includes(entry.executionStatus) && entry.localEvidence.length === 0)) {
    throw new Error('A PASS case is missing explicit local evidence.');
}
if (exactOriginalIds.has('input_3_1') && !/input_3_1(?!\d)/.test(implementationSource)) {
    throw new Error('Exact control-ID matching regressed to substring matching.');
}

if (process.argv.includes('--write')) {
    writeFileSync(fieldPath, fieldResult);
    writeFileSync(casePath, caseResult);
    console.log('Prototype field and case implementation evidence synchronized.');
} else if (fieldOriginal.replaceAll('\r\n', '\n') !== fieldResult || caseOriginal.replaceAll('\r\n', '\n') !== caseResult) {
    throw new Error('Prototype implementation evidence is stale. Run npm.cmd run prototype:access:evidence.');
} else {
    console.log('Prototype implementation evidence is synchronized.');
}
