<?php
/**
 * About page hero.
 */

if (!defined('ABSPATH')) {
    exit;
}

$asset_url = SITEXCELL_UI_URL . 'assets/images/';
$badge_component = SITEXCELL_UI_PATH . 'components/ui/badge/badge.php';
?>

<section id="about" class="border-b border-sx-border bg-white" aria-labelledby="about-title">
    <div class="sx-container py-12 sm:py-14 lg:py-16">
        <div class="mx-auto max-w-4xl text-center">
            <?php
            $badge_label = 'Australia wide';
            include $badge_component;
            ?>
            <p class="mt-4 text-sm font-medium leading-6 text-sx-muted-foreground">Independent telecommunications property advice.</p>
            <h1 id="about-title" class="sx-display mt-6 text-[2.75rem] leading-[1.04] text-sx-charcoal sm:text-5xl lg:text-[4rem]">About SiteXcell</h1>
            <p class="mx-auto mt-5 max-w-3xl text-lg leading-8 text-sx-muted-foreground sm:text-xl sm:leading-9">
                Australia's leading telecommunications consultancy and services firm, protecting clients' commercial and operational interests in every carrier negotiation.
            </p>
            <div class="mt-8 flex flex-col justify-center gap-3 sm:flex-row sm:items-center">
                <a class="sx-button sx-button-primary" href="#contact">
                    Talk to an expert
                    <svg class="ml-2 h-4 w-4" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"></path></svg>
                </a>
                <a class="sx-button sx-button-outline" href="#expertise">Explore our expertise</a>
            </div>
        </div>

        <div class="relative mt-10 h-56 overflow-hidden rounded-lg border border-sx-border bg-sx-muted shadow-sm sm:mt-12 sm:h-64 lg:h-72">
            <img
                class="h-full w-full object-cover object-center"
                src="<?php echo esc_url($asset_url . 'about-hero.jpg'); ?>"
                alt="Property consultants reviewing commercial information together"
                width="980"
                height="654"
                fetchpriority="high"
            >
            <div class="absolute inset-x-0 bottom-0 h-1 bg-sx-red" aria-hidden="true"></div>
        </div>
    </div>
</section>
