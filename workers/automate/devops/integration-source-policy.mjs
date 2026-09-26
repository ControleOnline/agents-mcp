const TASK_BRANCH = /^task-([1-9][0-9]*)$/;
const RC_BRANCH = /^rc\/(\d+)\.(\d+)\.(\d+)-rc\.([1-9][0-9]*)$/;
const SHA = /^[0-9a-f]{40}$/i;
const GOVERNANCE_PR_ALLOWLISTS = new Map([
  ['fix/con-552-paperclip-direct-governance', new Set([
    '.github/workflows/integration-source-gate.yml',
    '.github/workflows/reset-aggregate-branches.yml',
    'AGENTS.md',
    'agents/README.md',
    'agents/roles/cto/agent.md',
    'agents/roles/design/agent.md',
    'agents/roles/developer/agent.md',
    'agents/roles/devops/agent.md',
    'agents/roles/manager/agent.md',
    'agents/roles/qa/agent.md',
    'agents/roles/security/agent.md',
    'agents/roles/sysadmin/agent.md',
    'agents/roles/technical-documenter/agent.md',
    'agents/roles/tutorial-assistant/agent.md',
    'agents/roles/ux/agent.md',
    'agents/skills/controleonline/by-role-developer-README/SKILL.md',
    'agents/skills/controleonline/by-role-devops-README/SKILL.md',
    'agents/skills/controleonline/by-role-manager-README/SKILL.md',
    'agents/skills/controleonline/runners-README/SKILL.md',
    'agents/skills/controleonline/shared-README/SKILL.md',
    'agents/skills/controleonline/shared-github-conflict-resolution/SKILL.md',
    'agents/skills/controleonline/shared-github-github-flow-ci/SKILL.md',
    'agents/skills/controleonline/shared-github-github-flow/SKILL.md',
    'agents/skills/controleonline/shared-github-release-candidate/SKILL.md',
    'agents/skills/controleonline/shared-operations-agent-execution-baseline/SKILL.md',
    'agents/skills/controleonline/shared-operations-agent-handoff-governance/SKILL.md',
    'agents/skills/controleonline/shared-operations-agent-wrapper-contract/SKILL.md',
    'agents/skills/controleonline/shared-operations-copilot-cooperation/SKILL.md',
    'agents/skills/controleonline/shared-operations-paperclip-direct-execution/SKILL.md',
    'config/ecosystem.config.example.json',
    'config/ecosystem.config.json',
    'tests/manager-governance.test.mjs',
    'tests/integration-source-policy.test.mjs',
    'tests/release-candidate-freeze.test.mjs',
    'tests/reset-integration-branches.test.mjs',
    'workers/automate/agents/README.md',
    'workers/automate/common/README.md',
    'workers/automate/developer/README.md',
    'workers/automate/scripts/cto-project-supervisor.mjs',
    'workers/automate/scripts/cto-staging-promotion.mjs',
    'workers/automate/scripts/developer-project-dispatch.mjs',
    'workers/automate/scripts/github-operations.mjs',
    'workers/automate/scripts/reset-integration-branches.mjs',
    'workers/automate/scripts/security-project-review.mjs',
    'workers/automate/scripts/verify-submodule-branches.mjs',
    'workers/automate/devops/integration-source-policy.mjs',
    'workers/automate/security/README.md',
    'workers/automate/workflows/developer-project-dispatch.yml',
    'workers/automate/workflows/security-project-review.yml',
    'workers/automation/README.md',
    'workers/automation/devops/base.md',
    'workers/scripts/sync-copilot-agents.mjs',
    'workers/scripts/sync-paperclip-agents.mjs',
    'workers/src/direct-push-ingest.js',
  ])],
  ['fix/dev-master-staging-rc-reconciliation', new Set([
  '.github/workflows/integration-source-gate.yml',
  '.github/workflows/reset-aggregate-branches.yml',
  'tests/integration-source-policy.test.mjs',
  'tests/reset-integration-branches.test.mjs',
  'workers/automate/devops/integration-source-policy.mjs',
  'workers/automate/scripts/reset-integration-branches.mjs',
  ])],
  ['automation/reset-integration-branches', new Set([
  '.github/workflows/integration-source-gate.yml',
  '.github/workflows/reset-aggregate-branches.yml',
  'tests/integration-source-policy.test.mjs',
  'tests/reset-integration-branches.test.mjs',
  'workers/automate/devops/integration-source-policy.mjs',
  'workers/automate/scripts/reset-integration-branches.mjs',
  ])],
  ['task-paperclip-status-distinction', new Set([
  '.github/workflows/github-operations.yml',
  '.github/workflows/integration-source-gate.yml',
  'AGENTS.md',
  'agents/roles/ceo/agent.md',
  'agents/roles/developer/agent.md',
  'agents/roles/devops/agent.md',
  'agents/roles/manager/agent.md',
  'agents/roles/qa/agent.md',
  'agents/skills/controleonline/by-role-manager-README/SKILL.md',
  'agents/skills/controleonline/by-role-qa-README/SKILL.md',
  'agents/skills/controleonline/runners-README/SKILL.md',
  'agents/skills/controleonline/shared-github-github-flow/SKILL.md',
  'agents/skills/controleonline/shared-operations-agent-handoff-governance/SKILL.md',
  'agents/skills/controleonline/shared-operations-delivery-proof-contract/SKILL.md',
  'agents/skills/controleonline/shared-operations-issue-queue-discovery/SKILL.md',
  'tests/qa-local-approval.test.mjs',
  'tests/integration-source-policy.test.mjs',
  'workers/automate/agents/runner-map.md',
  'workers/automate/quality-assurance.md',
  'workers/automate/scripts/github-operations.mjs',
  'workers/automate/scripts/qa-project-review.mjs',
  'workers/automate/devops/integration-source-policy.mjs',
  'workers/automate/staging-merge.md',
  'workers/automate/workflows/qa-project-review.yml',
  'workers/automation/qa/base.md',
  ])],
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
 * Exact per-PR allowlists for structural agents-mcp governance changes.
 * No exception applies to product repositories or unlisted file paths.
 */
export function validateGovernanceSource({ repository, sourceBranch, targetBranch, changedFiles = [] }) {
  const allowlist = GOVERNANCE_PR_ALLOWLISTS.get(sourceBranch);
  if (repository !== 'ControleOnline/agents-mcp' || targetBranch !== 'master' || !allowlist) {
    return { allowed: false, reason: 'governance exception is limited to an exact allowlisted agents-mcp PR.' };
  }
  if (!Array.isArray(changedFiles) || changedFiles.length === 0 || changedFiles.some((file) => !allowlist.has(file))) {
    return { allowed: false, reason: 'governance PR contains files outside its exact allowlist.' };
  }
  return { allowed: true, protectedTarget: true, type: 'governance' };
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

  if (target === 'dev') return { allowed: true, protectedTarget: true, type: 'development' };

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
