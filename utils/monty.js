// 三门问题：选门、主持人开羊、换/不换；模拟 1000 局。
const DOORS = [0, 1, 2];
function hostOpen(car, picked) {
  const allowed = DOORS.filter((d) => d !== car && d !== picked);
  return allowed[Math.floor(Math.random() * allowed.length)];
}
function switchTarget(picked, opened) {
  return DOORS.find((d) => d !== picked && d !== opened);
}
function simulate(rounds = 1000) {
  let switchWins = 0; let stayWins = 0;
  for (let i = 0; i < rounds; i++) {
    const car = Math.floor(Math.random() * 3);
    const picked = Math.floor(Math.random() * 3);
    const opened = hostOpen(car, picked);
    const switched = switchTarget(picked, opened);
    if (car === picked) stayWins++;
    if (car === switched) switchWins++;
  }
  return { rounds, switchWins, stayWins, switchRate: switchWins / rounds, stayRate: stayWins / rounds };
}
function newRound() { return { car: Math.floor(Math.random() * 3), picked: null, opened: null, phase: 'pick', total: 0, wins: 0 }; }
function choose(state, door) {
  if (state.phase !== 'pick') return state;
  return { ...state, picked: door, opened: hostOpen(state.car, door), phase: 'decide' };
}
function decide(state, switchDoor) {
  if (state.phase !== 'decide') return state;
  const finalDoor = switchDoor ? switchTarget(state.picked, state.opened) : state.picked;
  const won = finalDoor === state.car;
  return { ...state, phase: 'result', finalDoor, won, last: switchDoor ? 'switch' : 'stay', total: state.total + 1, wins: state.wins + (won ? 1 : 0) };
}
module.exports = { DOORS, hostOpen, switchTarget, simulate, newRound, choose, decide };
