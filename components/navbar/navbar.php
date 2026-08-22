<?php
/**
 * Shared SiteXcell prototype navbar.
 */

if (!defined('ABSPATH')) {
    exit;
}

$asset_url = SITEXCELL_UI_URL . 'assets/images/';
$nav_items = [
    ['label' => 'Home', 'url' => '/sitexcell-home-prototype/'],
    ['label' => 'About', 'url' => '/sitexcell-about-prototype/'],
    ['label' => 'Advisory', 'url' => 'https://www.sitexcell.com.au/advisory/', 'has_dropdown' => true],
    ['label' => 'Agency', 'url' => 'https://www.sitexcell.com.au/telecommunications-management-agency/', 'has_dropdown' => true],
    ['label' => 'Clients', 'url' => 'https://www.sitexcell.com.au/private-land-owners/', 'has_dropdown' => true],
    ['label' => 'Insights', 'url' => 'https://www.sitexcell.com.au/insights/', 'has_dropdown' => false],
];
?>

<header class="sx-site-header sticky top-0 z-50 w-full border-b border-sx-border bg-white/90 backdrop-blur-md" data-site-header>
    <div class="sx-container flex h-20 items-center justify-between">
        
        <!-- Logo -->
        <div class="flex items-center gap-2">
            <a class="shrink-0" href="#about" aria-label="SiteXcell About page">
                <img class="h-auto w-[126px]" src="<?php echo esc_url($asset_url . 'sitexcell-logo.png'); ?>" alt="SiteXcell" width="800" height="302">
            </a>
        </div>

        <!-- Desktop Navigation -->
        <nav class="hidden md:flex items-center gap-8" aria-label="Primary navigation">
            <?php foreach ($nav_items as $item) : ?>
                <?php 
                    $is_active = false;
                    if ('About' === $item['label'] && is_page('sitexcell-about-prototype')) {
                        $is_active = true;
                    } elseif ('Home' === $item['label'] && is_page('sitexcell-home-prototype')) {
                        $is_active = true;
                    }
                ?>
                <a class="text-sm font-semibold transition-colors flex items-center gap-1 <?php echo $is_active ? 'text-sx-red' : 'text-sx-charcoal hover:text-sx-red'; ?>" href="<?php echo esc_url($item['url']); ?>">
                    <?php echo esc_html($item['label']); ?>
                    <?php if (!empty($item['has_dropdown'])) : ?>
                        <svg class="w-4 h-4 text-sx-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                    <?php endif; ?>
                </a>
            <?php endforeach; ?>
            <a class="sx-button bg-sx-red text-white hover:bg-sx-red-dark border-transparent shadow-md hover:shadow-lg rounded-md px-6 ml-2" href="#contact">
                Contact
            </a>
        </nav>

        <!-- Mobile Menu Toggle -->
        <button class="sx-icon-button justify-self-end md:hidden flex items-center justify-center p-2 text-sx-charcoal" type="button" aria-expanded="false" aria-controls="site-mobile-menu" data-mobile-menu-toggle>
            <span class="sr-only">Open navigation menu</span>
            <svg aria-hidden="true" class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <path d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
        </button>
    </div>

    <!-- Mobile Navigation -->
    <nav id="site-mobile-menu" class="border-t border-sx-border bg-white px-5 py-4 shadow-lg md:hidden" aria-label="Mobile navigation" hidden data-mobile-menu>
        <div class="mx-auto grid max-w-7xl gap-1">
            <?php foreach ($nav_items as $item) : ?>
                <?php 
                    $is_active = false;
                    if ('About' === $item['label'] && is_page('sitexcell-about-prototype')) {
                        $is_active = true;
                    } elseif ('Home' === $item['label'] && is_page('sitexcell-home-prototype')) {
                        $is_active = true;
                    }
                ?>
                <a class="flex min-h-11 items-center border-b border-sx-border text-sm font-medium transition-colors last:border-b-0 <?php echo $is_active ? 'text-sx-red' : 'text-sx-foreground hover:text-sx-charcoal'; ?>" href="<?php echo esc_url($item['url']); ?>">
                    <?php echo esc_html($item['label']); ?>
                </a>
            <?php endforeach; ?>
            <div class="mt-4 grid gap-3">
                <a class="sx-button bg-sx-red text-white hover:bg-sx-red-dark w-full justify-center" href="#contact">Contact</a>
            </div>
        </div>
    </nav>
</header>
