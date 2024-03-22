import { getGoodBaseStock, getGoodBuyPrice, getGoodName, getGoodSellInfos, getGoodSellPrice, goodsDict, stationGoodsListDict } from "@/config/goods";
import { modifiers } from "@/config/others";
import { filteredStationIds, getAttatchedToCity, getStationName } from "@/config/stations";

export const calculateProfit = (buy: number, sell: number, buy_tax: number, sell_tax: number, amount: number, bargainUp: number, bargainDown: number): number => {
  return sell * amount * bargainUp * (1 - sell_tax) - buy * amount * (1 + buy_tax) * bargainDown
};

export const calculateTax = (stationId: string, reputation: number): number => {
  const attachedCity = getAttatchedToCity(stationId);

  if (attachedCity == "83000020") {
    return (7.5 - Math.ceil(reputation * 0.5) * 0.5) * 0.01;
  } else {
    return (10 - Math.ceil(reputation * 0.5) * 0.5) * 0.01;
  }
}

export const calculateStockModify = (reputation: number): number => {
    return  reputation / 10
}

export const calculateStationSellBasicInfoDict = (
  buyDataDict: TransformedResponseData, 
  sellDataDict: TransformedResponseData, 
  UserInfo: UserInfo
): StationSellInfoDict => {
  const stationSellBasicInfoDict: StationSellInfoDict = {};

  filteredStationIds.forEach(buyStationId => {
    const buyStationReputation = UserInfo.reputations[getAttatchedToCity(buyStationId)];
    const buyStationTax = calculateTax(buyStationId, buyStationReputation);

    stationGoodsListDict[buyStationId].forEach(goodUniqueId => {
      const buyGood = buyDataDict[goodUniqueId]?.[buyStationId];
      if (buyGood) {
        const buyPriceTrend = buyGood.trend;
        const buyPrice = buyGood.price;
        const buyTime = new Date(buyGood.updated_at).getTime();

        getGoodSellInfos(goodUniqueId).forEach(([sellStationId]) => {
          const sellGood = sellDataDict[goodUniqueId]?.[sellStationId];
          if (sellGood) {
            const sellStationReputation = UserInfo.reputations[getAttatchedToCity(sellStationId)];
            const sellStationTax = calculateTax(sellStationId, sellStationReputation);
            const sellTime = new Date(sellGood.updated_at).getTime();

            const profitEntry = {
              goodId: goodUniqueId,
              
              targetStationId: sellStationId,
              buyStationId,

              buyPrice,
              sellPrice: sellGood.price,

              buyTax: buyStationTax,
              sellTax: sellStationTax,

              baseStock: getGoodBaseStock(goodUniqueId, buyStationId),
              stockModify: calculateStockModify(buyStationReputation),

              updatedAt: Math.min(sellTime, buyTime),

              buyPriceTrend,
              sellPriceTrend: sellGood.trend,

              goodName: getGoodName(goodUniqueId),
              buyStationName: getStationName(buyStationId),
              targetStationName: getStationName(sellStationId),
            };

            if (!stationSellBasicInfoDict[buyStationId]) {
              stationSellBasicInfoDict[buyStationId] = [];
            }
            stationSellBasicInfoDict[buyStationId].push(profitEntry);
          }
        });
      }
    });
  });

  return stationSellBasicInfoDict;
}; 

export const calculateStationModifiedSellInfoDict = (stationSellBasicInfoDict: StationSellInfoDict) => {
  const stationModifiedSellInfoDict: StationSellInfoDict = {};

  filteredStationIds.forEach(stationId => {
    stationModifiedSellInfoDict[stationId] = stationSellBasicInfoDict[stationId].map(sellInfo => {
      let modifiedSellInfo = {...sellInfo};
      modifiers.forEach(modifier => {
        modifier.modifier(modifiedSellInfo);
      });
      return modifiedSellInfo;
    });
  });

  return stationModifiedSellInfoDict;
}

export const calculateStationProfitTable = (stationModifiedSellInfo: StationSellInfoDict): StationProfitTable => {
  const stationProfitTable: StationProfitTable = {};

  filteredStationIds.forEach(stationId => {
    stationProfitTable[stationId] = stationModifiedSellInfo[stationId].map(sellInfo => {
      const { goodId, buyStationId, targetStationId, buyPrice, sellPrice, buyTax, sellTax, baseStock, stockModify } = sellInfo;
      const perProfit = Math.floor(calculateProfit(buyPrice, sellPrice, buyTax, sellTax, 1, 1.2, 0.8));
      const rawProfit = Math.floor(calculateProfit(buyPrice, sellPrice, buyTax, sellTax, 1, 1, 1));
      const stock = Math.floor(baseStock * (1 + stockModify));
      return {
        ...sellInfo,
        stock,

        perProfit,
        allProfit: perProfit * stock,
        rawProfit,
        rawAllProfit: rawProfit * stock,

        buyPercent: Math.floor(buyPrice / getGoodBuyPrice(goodId, buyStationId) * 100),
        sellPercent: Math.floor(sellPrice / getGoodSellPrice(goodId, targetStationId) * 100),
      };
    })
    stationProfitTable[stationId].sort((a, b) => b.perProfit - a.perProfit);
  });

  return stationProfitTable;
}

export const getStationProfitTable = (buyDataDict: TransformedResponseData, sellDataDict: TransformedResponseData, UserInfo: UserInfo) => {
  const stationSellBasicInfoDict = calculateStationSellBasicInfoDict(buyDataDict, sellDataDict, UserInfo);
  const modifiedSellBasicInfoDict = calculateStationModifiedSellInfoDict(stationSellBasicInfoDict);
  return calculateStationProfitTable(modifiedSellBasicInfoDict);
}