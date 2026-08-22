<?php
/**
 * Shadcn-inspired feature card rendered as a WordPress/PHP component.
 *
 * Expected variables: $card_title, $card_copy, $card_marker.
 * Optional variable: $card_marker_type (number, check).
 */

if (!defined('ABSPATH')) {
    exit;
}

$card_marker_type = $card_marker_type ?? 'number';
?>

<article class="sx-card sx-feature-card">
    <?php if ('check' === $card_marker_type) : ?>
        <span class="sx-card-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round">
                <path d="m5 12 4 4L19 6"></path>
            </svg>
        </span>
    <?php else : ?>
        <span class="sx-card-number" aria-hidden="true"><?php echo esc_html($card_marker); ?></span>
    <?php endif; ?>
    <h3><?php echo esc_html($card_title); ?></h3>
    <p><?php echo esc_html($card_copy); ?></p>
</article>

<?php unset($card_title, $card_copy, $card_marker, $card_marker_type); ?>
