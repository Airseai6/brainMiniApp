// 天平称币：12 枚金币、1 枚假币（偏重或偏轻）、3 次称重。
const COINS = Array.from({ length: 12 }, (_, i) => i + 1);
const MAX_WEIGH = 3;

function initialCandidates() {
  const out = [];
  for (const coin of COINS) {
    out.push({ coin, heavy: true });
    out.push({ coin, heavy: false });
  }
  return out;
}

function weightOf(coin, secret) {
  let w = 1;
  if (coin === secret.coin) w += secret.heavy ? 1 : -1;
  return w;
}

function compare(secret, left, right) {
  const l = left.reduce((s, c) => s + weightOf(c, secret), 0);
  const r = right.reduce((s, c) => s + weightOf(c, secret), 0);
  return l > r ? 'left' : (l < r ? 'right' : 'balance');
}

function filterCandidates(candidates, left, right, outcome) {
  return candidates.filter((c) => compare(c, left, right) === outcome);
}

function newGame(secret) {
  const s = secret || { coin: COINS[Math.floor(Math.random() * COINS.length)], heavy: Math.random() < 0.5 };
  return { secret: s, candidates: initialCandidates(), weighings: [], phase: 'weigh' };
}

function validateWeigh(left, right) {
  if (!left.length || !right.length) return { ok: false, msg: '两边都要放金币' };
  if (left.length !== right.length) return { ok: false, msg: '两边数量必须相同' };
  if (new Set([...left, ...right]).size !== left.length + right.length) return { ok: false, msg: '同一枚币不能同时放两边' };
  if ([...left, ...right].some((c) => !COINS.includes(c))) return { ok: false, msg: '没有这枚币' };
  return { ok: true };
}

function weigh(state, left, right) {
  if (state.phase !== 'weigh') return { ok: false, state, error: '已经不能继续称了' };
  const v = validateWeigh(left, right);
  if (!v.ok) return { ok: false, state, error: v.msg };
  const outcome = compare(state.secret, left, right);
  const next = {
    ...state,
    candidates: filterCandidates(state.candidates, left, right, outcome),
    outcome,
    weighings: state.weighings.concat([{ left, right, outcome }])
  };
  if (next.weighings.length >= MAX_WEIGH) next.phase = 'guess';
  return { ok: true, state: next };
}

function makeGuess(state, coin, heavy) {
  if (state.phase !== 'guess') return { ok: false, state, error: '先完成 3 次称重' };
  return { ok: true, state: { ...state, phase: 'done', won: state.secret.coin === coin && state.secret.heavy === heavy, guess: { coin, heavy } } };
}

module.exports = { COINS, MAX_WEIGH, initialCandidates, compare, filterCandidates, newGame, validateWeigh, weigh, makeGuess };
