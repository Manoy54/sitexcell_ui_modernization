import assert from 'node:assert/strict';
import test from 'node:test';

import config from '../configs/playwright.access-request.config.js';

test('runs the authenticated live suite serially by default', () => {
  assert.equal(config.workers, 1);
  assert.equal(config.fullyParallel, false);
});

test('gates later cases once while allowing early cases after authentication', () => {
  const projects = new Map(config.projects.map((project) => [project.name, project]));

  assert.deepEqual([...projects.keys()], [
    'access-authentication',
    'access-early',
    'access-step5-readiness',
    'access-later',
  ]);
  assert.deepEqual(projects.get('access-early').dependencies, ['access-authentication']);
  assert.deepEqual(projects.get('access-step5-readiness').dependencies, ['access-authentication']);
  assert.deepEqual(projects.get('access-later').dependencies, ['access-step5-readiness']);
  assert.match(String(projects.get('access-early').testMatch), /entry-validation-and-context/);
  assert.match(String(projects.get('access-step5-readiness').testMatch), /later-step-readiness/);
  assert.match(String(projects.get('access-later').testIgnore), /entry-validation-and-context/);
});
