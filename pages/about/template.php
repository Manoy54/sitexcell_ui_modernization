<?php
/**
 * Standalone template for the SiteXcell UI Prototype.
 */

if (!defined('ABSPATH')) {
    exit;
}
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>

<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <?php wp_head(); ?>
</head>

<body <?php body_class('sitexcell-ui-prototype'); ?>>

<?php wp_body_open(); ?>

<a class="sx-skip-link" href="#main-content">Skip to main content</a>

<?php
$navbar     = SITEXCELL_UI_PATH . 'components/navbar/navbar.php';
$about_page = SITEXCELL_UI_PATH . 'pages/about/about.php';
$footer     = SITEXCELL_UI_PATH . 'components/footer/footer.php';

include $navbar;
include $about_page;
include $footer;
?>

<?php wp_footer(); ?>

</body>
</html>
