<?php
/**
 * SiteXcell Insights page orchestrator.
 */

if (!defined('ABSPATH')) {
    exit;
}

$section_path = __DIR__ . '/sections/';
$sections = [];
$render_section = static function (string $section_file): void {
    if (file_exists($section_file)) {
        include $section_file;
    }
};
?>

<main id="main-content" class="overflow-hidden bg-white text-sx-foreground">
    <!-- Insights page content placeholder -->
</main>
