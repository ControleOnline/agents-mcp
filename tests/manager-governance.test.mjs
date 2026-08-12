import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const managerSkill = fs.readFileSync('agents/skills/by-role/manager/README.md', 'utf8');
const managerAgent = fs.readFileSync('agents/roles/manager/agent.md', 'utf8');

const completionLabels = [
  'qa:accepted',
  'security:accepted',
  'agent:technical-documenter:done',
  'agent:tutorial-assistant:done',
];

test('manager is the fallback after all four pipeline priorities', () => {
  assert.match(managerAgent, /Prioridade 5.*Manager/s);
  assert.match(managerAgent, /quatro prioridades anteriores.*trabalho pendente/i);
  assert.match(managerSkill, /ultima prioridade do pipeline/i);
});

test('closed and Done tasks require the complete four-label contract', () => {
  for (const label of completionLabels) {
    assert.ok(managerSkill.includes(`\`${label}\``), `missing completion label: ${label}`);
  }
  assert.match(managerSkill, /closed.*Done.*quatro labels/is);
});

test('manager checklist covers bidirectional status checks and atomic correction', () => {
  assert.match(managerSkill, /Dupla validacao estado ↔ labels/);
  assert.match(managerSkill, /Ready.*Working/s);
  assert.match(managerSkill, /Aplicar exatamente uma correcao atomica por rodada/);
  assert.match(managerSkill, /snapshot completo.*sem limitar a primeira pagina/i);
});

