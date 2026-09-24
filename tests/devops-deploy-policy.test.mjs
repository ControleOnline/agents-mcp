import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveDeployPolicy } from '../workers/automate/devops/deploy-policy.mjs';

test('temporary DevOps default forces deployment and bypasses only automated tests', () => {
  const policy = resolveDeployPolicy({}, {});

  assert.equal(policy.forceDeploy, true);
  assert.equal(policy.automatedTestsRequired, false);
  assert.equal(policy.source, 'DEVOPS_FORCE_DEPLOY');
  assert.match(policy.auditReason, /bypassed/i);
});

test('explicit operation parameter overrides the fleet default', () => {
  const policy = resolveDeployPolicy({ force_deploy: false }, { DEVOPS_FORCE_DEPLOY: 'true' });

  assert.equal(policy.forceDeploy, false);
  assert.equal(policy.automatedTestsRequired, true);
  assert.equal(policy.source, 'operation.force_deploy');
});

test('invalid force values fail closed', () => {
  assert.throws(
    () => resolveDeployPolicy({}, { DEVOPS_FORCE_DEPLOY: 'sometimes' }),
    /DEVOPS_FORCE_DEPLOY must be a boolean value/
  );
});
