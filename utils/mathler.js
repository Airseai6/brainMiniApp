// 每日算式：隐藏一个 AB op CD = EF 的两位数等式，6 次猜，颜色反馈。
// 只使用 + / −，保证两个操作数和结果都是两位数（固定 8 格）。
const EQUATIONS = [];
for (let a = 10; a <= 99; a++) {
  for (let b = 10; b <= 99; b++) {
    if (a + b <= 99) EQUATIONS.push({ a, b, op: '+', c: a + b, text: `${a}+${b}=${a + b}` });
    if (a - b >= 10) EQUATIONS.push({ a, b, op: '-', c: a - b, text: `${a}-${b}=${a - b}` });
  }
}

function dailyHidden(date = new Date()) {
  const day = Math.floor((Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - Date.UTC(2026, 0, 1)) / 86400000);
  return EQUATIONS[((day % EQUATIONS.length) + EQUATIONS.length) % EQUATIONS.length];
}

function randomHidden() {
  return EQUATIONS[Math.floor(Math.random() * EQUATIONS.length)];
}

function parse(guess) {
  if (!/^\d{2}[+\-]\d{2}=\d{2}$/.test(guess)) return { ok: false };
  const a = Number(guess.slice(0, 2));
  const op = guess[2];
  const b = Number(guess.slice(3, 5));
  const c = Number(guess.slice(6, 8));
  const expected = op === '+' ? a + b : a - b;
  return { ok: true, a, op, b, c, valid: expected === c && c >= 10 };
}

function feedback(hidden, guess) {
  const marks = Array(8).fill('miss');
  const left = {};
  for (const ch of hidden) left[ch] = (left[ch] || 0) + 1;
  for (let i = 0; i < 8; i++) {
    if (guess[i] === hidden[i]) { marks[i] = 'hit'; left[guess[i]]--; }
  }
  for (let i = 0; i < 8; i++) {
    if (marks[i] === 'hit') continue;
    const ch = guess[i];
    if (left[ch] > 0) { marks[i] = 'near'; left[ch]--; }
  }
  return marks;
}

function dailyDateStr(date = new Date()) {
  const p = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${p(date.getMonth() + 1)}-${p(date.getDate())}`;
}

module.exports = { EQUATIONS, dailyHidden, randomHidden, parse, feedback, dailyDateStr };
