import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const cto = fs.readFileSync('agents/roles/cto/agent.md', 'utf8');
const ctoSkill = fs.readFileSync('agents/skills/controleonline/by-role-cto-README/SKILL.md', 'utf8');
const paperclipSkill = fs.readFileSync(
  'agents/skills/controleonline/by-role-cto-paperclip-operations/SKILL.md',
  'utf8'
);

test('CTO starts every run by resolving the Paperclip blocked inbox', () => {
  assert.match(cto, /Prioridade operacional número 1[\s\S]*inbox de pendências bloqueadas[\s\S]*readback/i);
  assert.match(ctoSkill, /Função número 1[\s\S]*https:\/\/ia\.controleonline\.com\/CON\/inbox\/blocked/i);
  assert.match(paperclipSkill, /Função número 1 do CTO[\s\S]*Após cada mutação[\s\S]*readback/i);
});

test('blocked-inbox automation keeps safety boundaries explicit', () => {
  assert.match(ctoSkill, /não autoriza limpar dependências/i);
  assert.match(ctoSkill, /matar execução\s+viva/i);
  assert.match(paperclipSkill, /não capture uma nova tarefa do GitHub enquanto houver pendência/i);
});
