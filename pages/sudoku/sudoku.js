const sudoku4 = require('../../utils/sudoku');
const sudoku6 = require('../../utils/sudoku6');

Page({
  data: {
    size: 4,
    cells: [],
    numbers: [1, 2, 3, 4],
    selected: -1,
    filled: 0,
    wrong: false,
    hint: '',
    win: false,
    boxText: '2×2 宫'
  },

  onLoad() { this.newGame(4); },

  lib() { return this.data.size === 6 ? sudoku6 : sudoku4; },

  newGame(size) {
    if (size && typeof size === 'object') size = this.data.size;
    const n = Number(size || this.data.size || 4);
    const lib = n === 6 ? sudoku6 : sudoku4;
    this.game = lib.makePuzzle();
    this.grid = lib.clone(this.game.puzzle);
    this.setData({
      size: n,
      numbers: Array.from({ length: n }, (_, i) => i + 1),
      selected: -1,
      wrong: false,
      hint: '',
      win: false,
      boxText: n === 6 ? '2×3 宫' : '2×2 宫'
    });
    this.render();
  },

  setSize(e) {
    const n = Number(e.currentTarget.dataset.size);
    if (n === this.data.size) return;
    this.newGame(n);
  },

  render() {
    const n = this.data.size;
    const lib = this.lib();
    const wrongSet = new Set(this.game ? lib.findWrong(this.grid, this.game.solution).map(([r, c]) => r * n + c) : []);
    const cells = [];
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
      cells.push({
        value: this.grid[r][c],
        given: this.game.puzzle[r][c] !== 0,
        selected: this.data.selected === r * n + c,
        wrong: wrongSet.has(r * n + c),
        edgeRight: n === 6 ? (c === 2 || c === 5) : (c === 1 || c === 3),
        edgeBottom: n === 6 ? (r === 1 || r === 3 || r === 5) : (r === 1 || r === 3)
      });
    }
    this.setData({ cells, filled: this.grid.flat().filter(Boolean).length, wrong: wrongSet.size > 0 });
  },

  tapCell(e) {
    if (this.data.win) return;
    this.setData({ selected: Number(e.currentTarget.dataset.index) });
    this.render();
  },

  place(e) {
    if (this.data.win) return;
    const idx = this.data.selected;
    const n = this.data.size;
    if (idx < 0) { wx.showToast({ title: '先点一个空格', icon: 'none' }); return; }
    const r = Math.floor(idx / n); const c = idx % n;
    if (this.game.puzzle[r][c] !== 0) { wx.showToast({ title: '题目给的数字不能改', icon: 'none' }); return; }
    this.grid[r][c] = Number(e.currentTarget.dataset.n);
    this.render();
    if (this.lib().isSolved(this.grid)) {
      this.setData({ win: true });
      getApp().markPlayed('sudoku');
    }
  },

  clearCell() {
    if (this.data.win) return;
    const idx = this.data.selected;
    if (idx < 0) return;
    const n = this.data.size;
    const r = Math.floor(idx / n); const c = idx % n;
    if (this.game.puzzle[r][c] === 0) { this.grid[r][c] = 0; this.render(); }
  },

  showHint() {
    if (this.data.win) return;
    const n = this.data.size;
    const empty = [];
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (!this.grid[r][c]) empty.push([r, c]);
    if (!empty.length) return;
    const [r, c] = empty[Math.floor(Math.random() * empty.length)];
    this.grid[r][c] = this.game.solution[r][c];
    this.setData({ hint: `提示：第 ${r + 1} 行第 ${c + 1} 列填 ${this.game.solution[r][c]}。`, selected: r * n + c });
    this.render();
    if (this.lib().isSolved(this.grid)) {
      this.setData({ win: true });
      getApp().markPlayed('sudoku');
    }
  },

  reset() {
    const lib = this.lib();
    this.grid = lib.clone(this.game.puzzle);
    this.setData({ selected: -1, hint: '', wrong: false, win: false });
    this.render();
  },

  onShareAppMessage() {
    return { title: `迷你数独 ${this.data.size}×${this.data.size}，逻辑突围`, path: '/pages/sudoku/sudoku' };
  }
});
