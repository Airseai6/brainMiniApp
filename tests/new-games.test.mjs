import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const balance = require('../utils/balance.js');
const sudoku = require('../utils/sudoku.js');
const nono = require('../utils/nonogram.js');
const euler = require('../utils/euler.js');
const monty = require('../utils/monty.js');

test('balance: candidate filtering and guess', () => {
  assert.equal(balance.initialCandidates().length, 24);
  assert.equal(balance.compare({ coin: 5, heavy: true }, [5], [6]), 'left');
  assert.equal(balance.compare({ coin: 5, heavy: false }, [5], [6]), 'right');
  const state = balance.newGame({ coin: 7, heavy: false });
  const r = balance.weigh(state, [1, 2, 3, 4], [5, 6, 7, 8]);
  assert.equal(r.ok, true);
  assert.ok(r.state.candidates.length < 24 && r.state.candidates.length > 0);
});

test('sudoku: unique puzzle', () => {
  const p = sudoku.makePuzzle();
  assert.equal(sudoku.isSolved(p.solution), true);
  assert.equal(sudoku.solveCount(p.puzzle, 2), 1);
  assert.equal(sudoku.isSolved(p.puzzle), false);
});

test('nonogram: clues and solve check', () => {
  const p = nono.PUZZLES[0];
  const clues = nono.cluesOf(p.grid);
  assert.equal(clues.rows.length, 5);
  assert.equal(clues.cols.length, 5);
  assert.equal(nono.isSolved(p.grid, p.grid), true);
  assert.equal(nono.isSolved(nono.emptyGrid(), p.grid), false);
});

test('euler: ring has path, seven bridges does not', () => {
  const ring = euler.levelById('ring');
  const bridges = euler.levelById('bridges');
  assert.equal(euler.hasEulerPath(ring), true);
  assert.equal(euler.hasEulerPath(bridges), false);
  assert.equal(euler.oddNodes(bridges).length, 4);
});

test('monty: switch rate near two thirds', () => {
  const r = monty.simulate(4000);
  assert.ok(r.switchRate > 0.62 && r.switchRate < 0.72);
  const s = monty.choose(monty.newRound(), 0);
  assert.equal(s.phase, 'decide');
  assert.ok(s.opened !== s.car && s.opened !== s.picked);
});
