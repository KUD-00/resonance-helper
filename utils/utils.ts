import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { getBuyDataArray, getSellDataArray } from "@/app/actions"

const MILLISECONDS_PER_MINUTE = 1000 * 60;
const MILLISECONDS_PER_HOUR = MILLISECONDS_PER_MINUTE * 60;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const linuxTimeToMinutesAgo = (time: number) => {
  const now = new Date().getTime();
  const difference = now - time; // 时间差，单位毫秒

  const minutesAgo = Math.floor(difference / MILLISECONDS_PER_MINUTE);

  if (minutesAgo < 60) {
    return `${minutesAgo}分钟前`;
  } else {
    const hoursAgo = Math.floor(difference / MILLISECONDS_PER_HOUR);
    return `${hoursAgo}小时前`;
  }
};

export const transformResponseArrayToDict = (responseDataArray: DataResponse[]): TransformedResponseData => {
  return responseDataArray.reduce((acc: TransformedResponseData, current) => {
    const { good_id, station_id } = current;
    if (!acc[good_id]) {
      acc[good_id] = {};
    }
    acc[good_id][station_id] = current;
    return acc;
  }, {});
}

export const getBuyAndSellDict = async () => {
  return [transformResponseArrayToDict(await getBuyDataArray()), transformResponseArrayToDict(await getSellDataArray())]
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
  return [transformResponseArrayToDict(await getSellDataArray()), transformResponseArrayToDict(await getBuyDataArray())]
}

export const filterStationProfitTableByPerProfit = (profitTable: StationProfitTable, baseProfit: number) => {
  return Object.entries(profitTable).reduce((acc, [stationID, goods]) => {
    const filteredGoods = goods.filter(good => good.perProfit >= baseProfit);
    if (filteredGoods.length > 0) {
      acc[stationID] = filteredGoods;
    }
    return acc;
  }, {} as StationProfitTable);
}

export const calculateBestProfitTable = (filteredProfitTable: StationProfitTable) => {
  const bestProfitTable: { [stationID: string]: { targetStationId: string, goods: ProfitTableCell[], totalProfit: number } } = {};

  Object.entries(filteredProfitTable).forEach(([stationID, goods]) => {
    const profitByTargetStation: ProfitByTargetStation = {};
    let bestTargetStationId: string = '';
    let maxTotalProfit: number = 0;

    goods.forEach(good => {
      const { targetStationId, allProfit } = good;
      if (!profitByTargetStation[targetStationId]) {
        profitByTargetStation[targetStationId] = { goods: [], totalProfit: 0 };
      }
      const targetStation = profitByTargetStation[targetStationId];
      targetStation.goods.push(good);
      targetStation.totalProfit += allProfit;

      // 直接更新最大利润和最佳targetStationId
      if (targetStation.totalProfit > maxTotalProfit) {
        bestTargetStationId = targetStationId;
        maxTotalProfit = targetStation.totalProfit;
      }
    });

    if (bestTargetStationId) {
      bestProfitTable[stationID] = {
        targetStationId: bestTargetStationId,
        goods: profitByTargetStation[bestTargetStationId].goods,
        totalProfit: maxTotalProfit,
      };
    }
  });

  return bestProfitTable
}