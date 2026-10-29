const mc = require('../../utils/river-mc');

Page({
  data: {
    state: null,
    left: { m: 3, c: 3 },
    right: { m: 0, c: 0 },
    leftPeople: [],
    rightPeople: [],
    boatPeople: [],
    selectedIds: [],
    selectedCount: 0,
    boatSide: 'left',
    status: '选 1–2 人，开船',
    hint: ''
  },

  onLoad() { this.reset(); },

  reset() {
    this.state = mc.newGame();
    this.selected = new Set();
    this.setData({ hint: '', status: '选 1–2 人，开船' });
    this.render();
  },

  render() {
    const s = this.state;
    const left = mc.countsOn(s, 'left');
    const right = mc.countsOn(s, 'right');
    const leftPeople = [...Array(left.m).fill('🧑‍🎓'), ...Array(left.c).fill('👹')];
    const rightPeople = [...Array(right.m).fill('🧑‍🎓'), ...Array(right.c).fill('👹')];
    const sideCounts = s.boat === 'left' ? left : right;
    const boatPeople = [];
    for (let i = 0; i < sideCounts.m; i++) {
      const key = `m${i}`;
      boatPeople.push({ key, type: 'm', icon: '🧑‍🎓', label: `传${i + 1}`, selected: this.selected.has(key) });
    }
    for (let i = 0; i < sideCounts.c; i++) {
      const key = `c${i}`;
      boatPeople.push({ key, type: 'c', icon: '👹', label: `野${i + 1}`, selected: this.selected.has(key) });
    }
    this.setData({
      state: s,
      left,
      right,
      leftPeople,
      rightPeople,
      boatPeople,
      selectedCount: this.selected.size,
      boatSide: s.boat
    });
  },

  togglePerson(e) {
    if (this.state.won) return;
    const idx = Number(e.currentTarget.dataset.index);
    const person = this.data.boatPeople[idx];
    if (!person) return;
    if (this.selected.has(person.key)) this.selected.delete(person.key);
    else {
      if (this.selected.size >= 2) { wx.showToast({ title: '船最多坐 2 人', icon: 'none' }); return; }
      this.selected.add(person.key);
    }
    this.render();
  },

  clearSelection() {
    this.selected.clear();
    this.render();
  },

  crossSelected() {
    if (this.state.won) return;
    let m = 0; let c = 0;
    for (const key of this.selected) {
      if (key[0] === 'm') m++;
      else c++;
    }
    if (!m && !c) { wx.showToast({ title: '先选船上的人', icon: 'none' }); return; }
    const r = mc.cross(this.state, m, c);
    if (!r.ok) {
      wx.showToast({ title: r.error, icon: 'none' });
      this.setData({ hint: r.error });
      return;
    }
    this.state = r.state;
    this.selected.clear();
    const status = this.state.won ? '全部安全到达！' : `第 ${this.state.moves} 步，继续`;
    this.setData({ status, hint: '' });
    this.render();
    if (this.state.won) getApp().markPlayed('river');
  },

  gotoWGC() {
    wx.redirectTo({ url: '/pages/river/river' });
  },

  onShareAppMessage() {
    return { title: '过河第二关：传教士与野人', path: '/pages/river-mc/river-mc' };
  }
});
