# 大脑保健操 · 微信小程序

![CI](https://github.com/Airseai6/brainMiniApp/actions/workflows/ci.yml/badge.svg)
![Release](https://img.shields.io/github/v/release/Airseai6/brainMiniApp)


一个「每天 3 分钟，打一局高能思维关卡」的微信小程序。

原生小程序，不套 H5，不依赖服务器，不采集用户个人信息。

## 关卡

反复挑战（进入每日一练 / 随机体验）：

- 数字侦探：4 位数字、6 次机会、A/B 反馈，每局答案不同
- 每日算式：隐藏两位数 + / − 等式，每日 4 次 / 练习 6 次，颜色反馈
- 24点：随机手牌，只出有解
- 最后一颗：Nim 对 AI，可换策略重来
- 迷你数独：4×4 引导 / 6×6 入门 / 9×9 进阶，每局唯一解
- 点灯：4×4 / 5×5 可解棋盘，点一格翻转十字
- 倒水：三个壶量出目标水量，BFS 最短路
- 数字滑块：3×3 八数码 / 4×4 十五数码，每局随机可解
- 聚变堆叠：2048 式随机棋盘，累计真实 Q 值到 1 GeV

经典解谜（单独展示）：

- 抓狐狸
- 汉诺塔
- 过河：狼·羊·菜 + 传教士·野人两关
- 天平称币
- 数织
- 一笔画

另有：

- 每日一题
- 每日一练：每天 3 个可复玩关卡
- 随机体验：只从可复玩关卡里抽

## 目录

```
app.js / app.json / app.wxss
styles/game.wxss           游戏页共用样式
data/games.js              关卡数据 + 可重复标记
utils/                     纯逻辑（页面与测试共用）
pages/                     首页、每日一题、每日一练、15 个关卡
tests/                     Node 测试
.github/workflows/         CI / Release
```

## 本地运行

1. 安装微信开发者工具；
2. 导入本目录；
3. 在 `project.config.json` 填入自己的小程序 AppID；
4. 编译。

## 测试

```powershell
node --test tests/logic.test.mjs tests/games.test.mjs tests/new-games.test.mjs tests/practice.test.mjs tests/wording.test.mjs
```

当前 34 项测试：逻辑、结构、练习、每日题库与审核词汇。

每日一题题库按日期轮换，同一天全站同一题。

## 设计约束

- 不做诱导分享、拉群、导流；
- 不接广告、支付、排行榜；
- 进度只存在本地；
- 不采集儿童个人信息。

## License

未指定。代码仅用于本项目，未经许可请勿商用或再分发。


