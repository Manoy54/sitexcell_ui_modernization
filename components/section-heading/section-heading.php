<?php
/**
 * Section heading shared by prototype content bands.
 *
 * Expected variables: $section_eyebrow, $section_title, $section_id.
 * Optional variables: $section_copy, $section_inverse.
 */

if (!defined('ABSPATH')) {
    exit;
}

$section_copy    = $section_copy ?? '';
$section_inverse = $section_inverse ?? false;
$title_class     = $section_inverse ? 'text-white' : 'text-sx-charcoal';
$copy_class      = $section_inverse ? 'text-white/70' : 'text-sx-muted-foreground';
$badge_component = SITEXCELL_UI_PATH . 'components/ui/badge/badge.php';
?>

<div>
    <?php
    $badge_label   = $section_eyebrow;
    $badge_variant = $section_inverse ? 'inverse' : 'default';
    include $badge_component;
    ?>
    <h2 id="<?php echo esc_attr($section_id); ?>" class="sx-display mt-5 max-w-2xl text-3xl leading-[1.12] <?php echo esc_attr($title_class); ?> sm:text-4xl lg:text-[2.5rem]">
        <?php echo esc_html($section_title); ?>
    </h2>
    <?php if ($section_copy) : ?>
        <p class="mt-4 max-w-2xl text-base leading-7 <?php echo esc_attr($copy_class); ?> sm:text-lg sm:leading-8">
            <?php echo esc_html($section_copy); ?>
        </p>
    <?php endif; ?>
</div>

<?php
unset($section_copy, $section_inverse, $title_class, $copy_class, $badge_component);
?>
