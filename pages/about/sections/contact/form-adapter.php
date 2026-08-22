<?php
/**
 * Select the configured contact form provider.
 */

if (!defined('ABSPATH')) {
    exit;
}

$gravity_form_id = function_exists('sitexcell_ui_contact_form_id')
    ? sitexcell_ui_contact_form_id()
    : 0;

if ($gravity_form_id > 0 && function_exists('gravity_form')) {
    ?>
    <div class="sx-gravity-form" data-form-provider="gravity-forms">
        <?php gravity_form($gravity_form_id, false, false, false, null, true, 0, true); ?>
    </div>
    <?php
} else {
    include __DIR__ . '/prototype-form.php';
}
