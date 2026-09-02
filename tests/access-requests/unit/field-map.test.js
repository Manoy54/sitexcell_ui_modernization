import assert from 'node:assert/strict';
import test from 'node:test';

import { renderFieldMapMarkdown } from '../support/field-map.js';

test('renders a sanitized, reviewable Steps 1-8 field map summary', () => {
  const markdown = renderFieldMapMarkdown({
    schemaVersion: 1,
    status: 'captured',
    capturedAt: '2026-08-29T00:00:00.000Z',
    targetUrl: 'https://co-siter.com.au/access-requests/',
    accountClassification: 'approved authenticated session',
    steps: [{
      step: 1,
      fields: [{
        id: 'input_3_500',
        name: 'input_500',
        label: 'Nature of work',
        type: 'select-one',
        required: true,
        disabled: false,
        visibleByDefault: true,
        options: [
          { label: 'Select', value: '' },
          { label: 'Maintenance', value: 'Maintenance' },
        ],
        accept: null,
        multiple: false,
      }],
    }, {
      step: 8,
      fields: [],
    }],
  });

  assert.match(markdown, /^# Access Requests Steps 1–8 Field and Branch Map/m);
  assert.match(markdown, /Status: Captured/);
  assert.match(markdown, /## Step 1/);
  assert.match(markdown, /## Step 8/);
  assert.match(markdown, /`input_3_500` \| Nature of work \| `select-one` \| Yes/);
  assert.match(markdown, /Maintenance/);
});
