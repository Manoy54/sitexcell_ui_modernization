<?php
/**
 * Shared SiteXcell prototype footer.
 */

if (!defined('ABSPATH')) {
    exit;
}

$asset_url = SITEXCELL_UI_URL . 'assets/images/';
?>

<footer class="border-t border-sx-border bg-white text-sx-charcoal" aria-labelledby="footer-heading">
    <h2 id="footer-heading" class="sr-only">SiteXcell footer</h2>
    <div class="sx-container py-12 sm:py-14 lg:py-16">
        <div class="grid gap-10 border-b border-sx-border pb-12 lg:grid-cols-[1.3fr_0.8fr_0.8fr] lg:gap-16">
            <div>
                <img class="h-auto w-[200px]" src="<?php echo esc_url($asset_url . 'sitexcell-logo.png'); ?>" alt="SiteXcell" width="800" height="302" loading="lazy">
                <p class="sx-display mt-6 max-w-xl text-2xl leading-tight sm:text-3xl">Independent telecommunications property expertise.</p>
                <p class="mt-4 max-w-xl text-base leading-7 text-sx-muted-foreground">Advisory and management services for property owners and organisations, with assistance available Australia wide.</p>
            </div>

            <nav aria-label="Footer services">
                <h3 class="text-sm font-semibold text-sx-charcoal">Services</h3>
                <ul class="mt-4 space-y-3 text-sx-charcoal">
                    <li><a class="sx-footer-link" href="https://www.sitexcell.com.au/negotiating-a-new-lease/">Negotiating a new lease</a></li>
                    <li><a class="sx-footer-link" href="https://www.sitexcell.com.au/managing-access-to-your-property/">Managing property access</a></li>
                    <li><a class="sx-footer-link" href="https://www.sitexcell.com.au/understanding-land-access-activity-notices-laan/">Land Access Activity Notices</a></li>
                    <li><a class="sx-footer-link" href="https://www.sitexcell.com.au/strategy-advice/">Strategy and advice</a></li>
                </ul>
            </nav>

            <div>
                <h3 class="text-sm font-semibold text-sx-charcoal">Contact</h3>
                <a class="mt-4 block text-xl font-semibold transition-colors hover:text-sx-red" href="tel:1300748395">1300 748 395</a>
                <p class="mt-3 text-base leading-7 text-sx-muted-foreground">119 Willoughby Rd<br>Crows Nest NSW 2065</p>
                <a class="sx-text-link mt-4" href="#contact">Send an enquiry</a>
            </div>
        </div>

        <div class="flex flex-col gap-5 pt-7 text-xs text-sx-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <p>&copy; <?php echo esc_html(wp_date('Y')); ?> SiteXcell. UI modernization prototype.</p>
            <div class="flex flex-wrap gap-x-6 gap-y-3">
                <a class="hover:text-sx-charcoal" href="#about">About</a>
                <a class="hover:text-sx-charcoal" href="<?php echo esc_url(home_url('/' . SITEXCELL_UI_COSITER_LOGIN_SLUG . '/')); ?>">Co-Siter demo login</a>
                <a class="hover:text-sx-charcoal" href="https://www.sitexcell.com.au/disclaimer/">Disclaimer</a>
                <a class="hover:text-sx-charcoal" href="https://www.sitexcell.com.au/privacy-policy/">Privacy Policy</a>
            </div>
        </div>
    </div>
</footer>
