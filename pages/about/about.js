const { VERSION } = require('../../utils/version');

Page({
  data: {
    version: VERSION
  },

  onShareAppMessage() {
    return { title: '大脑保健操：每天 3 分钟，练一下直觉', path: '/pages/index/index' };
  }
});
