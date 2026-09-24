import assert from 'node:assert/strict';
import test from 'node:test';
import {
  WORKING_LIMIT,
  assertWorkingCapacity,
  splitWorkingByCapacity,
} from '../workers/automate/project/working-capacity.mjs';

test('Working hard limit is five', () => {
  assert.equal(WORKING_LIMIT, 5);
  assert.equal(assertWorkingCapacity(4, 1), true);
  assert.throws(() => assertWorkingCapacity(5, 1), /6\/5/);
});

test('overflow keeps five oldest tasks and returns the rest to Ready', () => {
  const items = [
    { content: { number: 106, createdAt: '2026-01-06T00:00:00Z' } },
    { content: { number: 101, createdAt: '2026-01-01T00:00:00Z' } },
    { content: { number: 104, createdAt: '2026-01-04T00:00:00Z' } },
    { content: { number: 102, createdAt: '2026-01-02T00:00:00Z' } },
    { content: { number: 107, createdAt: '2026-01-07T00:00:00Z' } },
    { content: { number: 103, createdAt: '2026-01-03T00:00:00Z' } },
    { content: { number: 105, createdAt: '2026-01-05T00:00:00Z' } },
  ];

  const result = splitWorkingByCapacity(items);

  assert.deepEqual(result.keep.map((item) => item.content.number), [101, 102, 103, 104, 105]);
  assert.deepEqual(result.overflow.map((item) => item.content.number), [106, 107]);
});

test('issue number is deterministic tie breaker for Working capacity', () => {
  const createdAt = '2026-01-01T00:00:00Z';
  const items = [9, 3, 7, 1, 5, 2].map((number) => ({ content: { number, createdAt } }));
  const result = splitWorkingByCapacity(items);
  assert.deepEqual(result.keep.map((item) => item.content.number), [1, 2, 3, 5, 7]);
  assert.deepEqual(result.overflow.map((item) => item.content.number), [9]);
});
