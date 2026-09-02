import { chromium } from '@playwright/test';

let sharedBrowserPromise = null;

function launchOptions() {
  const headed = /^(1|true|yes)$/i.test(process.env.ACCESS_HEADED ?? '');
  const configuredSlowMo = Number(process.env.ACCESS_SLOW_MO ?? 0);
  const options = {
    channel: 'msedge',
    headless: !headed,
  };
  if (Number.isFinite(configuredSlowMo) && configuredSlowMo > 0) options.slowMo = configuredSlowMo;
  return options;
}

async function sharedBrowser() {
  // Playwright workers are separate processes, so this cache is worker-local;
  // each case still receives a fresh context to keep form state isolated.
  if (!sharedBrowserPromise) {
    sharedBrowserPromise = chromium.launch(launchOptions()).catch((error) => {
      sharedBrowserPromise = null;
      throw error;
    });
  }
  return sharedBrowserPromise;
}

export async function closeSharedAuthenticatedBrowser() {
  if (!sharedBrowserPromise) return;
  const browser = await sharedBrowserPromise;
  sharedBrowserPromise = null;
  if (browser.isConnected()) await browser.close();
}

export async function connectToAuthenticatedContext() {
  const cdpEndpoint = process.env.EDGE_CDP_ENDPOINT;
  const storageState = process.env.ACCESS_STORAGE_STATE;

  if (!cdpEndpoint && !storageState) {
    throw new Error(
      'An authenticated Access Request session is required. Set EDGE_CDP_ENDPOINT or ACCESS_STORAGE_STATE.',
    );
  }

  let browser;
  let context;
  let ownsBrowser = false;

  if (cdpEndpoint) {
    browser = await chromium.connectOverCDP(cdpEndpoint);
    context = browser.contexts()[0];
    if (!context) throw new Error('The connected Edge session has no browser context.');
  } else {
    browser = await sharedBrowser();
    context = await browser.newContext({ storageState });
  }

  return {
    browser,
    context,
    ownsBrowser,
    ownsContext: !cdpEndpoint,
  };
}
