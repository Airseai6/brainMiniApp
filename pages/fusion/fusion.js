const fusion = require('../../utils/fusion');

Page({
  data: {
    cells: [],
    score: 0,
    moves: 0,
    status: '同种核素滑到一起就会聚变',
    won: false,
    lost: false
  },

  onLoad() { this.reset(); },

  reset() {
    const game = fusion.newGame();
    this.setData({ game, status: '同种核素滑到一起就会聚变', won: false, lost: false });
    this.render();
  },

  render() {
    const g = this.data.game;
    this.setData({ cells: fusion.boardView(g.board), score: g.score, moves: g.moves, won: g.won, lost: g.lost });
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

  slide(e) {
    this.slideDir(e.currentTarget.dataset.dir);
  },

  slideDir(dir) {
    const r = fusion.move(this.data.game, dir);
    if (!r.ok) return;
    const g = r.state;
    this.setData({ game: g, status: g.won ? '聚变到镍-64！' : (g.lost ? '没有可合并的了' : `第 ${g.moves} 步`) });
    this.render();
    if (g.won || g.lost) getApp().markPlayed('fusion-stack');
  },

  onShareAppMessage() {
    return { title: '聚变堆叠：把核素合并到镍-64', path: '/pages/fusion/fusion' };
  }
});
