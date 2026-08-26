export const ACCESS_FORM_ID = '3';
export const ACCESS_FORM_DOM_ID = `gform_${ACCESS_FORM_ID}`;
export const FINAL_SUBMIT_DOM_ID = `gform_submit_button_${ACCESS_FORM_ID}`;
export const ACCESS_FORM = `#${ACCESS_FORM_DOM_ID}`;
export const FINAL_SUBMIT = `#${FINAL_SUBMIT_DOM_ID}`;
export const ACCESS_FORM_FIELDS = Object.freeze({
  sourcePage: `gform_source_page_number_${ACCESS_FORM_ID}`,
  targetPage: `gform_target_page_number_${ACCESS_FORM_ID}`,
  submitButton: FINAL_SUBMIT_DOM_ID,
});
export const STEP = Object.freeze({
  1: '#gform_page_3_1',
  2: '#gform_page_3_2',
  3: '#gform_page_3_3',
  4: '#gform_page_3_4',
  5: '#gform_page_3_5',
  6: '#gform_page_3_6',
  7: '#gform_page_3_7',
  8: '#gform_page_3_8',
});

// Gravity Forms generates the button ID from the final field on each page, so
// the stable provider class is the least brittle selector available here.
export function nextButton(page, stepNumber) {
  return page.locator(`${STEP[stepNumber]} .gform_next_button`).first();
}
