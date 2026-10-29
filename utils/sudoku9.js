// 9×9 数独：生成唯一解题目。用 3×3 宫的标准盘面做随机变换，再逐格挖空并校验唯一解。
const SIZE = 9;
const BOX = 3;

function clone(grid) { return grid.map((r) => r.slice()); }
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function inBox(r, c) { return [Math.floor(r / BOX) * BOX, Math.floor(c / BOX) * BOX]; }

function canPlace(grid, r, c, v) {
  for (let i = 0; i < SIZE; i++) {
    if (i !== c && grid[r][i] === v) return false;
    if (i !== r && grid[i][c] === v) return false;
  }
  const [br, bc] = inBox(r, c);
  for (let i = br; i < br + BOX; i++) for (let j = bc; j < bc + BOX; j++) {
    if (!(i === r && j === c) && grid[i][j] === v) return false;
  }
  return true;
}

function baseSolution() {
  const g = Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
  for (let r = 0; r < SIZE; r++) for (let c = 0; c < SIZE; c++) {
    g[r][c] = ((r * 3 + Math.floor(r / 3) + c) % 9) + 1;
  }
  // 打乱数字
  const digits = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  const numMap = {};
  digits.forEach((d, i) => { numMap[i + 1] = d; });
  for (let r = 0; r < SIZE; r++) for (let c = 0; c < SIZE; c++) g[r][c] = numMap[g[r][c]];
  // 打乱行带、带内行、列带、带内列
  const bands = shuffle([0, 1, 2]);
  const rows = [];
  for (const b of bands) for (const r of shuffle([0, 1, 2])) rows.push(b * 3 + r);
  const stacks = shuffle([0, 1, 2]);
  const cols = [];
  for (const s of stacks) for (const c of shuffle([0, 1, 2])) cols.push(s * 3 + c);
  return rows.map((r) => cols.map((c) => g[r][c]));
}

function solveCount(grid, limit = 2) {
  let count = 0;
  const work = clone(grid);
  function walk() {
    if (count >= limit) return;
    let bestR = -1; let bestC = -1; let bestOptions = null;
    for (let r = 0; r < SIZE; r++) for (let c = 0; c < SIZE; c++) {
      if (work[r][c]) continue;
      const opts = [];
      for (let v = 1; v <= 9; v++) if (canPlace(work, r, c, v)) opts.push(v);
      if (!opts.length) return;
      if (!bestOptions || opts.length < bestOptions.length) {
        bestR = r; bestC = c; bestOptions = opts;
        if (opts.length === 1) break;
      }
    }
    if (bestR === -1) { count++; return; }
    for (const v of bestOptions) {
      work[bestR][bestC] = v;
      walk();
      work[bestR][bestC] = 0;
      if (count >= limit) return;
    }
  }
  walk();
  return count;
}

function makePuzzle(blanks = 46) {
  for (let attempt = 0; attempt < 4; attempt++) {
    const solution = baseSolution();
    const puzzle = clone(solution);
    const cells = [];
    for (let r = 0; r < SIZE; r++) for (let c = 0; c < SIZE; c++) cells.push([r, c]);
    let removed = 0;
    for (const [r, c] of shuffle(cells)) {
      if (removed >= blanks) break;
      const keep = puzzle[r][c];
      puzzle[r][c] = 0;
      if (solveCount(puzzle, 2) === 1) removed++;
      else puzzle[r][c] = keep;
    }
    if (removed >= Math.min(blanks, 40)) return { puzzle, solution };
  }
  const solution = baseSolution();
  return { puzzle: clone(solution), solution };
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

module.exports = { SIZE, BOX, makeSolution: baseSolution, makePuzzle, solveCount, canPlace, isSolved, findWrong, clone };
