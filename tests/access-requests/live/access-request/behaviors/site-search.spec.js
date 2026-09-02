import { expect, test } from '@playwright/test';

import { accessCaseTitle } from '../../../support/case-catalog.js';
import { TEST_SITE, findTestSiteSelect } from '../../../support/form-helpers.js';
import { runLiveAccessCase } from '../../../support/live-case.js';

const SITE_FIELD = '#field_3_407';

async function siteOptions(siteSelect) {
  return siteSelect.locator('option').evaluateAll((items) => items
    .filter((item) => item.value)
    .map((item) => ({ label: item.textContent.trim(), value: item.value })));
}

test(accessCaseTitle('TC-AR-S01', 'characterizes partial-text Site search'), async ({}, testInfo) => {
  await runLiveAccessCase(testInfo, {
    caseId: 'TC-AR-S01',
    resultType: 'Characterization',
    expected: 'A Site search widget accepts partial text and exposes matching results, or the missing capability is explicit.',
    step: 1,
    branch: 'site-partial-search',
  }, async ({ page }) => {
    const siteSelect = await findTestSiteSelect(page);
    const searchInput = page.locator(`${SITE_FIELD} input[type="search"]:visible, ${SITE_FIELD} .chosen-search input:visible, ${SITE_FIELD} .select2-search__field:visible`).first();
    if (!await searchInput.count()) {
      return {
        status: 'NOT APPLICABLE',
        observed: 'The live Site control is a native select and exposes no partial-text search input.',
        stoppingPoint: 'Step 1 Site-control capability check',
        extra: {
          controlId: await siteSelect.getAttribute('id'),
          controlType: await siteSelect.evaluate((element) => element.type),
          optionCount: (await siteOptions(siteSelect)).length,
        },
      };
    }

    await searchInput.fill('CRM Carpenters');
    const matchingText = await page.locator(`${SITE_FIELD} :text-is("${TEST_SITE}"):visible`).count();
    expect(matchingText).toBeGreaterThan(0);
    return {
      observed: 'The Site search accepted partial text and exposed the dedicated test Site as a result.',
      stoppingPoint: 'Step 1 partial Site-search results',
      extra: { query: 'CRM Carpenters', matchingText },
    };
  });
});

test(accessCaseTitle('TC-AR-S02', 'selects an exact Site from similar names'), async ({}, testInfo) => {
  await runLiveAccessCase(testInfo, {
    caseId: 'TC-AR-S02',
    resultType: 'Acceptance',
    expected: 'An exact Site can be selected without confusing it with similarly prefixed options.',
    step: 1,
    branch: 'site-similar-results',
  }, async ({ page }) => {
    const siteSelect = await findTestSiteSelect(page);
    const options = await siteOptions(siteSelect);
    const similar = options.filter((item) => item.label.startsWith('Urban Utilities Site,'));
    expect(similar.length).toBeGreaterThanOrEqual(2);
    const target = similar[1];
    await siteSelect.selectOption(target.value);
    await expect(siteSelect).toHaveValue(target.value);
    await expect(siteSelect.locator('option:checked')).toHaveText(target.label);
    return {
      observed: `Selected the exact Site "${target.label}" from ${similar.length} similarly prefixed options.`,
      stoppingPoint: 'Step 1 after exact similar-name selection',
      extra: { similarOptionCount: similar.length, target },
    };
  });
});

test(accessCaseTitle('TC-AR-S03', 'supports keyboard-only Site selection'), async ({}, testInfo) => {
  await runLiveAccessCase(testInfo, {
    caseId: 'TC-AR-S03',
    resultType: 'Acceptance',
    expected: 'A keyboard user can focus the Site control and commit a non-empty Site value.',
    step: 1,
    branch: 'site-keyboard-selection',
  }, async ({ page }) => {
    const siteSelect = await findTestSiteSelect(page);
    const options = await siteOptions(siteSelect);
    const target = options[0];
    await siteSelect.focus();
    await siteSelect.press('Home');
    await siteSelect.press('ArrowDown');
    await siteSelect.press('Enter');
    await expect(siteSelect).toHaveValue(target.value);
    return {
      observed: `Keyboard navigation selected "${target.label}" and committed its canonical value.`,
      stoppingPoint: 'Step 1 after keyboard-only Site selection',
      extra: { keys: ['Home', 'ArrowDown', 'Enter'], target },
    };
  });
});

test(accessCaseTitle('TC-AR-S04', 'measures Site-selection effort'), async ({}, testInfo) => {
  await runLiveAccessCase(testInfo, {
    caseId: 'TC-AR-S04',
    resultType: 'Efficiency',
    expected: 'Site selection reports its option volume, interaction count, and elapsed browser time.',
    step: 1,
    branch: 'site-selection-effort',
  }, async ({ page }) => {
    const siteSelect = await findTestSiteSelect(page);
    const options = await siteOptions(siteSelect);
    const startedAt = Date.now();
    await siteSelect.selectOption({ label: TEST_SITE });
    await expect(siteSelect).toHaveValue(/.+/);
    const elapsedMs = Date.now() - startedAt;
    return {
      observed: `The dedicated Site was selected from ${options.length} options in one control interaction (${elapsedMs} ms browser time).`,
      stoppingPoint: 'Step 1 after measured Site selection',
      extra: {
        optionCount: options.length,
        controlInteractions: 1,
        typedCharacters: 0,
        elapsedMs,
        target: TEST_SITE,
      },
    };
  });
});
