const duel = require('../../utils/diceduel');

Page({
  data: {
    dice: duel.DICE,
    match: null,
    selected: '',
    aiSelected: '',
    playerRoll: null,
    aiRoll: null,
    result: '',
    history: [],
    done: false,
    won: false,
    tie: false
  },

  onLoad() { this.start(); },

  start() {
    this.setData({
      match: duel.newMatch(),
      selected: '',
      aiSelected: '',
      playerRoll: null,
      aiRoll: null,
      result: '',
      history: [],
      done: false,
      won: false,
      tie: false
    });
  },

  pick(e) {
    if (this.data.match.phase !== 'pick') return;
    const id = e.currentTarget.dataset.id;
    const r = duel.chooseDie(this.data.match, id);
    if (!r.ok) return;
    const m = r.state;
    const done = m.phase === 'done';
    const won = done && m.playerScore > m.aiScore;
    const tie = done && m.playerScore === m.aiScore;
    this.setData({
      match: m,
      selected: m.playerDie,
      aiSelected: m.aiDie,
      playerRoll: m.playerRoll,
      aiRoll: m.aiRoll,
      result: m.result,
      history: m.history,
      done,
      won,
      tie
    });
    if (done) getApp().markPlayed('dice-duel');
  },

  next() {
    if (this.data.match.phase === 'done') { this.start(); return; }
    this.setData({
      match: duel.nextRound(this.data.match),
      selected: '',
      aiSelected: '',
      playerRoll: null,
      aiRoll: null,
      result: ''
    });
  },

  startOver() { this.start(); },

  onShareAppMessage() {
    return { title: '骰子对决：三颗互相克制的骰子', path: '/pages/diceduel/diceduel' };
  }
});
