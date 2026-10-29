// 5×5 数织：三幅固定图案，行列连续段线索。
const N = 5;
const PUZZLES = [
  { name: '爱心', grid: [[0,1,0,1,0],[1,1,1,1,1],[1,1,1,1,1],[0,1,1,1,0],[0,0,1,0,0]] },
  { name: '箭头', grid: [[0,0,1,0,0],[0,1,1,1,0],[1,1,1,1,1],[0,0,1,0,0],[0,0,1,0,0]] },
  { name: '沙漏', grid: [[1,1,1,1,1],[0,1,1,1,0],[0,0,1,0,0],[0,1,1,1,0],[1,1,1,1,1]] }
];

function lineClue(line) {
  const runs = []; let count = 0;
  for (const v of line) { if (v) count++; else if (count) { runs.push(count); count = 0; } }
  if (count) runs.push(count);
  return runs.length ? runs : [0];
}
function cluesOf(grid) {
  return {
    rows: grid.map(lineClue),
    cols: Array.from({ length: N }, (_, c) => lineClue(grid.map((row) => row[c])))
  };
}
function isSolved(player, solution) {
  for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) if (!!player[r][c] !== !!solution[r][c]) return false;
  return true;
}
function toggle(grid, r, c) {
  const next = grid.map((row) => row.slice());
  next[r][c] = next[r][c] ? 0 : 1;
  return next;
}
function emptyGrid() { return Array.from({ length: N }, () => Array(N).fill(0)); }
module.exports = { N, PUZZLES, lineClue, cluesOf, isSolved, toggle, emptyGrid };
