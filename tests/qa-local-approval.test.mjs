import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { spawnSync } from 'node:child_process';

const read = (path) => fs.readFileSync(new URL(path, import.meta.url), 'utf8');

test('QA approval is local and independent of GitHub Actions', () => {
  const policy = [
    read('../AGENTS.md'),
    read('../agents/roles/qa/agent.md'),
    read('../workers/automation/qa/base.md'),
    read('../workers/automate/quality-assurance.md'),
    read('../agents/skills/controleonline/by-role-qa-README/SKILL.md'),
  ].join('\n');

  assert.match(policy, /workspace Paperclip/);
  assert.match(policy, /não aprovam, reprovam, bloqueiam/i);
  assert.match(policy, /testes.*localmente/is);
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
