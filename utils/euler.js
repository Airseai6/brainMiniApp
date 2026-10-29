// 一笔画 / 七桥：欧拉路径判定与按边行走。
const LEVELS = [
  {
    id: 'ring', name: '折线环', start: 0, width: 680, height: 380,
    nodes: [
      { id: 0, x: 100, y: 190, label: 'A' },
      { id: 1, x: 250, y: 90, label: 'B' },
      { id: 2, x: 400, y: 190, label: 'C' },
      { id: 3, x: 550, y: 90, label: 'D' },
      { id: 4, x: 400, y: 300, label: 'E' }
    ],
    edges: [[0, 1], [1, 2], [2, 3], [3, 0], [0, 2], [2, 4], [4, 1]]
  },
  {
    id: 'bridges', name: '柯尼斯堡七桥', start: 0, width: 680, height: 380,
    nodes: [
      { id: 0, x: 120, y: 110, label: '北岸' },
      { id: 1, x: 560, y: 110, label: '南岸' },
      { id: 2, x: 340, y: 60, label: '岛A' },
      { id: 3, x: 340, y: 310, label: '岛B' }
    ],
    edges: [[2, 0], [2, 0], [2, 1], [2, 1], [3, 0], [3, 1], [2, 3]]
  }
];
const levelById = (id) => LEVELS.find((l) => l.id === id) || null;
function degrees(level) {
  const deg = level.nodes.map(() => 0);
  for (const [a, b] of level.edges) { deg[a]++; deg[b]++; }
  return deg;
}
function oddNodes(level) {
  const deg = degrees(level);
  return deg.map((d, i) => ({ node: i, deg: d })).filter((x) => x.deg % 2 === 1);
}
function hasEulerPath(level) { const odd = oddNodes(level).length; return odd === 0 || odd === 2; }
function newState(level) { return { level, current: level.start, used: [], history: [], done: false }; }
function canTraverse(state, edgeIndex) {
  if (state.done || state.used.includes(edgeIndex)) return false;
  const e = state.level.edges[edgeIndex];
  return !!e && (e[0] === state.current || e[1] === state.current);
}
function traverse(state, edgeIndex) {
  if (!canTraverse(state, edgeIndex)) return { ok: false, state, error: '这条边和当前点不相连，或已经走过' };
  const [a, b] = state.level.edges[edgeIndex];
  const next = { ...state, current: a === state.current ? b : a, used: state.used.concat([edgeIndex]), history: state.history.concat([{ edge: edgeIndex, from: state.current }]) };
  next.done = next.used.length === next.level.edges.length;
  return { ok: true, state: next };
}
function undo(state) {
  if (!state.history.length) return state;
  const last = state.history[state.history.length - 1];
  return { ...state, current: last.from, used: state.used.filter((e) => e !== last.edge), history: state.history.slice(0, -1), done: false };
}
module.exports = { LEVELS, levelById, degrees, oddNodes, hasEulerPath, newState, canTraverse, traverse, undo };
