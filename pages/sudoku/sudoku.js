const sudoku = require('../../utils/sudoku');

Page({
  data: {
    cells: [],
    numbers: [1, 2, 3, 4],
    selected: -1,
    filled: 0,
    wrong: false,
    hint: '',
    win: false
  },

  onLoad() { this.newGame(); },

  newGame() {
    this.game = sudoku.makePuzzle();
    this.grid = sudoku.clone(this.game.puzzle);
    this.setData({ selected: -1, wrong: false, hint: '', win: false });
    this.render();
  },

  render() {
    const wrongSet = new Set(this.game ? sudoku.findWrong(this.grid, this.game.solution).map(([r, c]) => r * 4 + c) : []);
    const cells = [];
    for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) {
      cells.push({
        value: this.grid[r][c],
        given: this.game.puzzle[r][c] !== 0,
        selected: this.data.selected === r * 4 + c,
        wrong: wrongSet.has(r * 4 + c)
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
    if (idx < 0) { wx.showToast({ title: '先点一个空格', icon: 'none' }); return; }
    const r = Math.floor(idx / 4); const c = idx % 4;
    if (this.game.puzzle[r][c] !== 0) { wx.showToast({ title: '题目给的数字不能改', icon: 'none' }); return; }
    this.grid[r][c] = Number(e.currentTarget.dataset.n);
    this.render();
    if (sudoku.isSolved(this.grid)) {
      this.setData({ win: true });
      getApp().markPlayed('sudoku');
    }
  },

  clearCell() {
    if (this.data.win) return;
    const idx = this.data.selected;
    if (idx < 0) return;
    const r = Math.floor(idx / 4); const c = idx % 4;
    if (this.game.puzzle[r][c] === 0) { this.grid[r][c] = 0; this.render(); }
  },

  showHint() {
    const empty = [];
    for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) if (!this.grid[r][c]) empty.push([r, c]);
    if (!empty.length) return;
    const [r, c] = empty[Math.floor(Math.random() * empty.length)];
    this.grid[r][c] = this.game.solution[r][c];
    this.setData({ hint: `提示：第 ${r + 1} 行第 ${c + 1} 列填 ${this.game.solution[r][c]}。`, selected: r * 4 + c });
    this.render();
  },

  reset() {
    this.grid = sudoku.clone(this.game.puzzle);
    this.setData({ selected: -1, hint: '', wrong: false, win: false });
    this.render();
  },

  onShareAppMessage() {
    return { title: '迷你数独：4×4 逻辑突围', path: '/pages/sudoku/sudoku' };
  }
});
