// 骰子对决：三颗非传递骰子。每颗平均点数相同，但两两对战胜率循环克制。
// A 克 B，B 克 C，C 克 A，各约 55.6%。
const DICE = [
  { id: 'A', name: '红骰', faces: [2, 2, 4, 4, 9, 9], color: 'red' },
  { id: 'B', name: '蓝骰', faces: [1, 1, 6, 6, 8, 8], color: 'blue' },
  { id: 'C', name: '黄骰', faces: [3, 3, 5, 5, 7, 7], color: 'amber' }
];
const MAX_ROUNDS = 5;

function dieById(id) { return DICE.find((d) => d.id === id); }
function rollFace(die) { return die.faces[Math.floor(Math.random() * die.faces.length)]; }

function winProbability(a, b) {
  let win = 0; let total = 0;
  for (const x of a.faces) for (const y of b.faces) {
    total++;
    if (x > y) win++;
  }
  return win / total;
}

function newMatch() {
  return {
    round: 1,
    maxRounds: MAX_ROUNDS,
    playerScore: 0,
    aiScore: 0,
    phase: 'pick',
    playerDie: null,
    aiDie: null,
    playerRoll: null,
    aiRoll: null,
    result: '',
    history: []
  };
}

function chooseDie(match, dieId) {
  if (match.phase !== 'pick') return { ok: false, state: match, error: '先进入下一轮' };
  const playerDie = dieById(dieId);
  if (!playerDie) return { ok: false, state: match, error: '没有这颗骰子' };
  const others = DICE.filter((d) => d.id !== playerDie.id);
  const aiDie = others[Math.floor(Math.random() * others.length)];
  const playerRoll = rollFace(playerDie);
  const aiRoll = rollFace(aiDie);
  let result = '平';
  let playerScore = match.playerScore;
  let aiScore = match.aiScore;
  if (playerRoll > aiRoll) { result = '你赢'; playerScore++; }
  else if (playerRoll < aiRoll) { result = 'AI 赢'; aiScore++; }
  const done = match.round >= match.maxRounds;
  const history = match.history.concat([{
    round: match.round,
    playerDie: playerDie.id,
    aiDie: aiDie.id,
    playerRoll,
    aiRoll,
    result
  }]);
  return {
    ok: true,
    state: {
      ...match,
      phase: done ? 'done' : 'result',
      playerDie: playerDie.id,
      aiDie: aiDie.id,
      playerRoll,
      aiRoll,
      result,
      playerScore,
      aiScore,
      history
    }
  };
}

function nextRound(match) {
  if (match.phase === 'done') return newMatch();
  return {
    ...match,
    round: match.round + 1,
    phase: 'pick',
    playerDie: null,
    aiDie: null,
    playerRoll: null,
    aiRoll: null,
    result: ''
  };
}

module.exports = { DICE, MAX_ROUNDS, newMatch, chooseDie, nextRound, winProbability };
