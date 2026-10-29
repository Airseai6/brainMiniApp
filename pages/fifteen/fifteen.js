const fifteen = require('../../utils/fifteen');

Page({
  data: { tiles: [], moves: 0, win: false, hint: '', lastMoved: -1, size: 3 },

  onLoad() { this.reset(); },

  reset() {
    const size = this.data.size || 3;
    this.setData({ tiles: fifteen.shuffle(size, size === 3 ? 120 : 220), moves: 0, win: false, hint: '', lastMoved: -1 });
  },

  setSize(e) {
    const size = Number(e.currentTarget.dataset.size);
    if (size === this.data.size) return;
    this.setData({ size }, () => this.reset());
  },

  tap(e) {
    if (this.data.win) return;
    const idx = Number(e.currentTarget.dataset.index);
    const next = fifteen.slide(this.data.tiles, this.data.size, idx);
    if (!next) return;
    const win = fifteen.isSolved(next);
    this.setData({ tiles: next, moves: this.data.moves + 1, win, lastMoved: idx });
    if (win) getApp().markPlayed('fifteen');
  },

  showHint() {
    this.setData({ hint: `当前曼哈顿距离 ${fifteen.manhattan(this.data.tiles, this.data.size)}；每次合法滑动最多把它减少 1。` });
  },

  onShareAppMessage() {
    return { title: '数字滑块：这一局能不能拼回去？', path: '/pages/fifteen/fifteen' };
  }
});
