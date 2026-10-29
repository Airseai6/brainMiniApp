const fifteen = require('../../utils/fifteen');

Page({
  data: { tiles: [], moves: 0, win: false, hint: '', lastMoved: -1 },

  onLoad() { this.reset(); },

  reset() {
    this.setData({ tiles: fifteen.shuffle(3, 120), moves: 0, win: false, hint: '', lastMoved: -1 });
  },

  tap(e) {
    if (this.data.win) return;
    const idx = Number(e.currentTarget.dataset.index);
    const next = fifteen.slide(this.data.tiles, 3, idx);
    if (!next) return;
    const win = fifteen.isSolved(next);
    this.setData({ tiles: next, moves: this.data.moves + 1, win, lastMoved: idx });
    if (win) getApp().markPlayed('fifteen');
  },

  showHint() {
    this.setData({ hint: `当前曼哈顿距离 ${fifteen.manhattan(this.data.tiles)}；每次合法滑动最多把它减少 1。` });
  },

  onShareAppMessage() {
    return { title: '十五数码：这一局能不能拼回去？', path: '/pages/fifteen/fifteen' };
  }
});
