// 14 个关卡，全部为小程序原生页面。
// replayable=true 的进入每日一练/随机体验；false 的一次性解谜单独展示。
module.exports = [
  {
    key: 'digits',
    page: 'digits',
    name: '数字侦探',
    tag: '信息论',
    emoji: '🔢',
    desc: '6 次猜出 4 位数，用 A/B 反馈排除；每局答案都不同',
    native: true,
    replayable: true
  },
  {
    key: 'twentyfour',
    page: 'twentyfour',
    name: '24点',
    tag: '速算',
    emoji: '🃏',
    desc: '随机手牌，只出有解；每局都要重新找组合',
    native: true,
    replayable: true
  },
  {
    key: 'nim',
    page: 'nim',
    name: '最后一颗',
    tag: '博弈',
    emoji: '🪨',
    desc: '三堆石子对 AI，每局都能换策略重来',
    native: true,
    replayable: true
  },
  {
    key: 'sudoku',
    page: 'sudoku',
    name: '迷你数独',
    tag: '逻辑',
    emoji: '🧮',
    desc: '4×4 唯一解新题，每局都从零排除',
    native: true,
    replayable: true
  },
  {
    key: 'fusion-stack',
    page: 'fusion',
    name: '聚变堆叠',
    tag: '核素',
    emoji: '⚛️',
    desc: '2048 式随机棋盘，合并核素到镍-64',
    native: true,
    replayable: true
  },
  {
    key: 'fox',
    page: 'fox',
    name: '抓狐狸',
    tag: '图论',
    emoji: '🦊',
    desc: '路径与环上的追逃，策略一旦看懂就结束',
    native: true,
    replayable: false
  },
  {
    key: 'hanoi',
    page: 'hanoi',
    name: '汉诺塔',
    tag: '递归',
    emoji: '🗼',
    desc: '最少 2ⁿ−1 步，懂了递归就通关',
    native: true,
    replayable: false
  },
  {
    key: 'fifteen',
    page: 'fifteen',
    name: '十五数码',
    tag: '不变量',
    emoji: '🔀',
    desc: '奇偶不变量决定局面有没有解',
    native: true,
    replayable: false
  },
  {
    key: 'river',
    page: 'river',
    name: '过河',
    tag: '状态图',
    emoji: '🚣',
    desc: '狼羊菜 + 传教士野人两关，走过一次就懂',
    native: true,
    replayable: false
  },
  {
    key: 'fox-hunt',
    page: 'foxhunt',
    name: '围堵狐狸',
    tag: '图论',
    emoji: '🧭',
    desc: '封路口找顶点割，最优解会很快被看穿',
    native: true,
    replayable: false
  },
  {
    key: 'balance',
    page: 'balance',
    name: '天平称币',
    tag: '信息论',
    emoji: '⚖️',
    desc: '3 次称重锁定假币，掌握三分法就通关',
    native: true,
    replayable: false
  },
  {
    key: 'nonogram',
    page: 'nonogram',
    name: '数织',
    tag: '图像推理',
    emoji: '🖼️',
    desc: '5×5 三幅固定图案，推完就结束',
    native: true,
    replayable: false
  },
  {
    key: 'euler',
    page: 'euler',
    name: '一笔画',
    tag: '欧拉',
    emoji: '✏️',
    desc: '七桥为什么走不通，数奇度点就懂',
    native: true,
    replayable: false
  },
  {
    key: 'monty',
    page: 'monty',
    name: '三门问题',
    tag: '概率',
    emoji: '🚪',
    desc: '换门 67% 的实验，看过结果就明白',
    native: true,
    replayable: false
  }
];

