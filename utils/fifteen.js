// 十五数码（3×3）纯逻辑：可解性、滑动、曼哈顿距离、随机可解开局。
function solved(size = 3) {
  const a = [];
  for (let i = 1; i < size * size; i++) a.push(i);
  a.push(0);
  return a;
}

function isSolved(tiles) {
  for (let i = 0; i < tiles.length - 1; i++) if (tiles[i] !== i + 1) return false;
  return tiles[tiles.length - 1] === 0;
}

function inversionCount(tiles) {
  const arr = tiles.filter((x) => x !== 0);
  let inv = 0;
  for (let i = 0; i < arr.length; i++) for (let j = i + 1; j < arr.length; j++) if (arr[i] > arr[j]) inv++;
  return inv;
}

function blankRowFromBottom(tiles, size) {
  return size - Math.floor(tiles.indexOf(0) / size);
}

function isSolvable(tiles, size = 3) {
  const inv = inversionCount(tiles);
  if (size % 2 === 1) return inv % 2 === 0;
  return (inv + blankRowFromBottom(tiles, size)) % 2 === 1;
}

function canSlide(tiles, size, index) {
  const blank = tiles.indexOf(0);
  if (index < 0 || index >= tiles.length || index === blank) return false;
  const dr = Math.floor(index / size) - Math.floor(blank / size);
  const dc = (index % size) - (blank % size);
  return Math.abs(dr) + Math.abs(dc) === 1;
}

function slide(tiles, size, index) {
  if (!canSlide(tiles, size, index)) return null;
  const next = tiles.slice();
  const blank = next.indexOf(0);
  next[blank] = next[index];
  next[index] = 0;
  return next;
}

function shuffle(size = 3, steps = 120) {
  let tiles = solved(size);
  let blank = tiles.indexOf(0);
  let last = -1;
  for (let i = 0; i < steps; i++) {
    const nbs = [];
    const r = Math.floor(blank / size);
    const c = blank % size;
    if (r > 0) nbs.push(blank - size);
    if (r < size - 1) nbs.push(blank + size);
    if (c > 0) nbs.push(blank - 1);
    if (c < size - 1) nbs.push(blank + 1);
    const choices = nbs.filter((x) => x !== last);
    const pick = choices[Math.floor(Math.random() * choices.length)];
    tiles = slide(tiles, size, pick);
    last = blank;
    blank = pick;
  }
  return isSolved(tiles) ? shuffle(size, steps) : tiles;
}

function manhattan(tiles, size = 3) {
  let sum = 0;
  for (let i = 0; i < tiles.length; i++) {
    const v = tiles[i];
    if (!v) continue;
    const goal = v - 1;
    sum += Math.abs(Math.floor(i / size) - Math.floor(goal / size)) + Math.abs((i % size) - (goal % size));
  }
  return sum;
}

module.exports = { solved, isSolved, isSolvable, slide, canSlide, shuffle, manhattan };
