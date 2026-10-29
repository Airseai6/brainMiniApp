const nono = require('../../utils/nonogram');

Page({
  data: {
    puzzleName: '',
    rows: [],
    colClues: [],
    status: '涂出隐藏图案',
    hint: ''
  },

  onLoad() { this.newGame(); },

  newGame() {
    this.puzzle = nono.PUZZLES[Math.floor(Math.random() * nono.PUZZLES.length)];
    this.player = nono.emptyGrid();
    this.hintCell = null;
    const clues = nono.cluesOf(this.puzzle.grid);
    this.setData({
      puzzleName: this.puzzle.name,
      colClues: clues.cols.map((c) => c.join(' ')),
      status: '涂出隐藏图案',
      hint: ''
    });
    this.render();
  },

  render() {
    const clues = nono.cluesOf(this.puzzle.grid);
    const rows = [];
    for (let r = 0; r < nono.N; r++) {
      const cells = [];
      for (let c = 0; c < nono.N; c++) {
        cells.push({
          on: !!this.player[r][c],
          hint: !!(this.hintCell && this.hintCell[0] === r && this.hintCell[1] === c)
        });
      }
      rows.push({ clue: clues.rows[r].join(' '), cells });
    }
    this.setData({ rows });
  },

  tapCell(e) {
    if (this.data.win) return;
    const r = Number(e.currentTarget.dataset.r);
    const c = Number(e.currentTarget.dataset.c);
    this.player = nono.toggle(this.player, r, c);
    this.hintCell = null;
    this.render();
    if (nono.isSolved(this.player, this.puzzle.grid)) {
      this.setData({ status: `完成！你解出了「${this.puzzle.name}」` });
      getApp().markPlayed('nonogram');
    }
  },

  showHint() {
    const diffs = [];
    for (let r = 0; r < nono.N; r++) for (let c = 0; c < nono.N; c++) {
      if (!!this.player[r][c] !== !!this.puzzle.grid[r][c]) diffs.push([r, c]);
    }
    if (!diffs.length) return;
    const [r, c] = diffs[Math.floor(Math.random() * diffs.length)];
    this.player[r][c] = this.puzzle.grid[r][c];
    this.hintCell = [r, c];
    this.render();
    this.setData({ hint: `提示：第 ${r + 1} 行第 ${c + 1} 列${this.puzzle.grid[r][c] ? '要涂' : '不涂'}。` });
  },

  reset() {
    this.player = nono.emptyGrid();
    this.hintCell = null;
    this.render();
    this.setData({ status: '已清空，重新推。', hint: '' });
  },

  onShareAppMessage() {
    return { title: '数织：5×5 图像推理', path: '/pages/nonogram/nonogram' };
  }
});
