const TASK_BRANCH = /^task-([1-9][0-9]*)$/;
const RC_BRANCH = /^rc\/(\d+)\.(\d+)\.(\d+)-rc\.([1-9][0-9]*)$/;
const SHA = /^[0-9a-f]{40}$/i;
const GOVERNANCE_SOURCE_BRANCH = 'automation/reset-integration-branches';
const GOVERNANCE_SOURCE_FILES = new Set([
  '.github/workflows/reset-aggregate-branches.yml',
  'tests/integration-source-policy.test.mjs',
  'tests/reset-integration-branches.test.mjs',
  'workers/automate/devops/integration-source-policy.mjs',
  'workers/automate/scripts/reset-integration-branches.mjs',
]);

export function parseTaskBranch(branch) {
  const match = TASK_BRANCH.exec(String(branch || '').trim());
  return match ? { branch: match[0], issueNumber: Number(match[1]) } : null;
}

export function parseRcBranch(branch) {
  const match = RC_BRANCH.exec(String(branch || '').trim());
  if (!match) return null;
  return {
    branch: match[0],
    version: `${match[1]}.${match[2]}.${match[3]}`,
    rc: Number(match[4]),
  };
}

/**
 * Business rule: an RC is a frozen technical artifact, not an aggregator task.
 * It may contain at most the same five tasks allowed concurrently in Working.
 */
export function validateRcManifest(manifest, sourceBranch) {
  if (!manifest || typeof manifest !== 'object') throw new Error('RC manifest is required.');
  const parsed = parseRcBranch(sourceBranch || manifest.branch);
  if (!parsed) throw new Error('RC branch must match rc/X.Y.Z-rc.N.');
  if (manifest.branch !== parsed.branch) throw new Error('RC manifest branch does not match source branch.');
  if (manifest.version !== parsed.version || Number(manifest.rc) !== parsed.rc) {
    throw new Error('RC manifest version/rc does not match branch.');
  }
  if (manifest.frozen !== true) throw new Error('RC manifest must be frozen.');
  if (!Array.isArray(manifest.tasks) || manifest.tasks.length < 1 || manifest.tasks.length > 5) {
    throw new Error('RC must contain between 1 and 5 tasks.');
  }
  const tasks = manifest.tasks.map(Number);
  if (tasks.some((id) => !Number.isInteger(id) || id < 1)) throw new Error('RC tasks must be positive issue numbers.');
  if (new Set(tasks).size !== tasks.length) throw new Error('RC tasks must be unique.');
  if (!SHA.test(String(manifest.baseMaster || ''))) throw new Error('RC baseMaster must be a full commit SHA.');
  const repos = manifest.repositories || {};
  if (!Object.keys(repos).length) throw new Error('RC repositories manifest cannot be empty.');
  for (const [repo, sha] of Object.entries(repos)) {
    if (!/^ControleOnline\/[A-Za-z0-9_.-]+$/.test(repo) || !SHA.test(String(sha))) {
      throw new Error(`Invalid RC repository entry: ${repo}`);
    }
  }
  return { ...parsed, tasks };
}

export function validateIntegrationSource({ sourceBranch, targetBranch, manifest = null }) {
  const target = String(targetBranch || '').trim();
  if (!['dev', 'staging', 'master'].includes(target)) return { allowed: true, protectedTarget: false };

  if (target === 'dev') {
    const task = parseTaskBranch(sourceBranch);
    return task
      ? { allowed: true, protectedTarget: true, type: 'task', issueNumber: task.issueNumber }
      : { allowed: false, protectedTarget: true, reason: 'dev only accepts task-<issue> sources.' };
  }

  try {
    const rc = validateRcManifest(manifest, sourceBranch);
    return { allowed: true, protectedTarget: true, type: 'rc', ...rc };
  } catch (error) {
    return { allowed: false, protectedTarget: true, reason: `${target} only accepts a frozen validated RC: ${error.message}` };
  }
}

export function assertIntegrationSource(input) {
  const result = validateIntegrationSource(input);
  if (!result.allowed) throw new Error(result.reason);
  return result;
}

export function validateGovernanceSource({ repository, sourceBranch, targetBranch, changedFiles = [] }) {
  const files = changedFiles.map((file) => String(file).replaceAll('\\', '/'));
  const allowed = repository === 'ControleOnline/agents-mcp'
    && sourceBranch === GOVERNANCE_SOURCE_BRANCH
    && targetBranch === 'master'
    && files.length > 0
    && files.every((file) => GOVERNANCE_SOURCE_FILES.has(file));
  return {
    allowed,
    reason: allowed ? undefined : 'Governance-only source must be the exact allowlisted branch and file set.',
  };
}
