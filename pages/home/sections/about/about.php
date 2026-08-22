<?php
/**
 * SiteXcell Home About section (Our story & The difference).
 */

if (!defined('ABSPATH')) {
    exit;
}
?>

<section class="w-full max-w-7xl mx-auto px-4 md:px-8 mt-20 mb-24">
    <div class="flex flex-col lg:flex-row w-full gap-12 lg:gap-24">
        
        <!-- Left: Our Story -->
        <div class="w-full lg:w-1/2 flex flex-col justify-center">
            <div class="flex items-center gap-4 mb-4">
                <div class="w-12 h-px bg-sx-red"></div>
                <span class="text-sx-red font-semibold uppercase tracking-widest text-xs">About Us</span>
            </div>
            <h2 class="text-4xl md:text-5xl font-bold mb-6 text-sx-charcoal tracking-tight leading-tight">Our <span class="text-gray-400 font-light italic">story</span></h2>
            
            <div class="space-y-4 text-gray-600 text-base leading-relaxed font-light mb-8">
                <p class="text-sx-charcoal font-medium text-lg">
                    Since 2005, siteXcell has been supporting property owners in their dealings with telecommunications carriers.
                </p>
                <p>
                    Our clients include property trusts, international property management companies, government entities, utility companies, airport corporations, universities, critical infrastructure owners, investment banks and private landowners.
                </p>
                <p>
                    As Australia's only fully independent telecommunications consultancy and services firm we are committed to ensuring all of our actions and recommendations are done with our clients' best interests in mind.
                </p>
            </div>
            
            <a href="#" class="group inline-flex items-center justify-center w-fit px-6 py-3 border border-sx-charcoal text-sx-charcoal hover:bg-sx-charcoal hover:text-white font-semibold transition-all duration-300 hover:-translate-y-1 text-sm">
                Read full story
            </a>
        </div>
        
        <!-- Right: The siteXcell difference -->
        <div class="w-full lg:w-1/2 flex flex-col justify-center">
            <div class="flex items-center gap-4 mb-4">
                <div class="w-12 h-px bg-gray-300"></div>
                <span class="text-gray-500 font-semibold uppercase tracking-widest text-xs">Why Choose Us</span>
            </div>
            <h2 class="text-4xl md:text-5xl font-bold mb-6 text-sx-charcoal tracking-tight leading-tight">The <span class="text-sx-red font-light italic">difference</span></h2>
            
            <p class="text-gray-600 mb-8 leading-relaxed text-lg font-light">
                <strong class="text-sx-charcoal font-semibold">siteXcell is Australia's only fully independent telecommunications consultancy.</strong> We act exclusively for property owners and managers to get the best deal when negotiating with telecommunications carriers.
            </p>
            
            <div class="flex flex-col sm:flex-row gap-4 mb-10">
                <a href="#" class="inline-flex items-center justify-center w-fit px-6 py-3 bg-sx-red !text-white font-semibold hover:bg-red-700 transition-all duration-300 hover:-translate-y-1 text-sm">
                    What our customers say
                </a>
            </div>
            
            <!-- Floating Modern Document Card -->
            <div class="relative group cursor-pointer w-full max-w-[360px]">
                <div class="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-100 rounded-2xl transform translate-x-2 translate-y-2 transition-transform group-hover:translate-x-3 group-hover:translate-y-3"></div>
                <div class="relative bg-white border border-gray-100 p-4 rounded-2xl shadow-sm flex items-center gap-5 transform transition-transform group-hover:-translate-y-1">
                    <div class="w-16 h-24 bg-gray-100 rounded shadow-inner overflow-hidden flex-shrink-0 relative border border-gray-200">
                        <img src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0" alt="Document" class="w-full h-full object-cover opacity-90">
                        <div class="absolute inset-0 bg-gradient-to-b from-transparent to-black/30"></div>
                    </div>
                    <div>
                        <h3 class="font-bold text-base text-sx-charcoal mb-1">Capability Statement</h3>
                        <p class="text-xs text-gray-500 mb-2">2.4 MB PDF Document</p>
                        <span class="text-sx-red font-semibold text-xs group-hover:underline flex items-center gap-1">
                            Download Now
                            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                        </span>
                    </div>
                </div>
            </div>
            
        </div>
        
    </div>
</section>
