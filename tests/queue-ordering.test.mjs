import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const canonicalFiles = [
  'AGENTS.md',
  'agents/skills/shared/operations/issue-queue-discovery.md',
  'agents/roles/technical-documenter/agent.md',
  'agents/skills/by-role/technical-documenter/README.md',
  'agents/skills/by-role/tutorial-assistant/README.md',
  'agents/roles/sysadmin/agent.md',
  'agents/skills/by-role/manager/README.md',
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

test('canonical instructions reject updatedAt ordering', () => {
  for (const path of canonicalFiles) {
    const source = fs.readFileSync(path, 'utf8');
    assert.doesNotMatch(source, /priorize por `updated` mais recente/i, path);
    assert.doesNotMatch(source, /mais antiga `updated`/i, path);
  }

  const discovery = fs.readFileSync('agents/skills/shared/operations/issue-queue-discovery.md', 'utf8');
  assert.match(discovery, /prioridades funcionais[sS]*createdAt[sS]*menor numero[sS]*nunca use `updatedAt`/i);
});
