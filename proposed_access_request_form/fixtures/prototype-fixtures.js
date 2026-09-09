import { createInitialState, selectDocument } from '../src/model/form-model.js';

export const SITES = Object.freeze([
    { id: 'SITE-1001', slug: 'site-southbank', name: 'Southbank Exchange', address: '18 Fiction Lane, Southbank VIC 3006', owner: 'Harbour Property Group', requirement: 'Goods lift bookings require two business days notice.' },
    { id: 'SITE-1002', slug: 'site-southbank-north', name: 'Southbank North Exchange', address: '81 Sample Street, Southbank VIC 3006', owner: 'Northbank Assets', requirement: 'After-hours access requires a fictional security escort.' },
    { id: 'SITE-2041', slug: 'site-collins', name: 'Collins Exchange', address: '410 Example Road, Melbourne VIC 3000', owner: 'Collins Example Holdings', requirement: 'Use the loading bay entrance and contact the Site representative on arrival.' },
    { id: 'SITE-3108', slug: 'site-monash', name: 'Monash Research Exchange', address: '7 Prototype Avenue, Clayton VIC 3168', owner: 'Monash Sample Estates', requirement: 'Current local induction evidence is required for each contractor.' },
]);

export const RETURNING_PEOPLE = Object.freeze([
    { id: 'PERSON-101', name: 'Alex Morgan', company: 'Signal Works Pty Ltd', phone: '0400 123 456', email: 'alex.morgan@example.test', freshness: 'Reviewed 12 Aug 2026' },
    { id: 'PERSON-102', name: 'Jordan Lee', company: 'Example Field Services', phone: '0400 555 019', email: 'jordan.lee@example.test', freshness: 'Reviewed 28 Jul 2026' },
]);

export const LINKED_LAAN = Object.freeze({
    id: 'LAAN-DEMO-204',
    siteId: 'SITE-1001',
    projectReference: 'SX-LAAN-204',
    source: 'Fictional LAAN demonstration · reviewed 1 Sep 2026',
});

const demoFile = (name) => ({ name, size: 350_000, type: 'application/pdf' });

export function createCompleteDemoState() {
    const state = createInitialState();
    Object.assign(state.fields, {
        linkedLaan: LINKED_LAAN.id,
        ownerName: 'Harbour Property Group',
        siteQuery: SITES[0].name,
        tenureConfirmed: 'yes', networkRequired: 'no', termsAccepted: true,
        emergencyAccess: 'not-required', buildingAddress: SITES[0].address, requirementsRead: true,
        projectReference: 'SX-PROTOTYPE-104', tenantCompany: 'Example Mobile Networks', tenantContactName: 'Taylor Chen', tenantContactPhone: '0400 200 300', tenantLocation: 'Roof and Level 14', accessAreas: 'Loading bay, goods lift and rooftop plant area',
        carrierName: 'Fictional Carrier Australia', carrierContactName: 'Jordan Lee', carrierContactPhone: '0400 555 019', carrierAddress: '50 Sample Way, Melbourne VIC 3000', accessDate: '18-09-2026', accessStart: '09:00', accessFinish: '15:00', numberOfDays: '1',
        requesterName: 'Alex Morgan', requesterCompany: 'Signal Works Pty Ltd', requesterJobTitle: 'Project coordinator', requesterPhone: '0400 123 456', requesterEmail: 'alex.morgan@example.test', requesterAddress: '24 Demonstration Drive, Richmond VIC 3121',
        natureOfWorks: 'maintenance', permitType: 'standard', worksDescription: 'Inspect rooftop equipment and complete non-invasive maintenance.', noisyWorks: 'no', disruptiveWorks: 'no', specialAccessAcknowledged: true,
        permitAgreed: true, ownerPermitAgreed: true, worksAtHeight: 'no', asbestosRisk: 'no', fireIsolation: 'no',
        technicalChange: 'not-applicable', roofAccess: 'no', powerRequired: 'no', ceilingAccess: 'no', riserAccess: 'no', coreDrilling: 'no', certifierRequired: 'no',
        technicalRulesAgreed: true, cablingAgreed: true, penetrationsAgreed: true, cleanupAgreed: true,
        sassiNumber: 'SASSI-DEMO-881', workersCompExpiry: '31-12-2026', liabilityExpiry: '31-12-2026', documentsConfirmed: true,
        swms1: true, swms2: true, swms3: true, swms4: true, swms5: true, swms6: true,
        swms7: true, swms8: true, swms9: true, swms10: true, swms11: true, swms12: true,
        siteDeclaration: true, safetyDeclaration: true, invoiceDetails: 'Example Billing Pty Ltd · PO PROTOTYPE-104', finalDeclaration: true, additionalNotes: 'Synthetic scenario for interface review only.',
    });
    state.selectedSite = SITES[0];
    state.confirmations.siteRequirements = SITES[0].slug;
    state.contractors = [{ id: 'contractor-1', name: 'Sam Rivera', company: 'Signal Works Pty Ltd', phone: '0400 777 411', licence: 'VIC-DEMO-8192', whiteCard: 'WC-DEMO-3001', induction: 'yes', inductionExpiry: '30-11-2026' }];

    const names = {
        qualification: 'qualification-demo.pdf', authority: 'authority-demo.pdf', swms: 'site-specific-swms-demo.pdf',
        workersComp: 'workers-comp-demo.pdf', liability: 'public-liability-demo.pdf',
    };
    let completed = state;
    for (const [key, name] of Object.entries(names)) {
        completed = selectDocument(completed, key, demoFile(name));
        const document = completed.documents[key];
        const confirmation = `${key}Reviewed`;
        completed.confirmations[confirmation] = document.version;
    }
    completed.currentStage = 8;
    completed.completedStages = [1, 2, 3, 4, 5, 6, 7];
    completed.notices = ['Complete fictional scenario loaded. No external data or submission is involved.'];
    return completed;
}
