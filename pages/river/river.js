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
    lost: false,
    selectedItem: null,
    selectedLabel: '',
    selectedEmpty: false
  },

  onLoad() { this.reset(); },

  reset() {
    const state = river.newGame();
    this.setData({
      state,
      boatSide: state.boat,
      status: '选乘客，再开船',
      hint: '',
      won: false,
      lost: false,
      selectedItem: null,
      selectedLabel: '',
      selectedEmpty: false
    });
    this.render();
  },

  render() {
    const left = river.ITEMS.filter((it) => this.data.state.left[it.id] === 1);
    const right = river.ITEMS.filter((it) => this.data.state.left[it.id] === 0);
    const selectedItem = this.data.selectedItem;
    const selectedGone = selectedItem && !(this.data.boatSide === 'left' ? left : right).some((it) => it.id === selectedItem);
    this.setData({
      left,
      right,
      boatSide: this.data.state.boat,
      selectedItem: selectedGone ? null : selectedItem,
      selectedLabel: selectedGone ? '' : this.data.selectedLabel,
      selectedEmpty: selectedGone ? false : this.data.selectedEmpty
    });
  },

  selectItem(e) {
    if (this.data.won || this.data.lost) return;
    const id = e.currentTarget.dataset.id;
    const item = river.ITEMS.find((it) => it.id === id);
    if (!item) return;
    this.setData({ selectedItem: id, selectedLabel: `${item.icon} ${item.label}`, selectedEmpty: false });
  },

  selectEmpty() {
    if (this.data.won || this.data.lost) return;
    this.setData({ selectedItem: null, selectedLabel: '空船', selectedEmpty: true });
  },

  crossSelected() {
    if (this.data.won || this.data.lost) return;
    if (!this.data.selectedItem && !this.data.selectedEmpty) {
      wx.showToast({ title: '先点选船上带谁', icon: 'none' });
      return;
    }
    this.doCross(this.data.selectedEmpty ? null : this.data.selectedItem);
  },

  doCross(id) {
    if (this.data.won || this.data.lost) return;
    const r = river.cross(this.data.state, id);
    if (!r.ok) {
      wx.showToast({ title: r.error, icon: 'none' });
      return;
    }
    const state = r.state;
    let status = state.won ? '全部运过去了！' : (state.lost ? state.reason : `第 ${state.moves} 步，继续`);
    this.setData({
      state,
      status,
      won: state.won,
      lost: state.lost,
      selectedItem: null,
      selectedLabel: '',
      selectedEmpty: false
    });
    this.render();
    if (state.won || state.lost) getApp().markPlayed('river');
  },

  showHint() { this.setData({ hint: river.hint() }); },

  onShareAppMessage() {
    return { title: '过河：狼、羊、菜，船每次只能带一样', path: '/pages/river/river' };
  }
});
