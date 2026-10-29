// 6×6 迷你数独：每行/列/2×3 宫填 1–6，生成唯一解题目。
const SIZE = 6;
const BOX_R = 2;
const BOX_C = 3;

function clone(grid) { return grid.map((r) => r.slice()); }
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function inBox(r, c) {
  return [Math.floor(r / BOX_R) * BOX_R, Math.floor(c / BOX_C) * BOX_C];
}

function canPlace(grid, r, c, v) {
  for (let i = 0; i < SIZE; i++) {
    if (i !== c && grid[r][i] === v) return false;
    if (i !== r && grid[i][c] === v) return false;
  }
  const [br, bc] = inBox(r, c);
  for (let i = br; i < br + BOX_R; i++) for (let j = bc; j < bc + BOX_C; j++) {
    if (!(i === r && j === c) && grid[i][j] === v) return false;
  }
  return true;
}

function makeSolution() {
  const grid = Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
  function fill(pos) {
    if (pos === SIZE * SIZE) return true;
    const r = Math.floor(pos / SIZE);
    const c = pos % SIZE;
    for (const v of shuffle([1, 2, 3, 4, 5, 6])) {
      if (!canPlace(grid, r, c, v)) continue;
      grid[r][c] = v;
      if (fill(pos + 1)) return true;
      grid[r][c] = 0;
    }
    return false;
  }
  fill(0);
  return grid;
}

function solveCount(grid, limit = 2) {
  let count = 0;
  const work = clone(grid);
  function walk() {
    if (count >= limit) return;
    let br = -1; let bc = -1;
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        if (work[r][c] === 0) { br = r; bc = c; break; }
      }
      if (br !== -1) break;
    }
    if (br === -1) { count++; return; }
    for (let v = 1; v <= 6; v++) {
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
  for (let attempt = 0; attempt < 12; attempt++) {
    const solution = makeSolution();
    const puzzle = clone(solution);
    const cells = [];
    for (let r = 0; r < SIZE; r++) for (let c = 0; c < SIZE; c++) cells.push([r, c]);
    const shuffled = shuffle(cells);
    let blanks = 0;
    for (const [r, c] of shuffled) {
      const keep = puzzle[r][c];
      puzzle[r][c] = 0;
      if (solveCount(puzzle, 2) === 1) blanks++;
      else puzzle[r][c] = keep;
      if (blanks >= 18) break;
    }
    if (blanks >= 15) return { puzzle, solution };
  }
  return { puzzle: makeSolution(), solution: null };
}

function isSolved(grid) {
  if (grid.some((row) => row.some((v) => !v))) return false;
  for (let r = 0; r < SIZE; r++) for (let c = 0; c < SIZE; c++) if (!canPlace(grid, r, c, grid[r][c])) return false;
  return true;
}

function findWrong(grid, solution) {
  const out = [];
  if (!solution) return out;
  for (let r = 0; r < SIZE; r++) for (let c = 0; c < SIZE; c++) {
    if (grid[r][c] && solution[r][c] && grid[r][c] !== solution[r][c]) out.push([r, c]);
  }
  return out;
}

module.exports = { SIZE, BOX_R, BOX_C, makeSolution, makePuzzle, solveCount, canPlace, isSolved, findWrong, clone };
