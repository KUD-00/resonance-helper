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

export const getStationTargetProfitTable = (stationProfitTable: StationProfitTable) => {
  const dict: Record<string, Record<string, ProfitTableCell[]>> = {};
  Object.entries(stationProfitTable).forEach(([stationId, goods]) => {
    goods.forEach((good) => {
      if (!dict[stationId]) dict[stationId] = {};
      if (!dict[stationId][good.targetStationId]) dict[stationId][good.targetStationId] = []; // 确保这是一个数组
      dict[stationId][good.targetStationId].push(good);
    });
  })
  return dict;
}

export const getProfitTables = (stationTargetProfitTable: Record<string, Record<string, ProfitTableCell[]>>): Record<string, ProfitTable[]> => {
  const result: Record<string, ProfitTable[]> = {};

  Object.entries(stationTargetProfitTable).forEach(([stationId, targetStations]) => {
    result[stationId] = [];
    Object.entries(targetStations).forEach(([targetStationId, goods]) => {
      for (let i = 1; i <= goods.length; i++) {
        const combination = goods.slice(0, i);
        const totalProfit = combination.reduce((acc, curr) => acc + curr.allProfit, 0);
        const sumStock = combination.reduce((acc, curr) => acc + curr.stock, 0);
        result[stationId].push({
          targetStationId: targetStationId,
          goods: combination,
          totalProfit: totalProfit,
          sumStock: sumStock
        });
      }
    });
  });

  return result;
};

export const sortProfitTables = (profitTables: Record<string, ProfitTable[]>) => {
  Object.keys(profitTables).forEach(stationId => {
    profitTables[stationId].sort((a, b) => {
      // 首先按商品数量排序，商品数量多的排在后面
      if (a.goods.length !== b.goods.length) {
        return a.goods.length - b.goods.length;
      }
      // 如果商品数量相同，则按总利润降序排序，利润高的排在前面
      return b.totalProfit - a.totalProfit;
    });
  });
}

export const optimizeProfitTables = (profitTables: OptimizedProfitTable): OptimizedProfitTable => {
  Object.keys(profitTables).forEach(stationId => {
    const profitTableArray = profitTables[stationId];
    const optimizedArray: ProfitTable[] = [];

    // 计算每个商品数量对应的最优ProfitTable
    const goodsCountMap = new Map<number, ProfitTable>();

    profitTableArray.forEach(profitTable => {
      const goodsCount = profitTable.goods.length;
      const sumStock = profitTable.goods.reduce((acc, cur) => acc + cur.stock, 0);
      const ratio = profitTable.totalProfit / sumStock;

      // 如果当前商品数量还未记录，或者当前条目的比值更大，则更新Map
      const existingEntry = goodsCountMap.get(goodsCount);
      if (!existingEntry || (existingEntry && ratio > (existingEntry.totalProfit / existingEntry.goods.reduce((acc, cur) => acc + cur.stock, 0)))) {
        goodsCountMap.set(goodsCount, profitTable);
      }
    });

    // 从Map中提取最优的ProfitTable
    goodsCountMap.forEach((value) => {
      optimizedArray.push(value);
    });

    profitTables[stationId] = optimizedArray;
  });

  return profitTables;
};