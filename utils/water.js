// 倒水问题：三个水壶，装满/倒空/互倒，量出目标水量。BFS 求最短步骤。
const { mulberry32, seedFromDate, randomSeed, randInt, shuffle } = require('./random');

function key(jugs) { return jugs.join(','); }

function isSolved(jugs, target) { return jugs.includes(target); }

function fill(jugs, caps, i) {
  const next = jugs.slice();
  if (next[i] === caps[i]) return { ok: false, error: '这个壶已经满了' };
  next[i] = caps[i];
  return { ok: true, jugs: next, text: `装满 ${i + 1} 号壶` };
}

function empty(jugs, caps, i) {
  const next = jugs.slice();
  if (next[i] === 0) return { ok: false, error: '这个壶已经空了' };
  next[i] = 0;
  return { ok: true, jugs: next, text: `倒空 ${i + 1} 号壶` };
}

function pour(jugs, caps, from, to) {
  if (from === to) return { ok: false, error: '不能倒给自己' };
  if (jugs[from] === 0) return { ok: false, error: '源壶是空的' };
  if (jugs[to] === caps[to]) return { ok: false, error: '目标壶已经满了' };
  const next = jugs.slice();
  const amount = Math.min(next[from], caps[to] - next[to]);
  next[from] -= amount;
  next[to] += amount;
  return { ok: true, jugs: next, text: `把 ${from + 1} 号壶倒入 ${to + 1} 号壶` };
}

function solveFrom(startJugs, caps, target) {
  const start = startJugs.slice();
  if (isSolved(start, target)) return [];
  const queue = [start];
  const prev = new Map([[key(start), null]]);
  const action = new Map();
  let found = null;
  while (queue.length) {
    const cur = queue.shift();
    if (isSolved(cur, target)) { found = cur; break; }
    const nexts = [];
    for (let i = 0; i < caps.length; i++) {
      nexts.push(fill(cur, caps, i));
      nexts.push(empty(cur, caps, i));
      for (let j = 0; j < caps.length; j++) nexts.push(pour(cur, caps, i, j));
    }
    for (const r of nexts) {
      if (!r.ok) continue;
      const k = key(r.jugs);
      if (prev.has(k)) continue;
      prev.set(k, key(cur));
      action.set(k, r.text);
      queue.push(r.jugs);
    }
  }
  if (!found) return null;
  const path = [];
  let k = key(found);
  while (prev.get(k) !== null) {
    path.unshift(action.get(k));
    k = prev.get(k);
  }
  return path;
}

function solve(caps, target) {
  return solveFrom(caps.map(() => 0), caps, target);
}

function makePuzzle(rng) {
  for (let attempt = 0; attempt < 40; attempt++) {
    const caps = shuffle([3, 4, 5, 6, 7, 8, 9], rng).slice(0, 3).sort((a, b) => a - b);
    const max = caps[caps.length - 1];
    const target = randInt(rng, 2, max - 1);
    const path = solve(caps, target);
    if (path && path.length >= 3) return { caps, target, solution: path };
  }
  return { caps: [3, 5, 8], target: 4, solution: solve([3, 5, 8], 4) };
}

function dailyPuzzle(date = new Date()) {
  return makePuzzle(mulberry32(seedFromDate(date, 8317)));
}

function randomPuzzle() {
  return makePuzzle(mulberry32(randomSeed()));
}

function nextHint(jugs, caps, target) {
  const path = solveFrom(jugs, caps, target);
  return path && path.length ? path[0] : null;
}

module.exports = { key, isSolved, fill, empty, pour, solve, solveFrom, makePuzzle, dailyPuzzle, randomPuzzle, nextHint };
