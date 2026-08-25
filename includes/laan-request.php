<?php
/**
 * Native WordPress LAAN request implementation.
 *
 * The front-end renderer is shared with the approved prototype, but all
 * persistence, validation, uploads, and administration live in WordPress.
 */

if (!defined('ABSPATH')) {
    exit;
}

define('SITEXCELL_UI_LAAN_SITE_POST_TYPE', 'sx_laan_site');

function sitexcell_ui_laan_table_name(): string
{
    global $wpdb;

    return $wpdb->prefix . 'sitexcell_laan_requests';
}

function sitexcell_ui_laan_is_admin(): bool
{
    return current_user_can('manage_options');
}

function sitexcell_ui_laan_register_site_post_type(): void
{
    register_post_type(SITEXCELL_UI_LAAN_SITE_POST_TYPE, [
        'labels' => [
            'name' => 'LAAN Sites',
            'singular_name' => 'LAAN Site',
            'add_new_item' => 'Add LAAN Site',
            'edit_item' => 'Edit LAAN Site',
            'menu_name' => 'LAAN Sites',
        ],
        'public' => false,
        'show_ui' => true,
        'show_in_menu' => true,
        'menu_icon' => 'dashicons-location-alt',
        'supports' => ['title', 'editor'],
        'capability_type' => 'post',
        'map_meta_cap' => true,
    ]);
}

add_action('init', 'sitexcell_ui_laan_register_site_post_type');

function sitexcell_ui_laan_activate(): void
{
    global $wpdb;

    require_once ABSPATH . 'wp-admin/includes/upgrade.php';

    $charset = $wpdb->get_charset_collate();
    $table = sitexcell_ui_laan_table_name();
    $sql = "CREATE TABLE {$table} (
        id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
        user_id bigint(20) unsigned NOT NULL DEFAULT 0,
        status varchar(30) NOT NULL DEFAULT 'submitted',
        site_id varchar(100) NOT NULL,
        site_name text NOT NULL,
        site_address text NULL,
        fields_json longtext NOT NULL,
        confirmations_json longtext NOT NULL,
        files_json longtext NULL,
        created_at datetime NOT NULL,
        updated_at datetime NOT NULL,
        PRIMARY KEY  (id),
        KEY status (status),
        KEY site_id (site_id),
        KEY user_id (user_id),
        KEY created_at (created_at)
    ) {$charset};";

    dbDelta($sql);
    sitexcell_ui_laan_register_site_post_type();
    sitexcell_ui_laan_ensure_page();
    flush_rewrite_rules();
}

function sitexcell_ui_laan_deactivate(): void
{
    flush_rewrite_rules();
}

register_activation_hook(SITEXCELL_UI_PATH . 'sitexcell-ui-prototype.php', 'sitexcell_ui_laan_activate');
register_deactivation_hook(SITEXCELL_UI_PATH . 'sitexcell-ui-prototype.php', 'sitexcell_ui_laan_deactivate');

function sitexcell_ui_laan_ensure_page(): void
{
    $page = get_page_by_path(SITEXCELL_UI_LAAN_SLUG, OBJECT, 'page');

    if ($page instanceof WP_Post) {
        return;
    }

    wp_insert_post([
        'post_title' => 'LAAN Request',
        'post_name' => SITEXCELL_UI_LAAN_SLUG,
        'post_content' => '[sitexcell_laan_request]',
        'post_status' => 'draft',
        'post_type' => 'page',
    ]);
}

function sitexcell_ui_is_laan_request(): bool
{
    if (function_exists('sitexcell_ui_get_current_prototype') && sitexcell_ui_get_current_prototype() === 'laan-request') {
        return true;
    }

    $post = is_singular() ? get_queried_object() : null;

    return $post instanceof WP_Post && has_shortcode($post->post_content, 'sitexcell_laan_request');
}

function sitexcell_ui_laan_get_site_records(): array
{
    $posts = get_posts([
        'post_type' => SITEXCELL_UI_LAAN_SITE_POST_TYPE,
        'post_status' => 'publish',
        'posts_per_page' => -1,
        'orderby' => 'title',
        'order' => 'ASC',
    ]);

    $records = [];

    foreach ($posts as $post) {
        $site_id = (string) get_post_meta($post->ID, '_sitexcell_laan_site_id', true);

        if ($site_id === '') {
            continue;
        }

        $notes = apply_filters('the_content', $post->post_content);

        $records[] = [
            'id' => $site_id,
            'name' => $post->post_title,
            'address' => (string) get_post_meta($post->ID, '_sitexcell_laan_site_address', true),
            'owner' => (string) get_post_meta($post->ID, '_sitexcell_laan_site_owner', true),
            'notesHtml' => wp_kses_post($notes),
        ];
    }

    return $records;
}

