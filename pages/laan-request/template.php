<?php
/**
 * Full-viewport WordPress template for the native LAAN Request page.
 */

if (!defined('ABSPATH')) {
    exit;
}
?><!doctype html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <?php wp_head(); ?>
</head>
<body <?php body_class('sitexcell-laan-request-body'); ?>>
<?php
if (function_exists('wp_body_open')) {
    wp_body_open();
}

echo do_shortcode('[sitexcell_laan_request]');
wp_footer();
?>
</body>
</html>
