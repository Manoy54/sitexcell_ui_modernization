import { chromium } from '@playwright/test';

export async function connectToAuthenticatedContext() {
  const cdpEndpoint = process.env.EDGE_CDP_ENDPOINT;
  const storageState = process.env.EDGE_STORAGE_STATE;

  if (!cdpEndpoint && !storageState) {
    throw new Error(
      'An authenticated session is required. Set EDGE_CDP_ENDPOINT, or set EDGE_STORAGE_STATE to a Playwright storage-state file.',
    );
  }

  let browser;
  let context;
  let ownsBrowser = false;

  if (cdpEndpoint) {
    try {
      browser = await chromium.connectOverCDP(cdpEndpoint);
    } catch (error) {
      const message = String(error?.message ?? error);
      if (message.includes('403 Forbidden')) {
        throw new Error(
          'Edge rejected the CDP WebSocket with 403 Forbidden. Use EDGE_STORAGE_STATE, or launch a separate Edge instance with a dedicated user-data directory and remote debugging enabled. Do not attach to the same profile concurrently.',
          { cause: error },
        );
      }
      throw error;
    }
    context = browser.contexts()[0];
    if (!context) {
      throw new Error('The connected Edge session has no browser context.');
    }
  } else {
    // Reuse the installed Microsoft Edge channel so the storage-state flow
    // does not require a separate Playwright Chromium download.
    const headed = /^(1|true|yes)$/i.test(process.env.LAN_HEADED ?? '');
    const configuredSlowMo = Number(process.env.LAN_SLOW_MO ?? 0);
    const launchOptions = {
      channel: 'msedge',
      headless: !headed,
    };

    if (Number.isFinite(configuredSlowMo) && configuredSlowMo > 0) {
      launchOptions.slowMo = configuredSlowMo;
    }

    browser = await chromium.launch(launchOptions);
    ownsBrowser = true;
    context = await browser.newContext({ storageState });
  }

  return { browser, context, ownsBrowser };
}

function isFinalSubmission(request) {
  if (request.method() !== 'POST' || !request.url().includes('/laan-requests/')) {
    return false;
  }

  const postData = request.postData() ?? '';
  return /(?:gform_submit=1|is_submit_1=1|gform_submit_button_1)/.test(postData);
}

export async function installFinalSubmissionGuard(page) {
  let finalSubmissionAttempted = false;

  await page.route('**/*', async (route) => {
    if (isFinalSubmission(route.request())) {
      finalSubmissionAttempted = true;
      await route.abort('blockedbyclient');
      return;
    }

    await route.continue();
  });

  return () => finalSubmissionAttempted;
}
