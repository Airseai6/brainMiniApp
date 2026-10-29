const tf = require('../../utils/twentyfour');

Page({
  data: {
    cards: [],
    selected: [],
    ops: tf.OPS,
    status: '选两张牌，再选一个运算',
    expression: '',
    hint: '',
    won: false,
    lost: false,
    solution: ''
  },

  onLoad() { this.newPuzzle(); },

  newPuzzle() {
    const p = tf.randomPuzzle();
    const cards = p.nums.map((v, i) => ({ id: i + 1, value: tf.rat(v), expr: String(v), alive: true }));
    this.setData({ cards, selected: [], status: '选两张牌，再选一个运算', expression: '', hint: '', won: false, lost: false, solution: p.solution });
  },

  tapCard(e) {
    if (this.data.won || this.data.lost) return;
    const id = Number(e.currentTarget.dataset.id);
    const selected = this.data.selected.slice();
    const pos = selected.indexOf(id);
    if (pos >= 0) selected.splice(pos, 1);
    else if (selected.length < 2) selected.push(id);
    this.setData({ selected });
  },

  applyOp(e) {
    if (this.data.won || this.data.lost) return;
    if (this.data.selected.length !== 2) {
      wx.showToast({ title: '先选两张牌', icon: 'none' });
      return;
    }
    const op = e.currentTarget.dataset.op;
    const [a, b] = this.data.selected.map((id) => this.data.cards.find((c) => c.id === id));
    const A = a.value;
    const B = b.value;
    const fnMap = { '+': tf.add, '−': tf.sub, '×': tf.mul, '÷': tf.div };
    const result = fnMap[op](A, B);
    if (!result) {
      wx.showToast({ title: '不能除以 0', icon: 'none' });
      return;
    }
    const nextCards = this.data.cards.filter((c) => c.id !== b.id).map((c) => {
      if (c.id !== a.id) return c;
      return { ...c, value: result, expr: `(${a.expr} ${op} ${b.expr})` };
    });
    const alive = nextCards.length;
    const won = alive === 1 && tf.is24(result);
    const lost = alive === 1 && !won;
    this.setData({
      cards: nextCards,
      selected: [],
      expression: nextCards.length ? nextCards[nextCards.length - 1].expr : '',
      status: won ? '正好 24！' : (lost ? `最后是 ${tf.str(result)}，不是 24` : `还剩 ${alive} 个数，继续`),
      won,
      lost
    });
    if (won || lost) getApp().markPlayed('twentyfour');
  },

  showHint() {
    this.setData({ hint: `参考解：${this.data.solution}` });
  },

  onShareAppMessage() {
    return { title: '24点：四个数各用一次，算出 24', path: '/pages/twentyfour/twentyfour' };
  }
});
