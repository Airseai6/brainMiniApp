// 汉诺塔纯逻辑：验证移动、判断胜利、BFS 求最短下一步（提示）。
// 状态：{ n, pegs: [[4,3,2,1], [], []] }，数组末尾是顶部。

function newState(n = 4) {
  const pegs = [[], [], []];
  for (let i = n; i >= 1; i--) pegs[0].push(i);
  return { n, pegs, moves: 0 };
}

function clone(state) {
  return { n: state.n, pegs: state.pegs.map(p => p.slice()), moves: state.moves || 0 };
}

function top(peg) {
  return peg.length ? peg[peg.length - 1] : 0;
}

function move(state, from, to) {
  if (from === to) return { ok: false, error: '起点和终点相同' };
  if (from < 0 || from > 2 || to < 0 || to > 2) return { ok: false, error: '柱子不存在' };
  const src = state.pegs[from];
  const dst = state.pegs[to];
  if (!src.length) return { ok: false, error: '这根柱子上没有圆盘' };
  const disk = src[src.length - 1];
  if (dst.length && top(dst) < disk) return { ok: false, error: '大盘不能压小盘' };
  const next = clone(state);
  next.pegs[from].pop();
  next.pegs[to].push(disk);
  next.moves += 1;
  return { ok: true, state: next };
}

function isWin(state) {
  return state.pegs[0].length === 0 && state.pegs[1].length === 0 && state.pegs[2].length === state.n;
}

function encode(state) {
  return state.pegs.map(p => p.join('.')).join('|');
}

function decode(str) {
  const parts = str.split('|');
  return parts.map(p => (p ? p.split('.').map(Number) : []));
}

// 从当前状态到目标状态的最短解，返回第一步；用于提示。
function hintMove(state) {
  if (isWin(state)) return null;
  const start = encode(state);
  const goal = encode({ pegs: [[], [], Array.from({ length: state.n }, (_, i) => state.n - i)], n: state.n, moves: 0 });
  const q = [{ key: start, first: null }];
  const seen = new Set([start]);
  for (let head = 0; head < q.length; head++) {
    const cur = q[head];
    const pegs = decode(cur.key);
    for (let from = 0; from < 3; from++) {
      for (let to = 0; to < 3; to++) {
        if (from === to) continue;
        const src = pegs[from];
        if (!src.length) continue;
        const disk = src[src.length - 1];
        const dst = pegs[to];
        if (dst.length && dst[dst.length - 1] < disk) continue;
        const nextPegs = pegs.map(p => p.slice());
        nextPegs[from].pop();
        nextPegs[to].push(disk);
        const nextKey = nextPegs.map(p => p.join('.')).join('|');
        if (seen.has(nextKey)) continue;
        const first = cur.first || { from, to };
        if (nextKey === goal) return first;
        seen.add(nextKey);
        q.push({ key: nextKey, first });
      }
    }
  }
  return null;
}

module.exports = { newState, clone, move, isWin, hintMove, top };
