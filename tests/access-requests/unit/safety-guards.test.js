import test from 'node:test';
import assert from 'node:assert/strict';
import { isFinalAccessSubmission } from '../support/safety-guards.js';

const ACCESS_URL = 'https://co-siter.com.au/access-requests/';

test('allows ordinary Gravity Forms transitions between Access Request steps', () => {
  assert.equal(isFinalAccessSubmission({
    method: 'POST',
    url: ACCESS_URL,
    postData: 'gform_submit=3&is_submit_3=1&gform_source_page_number_3=1&gform_target_page_number_3=2',
  }), false);
});

test('blocks the final Step 8 POST', () => {
  assert.equal(isFinalAccessSubmission({
    method: 'POST',
    url: ACCESS_URL,
    postData: 'gform_submit=3&is_submit_3=1&gform_source_page_number_3=8&gform_target_page_number_3=0',
  }), true);
});

test('blocks an explicit final-submit button payload', () => {
  assert.equal(isFinalAccessSubmission({
    method: 'POST',
    url: ACCESS_URL,
    postData: 'gform_submit=3&gform_submit_button_3=Submit',
  }), true);
});

test('ignores GET requests and POSTs to unrelated workflows', () => {
  assert.equal(isFinalAccessSubmission({
    method: 'GET',
    url: ACCESS_URL,
    postData: '',
  }), false);
  assert.equal(isFinalAccessSubmission({
    method: 'POST',
    url: 'https://co-siter.com.au/laan-requests/',
    postData: 'gform_source_page_number_3=8&gform_target_page_number_3=0',
  }), false);
});
