const games = require('../../data/games');

Page({
  data: {
    games,
    replayGames: [],
    classicGames: [],
    streak: 0,
    playedCount: 0,
    today: ''
  },

  onLoad() {
    this.setData({
      replayGames: games.filter((g) => g.replayable),
      classicGames: games.filter((g) => !g.replayable)
    });
  },

  onShow() {
    const app = getApp();
    const p = (app.globalData && app.globalData.progress) || {};
    const played = p.played || {};
    const d = new Date();
    this.setData({
      streak: p.streak || 0,
      playedCount: Object.keys(played).filter(k => played[k]).length,
      today: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    });
  },

  openDaily() { wx.navigateTo({ url: '/pages/daily/daily' }); },
  openPractice() { wx.navigateTo({ url: '/pages/practice/practice' }); },

  openRandom() {
    const pool = this.data.replayGames.length ? this.data.replayGames : games;
    const g = pool[Math.floor(Math.random() * pool.length)];
    wx.navigateTo({ url: `/pages/${g.page}/${g.page}` });
  },

  openGame(e) {
    const key = e.currentTarget.dataset.key;
    const game = games.find(g => g.key === key);
    if (!game) return;
    if (game.native) {
      const page = game.page || game.key;
      wx.navigateTo({ url: `/pages/${page}/${page}` });
      return;
    }
    wx.showModal({
      title: game.name,
      content: '这个关卡还在移植中。',
      showCancel: false,
      confirmText: '知道了'
    });
  },

  onShareAppMessage() {
    return { title: '每天 3 分钟，打一局高能思维关卡', path: '/pages/index/index' };
  }
});
