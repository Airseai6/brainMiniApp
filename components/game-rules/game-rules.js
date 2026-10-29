Component({
  properties: {
    text: { type: String, value: '' },
    example: { type: String, value: '' },
    tip: { type: String, value: '' }
  },

  data: {
    expanded: true,
    segments: []
  },

  lifetimes: {
    attached() { this.buildSegments(); }
  },

  observers: {
    example() { this.buildSegments(); }
  },

  methods: {
    toggle() {
      this.setData({ expanded: !this.data.expanded });
    },

    buildSegments() {
      const raw = this.data.example || '';
      const segments = [];
      const re = /\[\[(.+?)\]\]|\*\*(.+?)\*\*/g;
      let last = 0;
      let m;
      while ((m = re.exec(raw))) {
        if (m.index > last) segments.push({ text: raw.slice(last, m.index), cls: '' });
        if (m[1] !== undefined) segments.push({ text: m[1], cls: 'hl' });
        else segments.push({ text: m[2], cls: 'em' });
        last = re.lastIndex;
      }
      if (last < raw.length) segments.push({ text: raw.slice(last), cls: '' });
      this.setData({ segments });
    }
  }
});
