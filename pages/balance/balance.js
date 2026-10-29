const balance = require('../../utils/balance');

Page({
  data: {
    coins: balance.COINS,
    selected: {},
    leftText: '',
    rightText: '',
    candidateCount: 24,
    weighCount: 0,
    history: [],
    phase: 'weigh',
    candidates: [],
    secret: null,
    won: false,
    hint: ''
  },

  onLoad() { this.reset(); },

  reset() {
    this.game = balance.newGame();
    this.setData({
      selected: {},
      leftText: '',
      rightText: '',
      candidateCount: this.game.candidates.length,
      weighCount: 0,
      history: [],
      phase: 'weigh',
      candidates: [],
      secret: null,
      won: false,
      hint: ''
    });
  },

  tapCoin(e) {
    if (this.data.phase !== 'weigh') return;
    const coin = Number(e.currentTarget.dataset.coin);
    const selected = { ...this.data.selected };
    if (!selected[coin]) selected[coin] = 'left';
    else if (selected[coin] === 'left') selected[coin] = 'right';
    else delete selected[coin];
    this.setData({ selected });
    this.renderSides();
  },

  renderSides() {
    const left = []; const right = [];
    for (const coin of balance.COINS) {
      if (this.data.selected[coin] === 'left') left.push(coin);
      if (this.data.selected[coin] === 'right') right.push(coin);
    }
    this.setData({ leftText: left.length ? left.join('、') : '空', rightText: right.length ? right.join('、') : '空' });
  },

  clearSelection() {
    this.setData({ selected: {}, leftText: '', rightText: '' });
  },

  weigh() {
    if (this.data.phase !== 'weigh') return;
    const left = []; const right = [];
    for (const coin of balance.COINS) {
      if (this.data.selected[coin] === 'left') left.push(coin);
      if (this.data.selected[coin] === 'right') right.push(coin);
    }
    const r = balance.weigh(this.game, left, right);
    if (!r.ok) { wx.showToast({ title: r.error, icon: 'none' }); return; }
    this.game = r.state;
    const outcomeText = { left: '左盘重', right: '右盘重', balance: '平衡' }[this.game.outcome];
    const history = this.data.history.concat([{
      leftText: left.length ? left.join('、') : '空',
      rightText: right.length ? right.join('、') : '空',
      outcomeText
    }]);
    this.setData({
      history,
      weighCount: this.game.weighings.length,
      candidateCount: this.game.candidates.length,
      phase: this.game.phase,
      candidates: this.game.candidates,
      selected: {},
      leftText: '',
      rightText: '',
      hint: ''
    });
  },

  guess(e) {
    const idx = Number(e.currentTarget.dataset.index);
    const c = this.data.candidates[idx];
    if (!c) return;
    const r = balance.makeGuess(this.game, c.coin, c.heavy);
    if (!r.ok) return;
    this.game = r.state;
    this.setData({ phase: 'done', won: this.game.won, secret: this.game.secret });
    getApp().markPlayed('balance');
  },

  showHint() {
    this.setData({ hint: `剩余 ${this.data.candidateCount} 种可能。第一次别只称 6 对 6，留几枚不上秤，让三种结果都能继续分。` });
  },

  onShareAppMessage() {
    return { title: '天平称币：3 次称重锁定 24 种可能', path: '/pages/balance/balance' };
  }
});
