import { activities, prototypeRules, sites } from './fixtures.js';

const state = {
  stage: 1,
  activity: '', commencementDate: '', owner: '', siteId: '', termsAccepted: false,
  access: { carrier: '', reference: '', tenantCompany: '', tenantContact: '', tenantPhone: '', tenantLocation: '', areasAccessed: '' },
  confirmations: { laanUploaded: false, informationAccurate: false, drawingsUploaded: false },
  uploads: { laan: '', additional: [] },
  savedDraft: null,
};

const $ = (selector) => document.querySelector(selector);
const siteById = (id) => sites.find((site) => site.id === id);

function setHidden(element, hidden) { element.hidden = hidden; }
function setText(selector, value) { $(selector).textContent = value; }
function selectedSite() { return siteById(state.siteId); }

function validDate(value) {
  if (!/^\d{2}-\d{2}-\d{4}$/.test(value)) return false;
  const [day, month, year] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}

function filteredSites() {
  const query = $('#site-search').value.trim().toLowerCase();
  const owner = $('#input_1_40').value;
  return sites.filter((site) => (!owner || site.owner === owner) && (!query || [site.name, site.address, site.owner, site.id].some((value) => value.toLowerCase().includes(query))));
}

function renderSiteResults() {
  const results = $('#site-results');
  results.replaceChildren();
  const matches = filteredSites();
  matches.forEach((site) => {
    const item = document.createElement('li');
    const button = document.createElement('button');
    button.type = 'button'; button.className = 'site-result'; button.role = 'option';
    button.innerHTML = `<strong>${site.name}</strong><small>${site.address} · ${site.owner}</small>`;
    button.addEventListener('click', () => chooseSite(site));
    item.append(button); results.append(item);
  });
  setHidden(results, matches.length === 0);
  $('#site-search').setAttribute('aria-expanded', String(matches.length > 0));
}

function chooseSite(site) {
  state.siteId = site.id; $('#input_1_41').value = site.id; $('#site-search').value = site.name;
  const selected = $('#selected-site');
  selected.innerHTML = `<strong>${site.name}</strong><span>${site.address}</span><small>Owner: ${site.owner} · Canonical Site ID: ${site.id}</small>`;
  setHidden(selected, false); setHidden($('#site-results'), true); $('#site-search').setAttribute('aria-expanded', 'false');
  setHidden($('#site-error'), true); updateContextSummary();
}

function renderOwners() {
  const owners = [...new Set(sites.map((site) => site.owner))];
  $('#input_1_40').insertAdjacentHTML('beforeend', owners.map((owner) => `<option value="${owner}">${owner}</option>`).join(''));
}

function stageOneErrors() {
  const errors = [];
  if (!state.activity) errors.push('Select the activity type.');
  if (!state.commencementDate) errors.push('Enter the Proposed Commencement Date of Activity.');
  else if (!validDate(state.commencementDate)) errors.push(`Enter a valid date in ${prototypeRules.dateFormat} format.`);
  if (!state.siteId) errors.push('Select a Site.');
  if (!state.termsAccepted) errors.push('Accept the Terms and Conditions before continuing.');
  return errors;
}

function renderStageErrors(errors = []) {
  const summary = $('#stage-one-errors');
  summary.innerHTML = errors.length ? `<strong>Review the following:</strong><ul>${errors.map((error) => `<li>${error}</li>`).join('')}</ul>` : '';
  setHidden(summary, errors.length === 0);
  const dateError = $('#date-error'); dateError.textContent = state.commencementDate && !validDate(state.commencementDate) ? `Enter a real calendar date in ${prototypeRules.dateFormat} format.` : ''; setHidden(dateError, !dateError.textContent);
  const siteError = $('#site-error'); siteError.textContent = state.siteId ? '' : 'Select a Site from the search results.'; setHidden(siteError, Boolean(state.siteId));
  const termsError = $('#terms-error'); termsError.textContent = state.termsAccepted ? '' : 'Accept the Terms and Conditions before continuing.'; setHidden(termsError, state.termsAccepted);
}

function updateContextSummary() {
  const site = selectedSite();
  $('#request-context-summary').innerHTML = `<div><small>Activity</small><strong>${state.activity || 'Not selected'}</strong></div><div><small>Commencement date</small><strong>${state.commencementDate || 'Not entered'}</strong></div><div><small>Site</small><strong>${site?.name || 'Not selected'}</strong></div>`;
}

function updateConditionalFields() {
  const maintenance = state.activity === 'Maintenance';
  setHidden($('#maintenance-confirmation'), !maintenance);
  $('#activity-notice').textContent = maintenance ? 'Maintenance requests may require a supporting drawings confirmation. Your existing values are preserved while you review the applicable requirement.' : '';
  setHidden($('#activity-notice'), !maintenance);
}

function readAccess() {
  state.access = {
    carrier: $('#input_1_58').value, reference: $('#input_1_18').value, tenantCompany: $('#input_1_19').value,
    tenantContact: $('#input_1_83').value, tenantPhone: $('#input_1_87').value, tenantLocation: $('#input_1_22').value, areasAccessed: $('#input_1_64').value,
  };
  state.confirmations.laanUploaded = $('#input_1_29_1').checked;
  state.confirmations.informationAccurate = $('#input_1_45_1').checked;
  state.confirmations.drawingsUploaded = $('#input_1_28_1').checked;
}

