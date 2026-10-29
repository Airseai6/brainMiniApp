// 围堵狐狸：6 节点环，洞口 0，狐狸 3。玩家每回合封一个路口，然后狐狸沿未封边移动。
const NODES = [0, 1, 2, 3, 4, 5];
const EDGES = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0]];
const DEN = 0;
const START_FOX = 3;

function adj() {
  const a = NODES.map(() => []);
  for (const [x, y] of EDGES) { a[x].push(y); a[y].push(x); }
  a.forEach((l) => l.sort((x, y) => x - y));
  return a;
}

function newGame() {
  return { fox: START_FOX, den: DEN, blocked: [], moves: 0, won: false, lost: false };
}

function foxMoves(state) {
  return adj()[state.fox].filter((v) => !state.blocked.includes(v) && v !== state.fox);
}

function distancesToDen() {
  const a = adj();
  const dist = NODES.map(() => Infinity);
  dist[DEN] = 0;
  const q = [DEN];
  for (let h = 0; h < q.length; h++) {
    for (const v of a[q[h]]) if (dist[v] === Infinity) { dist[v] = dist[q[h]] + 1; q.push(v); }
  }
  return dist;
}

function block(state, node) {
  if (state.won || state.lost) return { ok: false, state, error: '这一局已经结束' };
  if (!NODES.includes(node)) return { ok: false, state, error: '没有这个路口' };
  if (node === state.fox) return { ok: false, state, error: '不能封狐狸脚下的路口' };
  if (node === DEN) return { ok: false, state, error: '不能封洞口' };
  if (state.blocked.includes(node)) return { ok: false, state, error: '这个路口已经封了' };
  const next = { ...state, blocked: state.blocked.concat([node]), moves: state.moves + 1 };
  const moves = foxMoves(next);
  if (!moves.length) { next.won = true; return { ok: true, state: next }; }
  const d = distancesToDen();
  moves.sort((a, b) => d[a] - d[b]);
  next.fox = moves[0];
  if (next.fox === DEN) next.lost = true;
  if (next.moves >= 16) next.lost = true;
  return { ok: true, state: next };
}

function hint(state) {
  const d = distancesToDen();
  const options = NODES.filter((v) => v !== state.fox && v !== DEN && !state.blocked.includes(v));
  options.sort((a, b) => d[a] - d[b] || a - b);
  return `优先封狐狸到洞口路径上的路口，比如 ${options[0] + 1} 号；狐狸现在在 ${state.fox + 1} 号。`;
}

module.exports = { NODES, EDGES, DEN, newGame, block, foxMoves, distancesToDen, hint };
