<?php
/**
 * About page adding value section.
 */

if (!defined('ABSPATH')) {
    exit;
}

$section_heading = SITEXCELL_UI_PATH . 'components/section-heading/section-heading.php';
$card_component  = SITEXCELL_UI_PATH . 'components/ui/feature-card/feature-card.php';
$value_items = [
    ['marker' => '01', 'title' => 'Commercial decisions', 'copy' => 'Make informed commercial decisions when dealing with carriers and their agents.'],
    ['marker' => '02', 'title' => 'Operational decisions', 'copy' => 'Understand access, activity and ongoing operational obligations before they affect the property.'],
    ['marker' => '03', 'title' => 'Specialist network', 'copy' => 'Access legal, valuation, technical and project-management support through our professional network.'],
    ['marker' => '04', 'title' => 'Lifecycle support', 'copy' => 'Receive support from initial negotiations through renewals, management, auditing, termination and make-good activities.'],
];
?>

<section class="sx-section border-y border-sx-border bg-sx-muted" aria-labelledby="value-title">
    <div class="sx-container">
        <div class="grid gap-7 lg:grid-cols-[0.82fr_1.18fr] lg:gap-16">
            <?php
            $section_eyebrow = 'End-to-end support';
            $section_title   = 'Adding value at every stage';
            $section_id      = 'value-title';
            include $section_heading;
            ?>
            <p class="text-lg leading-8 text-sx-muted-foreground sm:text-xl sm:leading-9">We work to unlock the potential of our clients' telecommunications sites and diminish their risk.</p>
        </div>

        <div class="mt-10 grid gap-4 md:grid-cols-2 lg:mt-12">
            <?php foreach ($value_items as $item) :
                $card_title       = $item['title'];
                $card_copy        = $item['copy'];
                $card_marker      = $item['marker'];
                $card_marker_type = 'number';
                include $card_component;
            endforeach; ?>
        </div>
    </div>
</section>
