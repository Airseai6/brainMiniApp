const games = require('../../data/games');

Page({
  data: {
    game: null,
    url: '',
    link: '',
    missing: true
  },

  onLoad(options) {
    const game = games.find(g => g.key === options.key) || null;
    const app = getApp();
    const base = (app.globalData && app.globalData.h5Base) || '';
    const site = (app.globalData && app.globalData.siteBase) || 'https://airseai6.github.io/fusion-data-academy';
    const link = game ? site + game.url : '';
    const url = game && base ? base + game.url : '';
    this.setData({ game, link, url, missing: !url });
    if (game) wx.setNavigationBarTitle({ title: game.name });
  },

  copy() {
    if (!this.data.link) return;
    wx.setClipboardData({ data: this.data.link });
  },

  back() {
    wx.navigateBack();
  },

  onShareAppMessage() {
    return { title: this.data.game ? this.data.game.name : '大脑保健操', path: '/pages/index/index' };
  }
});
