import { getGoodBuyPrice, getGoodBuyStock, getGoodName, getGoodSellInfos, getGoodSellPrice, goodsDict, stationGoodsListDict } from "@/config/goods";
import { filteredStationIds, getStationName } from "@/config/stations";

export const calculateProfit = (buy: number, sell: number, buy_tax: number, sell_tax: number, amount: number): number => {
  return sell * amount * 1.2 * (1 - sell_tax) - buy * amount * (1 + buy_tax) * 0.8
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

          if (sellGood) {
            const sellTime = new Date(sellGood.updated_at);
            const buyTime = new Date(buyGood.updated_at);
            const perProfit = Math.floor(calculateProfit(buyGood.price, sellGood.price, 0.1, 0.1, 1));

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
              allProfit: perProfit * getGoodBuyStock(goodUniqueId, buyStationId),

              rawProfit: sellGood.price - buyGood.price,
              rawAllProfit: (sellGood.price - buyGood.price) * getGoodBuyStock(goodUniqueId, buyStationId),

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