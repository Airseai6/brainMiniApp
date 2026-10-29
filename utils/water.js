// 倒水问题：三个水壶，装满/倒空/互倒，量出目标水量。BFS 求最短步骤。
const { mulberry32, seedFromDate, randomSeed } = require('./random');

// 精选题库：入门组合 [3,5,8]→6 只作为规则示例，正式题库从进阶开始。
const PUZZLES = [
  { label: '进阶', caps: [5, 7, 11], target: 8 },
  { label: '进阶', caps: [6, 9, 14], target: 7 },
  { label: '挑战', caps: [3, 7, 10], target: 5 },
  { label: '挑战', caps: [5, 9, 14], target: 6 },
  { label: '挑战', caps: [5, 8, 13], target: 4 },
  { label: '大师', caps: [4, 9, 13], target: 3 },
  { label: '大师', caps: [8, 13, 17], target: 2 }
];

function key(jugs) { return jugs.join(','); }
function isSolved(jugs, target) { return jugs.includes(target); }

function gcd(a, b) {
  while (b) { const t = a % b; a = b; b = t; }
  return a;
}
function gcdAll(caps) { return caps.reduce((a, b) => gcd(a, b)); }

function isReachable(caps, target) {
  if (target <= 0 || target > Math.max(...caps)) return false;
  return target % gcdAll(caps) === 0;
}

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

function withSolution(p) {
  const path = solve(p.caps, p.target);
  return { ...p, solution: path || [] };
}

function dailyPuzzle(date = new Date()) {
  const day = Math.floor((Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - Date.UTC(2026, 0, 1)) / 86400000);
  return withSolution(PUZZLES[((day % PUZZLES.length) + PUZZLES.length) % PUZZLES.length]);
}

function randomPuzzle() {
  const rng = mulberry32(randomSeed());
  return withSolution(PUZZLES[Math.floor(rng() * PUZZLES.length)]);
}

function nextHint(jugs, caps, target) {
  const path = solveFrom(jugs, caps, target);
  return path && path.length ? path[0] : null;
}

module.exports = {
  PUZZLES, key, isSolved, gcdAll, isReachable,
  fill, empty, pour, solve, solveFrom,
  dailyPuzzle, randomPuzzle, nextHint
};
