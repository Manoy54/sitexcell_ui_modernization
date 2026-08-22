<?php
if (!defined('ABSPATH')) {
    exit;
}
?>
    <div class="sx-laan-section-block sx-laan-review-block">
        <div class="sx-laan-section-title"><h3>Review before ready-to-submit</h3><p>Review the entered information before any authorised submission step.</p></div>
        <div id="readiness-status" data-testid="readiness-status" data-readiness-status class="sx-laan-readiness-status" role="status">Complete required details and confirmations to reach the ready-to-submit state.</div>
        <button type="submit" id="final-submit" data-testid="final-submit" class="sx-button sx-button-primary" disabled>Ready to submit · Prototype stop</button>
    </div>
    <div class="sx-laan-stage-actions">
        <span class="sx-laan-save-status" data-testid="save-status-stage-2" data-save-status role="status"></span>
        <button type="button" class="sx-button sx-button-outline" data-testid="restore-draft" data-restore-draft>Restore draft</button>
        <button type="button" class="sx-button sx-button-outline sx-laan-danger-button" data-testid="discard-draft" data-discard-draft>Discard draft</button>
    </div>
</section>