function writeAccess() {
  const values = [['#input_1_58','carrier'],['#input_1_18','reference'],['#input_1_19','tenantCompany'],['#input_1_83','tenantContact'],['#input_1_87','tenantPhone'],['#input_1_22','tenantLocation'],['#input_1_64','areasAccessed']];
  values.forEach(([selector, key]) => { $(selector).value = state.access[key]; });
  $('#input_1_29_1').checked = state.confirmations.laanUploaded; $('#input_1_45_1').checked = state.confirmations.informationAccurate; $('#input_1_28_1').checked = state.confirmations.drawingsUploaded;
}

function updateReadiness() {
  readAccess();
  const requiredAccess = Object.values(state.access).every((value) => value.trim());
  const ready = requiredAccess && Boolean(state.uploads.laan) && state.confirmations.laanUploaded && state.confirmations.informationAccurate && (state.activity !== 'Maintenance' || state.confirmations.drawingsUploaded);
  // The prototype can display readiness, but it must never expose an executable submission action.
  $('#final-submit').disabled = true;
  const status = $('#readiness-status'); status.textContent = ready ? 'Ready to submit: all prototype checks are complete. Submission is disabled in this prototype.' : 'Complete required details and confirmations to reach the ready-to-submit state.'; status.classList.toggle('ready', ready);
}

function renderUploadStatus() {
  const laan = $('#laan-file-status'); laan.textContent = state.uploads.laan ? `Selected: ${state.uploads.laan}` : 'No LAAN file selected.'; laan.classList.toggle('selected', Boolean(state.uploads.laan));
  const additional = $('#additional-file-status'); additional.textContent = state.uploads.additional.length ? `Selected: ${state.uploads.additional.join(', ')}` : 'No additional documents selected.'; additional.classList.toggle('selected', state.uploads.additional.length > 0);
}

function goToStage(stage) {
  state.stage = stage; setHidden($('#stage-1'), stage !== 1); setHidden($('#stage-2'), stage !== 2); $('#progress-stage-1').classList.toggle('active', stage === 1); $('#progress-stage-2').classList.toggle('active', stage === 2);
  if (stage === 2) { updateContextSummary(); updateConditionalFields(); updateReadiness(); }
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function snapshot() { return JSON.parse(JSON.stringify({ ...state, savedDraft: null })); }
function announce(message) { $('#save-status').textContent = message; $('#save-status-stage-2').textContent = message; }

$('#input_1_11').addEventListener('change', (event) => { state.activity = event.target.value; updateConditionalFields(); });
$('#input_1_12').addEventListener('input', (event) => { state.commencementDate = event.target.value; });
$('#input_1_40').addEventListener('change', (event) => { state.owner = event.target.value; renderSiteResults(); });
$('#site-search').addEventListener('input', renderSiteResults); $('#site-search').addEventListener('focus', renderSiteResults);
$('#choice_1_63_1').addEventListener('change', (event) => { state.termsAccepted = event.target.checked; });
$('#next-stage').addEventListener('click', () => { state.activity = $('#input_1_11').value; state.commencementDate = $('#input_1_12').value.trim(); state.owner = $('#input_1_40').value; state.termsAccepted = $('#choice_1_63_1').checked; const errors = stageOneErrors(); renderStageErrors(errors); if (!errors.length) goToStage(2); });
$('#edit-context').addEventListener('click', () => goToStage(1));
$('#save-draft').addEventListener('click', () => { state.savedDraft = snapshot(); announce('Draft saved in this prototype session.'); });
$('#restore-draft').addEventListener('click', () => { if (!state.savedDraft) { announce('No draft is available in this prototype session.'); return; } Object.assign(state, JSON.parse(JSON.stringify(state.savedDraft))); $('#input_1_11').value = state.activity; $('#input_1_12').value = state.commencementDate; $('#input_1_40').value = state.owner; $('#choice_1_63_1').checked = state.termsAccepted; const site = selectedSite(); if (site) chooseSite(site); writeAccess(); renderUploadStatus(); updateConditionalFields(); updateContextSummary(); updateReadiness(); announce('Draft restored. Review the values before continuing.'); });
$('#discard-draft').addEventListener('click', () => { state.savedDraft = null; announce('Prototype draft discarded.'); });
$('#laan-prototype-form').addEventListener('submit', (event) => event.preventDefault());
$('#input_1_49').addEventListener('change', (event) => { state.uploads.laan = event.target.files[0]?.name ?? ''; if (!state.uploads.laan) { state.confirmations.laanUploaded = false; $('#input_1_29_1').checked = false; } renderUploadStatus(); updateReadiness(); });
$('#additional-documents').addEventListener('change', (event) => { state.uploads.additional = [...event.target.files].map((file) => file.name); renderUploadStatus(); });
document.querySelectorAll('#stage-2 input, #stage-2 textarea').forEach((element) => element.addEventListener('input', updateReadiness));
document.querySelectorAll('#stage-2 input[type="checkbox"]').forEach((element) => element.addEventListener('change', updateReadiness));
$('#date-help').addEventListener('click', () => $('#date-help-text').classList.toggle('highlight-help'));

renderOwners(); updateContextSummary(); renderSiteResults();
window.laanPrototype = { state, sites, activities, validDate, chooseSite, goToStage };
