const fh = require('../../utils/foxhunt');

Page({
  data: {
    state: null,
    nodes: [],
    status: '封住一个路口，别让狐狸进洞',
    hint: '',
    won: false,
    lost: false
  },

  onLoad() { this.reset(); },

  reset() {
    const state = fh.newGame();
    this.setData({ state, status: '封住一个路口，别让狐狸进洞', hint: '', won: false, lost: false });
    this.render();
  },

  render() {
    const nodes = fh.NODES.map((id) => ({
      id: id + 1,
      fox: this.data.state.fox === id,
      den: id === fh.DEN,
      blocked: this.data.state.blocked.includes(id)
    }));
    this.setData({ nodes });
  },

  tapNode(e) {
    if (this.data.won || this.data.lost) return;
    const id = Number(e.currentTarget.dataset.index);
    const r = fh.block(this.data.state, id);
    if (!r.ok) {
      wx.showToast({ title: r.error, icon: 'none' });
      return;
    }
    const state = r.state;
    const status = state.won ? '狐狸无路可走，你赢了' : (state.lost ? '狐狸进洞了' : `已封 ${state.moves} 个路口`);
    this.setData({ state, status, won: state.won, lost: state.lost });
    this.render();
    if (state.won || state.lost) getApp().markPlayed('fox-hunt');
  },

  showHint() { this.setData({ hint: fh.hint(this.data.state) }); },

  onShareAppMessage() {
    return { title: '围堵狐狸：封住路口，别让它进洞', path: '/pages/foxhunt/foxhunt' };
  }
});
