import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { calculateProfit } from "./calculate"
import { getBuyDataArray, getSellDataArray } from "@/app/actions"
import { filteredStationIds, getStationName } from "@/config/stations"
import { getGoodName, goodsDict, stationGoodsListDict } from "@/config/goods"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const dateTimeStringToHoursAgo = (dateTime: string) => {
  return linuxTimeToMinutesAgo(new Date(dateTime).getTime())
}

export function linuxTimeToMinutesAgo(time: number) {
  // TODO: 有时不准
  const now = new Date();
  const difference = now.getTime() - time;

  const hoursAgo = Math.floor(difference / (1000 * 60 * 60));
  const minutesAgo = Math.floor(difference / (1000 * 60));

  if (hoursAgo < 1) {
    return `${minutesAgo}分钟前`;
  } else {
    return `${hoursAgo}小时前`;
  }
}

export function transformResponseDataArrayToDict(responseDataArray: DataResponse[]): TransformedResponseData {
  return responseDataArray.reduce((acc: TransformedResponseData, current) => {
    const { good_id, station_id } = current;
    if (!acc[good_id]) {
      acc[good_id] = {};
    }
    acc[good_id][station_id] = current;
    return acc;
  }, {});
}

export const trendArrow = (trend: number) => {
  if (trend > 0) {
    return "↑"
  } else if (trend < 0) {
    return "↓"
  } else {
    return "-"
  }
}

export const getTransformedDataDict = async () => {
  return [transformResponseDataArrayToDict(await getSellDataArray()), transformResponseDataArrayToDict(await getBuyDataArray())]
}

export const calculateStationProfitTable = (buyDataDict: TransformedResponseData, sellDataDict: TransformedResponseData, UserInfo: UserInfo): StationProfitTable => {
  const stationProfitTable: StationProfitTable = {};

  filteredStationIds.map((buyStationId): void => {
    stationProfitTable[buyStationId] = [];

    stationGoodsListDict[buyStationId].map((goodUniqueId) => {
      if (buyDataDict[goodUniqueId]) {
        const buyGood = buyDataDict[goodUniqueId][buyStationId]
        Object.entries(goodsDict[goodUniqueId].stations).map(([sellStationId, { buy, sell }]) => {
          if (sell) {
            const sellGood = sellDataDict[goodUniqueId][sellStationId]
            if (sellGood) {
              const sellTime = new Date(sellGood.updated_at);
              const buyTime = new Date(buyGood.updated_at);
              const perProfit = Math.floor(calculateProfit(buyGood.price, sellGood.price, 0.1, 0.1, 1));

              if (stationProfitTable[buyStationId] === undefined) {
                stationProfitTable[buyStationId] = [];
              }

              const cell = {
                goodId: goodUniqueId,
                goodName: getGoodName(goodUniqueId),
                targetStationId: sellStationId,
                targetStationName: getStationName(sellStationId),
                buyPrice: buyGood.price,
                buyPercent: Math.floor(buyGood.price / goodsDict[goodUniqueId].stations[buyStationId].buy!.basePrice * 100),
                buyPriceTrend: buyGood.trend,
                sellPrice: sellGood.price,
                sellPercent: Math.floor(sellGood.price / goodsDict[goodUniqueId].stations[sellStationId].sell!.basePrice * 100),
                sellPriceTrend: sellGood.trend,
                perProfit,
                allProfit: perProfit * goodsDict[goodUniqueId].stations[buyStationId].buy!.baseStock,
                updatedAt: Math.min(sellTime.getTime(), buyTime.getTime())
              }

              stationProfitTable[buyStationId].push(cell);
            }
          }
        });
      }
    });

    stationProfitTable[buyStationId].sort((a, b) => b.perProfit - a.perProfit);
  });

  return stationProfitTable;
};