export function futureAccessDate(daysAhead = 7) {
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);
  return `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
}
export function accessRequestBaseline(runId) {
  const uniqueReference = runId ?? 'synthetic-access-request';
  return {
    project: {
      associatedLaanId: uniqueReference,
      company: 'Synthetic Test Company',
      healthAndSafetyContact: 'Synthetic Contact',
      healthAndSafetyPhone: '0400000000',
      location: 'Level 1',
      accessArea: 'Communications room',
      carrier: 'Synthetic Carrier',
      carrierContact: 'Carrier Contact',
      carrierPhone: '0400000001',
      carrierAddress: '1 Synthetic Street, Redbank QLD 4301',
      accessDate: futureAccessDate(),
      startTime: '09:00',
      endTime: '10:00',
      workerCount: '1',
    },
    workers: [
      {
        name: 'Worker One',
        company: 'Synthetic Test Company',
        role: 'Technician',
        phone: '0400000002',
        email: 'worker.one@example.invalid',
        address: '1 Synthetic Street, Redbank QLD 4301',
      },
      {
        name: 'Worker Two',
        company: 'Synthetic Test Company',
        role: 'Technician',
        phone: '0400000003',
        email: 'worker.two@example.invalid',
        address: '1 Synthetic Street, Redbank QLD 4301',
      },
    ],
    contractor: {
      countLabel: 'Up to ten contractors',
      identityGroupCount: '1',
      name: 'Contractor One',
      company: 'Synthetic Contractor Company',
      phone: '0400000010',
      inductionNumber: 'SYN-CARD-001',
      siteInducted: true,
      inductionExpiry: futureAccessDate(30),
      qualificationFile: 'synthetic-access-document.pdf',
    },
  };
}
