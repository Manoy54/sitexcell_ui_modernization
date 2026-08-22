<?php
/**
 * SiteXcell Home Sectors section.
 */

if (!defined('ABSPATH')) {
    exit;
}

$sectors = [
    [
        'title' => 'Private land owners',
        'text' => 'Are you feeling pressured to agree to a carrier\'s terms? Let siteXcell deal on your behalf. We can secure a better outcome to suit your commercial and operational needs.',
        'img' => 'https://images.unsplash.com/photo-1500382017468-9049fed747ef' // Farmer/field
    ],
    [
        'title' => 'REITS & Investment Banks',
        'text' => 'siteXcell removes the burden of dealing with telecommunications carriers. We create a portfolio-wide solution tailored to your distinctive commercial growth strategy.',
        'img' => 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf' // Corporate
    ],
    [
        'title' => 'Critical infrastructure',
        'text' => 'The unique location of infrastructure assets makes them highly attractive to carriers. As specialists in establishing fair market value, siteXcell achieves optimal commercial outcomes for infrastructure owners.',
        'img' => 'https://images.unsplash.com/photo-1517420704952-d9f39e95b43e' // Infrastructure
    ],
    [
        'title' => 'Government & education',
        'text' => 'Government and education property holdings are appealing location for carriers. At siteXcell, we can assist with asset-specific advice as well as the overall needs of your portfolio.',
        'img' => 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1' // University
    ]
];
?>

<div class="w-full overflow-hidden">
    <!-- Reduced height by ~30%: h-[420px] md:h-[350px] lg:h-[450px] -->
    <section class="flex flex-col md:flex-row w-full h-[420px] md:h-[350px] lg:h-[450px] bg-sx-charcoal">
        <?php foreach ($sectors as $sector): ?>
            <div class="accordion-panel relative group" style="background-image: url('<?php echo $sector['img']; ?>');">
                <div class="accordion-overlay"></div>
                <div class="accordion-content text-center md:text-left z-10 p-4 md:p-6 lg:p-8">
                    <h3 class="text-xl lg:text-2xl font-bold text-white mb-2 leading-tight drop-shadow-md">
                        <?php echo esc_html($sector['title']); ?>
                    </h3>
                    <div class="accordion-text">
                        <p class="text-gray-200 text-sm lg:text-base leading-relaxed mb-4 max-w-sm mx-auto md:mx-0">
                            <?php echo esc_html($sector['text']); ?>
                        </p>
                        <a href="#" class="inline-block px-5 py-2 bg-white text-sx-charcoal font-semibold text-sm rounded hover:bg-gray-100 transition-colors">
                            Learn more
                        </a>
                    </div>
                </div>
            </div>
        <?php endforeach; ?>
    </section>
</div>

<!-- Reduced padding for CTA wrapper: py-6 instead of py-10 -->
<section class="py-6 bg-sx-red text-center">
    <div class="max-w-4xl mx-auto px-4">
        <h2 class="text-2xl md:text-3xl font-bold text-white mb-3">Get a better deal on your telco lease today</h2>
        <p class="text-white/90 text-base md:text-lg mb-6">Independent advice from Australia's leading experts in property related telecommunications equipment lease negotiations.</p>
        <a href="#" class="inline-block px-8 py-3 bg-white text-sx-charcoal font-bold rounded shadow-lg hover:bg-gray-100 transition-colors">
            Contact us now
        </a>
    </div>
</section>
