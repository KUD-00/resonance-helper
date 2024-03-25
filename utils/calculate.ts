import { getGoodBaseStock, getGoodBuyPrice, getGoodName, getGoodSellInfos, getGoodSellPrice, goodsDict, stationGoodsListDict } from "@/config/goods";
import { stationStaminMap } from "@/config/lines";
import { modifiers } from "@/config/others";
import { filteredStationIds, getAttatchedToCity, getStationName } from "@/config/stations";

export const calculateProfit = (buy: number, sell: number, buy_tax: number, sell_tax: number, amount: number, bargainUp: number, bargainDown: number): number => {
  const sells = sell * amount * bargainUp
  const buys = buy * amount * bargainDown
  const buyTax = buy * amount * buy_tax
  const sellTax = (sells - buyTax) * sell_tax
  return sells - buys - buyTax - sellTax
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

function calculateProfitEntry(buyGood: DataResponse, sellGood: DataResponse, goodUniqueId: string, buyStationId: string, sellStationId: string, buyStationTax: number, sellStationTax: number, UserInfo: UserInfo) {
  const buyPriceTrend = buyGood.trend;
  const buyPrice = buyGood.price;
  const buyTime = new Date(buyGood.updated_at).getTime();

  const buyStationReputation = UserInfo.reputations[getAttatchedToCity(buyStationId)];
  const sellTime = new Date(sellGood.updated_at).getTime();

  return {
    goodId: goodUniqueId,
    
    targetStationId: sellStationId,
    buyStationId,

    buyPrice,
    sellPrice: sellGood.price,

    stationStamin: stationStaminMap[buyStationId][sellStationId],

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
      if (!buyGood) return;

      getGoodSellInfos(goodUniqueId).forEach(([sellStationId]) => {
        const sellGood = sellDataDict[goodUniqueId]?.[sellStationId];
        const sellStationReputation = UserInfo.reputations[getAttatchedToCity(sellStationId)];
        const sellStationTax = calculateTax(sellStationId, sellStationReputation);
        if (!sellGood) return;

        const profitEntry = calculateProfitEntry(
          buyGood, sellGood, goodUniqueId, buyStationId, sellStationId,
          buyStationTax, sellStationTax, UserInfo
        );

        stationSellBasicInfoDict[buyStationId] = stationSellBasicInfoDict[buyStationId] || [];
        stationSellBasicInfoDict[buyStationId].push(profitEntry);
      });
    })});

  return stationSellBasicInfoDict;
}; 

export const calculateStationModifiedSellInfoDict = (stationSellBasicInfoDict: StationSellInfoDict) => {
  const stationModifiedSellInfoDict: StationSellInfoDict = {};

  filteredStationIds.forEach(stationId => {
    const sellInfos = stationSellBasicInfoDict[stationId];
    if (!sellInfos) return; 
    stationModifiedSellInfoDict[stationId] = sellInfos.map(sellInfo => {
      return modifiers.reduce((modifiedSellInfo, {modifier}) => {
        const result = modifier(modifiedSellInfo);
        return result ? result : modifiedSellInfo;
      }, sellInfo);
    });
  });

  return stationModifiedSellInfoDict;
}

function calculateProfitAndPercentages(sellInfo: SellInfo) {
  const { goodId, buyStationId, targetStationId, buyPrice, sellPrice, buyTax, sellTax, baseStock, stockModify } = sellInfo;
  const perProfit = Math.floor(calculateProfit(buyPrice, sellPrice, buyTax, sellTax, 1, 1.2, 0.8));
  const rawProfit = Math.floor(calculateProfit(buyPrice, sellPrice, buyTax, sellTax, 1, 1, 1));
  const stock = Math.round(baseStock * (1 + stockModify));

  return {
    stock,
    perProfit,
    allProfit: perProfit * stock,
    rawProfit,
    rawAllProfit: rawProfit * stock,
    buyPercent: Math.floor(buyPrice / getGoodBuyPrice(goodId, buyStationId) * 100),
    sellPercent: Math.floor(sellPrice / getGoodSellPrice(goodId, targetStationId) * 100),
  };
}

