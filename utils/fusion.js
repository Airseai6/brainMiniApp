// 聚变堆叠：4×4 合并，同种核素合并到下一档；目标镍-64（等级 6）。
const SIZE = 4;
const LADDER = [
  { level: 1, name: '氘', short: 'D' },
  { level: 2, name: '氦-4', short: 'He' },
  { level: 3, name: '铍-8', short: 'Be' },
  { level: 4, name: '氧-16', short: 'O' },
  { level: 5, name: '硫-32', short: 'S' },
  { level: 6, name: '镍-64', short: 'Ni' }
];
const TARGET = 6;

function newBoard() { return Array(SIZE * SIZE).fill(0); }

function addRandom(b) {
  const empty = [];
  for (let i = 0; i < b.length; i++) if (!b[i]) empty.push(i);
  if (!empty.length) return b;
  const idx = empty[Math.floor(Math.random() * empty.length)];
  const next = b.slice();
  next[idx] = Math.random() < 0.9 ? 1 : 2;
  return next;
}

function newGame() {
  let b = newBoard();
  b = addRandom(addRandom(b));
  return { board: b, score: 0, moves: 0, won: false, lost: false };
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

function mergeLine(vals) {
  const compact = vals.filter((v) => v !== 0);
  const out = [];
  for (let i = 0; i < compact.length; i++) {
    if (compact[i] === compact[i + 1]) {
      out.push(compact[i] + 1);
      i++;
    } else out.push(compact[i]);
  }
  while (out.length < SIZE) out.push(0);
  return out;
}

function move(state, dir) {
  if (state.won || state.lost) return { ok: false, state };
  const board = state.board.slice();
  let gained = 0;
  for (let i = 0; i < SIZE; i++) {
    const idxs = lineOf(board, dir, i);
    const vals = idxs.map((x) => board[x]);
    const merged = mergeLine(vals);
    for (let k = 0; k < SIZE; k++) {
      const before = board[idxs[k]];
      board[idxs[k]] = merged[k];
      if (merged[k] === before + 1) gained += Math.pow(2, merged[k]);
    }
  }
  const changed = board.some((v, i) => v !== state.board[i]);
  if (!changed) return { ok: false, state };
  const next = { ...state, board: addRandom(board), score: state.score + gained, moves: state.moves + 1 };
  next.won = next.board.some((v) => v >= TARGET);
  next.lost = !next.won && !canMove(next.board);
  return { ok: true, state: next };
}

function canMove(board) {
  if (board.some((v) => !v)) return true;
  for (let r = 0; r < SIZE; r++) for (let c = 0; c < SIZE; c++) {
    const v = board[r * SIZE + c];
    if (c + 1 < SIZE && board[r * SIZE + c + 1] === v) return true;
    if (r + 1 < SIZE && board[(r + 1) * SIZE + c] === v) return true;
  }
  return false;
}

function labelOf(v) {
  const e = LADDER.find((x) => x.level === v);
  return e ? e.short : '';
}

function boardView(board) {
  return board.map((v) => ({ v, label: labelOf(v), name: v ? LADDER[v - 1].name : '' }));
}

module.exports = { SIZE, LADDER, TARGET, newGame, move, canMove, labelOf, boardView, mergeLine };
