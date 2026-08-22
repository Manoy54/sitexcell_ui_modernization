<?php
if (!defined('ABSPATH')) {
    exit;
}
?>
<section class="sx-laan-stage sx-card" data-laan-stage="1" aria-labelledby="stage-1-title">
    <div class="sx-laan-stage-heading">
        <div><p class="sx-eyebrow">Step 1 of 2</p><h2 id="stage-1-title">Request context</h2></div>
        <strong>50%</strong>
    </div>
    <p class="sx-laan-stage-intro">Tell us what the LAAN Request concerns. The original form labels and sequence are retained while the experience is being modernized.</p>
    <div class="sx-laan-error-summary" data-testid="stage-one-errors" data-stage-one-errors role="alert" hidden></div>

    <div class="sx-laan-field-grid">
        <div class="sx-laan-field sx-laan-field-full">
            <label for="input_1_11">What type of activity does this LAAN relate to? <span aria-hidden="true">*</span></label>
            <select id="input_1_11" data-testid="activity-select" data-original-id="input_1_11" required>
                <option value="">Please Select</option>
                <option>Inspection</option>
                <option>Installation</option>
                <option>Maintenance</option>
            </select>
        </div>

        <div class="sx-laan-field sx-laan-field-full">
            <label for="input_1_12">Proposed Commencement Date of Activity <span aria-hidden="true">*</span></label>
            <input id="input_1_12" data-testid="commencement-date" data-original-id="input_1_12" inputmode="numeric" placeholder="dd-mm-yyyy" autocomplete="off" aria-describedby="date-error" required>
            <small class="sx-laan-help">Use DD-MM-YYYY. This date should align with the Proposed Commencement Date of Activity on the LAAN attached.</small>
            <p id="date-error" class="sx-laan-field-error" data-testid="date-error" hidden></p>
        </div>

        <div class="sx-laan-field sx-laan-field-full">
            <label for="input_1_40">Owner Name (Optional)</label>
            <select id="input_1_40" data-testid="owner-select" data-original-id="input_1_40">
                <option value="">Choose company name</option>
            </select>
            <small class="sx-laan-help">Use Owner Name to narrow the Site list, or search the Site directly.</small>
        </div>

        <div class="sx-laan-field sx-laan-field-full">
            <label for="site-search">Site name <span aria-hidden="true">*</span></label>
            <input id="site-search" data-testid="site-search" role="combobox" aria-controls="site-results" aria-expanded="false" autocomplete="off" placeholder="Search by Site name, address, owner, or identifier">
            <input id="input_1_41" data-testid="site-id" data-original-id="input_1_41" type="hidden">
            <ul id="site-results" data-testid="site-results" class="sx-laan-search-results" role="listbox" hidden></ul>
            <div id="selected-site" data-testid="selected-site" class="sx-laan-selected-site" hidden></div>
            <p id="site-error" class="sx-laan-field-error" data-testid="site-error" hidden></p>
        </div>
    </div>

    <div class="sx-laan-info-callout" data-testid="activity-notice" hidden></div>
    <label class="sx-laan-checkbox" for="choice_1_63_1">
        <input id="choice_1_63_1" data-testid="terms-checkbox" data-original-id="choice_1_63_1" type="checkbox">
        <span><strong>Acceptance of Terms and Conditions</strong><small>I accept the Terms and Conditions of the co-siter™ Portal.</small></span><em aria-hidden="true">*</em>
    </label>
    <p id="terms-error" class="sx-laan-field-error" data-testid="terms-error" hidden></p>

    <div class="sx-laan-stage-actions">
        <span class="sx-laan-save-status" data-testid="save-status" data-save-status role="status"></span>
        <button type="button" class="sx-button sx-button-outline" data-testid="save-draft" data-save-draft>Save draft</button>
        <button type="button" class="sx-button sx-button-primary" data-testid="next-stage" data-next-stage>Next</button>
    </div>
</section>
