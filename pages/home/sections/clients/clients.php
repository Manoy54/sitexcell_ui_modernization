<?php
/**
 * SiteXcell Home Clients (Who we help) section.
 */

if (!defined('ABSPATH')) {
    exit;
}

$logos = [
    '<svg class="logo-placeholder" viewBox="0 0 120 40"><circle cx="20" cy="20" r="12" fill="currentColor" opacity="0.8"/><text x="40" y="26" font-family="Arial" font-weight="bold" font-size="20">Jemena</text></svg>',
    '<svg class="logo-placeholder" viewBox="0 0 100 40"><text x="5" y="26" font-family="Arial" font-weight="bold" font-size="24">dexus</text></svg>',
    '<svg class="logo-placeholder" viewBox="0 0 120 40"><rect x="10" y="10" width="20" height="20" fill="currentColor" transform="rotate(45 20 20)" opacity="0.8"/><text x="45" y="26" font-family="Arial" font-weight="bold" font-size="20">AusNet</text></svg>',
    '<svg class="logo-placeholder" viewBox="0 0 150 40"><path d="M10 30 V10 L20 20 L30 10 V30" stroke="currentColor" stroke-width="3" fill="none"/><text x="40" y="26" font-family="Arial" font-weight="bold" font-size="18">MONASH</text></svg>',
    '<svg class="logo-placeholder" viewBox="0 0 150 40"><rect x="5" y="5" width="30" height="30" fill="currentColor" opacity="0.2"/><text x="45" y="26" font-family="Arial" font-weight="bold" font-size="16">NSW Transport</text></svg>',
    '<svg class="logo-placeholder" viewBox="0 0 160 40"><path d="M10 25 Q 20 15 30 25 T 50 25" stroke="currentColor" stroke-width="4" fill="none"/><text x="60" y="26" font-family="Arial" font-weight="bold" font-size="16">Sydney WATER</text></svg>',
    '<svg class="logo-placeholder" viewBox="0 0 100 40"><circle cx="20" cy="20" r="14" fill="currentColor" opacity="0.5"/><text x="40" y="26" font-family="Arial" font-weight="bold" font-size="22">ISPT</text></svg>',
    '<svg class="logo-placeholder" viewBox="0 0 110 40"><path d="M10 30 V15 A 5 5 0 0 1 20 15 V30 M20 30 V15 A 5 5 0 0 1 30 15 V30" stroke="currentColor" stroke-width="4" fill="none"/><text x="40" y="26" font-family="Arial" font-weight="bold" font-size="20">mirvac</text></svg>',
    '<svg class="logo-placeholder" viewBox="0 0 160 40"><circle cx="140" cy="20" r="10" fill="currentColor"/><text x="5" y="26" font-family="Arial" font-weight="bold" font-size="16">CITY OF SYDNEY</text></svg>'
];
$colors = [
    '#009CDF', '#333333', '#00A651', '#000000', '#002664', '#00A3E0', '#00B5E2', '#7BB13E', '#000000'
];
?>

<!-- Header -->
<div class="pt-24 pb-12 bg-white text-center">
    <h2 class="text-4xl md:text-5xl font-bold text-sx-red mb-4">Who we help</h2>
    <p class="text-lg text-sx-charcoal">We help property owners of all sizes and from all sectors of the economy.</p>
</div>

<!-- Infinite Marquee Section -->
<section class="pb-24 bg-white overflow-hidden">
    <!-- Masking gradients for smooth fade in/out on edges -->
    <div class="relative w-full max-w-[1600px] mx-auto marquee-container py-12">
        <div class="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
        <div class="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>
        
        <!-- Marquee Track (Double the items to ensure seamless loop) -->
        <div class="flex w-[200%] animate-marquee">
            <!-- Set 1 -->
            <div class="flex w-1/2 justify-around items-center px-8">
                <?php foreach ($logos as $index => $logo) : ?>
                    <div class="client-logo-wrapper mx-8 cursor-pointer shrink-0" style="color: <?php echo esc_attr($colors[$index]); ?>;">
                        <?php echo $logo; ?>
                    </div>
                <?php endforeach; ?>
            </div>
            <!-- Set 2 (Duplicate for loop) -->
            <div class="flex w-1/2 justify-around items-center px-8">
                <?php foreach ($logos as $index => $logo) : ?>
                    <div class="client-logo-wrapper mx-8 cursor-pointer shrink-0" style="color: <?php echo esc_attr($colors[$index]); ?>;">
                        <?php echo $logo; ?>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>
    </div>
</section>
