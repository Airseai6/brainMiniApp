import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);

const digits = require('../utils/digits.js');
const fox = require('../utils/fox.js');
const fifteen = require('../utils/fifteen.js');
const tf = require('../utils/twentyfour.js');
const river = require('../utils/river.js');
const fusion = require('../utils/fusion.js');

test('digits: feedback and validation', () => {
  assert.deepEqual(digits.scoreGuess([1, 2, 3, 4], [1, 2, 3, 4]), { a: 4, b: 0 });
  assert.deepEqual(digits.scoreGuess([1, 2, 3, 4], [4, 3, 2, 1]), { a: 0, b: 4 });
  assert.deepEqual(digits.scoreGuess([1, 2, 3, 4], [1, 3, 2, 4]), { a: 2, b: 2 });
  assert.equal(digits.validateGuess([1, 2, 3, 4], 'normal').ok, true);
  assert.equal(digits.validateGuess([1, 1, 2, 3], 'normal').ok, false);
  assert.equal(digits.validateGuess([1, 1, 2, 3], 'hard').ok, true);
  const d = digits.dailySecret('2026-10-28');
  assert.equal(d.length, 4);
  assert.equal(new Set(d).size, 4);
});

test('fox: path probe moves fox and can catch', () => {
  let s = fox.newGame(1, 2);
  assert.equal(s.fox, 2);
  s = fox.probe(s, 2);
  assert.equal(s.caught, true);
  let s2 = fox.newGame(1, 0);
  s2 = fox.probe(s2, 4);
  assert.notEqual(s2.fox, 0);
  assert.equal(s2.checked.length, 1);
});

test('fifteen: solvable shuffle and slide', () => {
  for (let i = 0; i < 20; i++) {
    const t = fifteen.shuffle(3, 80);
    assert.equal(fifteen.isSolvable(t, 3), true);
    assert.equal(fifteen.isSolved(t), false);
  }
  const solved = fifteen.solved(3);
  assert.equal(fifteen.isSolved(solved), true);
  const next = fifteen.slide(solved, 3, 7);
  assert.ok(next);
  assert.equal(fifteen.isSolved(next), false);
  assert.equal(fifteen.manhattan(solved), 0);
});

test('twentyfour: solver finds fractional solution', () => {
  const sol = tf.solve24([3, 3, 8, 8], 1);
  assert.equal(sol.length, 1);
  assert.match(sol[0], /24|8/);
  const p = tf.randomPuzzle();
  assert.equal(p.nums.length, 4);
  assert.ok(tf.solve24(p.nums, 1).length > 0);
});

test('river: known solution wins', () => {
  let s = river.newGame();
  const seq = ['sheep', null, 'wolf', 'sheep', 'cabbage', null, 'sheep'];
  for (const id of seq) {
    const r = river.cross(s, id);
    assert.equal(r.ok, true);
    s = r.state;
  }
  assert.equal(s.won, true);
  assert.equal(s.moves, 7);
});


test('fusion: merge and move', () => {
  assert.deepEqual(fusion.mergeLine([1, 1, 0, 0]), [2, 0, 0, 0]);
  assert.deepEqual(fusion.mergeLine([1, 1, 1, 1]), [2, 2, 0, 0]);
  const g = fusion.newGame();
  assert.equal(g.goalEv, fusion.GOAL_EV);
  const dirs = ['left', 'right', 'up', 'down'];
  let moved = false;
  for (const d of dirs) {
    const r = fusion.move(g, d);
    if (r.ok) {
      moved = true;
      assert.ok(r.state.energyEv >= 0);
      assert.match(fusion.formatEnergy(r.state.energyEv), /MeV|GeV/);
      break;
    }
  }
  assert.equal(moved, true);
});
