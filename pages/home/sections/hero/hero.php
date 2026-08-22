<?php
/**
 * Home page - Hero section.
 */

if (!defined('ABSPATH')) {
    exit;
}
?>

<section id="hero" class="relative w-full overflow-hidden bg-sx-muted/50 min-h-[calc(100vh-5rem)] flex items-center">
    <div class="sx-container relative z-10 grid lg:grid-cols-2 gap-12 lg:gap-8 items-center py-16 lg:py-0">
        <div class="max-w-xl">
            <div class="inline-flex items-center rounded-full border border-sx-red/20 bg-sx-red/5 px-3 py-1 text-sm font-medium text-sx-red mb-6">
                Australia's Leading Advisors
            </div>
            <h1 class="sx-display text-5xl sm:text-6xl lg:text-7xl text-sx-charcoal leading-[1.1] mb-6">
                Your telco property and lease <span class="text-transparent bg-clip-text bg-gradient-to-r from-sx-red to-sx-red-light">negotiation experts</span>
            </h1>
            <p class="text-lg sm:text-xl text-sx-muted-foreground mb-10 leading-relaxed font-medium">
                Working exclusively on behalf of property owners, siteXcell are Australia's leading telecommunications property advisors.
            </p>
            <div class="flex flex-col sm:flex-row gap-4">
                <a href="#contact" class="sx-button bg-sx-red text-white hover:bg-sx-red-dark border-transparent shadow-lg shadow-sx-red/20 h-12 px-8 text-base group">
                    Contact us for a better deal today
                    <svg class="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                </a>
                <a href="#services" class="sx-button bg-white text-sx-charcoal hover:bg-sx-muted border-sx-border h-12 px-8 text-base">
                    View our services
                </a>
            </div>
        </div>
    </div>
    
    <!-- Right side graphic/image -->
    <div class="hidden lg:block absolute top-0 right-0 w-1/2 h-full">
        <div class="absolute inset-0 bg-sx-charcoal" style="clip-path: polygon(15% 0, 100% 0, 100% 100%, 0% 100%);">
            <img src="<?php echo esc_url(SITEXCELL_UI_URL . 'assets/images/home-hero-bg.png'); ?>" alt="Telecommunication Cell Towers" class="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-luminosity hover:mix-blend-normal transition-all duration-700">
            <div class="absolute inset-0 bg-gradient-to-br from-sx-red/40 to-transparent mix-blend-overlay"></div>
        </div>
    </div>
</section>
