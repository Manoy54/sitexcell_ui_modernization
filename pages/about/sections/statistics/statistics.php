<?php
/**
 * About page statistics.
 */

if (!defined('ABSPATH')) {
    exit;
}

$stats = [
    ['value' => '8,000+', 'label' => 'access requests handled'],
    ['value' => '6,500+', 'label' => 'Land Access and Activity Notices'],
    ['value' => '>$9M', 'label' => 'in telco back rent identified'],
    ['value' => '100+', 'label' => 'years of combined team experience'],
];
?>

<section class="sx-section bg-sx-muted" aria-labelledby="credibility-title">
    <div class="sx-container">
        <div class="mx-auto max-w-3xl text-center">
            <p class="sx-badge"><span class="sx-badge-dot" aria-hidden="true"></span>Proven experience</p>
            <h2 id="credibility-title" class="sx-display mt-5 text-3xl leading-[1.12] text-sx-charcoal sm:text-4xl">Property access requests handled with client interests at the centre.</h2>
            <p class="mt-4 text-base leading-7 text-sx-muted-foreground sm:text-lg">Deep practical experience across telecommunications property, access, notices and commercial negotiations.</p>
        </div>

        <dl class="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <?php foreach ($stats as $stat) : ?>
                <div class="sx-card p-6 sm:p-7">
                    <dd class="sx-display text-4xl leading-none text-sx-charcoal"><?php echo esc_html($stat['value']); ?></dd>
                    <dt class="mt-3 text-sm leading-6 text-sx-muted-foreground"><?php echo esc_html($stat['label']); ?></dt>
                </div>
            <?php endforeach; ?>
        </dl>
    </div>
</section>
