const fusion = require('../../utils/fusion');

Page({
  data: {
    cells: [],
    score: 0,
    moves: 0,
    status: '同种核素滑到一起就会聚变',
    won: false,
    lost: false,
    energyText: '0 MeV',
    goalText: '1.00 GeV',
    progress: 0,
    topName: '—'
  },

  onLoad() { this.reset(); },

  reset() {
    const game = fusion.newGame();
    this.setData({ game, status: '合并同种核素，累计能量到 1 GeV', won: false, lost: false });
    this.render();
  },

  render() {
    const g = this.data.game;
    this.setData({
      cells: fusion.boardView(g.board),
      score: g.score,
      moves: g.moves,
      won: g.won,
      lost: g.lost,
      energyText: fusion.formatEnergy(g.energyEv),
      goalText: fusion.formatEnergy(g.goalEv),
      progress: fusion.progressPercent(g),
      topName: fusion.nameOf(fusion.topLevel(g.board)) || '—'
    });
  },

  onTouchStart(e) {
    const t = e.touches && e.touches[0];
    if (t) this.touchStart = { x: t.clientX, y: t.clientY };
  },

  onTouchEnd(e) {
    const start = this.touchStart;
    const t = e.changedTouches && e.changedTouches[0];
    if (!start || !t) return;
    this.touchStart = null;
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) return;
    const dir = Math.abs(dx) > Math.abs(dy)
      ? (dx > 0 ? 'right' : 'left')
      : (dy > 0 ? 'down' : 'up');
    this.slideDir(dir);
  },

  catchMove() {},

  slide(e) { this.slideDir(e.currentTarget.dataset.dir); },

  slideDir(dir) {
    const r = fusion.move(this.data.game, dir);
    if (!r.ok) return;
    const g = r.state;
    this.setData({ game: g, status: g.won ? '能量达到 1 GeV！' : (g.lost ? '没有可合并的了' : `第 ${g.moves} 步`) });
    this.render();
    if (g.won || g.lost) getApp().markPlayed('fusion-stack');
  },

  onShareAppMessage() {
    return { title: '聚变堆叠：累计真实聚变能量到 1 GeV', path: '/pages/fusion/fusion' };
  }
});
