import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
// 微信小程序审核敏感/高风险词：不做诱导分享、拉群、导流。
const BANNED = [
  '拉人', '入群', '加群', '进群', '群聊', '微信群', '裂变',
  '邀请', '助力', '分享得', '转发', '福利', '领资料', '加微信',
  '引流', '变现', '关注公众号', '公众号', '免费领', '限时',
  '名额', '打卡群', '拼团', '分销', '返利'
];

function read(file) {
  return fs.readFileSync(path.join(ROOT, file), 'utf8');
}

test('mini program UI has no group/induced-share/funnel wording', () => {
  const files = [];
  function walk(dir) {
    for (const name of fs.readdirSync(dir)) {
      const p = path.join(dir, name);
      const st = fs.statSync(p);
      if (st.isDirectory()) walk(p);
      else if (/\.(wxml|js|json)$/.test(name)) files.push(path.relative(ROOT, p).replace(/\\/g, '/'));
    }
  }
  walk(path.join(ROOT, 'pages'));
  files.push('app.js', 'app.json', 'data/games.js');
  const hits = [];
  for (const f of files) {
    const text = read(f);
    for (const word of BANNED) {
      if (text.includes(word)) hits.push(`${f}: ${word}`);
    }
  }
  assert.deepEqual(hits, [], 'banned wording found: ' + hits.join(', '));
});

test('mini program UI avoids the word 游戏 in user-facing copy', () => {
  const files = [];
  function walk(dir) {
    for (const name of fs.readdirSync(dir)) {
      const p = path.join(dir, name);
      const st = fs.statSync(p);
      if (st.isDirectory()) walk(p);
      else if (name.endsWith('.wxml') || name.endsWith('.json')) files.push(path.join(p));
    }
  }
  walk(path.join(ROOT, 'pages'));
  const hits = files.filter(f => fs.readFileSync(f, 'utf8').includes('游戏'));
  assert.deepEqual(hits, [], 'game wording found: ' + hits.join(', '));
});
