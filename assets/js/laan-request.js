(() => {
  const root = document.querySelector('[data-laan-request-app]');

  if (!root) return;

  const sites = [
    { id: '4127303000264672008', name: 'The CRM Carpenters Test', address: 'Synthetic test address', owner: 'Synthetic Owner Pty Ltd' },
    { id: '4127303000264672009', name: 'Synthetic Installation Site', address: '1 Example Road, Sydney', owner: 'Synthetic Networks Pty Ltd' },
    { id: '4127303000264672010', name: 'Synthetic Maintenance Site', address: '2 Example Road, Melbourne', owner: 'Synthetic Networks Pty Ltd' },
  ];

  const state = {
    stage: 1,
    siteId: '',
    savedDraft: null,
    uploads: { laan: '', additional: [] },
  };

  const $ = (selector) => root.querySelector(selector);
  const $$ = (selector) => [...root.querySelectorAll(selector)];
  const setHidden = (element, hidden) => {
    if (element) element.hidden = hidden;
  };

  function validDate(value) {
    if (!/^\d{2}-\d{2}-\d{4}$/.test(value)) return false;

    const [day, month, year] = value.split('-').map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));

    return date.getUTCFullYear() === year
      && date.getUTCMonth() === month - 1
      && date.getUTCDate() === day;
  }

  function selectedSite() {
    return sites.find((site) => site.id === state.siteId);
  }

  function readContext() {
    return {
      activity: $('#input_1_11').value,
      commencementDate: $('#input_1_12').value.trim(),
      owner: $('#input_1_40').value,
      termsAccepted: $('#choice_1_63_1').checked,
    };
  }

  function readAccess() {
    return {
      carrier: $('#input_1_58').value.trim(),
      reference: $('#input_1_18').value.trim(),
      tenantCompany: $('#input_1_19').value.trim(),
      tenantContact: $('#input_1_83').value.trim(),
      tenantPhone: $('#input_1_87').value.trim(),
      tenantLocation: $('#input_1_22').value.trim(),
      areasAccessed: $('#input_1_64').value.trim(),
    };
  }

  function writeAccess(access) {
    const fields = {
      '#input_1_58': access.carrier,
      '#input_1_18': access.reference,
      '#input_1_19': access.tenantCompany,
      '#input_1_83': access.tenantContact,
      '#input_1_87': access.tenantPhone,
      '#input_1_22': access.tenantLocation,
      '#input_1_64': access.areasAccessed,
    };

    Object.entries(fields).forEach(([selector, value]) => {
      $(selector).value = value ?? '';
    });
  }

  function renderOwners() {
    const ownerSelect = $('#input_1_40');
    const owners = [...new Set(sites.map((site) => site.owner))];

    owners.forEach((owner) => {
      const option = document.createElement('option');
      option.value = owner;
      option.textContent = owner;
      ownerSelect.append(option);
    });
  }

  function renderSiteResults() {
    const results = $('#site-results');
    const query = $('#site-search').value.trim().toLowerCase();
    const owner = $('#input_1_40').value;
    const matches = sites.filter((site) => {
      const searchable = [site.name, site.address, site.owner, site.id].join(' ').toLowerCase();
      return (!owner || site.owner === owner) && (!query || searchable.includes(query));
    });

    results.replaceChildren();

    matches.forEach((site) => {
      const item = document.createElement('li');
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'sx-laan-search-result';
      button.setAttribute('role', 'option');
      button.dataset.siteId = site.id;

      const name = document.createElement('strong');
      name.textContent = site.name;
      const details = document.createElement('small');
      details.textContent = `${site.address} · ${site.owner}`;
      button.append(name, details);
      button.addEventListener('click', () => chooseSite(site));
      item.append(button);
      results.append(item);
    });

    setHidden(results, matches.length === 0);
    $('#site-search').setAttribute('aria-expanded', String(matches.length > 0));
  }

  function chooseSite(site) {
    state.siteId = site.id;
    $('#input_1_41').value = site.id;
    $('#site-search').value = site.name;
    $('#selected-site').replaceChildren();

    const name = document.createElement('strong');
    name.textContent = site.name;
    const address = document.createElement('span');
    address.textContent = site.address;
    const details = document.createElement('small');
    details.textContent = `Owner: ${site.owner} · Canonical Site ID: ${site.id}`;
    $('#selected-site').append(name, address, details);
    setHidden($('#selected-site'), false);
    setHidden($('#site-results'), true);
    $('#site-search').setAttribute('aria-expanded', 'false');
    renderContextErrors([]);
    updateContextSummary();
  }

  function contextErrors() {
    const context = readContext();
    const errors = [];

    if (!context.activity) errors.push('Select the activity type.');
    if (!context.commencementDate) errors.push('Enter the Proposed Commencement Date of Activity.');
    else if (!validDate(context.commencementDate)) errors.push('Enter a real date in DD-MM-YYYY format.');
    if (!state.siteId) errors.push('Select a Site from the search results.');
    if (!context.termsAccepted) errors.push('Accept the Terms and Conditions before continuing.');

    return errors;
  }

  function renderContextErrors(errors = contextErrors()) {
    const summary = $('[data-stage-one-errors]');
    summary.replaceChildren();

    if (errors.length) {
      const title = document.createElement('strong');
      title.textContent = 'Review the following:';
      const list = document.createElement('ul');
      errors.forEach((error) => {
        const item = document.createElement('li');
        item.textContent = error;
        list.append(item);
      });
      summary.append(title, list);
    }

    setHidden(summary, errors.length === 0);
    const dateInvalid = Boolean($('#input_1_12').value) && !validDate($('#input_1_12').value.trim());
    $('#date-error').textContent = dateInvalid ? 'Enter a real calendar date in DD-MM-YYYY format.' : '';
    setHidden($('#date-error'), !dateInvalid);
    $('#input_1_12').setAttribute('aria-invalid', String(dateInvalid));
    $('#site-error').textContent = state.siteId ? '' : 'Select a Site from the search results.';
    setHidden($('#site-error'), Boolean(state.siteId));
    $('#terms-error').textContent = $('#choice_1_63_1').checked ? '' : 'Accept the Terms and Conditions before continuing.';
    setHidden($('#terms-error'), $('#choice_1_63_1').checked);
  }

  function updateContextSummary() {
    const context = readContext();
    const site = selectedSite();
    const summary = $('#request-context-summary');
    summary.replaceChildren();

    [
      ['Activity', context.activity || 'Not selected'],
      ['Commencement date', context.commencementDate || 'Not entered'],
      ['Site', site?.name || 'Not selected'],
    ].forEach(([label, value]) => {
      const item = document.createElement('div');
      const itemLabel = document.createElement('small');
      itemLabel.textContent = label;
      const itemValue = document.createElement('strong');
      itemValue.textContent = value;
      item.append(itemLabel, itemValue);
      summary.append(item);
    });
  }

  function updateConditionalFields() {
    const maintenance = $('#input_1_11').value === 'Maintenance';
    setHidden($('[data-maintenance-confirmation]'), !maintenance);
    const notice = $('[data-testid="activity-notice"]');
    notice.textContent = maintenance
      ? 'Maintenance requests may require a supporting drawings confirmation. Existing values are preserved while you review the applicable requirement.'
      : '';
    setHidden(notice, !maintenance);
  }

  function updateUploadStatus() {
    const laanStatus = $('#laan-file-status');
    laanStatus.textContent = state.uploads.laan ? `Selected: ${state.uploads.laan}` : 'No LAAN file selected.';
    laanStatus.classList.toggle('is-selected', Boolean(state.uploads.laan));
    const additionalStatus = $('#additional-file-status');
    additionalStatus.textContent = state.uploads.additional.length
      ? `Selected: ${state.uploads.additional.join(', ')}`
      : 'No additional documents selected.';
    additionalStatus.classList.toggle('is-selected', state.uploads.additional.length > 0);
  }

  function updateReadiness() {
    const access = readAccess();
    const requiredAccessComplete = Object.values(access).every(Boolean);
    const confirmationsComplete = $('#input_1_29_1').checked
      && $('#input_1_45_1').checked
      && ($('#input_1_11').value !== 'Maintenance' || $('#input_1_28_1').checked);
    const ready = requiredAccessComplete && Boolean(state.uploads.laan) && confirmationsComplete;
    const submit = $('#final-submit');
    submit.disabled = true;
    $('#readiness-status').textContent = ready
      ? 'Ready to submit: all prototype checks are complete. Submission remains disabled in this prototype.'
      : 'Complete required details and confirmations to reach the ready-to-submit state.';
    $('#readiness-status').classList.toggle('is-ready', ready);
  }

  function setStage(stage) {
    state.stage = stage;
    $$('[data-laan-stage]').forEach((section) => setHidden(section, section.dataset.laanStage !== String(stage)));
    $$('[data-stage-indicator]').forEach((indicator) => indicator.classList.toggle('is-active', indicator.dataset.stageIndicator === String(stage)));
    if (stage === 2) {
      updateContextSummary();
      updateConditionalFields();
      updateReadiness();
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function announce(message) {
    $$('[data-save-status]').forEach((status) => {
      status.textContent = message;
    });
  }

  function snapshot() {
    return {
      context: readContext(),
      siteId: state.siteId,
      access: readAccess(),
      confirmations: {
        laanUploaded: $('#input_1_29_1').checked,
        informationAccurate: $('#input_1_45_1').checked,
        drawingsUploaded: $('#input_1_28_1').checked,
      },
      uploads: structuredClone(state.uploads),
    };
  }

  function restoreDraft() {
    if (!state.savedDraft) {
      announce('No draft is available in this prototype session.');
      return;
    }

    const draft = state.savedDraft;
    $('#input_1_11').value = draft.context.activity;
    $('#input_1_12').value = draft.context.commencementDate;
    $('#input_1_40').value = draft.context.owner;
    $('#choice_1_63_1').checked = draft.context.termsAccepted;
    state.siteId = draft.siteId;
    state.uploads = structuredClone(draft.uploads);
    writeAccess(draft.access);
    $('#input_1_29_1').checked = draft.confirmations.laanUploaded;
    $('#input_1_45_1').checked = draft.confirmations.informationAccurate;
    $('#input_1_28_1').checked = draft.confirmations.drawingsUploaded;

    const site = selectedSite();
    if (site) chooseSite(site);
    updateUploadStatus();
    updateConditionalFields();
    updateContextSummary();
    updateReadiness();
    announce('Draft restored. Review the values before continuing.');
  }

  $('#input_1_11').addEventListener('change', () => {
    updateConditionalFields();
    updateReadiness();
  });
  $('#input_1_40').addEventListener('change', renderSiteResults);
  $('#site-search').addEventListener('input', renderSiteResults);
  $('#site-search').addEventListener('focus', renderSiteResults);
  $('#choice_1_63_1').addEventListener('change', () => renderContextErrors([]));
  $('#input_1_49').addEventListener('change', (event) => {
    state.uploads.laan = event.target.files[0]?.name ?? '';
    if (!state.uploads.laan) $('#input_1_29_1').checked = false;
    updateUploadStatus();
    updateReadiness();
  });
  $('#additional-documents').addEventListener('change', (event) => {
    state.uploads.additional = [...event.target.files].map((file) => file.name);
    updateUploadStatus();
  });
  $('#laan-request-form').addEventListener('input', updateReadiness);
  $('#laan-request-form').addEventListener('change', updateReadiness);
  $('[data-next-stage]').addEventListener('click', () => {
    const errors = contextErrors();
    renderContextErrors(errors);
    if (!errors.length) setStage(2);
  });
  $('[data-edit-context]').addEventListener('click', () => setStage(1));
  $('[data-save-draft]').addEventListener('click', () => {
    state.savedDraft = snapshot();
    announce('Draft saved in this prototype session.');
  });
  $('[data-restore-draft]').addEventListener('click', restoreDraft);
  $('[data-discard-draft]').addEventListener('click', () => {
    state.savedDraft = null;
    announce('Prototype draft discarded.');
  });
  $('#laan-request-form').addEventListener('submit', (event) => event.preventDefault());

  renderOwners();
  updateConditionalFields();
  updateUploadStatus();
  updateContextSummary();
})();
