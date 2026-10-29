const mathler = require('../../utils/mathler');

const DIGIT_POS = [0, 1, 3, 4, 6, 7];
const EMPTY_INPUT = ['', '', '', '', '', '=', '', ''];

Page({
  data: {
    mode: 'daily',
    dateStr: '',
    input: EMPTY_INPUT,
    display: [],
    keys: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '+', '−', '⌫', '提交'],
    history: [],
    tries: 0,
    maxTries: 6,
    won: false,
    lost: false,
    answer: '',
    status: '猜一个隐藏算式',
    showRules: true,
    showAnswer: false
  },

  onLoad() { this.newRound('daily'); },

  newRound(mode) {
    if (mode && typeof mode === 'object') mode = this.data.mode;
    const m = mode || this.data.mode || 'daily';
    this.hidden = m === 'daily' ? mathler.dailyHidden(new Date()) : mathler.randomHidden();
    this.setData({
      mode: m,
      dateStr: mathler.dailyDateStr(new Date()),
      input: EMPTY_INPUT.slice(),
      history: [],
      tries: 0,
      won: false,
      lost: false,
      answer: '',
      status: m === 'daily' ? '每日一题 · 6 次猜出算式' : '练习模式 · 6 次猜出算式',
      showRules: this.data.showRules,
      showAnswer: false
    });
    this.render();
  },

  startDaily() { if (this.data.mode !== 'daily' || this.data.won || this.data.lost) this.newRound('daily'); },
  startPractice() { if (this.data.mode !== 'practice' || this.data.won || this.data.lost) this.newRound('practice'); },
  toggleRules() { this.setData({ showRules: !this.data.showRules }); },

  render() {
    const display = this.data.input.map((ch, i) => ({ char: ch || '·', empty: !ch, op: i === 2 || i === 5 }));
    this.setData({ display });
  },

  press(e) {
    if (this.data.won || this.data.lost) return;
    const key = e.currentTarget.dataset.key;
    if (key === '提交') { this.submit(); return; }
    if (key === '⌫') { this.backspace(); return; }
    const input = this.data.input.slice();
    if (key === '+') { input[2] = '+'; }
    else if (key === '−') { input[2] = '-'; }
    else {
      const pos = DIGIT_POS.find((p) => !input[p]);
      if (pos === undefined) { wx.showToast({ title: '8 格已填满，点提交', icon: 'none' }); return; }
      input[pos] = key;
    }
    this.setData({ input });
    this.render();
  },

  backspace() {
    const input = this.data.input.slice();
    const filled = [];
    for (const p of DIGIT_POS) if (input[p]) filled.push(p);
    if (input[2]) filled.push(2);
    if (!filled.length) return;
    filled.sort((a, b) => a - b);
    input[filled[filled.length - 1]] = '';
    this.setData({ input });
    this.render();
  },

  submit() {
    const input = this.data.input;
    const missing = DIGIT_POS.some((p) => !input[p]) || !input[2];
    if (missing) { wx.showToast({ title: '先把 6 个数字和运算符填满', icon: 'none' }); return; }
    const guess = input.join('');
    const parsed = mathler.parse(guess);
    if (!parsed.ok || !parsed.valid) { wx.showToast({ title: '这个等式不成立', icon: 'none' }); return; }
    const marks = mathler.feedback(this.hidden.text, guess);
    const cells = guess.split('').map((ch, i) => ({ char: ch, mark: marks[i] }));
    const history = this.data.history.concat([{ cells }]);
    const tries = this.data.tries + 1;
    const won = guess === this.hidden.text;
    const lost = !won && tries >= this.data.maxTries;
    this.setData({
      history,
      tries,
      input: EMPTY_INPUT.slice(),
      won,
      lost,
      showAnswer: won || lost,
      answer: won || lost ? this.hidden.text : '',
      status: won ? '猜中了！' : (lost ? '次数用完' : `第 ${tries + 1} / ${this.data.maxTries} 次`)
    });
    this.render();
    if (won) getApp().markPlayed('mathler');
  },

  onShareAppMessage() {
    return { title: '每日算式：6 次猜出隐藏等式', path: '/pages/mathler/mathler' };
  }
});
