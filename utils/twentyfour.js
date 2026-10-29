// 24 点纯逻辑：分数四则、穷举求解、随机生成有解的牌。
const OPS = ['+', '−', '×', '÷'];

function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { [a, b] = [b, a % b]; } return a || 1; }
function rat(n, d = 1) {
  if (d === 0) return null;
  const sign = d < 0 ? -1 : 1;
  const g = gcd(n, d);
  return { n: (sign * n) / g, d: (sign * d) / g };
}
const add = (a, b) => rat(a.n * b.d + b.n * a.d, a.d * b.d);
const sub = (a, b) => rat(a.n * b.d - b.n * a.d, a.d * b.d);
const mul = (a, b) => rat(a.n * b.n, a.d * b.d);
const div = (a, b) => (b.n === 0 ? null : rat(a.n * b.d, a.d * b.n));
const FN = { '+': add, '−': sub, '×': mul, '÷': div };
const is24 = (a) => a && a.n === 24 * a.d;
const str = (a) => (!a ? '—' : (a.d === 1 ? String(a.n) : `${a.n}/${a.d}`));

function solve24(nums, limit = 1) {
  const found = [];
  const items = nums.map((v) => ({ v: rat(v), e: String(v) }));
  function walk(list) {
    if (found.length >= limit) return;
    if (list.length === 1) {
      if (is24(list[0].v)) found.push(list[0].e);
      return;
    }
    for (let i = 0; i < list.length; i++) for (let j = 0; j < list.length; j++) {
      if (i === j) continue;
      const a = list[i];
      const b = list[j];
      const rest = list.filter((_, k) => k !== i && k !== j);
      for (const op of OPS) {
        if ((op === '+' || op === '×') && i > j) continue;
        const v = FN[op](a.v, b.v);
        if (!v) continue;
        walk(rest.concat([{ v, e: `(${a.e} ${op} ${b.e})` }]));
        if (found.length >= limit) return;
      }
    }
  }
  walk(items);
  return found;
}

function randomPuzzle() {
  for (let tries = 0; tries < 5000; tries++) {
    const nums = Array.from({ length: 4 }, () => 1 + Math.floor(Math.random() * 10));
    const sol = solve24(nums, 1);
    if (sol.length) return { nums, solution: sol[0] };
  }
  return { nums: [3, 3, 8, 8], solution: solve24([3, 3, 8, 8], 1)[0] };
}

module.exports = { OPS, rat, add, sub, mul, div, is24, str, solve24, randomPuzzle };
