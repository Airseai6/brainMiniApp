App({
  globalData: {
    // 生产环境请换成已 ICP 备案、并在小程序后台配置为业务域名的 H5 地址。
    // 例如：https://math.example.com
    h5Base: '',
    siteBase: 'https://airseai6.github.io/fusion-data-academy'
  },

  onLaunch() {
    // 本地留存：连续天数、已玩记录，不采集任何儿童个人信息。
    try {
      const raw = wx.getStorageSync('brain_gym_v1');
      this.globalData.progress = raw || { streak: 0, lastDate: '', played: {} };
    } catch (e) {
      this.globalData.progress = { streak: 0, lastDate: '', played: {} };
    }
  },

  markPlayed(key) {
    const p = this.globalData.progress || { streak: 0, lastDate: '', played: {} };
    p.played = p.played || {};
    p.played[key] = true;
    const d = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const today = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    if (p.dailyDate !== today) {
      p.dailyDate = today;
      p.dailyDone = {};
    }
    p.dailyDone = p.dailyDone || {};
    p.dailyDone[key] = true;
    this.globalData.progress = p;
    try { wx.setStorageSync('brain_gym_v1', p); } catch (e) {}
  }
});
