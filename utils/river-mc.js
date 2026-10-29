// 过河第二关：3 传教士 + 3 野人，船容 2，必须有人划船。
// 任意一岸如果传教士 > 0 且野人 > 传教士，则传教士会被吃。
function newGame() {
  return {
    boat: 'left',
    left: { m: 3, c: 3 },
    moves: 0,
    won: false,
    lost: false,
    reason: ''
  };
}

function countsOn(state, side) {
  if (side === 'left') return { ...state.left };
  return { m: 3 - state.left.m, c: 3 - state.left.c };
}

function unsafe(counts) {
  if (counts.m > 0 && counts.c > counts.m) return '野人多于传教士，传教士被吃了';
  return null;
}

function cross(state, m, c) {
  const total = m + c;
  if (state.won || state.lost) return { ok: false, state, error: '这一局已经结束' };
  if (total < 1) return { ok: false, state, error: '船上至少要有 1 个人' };
  if (total > 2) return { ok: false, state, error: '船最多坐 2 个人' };
  const from = state.boat;
  const available = countsOn(state, from);
  if (m > available.m || c > available.c) return { ok: false, state, error: '这一岸没有这么多人' };
  const next = { ...state, boat: from === 'left' ? 'right' : 'left', left: { ...state.left }, moves: state.moves + 1 };
  if (from === 'left') { next.left.m -= m; next.left.c -= c; }
  else { next.left.m += m; next.left.c += c; }
  const badLeft = unsafe(countsOn(next, 'left'));
  const badRight = unsafe(countsOn(next, 'right'));
  if (badLeft || badRight) {
    return { ok: false, state, error: badLeft || badRight };
  }
  const right = countsOn(next, 'right');
  if (next.boat === 'right' && right.m === 3 && right.c === 3) next.won = true;
  return { ok: true, state: next };
}

module.exports = { newGame, countsOn, unsafe, cross };
