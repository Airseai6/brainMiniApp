// 聚变堆叠：4×4 合并，同种核素合并到下一档；累计真实 Q 值，目标 1 GeV。
const SIZE = 4;
const LADDER = [
  { level: 1, name: '氘', short: 'D' },
  { level: 2, name: '氦-4', short: 'He' },
  { level: 3, name: '铍-8', short: 'Be' },
  { level: 4, name: '氧-16', short: 'O' },
  { level: 5, name: '硫-32', short: 'S' },
  { level: 6, name: '镍-64', short: 'Ni' }
];
// 合并后得到的能级 -> 该次聚变释放的 Q 值（MeV）
const Q_MEV = { 2: 23.85, 3: -0.09, 4: 14.44, 5: 16.54, 6: 28.4 };
const MEV_TO_EV = 1e6;
const GOAL_EV = 1e9; // 1 GeV
const TARGET = 6;

function newBoard() { return Array(SIZE * SIZE).fill(0); }

function addRandom(b, rng = Math.random) {
  const empty = [];
  for (let i = 0; i < b.length; i++) if (!b[i]) empty.push(i);
  if (!empty.length) return b;
  const idx = empty[Math.floor(rng() * empty.length)];
  const next = b.slice();
  next[idx] = rng() < 0.9 ? 1 : 2;
  return next;
}

function newGame() {
  let b = newBoard();
  b = addRandom(addRandom(b));
  return { board: b, energyEv: 0, goalEv: GOAL_EV, score: 0, moves: 0, won: false, lost: false };
}

function lineOf(board, dir, index) {
  const out = [];
  for (let k = 0; k < SIZE; k++) {
    let r;
    let c;
    if (dir === 'left') { r = index; c = k; }
    else if (dir === 'right') { r = index; c = SIZE - 1 - k; }
    else if (dir === 'up') { r = k; c = index; }
    else { r = SIZE - 1 - k; c = index; }
    out.push(r * SIZE + c);
  }
  return out;
}

function mergeLineDetailed(vals) {
  const compact = vals.filter((v) => v !== 0);
  const out = [];
  const merges = [];
  for (let i = 0; i < compact.length; i++) {
    if (compact[i] === compact[i + 1] && compact[i] < TARGET) {
      const to = compact[i] + 1;
      out.push(to);
      merges.push({ to, q: Q_MEV[to] || 0 });
      i++;
    } else out.push(compact[i]);
  }
  while (out.length < SIZE) out.push(0);
  return { out, merges };
}

function mergeLine(vals) { return mergeLineDetailed(vals).out; }

function move(state, dir) {
  if (state.won || state.lost) return { ok: false, state };
  const board = state.board.slice();
  let gainedEv = 0;
  for (let i = 0; i < SIZE; i++) {
    const idxs = lineOf(board, dir, i);
    const vals = idxs.map((x) => board[x]);
    const { out, merges } = mergeLineDetailed(vals);
    for (let k = 0; k < SIZE; k++) board[idxs[k]] = out[k];
    gainedEv += merges.reduce((s, m) => s + m.q * MEV_TO_EV, 0);
  }
  const changed = board.some((v, i) => v !== state.board[i]);
  if (!changed) return { ok: false, state };
  const energyEv = state.energyEv + gainedEv;
  const next = {
    ...state,
    board: addRandom(board),
    energyEv,
    score: Math.round(energyEv / MEV_TO_EV),
    moves: state.moves + 1
  };
  next.won = energyEv >= state.goalEv;
  next.lost = !next.won && !canMove(next.board);
  return { ok: true, state: next };
}

function canMove(board) {
  if (board.some((v) => !v)) return true;
  for (let r = 0; r < SIZE; r++) for (let c = 0; c < SIZE; c++) {
    const v = board[r * SIZE + c];
    if (c + 1 < SIZE && board[r * SIZE + c + 1] === v && v < TARGET) return true;
    if (r + 1 < SIZE && board[(r + 1) * SIZE + c] === v && v < TARGET) return true;
  }
  return false;
}

function labelOf(v) {
  const e = LADDER.find((x) => x.level === v);
  return e ? e.short : '';
}

function nameOf(v) {
  const e = LADDER.find((x) => x.level === v);
  return e ? e.name : '';
}

function boardView(board) {
  return board.map((v) => ({ v, label: labelOf(v), name: nameOf(v) }));
}

function formatEnergy(ev) {
  if (ev >= 1e9) return `${(ev / 1e9).toFixed(2)} GeV`;
  return `${(ev / 1e6).toFixed(1)} MeV`;
}

function progressPercent(state) {
  return Math.max(0, Math.min(100, (state.energyEv / state.goalEv) * 100));
}

function topLevel(board) { return Math.max(...board, 0); }

module.exports = {
  SIZE, LADDER, TARGET, GOAL_EV, Q_MEV,
  newGame, move, canMove, labelOf, nameOf, boardView, mergeLine,
  formatEnergy, progressPercent, topLevel
};