function sitexcell_ui_laan_frontend_config(): array
{
    return [
        'native' => true,
        'ajaxUrl' => admin_url('admin-ajax.php'),
        'nonce' => wp_create_nonce('sitexcell_laan_submit'),
        'sites' => sitexcell_ui_laan_get_site_records(),
        'uploadRules' => [
            'acceptedTypes' => ['application/pdf', 'image/jpeg', 'image/png'],
            'acceptedExtensions' => ['pdf', 'jpg', 'jpeg', 'png'],
            'maximumBytes' => 20 * 1024 * 1024,
            'maximumLabel' => '20 MB',
        ],
    ];
}

function sitexcell_ui_laan_register_meta_boxes(): void
{
    add_meta_box(
        'sitexcell-laan-site-context',
        'LAAN Site Context',
        'sitexcell_ui_laan_render_site_meta_box',
        SITEXCELL_UI_LAAN_SITE_POST_TYPE,
        'side',
        'high'
    );
}

add_action('add_meta_boxes', 'sitexcell_ui_laan_register_meta_boxes');

function sitexcell_ui_laan_render_site_meta_box(WP_Post $post): void
{
    wp_nonce_field('sitexcell_laan_site_context', 'sitexcell_laan_site_context_nonce');
    ?>
    <p>
        <label for="sitexcell-laan-site-id"><strong>Site ID</strong></label>
        <input class="widefat" id="sitexcell-laan-site-id" name="sitexcell_laan_site_id" value="<?php echo esc_attr(get_post_meta($post->ID, '_sitexcell_laan_site_id', true)); ?>" required>
    </p>
    <p>
        <label for="sitexcell-laan-site-address"><strong>Address</strong></label>
        <textarea class="widefat" id="sitexcell-laan-site-address" name="sitexcell_laan_site_address" rows="3"><?php echo esc_textarea(get_post_meta($post->ID, '_sitexcell_laan_site_address', true)); ?></textarea>
    </p>
    <p>
        <label for="sitexcell-laan-site-owner"><strong>Owner filter label</strong></label>
        <input class="widefat" id="sitexcell-laan-site-owner" name="sitexcell_laan_site_owner" value="<?php echo esc_attr(get_post_meta($post->ID, '_sitexcell_laan_site_owner', true)); ?>">
    </p>
    <p class="description">The main editor above stores the formatted Site Notes to Carriers content.</p>
    <?php
}

function sitexcell_ui_laan_save_site_meta(int $post_id): void
{
    if (
        !isset($_POST['sitexcell_laan_site_context_nonce'])
        || !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['sitexcell_laan_site_context_nonce'])), 'sitexcell_laan_site_context')
        || (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE)
        || wp_is_post_revision($post_id)
        || !current_user_can('edit_post', $post_id)
    ) {
        return;
    }

    update_post_meta($post_id, '_sitexcell_laan_site_id', sanitize_text_field(wp_unslash($_POST['sitexcell_laan_site_id'] ?? '')));
    update_post_meta($post_id, '_sitexcell_laan_site_address', sanitize_textarea_field(wp_unslash($_POST['sitexcell_laan_site_address'] ?? '')));
    update_post_meta($post_id, '_sitexcell_laan_site_owner', sanitize_text_field(wp_unslash($_POST['sitexcell_laan_site_owner'] ?? '')));
}

add_action('save_post_' . SITEXCELL_UI_LAAN_SITE_POST_TYPE, 'sitexcell_ui_laan_save_site_meta');

function sitexcell_ui_laan_register_admin_pages(): void
{
    add_submenu_page(
        'edit.php?post_type=' . SITEXCELL_UI_LAAN_SITE_POST_TYPE,
        'LAAN Requests',
        'Requests',
        'manage_options',
        'sitexcell-laan-requests',
        'sitexcell_ui_laan_render_requests_admin'
    );

    add_submenu_page(
        'edit.php?post_type=' . SITEXCELL_UI_LAAN_SITE_POST_TYPE,
        'LAAN Settings',
        'Settings',
        'manage_options',
        'sitexcell-laan-settings',
        'sitexcell_ui_laan_render_settings_admin'
    );
}

add_action('admin_menu', 'sitexcell_ui_laan_register_admin_pages');

