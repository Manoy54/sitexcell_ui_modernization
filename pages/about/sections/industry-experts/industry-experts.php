<?php
/**
 * About page industry experts section.
 */

if (!defined('ABSPATH')) {
    exit;
}

$asset_url       = SITEXCELL_UI_URL . 'assets/images/';
$section_heading = SITEXCELL_UI_PATH . 'components/section-heading/section-heading.php';
?>

<section id="expertise" class="sx-section border-y border-sx-border bg-sx-muted" aria-labelledby="industry-title">
    <div class="sx-container grid items-center gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
        <div class="relative min-h-[22rem] overflow-hidden rounded-lg border border-sx-border bg-sx-border shadow-sm sm:min-h-[30rem]">
            <img
                class="absolute inset-0 h-full w-full object-cover"
                src="<?php echo esc_url($asset_url . 'industry-experts.jpg'); ?>"
                alt="Telecommunications infrastructure serving a regional property"
                width="980"
                height="653"
                loading="lazy"
            >
            <p class="absolute bottom-4 left-4 right-4 max-w-sm rounded-md border border-white/15 bg-sx-charcoal/95 px-5 py-4 text-sm font-medium leading-6 text-white shadow-lg">Specialist advice for complex property negotiations</p>
        </div>

        <div>
            <?php
            $section_eyebrow = 'Specialist capability';
            $section_title   = 'The industry experts';
            $section_id      = 'industry-title';
            $section_copy    = 'Telecommunications property negotiations are highly specialised, technical and fragmented across carriers, contractors, subcontractors and agents.';
            include $section_heading;
            ?>
            <p class="mt-6 text-lg leading-8 text-sx-muted-foreground">Our expert knowledge helps level the playing field for clients. Without specialised advice, property owners may face:</p>
            <ul class="mt-6 grid gap-3">
                <li class="sx-risk-item"><span>01</span>Substantial loss of revenue</li>
                <li class="sx-risk-item"><span>02</span>Missed revenue opportunities</li>
                <li class="sx-risk-item"><span>03</span>Long-term onerous operational and access obligations</li>
            </ul>
        </div>
    </div>
</section>
