<?php
/**
 * Standalone template for the SiteXcell Home UI Prototype.
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
$home_page  = SITEXCELL_UI_PATH . 'pages/home/home.php';
$footer     = SITEXCELL_UI_PATH . 'components/footer/footer.php';

include $navbar;
include $home_page;
include $footer;
?>

<?php wp_footer(); ?>

</body>
</html>
