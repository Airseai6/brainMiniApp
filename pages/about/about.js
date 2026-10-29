Page({
  data: {
    version: '0.1.0'
  },

  onShareAppMessage() {
    return { title: '大脑保健操：每天 3 分钟，练一下直觉', path: '/pages/index/index' };
  }
});
