import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { spawnSync } from 'node:child_process';

const read = (path) => fs.readFileSync(new URL(path, import.meta.url), 'utf8');

test('Paperclip product chain exposes Developer, Security, Manager and DevOps only', () => {
  const manager = read('../agents/roles/manager/agent.md');
  const managerSkill = read('../agents/skills/controleonline/by-role-manager-README/SKILL.md');
  const developer = read('../agents/roles/developer/agent.md');
  const security = read('../agents/roles/security/agent.md');
  const devops = read('../agents/roles/devops/agent.md');
  const workerSkills = [
    read('../agents/skills/controleonline/by-role-developer-README/SKILL.md'),
    read('../agents/skills/controleonline/by-role-security-README/SKILL.md'),
    read('../agents/skills/controleonline/by-role-devops-README/SKILL.md'),
    read('../agents/skills/controleonline/shared-github-github-flow/SKILL.md'),
    read('../agents/skills/controleonline/shared-operations-agent-handoff-governance/SKILL.md'),
  ];
  const provisioner = read('../workers/scripts/sync-paperclip-agents.mjs');
  assert.match(manager, /Developer.*Security.*Manager.*DevOps/is);
  assert.match(managerSkill, /Developer.*Security.*Manager.*DevOps/is);
  for (const instructions of [manager, managerSkill, developer, security, devops, ...workerSkills]) {
    assert.doesNotMatch(instructions, /\b(?:QA|Quality Assurance|Design|UX)\b/i);
  }
  assert.match(provisioner, /const types = \["developer", "security", "devops"\]/);
  assert.equal(fs.existsSync(new URL('../workers/automate/workflows/qa-project-review.yml', import.meta.url)), false);
});

test('legacy GitHub QA reviewer is disabled', () => {
  const script = new URL('../workers/automate/scripts/qa-project-review.mjs', import.meta.url);
  const result = spawnSync(process.execPath, [script.pathname], { encoding: 'utf8' });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /legacy GitHub QA reviewer is disabled/i);
  assert.match(result.stderr, /QA approval must be performed locally by the Paperclip QA agent/);
});

test('GitHub Manager workflow cannot infer QA approval or promote In Review', () => {
  const script = read('../workers/automate/scripts/github-operations.mjs');
  const workflow = read('../.github/workflows/github-operations.yml');
  assert.doesNotMatch(script, /detectQaApproval|promote-approved-work-item|GITHUB_MANAGER_QA/);
  assert.doesNotMatch(script, /timelineItems\s*\(|comments\s*\(|reviews\s*\(/);
  assert.doesNotMatch(workflow, /GITHUB_MANAGER_QA|agent:qa:accepted|agent:qa:rejected/);
});
