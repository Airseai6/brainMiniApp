// 9 个关卡，全部为小程序原生页面。
module.exports = [
  {
    key: 'fox',
    page: 'fox',
    name: '抓狐狸',
    tag: '路径图',
    emoji: '🦊',
    desc: '路径上可以保证抓到，环上却未必',
    native: true
  },
  {
    key: 'digits',
    page: 'digits',
    name: '数字侦探',
    tag: '信息论',
    emoji: '🔢',
    desc: '6 次猜出 4 位数，用 A/B 反馈排除',
    native: true
  },
  {
    key: 'nim',
    page: 'nim',
    name: '最后一颗',
    tag: '博弈',
    emoji: '🪨',
    desc: '三堆石子，二进制异或决定必败态',
    native: true
  },
  {
    key: 'hanoi',
    page: 'hanoi',
    name: '汉诺塔',
    tag: '递归',
    emoji: '🗼',
    desc: '最少 2ⁿ−1 步，每多一层几乎翻倍',
    native: true
  },
  {
    key: 'fifteen',
    page: 'fifteen',
    name: '十五数码',
    tag: '不变量',
    emoji: '🔀',
    desc: '一半局面永远解不开，开局三秒能判断',
    native: true
  },
  {
    key: 'twentyfour',
    page: 'twentyfour',
    name: '24点',
    tag: '分数',
    emoji: '🃏',
    desc: '有些牌必须经过分数，只肯用整数就走不通',
    native: true
  },
  {
    key: 'river',
    page: 'river',
    name: '过河',
    tag: '状态图',
    emoji: '🚣',
    desc: '狼、羊、菜，船每次只能带一样',
    native: true
  },
  {
    key: 'fox-hunt',
    page: 'foxhunt',
    name: '围堵狐狸',
    tag: '图论',
    emoji: '🧭',
    desc: '封住几个路口，狐狸就无路可逃',
    native: true
  },
  {
    key: 'fusion-stack',
    page: 'fusion',
    name: '聚变堆叠',
    tag: '核素',
    emoji: '⚛️',
    desc: '2048 式合并，每一格是核素',
    native: true
  }
];
