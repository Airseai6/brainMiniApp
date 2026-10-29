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

  slide(e) {
    const dir = e.currentTarget.dataset.dir;
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
