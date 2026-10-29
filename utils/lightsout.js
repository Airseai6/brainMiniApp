// Lights Out：点一格会翻转自己与上下左右。先按“追灯法”求解，再随机打乱生成可解棋盘。
const { mulberry32, seedFromDate, randomSeed, randInt, shuffle } = require('./random');

function emptyGrid(size) {
  return Array.from({ length: size }, () => Array(size).fill(0));
}

function clone(grid) { return grid.map((r) => r.slice()); }

function pressAt(grid, size, r, c) {
  const dirs = [[0, 0], [-1, 0], [1, 0], [0, -1], [0, 1]];
  for (const [dr, dc] of dirs) {
    const nr = r + dr; const nc = c + dc;
    if (nr >= 0 && nr < size && nc >= 0 && nc < size) grid[nr][nc] ^= 1;
  }
}

function isSolved(grid) {
  return grid.every((row) => row.every((v) => !v));
}

function solve(grid) {
  const size = grid.length;
  for (let mask = 0; mask < (1 << size); mask++) {
    const work = clone(grid);
    const presses = [];
    for (let c = 0; c < size; c++) {
      if (mask & (1 << c)) { pressAt(work, size, 0, c); presses.push([0, c]); }
    }
    for (let r = 0; r < size - 1; r++) {
      for (let c = 0; c < size; c++) {
        if (work[r][c]) { pressAt(work, size, r + 1, c); presses.push([r + 1, c]); }
      }
    }
    if (work[size - 1].every((v) => !v)) return presses;
  }
  return null;
}

function makePuzzle(size, rng, steps) {
  let grid;
  let solution = null;
  for (let attempt = 0; attempt < 30; attempt++) {
    grid = emptyGrid(size);
    const clicks = steps || size + 3;
    for (let i = 0; i < clicks; i++) {
      pressAt(grid, size, randInt(rng, 0, size - 1), randInt(rng, 0, size - 1));
    }
    if (isSolved(grid)) continue;
    solution = solve(grid);
    if (solution && solution.length) break;
  }
  return { grid, size, solution };
}

function dailyPuzzle(size, date = new Date()) {
  const rng = mulberry32(seedFromDate(date, size * 17 + 5));
  return makePuzzle(size, rng, size + 4);
}

function randomPuzzle(size) {
  const rng = mulberry32(randomSeed());
  return makePuzzle(size, rng, size + 4);
}

function applyPress(grid, r, c) {
  const next = clone(grid);
  pressAt(next, grid.length, r, c);
  return next;
}

module.exports = { emptyGrid, clone, pressAt, isSolved, solve, makePuzzle, dailyPuzzle, randomPuzzle, applyPress };
