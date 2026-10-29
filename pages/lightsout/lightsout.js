const lightsout = require('../../utils/lightsout');

Page({
  data: {
    size: 5,
    mode: 'daily',
    cells: [],
    moves: 0,
    won: false,
    hintCell: -1,
    hint: '',
    status: '点灯翻面，把灯全灭',
  },

  onLoad() { this.newRound('daily', 5); },

  newRound(mode, size) {
    if (mode && typeof mode === 'object') mode = this.data.mode;
    if (size && typeof size === 'object') size = this.data.size;
    const m = mode || this.data.mode || 'daily';
    const n = Number(size || this.data.size || 5);
    this.puzzle = m === 'daily' ? lightsout.dailyPuzzle(n, new Date()) : lightsout.randomPuzzle(n);
    this.grid = lightsout.clone(this.puzzle.grid);
    this.setData({ mode: m, size: n, moves: 0, won: false, hintCell: -1, hint: '', status: '点灯翻面，把灯全灭' });
    this.render();
  },

  startDaily() { this.newRound('daily', this.data.size); },
  startPractice() { this.newRound('practice', this.data.size); },
  setSize(e) { this.newRound(this.data.mode, Number(e.currentTarget.dataset.size)); },

  render() {
    const n = this.data.size;
    const cells = [];
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
      const idx = r * n + c;
      cells.push({ on: !!this.grid[r][c], hint: this.data.hintCell === idx, index: idx });
    }
    this.setData({ cells });
  },

  tapCell(e) {
    if (this.data.won) return;
    const idx = Number(e.currentTarget.dataset.index);
    const n = this.data.size;
    this.grid = lightsout.applyPress(this.grid, Math.floor(idx / n), idx % n);
    const moves = this.data.moves + 1;
    const won = lightsout.isSolved(this.grid);
    this.setData({ moves, won, hintCell: -1, hint: '', status: won ? '全灭了！' : `第 ${moves} 次翻转` });
    this.render();
    if (won) getApp().markPlayed('lights-out');
  },

  showHint() {
    if (this.data.won) return;
    const sol = lightsout.solve(this.grid);
    if (!sol || !sol.length) { this.setData({ hint: '已经全灭。' }); return; }
    const [r, c] = sol[0];
    this.setData({
      hintCell: r * this.data.size + c,
      hint: `提示：先点第 ${r + 1} 行第 ${c + 1} 列的灯。`
    });
    this.render();
  },

  reset() {
    this.grid = lightsout.clone(this.puzzle.grid);
    this.setData({ moves: 0, won: false, hintCell: -1, hint: '', status: '点灯翻面，把灯全灭' });
    this.render();
  },

  newPuzzle() { this.newRound(this.data.mode === 'daily' ? 'practice' : this.data.mode, this.data.size); },

  onShareAppMessage() {
    return { title: '点灯 Lights Out：点一格，翻转十字', path: '/pages/lightsout/lightsout' };
  }
});
