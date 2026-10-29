const monty = require('../../utils/monty');

Page({
  data: {
    phase: 'pick',
    doors: [],
    status: '先选一扇门',
    total: 0,
    wins: 0,
    rate: '—',
    resultText: ''
  },

  onLoad() { this.game = monty.newRound(); this.render(); },

  render() {
    const g = this.game;
    const doors = [0, 1, 2].map((i) => {
      let cls = '';
      if (g.picked === i && g.phase !== 'result') cls = 'picked';
      if (g.opened === i) cls += ' opened';
      let icon = '🚪';
      if (g.phase === 'result') icon = i === g.car ? '🚗' : '🐐';
      else if (g.opened === i) icon = '🐐';
      let label = '点这扇门';
      if (g.picked === i && g.phase !== 'result') label = '你的选择';
      else if (g.opened === i) label = '主持人打开';
      else if (g.phase === 'result') label = i === g.car ? '车在这里' : (i === g.finalDoor ? '你选的' : '羊');
      return { cls, icon, label };
    });
    this.setData({
      phase: g.phase,
      doors,
      total: g.total,
      wins: g.wins,
      rate: g.total ? Math.round(g.wins / g.total * 100) + '%' : '—',
      status: g.phase === 'pick' ? '先选一扇门' : (g.phase === 'decide' ? '主持人打开了羊门：换，还是不换？' : (g.won ? '你赢了' : '这次是羊'))
    });
  },

  tapDoor(e) {
    if (this.game.phase !== 'pick') return;
    this.game = monty.choose(this.game, Number(e.currentTarget.dataset.index));
    this.setData({ resultText: '' });
    this.render();
  },

  switchDoor() {
    if (this.game.phase !== 'decide') return;
    this.game = monty.decide(this.game, true);
    this.setData({ resultText: `换门：${this.game.won ? '赢' : '输'}。车在 ${this.game.car + 1} 号门。` });
    this.render();
    getApp().markPlayed('monty');
  },

  stayDoor() {
    if (this.game.phase !== 'decide') return;
    this.game = monty.decide(this.game, false);
    this.setData({ resultText: `坚持：${this.game.won ? '赢' : '输'}。车在 ${this.game.car + 1} 号门。` });
    this.render();
    getApp().markPlayed('monty');
  },

  again() {
    this.game = { ...monty.newRound(), total: this.game.total, wins: this.game.wins };
    this.setData({ resultText: '' });
    this.render();
  },

  simulate() {
    const r = monty.simulate(1000);
    this.setData({ resultText: `1000 局：换门赢 ${r.switchWins} 局（${(r.switchRate * 100).toFixed(1)}%），坚持赢 ${r.stayWins} 局。` });
  },

  onShareAppMessage() {
    return { title: '三门问题：换还是不换？', path: '/pages/monty/monty' };
  }
});
