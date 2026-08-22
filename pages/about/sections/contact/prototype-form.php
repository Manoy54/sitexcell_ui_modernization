<?php
/**
 * Visual-only fallback used until a production form provider is configured.
 */

if (!defined('ABSPATH')) {
    exit;
}
?>

<form class="grid gap-6" data-prototype-form data-form-provider="prototype">
    <div class="grid gap-5 sm:grid-cols-2">
        <div>
            <label class="sx-form-label" for="sx-name">Name <span aria-hidden="true" class="text-sx-red">*</span></label>
            <input class="sx-form-control" id="sx-name" name="name" type="text" autocomplete="name" required>
        </div>
        <div>
            <label class="sx-form-label" for="sx-email">Email address <span aria-hidden="true" class="text-sx-red">*</span></label>
            <input class="sx-form-control" id="sx-email" name="email" type="email" autocomplete="email" required>
        </div>
        <div>
            <label class="sx-form-label" for="sx-position">Position</label>
            <input class="sx-form-control" id="sx-position" name="position" type="text" autocomplete="organization-title">
        </div>
        <div>
            <label class="sx-form-label" for="sx-phone">Phone number <span aria-hidden="true" class="text-sx-red">*</span></label>
            <input class="sx-form-control" id="sx-phone" name="phone" type="tel" autocomplete="tel" required>
        </div>
        <div>
            <label class="sx-form-label" for="sx-company">Company</label>
            <input class="sx-form-control" id="sx-company" name="company" type="text" autocomplete="organization">
        </div>
        <div>
            <label class="sx-form-label" for="sx-address">Property / building address</label>
            <input class="sx-form-control" id="sx-address" name="property_address" type="text" autocomplete="street-address">
        </div>
        <div>
            <label class="sx-form-label" for="sx-carrier">Carrier / infrastructure company</label>
            <select class="sx-form-control" id="sx-carrier" name="carrier">
                <option value="">Select an option</option>
                <option>Telstra</option>
                <option>Optus</option>
                <option>TPG / Vodafone</option>
                <option>NBN Co</option>
                <option>Other / unsure</option>
            </select>
        </div>
        <div>
            <label class="sx-form-label" for="sx-enquiry">Enquiry type</label>
            <select class="sx-form-control" id="sx-enquiry" name="enquiry_type">
                <option value="">Select an option</option>
                <option>New or existing lease</option>
                <option>Land access or activity notice</option>
                <option>Site management or access</option>
                <option>Unauthorised equipment</option>
                <option>Strategy and advice</option>
                <option>Other</option>
            </select>
        </div>
    </div>

    <div>
        <label class="sx-form-label" for="sx-message">Message <span aria-hidden="true" class="text-sx-red">*</span></label>
        <textarea class="sx-form-control min-h-[10.8rem] resize-y" id="sx-message" name="message" rows="6" required></textarea>
    </div>

    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p class="max-w-md text-xs leading-5 text-sx-muted-foreground">Fields marked * are required. This prototype does not send or store information.</p>
        <button class="sx-button sx-button-primary shrink-0" type="submit">
            Submit enquiry
            <svg class="ml-2 h-4 w-4" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"></path></svg>
        </button>
    </div>

    <p class="rounded-md border border-sx-border bg-sx-muted px-4 py-3 text-sm leading-6 text-sx-foreground" role="status" tabindex="-1" hidden data-form-status></p>
</form>
