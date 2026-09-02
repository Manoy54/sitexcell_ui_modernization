import { STEP } from './selectors.js';

export async function visibleUploadFields(page, stepNumber = 7) {
  const step = page.locator(STEP[stepNumber]);
  const fields = step.locator('.gfield:visible').filter({ has: page.locator('input[type="file"]') });
  const uploads = [];
  for (let index = 0; index < await fields.count(); index += 1) {
    const field = fields.nth(index);
    const input = field.locator('input[type="file"]').first();
    uploads.push({
      field,
      input,
      fieldId: await field.getAttribute('id'),
      inputId: await input.getAttribute('id'),
      label: (await field.locator('.gfield_label, legend').first().textContent())?.trim() ?? null,
      required: await field.evaluate((element) => element.classList.contains('gfield_contains_required')
        || Boolean(element.querySelector('[required], [aria-required="true"], .gfield_required'))),
      accept: await input.getAttribute('accept'),
      description: (await field.textContent())?.replace(/\s+/g, ' ').trim() ?? '',
    });
  }
  return uploads;
}
export function declaredMaximumBytes(upload) {
  const match = String(upload.description ?? '').match(
    /(?:maximum|max\.?)\s*(?:file\s*)?size\D*(\d+(?:\.\d+)?)\s*(kb|mb|gb)/i,
  );
  if (!match) return null;
  const value = Number(match[1]);
  const multipliers = { kb: 1024, mb: 1024 ** 2, gb: 1024 ** 3 };
  return Math.floor(value * multipliers[match[2].toLowerCase()]);
}

export function isRequestSpecificUpload(upload) {
  return /additional|request|support|other/i.test(
    [upload.label, upload.description].filter(Boolean).join(' '),
  );
}

export async function uploadSyntheticFile(upload, filePath) {
  await upload.input.setInputFiles(filePath);
  return upload.input.evaluate((input) => [...(input.files ?? [])].map((file) => ({
    name: file.name,
    size: file.size,
    type: file.type,
  })));
}

export async function relevantConfirmations(page, stepNumber = 7) {
  const checkboxes = page.locator(`${STEP[stepNumber]} input[type="checkbox"]:visible`);
  const confirmations = [];
  for (let index = 0; index < await checkboxes.count(); index += 1) {
    const checkbox = checkboxes.nth(index);
    const id = await checkbox.getAttribute('id');
    const label = id ? page.locator(`label[for="${id}"]`) : null;
    const text = label && await label.count()
      ? (await label.textContent())?.trim()
      : await checkbox.getAttribute('aria-label');
    if (!/file|document|upload|review|confirm|evidence/i.test(text ?? '')) continue;
    confirmations.push({ checkbox, id, label: text });
  }
  return confirmations;
}

export async function associatedUploadConfirmations(upload) {
  const checkboxes = upload.field.locator('input[type="checkbox"]:visible');
  const confirmations = [];
  for (let index = 0; index < await checkboxes.count(); index += 1) {
    const checkbox = checkboxes.nth(index);
    const id = await checkbox.getAttribute('id');
    const label = id ? upload.field.locator(`label[for="${id}"]`) : null;
    confirmations.push({
      checkbox,
      id,
      label: label && await label.count() ? (await label.textContent())?.trim() : id,
    });
  }
  return confirmations;
}