function sitexcell_ui_laan_register_settings(): void
{
    register_setting('sitexcell_ui_laan_settings', 'sitexcell_ui_laan_notification_emails', [
        'type' => 'string',
        'sanitize_callback' => 'sanitize_textarea_field',
        'default' => '',
    ]);
}

add_action('admin_init', 'sitexcell_ui_laan_register_settings');

function sitexcell_ui_laan_render_settings_admin(): void
{
    if (!sitexcell_ui_laan_is_admin()) {
        wp_die('You do not have permission to manage LAAN settings.');
    }

    $site_count = count(sitexcell_ui_laan_get_site_records());
    $import_url = wp_nonce_url(admin_url('admin-post.php?action=sitexcell_ui_laan_import_snapshot'), 'sitexcell_ui_laan_import_snapshot');
    ?>
    <div class="wrap">
        <h1>LAAN Settings</h1>
        <p>These settings control the native WordPress LAAN implementation. The front-end layout remains code-managed so the approved interface stays consistent.</p>
        <form action="options.php" method="post">
            <?php settings_fields('sitexcell_ui_laan_settings'); ?>
            <table class="form-table" role="presentation">
                <tr>
                    <th scope="row"><label for="sitexcell-ui-laan-notification-emails">Notification recipients</label></th>
                    <td>
                        <textarea class="large-text" id="sitexcell-ui-laan-notification-emails" name="sitexcell_ui_laan_notification_emails" rows="4"><?php echo esc_textarea(get_option('sitexcell_ui_laan_notification_emails', '')); ?></textarea>
                        <p class="description">Enter one email address per line. Leave empty to use the site administrator email.</p>
                    </td>
                </tr>
            </table>
            <?php submit_button('Save LAAN settings'); ?>
        </form>

        <hr>
        <h2>LAAN Sites</h2>
        <p><strong><?php echo esc_html((string) $site_count); ?></strong> published Site records are currently available to the form.</p>
        <p>Use the one-time importer to seed the local registry from the approved prototype snapshot, then manage the records under <strong>LAAN Sites</strong>.</p>
        <p><a class="button" href="<?php echo esc_url($import_url); ?>">Import prototype Site snapshot</a></p>
        <p class="description">Review and approve the imported notes before using this data in a production environment.</p>
    </div>
    <?php
}

function sitexcell_ui_laan_render_requests_admin(): void
{
    if (!sitexcell_ui_laan_is_admin()) {
        wp_die('You do not have permission to view LAAN requests.');
    }

    global $wpdb;
    $table = sitexcell_ui_laan_table_name();
    $requests = $wpdb->get_results("SELECT * FROM {$table} ORDER BY created_at DESC LIMIT 100");
    ?>
    <div class="wrap">
        <h1>LAAN Requests</h1>
        <p>Native WordPress submissions are stored here. This screen currently shows the latest 100 requests.</p>
        <table class="widefat striped">
            <thead><tr><th>ID</th><th>Created</th><th>Site</th><th>Activity</th><th>Requester</th><th>Status</th></tr></thead>
            <tbody>
            <?php if (!$requests) : ?>
                <tr><td colspan="6">No LAAN requests have been submitted.</td></tr>
            <?php else : ?>
                <?php foreach ($requests as $request) :
                    $fields = json_decode((string) $request->fields_json, true) ?: [];
                    $download = wp_nonce_url(admin_url('admin-post.php?action=sitexcell_ui_laan_download&id=' . (int) $request->id), 'sitexcell_ui_laan_download_' . (int) $request->id);
                    ?>
                    <tr>
                        <td><a href="<?php echo esc_url($download); ?>">#<?php echo esc_html((string) $request->id); ?></a></td>
                        <td><?php echo esc_html((string) $request->created_at); ?></td>
                        <td><?php echo esc_html((string) $request->site_name); ?></td>
                        <td><?php echo esc_html((string) ($fields['activity'] ?? '')); ?></td>
                        <td><?php echo esc_html((string) $request->user_id); ?></td>
                        <td><?php echo esc_html((string) $request->status); ?></td>
                    </tr>
                <?php endforeach; ?>
            <?php endif; ?>
            </tbody>
        </table>
    </div>
    <?php
}

