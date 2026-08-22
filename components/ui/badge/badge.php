<?php
/**
 * Shadcn-inspired badge rendered as a WordPress/PHP component.
 *
 * Expected variable: $badge_label.
 * Optional variable: $badge_variant (default, inverse).
 */

if (!defined('ABSPATH')) {
    exit;
}

$badge_variant = $badge_variant ?? 'default';
$badge_class   = 'inverse' === $badge_variant ? ' sx-badge-inverse' : '';
?>

<span class="sx-badge<?php echo esc_attr($badge_class); ?>">
    <span class="sx-badge-dot" aria-hidden="true"></span>
    <?php echo esc_html($badge_label); ?>
</span>

<?php unset($badge_label, $badge_variant, $badge_class); ?>
