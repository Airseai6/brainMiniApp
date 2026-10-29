const water = require('../../utils/water');

Page({
  data: {
    mode: 'daily',
    caps: [3, 5, 8],
    jugs: [0, 0, 0],
    target: 4,
    selected: -1,
    moves: 0,
    won: false,
    hint: '',
    status: '选一个壶，再点另一个壶倒水',
    levelLabel: '',
    solvableText: ''
  },

  onLoad() { this.newRound('daily'); },

  newRound(mode) {
    if (mode && typeof mode === 'object') mode = this.data.mode;
    const m = mode || this.data.mode || 'daily';
    this.puzzle = m === 'daily' ? water.dailyPuzzle(new Date()) : water.randomPuzzle();
    this.jugs = this.puzzle.caps.map(() => 0);
    const g = water.gcdAll(this.puzzle.caps);
    const reachable = water.isReachable(this.puzzle.caps, this.puzzle.target);
    this.setData({
      mode: m,
      caps: this.puzzle.caps,
      target: this.puzzle.target,
      levelLabel: this.puzzle.label || '',
      solvableText: `容量 ${this.puzzle.caps.join('、')}，目标 ${this.puzzle.target}；三壶容量的最大公约数是 ${g}，${this.puzzle.target} ${reachable ? '能被' : '不能被'}它整除 → ${reachable ? '有解' : '无解'}。`,
      selected: -1,
      moves: 0,
      won: false,
      hint: '',
      status: '选一个壶，再点另一个壶倒水'
    });
    this.render();
  },

  startDaily() { this.newRound('daily'); },
  startPractice() { this.newRound('practice'); },

  render() {
    const jugs = this.jugs.map((amount, i) => ({
      amount,
      cap: this.data.caps[i],
      percent: Math.round((amount / this.data.caps[i]) * 100),
      selected: this.data.selected === i,
      index: i
    }));
    this.setData({ jugs });
  },

  selectJug(e) {
    if (this.data.won) return;
    const idx = Number(e.currentTarget.dataset.index);
    if (this.data.selected < 0) {
      this.setData({ selected: idx, status: `已选 ${idx + 1} 号壶：再点目标壶倒水` });
      this.render();
      return;
    }
    if (this.data.selected === idx) {
      this.setData({ selected: -1, status: '已取消选择' });
      this.render();
      return;
    }
    const r = water.pour(this.jugs, this.data.caps, this.data.selected, idx);
    if (!r.ok) {
      wx.showToast({ title: r.error, icon: 'none' });
      this.setData({ hint: r.error });
      return;
    }
    this.afterAction(r.jugs, r.text);
  },

  fillSelected() {
    if (this.data.won) return;
    if (this.data.selected < 0) { wx.showToast({ title: '先选一个壶', icon: 'none' }); return; }
    const r = water.fill(this.jugs, this.data.caps, this.data.selected);
    if (!r.ok) { wx.showToast({ title: r.error, icon: 'none' }); return; }
    this.afterAction(r.jugs, r.text);
  },

  emptySelected() {
    if (this.data.won) return;
    if (this.data.selected < 0) { wx.showToast({ title: '先选一个壶', icon: 'none' }); return; }
    const r = water.empty(this.jugs, this.data.caps, this.data.selected);
    if (!r.ok) { wx.showToast({ title: r.error, icon: 'none' }); return; }
    this.afterAction(r.jugs, r.text);
  },

  afterAction(jugs, text) {
    this.jugs = jugs;
    const moves = this.data.moves + 1;
    const won = water.isSolved(jugs, this.data.target);
    this.setData({
      moves,
      selected: -1,
      won,
      hint: '',
      status: won ? `量到了！${this.data.target} 升` : `第 ${moves} 步：${text}`
    });
    this.render();
    if (won) getApp().markPlayed('water');
  },

  showHint() {
    if (this.data.won) return;
    const hint = water.nextHint(this.jugs, this.data.caps, this.data.target);
    this.setData({ hint: hint ? `下一步：${hint}` : '已经量到了。' });
  },

  reset() {
    this.jugs = this.data.caps.map(() => 0);
    this.setData({
      selected: -1,
      moves: 0,
      won: false,
      hint: '',
      status: '选一个壶，再点另一个壶倒水'
    });
    this.render();
  },

  newPuzzle() { this.newRound('practice'); },

  onShareAppMessage() {
    return { title: '倒水：用三个壶量出目标水量', path: '/pages/water/water' };
  }
});
