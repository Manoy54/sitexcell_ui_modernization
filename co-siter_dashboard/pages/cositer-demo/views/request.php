<?php
if (!defined('ABSPATH')) { exit; }

$raw_id = $_GET['id'] ?? '';
$request_id = is_string($raw_id) ? sanitize_text_field(wp_unslash($raw_id)) : '';
$selected_request = null;
foreach ($requests as $candidate) {
    if ($candidate['id'] === $request_id) {
        $selected_request = $candidate;
        break;
    }
}

if ($selected_request === null) {
    status_header(404);
    echo '<div class="demo-page-heading"><div><h1>Request not found</h1><p>This request does not exist.</p></div></div>';
    echo '<a class="demo-text-link" href="' . esc_url(sitexcell_ui_cositer_demo_url()) . '">Back to Requests</a>';
    return;
}

$related_documents = array_values(array_filter($documents, static fn (array $document): bool => $document['request_id'] === $selected_request['id']));
?>
<div class="demo-page-heading">
    <div><p class="demo-eyebrow">Read-only request</p><h1><?php echo esc_html($selected_request['id']); ?></h1><p><?php echo esc_html($selected_request['summary']); ?></p></div>
    <span class="demo-status" data-status="<?php echo esc_attr($selected_request['status']); ?>"><?php echo esc_html($selected_request['status']); ?></span>
</div>
<div class="demo-detail-grid">
    <section class="demo-panel"><h2>Request details</h2><dl class="demo-details">
        <div><dt>Site</dt><dd><?php echo esc_html($selected_request['site']); ?></dd></div>
        <div><dt>Type</dt><dd><?php echo esc_html($selected_request['type']); ?></dd></div>
        <div><dt>Date requested</dt><dd><?php echo esc_html($selected_request['date']); ?></dd></div>
        <div><dt>Requester</dt><dd><?php echo esc_html($selected_request['requester']); ?></dd></div>
    </dl></section>
    <section class="demo-panel"><h2>Related documents</h2>
        <?php if ($related_documents) : ?><ul class="demo-document-links">
            <?php foreach ($related_documents as $document) : ?><li><svg class="demo-icon" aria-hidden="true"><use href="#icon-file"></use></svg><?php echo esc_html($document['name']); ?></li><?php endforeach; ?>
        </ul><a class="demo-text-link" href="<?php echo esc_url(sitexcell_ui_cositer_demo_url('documents', ['request' => $selected_request['id']])); ?>">View in Documents</a>
        <?php else : ?><p>No documents are linked to this request.</p><?php endif; ?>
    </section>
</div>
<a class="demo-text-link" href="<?php echo esc_url(sitexcell_ui_cositer_demo_url()); ?>">← Back to Requests</a>
