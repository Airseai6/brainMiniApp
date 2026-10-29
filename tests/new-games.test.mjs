import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const balance = require('../utils/balance.js');
const sudoku = require('../utils/sudoku.js');
const nono = require('../utils/nonogram.js');
const euler = require('../utils/euler.js');
const fox = require('../utils/fox.js');
const mc = require('../utils/river-mc.js');
const mathler = require('../utils/mathler.js');
const sudoku6 = require('../utils/sudoku6.js');
const lightsout = require('../utils/lightsout.js');
const water = require('../utils/water.js');
const random = require('../utils/random.js');
const dice = require('../utils/diceduel.js');

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


test('fox: possible set updates and is exposed for ghost fox', () => {
  let s = fox.newGame(1, 0);
  assert.deepEqual(s.possible, [0, 1, 2, 3, 4]);
  s = fox.probe(s, 4);
  assert.equal(s.checked.length, 1);
  assert.ok(s.possible.length > 0);
});

test('river mc: rejects empty/overloaded boat and unsafe move', () => {
  const g = mc.newGame();
  assert.equal(mc.cross(g, 0, 0).ok, false);
  assert.equal(mc.cross(g, 2, 1).ok, false);
  const safe = mc.cross(g, 1, 1);
  assert.equal(safe.ok, true);
  assert.deepEqual(safe.state.left, { m: 2, c: 2 });
  const back = mc.newGame();
  back.boat = 'right';
  back.left = { m: 2, c: 2 };
  const unsafe = mc.cross(back, 0, 1);
  assert.equal(unsafe.ok, false);
});

test('mathler: daily deterministic, valid equations and feedback', () => {
  assert.ok(mathler.EQUATIONS.length > 1000);
  const a = mathler.dailyHidden(new Date(2026, 9, 29));
  const b = mathler.dailyHidden(new Date(2026, 9, 29));
  assert.equal(a.text, b.text);
  for (const e of mathler.EQUATIONS.slice(0, 50)) assert.equal(mathler.parse(e.text).valid, true);
  const marks = mathler.feedback(a.text, a.text);
  assert.ok(marks.every((m) => m === 'hit'));
  const wrong = mathler.feedback('10+10=20', '10+10=20');
  assert.ok(wrong.every((m) => m === 'hit'));
});

test('sudoku6: generated puzzle is unique and solved', () => {
  const p = sudoku6.makePuzzle();
  assert.equal(sudoku6.solveCount(p.puzzle, 2), 1);
  assert.equal(sudoku6.isSolved(p.solution), true);
  assert.equal(sudoku6.isSolved(p.puzzle), false);
  assert.ok(p.puzzle.flat().filter((x) => !x).length >= 15);
});

test('lightsout: press parity, solvable boards and solver', () => {
  const g = lightsout.emptyGrid(5);
  const twice = lightsout.applyPress(lightsout.applyPress(g, 2, 2), 2, 2);
  assert.equal(lightsout.isSolved(twice), true);
  const p = lightsout.makePuzzle(5, random.mulberry32(12345), 9);
  assert.equal(lightsout.isSolved(p.grid), false);
  const sol = lightsout.solve(p.grid);
  assert.ok(sol && sol.length > 0);
  let board = lightsout.clone(p.grid);
  for (const [r, c] of sol) board = lightsout.applyPress(board, r, c);
  assert.equal(lightsout.isSolved(board), true);
});

test('water: fill/pour/empty and BFS solution', () => {
  const caps = [3, 5, 8];
  const full = water.fill([0, 0, 0], caps, 1);
  assert.equal(full.ok, true);
  assert.deepEqual(full.jugs, [0, 5, 0]);
  const poured = water.pour(full.jugs, caps, 1, 0);
  assert.deepEqual(poured.jugs, [3, 2, 0]);
  const empty = water.empty(poured.jugs, caps, 1);
  assert.deepEqual(empty.jugs, [3, 0, 0]);
  const path = water.solve(caps, 4);
  assert.ok(path && path.length > 0);
  const p = water.dailyPuzzle(new Date(2026, 9, 29));
  assert.ok(p.caps.length === 3 && p.target > 0);
  assert.ok(water.solve(p.caps, p.target).length > 0);
});

test('dice duel: non-transitive cycle and round flow', () => {
  const A = dice.DICE.find((d) => d.id === 'A');
  const B = dice.DICE.find((d) => d.id === 'B');
  const C = dice.DICE.find((d) => d.id === 'C');
  assert.ok(dice.winProbability(A, B) > 0.5);
  assert.ok(dice.winProbability(B, C) > 0.5);
  assert.ok(dice.winProbability(C, A) > 0.5);
  let m = dice.newMatch();
  const r = dice.chooseDie(m, 'A');
  assert.equal(r.ok, true);
  assert.ok(r.state.playerRoll >= 1 && r.state.aiRoll >= 1);
  assert.equal(r.state.history.length, 1);
});