export const calculateStationProfitTable = (stationModifiedSellInfo: StationSellInfoDict): StationProfitTable => {
  const stationProfitTable: StationProfitTable = {};

  for (const stationId of filteredStationIds) {
    const sellInfos = stationModifiedSellInfo[stationId];
    if (!sellInfos) continue;

    stationProfitTable[stationId] = sellInfos.map(sellInfo => {
      const profitAndPercentages = calculateProfitAndPercentages(sellInfo);
      return { ...sellInfo, ...profitAndPercentages };
    });

    stationProfitTable[stationId].sort((a, b) => b.perProfit - a.perProfit);
  }

  return stationProfitTable;
};

export const getStationProfitTable = (buyDataDict: TransformedResponseData, sellDataDict: TransformedResponseData, userInfo: UserInfo) => {
  const stationSellBasicInfoDict = calculateStationSellBasicInfoDict(buyDataDict, sellDataDict, userInfo);
  const modifiedSellBasicInfoDict = calculateStationModifiedSellInfoDict(stationSellBasicInfoDict);
  const stationProfitTable = calculateStationProfitTable(modifiedSellBasicInfoDict);
  const stationTargetProfitTable = getStationTargetProfitTable(stationProfitTable);
  return optimizeProfitTables(getProfitTables(stationTargetProfitTable, userInfo));
}

export const getStationTargetProfitTable = (stationProfitTable: StationProfitTable) => {
  const dict: Record<string, Record<string, ProfitTableCell[]>> = {};
  Object.entries(stationProfitTable).forEach(([stationId, goods]) => {
    goods.forEach((good) => {
      const stationDict = dict[stationId] || (dict[stationId] = {});
      const targetGoods = stationDict[good.targetStationId] || (stationDict[good.targetStationId] = []);
      targetGoods.push(good);
    });
  })
  return dict;
}

export const getProfitTables = (stationTargetProfitTable: Record<string, Record<string, ProfitTableCell[]>>, userInfo: UserInfo): Record<string, ProfitTable[]> => {
  const result: Record<string, ProfitTable[]> = {};

  Object.entries(stationTargetProfitTable).forEach(([stationId, targetStations]) => {
    result[stationId] = [];
    Object.entries(targetStations).forEach(([targetStationId, goods]) => {
      for (let i = 1; i <= goods.length; i++) {
        const combination = goods.slice(0, i);
        const totalProfit = combination.reduce((acc, curr) => acc + curr.allProfit, 0);
        const sumStock = combination.reduce((acc, curr) => acc + curr.stock, 0);
        const book = Math.floor(userInfo.default_stock / sumStock - 1);
        result[stationId].push({
          startStationId: stationId,
          targetStationId,
          goods: combination,
          totalProfit,
          sumStock,
          book,
          profitPerStock: Math.floor(totalProfit * (book+1) / sumStock),
          profitPerStamin: Math.floor(totalProfit * (book+1) / (stationStaminMap[stationId][targetStationId] + 60)),
        });
      }
    });
  })
  return result;
};

export const optimizeProfitTables = (profitTables: OptimizedProfitTable): OptimizedProfitTable => {
  // 创建 profitTables 的深拷贝
  const profitTablesCopy: OptimizedProfitTable = JSON.parse(JSON.stringify(profitTables));

  Object.keys(profitTablesCopy).forEach(stationId => {
    const profitTableArray = profitTablesCopy[stationId];
    const goodsCountMap = new Map<number, ProfitTable>();

    profitTableArray.forEach(profitTable => {
      const goodsCount = profitTable.goods.length;
      const sumStock = profitTable.goods.reduce((acc, cur) => acc + cur.stock, 0);
      const ratio = profitTable.totalProfit / sumStock;

      const existingEntry = goodsCountMap.get(goodsCount);
      if (!existingEntry || ratio > (existingEntry.totalProfit / existingEntry.goods.reduce((acc, cur) => acc + cur.stock, 0))) {
        goodsCountMap.set(goodsCount, profitTable);
      }
    });

    profitTablesCopy[stationId] = Array.from(goodsCountMap.values());
  });

  return profitTablesCopy;
};