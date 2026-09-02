export const activities = [
    { value: 'Inspection', label: 'Inspection' },
    { value: 'Installation', label: 'Installation' },
    { value: 'Maintenance', label: 'Maintenance' },
];

export const owners = [
    { value: '', label: 'Choose company name' },
    { value: 'SYN-OWNER-001', label: 'Synthetic Owner One' },
    { value: 'SYN-OWNER-002', label: 'Synthetic Owner Two' },
];

export const sites = [
    { id: 'SYN-CRM-001', name: 'CRM Synthetic Test Site', address: '1 Example Street, Exampleville' },
    { id: 'SYN-ALPHA-002', name: 'Alpha Synthetic Site', address: '2 Example Avenue, Exampleville' },
    { id: 'SYN-BETA-003', name: 'Beta Synthetic Site', address: '3 Example Road, Exampleville' },
];

export const uploadRules = {
    acceptedTypes: ['application/pdf', 'image/jpeg', 'image/png'],
    acceptedExtensions: ['pdf', 'jpg', 'jpeg', 'png'],
    maximumBytes: 20 * 1024 * 1024,
    maximumLabel: '20 MB',
};
