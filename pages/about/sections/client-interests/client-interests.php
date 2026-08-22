<?php
/**
 * About page client interests section.
 */

if (!defined('ABSPATH')) {
    exit;
}

$section_heading = SITEXCELL_UI_PATH . 'components/section-heading/section-heading.php';
?>

<section class="sx-section bg-white" aria-labelledby="positioning-title">
    <div class="sx-container grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:gap-16">
        <?php
        $section_eyebrow = 'Who we represent';
        $section_title   = 'Client interests come first';
        $section_id      = 'positioning-title';
        include $section_heading;
        ?>
        <div class="lg:pt-1">
            <p class="text-lg leading-8 text-sx-charcoal sm:text-xl sm:leading-9">
                SiteXcell acts for property trusts, international property management companies, government entities, utility companies, airport corporations, universities, investment banks, critical infrastructure owners and private landowners.
            </p>
            <p class="mt-5 text-base leading-7 text-sx-muted-foreground sm:text-lg sm:leading-8">
                We specialise in property-related negotiations, strategies and advice, acting exclusively for clients in their dealings with telecommunications carriers.
            </p>
            <ul class="mt-8 grid gap-3 sm:grid-cols-2">
                <li class="sx-card sx-principle-item"><span class="sx-card-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 4 4L19 6"></path></svg></span>A service free from conflicts of interest</li>
                <li class="sx-card sx-principle-item"><span class="sx-card-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 4 4L19 6"></path></svg></span>Commercial and operational priorities protected</li>
            </ul>
        </div>
    </div>
</section>
