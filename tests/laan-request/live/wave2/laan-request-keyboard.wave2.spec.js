import { expect, test } from '@playwright/test';
import { attachJson, openLaanForm, openPageTwo } from '../../support/form-helpers.js';
import { connectToAuthenticatedContext, installFinalSubmissionGuard } from '../../support/session.js';

async function captureTabSequence(page, startSelector, maximumTabs = 80) {
  await page.locator(startSelector).focus();
  const sequence = [];

  for (let index = 0; index < maximumTabs; index += 1) {
    const active = await page.evaluate(() => {
      const element = document.activeElement;
      return {
        id: element?.id || null,
        tag: element?.tagName || null,
        type: element?.getAttribute?.('type') || null,
        fieldId: element?.closest?.('.gfield')?.id || null,
        text: element?.textContent?.replace(/\s+/g, ' ').trim().slice(0, 80) || null,
      };
    });
    sequence.push(active);
    await page.keyboard.press('Tab');
  }

  return sequence;
}

function expectIdsInOrder(sequence, expectedIds) {
  const positions = expectedIds.map((id) => sequence.findIndex((entry) => entry.id === id));
  for (const position of positions) expect(position).toBeGreaterThanOrEqual(0);
  for (let index = 1; index < positions.length; index += 1) {
    expect(positions[index]).toBeGreaterThan(positions[index - 1]);
  }
}

test('Stage 1 and Stage 2 critical controls are keyboard reachable', async ({}, testInfo) => {
  const { browser, context, ownsBrowser } = await connectToAuthenticatedContext();
  const page = await context.newPage();
  const wasFinalSubmissionAttempted = await installFinalSubmissionGuard(page);

  try {
    await test.step('Stage 1 follows a logical keyboard order', async () => {
      await openLaanForm(page);
      const sequence = await captureTabSequence(page, '#input_1_11');

      expectIdsInOrder(sequence, [
        'input_1_11',
        'input_1_12',
        'input_1_40',
        'input_1_41',
        'choice_1_63_1',
        'gform_next_button_1_36',
      ]);
      await attachJson(testInfo, 'laan-stage-one-keyboard-order.json', { sequence });
      expect(wasFinalSubmissionAttempted()).toBe(false);
    });

    await test.step('Stage 2 controls and actions are keyboard reachable', async () => {
      await openPageTwo(page);
      const sequence = await captureTabSequence(page, '#input_1_58');

      await attachJson(testInfo, 'laan-stage-two-keyboard-order.json', { sequence });

      expectIdsInOrder(sequence, [
        'input_1_58',
        'input_1_18',
        'input_1_19',
        'input_1_83',
        'input_1_87',
        'input_1_22',
        'input_1_64',
        'input_1_49',
        'input_1_29_1',
        'input_1_45_1',
        'gform_submit_button_1',
      ]);
      expect(
        sequence.some((entry) =>
          entry.id === 'gform_browse_button_1_59' || entry.fieldId === 'field_1_59',
        ),
      ).toBe(true);
      expect(wasFinalSubmissionAttempted()).toBe(false);
    });

    expect(wasFinalSubmissionAttempted()).toBe(false);
  } finally {
    await page.close();
    if (ownsBrowser) await browser.close();
  }
});
