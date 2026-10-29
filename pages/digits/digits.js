const digits = require('../../utils/digits');

Page({
  data: {
    mode: 'daily',
    difficulty: 'normal',
    secret: [],
    input: ['', '', '', ''],
    activeSlot: 0,
    history: [],
    tries: 0,
    status: '输入 4 位数字，看 A/B 反馈',
    won: false,
    lost: false,
    hint: '',
    keys: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '←', '0', '提交'],
    dateStr: '',
  },

  onLoad() {
    this.startDaily();
  },

  startDaily() {
    const d = new Date();
    const dateStr = digits.dateKey(d);
    this.setData({
      mode: 'daily',
      difficulty: 'normal',
      dateStr,
      secret: digits.dailySecret(dateStr),
      input: ['', '', '', ''],
      activeSlot: 0,
      history: [],
      tries: 0,
      status: '点数字键，输入 4 位数字',
      won: false,
      lost: false,
      hint: ''
    });
  },

  startPractice() {
    this.setData({
      mode: 'practice',
      difficulty: this.data.difficulty,
      secret: digits.randomSecret(this.data.difficulty),
      input: ['', '', '', ''],
      activeSlot: 0,
      history: [],
      tries: 0,
      status: '练习模式：随机一题',
      won: false,
      lost: false,
      hint: ''
    });
  },

  setDifficulty(e) {
    const difficulty = e.currentTarget.dataset.level;
    this.setData({ difficulty }, () => {
      if (this.data.mode === 'practice') this.startPractice();
    });
  },

  press(e) {
    if (this.data.won || this.data.lost) return;
    const key = e.currentTarget.dataset.key;
    if (key === '提交') { this.submit(); return; }
    if (key === '←') { this.backspace(); return; }
    const idx = this.data.activeSlot;
    const input = this.data.input.slice();
    input[idx] = key;
    this.setInput(input, this.nextNextSlot(input, idx));
  },

  selectSlot(e) {
    if (this.data.won || this.data.lost) return;
    const idx = Number(e.currentTarget.dataset.index);
    if (idx >= 0 && idx < 4) this.setData({ activeSlot: idx });
  },


  nextNextSlot(input, from) {
    for (let step = 1; step <= 4; step++) {
      const i = (from + step) % 4;
      if (input[i] === '') return i;
    }
    return (from + 1) % 4;
  },

  setInput(input, activeSlot) {
    this.setData({ input, activeSlot: activeSlot == null ? 0 : activeSlot });
  },

  backspace() {
    const input = this.data.input.slice();
    let idx = this.data.activeSlot;
    if (input[idx] !== '') {
      input[idx] = '';
      this.setInput(input, idx);
      return;
    }
    for (let i = idx - 1; i >= 0; i--) {
      if (input[i] !== '') { input[i] = ''; this.setInput(input, i); return; }
    }
    this.setInput(input, idx);
  },

  submit() {
    if (this.data.won || this.data.lost) return;
    const arr = this.data.input.map(Number);
    const v = digits.validateGuess(arr, this.data.difficulty);
    if (!v.ok) {
      wx.showToast({ title: v.msg, icon: 'none' });
      return;
    }
    const score = digits.scoreGuess(arr, this.data.secret);
    const history = this.data.history.concat([{ digits: arr, a: score.a, b: score.b }]);
    const tries = history.length;
    let won = score.a === digits.LEN;
    let lost = !won && tries >= digits.MAX_TRIES;
    let status = won ? '答对了！' : (lost ? '次数用完了' : `第 ${tries} 次：${score.a}A ${score.b}B，继续`);
    const visible = won || lost ? digits.format(this.data.secret) : '';
    this.setData({ history, tries, won, lost, status, input: ['', '', '', ''], activeSlot: 0, answer: visible, hint: '' });
    getApp().markPlayed('digits');
  },

  showHint() {
    const n = digits.candidateCount(this.data.history, this.data.difficulty);
    this.setData({ hint: `当前还剩约 ${n} 个可能答案（A=数字和位置都对，B=数字对但位置不对）` });
  },

  newRound() {
    if (this.data.mode === 'daily') this.startDaily(); else this.startPractice();
  },

  onShareAppMessage() {
    return { title: '数字侦探：6 次机会猜出 4 位数', path: '/pages/digits/digits' };
  }
});
