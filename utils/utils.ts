import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { getBuyDataArray, getSellDataArray } from "@/app/actions"

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

  for (const [stationID, goods] of Object.entries(filteredProfitTable)) {
    // 根据 targetStationId 分组商品，并计算每组的 allProfit 总和
    const profitByTargetStation: { [targetStationId: string]: { goods: ProfitTableCell[], totalProfit: number } } = {};
    goods.forEach(good => {
      if (!profitByTargetStation[good.targetStationId]) {
        profitByTargetStation[good.targetStationId] = { goods: [], totalProfit: 0 };
      }
      profitByTargetStation[good.targetStationId].goods.push(good);
      profitByTargetStation[good.targetStationId].totalProfit += good.allProfit;
    });

    // 找到 allProfit 总和最大的 targetStationId
    let bestTargetStationId = '';
    let maxTotalProfit = 0;
    for (const [targetStationId, data] of Object.entries(profitByTargetStation)) {
      if (data.totalProfit > maxTotalProfit) {
        bestTargetStationId = targetStationId;
        maxTotalProfit = data.totalProfit;
      }
    }

    // 将最佳 targetStationId 和相应的商品数据添加到 bestProfitTable
    if (bestTargetStationId) {
      bestProfitTable[stationID] = {
        targetStationId: bestTargetStationId,
        goods: profitByTargetStation[bestTargetStationId].goods,
        totalProfit: maxTotalProfit
      };
    }
  }

  return bestProfitTable
}