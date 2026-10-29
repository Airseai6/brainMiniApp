const fox = require('../../utils/fox');

Page({
  data: {
    state: null,
    holes: [],
    level: 1,
    status: '选择要检查的洞',
    hint: '',
    caught: false,
    lost: false
  },

  onLoad() {
    this.start(1);
  },

  start(level) {
    const state = fox.newGame(level);
    this.setData({ state, level, status: '点一个洞开始排查', hint: '', caught: false, lost: false });
    this.render();
  },

  render() {
    const state = this.data.state;
    const checked = state.checked || [];
    const last = checked.length ? checked[checked.length - 1] : -1;
    const holes = Array.from({ length: state.n }, (_, i) => ({
      label: i + 1,
      checked: checked.includes(i),
      last: i === last,
      fox: state.caught && i === last
    }));
    this.setData({ holes });
  },

  check(e) {
    const idx = Number(e.currentTarget.dataset.index);
    const state = fox.probe(this.data.state, idx);
    const status = state.caught ? '抓到了！' : (state.lost ? '天数用完，狐狸跑了' : `第 ${state.day} 天：再查一个洞`);
    this.setData({ state, status, caught: state.caught, lost: state.lost });
    this.render();
    if (state.caught || state.lost) getApp().markPlayed('fox');
  },

  setLevel(e) {
    this.start(Number(e.currentTarget.dataset.level));
  },

  showHint() {
    this.setData({ hint: fox.hint(this.data.state) });
  },

  restart() {
    this.start(this.data.level);
  },

  onShareAppMessage() {
    return { title: '抓狐狸：路径上可以保证抓到，环上就未必了', path: '/pages/fox/fox' };
  }
});
