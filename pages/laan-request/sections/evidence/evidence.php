<?php
if (!defined('ABSPATH')) {
    exit;
}
?>
    <div class="sx-laan-section-block">
        <div class="sx-laan-section-title"><h3>Evidence</h3><p>Upload the LAAN and any additional supporting documents.</p></div>
        <p class="sx-laan-help">Prototype rule: PDF, DOC, DOCX, or TXT; maximum 20 MB. Files remain local to this browser session.</p>
        <div class="sx-laan-upload-card">
            <div><label for="input_1_49">LAAN upload <span aria-hidden="true">*</span></label><p class="sx-laan-help">Select the LAAN document that contains the commencement date.</p></div>
            <input id="input_1_49" data-testid="laan-upload" data-original-id="input_1_49" type="file" accept=".pdf,.doc,.docx,.txt">
            <p id="laan-file-status" data-testid="laan-file-status" class="sx-laan-upload-status">No LAAN file selected.</p>
        </div>
        <div class="sx-laan-upload-card">
            <div><label for="additional-documents">Additional documents</label><p class="sx-laan-help">Optional supporting documents.</p></div>
            <input id="additional-documents" data-testid="additional-uploads" type="file" multiple accept=".pdf,.doc,.docx,.txt">
            <p id="additional-file-status" data-testid="additional-file-status" class="sx-laan-upload-status">No additional documents selected.</p>
        </div>
    </div>
