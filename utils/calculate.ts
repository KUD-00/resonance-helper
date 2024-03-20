import { getGoodBuyPrice, getGoodName, getGoodSellInfos, getGoodSellPrice, goodsDict, stationGoodsListDict } from "@/config/goods";
import { filteredStationIds, getAttatchedToCity, getStationName } from "@/config/stations";

export const calculateProfit = (buy: number, sell: number, buy_tax: number, sell_tax: number, amount: number, bargainUp: number, bargainDown: number): number => {
  return sell * amount * bargainUp * (1 - sell_tax) - buy * amount * (1 + buy_tax) * bargainDown
};

export const calculateStationProfitTable = (buyDataDict: TransformedResponseData, sellDataDict: TransformedResponseData, UserInfo: UserInfo): StationProfitTable => {
  const stationProfitTable: StationProfitTable = {};

  filteredStationIds.map((buyStationId): void => {
    stationProfitTable[buyStationId] = [];

    stationGoodsListDict[buyStationId].map((goodUniqueId) => {
      if (buyDataDict[goodUniqueId]) {
        const buyGood = buyDataDict[goodUniqueId][buyStationId]

        getGoodSellInfos(goodUniqueId).map(([sellStationId]) => {
          const sellGood = sellDataDict[goodUniqueId][sellStationId]

          const buyStationReputation = UserInfo.reputations[getAttatchedToCity(buyStationId)]
          const sellStationReputation = UserInfo.reputations[getAttatchedToCity(sellStationId)]

          if (sellGood) {
            const sellTime = new Date(sellGood.updated_at);
            const buyTime = new Date(buyGood.updated_at);

            const sellStationTax = calculateTax(sellStationId, sellStationReputation);
            const buyStationTax = calculateTax(buyStationId, buyStationReputation);

            const perProfit = Math.floor(calculateProfit(buyGood.price, sellGood.price, buyStationTax, sellStationTax, 1, 1.2, 0.8));
            const rawProfit = Math.floor(calculateProfit(buyGood.price, sellGood.price, buyStationTax, sellStationTax, 1, 1, 1))

            if (stationProfitTable[buyStationId] === undefined) {
              stationProfitTable[buyStationId] = [];
            }

            stationProfitTable[buyStationId].push({
              goodId: goodUniqueId,
              targetStationId: sellStationId,
              buyStationId,

              buyPrice: buyGood.price,
              sellPrice: sellGood.price,

              perProfit,
              allProfit: perProfit * calculateStock(goodUniqueId, buyStationId, buyStationReputation),

              rawProfit,
              rawAllProfit: rawProfit * calculateStock(goodUniqueId, buyStationId, buyStationReputation),

              updatedAt: Math.min(sellTime.getTime(), buyTime.getTime()),

              buyPercent: Math.floor(buyGood.price / getGoodBuyPrice(goodUniqueId, buyStationId) * 100),
              sellPercent: Math.floor(sellGood.price / getGoodSellPrice(goodUniqueId, sellStationId) * 100),

              buyPriceTrend: buyGood.trend,
              sellPriceTrend: sellGood.trend,

              buyStationName: getStationName(buyStationId),
              goodName: getGoodName(goodUniqueId),
              targetStationName: getStationName(sellStationId),
            })
          }
        });
      }
    });

    stationProfitTable[buyStationId].sort((a, b) => b.perProfit - a.perProfit);
  });

  return stationProfitTable;
};

export const calculateTax = (stationId: string, reputation: number): number => {
  const attachedCity = getAttatchedToCity(stationId);

  if (attachedCity == "83000020") {
    return (7.5 - Math.ceil(reputation * 0.5) * 0.5) * 0.01;
  } else {
    return (10 - Math.ceil(reputation * 0.5) * 0.5) * 0.01;
  }
}

export const calculateStock = (goodId: string, stationId: string, reputation: number): number => {
  const buyInfo = goodsDict[goodId].stations[stationId].buy;
  if (buyInfo) {
    return Math.floor(buyInfo.baseStock * (1+ reputation / 10));
  } else {
    return 0;
  }
}