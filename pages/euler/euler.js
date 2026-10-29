const euler = require('../../utils/euler');

Page({
  data: {
    level: euler.LEVELS[0],
    nodes: [],
    edges: [],
    status: '点一条与当前点相连的边',
    usedCount: 0,
    edgeCount: 0,
    hint: ''
  },

  onLoad() { this.start(euler.LEVELS[0]); },

  start(level) {
    this.state = euler.newState(level);
    this.setData({ level, status: '点一条与当前点相连的边', hint: '', usedCount: 0, edgeCount: level.edges.length });
    this.render();
  },

  render() {
    const level = this.state.level;
    const nodes = level.nodes.map((n) => ({
      id: n.id,
      label: n.label,
      current: this.state.current === n.id,
      start: this.state.current === level.start && this.state.used.length === 0,
      style: `left:${n.x / level.width * 100}%;top:${n.y / level.height * 100}%`
    }));
    const edges = level.edges.map(([a, b], i) => {
      const A = level.nodes[a];
      const B = level.nodes[b];
      const dx = B.x - A.x;
      const dy = B.y - A.y;
      const len = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx) * 180 / Math.PI;
      return {
        used: this.state.used.includes(i),
        style: `left:${A.x / level.width * 100}%;top:${A.y / level.height * 100}%;width:${len / level.width * 100}%;transform:rotate(${angle}deg)`
      };
    });
    this.setData({ nodes, edges, usedCount: this.state.used.length, status: this.data.status });
  },

  tapEdge(e) {
    const i = Number(e.currentTarget.dataset.index);
    const r = euler.traverse(this.state, i);
    if (!r.ok) { this.setData({ hint: r.error }); return; }
    this.state = r.state;
    if (this.state.done) {
      this.setData({ status: `走完了！${this.state.level.edges.length} 条边全部走了一次`, hint: '' });
      getApp().markPlayed('euler');
    } else {
      const label = this.state.level.nodes[this.state.current].label;
      this.setData({ status: `已走 ${this.state.used.length}/${this.state.level.edges.length}，当前点：${label}`, hint: '' });
    }
    this.render();
  },

  tapNode(e) {
    const idx = Number(e.currentTarget.dataset.index);
    if (this.state.used.length) { this.setData({ hint: '已经出发了，想换起点先撤销或重来。' }); return; }
    const level = { ...this.state.level, start: idx };
    this.state = euler.newState(level);
    this.setData({ status: `起点设为 ${level.nodes[idx].label}。点相邻的边走。`, hint: '' });
    this.render();
  },

  setLevel(e) {
    const id = e.currentTarget.dataset.id;
    const level = euler.levelById(id);
    if (level) this.start(level);
  },

  validate() {
    const deg = euler.degrees(this.state.level);
    const odd = euler.oddNodes(this.state.level);
    const text = this.state.level.nodes.map((n) => `${n.label}：${deg[n.id]}`).join('，');
    if (euler.hasEulerPath(this.state.level)) {
      this.setData({ status: `各点度数：${text}`, hint: `奇度点 ${odd.length} 个，有欧拉路径。` });
    } else {
      this.setData({ status: `各点度数：${text}`, hint: `奇度点 ${odd.length} 个，超过 2 个：没有欧拉路径，怎么走都会剩边。` });
    }
  },

  undo() {
    this.state = euler.undo(this.state);
    this.setData({ status: '撤销一步', hint: '' });
    this.render();
  },

  reset() {
    this.state = euler.newState(this.state.level);
    this.setData({ status: '回到起点', hint: '' });
    this.render();
  },

  onShareAppMessage() {
    return { title: '一笔画：七桥突围', path: '/pages/euler/euler' };
  }
});
