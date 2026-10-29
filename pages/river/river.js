const river = require('../../utils/river');

Page({
  data: {
    state: null,
    left: [],
    right: [],
    boatSide: 'left',
    status: '把狼、羊、菜都运到右岸',
    hint: '',
    won: false,
    lost: false
  },

  onLoad() { this.reset(); },

  reset() {
    const state = river.newGame();
    this.setData({ state, boatSide: state.boat, status: '把狼、羊、菜都运到右岸', hint: '', won: false, lost: false });
    this.render();
  },

  render() {
    const left = river.ITEMS.filter((it) => this.data.state.left[it.id] === 1);
    const right = river.ITEMS.filter((it) => this.data.state.left[it.id] === 0);
    this.setData({ left, right, boatSide: this.data.state.boat });
  },

  crossItem(e) {
    const id = e.currentTarget.dataset.id;
    this.doCross(id);
  },

  crossEmpty() { this.doCross(null); },

  doCross(id) {
    if (this.data.won || this.data.lost) return;
    const r = river.cross(this.data.state, id);
    if (!r.ok) {
      wx.showToast({ title: r.error, icon: 'none' });
      return;
    }
    const state = r.state;
    let status = state.won ? '全部运过去了！' : (state.lost ? state.reason : `第 ${state.moves} 步，继续`);
    this.setData({ state, status, won: state.won, lost: state.lost });
    this.render();
    if (state.won || state.lost) getApp().markPlayed('river');
  },

  showHint() { this.setData({ hint: river.hint() }); },

  onShareAppMessage() {
    return { title: '过河：狼、羊、菜，船每次只能带一样', path: '/pages/river/river' };
  }
});
