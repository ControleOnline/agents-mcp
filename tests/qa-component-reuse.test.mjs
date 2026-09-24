import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const reviewChecklist = fs.readFileSync('agents/skills/controleonline/shared-quality-review-checklists/SKILL.md', 'utf8');
const componentReuseChecklist = fs.readFileSync(
  'agents/skills/controleonline/shared-quality-review-checklists/component-reuse-checklist.md',
  'utf8',
);

test('Developer verification checklist includes the component reuse subchecklist file', () => {
  assert.match(reviewChecklist, /agents\/skills\/controleonline\/shared-quality-review-checklists\/component-reuse-checklist\.md/);
  assert.match(reviewChecklist, /frontend work follows/i);
});

test('component reuse checklist requires Default component counterparts', () => {
  for (const component of ['Input', 'Select', 'Option', 'Button']) {
    assert.ok(
      componentReuseChecklist.includes(`Default${component}`),
      `missing Default${component} requirement`,
    );
  }

  assert.match(componentReuseChecklist, /Default<Component>/);
  assert.match(componentReuseChecklist, /exception is documented.*task/is);
});
