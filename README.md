# 雷索纳斯数据站
列车长，欢迎您！本网站旨在为列车长提供实时的的商品价格数据及成本计算

联系我：qq2570351247

### 数据方面
需完善
- 阿妮塔武器工厂缺少40级账号持续更新

### API
/api/buy
/api/sell
支持stationId, goodId, stationName, goodName的筛选
内容为当前所有买卖信息

/api/profit
/api/profit/best
支持stationId的筛选
/api/profit/best还支持一个baseProfit参数
内容难以用三言两语描述

## 关于开源
本项目除了咸鱼买的账号密码不能公开外，其他都根据gplv3许可证协议公开，如果我没记错的话，这是一个传染性的许可证，还请任何想用本仓库任意代码的开发者注意这一点

## 写在最后
参考仓库
- puresox/resonance-capture
- NaNExist/ResonanceAssistant<
- milkory/rsns-data

![活力四射](public/zero-fatigue.PNG)

## TODOs:
- [ ]: 重构代码，interface定义的清晰一点
- [ ]: 做可能的错误检查（比如更新数据库时）
- [ ]: discord机器人开发（交给别人了）
- [ ]: 用户界面开发
- [ ]: 现在全用的dynamic rendering，感觉不太好