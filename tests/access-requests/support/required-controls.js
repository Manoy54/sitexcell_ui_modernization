import { expect } from '@playwright/test';

import { futureAccessDate } from '../fixtures/access-request-baseline.js';
import { STEP, nextButton } from './selectors.js';

export function syntheticValueForField(field, runId) {
  const type = String(field.type ?? 'text').toLowerCase();
  const label = String(field.label ?? '').toLowerCase();
  if (type === 'email' || label.includes('email')) return 'access.request@example.invalid';
  if (type === 'tel' || label.includes('phone') || label.includes('contact number')) return '0400000099';
  if (type === 'date' || label.includes('date')) return futureAccessDate(14);
  if (type === 'time' || label.includes('time')) return label.includes('end') ? '10:00' : '09:00';
  if (type === 'number') return String(field.min && Number(field.min) > 0 ? field.min : 1);
  if (label.includes('reference') || label.includes('laan id')) return runId;
  if (label.includes('address')) return '1 Synthetic Street, Redbank QLD 4301';
  if (label.includes('company')) return 'Synthetic Test Company';
  if (label.includes('name') || label.includes('person')) return 'Synthetic Access Tester';
  return 'Synthetic Access Request test value';
}

async function fieldLabel(field) {
  return field.locator('.gfield_label, legend').first().textContent().then((value) => value?.trim() ?? '');
}

async function isRequiredField(field) {
  return field.evaluate((element) => element.classList.contains('gfield_contains_required')
    || Boolean(element.querySelector('[required], [aria-required="true"], .gfield_required')));
}

export async function completeVisibleRequiredControls(page, stepNumber, {
  runId = process.env.ACCESS_RUN_ID ?? 'synthetic-access-request',
  uploadPath,
} = {}) {
  const step = page.locator(STEP[stepNumber]);
  await expect(step).toBeVisible();
  const fields = step.locator('.gfield:visible');
  const actions = [];

  for (let fieldIndex = 0; fieldIndex < await fields.count(); fieldIndex += 1) {
    const field = fields.nth(fieldIndex);
    if (!await isRequiredField(field)) continue;
    const label = await fieldLabel(field);
    const controls = field.locator('input, select, textarea');

    for (let controlIndex = 0; controlIndex < await controls.count(); controlIndex += 1) {
      const control = controls.nth(controlIndex);
      const type = String(await control.getAttribute('type') ?? await control.evaluate((element) => element.tagName.toLowerCase())).toLowerCase();
      if (type === 'hidden' || await control.isDisabled()) continue;
      const id = await control.getAttribute('id');

      if (type === 'radio') {
        if (await field.locator('input[type="radio"]:checked').count()) break;
        if (!await control.isVisible()) continue;
        await control.check();
        actions.push({ id, label, action: 'check', type });
        break;
      }

      if (type === 'checkbox') {
        if (await field.locator('input[type="checkbox"]:checked').count()) break;
        if (!await control.isVisible()) continue;
        await control.check();
        actions.push({ id, label, action: 'check', type });
        break;
      }

      if (type === 'file') {
        if (await control.evaluate((element) => element.files?.length > 0)) break;
        if (!uploadPath) continue;
        await control.setInputFiles(uploadPath);
        actions.push({ id, label, action: 'upload', type });
        break;
      }

      if (!await control.isVisible()) continue;
      const tagName = await control.evaluate((element) => element.tagName.toLowerCase());
      if (tagName === 'select') {
        if (await control.inputValue()) break;
        const options = await control.locator('option').evaluateAll((items) => items.map((item) => ({
          value: item.value,
          disabled: item.disabled,
        })));
        const option = options.find((item) => item.value && !item.disabled);
        if (!option) continue;
        await control.selectOption(option.value);
        actions.push({ id, label, action: 'select', type: 'select-one', value: option.value });
        break;
      }

      if (await control.inputValue()) continue;
      const value = syntheticValueForField({
        type,
        label,
        min: await control.getAttribute('min'),
      }, runId);
      await control.fill(value);
      actions.push({ id, label, action: 'fill', type, value });
    }
  }

  return actions;
}

export async function completeStepAndAdvance(page, stepNumber, options = {}) {
  const attempts = [];
  for (let attempt = 0; attempt < 5; attempt += 1) {
    attempts.push(...await completeVisibleRequiredControls(page, stepNumber, options));
    await nextButton(page, stepNumber).click();
    const nextStepVisible = await page.locator(STEP[stepNumber + 1]).isVisible().catch(() => false);
    if (nextStepVisible) return attempts;
    await expect(page.locator(STEP[stepNumber])).toBeVisible();
  }
  throw new Error(`Step ${stepNumber} did not advance after filling visible required controls.`);
}

export async function clearOneCompletedRequiredControl(page, stepNumber) {
  const fields = page.locator(`${STEP[stepNumber]} .gfield:visible`);
  for (let fieldIndex = 0; fieldIndex < await fields.count(); fieldIndex += 1) {
    const field = fields.nth(fieldIndex);
    if (!await isRequiredField(field)) continue;
    const controls = field.locator('input:visible, select:visible, textarea:visible');
    for (let controlIndex = 0; controlIndex < await controls.count(); controlIndex += 1) {
      const control = controls.nth(controlIndex);
      if (await control.isDisabled()) continue;
      const id = await control.getAttribute('id') ?? await control.getAttribute('name');
      const type = String(await control.getAttribute('type')
        ?? await control.evaluate((element) => element.tagName.toLowerCase())).toLowerCase();
      if (type === 'radio') continue;
      if (type === 'checkbox') {
        if (!await control.isChecked()) continue;
        await control.uncheck();
        return { id, type, fieldId: await field.getAttribute('id') };
      }
      if (type === 'file') {
        if (!await control.evaluate((element) => Boolean(element.files?.length))) continue;
        await control.setInputFiles([]);
        return { id, type, fieldId: await field.getAttribute('id') };
      }
      const tagName = await control.evaluate((element) => element.tagName.toLowerCase());
      if (tagName === 'select') {
        const hasEmptyOption = await control.locator('option[value=""]').count() > 0;
        if (!hasEmptyOption || !await control.inputValue()) continue;
        await control.selectOption('');
        return { id, type: 'select-one', fieldId: await field.getAttribute('id') };
      }
      if (!await control.inputValue()) continue;
      await control.fill('');
      return { id, type, fieldId: await field.getAttribute('id') };
    }
  }
  return null;
}
