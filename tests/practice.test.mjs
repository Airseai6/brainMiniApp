import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const practice = require('../utils/practice.js');
const games = require('../data/games.js');

test('daily practice: deterministic 3 distinct keys', () => {
  const keys = games.map((g) => g.key);
  const a = practice.dailyKeys(keys, '2026-10-29', 3);
  const b = practice.dailyKeys(keys, '2026-10-29', 3);
  assert.deepEqual(a, b);
  assert.equal(a.length, 3);
  assert.equal(new Set(a).size, 3);
  const c = practice.dailyKeys(keys, '2026-10-30', 3);
  assert.equal(c.length, 3);
});

test('random practice: returns an existing key', () => {
  const keys = games.map((g) => g.key);
  for (let i = 0; i < 20; i++) {
    const k = practice.randomKey(keys);
    assert.ok(keys.includes(k));
  }
});

test('today key format', () => {
  assert.match(practice.todayKey(new Date(2026, 9, 29)), /^2026-10-29$/);
});
