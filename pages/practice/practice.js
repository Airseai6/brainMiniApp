const games = require('../../data/games');
const practice = require('../../utils/practice');

Page({
  data: {
    dateStr: '',
    items: [],
    doneCount: 0,
    allDone: false,
    randomName: ''
  },

  onLoad() { this.build(); },

  onShow() { this.refreshDone(); },

  build() {
    const dateStr = practice.todayKey(new Date());
    const replay = games.filter((g) => g.replayable);
    const keys = practice.dailyKeys(replay.map((g) => g.key), dateStr, 3);
    const items = keys.map((key) => {
      const g = games.find((x) => x.key === key);
      return { key, page: g.page, name: g.name, emoji: g.emoji, tag: g.tag, done: false };
    });
    this.setData({ dateStr, items });
    this.refreshDone();
  },

  refreshDone() {
    const p = (getApp().globalData && getApp().globalData.progress) || {};
    const today = practice.todayKey(new Date());
    const doneMap = p.dailyDate === today ? (p.dailyDone || {}) : {};
    const items = this.data.items.map((it) => ({ ...it, done: !!doneMap[it.key] }));
    const doneCount = items.filter((i) => i.done).length;
    this.setData({ items, doneCount, allDone: doneCount === items.length });
  },

  openItem(e) {
    const key = e.currentTarget.dataset.key;
    const item = this.data.items.find((x) => x.key === key);
    if (item) wx.navigateTo({ url: `/pages/${item.page}/${item.page}` });
  },

  openRandom() {
    const replay = games.filter((g) => g.replayable);
    const key = practice.randomKey(replay.map((g) => g.key));
    const g = games.find((x) => x.key === key);
    this.setData({ randomName: g.name });
    wx.navigateTo({ url: `/pages/${g.page}/${g.page}` });
  },

  onShareAppMessage() {
    return { title: '每日一练：今天 3 个小关卡', path: '/pages/practice/practice' };
  }
});
