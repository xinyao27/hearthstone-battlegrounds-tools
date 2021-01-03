# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

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
