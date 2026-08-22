<?php
/**
 * About page maximising returns section.
 */

if (!defined('ABSPATH')) {
    exit;
}

$section_heading = SITEXCELL_UI_PATH . 'components/section-heading/section-heading.php';
$card_component  = SITEXCELL_UI_PATH . 'components/ui/feature-card/feature-card.php';
$return_items = [
    ['title' => 'Commercial potential', 'copy' => 'Identify the value held in new and existing telecommunications sites.'],
    ['title' => 'Transparent dealings', 'copy' => 'Keep carriers and their agents accountable throughout negotiations.'],
    ['title' => 'Renewal strategy', 'copy' => 'Approach existing agreements and renewals with specialist market knowledge.'],
    ['title' => 'Portfolio perspective', 'copy' => 'Apply informed advice across individual properties or larger portfolios.'],
];
?>

<section class="sx-section" aria-labelledby="returns-title">
    <div class="sx-container">
        <div class="grid gap-7 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16">
            <?php
            $section_eyebrow = 'Commercial outcomes';
            $section_title   = 'Maximising returns';
            $section_id      = 'returns-title';
            include $section_heading;
            ?>
            <p class="text-lg leading-8 text-sx-muted-foreground sm:text-xl sm:leading-9">
                From individual property owners to large portfolio holders, our advice and industry experience help clients maximise the commercial potential of a new or existing telecommunications site or asset.
            </p>
        </div>

        <div class="mt-10 grid gap-4 sm:grid-cols-2 lg:mt-12">
            <?php foreach ($return_items as $item) :
                $card_title       = $item['title'];
                $card_copy        = $item['copy'];
                $card_marker      = '';
                $card_marker_type = 'check';
                include $card_component;
            endforeach; ?>
        </div>
    </div>
</section>
