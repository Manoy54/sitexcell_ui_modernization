<?php
/**
 * Standalone template for the LAAN Request modernization prototype.
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

<body <?php body_class('sitexcell-ui-prototype sx-laan-request-page'); ?>>

<?php wp_body_open(); ?>

<a class="sx-skip-link" href="#main-content">Skip to main content</a>

<?php
$navbar = SITEXCELL_UI_PATH . 'components/navbar/navbar.php';
$page   = SITEXCELL_UI_PATH . 'pages/laan-request/laan-request.php';
$footer = SITEXCELL_UI_PATH . 'components/footer/footer.php';

include $navbar;
include $page;
include $footer;
?>

<?php wp_footer(); ?>

</body>
</html>
