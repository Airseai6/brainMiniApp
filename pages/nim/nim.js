const nim = require('../../utils/nim');

Page({
  data: {
    mode: 'normal',
    state: null,
    piles: [],
    turn: '你',
    winner: '',
    hint: '',
    thinking: false,
    lastMove: ''
  },

  onLoad() {
    this.newGame();
  },

  newGame() {
    const state = nim.newState([3, 4, 5], this.data.mode === 'misere');
    this.setData({ state, winner: '', hint: '', thinking: false, lastMove: '', turn: '你' });
    this.render();
  },

  render() {
    const state = this.data.state;
    const piles = state.piles.map((count, i) => ({
      label: 'ABC'[i],
      count,
      stones: Array.from({ length: count }, (_, j) => j),
      options: Array.from({ length: count }, (_, j) => j + 1)
    }));
    this.setData({ piles });
  },

  setMode(e) {
    const mode = e.currentTarget.dataset.mode;
    if (this.data.thinking) return;
    this.setData({ mode }, () => this.newGame());
  },

  take(e) {
    if (this.data.thinking || this.data.winner) return;
    const pile = Number(e.currentTarget.dataset.pile);
    const count = Number(e.currentTarget.dataset.count);
    const r = nim.take(this.data.state, pile, count);
    if (!r.ok) {
      wx.showToast({ title: r.error, icon: 'none' });
      return;
    }
    const state = r.state;
    this.setData({ state, lastMove: `你从堆 ${'ABC'[pile]} 拿走 ${count} 颗` });
    this.render();
    if (nim.total(state) === 0) {
      this.finish('你');
      return;
    }
    this.setData({ thinking: true, turn: 'AI' });
    setTimeout(() => this.aiStep(), 450);
  },

  aiStep() {
    if (this.data.winner) return;
    const state = this.data.state;
    const move = nim.bestMove(state);
    if (!move) { this.finish('AI'); return; }
    const r = nim.take(state, move.pile, move.take);
    if (!r.ok) { this.finish('AI'); return; }
    this.setData({ state: r.state, lastMove: `AI 从堆 ${'ABC'[move.pile]} 拿走 ${move.take} 颗`, thinking: false, turn: '你' });
    this.render();
    if (nim.total(r.state) === 0) this.finish('AI');
  },

  finish(lastPlayer) {
    // 普通模式：拿最后一颗者赢；misere：拿最后一颗者输。
    const lastWins = this.data.mode === 'normal';
    const winnerIsPlayer = lastPlayer === '你' ? lastWins : !lastWins;
    this.setData({ thinking: false, winner: winnerIsPlayer ? '你赢了' : 'AI 赢了', turn: '' });
    getApp().markPlayed('nim');
  },

  showHint() {
    this.setData({ hint: nim.hintText(this.data.state) });
  },

  copyShare() {
    wx.showShareMenu({ withShareTicket: true });
  },

  onShareAppMessage() {
    return { title: '最后一颗：三堆石子，你能赢 AI 吗？', path: '/pages/nim/nim' };
  }
});
