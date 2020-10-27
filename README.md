<h1 align="center">
  炉石传说酒馆战棋战绩统计
</h1>

统计每天的战棋战绩，并通过数据分析得到你最拿手的英雄！

<p align="center">
  <img width="300" src="https://raw.githubusercontent.com/chenyueban/obs-hearthstone/main/docs/preview1.png" alt="preview1">
  <img width="300" src="https://raw.githubusercontent.com/chenyueban/obs-hearthstone/main/docs/preview2.png" alt="preview2">
</p>

## 🚀 特性

- 🌴 当天战绩统计
- 📦 历史战绩查询
- 🎉 数据分析，统计你所使用过的英雄，自动计算每个英雄的平均排名、选择率
- 🚄 连接 OBS 自动同步当天战绩到 OBS 文本资源

## 🐠 使用

1. 打开工具 [地址](https://chenyueban.github.io/obs-hearthstone/) 
1. 在 **今日战绩** 标签下选择当场战绩的英雄、输入排名，后点击蓝色发送按钮记录战绩

## 🙀 OBS 连接

目前可实现当天统计的战绩同步到 OBS 中 (作为文本展示)，效果如下图

![obs](./docs/obs.png)

连接到 OBS 教程：

1. 安装 OBS 插件 [obs-websocket](https://github.com/Palakis/obs-websocket/releases)
1. 打开 OBS 选择菜单栏 工具 - Websockets Server Settings (如果没有这个选项需要确认上面的插件是否安装，并且安装完后是否重启OBS)
1. 设置服务器端口以及身份验证等 (可不修改直接确定，但是考虑到安全推荐设置密码)
1. 打开工具 点击右上角 **连接OBS** 按钮并输入验证信息 (若上一步没有修改信息这里直接点连接就好)
1. 连接成功后 右上角会出现 **选择文本来源(GDI+)** 以及相应的选择框，选择框选择你在OBS内设置好的文本来源 (例如上方效果图选择了 名为test的文本来源，选择框这里就选择 test)
1. 现在你每新增一条战绩，OBS 内便会同步一条战绩

> 注意：OBS 文本来源必须选择类型为 **文本（GDI+）** 若没有这个选项需要更新 [OBS](https://obsproject.com/)

## 👍 作者

如果你有什么问题，或者有什么好的想法，请联系我 (记得备注酒馆战旗或者注明来意)

![wechat](./docs/wechat.jpg)

## LICENSE

[MIT](./LICENSE)