function sitexcell_ui_laan_extract_fixture_json(string $path, string $export_name): array
{
    if (!file_exists($path)) {
        return [];
    }

    $source = file_get_contents($path);
    $prefix = 'export const ' . $export_name . ' = ';
    $start = strpos((string) $source, $prefix);

    if ($start === false) {
        return [];
    }

    $start += strlen($prefix);
    $end = strpos((string) $source, "\nexport const ", $start);

    if ($end === false) {
        $end = strrpos((string) $source, ';');
    }

    $json = $end === false ? substr((string) $source, $start) : substr((string) $source, $start, $end - $start);
    $decoded = json_decode(trim($json), true);

    return is_array($decoded) ? $decoded : [];
}

function sitexcell_ui_laan_import_snapshot(): void
{
    if (!sitexcell_ui_laan_is_admin()) {
        wp_die('You do not have permission to import LAAN Sites.');
    }

    check_admin_referer('sitexcell_ui_laan_import_snapshot');

    $fixtures = SITEXCELL_UI_PATH . 'proposed_laan_form/fixtures/';
    $sites = sitexcell_ui_laan_extract_fixture_json($fixtures . 'laan-fixtures.js', 'sites');
    $contexts = sitexcell_ui_laan_extract_fixture_json($fixtures . 'site-context.js', 'siteContextById');
    $imported = 0;

    foreach ($sites as $site) {
        $site_id = sanitize_text_field((string) ($site['id'] ?? ''));
        $site_name = sanitize_text_field((string) ($site['name'] ?? ''));

        if ($site_id === '' || $site_name === '') {
            continue;
        }

        $existing = get_posts([
            'post_type' => SITEXCELL_UI_LAAN_SITE_POST_TYPE,
            'post_status' => 'any',
            'posts_per_page' => 1,
            'meta_key' => '_sitexcell_laan_site_id',
            'meta_value' => $site_id,
            'fields' => 'ids',
        ]);
        $context = is_array($contexts[$site_id] ?? null) ? $contexts[$site_id] : [];
        $post_data = [
            'post_title' => $site_name,
            'post_content' => wp_kses_post((string) ($context['notesHtml'] ?? '')),
            'post_status' => 'publish',
            'post_type' => SITEXCELL_UI_LAAN_SITE_POST_TYPE,
        ];
        $post_id = $existing ? wp_update_post(array_merge($post_data, ['ID' => (int) $existing[0]]), true) : wp_insert_post($post_data, true);

        if (is_wp_error($post_id)) {
            continue;
        }

        update_post_meta($post_id, '_sitexcell_laan_site_id', $site_id);
        update_post_meta($post_id, '_sitexcell_laan_site_address', sanitize_textarea_field((string) ($context['address'] ?? '')));
        update_post_meta($post_id, '_sitexcell_laan_site_owner', sanitize_text_field((string) ($context['owner'] ?? '')));
        $imported++;
    }

    wp_safe_redirect(add_query_arg([
        'post_type' => SITEXCELL_UI_LAAN_SITE_POST_TYPE,
        'page' => 'sitexcell-laan-settings',
        'laan_imported' => $imported,
    ], admin_url('edit.php')));
    exit;
}

add_action('admin_post_sitexcell_ui_laan_import_snapshot', 'sitexcell_ui_laan_import_snapshot');

function sitexcell_ui_laan_private_directory(): string
{
    $uploads = wp_upload_dir();
    $directory = trailingslashit($uploads['basedir']) . 'sitexcell-laan-private';

    if (!wp_mkdir_p($directory)) {
        return '';
    }

    if (!file_exists($directory . '/index.php')) {
        file_put_contents($directory . '/index.php', "<?php\n// Private LAAN upload directory.\n");
    }

    if (!file_exists($directory . '/.htaccess')) {
        file_put_contents($directory . '/.htaccess', "Options -Indexes\n<IfModule mod_authz_core.c>\n    Require all denied\n</IfModule>\n<IfModule !mod_authz_core.c>\n    Deny from all\n</IfModule>\n");
    }

    return $directory;
}

