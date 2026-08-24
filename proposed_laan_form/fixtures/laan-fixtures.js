export const activities = [
    { value: 'Inspection', label: 'Inspection' },
    { value: 'Installation', label: 'Installation' },
    { value: 'Maintenance', label: 'Maintenance' },
];

export const owners = [
    { value: '', label: 'Type or open owner list' },
    { value: 'harbour-shared-services', label: 'Harbour Shared Services Co. — Demo' },
    { value: 'metro-property-group', label: 'Metro Property Group — Demo' },
    { value: 'university-estates', label: 'University Estates Office — Demo' },
];

export const sites = [
    {
        id: 'SX-DEMO-1001',
        name: 'Northbank Exchange — Demo',
        address: '18 Example Quay, Northbank VIC 3000',
        owner: 'Harbour Shared Services Co. — Demo',
        notes: 'Use the loading-bay entrance and contact the building representative before arrival.',
    },
    {
        id: 'SX-DEMO-1002',
        name: 'Northbank Exchange Annex — Demo',
        address: '22 Example Quay, Northbank VIC 3000',
        owner: 'Harbour Shared Services Co. — Demo',
        notes: 'The Annex has a separate security desk. Photo identification is required.',
    },
    {
        id: 'SX-DEMO-2001',
        name: 'Central Communications Tower — Demo',
        address: '360 Sample Street, Melbourne VIC 3000',
        owner: 'Metro Property Group — Demo',
        notes: 'Roof access requires an inducted escort. Allow two business days for coordination.',
    },
    {
        id: 'SX-DEMO-3001',
        name: 'University Technology Campus, Building 28 — Demo',
        address: '1 Prototype Avenue, Clayton VIC 3168',
        owner: 'University Estates Office — Demo',
        notes: 'Long site note fixture: report to Campus Security, confirm the approved work zone, and keep all emergency egress paths clear throughout the activity.',
    },
];

export const uploadRules = {
    acceptedTypes: ['application/pdf', 'image/jpeg', 'image/png'],
    acceptedExtensions: ['pdf', 'jpg', 'jpeg', 'png'],
    maximumBytes: 20 * 1024 * 1024,
    maximumLabel: '20 MB',
};
