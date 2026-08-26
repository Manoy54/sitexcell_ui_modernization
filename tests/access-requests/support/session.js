import { chromium } from '@playwright/test';

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
    const headed = /^(1|true|yes)$/i.test(process.env.ACCESS_HEADED ?? '');
    const configuredSlowMo = Number(process.env.ACCESS_SLOW_MO ?? 0);
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
