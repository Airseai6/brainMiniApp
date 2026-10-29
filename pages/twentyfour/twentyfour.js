const tf = require('../../utils/twentyfour');

Page({
  data: {
    cards: [],
    selected: [],
    selectedMap: {},
    ops: tf.OPS,
    status: '选两张牌，再选一个运算',
    expression: '',
    hint: '',
    won: false,
    lost: false,
    solution: '',
    lastOp: '',
    canUndo: false
  },

  onLoad() { this.undoStack = []; this.newPuzzle(); },

  newPuzzle() {
    const p = tf.randomPuzzle();
    const cards = p.nums.map((v, i) => ({ id: i + 1, value: tf.rat(v), expr: String(v), alive: true }));
    this.undoStack = [];
    this.setData({
      cards,
      selected: [],
      selectedMap: {},
      status: '选两张牌，再选一个运算',
      expression: '',
      hint: '',
      won: false,
      lost: false,
      solution: p.solution,
      lastOp: '',
      canUndo: false
    });
  },

  tapCard(e) {
    if (this.data.won || this.data.lost) return;
    const id = Number(e.currentTarget.dataset.id);
    const selected = this.data.selected.slice();
    const pos = selected.indexOf(id);
    if (pos >= 0) selected.splice(pos, 1);
    else if (selected.length < 2) selected.push(id);
    const selectedMap = {};
    for (const x of selected) selectedMap[x] = true;
    this.setData({
      selected,
      selectedMap,
      lastOp: '',
      status: selected.length === 2 ? '已选 2 张，点一个运算符' : '选两张牌，再选一个运算'
    });
  },

  applyOp(e) {
    if (this.data.won || this.data.lost) return;
    if (this.data.selected.length !== 2) {
      wx.showToast({ title: '先选两张牌', icon: 'none' });
      return;
    }
    const op = e.currentTarget.dataset.op;
    const [a, b] = this.data.selected.map((id) => this.data.cards.find((c) => c.id === id));
    const fnMap = { '+': tf.add, '−': tf.sub, '×': tf.mul, '÷': tf.div };
    const result = fnMap[op](a.value, b.value);
    if (!result) {
      wx.showToast({ title: '不能除以 0', icon: 'none' });
      return;
    }

    this.undoStack.push({
      cards: this.data.cards,
      status: this.data.status,
      expression: this.data.expression,
      selected: this.data.selected,
      selectedMap: this.data.selectedMap,
      lastOp: this.data.lastOp,
      won: this.data.won,
      lost: this.data.lost
    });
    if (this.undoStack.length > 10) this.undoStack.shift();

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
      selectedMap: {},
      expression: `(${a.expr} ${op} ${b.expr})`,
      status: won ? '正好 24！' : (lost ? `最后是 ${tf.str(result)}，不是 24` : `还剩 ${alive} 个数，继续`),
      won,
      lost,
      lastOp: op,
      canUndo: true
    });
    if (won || lost) getApp().markPlayed('twentyfour');
  },

  undo() {
    if (!this.undoStack.length) return;
    const prev = this.undoStack.pop();
    this.setData({
      cards: prev.cards,
      status: prev.status,
      expression: prev.expression,
      selected: prev.selected,
      selectedMap: prev.selectedMap,
      lastOp: prev.lastOp,
      won: prev.won,
      lost: prev.lost,
      canUndo: this.undoStack.length > 0
    });
  },

  showHint() {
    this.setData({ hint: `参考解：${this.data.solution}` });
  },

  onShareAppMessage() {
    return { title: '24点：四个数各用一次，算出 24', path: '/pages/twentyfour/twentyfour' };
  }
});
