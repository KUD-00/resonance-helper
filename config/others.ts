import { filteredStationsDict } from "./stations";

export const defaultReputation = Object.fromEntries(
  Object.entries(filteredStationsDict).map(([stationId]) => [stationId, 10])
);

export const defaultUser: UserInfo = {
  user_id: 0,
  role_name: "guest",
  level: 35,
  trade_level: 50,
  reputations: defaultReputation,
  default_book: 5,
  default_per_stock_profit: 600,
  default_stock: 500
}

export const modifiers = [
  {
    modifier: (sellInfo: SellInfo) => {
      if (sellInfo.goodId == "82900046") {
        return {
          ...sellInfo,
          sellTax: (sellInfo.sellTax - 0.05 > 0) ? sellInfo.sellTax - 0.05 : 0,
          buyTax: (sellInfo.buyTax - 0.05 > 0) ? sellInfo.buyTax - 0.05 : 0,
          stockModify: sellInfo.stockModify + 0.5
        }
      }
    },
    messageTitle: "红茶战争",
    messageContent: "现阶段红茶库存增加50%，红茶税率-5%"
  }
]