import {
  ACCESS_FORM_DOM_ID,
  ACCESS_FORM_FIELDS,
  FINAL_SUBMIT_DOM_ID,
} from './selectors.js';

const ACCESS_REQUEST_PATH = '/access-requests/';

function requestValue(request, key) {
  return typeof request[key] === 'function' ? request[key]() : request[key];
}

export function isFinalAccessSubmission(request) {
  const method = requestValue(request, 'method');
  const requestUrl = requestValue(request, 'url');

  if (method !== 'POST' || new URL(requestUrl).pathname !== ACCESS_REQUEST_PATH) {
    return false;
  }

  const fields = new URLSearchParams(requestValue(request, 'postData') ?? '');
  const sourcePage = fields.get(ACCESS_FORM_FIELDS.sourcePage);
  const targetPage = fields.get(ACCESS_FORM_FIELDS.targetPage);

  return fields.has(ACCESS_FORM_FIELDS.submitButton)
    || (sourcePage === '8' && (!targetPage || targetPage === '0'));
}

export async function installFinalSubmissionGuard(page) {
  let networkAttempted = false;

  await page.addInitScript((formDescriptor) => {
    if (window.__accessRequestSubmitGuardInstalled) return;
    window.__accessRequestSubmitGuardInstalled = true;
    window.__accessRequestSubmitAttempted = false;

    document.addEventListener('click', (event) => {
      if (!event.target.closest?.(`#${formDescriptor.finalSubmitDomId}`)) return;
      window.__accessRequestSubmitAttempted = true;
      event.preventDefault();
      event.stopImmediatePropagation();
    }, true);

    document.addEventListener('submit', (event) => {
      if (event.target?.id !== formDescriptor.formDomId) return;
      const fields = new FormData(event.target);
      const sourcePage = fields.get(formDescriptor.sourcePageField);
      const targetPage = fields.get(formDescriptor.targetPageField);
      const explicitSubmit = event.submitter?.id === formDescriptor.finalSubmitDomId;
      if (!explicitSubmit && !(sourcePage === '8' && (!targetPage || targetPage === '0'))) return;
      window.__accessRequestSubmitAttempted = true;
      event.preventDefault();
      event.stopImmediatePropagation();
    }, true);
  }, {
    formDomId: ACCESS_FORM_DOM_ID,
    finalSubmitDomId: FINAL_SUBMIT_DOM_ID,
    sourcePageField: ACCESS_FORM_FIELDS.sourcePage,
    targetPageField: ACCESS_FORM_FIELDS.targetPage,
  });

  await page.route('**/*', async (route) => {
    if (isFinalAccessSubmission(route.request())) {
      networkAttempted = true;
      await route.abort('blockedbyclient');
      return;
    }

    await route.continue();
  });

  return async () => networkAttempted || page.evaluate(
    () => Boolean(window.__accessRequestSubmitAttempted),
  );
}
