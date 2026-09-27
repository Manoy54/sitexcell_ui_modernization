<?php if (!defined('ABSPATH')) { exit; } ?>
<div class="demo-page-heading">
    <div><p class="demo-eyebrow">Request register</p><h1>Requests</h1><p>Browse Access and LAAN requests.</p></div>
</div>
<section class="demo-panel" aria-label="Request list">
    <div class="demo-panel-toolbar">
        <label>Search requests<input type="search" placeholder="ID, Site, or requester" data-demo-request-search></label>
        <label>Status<select data-demo-status-filter><option value="">All statuses</option><option>Open</option><option>Objections</option><option>Closed/Completed</option></select></label>
        <label>Type<select data-demo-type-filter><option value="">All types</option><option>Access Request</option><option>LAAN Request</option></select></label>
    </div>
    <div class="demo-table-scroll">
        <table class="demo-table">
            <thead><tr><th scope="col">ID</th><th scope="col">Date requested</th><th scope="col">Site name</th><th scope="col">Type</th><th scope="col">Status</th><th scope="col">Action</th></tr></thead>
            <tbody>
            <?php foreach ($requests as $request) : ?>
                <tr data-demo-request data-status="<?php echo esc_attr($request['status']); ?>" data-type="<?php echo esc_attr($request['type']); ?>" data-search="<?php echo esc_attr(strtolower($request['id'] . ' ' . $request['site'] . ' ' . $request['requester'])); ?>">
                    <td><strong><?php echo esc_html($request['id']); ?></strong></td>
                    <td><?php echo esc_html($request['date']); ?></td>
                    <td><?php echo esc_html($request['site']); ?></td>
                    <td><?php echo esc_html($request['type']); ?></td>
                    <td><span class="demo-status" data-status="<?php echo esc_attr($request['status']); ?>"><?php echo esc_html($request['status']); ?></span></td>
                    <td><a href="<?php echo esc_url(sitexcell_ui_cositer_demo_url('request', ['id' => $request['id']])); ?>">View details</a></td>
                </tr>
            <?php endforeach; ?>
            </tbody>
        </table>
    </div>
    <p class="demo-list-count" aria-live="polite" data-demo-request-count></p>
    <p class="demo-empty" hidden data-demo-request-empty>No requests match these filters.</p>
</section>
