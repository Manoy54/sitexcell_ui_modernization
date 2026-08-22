<?php
if (!defined('ABSPATH')) {
    exit;
}
?>
<section class="sx-laan-stage sx-card" data-laan-stage="2" aria-labelledby="stage-2-title" hidden>
    <div class="sx-laan-stage-heading">
        <div><p class="sx-eyebrow">Step 2 of 2</p><h2 id="stage-2-title">Access details and evidence</h2></div>
        <strong>100%</strong>
    </div>
    <div id="request-context-summary" data-testid="request-context-summary" class="sx-laan-context-summary"></div>
    <button type="button" class="sx-laan-text-button" data-testid="edit-context" data-edit-context>Edit request context</button>

    <div class="sx-laan-section-block">
        <div class="sx-laan-section-title"><h3>Access details</h3><p>Tell us how access will occur.</p></div>
        <div class="sx-laan-field-grid">
            <div class="sx-laan-field sx-laan-field-full"><label for="input_1_58">Registered Carrier Name <span aria-hidden="true">*</span></label><input id="input_1_58" data-testid="carrier-name" data-original-id="input_1_58" required></div>
            <div class="sx-laan-field"><label for="input_1_18">Carrier Project Reference <span aria-hidden="true">*</span></label><input id="input_1_18" data-testid="project-reference" data-original-id="input_1_18" required></div>
            <div class="sx-laan-field"><label for="input_1_19">Tenant Company Name <span aria-hidden="true">*</span></label><input id="input_1_19" data-testid="tenant-company" data-original-id="input_1_19" required></div>
            <div class="sx-laan-field"><label for="input_1_83">Tenant Contact Person <span aria-hidden="true">*</span></label><input id="input_1_83" data-testid="tenant-contact" data-original-id="input_1_83" required></div>
            <div class="sx-laan-field"><label for="input_1_87">Tenant Contact Number <span aria-hidden="true">*</span></label><input id="input_1_87" data-testid="tenant-phone" data-original-id="input_1_87" inputmode="tel" required></div>
            <div class="sx-laan-field"><label for="input_1_22">Tenant Location/Floor <span aria-hidden="true">*</span></label><input id="input_1_22" data-testid="tenant-location" data-original-id="input_1_22" required></div>
            <div class="sx-laan-field sx-laan-field-full"><label for="input_1_64">Areas to be Accessed <span aria-hidden="true">*</span></label><textarea id="input_1_64" data-testid="areas-accessed" data-original-id="input_1_64" rows="3" required></textarea></div>
        </div>
    </div>
