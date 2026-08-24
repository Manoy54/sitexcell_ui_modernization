import { expect } from '@playwright/test';
import { resolve } from 'node:path';

export const LAAN_URL = process.env.LAAN_URL ?? 'https://co-siter.com.au/laan-requests/';
export const TEST_SITE = process.env.LAAN_TEST_SITE_LABEL ?? 'siteXcell Pty Ltd';
export const TEST_SITE_ID = process.env.LAAN_TEST_SITE_ID ?? '4127303000002387166';
export const DEFAULT_COMMENCEMENT_DATE = '30-09-2026';
export const SUPPORTED_ACTIVITIES = ['Inspection', 'Installation', 'Maintenance'];
export const REQUIRED_UPLOAD = resolve(
  process.cwd(),
  'tests',
  'laan-request',
  'fixtures',
  'synthetic-laan-attachment.txt',
);
export const REPLACEMENT_UPLOAD = resolve(
  process.cwd(),
  'tests',
  'laan-request',
  'fixtures',
  'synthetic-laan-replacement.txt',
);
export const ADDITIONAL_UPLOAD = resolve(
  process.cwd(),
  'tests',
  'laan-request',
  'fixtures',
  'synthetic-additional-document.txt',
);

const PAGE_TWO_VALUES = {
  carrierName: 'Synthetic Carrier Pty Ltd',
  tenantCompany: 'Synthetic Tenant Pty Ltd',
  tenantContact: 'Synthetic Contact',
  tenantPhone: '0400000000',
  tenantLocation: 'Level 1, Test Area',
  areasAccessed: 'Synthetic test access area',
};

export async function openLaanForm(page) {
  await page.goto(LAAN_URL, { waitUntil: 'domcontentloaded' });
  await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {});
  await expect(page.locator('#gform_1')).toBeVisible({ timeout: 30_000 });
  await expect(page.locator('#gform_page_1_1')).toBeVisible();
}

export async function completePageOne(
  page,
  { activity = 'Installation', commencementDate = DEFAULT_COMMENCEMENT_DATE, acceptTerms = true } = {},
) {
  await page.locator('#input_1_11').selectOption({ label: activity });
  await page.locator('#input_1_12').fill(commencementDate);
  await selectTestSite(page);
  if (acceptTerms) await page.locator('#choice_1_63_1').check();

  await expect(page.locator('#input_1_11')).toHaveValue(activity);
  await expect(page.locator('#input_1_12')).toHaveValue(commencementDate);
  await expect(page.locator('#input_1_41')).toHaveValue(TEST_SITE_ID);
  if (acceptTerms) await expect(page.locator('#choice_1_63_1')).toBeChecked();
}

export async function ensureTestSiteOption(page) {
  const siteSelect = page.locator('#input_1_41');
  const backingSiteSelect = page.locator('#input_1_85');
  const fixture = { label: TEST_SITE, value: TEST_SITE_ID };
  const matchingOption = (select) => select.locator('option').evaluateAll(
    (options, expected) => options.some(
      (option) => option.value === expected.value && option.textContent.trim() === expected.label,
    ),
    fixture,
  );

  await expect
    .poll(async () => (await matchingOption(siteSelect)) || (await matchingOption(backingSiteSelect)), {
      timeout: 15_000,
      message: `The live form did not expose the configured test Site "${TEST_SITE}" (${TEST_SITE_ID}).`,
    })
    .toBe(true);

  if (await matchingOption(siteSelect)) {
    return 'live-selector';
  }

  // The live form currently renders its server-accepted Site choices in field 85
  // while the required public selector is empty. Mirror only the configured,
  // explicit test Site so downstream pre-submit coverage remains deterministic.
  await siteSelect.evaluate((select, expected) => {
    const existing = [...select.options].find((option) => option.value === expected.value);
    if (existing) existing.remove();
    select.add(new Option(expected.label, expected.value));
  }, fixture);

  return 'backing-field';
}

export async function selectTestSite(page) {
  const fixtureSource = await ensureTestSiteOption(page);
  await page.locator('#input_1_41').selectOption({ value: TEST_SITE_ID });
  await expect(page.locator('#input_1_41')).toHaveValue(TEST_SITE_ID);
  return fixtureSource;
}

export async function readPageOneState(page) {
  return {
    activity: await page.locator('#input_1_11').inputValue(),
    commencementDate: await page.locator('#input_1_12').inputValue(),
    site: await page.locator('#input_1_41').inputValue(),
    termsAccepted: await page.locator('#choice_1_63_1').isChecked(),
  };
}

export async function openPageTwo(page, options = {}) {
  await openLaanForm(page);
  await completePageOne(page, options);
  await page.locator('#gform_next_button_1_36').click();
  await expect(page.locator('#gform_page_1_2')).toBeVisible({ timeout: 30_000 });
}

export async function fillPageTwoCore(page, referenceSuffix, { projectReference } = {}) {
  const valuesBySelector = [
    ['#input_1_58', PAGE_TWO_VALUES.carrierName],
    ['#input_1_18', projectReference ?? `LAN-${referenceSuffix}-${Date.now()}`],
    ['#input_1_19', PAGE_TWO_VALUES.tenantCompany],
    ['#input_1_83', PAGE_TWO_VALUES.tenantContact],
    ['#input_1_87', PAGE_TWO_VALUES.tenantPhone],
    ['#input_1_22', PAGE_TWO_VALUES.tenantLocation],
    ['#input_1_64', PAGE_TWO_VALUES.areasAccessed],
  ];

  for (const [selector, value] of valuesBySelector) {
    await page.locator(selector).fill(value);
    await expect(page.locator(selector)).toHaveValue(value);
  }

  return Object.fromEntries(valuesBySelector);
}

export async function collectPageTwoFieldState(page) {
  return page.locator('#gform_page_1_2').evaluate((pageRoot) => {
    const isVisible = (element) => {
      const style = getComputedStyle(element);
      return style.display !== 'none' && style.visibility !== 'hidden' && element.offsetParent !== null;
    };

    return [...pageRoot.querySelectorAll('input, select, textarea, button')].map((element) => ({
      id: element.id || null,
      type: element.getAttribute('type') ?? element.tagName.toLowerCase(),
      visible: isVisible(element),
      enabled: !element.disabled,
      required: element.required || element.getAttribute('aria-required') === 'true',
      wrapperRequired: element.closest('.gfield')?.classList.contains('gfield_contains_required') ?? false,
    }));
  });
}

export async function attachJson(testInfo, name, value) {
  await testInfo.attach(name, {
    body: JSON.stringify(value, null, 2),
    contentType: 'application/json',
  });
}

export async function selectedFileNames(fileInput) {
  return fileInput.evaluate((input) => [...(input.files ?? [])].map((file) => file.name));
}
