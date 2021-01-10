# HBT 贡献指南

本项目基于 [electron-react-boilerplate](https://github.com/electron-react-boilerplate/electron-react-boilerplate) 做二次开发。

## 依赖安装

clone repo 后安装依赖

```bash
# npm is not allowed.
$ yarn
```

不支持使用 npm，请使用 [yarn](https://classic.yarnpkg.com/) 代替 npm 安装依赖。

> 注意，若安装过程中 electron 相关依赖下载速度过慢，可安装 [mirror-config-china](https://www.npmjs.com/package/mirror-config-china) 更替镜像配置。
>
> ```bash
> $ npm install -g mirror-config-china
> ```

## 构建

首次使用需要先执行构建命令

```bash
$ yarn build
```

## 调试

```bash
$ yarn start
```

## Git commit

请使用 [git cz](https://github.com/commitizen/cz-cli) 取代 `git commit` 以便获得更加清晰的 commit 信息。

## 打包

```bash
$ yarn package
```

## 升级依赖

```bash
$ yarn update:deps
```

## 目录结构说明

```
src
├─main
│  └─windows
├─renderer
│  ├─core
│  ├─logHandler
│  └─suspension
└─shared
    ├─assets
    ├─constants
    ├─store
    ├─types
    └─utils
```

1. **main** 存放 [electron 主进程相关内容](https://www.electronjs.org/docs/tutorial/quick-start#%E5%88%9B%E5%BB%BA%E4%B8%BB%E8%84%9A%E6%9C%AC%E6%96%87%E4%BB%B6)。

1. **renderer** 存放 electron 渲染进程相关内容。

   1. **core** 插件主体的内容
   1. **logHandler** 日志分析模块 专门负责日志的读取、分析、分发
   1. **suspension** 插件悬浮框内容

1. **shared** 存放 主进程与渲染进程共用的资源文件、配置、工具函数等。
