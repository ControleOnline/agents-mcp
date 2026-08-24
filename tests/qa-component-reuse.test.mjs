import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const reviewChecklist = fs.readFileSync('workers/automate/review-checklists.md', 'utf8');
const componentReuseChecklist = fs.readFileSync(
  'workers/automate/qa/component-reuse-checklist.md',
  'utf8',
);

test('qa review checklist includes the component reuse subchecklist file', () => {
  assert.match(reviewChecklist, /workers\/automate\/qa\/component-reuse-checklist\.md/);
  assert.match(reviewChecklist, /subchecklist de reaproveitamento de componentes/i);
});

test('component reuse checklist requires Default component counterparts', () => {
  for (const component of ['Input', 'Select', 'Option', 'Button']) {
    assert.ok(
      componentReuseChecklist.includes(`Default${component}`),
      `missing Default${component} requirement`,
    );
  }

  assert.match(componentReuseChecklist, /Default<Componente>/);
  assert.match(componentReuseChecklist, /excecoes.*justificadas.*issue/is);
  assert.match(componentReuseChecklist, /documentada e comprovada na issue/i);
});