function sitexcell_ui_laan_store_upload(array $file)
{
    if (($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
        return new WP_Error('laan_upload_error', 'The uploaded file could not be received.');
    }

    require_once ABSPATH . 'wp-admin/includes/file.php';

    $result = wp_handle_upload($file, [
        'test_form' => false,
        'mimes' => [
            'pdf' => 'application/pdf',
            'jpg|jpeg' => 'image/jpeg',
            'png' => 'image/png',
        ],
    ]);

    if (isset($result['error'])) {
        return new WP_Error('laan_upload_error', $result['error']);
    }

    $private_directory = sitexcell_ui_laan_private_directory();

    if ($private_directory === '') {
        @unlink((string) $result['file']);
        return new WP_Error('laan_private_directory_error', 'The private LAAN upload directory could not be created.');
    }

    $filename = wp_unique_filename($private_directory, basename((string) $result['file']));
    $private_path = trailingslashit($private_directory) . $filename;

    if (!rename((string) $result['file'], $private_path)) {
        @unlink((string) $result['file']);
        return new WP_Error('laan_upload_move_error', 'The uploaded file could not be secured.');
    }

    return [
        'name' => sanitize_file_name((string) ($file['name'] ?? $filename)),
        'path' => $private_path,
        'type' => sanitize_mime_type((string) ($result['type'] ?? 'application/octet-stream')),
        'size' => (int) filesize($private_path),
    ];
}

function sitexcell_ui_laan_date_is_valid(string $value): bool
{
    if (!preg_match('/^\d{2}-\d{2}-\d{4}$/', $value)) {
        return false;
    }

    $date = DateTime::createFromFormat('!d-m-Y', $value);
    $errors = DateTime::getLastErrors();

    return $date instanceof DateTime
        && (!$errors || ($errors['warning_count'] === 0 && $errors['error_count'] === 0))
        && $date->format('d-m-Y') === $value;
}

function sitexcell_ui_laan_find_site(string $site_id): ?WP_Post
{
    $sites = get_posts([
        'post_type' => SITEXCELL_UI_LAAN_SITE_POST_TYPE,
        'post_status' => 'publish',
        'posts_per_page' => 1,
        'meta_key' => '_sitexcell_laan_site_id',
        'meta_value' => $site_id,
    ]);

    return $sites ? $sites[0] : null;
}

function sitexcell_ui_laan_submit(): void
{
    if (!is_user_logged_in()) {
        wp_send_json_error(['message' => 'You must be signed in to submit a LAAN request.'], 403);
    }

    check_ajax_referer('sitexcell_laan_submit');

    $payload = json_decode(wp_unslash((string) ($_POST['payload'] ?? '')), true);
    $fields = is_array($payload['fields'] ?? null) ? $payload['fields'] : [];
    $confirmations = is_array($payload['confirmations'] ?? null) ? $payload['confirmations'] : [];
    $required_fields = ['activity', 'commencementDate', 'siteId', 'carrier', 'projectReference', 'tenantCompany', 'contactName', 'contactPhone', 'workLocation', 'affectedAreas'];
    $errors = [];

    foreach ($required_fields as $field) {
        if (trim((string) ($fields[$field] ?? '')) === '') {
            $errors[$field] = 'This field is required.';
        }
    }

    if (!empty($fields['commencementDate']) && !sitexcell_ui_laan_date_is_valid((string) $fields['commencementDate'])) {
        $errors['commencementDate'] = 'Enter a real date in DD-MM-YYYY format.';
    }

    if (empty($fields['termsAccepted'])) {
        $errors['termsAccepted'] = 'Terms and Conditions must be accepted.';
    }

    foreach (['uploadReviewed', 'siteDetailsReviewed', 'workDetailsReviewed', 'accuracyAccepted'] as $confirmation) {
        if (empty($confirmations[$confirmation])) {
            $errors['declarations'] = 'All confirmations must be accepted.';
            break;
        }
    }

    $site_id = sanitize_text_field((string) ($fields['siteId'] ?? ''));
    $site = sitexcell_ui_laan_find_site($site_id);

    if (!$site) {
        $errors['siteId'] = 'Select a valid published LAAN Site.';
    }

    $required_file = $_FILES['required'] ?? [];

    if (!$required_file || ($required_file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
        $errors['requiredFile'] = 'Attach the required LAAN document.';
    } elseif ((int) ($required_file['size'] ?? 0) > 20 * 1024 * 1024) {
        $errors['requiredFile'] = 'The required LAAN document must be 20 MB or smaller.';
    }

    if ($errors) {
        wp_send_json_error(['message' => 'Please correct the highlighted fields.', 'errors' => $errors], 422);
    }

    $stored_files = [];
    $stored_required = sitexcell_ui_laan_store_upload($required_file);

    if (is_wp_error($stored_required)) {
        wp_send_json_error(['message' => $stored_required->get_error_message()], 422);
    }

    $stored_files['required'] = $stored_required;
    $additional_file = $_FILES['additional'] ?? [];
    $additional_error = $additional_file['error'] ?? UPLOAD_ERR_NO_FILE;

    if ($additional_error !== UPLOAD_ERR_NO_FILE && $additional_error !== UPLOAD_ERR_OK) {
        @unlink($stored_required['path']);
        wp_send_json_error(['message' => 'The additional document could not be received.'], 422);
    }

    if ($additional_file && $additional_error === UPLOAD_ERR_OK) {
        if ((int) ($additional_file['size'] ?? 0) > 20 * 1024 * 1024) {
            @unlink($stored_required['path']);
            wp_send_json_error(['message' => 'The additional document must be 20 MB or smaller.'], 422);
        }

        $stored_additional = sitexcell_ui_laan_store_upload($additional_file);

        if (is_wp_error($stored_additional)) {
            @unlink($stored_required['path']);
            wp_send_json_error(['message' => $stored_additional->get_error_message()], 422);
        }

        $stored_files['additional'] = $stored_additional;
    }

    global $wpdb;
    $now = current_time('mysql');
    $fields_to_store = [];

    foreach ($fields as $key => $value) {
        $fields_to_store[sanitize_key((string) $key)] = is_scalar($value) ? sanitize_textarea_field((string) $value) : '';
    }

    $confirmations_to_store = [];

    foreach ($confirmations as $key => $value) {
        $confirmations_to_store[sanitize_key((string) $key)] = (bool) $value;
    }

    $record = [
        'user_id' => get_current_user_id(),
        'status' => 'submitted',
        'site_id' => $site_id,
        'site_name' => $site->post_title,
        'site_address' => (string) get_post_meta($site->ID, '_sitexcell_laan_site_address', true),
        'fields_json' => wp_json_encode($fields_to_store),
        'confirmations_json' => wp_json_encode($confirmations_to_store),
        'files_json' => wp_json_encode($stored_files),
        'created_at' => $now,
        'updated_at' => $now,
    ];
    $inserted = $wpdb->insert(sitexcell_ui_laan_table_name(), $record, ['%d', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s']);

    if (!$inserted) {
        foreach ($stored_files as $stored_file) {
            @unlink($stored_file['path']);
        }

        wp_send_json_error(['message' => 'The LAAN request could not be saved.'], 500);
    }

    $recipients = preg_split('/[\r\n,]+/', (string) get_option('sitexcell_ui_laan_notification_emails', ''), -1, PREG_SPLIT_NO_EMPTY);
    $recipients = array_values(array_filter(array_map('sanitize_email', $recipients)));
    if (!$recipients) {
        $recipients = [get_option('admin_email')];
    }

    $subject = 'New LAAN request #' . $wpdb->insert_id . ' - ' . $site->post_title;
    $message = "A native WordPress LAAN request has been submitted.\n\nRequest ID: #{$wpdb->insert_id}\nSite: {$site->post_title}\nActivity: " . ($fields_to_store['activity'] ?? '') . "\nCommencement date: " . ($fields_to_store['commencementdate'] ?? '') . "\n";
    $attachments = array_values(array_filter(array_map(static function ($file) {
        return $file['path'] ?? '';
    }, $stored_files)));
    wp_mail($recipients, $subject, $message, [], $attachments);

    wp_send_json_success([
        'message' => 'Your LAAN request has been submitted.',
        'requestId' => (int) $wpdb->insert_id,
    ]);
}

add_action('wp_ajax_sitexcell_ui_laan_submit', 'sitexcell_ui_laan_submit');

function sitexcell_ui_laan_download(): void
{
    if (!sitexcell_ui_laan_is_admin()) {
        wp_die('You do not have permission to download LAAN files.');
    }

    $request_id = absint($_GET['id'] ?? 0);
    check_admin_referer('sitexcell_ui_laan_download_' . $request_id);

    global $wpdb;
    $request = $wpdb->get_row($wpdb->prepare('SELECT * FROM ' . sitexcell_ui_laan_table_name() . ' WHERE id = %d', $request_id));

    if (!$request) {
        wp_die('LAAN request not found.');
    }

    $files = json_decode((string) $request->files_json, true) ?: [];
    $paths = array_values(array_filter(array_map(static function ($file) {
        return $file['path'] ?? '';
    }, $files)));
    $path = $paths[0] ?? '';

    if ($path === '' || !file_exists($path)) {
        wp_die('The requested file is unavailable.');
    }

    nocache_headers();
    header('Content-Type: ' . (mime_content_type($path) ?: 'application/octet-stream'));
    header('Content-Disposition: attachment; filename="' . basename($path) . '"');
    header('Content-Length: ' . (string) filesize($path));
    readfile($path);
    exit;
}

add_action('admin_post_sitexcell_ui_laan_download', 'sitexcell_ui_laan_download');
