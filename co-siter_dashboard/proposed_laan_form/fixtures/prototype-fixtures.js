export const activities = [
    { value: 'Inspection', label: 'Inspection' },
    { value: 'Installation', label: 'Installation' },
    { value: 'Maintenance', label: 'Maintenance' },
];

export const owners = [
    { value: '', label: 'Choose company name' },
    { value: 'SYN-OWNER-001', label: 'Harbour Property Group' },
    { value: 'SYN-OWNER-002', label: 'Northbank Assets' },
];

export const sites = [
    { id: 'SYN-CRM-001', name: 'North Quay Tower', address: '1 Harbour Street, Southbank' },
    { id: 'SYN-ALPHA-002', name: 'Southbank Exchange', address: '2 Riverside Avenue, Southbank' },
    { id: 'SYN-BETA-003', name: 'Civic Exchange', address: '3 Market Road, Melbourne' },
];

export const uploadRules = {
    acceptedTypes: ['application/pdf', 'image/jpeg', 'image/png'],
    acceptedExtensions: ['pdf', 'jpg', 'jpeg', 'png'],
    maximumBytes: 20 * 1024 * 1024,
    maximumLabel: '20 MB',
};
