<?php
/**
 * Fictional records for the Co-Siter navigation prototype only.
 */

if (!defined('ABSPATH')) {
    exit;
}

function sitexcell_ui_cositer_demo_requests(): array
{
    return [
        ['id' => 'SAR-001', 'date' => '24 Sep 2026', 'site' => 'North Quay Tower', 'type' => 'Access Request', 'status' => 'Open', 'requester' => 'Alex Morgan', 'summary' => 'Routine equipment inspection in a shared plant room.'],
        ['id' => 'LAAN-002', 'date' => '23 Sep 2026', 'site' => 'Civic Exchange', 'type' => 'LAAN Request', 'status' => 'Objections', 'requester' => 'Jordan Lee', 'summary' => 'Proposed cable route and associated notice review.'],
        ['id' => 'SAR-003', 'date' => '21 Sep 2026', 'site' => 'Harbour Point Centre', 'type' => 'Access Request', 'status' => 'Open', 'requester' => 'Taylor Nguyen', 'summary' => 'Scheduled antenna maintenance and roof access.'],
        ['id' => 'LAAN-004', 'date' => '18 Sep 2026', 'site' => 'West Quay Annex', 'type' => 'LAAN Request', 'status' => 'Closed/Completed', 'requester' => 'Sam Rivera', 'summary' => 'Completed notice review for internal fibre works.'],
        ['id' => 'SAR-005', 'date' => '16 Sep 2026', 'site' => 'Park Lane House', 'type' => 'Access Request', 'status' => 'Closed/Completed', 'requester' => 'Alex Morgan', 'summary' => 'Completed escorted equipment inspection.'],
        ['id' => 'SAR-006', 'date' => '12 Sep 2026', 'site' => 'Civic Exchange', 'type' => 'Access Request', 'status' => 'Objections', 'requester' => 'Jordan Lee', 'summary' => 'After-hours access pending Site requirements review.'],
        ['id' => 'LAAN-007', 'date' => '10 Sep 2026', 'site' => 'North Quay Tower', 'type' => 'LAAN Request', 'status' => 'Open', 'requester' => 'Taylor Nguyen', 'summary' => 'Notice for proposed equipment replacement.'],
        ['id' => 'SAR-008', 'date' => '08 Sep 2026', 'site' => 'Harbour Point Centre', 'type' => 'Access Request', 'status' => 'Closed/Completed', 'requester' => 'Sam Rivera', 'summary' => 'Completed cable inspection visit.'],
    ];
}

function sitexcell_ui_cositer_demo_users(): array
{
    return [
        ['name' => 'Alex Morgan', 'email' => 'alex.morgan@example.invalid', 'company' => 'Example Access Co', 'role' => 'Requester'],
        ['name' => 'Jordan Lee', 'email' => 'jordan.lee@example.invalid', 'company' => 'Harbour Network Group', 'role' => 'Requester'],
        ['name' => 'Taylor Nguyen', 'email' => 'taylor.nguyen@example.invalid', 'company' => 'Southbank Infrastructure', 'role' => 'Coordinator'],
        ['name' => 'Sam Rivera', 'email' => 'sam.rivera@example.invalid', 'company' => 'Civic Property Services', 'role' => 'Requester'],
    ];
}

function sitexcell_ui_cositer_demo_documents(): array
{
    return [
        ['name' => 'Inspection access plan.pdf', 'request_id' => 'SAR-001', 'type' => 'access', 'date' => '24 Sep 2026'],
        ['name' => 'Cable route notice.pdf', 'request_id' => 'LAAN-002', 'type' => 'laan', 'date' => '23 Sep 2026'],
        ['name' => 'Roof work method.pdf', 'request_id' => 'SAR-003', 'type' => 'access', 'date' => '21 Sep 2026'],
        ['name' => 'Fibre works notice.pdf', 'request_id' => 'LAAN-004', 'type' => 'laan', 'date' => '18 Sep 2026'],
        ['name' => 'Equipment replacement notice.pdf', 'request_id' => 'LAAN-007', 'type' => 'laan', 'date' => '10 Sep 2026'],
    ];
}
