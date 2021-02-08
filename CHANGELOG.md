# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [1.5.2](https://github.com/hbt-org/hearthstone-battlegrounds-tools/compare/v1.5.1...v1.5.2) (2021-02-08)

### Features

- **suspension:** 实现 mac 端拔线 ([3eb81a3](https://github.com/hbt-org/hearthstone-battlegrounds-tools/commit/3eb81a3410a9ab367c04e760e9f0add22626053f)), closes [#13](https://github.com/hbt-org/hearthstone-battlegrounds-tools/issues/13)

### Bug Fixes

- **core:** 修复统计页 LineChart 可能出现的报错问题 ([3d59891](https://github.com/hbt-org/hearthstone-battlegrounds-tools/commit/3d59891317e1fca219eb6737cbf193b8c4984362))

### [1.5.1](https://github.com/hbt-org/hearthstone-battlegrounds-tools/compare/v1.5.0...v1.5.1) (2021-01-30)

### Features

- **core:** 完成新版统计页面 ([05a1152](https://github.com/hbt-org/hearthstone-battlegrounds-tools/commit/05a1152a77d1452eccb2a7145a5f6cb7a440aeb8))
- **core:** 统计页面加入近期平均排名折线图 ([c4a36dc](https://github.com/hbt-org/hearthstone-battlegrounds-tools/commit/c4a36dce8de3c5a44c94e61ff4501b8d5e1e4d89))
- **core:** 赛后复盘中的战力数值改为异步计算，解决插件刚打开卡顿的问题 ([b1176f7](https://github.com/hbt-org/hearthstone-battlegrounds-tools/commit/b1176f7699ecb47fadf2c49eaa05e5a019789a12))

### Bug Fixes

- **core:** 修复复盘中没有随从导致阵容区域塌陷的问题 ([eb18615](https://github.com/hbt-org/hearthstone-battlegrounds-tools/commit/eb18615a7cc525770028c96ed45c430f97fdeec9))
- **core:** 修复战绩无法同步的问题 ([063e247](https://github.com/hbt-org/hearthstone-battlegrounds-tools/commit/063e247fbee9012557883d60a906bd380f089ac5))

## [1.5.0](https://github.com/hbt-org/hearthstone-battlegrounds-tools/compare/v1.4.2...v1.5.0) (2021-01-25)

### Features

- **core:** 复盘内容加入双方战力，以及可通过点击 label 快速跳转至相应回合 ([6613110](https://github.com/hbt-org/hearthstone-battlegrounds-tools/commit/661311044a282eb4da17a734a89685e5a9500044))
- 完成赛后复盘功能 ([62ca8e8](https://github.com/hbt-org/hearthstone-battlegrounds-tools/commit/62ca8e8fb6bfa72e4f235ff08610ed3f9ab7d59f))
- **loghandler:** 支持查询升本数据 ([bbb0ce1](https://github.com/hbt-org/hearthstone-battlegrounds-tools/commit/bbb0ce159f09b399e418ae5896827c6b9f46385a))

### Bug Fixes

- **core:** 设置页 macos 端不显示拔线相关的设置 ([d6d2981](https://github.com/hbt-org/hearthstone-battlegrounds-tools/commit/d6d2981ca44af597effbf08fdf44c504e7814914))
- **main:** 修复 mac 系统下 command+Q 组合键在窗口未激活状态下也失效的问题 ([c00cec1](https://github.com/hbt-org/hearthstone-battlegrounds-tools/commit/c00cec151022e597425d088abd49093d88c6d017))

### [1.4.2](https://github.com/hbt-org/hearthstone-battlegrounds-tools/compare/v1.4.1...v1.4.2) (2021-01-22)

### Features

- 适配 19.4 版本新英雄、新随从 ([fe26a3f](https://github.com/hbt-org/hearthstone-battlegrounds-tools/commit/fe26a3fa57fe7e5afe192b4a8eba8987d518baf8))
- **core:** macos 端支持快捷键退出,修复 macos 端可能打不开换成目录的问题,去除拔线快捷键 F12 ([ddc7e02](https://github.com/hbt-org/hearthstone-battlegrounds-tools/commit/ddc7e02f0df8e2cd1b2f152f490c582644a56b11))
- **core:** 修改炉石帧数的提示语改动 ([571fbe6](https://github.com/hbt-org/hearthstone-battlegrounds-tools/commit/571fbe6bec4e648f5be3742e7a65661f5f180825))
- **core:** 导航栏加入插件名称 ([bbbfb43](https://github.com/hbt-org/hearthstone-battlegrounds-tools/commit/bbbfb43e213940aac2024839f945d58cd28f1da1))
- **core:** 战绩列表 项目预览的战绩切换为战绩模拟的形式 ([5abb30a](https://github.com/hbt-org/hearthstone-battlegrounds-tools/commit/5abb30a143b5a667e89903009fdb73ed6df5d02b))
- 更新自动更新服务的链接 ([99c116e](https://github.com/hbt-org/hearthstone-battlegrounds-tools/commit/99c116e0914275736a6898b70586f118e05cdcbb))
- **core:** 移除导入战绩功能，加入手动更新战绩功能 ([2adbb96](https://github.com/hbt-org/hearthstone-battlegrounds-tools/commit/2adbb965db7050bd9851e09262d7d32a8b498d1e))
- **main:** 加入更新进度以及 macos 下托盘图标调整 ([3b68f00](https://github.com/hbt-org/hearthstone-battlegrounds-tools/commit/3b68f0019e85a59ec1d8b3e9f290edf27681ba0d))
- **main:** 去除 suspension 的宽度拖动的限制 ([dd74697](https://github.com/hbt-org/hearthstone-battlegrounds-tools/commit/dd74697cd829b8f5c906e3222eb1ed1467f42b78))
- **main:** 调整托盘图标，使用更清晰的呈现方式 ([598d5d9](https://github.com/hbt-org/hearthstone-battlegrounds-tools/commit/598d5d9395701d5654ae5f92745a0154b052e9f5))

### Bug Fixes

- 修复随从数据库新随从没有 official 字段的问题 ([fdc8fee](https://github.com/hbt-org/hearthstone-battlegrounds-tools/commit/fdc8fee7a484359a37997ef19930306715a58e98))
- 回退 echarts 版本修复新版本导致的报错 ([74bcf47](https://github.com/hbt-org/hearthstone-battlegrounds-tools/commit/74bcf47d805e7df57cef18e52965355daa93ba25))
- **core:** 修复以及补充随从库缺少的随从,并解决某些随从战力计算失败的问题 ([b56b598](https://github.com/hbt-org/hearthstone-battlegrounds-tools/commit/b56b598593f1c1aed5af01301f28fecb13f8554c))
- 修复日志监控执行多次的问题 ([663bc1d](https://github.com/hbt-org/hearthstone-battlegrounds-tools/commit/663bc1dfd05ae263e6f866d05c421369007c280e))

### [1.4.1](https://github.com/hbt-org/hearthstone-battlegrounds-tools/compare/v1.4.0...v1.4.1) (2021-01-16)

### Features

- **core:** 调整一次性同步的最大战绩数量 ([aa358db](https://github.com/hbt-org/hearthstone-battlegrounds-tools/commit/aa358db8be20cfb3a7224448d68d86e08a808fb3))

### Bug Fixes

- **main:** 修复 mac 下托盘图标错误以及托盘中无法退出的问题 ([0b6ca26](https://github.com/hbt-org/hearthstone-battlegrounds-tools/commit/0b6ca26287ff8ff4140e7bbda546138b14de4e3a))

## [1.4.0](https://github.com/hbt-org/hearthstone-battlegrounds-tools/compare/v1.3.4...v1.4.0) (2021-01-15)

### Features

- **core:** 实现将近 3 个月内的数据上传功能 ([abaf63f](https://github.com/hbt-org/hearthstone-battlegrounds-tools/commit/abaf63f3bf2a061944c18d3bf8b5eb200a99ee63))
- **core:** 战绩列表中显示每条战绩的同步状态 ([57a61ee](https://github.com/hbt-org/hearthstone-battlegrounds-tools/commit/57a61ee562a8562728fa2110111ce92b262e8d3b))
- **core:** 更新战绩备注时将战绩更新为未同步状态，并且限制战绩备注的最大长度 ([609e882](https://github.com/hbt-org/hearthstone-battlegrounds-tools/commit/609e882f52170c6629b5bb8020cffd3d42cd74fb))
- **core:** 登录失败后给予提示 ([77172ed](https://github.com/hbt-org/hearthstone-battlegrounds-tools/commit/77172ede625088a97a8dfb6caaf96737f3104ef6))
- **main:** 开始创建托盘 ([abd6743](https://github.com/hbt-org/hearthstone-battlegrounds-tools/commit/abd674329b5a7d34c2eeccb85090e576bd0a57ab))
- **main:** 托盘支持双击以及通过菜单呼出主界面 ([e37913c](https://github.com/hbt-org/hearthstone-battlegrounds-tools/commit/e37913c9779a7cc711c100ec560b3c2822118bb7))
- **suspension:** 支持战绩的上传与拉取 ([00f24d9](https://github.com/hbt-org/hearthstone-battlegrounds-tools/commit/00f24d9dead8b1264978c10c001bddbd9204abbe))
- 完成登录系统 ([6f92589](https://github.com/hbt-org/hearthstone-battlegrounds-tools/commit/6f92589f793f66a2fce91e375265a6e61d059f5d))

### Bug Fixes

- **suspension:** 修复待选英雄加载错误的问题 ([819c34f](https://github.com/hbt-org/hearthstone-battlegrounds-tools/commit/819c34f3699c23307f67e2914772497e7575609f))

### [1.3.4](https://github.com/hbt-org/hearthstone-battlegrounds-tools/compare/v1.3.3...v1.3.4) (2021-01-12)

### Features

- **main:** suspension 窗口移动或改变大小后进行缓存 下次从缓存读取相应数据 ([0376dd5](https://github.com/hbt-org/hearthstone-battlegrounds-tools/commit/0376dd5ce8a6f29fb916adffaa4cc764e2268186))
- **main:** 更换自动更新服务 ([e7f71d1](https://github.com/hbt-org/hearthstone-battlegrounds-tools/commit/e7f71d1dc78573e52fbb02cefea9be9ccbaa1bed))

### Bug Fixes

- 修复灵魂杂耍者计算战力时的死循环问题，偏折机器人的战力计算，补充随从库缺少的随从 ([b9eba70](https://github.com/hbt-org/hearthstone-battlegrounds-tools/commit/b9eba70bf63412f4a97e0c38fa711e3a790a8f6c))

### [1.3.3](https://github.com/hbt-org/hearthstone-battlegrounds-tools/compare/v1.3.2...v1.3.3) (2021-01-07)

### Features

- **core:** 完成阵容模拟功能 ([2192b12](https://github.com/hbt-org/hearthstone-battlegrounds-tools/commit/2192b121af1051cc6873fa1de5af89e8f3d05d29))
- **suspension:** 战力计算加入超时判定 以防止部分计算过度占用资源 ([81eb64b](https://github.com/hbt-org/hearthstone-battlegrounds-tools/commit/81eb64b0f341cca087907f7e57cfb6d3dcdf2854))
- **suspension:** 没有查询到可选英雄数据时给予提示 ([54b1b9d](https://github.com/hbt-org/hearthstone-battlegrounds-tools/commit/54b1b9dac24e72a5903faed36a0142d0135734d9))

### Bug Fixes

- **suspension:** 修复英雄组件样式问题 ([86b844b](https://github.com/hbt-org/hearthstone-battlegrounds-tools/commit/86b844b81a3a762e906bc7a8a80151f090b50c7c))

### [1.3.2](https://github.com/hbt-org/hearthstone-battlegrounds-tools/compare/v1.3.1...v1.3.2) (2021-01-03)

### Features

- **core:** 英雄数据支持根据分段设置 ([563ccb6](https://github.com/hbt-org/hearthstone-battlegrounds-tools/commit/563ccb6dd8ba6a1050b12a89ca57b178f59ff956))
- **core:** 设置页悬浮框显示状态切换组件更替为按钮 ([3289501](https://github.com/hbt-org/hearthstone-battlegrounds-tools/commit/328950185df9cc979f6b214e2233f66f9de7be27))
- **main:** suspension 支持拖动修改宽度 当然限制了最多可缩小的程度 ([b2ab07a](https://github.com/hbt-org/hearthstone-battlegrounds-tools/commit/b2ab07af064dbed4dacde7c94c918eec306b8423))
- **suspension:** 把 HeroCard 组件拆分，以防止英雄数据接口过多无用加载 ([0dedccf](https://github.com/hbt-org/hearthstone-battlegrounds-tools/commit/0dedccf72e83ab19ec7da455a4d5138a9f2c8726))
- **suspension:** 拔线后不记录的时间改为 10 秒 ([b98d369](https://github.com/hbt-org/hearthstone-battlegrounds-tools/commit/b98d3691fb3a0e726cc70b6c7d477e7192ca654f))

### Bug Fixes

- **core:** 修复设置完炉石安装目录后启动炉石的目录不更新的问题 ([6c21fae](https://github.com/hbt-org/hearthstone-battlegrounds-tools/commit/6c21fae54dcdef7ba40ca2188110d9d6490a2c18))
- **suspension:** 拔线后 3s 内不记录战绩 ([0650858](https://github.com/hbt-org/hearthstone-battlegrounds-tools/commit/06508588f17bc1e907b01ca761da51a3b7ed7d16))

### [1.3.1](https://github.com/hbt-org/hearthstone-battlegrounds-tools/compare/v1.3.0...v1.3.1) (2020-12-31)

### Features

- **suspension:** add @types/lodash ([e8e6a85](https://github.com/hbt-org/hearthstone-battlegrounds-tools/commit/e8e6a8593bb07e70d46d7f5d783968a026013b9f))

### Bug Fixes

- **suspension:** 修复阿兰娜变身时的一个报错 ([1268add](https://github.com/hbt-org/hearthstone-battlegrounds-tools/commit/1268add4565c18f42fc46d5275d334438d89b5d7))

## [1.3.0](https://github.com/hbt-org/hearthstone-battlegrounds-tools/compare/v1.2.7...v1.3.0) (2020-12-31)

### Features

- **core:** surprise! ([e468d73](https://github.com/hbt-org/hearthstone-battlegrounds-tools/commit/e468d73175843e4e918f12d1bde1f1fcf99bcfed))
- **core:** 全新的 UI 设计 ([d6ee2bf](https://github.com/hbt-org/hearthstone-battlegrounds-tools/commit/d6ee2bf164f644a08fcf2fad008212e0e1dc41cb))
- **core:** 启动炉石按钮更换图标 ([c1091f6](https://github.com/hbt-org/hearthstone-battlegrounds-tools/commit/c1091f6d9795caecf897e74e1987435e99e46ad4))
- **core:** 战绩页加入今日最佳 ([6ed9cc1](https://github.com/hbt-org/hearthstone-battlegrounds-tools/commit/6ed9cc1f8f5e7b19e121a5fdb867cf20a27f2cff))
- **core:** 拔线快捷键支持修改 ([19ca446](https://github.com/hbt-org/hearthstone-battlegrounds-tools/commit/19ca446eac94095d2e08f006fed3c0824971aba6))
- **core:** 设置页面支持设置提前展示游戏排名结果 ([6f0c8bb](https://github.com/hbt-org/hearthstone-battlegrounds-tools/commit/6f0c8bbfb04009af9256548292cd507aaf928b43))
- hero 与 minion 数据迁移回 json ([dc144ec](https://github.com/hbt-org/hearthstone-battlegrounds-tools/commit/dc144ec50855541a517b00fd7d234f34b4198409))
- 完成战力系统 ([16c91a5](https://github.com/hbt-org/hearthstone-battlegrounds-tools/commit/16c91a54e4d1b2b5512ce4e0fb658c99c01f6447))
- 设置 requestedExecutionLevel 程序自动提权 ([68680e7](https://github.com/hbt-org/hearthstone-battlegrounds-tools/commit/68680e741f2cef449f679e0d09d32840eafe1168))
- **suspension:** 开始准备阵容战力的计算 ([de15b8a](https://github.com/hbt-org/hearthstone-battlegrounds-tools/commit/de15b8a47ccd84ff36c6e7194a6f6df0635c2b12))
- **suspension:** 战力计算放入 Worker 中执行 ([e262e4f](https://github.com/hbt-org/hearthstone-battlegrounds-tools/commit/e262e4f3fe9a08e1c30d345958276c8334ffd6d1))

### Bug Fixes

- 修复金色随从判断错误以及随从身材属性变更后战力不更新的问题 ([bbd1522](https://github.com/hbt-org/hearthstone-battlegrounds-tools/commit/bbd1522f08caeca2ebc2836b888d1c1272a9b4e1))
- **main:** 修复自动更新不生效的问题 ([99d6834](https://github.com/hbt-org/hearthstone-battlegrounds-tools/commit/99d6834d97c0625539beb6d4750581e05a482ffe))
