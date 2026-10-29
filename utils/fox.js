// 抓狐狸：路径/环上的每日排查。狐狸每天沿相邻洞移动，且远离你今天的排查点。
function neighbors(i, n, cyclic) {
  const out = [];
  if (i > 0) out.push(i - 1);
  if (i < n - 1) out.push(i + 1);
  if (cyclic) {
    if (i === 0) out.push(n - 1);
    if (i === n - 1) out.push(0);
  }
  return [...new Set(out)];
}

function dist(a, b, n, cyclic) {
  return cyclic ? Math.min(Math.abs(a - b), n - Math.abs(a - b)) : Math.abs(a - b);
}

function escape(fox, check, n, cyclic) {
  const nbs = neighbors(fox, n, cyclic);
  nbs.sort((a, b) => dist(b, check, n, cyclic) - dist(a, check, n, cyclic));
  return nbs[0];
}

function newGame(level = 1, forceStart) {
  const cyclic = level === 2;
  const n = 5;
  const fox = Number.isInteger(forceStart) ? forceStart : Math.floor(Math.random() * n);
  return {
    level,
    n,
    cyclic,
    fox,
    day: 1,
    maxDay: level === 1 ? 8 : 12,
    caught: false,
    lost: false,
    checked: []
  };
}

function probe(state, check) {
  if (state.caught || state.lost) return state;
  const next = { ...state, checked: state.checked.concat([check]) };
  if (check === state.fox) {
    next.caught = true;
    return next;
  }
  next.fox = escape(state.fox, check, state.n, state.cyclic);
  next.day = state.day + 1;
  if (next.day > state.maxDay) next.lost = true;
  return next;
}

function possiblePositions(state) {
  // 仅用于提示：从所有位置出发，按同样策略模拟，得到仍可能的位置
  const poss = new Set();
  const startChecked = state.checked || [];
  for (let start = 0; start < state.n; start++) {
    let fox = start;
    let ok = true;
    for (const c of startChecked) {
      if (fox === c) { ok = false; break; }
      fox = escape(fox, c, state.n, state.cyclic);
    }
    if (ok) poss.add(fox);
  }
  return [...poss].sort((a, b) => a - b);
}

function hint(state) {
  if (state.caught) return '已经抓到了。';
  if (state.lost) return '天数用完了，狐狸跑了。';
  const p = possiblePositions(state);
  if (state.cyclic) {
    return `环上：不要只追一个方向。剩余可能位置：${p.map((x) => x + 1).join('、')}。`;
  }
  return `路径上：从一端开始逐格排查。剩余可能位置：${p.map((x) => x + 1).join('、')}。`;
}

module.exports = { newGame, probe, neighbors, escape, possiblePositions, hint };
