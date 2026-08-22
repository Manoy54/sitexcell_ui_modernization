<?php
/**
 * About page leadership section.
 */

if (!defined('ABSPATH')) {
    exit;
}

$asset_url       = SITEXCELL_UI_URL . 'assets/images/';
$section_heading = SITEXCELL_UI_PATH . 'components/section-heading/section-heading.php';
?>

<section class="sx-section bg-white" aria-labelledby="leadership-title">
    <div class="sx-container">
        <div class="grid gap-7 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <?php
            $section_eyebrow = 'Our people';
            $section_title   = 'Experienced leadership';
            $section_id      = 'leadership-title';
            include $section_heading;
            ?>
            <div class="space-y-5 text-base leading-8 text-sx-muted-foreground sm:text-lg">
                <p>Our team are experts in understanding and negotiating the telecommunications property sector, with a professional approach designed to add value for clients.</p>
                <p>With offices in Adelaide, Brisbane, Sydney and Melbourne, we can meet and assist clients anywhere in Australia.</p>
            </div>
        </div>

        <div class="mt-10 grid gap-4 sm:grid-cols-2 lg:mt-12">
            <article class="sx-card sx-leader">
                <img src="<?php echo esc_url($asset_url . 'lisa-hall.jpg'); ?>" alt="Lisa Hall, Managing Director" width="300" height="302" loading="lazy">
                <div>
                    <p class="sx-card-number">Leadership</p>
                    <h3>Lisa Hall</h3>
                    <p>Managing Director</p>
                </div>
            </article>
            <article class="sx-card sx-leader">
                <img src="<?php echo esc_url($asset_url . 'wayne-sander.jpg'); ?>" alt="Wayne Sander, Director Client Advisory Services" width="300" height="300" loading="lazy">
                <div>
                    <p class="sx-card-number">Leadership</p>
                    <h3>Wayne Sander</h3>
                    <p>Director Client Advisory Services</p>
                </div>
            </article>
        </div>
    </div>
</section>
