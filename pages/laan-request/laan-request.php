<?php
/**
 * LAAN Request page orchestrator.
 */

if (!defined('ABSPATH')) {
    exit;
}

$section_path = __DIR__ . '/sections/';
$sections = [
    'request-context/request-context.php',
    'access-details/access-details.php',
    'evidence/evidence.php',
    'confirmations/confirmations.php',
    'review/review.php',
];
$render_section = static function (string $section_file): void {
    include $section_file;
};
?>

<main id="main-content" class="sitexcell-ui-prototype sx-laan-page overflow-hidden bg-white text-sx-foreground" data-laan-request-app>
    <section class="sx-laan-hero">
        <div class="sx-container">
            <p class="sx-badge"><span class="sx-badge-dot"></span> Co-Siter portal prototype</p>
            <h1 class="sx-display">LAAN Request</h1>
            <p>Complete the request context, access details, and evidence before review.</p>
            <span class="sx-laan-prototype-badge">No submission in this prototype</span>
        </div>
    </section>

    <div class="sx-container sx-laan-workspace">
        <ol class="sx-laan-progress" aria-label="LAAN Request progress">
            <li class="is-active" data-stage-indicator="1"><span>1</span><div><strong>Request context</strong><small>Activity, date, and Site</small></div></li>
            <li data-stage-indicator="2"><span>2</span><div><strong>Access details and evidence</strong><small>Contacts, documents, and confirmations</small></div></li>
        </ol>

        <form id="laan-request-form" data-laan-request-form novalidate>
            <?php
            foreach ($sections as $section) {
                $render_section($section_path . $section);
            }
            unset($render_section);
            ?>
        </form>
    </div>
</main>
