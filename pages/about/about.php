<?php
/**
 * SiteXcell About page section orchestrator.
 */

if (!defined('ABSPATH')) {
    exit;
}

$section_path = __DIR__ . '/sections/';
$sections = [
    'hero/hero.php',
    'statistics/statistics.php',
    'client-interests/client-interests.php',
    'industry-experts/industry-experts.php',
    'maximising-returns/maximising-returns.php',
    'adding-value/adding-value.php',
    'leadership/leadership.php',
    'call-to-action/call-to-action.php',
    'contact/contact.php',
];
$render_section = static function (string $section_file): void {
    include $section_file;
};
?>

<main id="main-content" class="sitexcell-ui-prototype overflow-hidden bg-white text-sx-foreground">
    <?php
    foreach ($sections as $section) {
        $render_section($section_path . $section);
    }
    unset($render_section);
    ?>
</main>
