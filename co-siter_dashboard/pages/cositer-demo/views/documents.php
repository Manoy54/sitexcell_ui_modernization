<?php
if (!defined('ABSPATH')) { exit; }

$raw_type = $_GET['type'] ?? '';
$type_filter = is_string($raw_type) ? sanitize_key(wp_unslash($raw_type)) : '';
$type_filter = in_array($type_filter, ['access', 'laan'], true) ? $type_filter : '';
$raw_request = $_GET['request'] ?? '';
$request_filter = is_string($raw_request) ? sanitize_text_field(wp_unslash($raw_request)) : '';
$visible_documents = array_values(array_filter($documents, static function (array $document) use ($type_filter, $request_filter): bool {
    return ($type_filter === '' || $document['type'] === $type_filter)
        && ($request_filter === '' || $document['request_id'] === $request_filter);
}));
?>
<div class="demo-page-heading"><div><p class="demo-eyebrow">Document library</p><h1>Documents</h1><p>Fictional document names only. No files can be opened or downloaded.</p></div><span class="demo-pill">Demo data</span></div>
<div class="demo-category-grid">
    <a class="demo-category <?php echo $type_filter === 'access' ? 'is-selected' : ''; ?>" href="<?php echo esc_url(sitexcell_ui_cositer_demo_url('documents', ['type' => 'access'])); ?>"><svg class="demo-icon" aria-hidden="true"><use href="#icon-document"></use></svg><strong>Access Requests</strong><span>Browse sample access documents</span></a>
    <a class="demo-category <?php echo $type_filter === 'laan' ? 'is-selected' : ''; ?>" href="<?php echo esc_url(sitexcell_ui_cositer_demo_url('documents', ['type' => 'laan'])); ?>"><svg class="demo-icon" aria-hidden="true"><use href="#icon-document"></use></svg><strong>LAAN Requests</strong><span>Browse sample LAAN documents</span></a>
</div>
<section class="demo-panel"><div class="demo-panel-heading"><h2><?php echo $request_filter !== '' ? esc_html('Documents for ' . $request_filter) : ($type_filter === 'access' ? 'Access Request documents' : ($type_filter === 'laan' ? 'LAAN Request documents' : 'Recent documents')); ?></h2><a class="demo-text-link" href="<?php echo esc_url(sitexcell_ui_cositer_demo_url('documents')); ?>">View all</a></div>
    <?php if ($visible_documents) : ?><div class="demo-table-scroll"><table class="demo-table"><thead><tr><th scope="col">Document</th><th scope="col">Request</th><th scope="col">Date added</th></tr></thead><tbody>
        <?php foreach ($visible_documents as $document) : ?><tr><td><?php echo esc_html($document['name']); ?></td><td><a href="<?php echo esc_url(sitexcell_ui_cositer_demo_url('request', ['id' => $document['request_id']])); ?>"><?php echo esc_html($document['request_id']); ?></a></td><td><?php echo esc_html($document['date']); ?></td></tr><?php endforeach; ?>
    </tbody></table></div><?php else : ?><p>No fictional documents match this request.</p><?php endif; ?>
</section>
