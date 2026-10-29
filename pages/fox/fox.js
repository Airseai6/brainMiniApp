const fox = require('../../utils/fox');

Page({
  data: {
    state: null,
    holes: [],
    level: 1,
    hint: '',
    caught: false,
    lost: false,
    possibleText: '',
    history: []
  },

  onLoad() { this.start(1); },

  start(level) {
    const state = fox.newGame(level);
    this.setData({ state, level, hint: '', caught: false, lost: false });
    this.render();
  },

  render() {
    const state = this.data.state;
    const history = state.history || [];
    const last = history.length ? history[history.length - 1].hole - 1 : -1;
    const possible = state.possible || [];
    const showGhost = !state.caught && !state.lost && history.length > 0;
    const holes = Array.from({ length: state.n }, (_, i) => ({
      label: i + 1,
      latest: i === last,
      fox: state.caught && i === last,
      ghost: showGhost && i !== last && possible.includes(i),
      style: state.cyclic ? this.ringStyle(i, state.n) : ''
    }));
    const possibleText = state.caught
      ? '已经抓到了。'
      : (state.lost ? '天数用完，狐狸跑了。' : (history.length
        ? `狐狸可能在：${possible.map((x) => x + 1).join('、')} 号洞`
        : '还没排查，狐狸可能在任意一个洞。'));
    this.setData({ holes, history, possibleText });
  },

  ringStyle(i, n) {
    const angle = -Math.PI / 2 + (Math.PI * 2 * i) / n;
    const x = 50 + 34 * Math.cos(angle);
    const y = 50 + 34 * Math.sin(angle);
    return `left:${x.toFixed(2)}%;top:${y.toFixed(2)}%;`;
  },

  check(e) {
    const idx = Number(e.currentTarget.dataset.index);
    const state = fox.probe(this.data.state, idx);
    this.setData({ state, caught: state.caught, lost: state.lost });
    this.render();
    if (state.caught || state.lost) getApp().markPlayed('fox');
  },

  setLevel(e) { this.start(Number(e.currentTarget.dataset.level)); },

  showHint() { this.setData({ hint: fox.hint(this.data.state) }); },

  restart() { this.start(this.data.level); },

  onShareAppMessage() {
    return { title: '抓狐狸：路径上可以保证抓到，环上就未必了', path: '/pages/fox/fox' };
  }
});
