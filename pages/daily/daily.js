const { getDailyQuestion, checkAnswer } = require('../../utils/daily');

Page({
  data: {
    q: null,
    selected: -1,
    answered: false,
    correct: false,
    streak: 0,
    letters: ['A', 'B', 'C', 'D']
  },

  onLoad() {
    const q = getDailyQuestion(new Date());
    const p = (getApp().globalData && getApp().globalData.progress) || {};
    this.setData({ q, streak: p.streak || 0 });
  },

  choose(e) {
    if (this.data.answered) return;
    const selected = Number(e.currentTarget.dataset.index);
    const correct = checkAnswer(this.data.q, selected);
    const app = getApp();
    const p = app.globalData.progress || { streak: 0, lastDate: '', played: {} };
    let streak = p.streak || 0;
    if (correct && p.lastDate !== this.data.q.dateStr) {
      const y = new Date();
      y.setDate(y.getDate() - 1);
      const yesterday = `${y.getFullYear()}-${String(y.getMonth() + 1).padStart(2, '0')}-${String(y.getDate()).padStart(2, '0')}`;
      streak = p.lastDate === yesterday ? streak + 1 : 1;
      p.streak = streak;
      p.lastDate = this.data.q.dateStr;
      p.played = p.played || {};
      p.played.daily = true;
      app.globalData.progress = p;
      try { wx.setStorageSync('brain_gym_v1', p); } catch (e) {}
    }
    this.setData({ selected, answered: true, correct, streak });
  },

  again() {
    this.setData({ selected: -1, answered: false, correct: false });
  },

  back() {
    wx.navigateBack();
  },

  onShareAppMessage() {
    return { title: '今天的反直觉数学题，你能答对吗？', path: '/pages/daily/daily' };
  }
});
