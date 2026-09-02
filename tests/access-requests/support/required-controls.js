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

export async function waitForTransientLoading(page) {
  const loading = page.locator('#loading');
  if (!await loading.count()) return;
  await loading.waitFor({ state: 'hidden', timeout: 30_000 });
}

export async function completeVisibleRequiredControls(page, stepNumber, {
  runId = process.env.ACCESS_RUN_ID ?? 'synthetic-access-request',
  uploadPath,
} = {}) {
  const step = page.locator(STEP[stepNumber]);
  await expect(step).toBeVisible();
  await waitForTransientLoading(page);
  const fieldIds = await step.locator('.gfield:visible').evaluateAll((items) => items
    .map((field) => field.id)
    .filter(Boolean));
  const actions = [];

  for (const fieldId of fieldIds) {
    await waitForTransientLoading(page);
    const field = step.locator(`#${fieldId}`);
    if (!await field.isVisible().catch(() => false)) continue;
    if (!await isRequiredField(field)) continue;
    const label = await fieldLabel(field);

    const radioControls = field.locator('input[type="radio"]:visible');
    if (await radioControls.count()) {
      if (!await field.locator('input[type="radio"]:checked').count()) {
        const control = radioControls.first();
        if (!await control.isDisabled()) {
          const id = await control.getAttribute('id');
          try {
            await control.check({ timeout: 5_000 });
          } catch (error) {
            if (!await control.isVisible().catch(() => false)) throw error;
            await control.check({ force: true, timeout: 5_000 });
          }
          actions.push({ id, label, action: 'check', type: 'radio' });
        }
      }
      continue;
    }

    const checkboxControls = field.locator('input[type="checkbox"]:visible');
    if (await checkboxControls.count()) {
      if (!await field.locator('input[type="checkbox"]:checked').count()) {
        const control = checkboxControls.first();
        if (!await control.isDisabled()) {
          const id = await control.getAttribute('id');
          try {
            await control.check({ timeout: 5_000 });
          } catch (error) {
            if (!await control.isVisible().catch(() => false)) throw error;
            await control.check({ force: true, timeout: 5_000 });
          }
          actions.push({ id, label, action: 'check', type: 'checkbox' });
        }
      }
      continue;
    }

    const fileControls = field.locator('input[type="file"]');
    if (await fileControls.count()) {
      const control = fileControls.first();
      if (await control.evaluate((element) => element.files?.length > 0)) continue;
      if (await field.locator('.ginput_preview, .gform_uploaded_files .ginput_preview').count()) continue;
      if (!uploadPath || await control.isDisabled()) continue;
      const id = await control.getAttribute('id');
      await control.setInputFiles(uploadPath, { timeout: 5_000 });
      actions.push({ id, label, action: 'upload', type: 'file' });
      continue;
    }

    const selectControls = field.locator('select:visible');
    if (await selectControls.count()) {
      const control = selectControls.first();
      if (await control.isDisabled() || await control.inputValue()) continue;
      const options = await control.locator('option').evaluateAll((items) => items.map((item) => ({
        value: item.value,
        disabled: item.disabled,
      })));
      const option = options.find((item) => item.value && !item.disabled);
      if (!option) continue;
      const id = await control.getAttribute('id');
      await control.selectOption(option.value, { timeout: 5_000 });
      actions.push({ id, label, action: 'select', type: 'select-one', value: option.value });
      continue;
    }

    const textControls = field.locator('input:not([type]), input[type="text"]:visible, input[type="email"]:visible, input[type="tel"]:visible, input[type="date"]:visible, input[type="time"]:visible, input[type="number"]:visible, textarea:visible');
    for (let controlIndex = 0; controlIndex < await textControls.count(); controlIndex += 1) {
      const control = textControls.nth(controlIndex);
      if (await control.isDisabled() || await control.inputValue()) continue;
      const type = String(await control.getAttribute('type') ?? await control.evaluate((element) => element.tagName.toLowerCase())).toLowerCase();
      const id = await control.getAttribute('id');
      const value = syntheticValueForField({
        type,
        label,
        min: await control.getAttribute('min'),
      }, runId);
      await control.fill(value, { timeout: 5_000 });
      actions.push({ id, label, action: 'fill', type, value });
      break;
    }
  }

  await waitForTransientLoading(page);
  return actions;
}

export async function completeStepAndAdvance(page, stepNumber, options = {}) {
  const attempts = [];
  for (let attempt = 0; attempt < 5; attempt += 1) {
    attempts.push(...await completeVisibleRequiredControls(page, stepNumber, options));
    await waitForTransientLoading(page);
    await nextButton(page, stepNumber).click();
    try {
      await expect(page.locator(STEP[stepNumber + 1])).toBeVisible({ timeout: 15_000 });
      return attempts;
    } catch (error) {
      if (!await page.locator(STEP[stepNumber]).isVisible().catch(() => false)) throw error;
    }
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
