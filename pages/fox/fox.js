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
    const possible = state.possible || [];
    const showGhost = state.level === 1 && checked.length > 0 && !state.caught;
    const holes = Array.from({ length: state.n }, (_, i) => ({
      label: i + 1,
      checked: checked.includes(i),
      last: i === last,
      fox: state.caught && i === last,
      ghost: showGhost && possible.includes(i),
      style: state.cyclic ? this.ringStyle(i, state.n) : ''
    }));
    this.setData({ holes });
  },

  ringStyle(i, n) {
    const angle = -Math.PI / 2 + (Math.PI * 2 * i) / n;
    const x = 50 + 34 * Math.cos(angle);
    const y = 50 + 34 * Math.sin(angle);
    return `left:${x.toFixed(2)}%;top:${y.toFixed(2)}%`;
  },

  check(e) {
    const idx = Number(e.currentTarget.dataset.index);
    const state = fox.probe(this.data.state, idx);
    let status = `第 ${state.day} 天：再查一个洞`;
    if (state.caught) status = '抓到了！';
    else if (state.lost) status = '天数用完，狐狸跑了';
    else if (state.level === 1) status = `第 ${state.day} 天：浅色狐狸是可能位置`;
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
