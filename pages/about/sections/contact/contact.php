<?php
/**
 * About page contact section.
 */

if (!defined('ABSPATH')) {
    exit;
}

$form_adapter = __DIR__ . '/form-adapter.php';
?>

<section id="contact" class="sx-section bg-sx-muted" aria-labelledby="contact-title">
    <div class="sx-container">
        <div class="grid overflow-hidden rounded-lg border border-sx-border bg-white shadow-sm lg:grid-cols-[0.72fr_1.28fr]">
            <div class="bg-sx-charcoal p-7 text-white sm:p-9 lg:p-10">
                <span class="sx-badge sx-badge-inverse"><span class="sx-badge-dot" aria-hidden="true"></span>Start a conversation</span>
                <h2 id="contact-title" class="sx-display mt-5 text-3xl leading-tight sm:text-[2.5rem]">Get in touch</h2>
                <p class="mt-4 max-w-xl text-base leading-7 text-white/70 sm:text-lg sm:leading-8">Tell us about the property and the carrier activity involved. A SiteXcell professional can help clarify the next step.</p>

                <dl class="mt-8 border-t border-white/15">
                    <div class="border-b border-white/15 py-5">
                        <dt class="text-xs font-semibold uppercase text-white/45">Call</dt>
                        <dd class="mt-2"><a class="text-xl font-semibold hover:text-sx-red-light" href="tel:1300748395">1300 748 395</a></dd>
                    </div>
                    <div class="border-b border-white/15 py-5">
                        <dt class="text-xs font-semibold uppercase text-white/45">Australia wide</dt>
                        <dd class="mt-2 text-base leading-6 text-white/75">Adelaide, Brisbane, Sydney and Melbourne</dd>
                    </div>
                </dl>

                <div class="mt-8 rounded-md border border-white/15 bg-white/[0.04] p-5">
                    <p class="text-sm font-semibold">Before you enquire</p>
                    <p class="mt-2 text-sm leading-6 text-white/60">SiteXcell can only assist with proposed or existing telco leases or licences. We cannot market land or buildings to prospective telco carriers.</p>
                </div>
            </div>

            <div class="bg-white p-6 sm:p-8 lg:p-10">
                <?php include $form_adapter; ?>
            </div>
        </div>
    </div>
</section>
