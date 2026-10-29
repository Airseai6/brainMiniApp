// 过河（狼·羊·菜）纯逻辑：船每次带 1 样或空船；农夫不在的一岸，狼会吃羊、羊会吃菜。
const ITEMS = [
  { id: 'wolf', label: '狼', icon: '🐺' },
  { id: 'sheep', label: '羊', icon: '🐑' },
  { id: 'cabbage', label: '菜', icon: '🥬' }
];

function newGame() {
  return { boat: 'left', left: { wolf: 1, sheep: 1, cabbage: 1 }, moves: 0, lost: false, won: false, reason: '' };
}

function other(side) { return side === 'left' ? 'right' : 'left'; }

function countsOn(state, side) {
  const counts = {};
  for (const it of ITEMS) counts[it.id] = state.left[it.id] || 0;
  if (side === 'left') return counts;
  const right = {};
  for (const it of ITEMS) right[it.id] = 1 - counts[it.id];
  return right;
}

function unsafe(counts, guard) {
  if (guard) return null;
  if (counts.wolf > 0 && counts.sheep > 0) return '狼和羊单独在一起，羊被吃了';
  if (counts.sheep > 0 && counts.cabbage > 0) return '羊和菜单独在一起，菜被吃了';
  return null;
}

function cross(state, itemId) {
  if (state.won || state.lost) return { ok: false, state, error: '这一局已经结束' };
  const next = {
    ...state,
    boat: other(state.boat),
    left: { ...state.left },
    moves: state.moves + 1
  };
  if (itemId) {
    if (state.boat === 'left') {
      if (!next.left[itemId]) return { ok: false, state, error: '物品不在这一岸' };
      next.left[itemId] = 0;
    } else {
      if (next.left[itemId] === 1) return { ok: false, state, error: '物品不在这一岸' };
      next.left[itemId] = 1;
    }
  }
  const leftCounts = countsOn(next, 'left');
  const rightCounts = countsOn(next, 'right');
  const leftGuard = next.boat === 'left';
  const rightGuard = next.boat === 'right';
  const badLeft = unsafe(leftCounts, leftGuard);
  const badRight = unsafe(rightCounts, rightGuard);
  if (badLeft || badRight) {
    next.lost = true;
    next.reason = badLeft || badRight;
  } else {
    const allRight = ITEMS.every((it) => rightCounts[it.id] === 1);
    if (allRight && next.boat === 'right') next.won = true;
  }
  return { ok: true, state: next, error: next.reason || '' };
}

function hint() {
  return '最短解：带羊过去 → 空船回来 → 带狼过去 → 带羊回来 → 带菜过去 → 空船回来 → 带羊过去。';
}

module.exports = { ITEMS, newGame, cross, countsOn, other, hint };
