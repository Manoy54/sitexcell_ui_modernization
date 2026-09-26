<?php if (!defined('ABSPATH')) { exit; } ?>
<div class="demo-page-heading"><div><p class="demo-eyebrow">Support</p><h1>Contact Us</h1><p>Preview the contact page without sending a message.</p></div></div>
<section class="demo-panel demo-contact-panel"><h2>Send an enquiry</h2><p>Demo only. No message is sent or stored.</p>
    <form data-demo-contact-form novalidate>
        <div class="demo-field-row"><label>First name <span aria-hidden="true">*</span><input name="first_name" required autocomplete="given-name"></label><label>Last name<input name="last_name" autocomplete="family-name"></label></div>
        <div class="demo-field-row"><label>Company<input name="company" autocomplete="organization"></label><label>Email <span aria-hidden="true">*</span><input name="email" type="email" required autocomplete="email"></label></div>
        <label>Phone<input name="phone" type="tel" autocomplete="tel"></label>
        <label>Message <span aria-hidden="true">*</span><textarea name="message" rows="6" required></textarea></label>
        <button class="demo-button demo-button-primary" type="button" data-demo-contact-preview>Preview only</button>
        <p role="status" aria-live="polite" data-demo-contact-status></p>
    </form>
</section>
