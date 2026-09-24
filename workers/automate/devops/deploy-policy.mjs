const TRUE_VALUES = new Set(['1', 'true', 'yes', 'sim', 'on']);
const FALSE_VALUES = new Set(['0', 'false', 'no', 'nao', 'não', 'off']);

function parseBoolean(value, name) {
  if (typeof value === 'boolean') return value;
  const normalized = String(value ?? '').trim().toLowerCase();
  if (TRUE_VALUES.has(normalized)) return true;
  if (FALSE_VALUES.has(normalized)) return false;
  throw new Error(`${name} must be a boolean value.`);
}

/** Resolve the production deployment test policy for DevOps. */
export function resolveDeployPolicy(operation = {}, environment = process.env) {
  const hasOperationOverride = Object.prototype.hasOwnProperty.call(operation, 'force_deploy');
  const source = hasOperationOverride ? 'operation.force_deploy' : 'DEVOPS_FORCE_DEPLOY';
  const rawValue = hasOperationOverride ? operation.force_deploy : environment.DEVOPS_FORCE_DEPLOY ?? 'true';
  const forceDeploy = parseBoolean(rawValue, source);

  return {
    forceDeploy,
    source,
    automatedTestsRequired: !forceDeploy,
    auditReason: forceDeploy
      ? 'Automated-test gate bypassed by explicit DevOps force_deploy policy.'
      : 'Automated-test gate remains required.',
  };
}
