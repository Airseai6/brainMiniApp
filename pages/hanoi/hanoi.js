const hanoi = require('../../utils/hanoi');

Page({
  data: {
    n: 4,
    state: null,
    pegs: [],
    selected: -1,
    moves: 0,
    minMoves: 15,
    win: false,
    hint: ''
  },

  onLoad() {
    this.newGame(4);
  },

  newGame(n) {
    const state = hanoi.newState(n);
    this.setData({
      n,
      state,
      selected: -1,
      moves: 0,
      minMoves: Math.pow(2, n) - 1,
      win: false,
      hint: ''
    });
    this.render();
  },

  render() {
    const state = this.data.state;
    const pegs = state.pegs.map((pile, i) => ({
      label: 'ABC'[i],
      disks: pile.map(size => ({ size, width: 70 + size * 34 }))
    }));
    this.setData({ pegs, moves: state.moves });
  },

  tapPeg(e) {
    if (this.data.win) return;
    const index = Number(e.currentTarget.dataset.index);
    if (this.data.selected === -1) {
      if (!this.data.state.pegs[index].length) {
        wx.showToast({ title: '这根柱子上没有圆盘', icon: 'none' });
        return;
      }
      this.setData({ selected: index, hint: '' });
      return;
    }
    if (this.data.selected === index) {
      this.setData({ selected: -1 });
      return;
    }
    const r = hanoi.move(this.data.state, this.data.selected, index);
    if (!r.ok) {
      wx.showToast({ title: r.error, icon: 'none' });
      return;
    }
    this.setData({ state: r.state, selected: -1, hint: '' });
    this.render();
    if (hanoi.isWin(r.state)) {
      this.setData({ win: true });
      getApp().markPlayed('hanoi');
    }
  },

  level(e) {
    const n = Number(e.currentTarget.dataset.n);
    this.newGame(n);
  },

  showHint() {
    const m = hanoi.hintMove(this.data.state);
    if (!m) {
      this.setData({ hint: '已经完成，或者没有可走的下一步。' });
      return;
    }
    this.setData({ hint: `下一步：把柱子 ${'ABC'[m.from]} 顶部的圆盘移到柱子 ${'ABC'[m.to]}。` });
  },

  reset() {
    this.newGame(this.data.n);
  },

  onShareAppMessage() {
    return { title: `汉诺塔 ${this.data.n} 层，最少 ${this.data.minMoves} 步，你能做到吗？`, path: '/pages/hanoi/hanoi' };
  }
});
