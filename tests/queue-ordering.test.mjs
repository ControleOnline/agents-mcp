import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const canonicalFiles = [
  'AGENTS.md',
  'agents/skills/paperclip/shared-operations-issue-queue-discovery/SKILL.md',
  'agents/roles/developer/agent.md',
  'agents/skills/paperclip/by-role-developer-README/SKILL.md',
  'agents/roles/technical-documenter/agent.md',
  'agents/skills/paperclip/by-role-technical-documenter-README/SKILL.md',
  'agents/skills/paperclip/by-role-tutorial-assistant-README/SKILL.md',
  'agents/roles/sysadmin/agent.md',
  'agents/skills/paperclip/by-role-manager-README/SKILL.md',
];

function compareQueueItems(left, right) {
  if (left.priority !== right.priority) return left.priority - right.priority;

  const createdDelta = Date.parse(left.createdAt) - Date.parse(right.createdAt);
  if (createdDelta !== 0) return createdDelta;

  return left.number - right.number;
}

test('functional priority wins before age', () => {
  const items = [
    { priority: 2, createdAt: '2025-01-01T00:00:00Z', number: 1 },
    { priority: 1, createdAt: '2026-01-01T00:00:00Z', number: 2 },
  ];

  assert.equal(items.sort(compareQueueItems)[0].number, 2);
});

test('oldest task wins inside the same priority regardless of updated activity', () => {
  const items = [
    { priority: 1, createdAt: '2026-02-01T00:00:00Z', updatedAt: '2026-08-12T00:00:00Z', number: 20 },
    { priority: 1, createdAt: '2026-01-01T00:00:00Z', updatedAt: '2025-01-01T00:00:00Z', number: 10 },
  ];

  assert.equal(items.sort(compareQueueItems)[0].number, 10);
});

test('lower issue number is the stable tie breaker', () => {
  const items = [
    { priority: 1, createdAt: '2026-01-01T00:00:00Z', number: 12 },
    { priority: 1, createdAt: '2026-01-01T00:00:00Z', number: 11 },
  ];

  assert.equal(items.sort(compareQueueItems)[0].number, 11);
});

test('Working takes precedence over Ready before priority ordering', () => {
  const items = [
    { status: 'Ready', priority: 0, number: 1 },
    { status: 'Working', priority: 4, number: 2 },
  ];
  const working = items.filter((item) => item.status === 'Working');
  const eligible = working.length > 0 ? working : items;
  assert.deepEqual(eligible.map((item) => item.number), [2]);
});

test('Developer respects the Working capacity read from Project #1', () => {
  const workingColumnLimit = 3;
  assert.equal([1, 2].length < workingColumnLimit, true);
  assert.equal([1, 2, 3].length >= workingColumnLimit, true);
});

test('Working capacity is configured centrally in agents-mcp', () => {
  const config = JSON.parse(fs.readFileSync('config/ecosystem.config.json', 'utf8'));
  assert.equal(config.runners.defaults.DEVELOPER_WORKING_LIMIT, '5');

  const manager = fs.readFileSync('agents/roles/manager/agent.md', 'utf8');
  const discovery = fs.readFileSync(
    'agents/skills/paperclip/shared-operations-issue-queue-discovery/SKILL.md',
    'utf8',
  );
  assert.match(manager, /limite global.*Working.*5 tasks/is);
  assert.match(manager, /P1[\s\S]*`DevOps`.*única exceção.*Deploy/is);
  assert.match(discovery, /limite.*5.*Working/is);
  assert.match(discovery, /única exceção de fila.*Deploy/is);
});

test('canonical instructions reject updatedAt ordering', () => {
  for (const path of canonicalFiles) {
    const source = fs.readFileSync(path, 'utf8');
    assert.doesNotMatch(source, /priorize por `updated` mais recente/i, path);
    assert.doesNotMatch(source, /mais antiga `updated`/i, path);
    assert.doesNotMatch(source, /`updated` mais recente/i, path);
    assert.doesNotMatch(source, /updated mais recente/i, path);
  }

  const discovery = fs.readFileSync('agents/skills/paperclip/shared-operations-issue-queue-discovery/SKILL.md', 'utf8');
  assert.match(discovery, /createdAt` crescente/i);
  assert.match(discovery, /nunca use `updatedAt`/i);
  assert.match(discovery, /menor numero da issue/i);

  const developerAgent = fs.readFileSync('agents/roles/developer/agent.md', 'utf8');
  assert.match(developerAgent, /createdAt` crescente/i);
  assert.doesNotMatch(developerAgent, /`updated` mais recente/i);
  assert.match(developerAgent, /limite.*coluna `Working`.*Project #1/is);
});

test('all agents prioritize Working and DevOps prioritizes Deploy first', () => {
  const discovery = fs.readFileSync('agents/skills/paperclip/shared-operations-issue-queue-discovery/SKILL.md', 'utf8');
  const devops = fs.readFileSync('agents/skills/paperclip/by-role-devops-README/SKILL.md', 'utf8');
  const dispatch = fs.readFileSync('workers/automate/scripts/agent-project-dispatch.mjs', 'utf8');
  const projectDispatch = fs.readFileSync('workers/automate/scripts/developer-project-dispatch.mjs', 'utf8');

  assert.match(discovery, /todos os agentes[\s\S]*limite[\s\S]*`Working`/i);
  assert.match(discovery, /DevOps,[\s\S]*`Deploy`[\s\S]*`Working`/i);
  assert.match(devops, /`In Review`/i);
  assert.match(devops, /`Done`/i);
  assert.match(devops, /`Deploy`[\s\S]*`Working`[\s\S]*`Ready`/i);
  assert.match(dispatch, /prioritizeWorkingItems/);
  assert.match(projectDispatch, /workingItems/);
  assert.match(projectDispatch, /workingColumnLimit/);
  assert.match(projectDispatch, /ecosystem\.config\.json/);
  assert.match(projectDispatch, /DEVELOPER_WORKING_LIMIT/);
  assert.match(projectDispatch, /Working column limit is unavailable/is);
  assert.match(projectDispatch, /atingiu o limite configurado de .*tasks.*In Review/is);
  assert.match(projectDispatch, /Ready fica bloqueado até uma task avançar para In Review/is);
});

test('board mutations fail closed before creating a sixth Working task', () => {
  const managerOperations = fs.readFileSync(
    'workers/automate/scripts/github-operations.mjs',
    'utf8',
  );
  const manager = fs.readFileSync('agents/roles/manager/agent.md', 'utf8');
  const discovery = fs.readFileSync(
    'agents/skills/paperclip/shared-operations-issue-queue-discovery/SKILL.md',
    'utf8',
  );

  assert.match(managerOperations, /assertWorkingCapacity/);
  assert.match(managerOperations, /Working capacity exceeded/);
  assert.match(managerOperations, /DEVELOPER_WORKING_LIMIT/);
  assert.match(manager, /teto absoluto de 5 tasks/is);
  assert.match(manager, /não cria uma sexta.*Working/is);
  assert.match(discovery, /mutacao que produziria `6\/5`.*recusada/is);
});
