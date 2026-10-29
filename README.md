# 大脑保健操 · 微信小程序

一个「每天 3 分钟，玩一个高能数学小关卡」的微信小程序。

原生小程序，不套 H5，不依赖服务器，不采集用户个人信息。

## 关卡

- 抓狐狸：路径图上有必胜策略，环上未必
- 数字侦探：4 位数字、6 次机会、A/B 反馈
- 最后一颗：Nim，普通 / 取最后者输
- 汉诺塔：3–6 层，BFS 提示
- 十五数码：可解性、滑动、曼哈顿距离
- 24点：分数四则、两两合并
- 过河：狼、羊、菜
- 围堵狐狸：图论围堵
- 聚变堆叠：2048 式核素合并

另有：

- 每日一题
- 每日一练：每天 3 个关卡
- 随机体验

## 目录

```
app.js / app.json / app.wxss
data/games.js              关卡数据
utils/                     纯逻辑（页面与测试共用）
pages/                     首页、每日一题、每日一练、9 个关卡
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
node --test tests/logic.test.mjs tests/games.test.mjs tests/practice.test.mjs tests/wording.test.mjs
```

当前 23 项测试：逻辑、结构、练习与审核词汇。

## 设计约束

- 不做诱导分享、拉群、导流；
- 不接广告、支付、排行榜；
- 进度只存在本地；
- 不采集儿童个人信息。

## License

未指定。代码仅用于本项目，未经许可请勿商用或再分发。
