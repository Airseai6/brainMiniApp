// 数字侦探（Bulls & Cows）纯逻辑：4 位、6 次机会、A/B 反馈、每日种子、候选集。
const LEN = 4;
const MAX_TRIES = 6;
const TOTAL = { normal: 5040, hard: 10000 };

function hashStr(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
}

function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pad2(n) { return (n < 10 ? '0' : '') + n; }
function dateKey(d) { return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`; }

function dailySecret(dateStr) {
  const rnd = mulberry32(hashStr(`digits|${dateStr}|normal`));
  const pool = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, LEN);
}

function randomSecret(difficulty = 'normal') {
  const hard = difficulty === 'hard';
  const pool = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  if (hard) return Array.from({ length: LEN }, () => Math.floor(Math.random() * 10));
  return pool.slice(0, LEN);
}

function scoreGuess(guess, secret) {
  let a = 0;
  let b = 0;
  for (let i = 0; i < LEN; i++) if (guess[i] === secret[i]) a++;
  const count = new Map();
  for (const d of secret) count.set(d, (count.get(d) || 0) + 1);
  for (let i = 0; i < LEN; i++) {
    if (guess[i] === secret[i]) continue;
    if ((count.get(guess[i]) || 0) > 0) {
      b++;
      count.set(guess[i], count.get(guess[i]) - 1);
    }
  }
  return { a, b };
}

function validateGuess(digits, difficulty = 'normal') {
  if (!Array.isArray(digits) || digits.length !== LEN) return { ok: false, msg: '需要正好 4 位数字' };
  if (!digits.every((d) => Number.isInteger(d) && d >= 0 && d <= 9)) return { ok: false, msg: '每一位必须是 0–9' };
  if (difficulty !== 'hard' && new Set(digits).size !== LEN) return { ok: false, msg: '普通模式不能有重复数字' };
  return { ok: true };
}

function candidates(difficulty = 'normal') {
  const out = [];
  if (difficulty === 'hard') {
    for (let a = 0; a < 10; a++) for (let b = 0; b < 10; b++) for (let c = 0; c < 10; c++) for (let d = 0; d < 10; d++) out.push([a, b, c, d]);
  } else {
    for (let a = 0; a < 10; a++) for (let b = 0; b < 10; b++) if (b !== a) for (let c = 0; c < 10; c++) {
      if (c === a || c === b) continue;
      for (let d = 0; d < 10; d++) {
        if (d === a || d === b || d === c) continue;
        out.push([a, b, c, d]);
      }
    }
  }
  return out;
}

function candidateCount(history, difficulty = 'normal') {
  if (!history || !history.length) return TOTAL[difficulty] || TOTAL.normal;
  return candidates(difficulty).filter((cand) => history.every((h) => {
    const s = scoreGuess(cand, h.digits);
    return s.a === h.a && s.b === h.b;
  })).length;
}

function format(digits) { return digits.join(''); }

module.exports = { LEN, MAX_TRIES, TOTAL, dailySecret, randomSecret, scoreGuess, validateGuess, candidateCount, format, dateKey };
