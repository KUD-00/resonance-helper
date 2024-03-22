import { filteredStationsDict } from "./stations";

export const defaultReputation = Object.fromEntries(
  Object.entries(filteredStationsDict).map(([stationId]) => [stationId, 10])
);

export const defaultUser: UserInfo = {
  user_id: 0,
  role_name: "guest",
  level: 35,
  trade_level: 50,
  reputations: defaultReputation
}

export const modifiers = [
  {
    modifier: (sellInfo: SellInfo) => {
      if (sellInfo.goodId == "82900046") {
        sellInfo.stockModify = sellInfo.stockModify + 0.3;
        sellInfo.sellTax = (sellInfo.sellTax - 0.05 > 0) ? sellInfo.sellTax - 0.05 : 0;
        sellInfo.buyTax = (sellInfo.buyTax - 0.05 > 0) ? sellInfo.buyTax - 0.05 : 0;
      }
    },
    messageTitle: "红茶战争",
    messageContent: "现阶段红茶库存增加30%，红茶税率-5%"
  }
]