import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const nim = require('../utils/nim.js');
const hanoi = require('../utils/hanoi.js');
const daily = require('../utils/daily.js');
const games = require('../data/games.js');

const ROOT = path.resolve(import.meta.dirname, '..');

test('game list has 17 entries and valid native flags', () => {
  assert.equal(games.length, 17);
  const keys = new Set(games.map(g => g.key));
  assert.equal(keys.size, 17);
  assert.ok(games.some(g => g.key === 'nim' && g.native));
  assert.ok(games.some(g => g.key === 'hanoi' && g.native));
  assert.ok(games.some(g => g.key === 'fusion-stack'));
  assert.ok(games.some(g => g.key === 'sudoku' && g.replayable));
  assert.ok(games.some(g => g.key === 'mathler' && g.replayable));
  assert.ok(games.some(g => g.key === 'lights-out' && g.replayable));
  assert.ok(games.some(g => g.key === 'water' && g.replayable));
  assert.ok(games.some(g => g.key === 'hanoi' && !g.replayable));
});

test('daily: bank has no short repeat cycle', () => {
  assert.ok(daily.BANK.length >= 50);
  const seen = new Set();
  for (let i = 0; i < 30; i++) {
    const d = new Date(2026, 9, 1 + i);
    const q = daily.getDailyQuestion(d);
    const key = q.q;
    assert.ok(!seen.has(key), 'repeated within 30 days: ' + key);
    seen.add(key);
  }
});

test('nim: normal mode 3/4/5 is winning for the first player', () => {
  const state = nim.newState([3, 4, 5], false);
  const sol = nim.solve(state);
  assert.equal(sol.win, true);
  const move = nim.bestMove(state);
  assert.ok(move);
  const r = nim.take(state, move.pile, move.take);
  assert.ok(r.ok);
  assert.equal(nim.solve(r.state).win, false, 'opponent should be in a losing position');
});

test('nim: misere small states', () => {
  assert.equal(nim.solve(nim.newState([1], true)).win, false); // must take the last, loses
  assert.equal(nim.solve(nim.newState([1, 1], true)).win, true);
  assert.equal(nim.solve(nim.newState([1], false)).win, true); // takes last, wins
  assert.equal(nim.solve(nim.newState([1, 1], false)).win, false);
});

test('nim: hint text includes binary and a legal move', () => {
  const s = nim.newState([3, 4, 5], false);
  const text = nim.hintText(s);
  assert.match(text, /异或和/);
  assert.match(text, /建议/);
  const move = nim.bestMove(s);
  assert.ok(move.take >= 1 && move.take <= s.piles[move.pile]);
});

test('hanoi: minimum moves and BFS hint solves 4 disks', () => {
  const n = 4;
  let state = hanoi.newState(n);
  assert.equal(Math.pow(2, n) - 1, 15);
  let guard = 0;
  while (!hanoi.isWin(state) && guard < 30) {
    const m = hanoi.hintMove(state);
    assert.ok(m, 'hint should exist');
    const r = hanoi.move(state, m.from, m.to);
    assert.ok(r.ok, 'hint move must be legal');
    state = r.state;
    guard++;
  }
  assert.equal(hanoi.isWin(state), true);
  assert.equal(state.moves, 15);
});

test('hanoi: illegal move is rejected', () => {
  const s = hanoi.newState(3);
  const r = hanoi.move(s, 1, 2);
  assert.equal(r.ok, false);
});

test('nim: minimax exhaustive for 3 piles of 0..5 in both modes', () => {
  for (const misere of [false, true]) {
    for (let a = 0; a <= 5; a++) {
      for (let b = 0; b <= 5; b++) {
        for (let c = 0; c <= 5; c++) {
          if (a + b + c === 0) continue;
          const state = nim.newState([a, b, c], misere);
          const sol = nim.solve(state);
          const moves = [];
          for (let p = 0; p < 3; p++) {
            for (let take = 1; take <= state.piles[p]; take++) moves.push({ p, take });
          }
          if (sol.win) {
            assert.ok(sol.move, `winning state must have a move: ${a},${b},${c}, misere=${misere}`);
            const r = nim.take(state, sol.move.pile, sol.move.take);
            assert.ok(r.ok);
            assert.equal(nim.solve(r.state).win, false, `best move must leave losing state: ${a},${b},${c}, misere=${misere}`);
          } else {
            for (const m of moves) {
              const r = nim.take(state, m.p, m.take);
              assert.equal(nim.solve(r.state).win, true, `losing state must have all moves winning for opponent: ${a},${b},${c}, misere=${misere}`);
            }
          }
        }
      }
    }
  }
});

test('daily: every bank answer index is valid', () => {
  for (const q of daily.BANK) {
    assert.ok(Array.isArray(q.options) && q.options.length >= 2);
    assert.ok(Number.isInteger(q.answer) && q.answer >= 0 && q.answer < q.options.length, q.q);
    assert.ok(q.why && q.why.length > 0);
  }
});

test('daily: deterministic by date and answer index valid', () => {
  const a = daily.getDailyQuestion(new Date(2026, 0, 1));
  const b = daily.getDailyQuestion(new Date(2026, 0, 1));
  assert.equal(a.index, b.index);
  assert.equal(a.q, b.q);
  assert.ok(a.answer >= 0 && a.answer < a.options.length);
  const c = daily.getDailyQuestion(new Date(2026, 0, 2));
  assert.ok(c.index >= 0);
});

test('app.json pages all exist', () => {
  const app = JSON.parse(fs.readFileSync(path.join(ROOT, 'app.json'), 'utf8'));
  for (const p of app.pages) {
    for (const ext of ['.js', '.json', '.wxml', '.wxss']) {
      assert.ok(fs.existsSync(path.join(ROOT, p + ext)), `${p}${ext} missing`);
    }
  }
});

test('every JSON file parses', () => {
  const files = [];
  function walk(dir) {
    for (const name of fs.readdirSync(dir)) {
      const p = path.join(dir, name);
      const st = fs.statSync(p);
      if (st.isDirectory()) walk(p);
      else if (name.endsWith('.json')) files.push(p);
    }
  }
  walk(ROOT);
  for (const f of files) JSON.parse(fs.readFileSync(f, 'utf8'));
});
