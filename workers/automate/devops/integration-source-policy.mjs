const TASK_BRANCH = /^task-([1-9][0-9]*)$/;

export function parseTaskBranch(branch) {
  const match = TASK_BRANCH.exec(String(branch || '').trim());
  return match ? { branch: match[0], issueNumber: Number(match[1]) } : null;
}

/**
 * Business rule for protected integration branches.
 *
 * dev, staging and master accept one individual task delta at a time.
 * Aggregator branches (dev, staging, master, release/*, rc/*) are never valid
 * sources. This prevents an old aggregate branch from restoring code already
 * removed or fixed by another task.
 */
export function validateIntegrationSource({ sourceBranch, targetBranch }) {
  const target = String(targetBranch || '').trim();
  const protectedTargets = new Set(['dev', 'staging', 'master']);

  if (!protectedTargets.has(target)) {
    return { allowed: true, protectedTarget: false };
  }

  const task = parseTaskBranch(sourceBranch);
  if (!task) {
    return {
      allowed: false,
      protectedTarget: true,
      reason: `Protected branch ${target} only accepts source task-<issue>; received ${sourceBranch || '<empty>'}.`,
    };
  }

  return {
    allowed: true,
    protectedTarget: true,
    issueNumber: task.issueNumber,
  };
}

export function assertIntegrationSource(input) {
  const result = validateIntegrationSource(input);
  if (!result.allowed) throw new Error(result.reason);
  return result;
}
