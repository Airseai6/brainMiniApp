// Nim（最后一颗）的纯逻辑。小程序页面和 Node 测试共用。
// 状态：{ piles: [3,4,5], misere: false }
// 普通模式：拿最后一颗者赢；misere 模式：拿最后一颗者输。
// 用极小化搜索（状态很小）求最优着法，顺便用于提示和 AI。

function clone(state) {
  return { piles: state.piles.slice(), misere: !!state.misere };
}

function total(state) {
  return state.piles.reduce((a, b) => a + b, 0);
}

function terminalWinner(state) {
  // 返回当前“轮到的人”的结果：true=当前玩家最终会赢。
  // 没有石子时：上一手拿走了最后一颗。
  if (total(state) !== 0) return null;
  // 普通模式：上一手拿最后者赢 -> 当前玩家输；
  // misere：上一手拿最后者输 -> 当前玩家赢。
  return !!state.misere;
}

function keyOf(state) {
  return state.piles.join(',') + '|' + (state.misere ? 'm' : 'n');
}

const memo = new Map();

function solve(state) {
  const term = terminalWinner(state);
  if (term !== null) return { win: term, move: null };
  const k = keyOf(state);
  if (memo.has(k)) return memo.get(k);

  const moves = [];
  for (let i = 0; i < state.piles.length; i++) {
    for (let take = 1; take <= state.piles[i]; take++) {
      const next = clone(state);
      next.piles[i] -= take;
      moves.push({ pile: i, take, next });
    }
  }

  for (const m of moves) {
    const child = solve(m.next);
    // 如果走完后对手是必败，则当前有必胜着法。
    if (!child.win) {
      const res = { win: true, move: { pile: m.pile, take: m.take } };
      memo.set(k, res);
      return res;
    }
  }
  const res = { win: false, move: moves.length ? { pile: moves[0].pile, take: moves[0].take } : null };
  memo.set(k, res);
  return res;
}

function bestMove(state) {
  const r = solve(state);
  return r.move;
}

function take(state, pile, count) {
  if (pile < 0 || pile >= state.piles.length) return { ok: false, error: '没有这堆' };
  if (!Number.isInteger(count) || count < 1) return { ok: false, error: '至少拿一颗' };
  if (count > state.piles[pile]) return { ok: false, error: '这堆不够' };
  const next = clone(state);
  next.piles[pile] -= count;
  return { ok: true, state: next };
}

function xorOf(piles) {
  return piles.reduce((a, b) => a ^ b, 0);
}

function hintText(state) {
  if (total(state) === 0) return state.misere ? '上一手拿了最后一颗，按规则他输了。' : '上一手拿了最后一颗，按规则他赢了。';
  const x = xorOf(state.piles);
  const lines = state.piles.map((p, i) => `堆 ${'ABC'[i]}：${p} = ${p.toString(2).padStart(3, '0')}`);
  lines.push(`异或和：${x} = ${x.toString(2).padStart(3, '0')}`);
  const m = bestMove(state);
  if (m) lines.push(`建议：从堆 ${'ABC'[m.pile]} 拿走 ${m.take} 颗`);
  if (state.misere) lines.push('（取最后者输模式：异或仅作参考，建议来自最优搜索；若局面必败，只能尽量拖延）');
  return lines.join('\n');
}

function randomPiles() {
  const piles = [];
  for (let i = 0; i < 3; i++) piles.push(2 + Math.floor(Math.random() * 6));
  if (piles.every((x) => x === 2) && Math.random() < 0.6) piles[0] = 5;
  return piles;
}

module.exports = {
  newState(piles = [3, 4, 5], misere = false) { return { piles: piles.slice(), misere: !!misere }; },
  clone,
  randomPiles,
  total,
  take,
  solve,
  bestMove,
  xorOf,
  hintText,
  terminalWinner
};
