// 每日一题：按日期确定题目，同一天任何人打开都是同一道。
const BANK = [
  {
    q: '3 堆石子：3、4、5。每次从一堆拿走至少一颗，拿最后一颗的人赢。先手有必胜着法吗？',
    options: ['有，把异或和变成 0', '没有，后手必胜', '看运气', '要看谁先拿'],
    answer: 0,
    why: '3、4、5 的异或和是 2。先手从堆 A 取 2 颗，变成 1、4、5，异或和为 0，把必败态留给后手。'
  },
  {
    q: '4 层汉诺塔，最少需要多少步？',
    options: ['8 步', '15 步', '16 步', '31 步'],
    answer: 1,
    why: 'T(n)=2T(n−1)+1，T(1)=1，所以 T(4)=15。'
  },
  {
    q: '十五数码随便打乱后，有多少比例的局面永远拼不回去？',
    options: ['全部都能拼回', '大约一半', '大约十分之一', '只有 3×3 拼不回'],
    answer: 1,
    why: '看逆序数的奇偶：只有一半局面能通过滑动还原。'
  },
  {
    q: '24 点里，有些牌必须经过分数才能算出来。为什么？',
    options: ['分数运算更高级', '整数四则运算不够用', '分数可以随便凑', '因为牌面有小数'],
    answer: 1,
    why: '例如 3、3、8、8：8÷(3−8÷3)=24，必须经过分数。'
  },
  {
    q: '过河问题里，把“人、狼、羊、菜”的每个状态看成点，最少步数对应什么？',
    options: ['状态图最短路', '排列组合', '最大公约数', '二进制异或'],
    answer: 0,
    why: '每个合法状态是一个点，每次过河是一条边，最少步数就是最短路。'
  },
  {
    q: '环上的“抓狐狸”为什么可能永远抓不到？',
    options: ['狐狸跑得太快', '环上的奇偶性可能对不上', '洞太少', '因为没有必胜策略'],
    answer: 1,
    why: '环上相邻移动会保持某种奇偶性；如果初始奇偶不匹配，可能永远追不上。'
  },
  {
    q: '15 数码中，空格左右滑动会改变什么？',
    options: ['逆序数的奇偶', '数字总和', '最大数字', '行数'],
    answer: 0,
    why: '左右滑不改变逆序数；上下滑会改变逆序数奇偶，这是可解性的关键。'
  },
  {
    q: '“最后一颗”切到「取最后者输」模式后，策略会怎样？',
    options: ['完全不变', '要先处理只剩 1 颗的堆', '先手必输', '只能随机拿'],
    answer: 1,
    why: 'misère 版本要先处理“只剩 1 颗”的堆；所有堆都只剩 1 颗时，留给对手奇数堆才是好局面。'
  }
];

function pad2(n) { return String(n).padStart(2, '0'); }

function getDailyQuestion(date = new Date()) {
  const y = date.getFullYear();
  const m = pad2(date.getMonth() + 1);
  const d = pad2(date.getDate());
  const dateStr = `${y}-${m}-${d}`;
  // 以 2026-01-01 为第 0 天，按日取题。
  const day = Math.floor((Date.UTC(y, date.getMonth(), date.getDate()) - Date.UTC(2026, 0, 1)) / 86400000);
  const idx = ((day % BANK.length) + BANK.length) % BANK.length;
  return { dateStr, index: idx, ...BANK[idx] };
}

function checkAnswer(question, selected) {
  return selected === question.answer;
}

module.exports = { getDailyQuestion, checkAnswer, BANK };
