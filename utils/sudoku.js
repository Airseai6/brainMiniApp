// 4×4 迷你数独：生成唯一解题目、校验、找错。
const SIZE = 4;
const BASE = [
  [1, 2, 3, 4],
  [3, 4, 1, 2],
  [2, 1, 4, 3],
  [4, 3, 2, 1]
];

function clone(grid) { return grid.map((r) => r.slice()); }
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
function makeSolution() {
  let g = clone(BASE);
  const rows = shuffle([[0, 1], [2, 3]]);
  g = rows.flatMap((pair) => [g[pair[0]], g[pair[1]]]);
  const cols = shuffle([[0, 1], [2, 3]]);
  g = g.map((row) => cols.flatMap((pair) => [row[pair[0]], row[pair[1]]]));
  const map = {};
  const digits = shuffle([1, 2, 3, 4]);
  for (let i = 0; i < 4; i++) map[i + 1] = digits[i];
  return g.map((row) => row.map((v) => map[v]));
}
function canPlace(grid, r, c, v) {
  for (let i = 0; i < SIZE; i++) {
    if (grid[r][i] === v && i !== c) return false;
    if (grid[i][c] === v && i !== r) return false;
  }
  const br = Math.floor(r / 2) * 2;
  const bc = Math.floor(c / 2) * 2;
  for (let i = br; i < br + 2; i++) for (let j = bc; j < bc + 2; j++) {
    if (grid[i][j] === v && !(i === r && j === c)) return false;
  }
  return true;
}
function solveCount(grid, limit = 2) {
  let count = 0;
  const work = clone(grid);
  function walk() {
    if (count >= limit) return;
    let br = -1; let bc = -1;
    for (let r = 0; r < SIZE; r++) for (let c = 0; c < SIZE; c++) if (work[r][c] === 0) { br = r; bc = c; break; }
    if (br === -1) { count++; return; }
    for (let v = 1; v <= 4; v++) {
      if (!canPlace(work, br, bc, v)) continue;
      work[br][bc] = v;
      walk();
      work[br][bc] = 0;
      if (count >= limit) return;
    }
  }
  walk();
  return count;
}
function makePuzzle() {
  const solution = makeSolution();
  let puzzle = clone(solution);
  const cells = [];
  for (let r = 0; r < SIZE; r++) for (let c = 0; c < SIZE; c++) cells.push([r, c]);
  const shuffled = shuffle(cells);
  const blanks = 7 + Math.floor(Math.random() * 2);
  for (let i = 0; i < blanks; i++) { const [r, c] = shuffled[i]; puzzle[r][c] = 0; }
  if (solveCount(puzzle, 2) !== 1) return makePuzzle();
  return { puzzle, solution };
}
function isSolved(grid) {
  if (grid.some((row) => row.some((v) => !v))) return false;
  for (let r = 0; r < SIZE; r++) for (let c = 0; c < SIZE; c++) if (!canPlace(grid, r, c, grid[r][c])) return false;
  return true;
}
function findWrong(grid, solution) {
  const out = [];
  for (let r = 0; r < SIZE; r++) for (let c = 0; c < SIZE; c++) if (grid[r][c] && solution[r][c] && grid[r][c] !== solution[r][c]) out.push([r, c]);
  return out;
}
module.exports = { SIZE, makeSolution, makePuzzle, solveCount, canPlace, isSolved, findWrong, clone };
