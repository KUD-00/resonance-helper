import { getSellCorresponds } from "@/config/old-goods"
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { calculateProfit } from "./calculate"
import { filterdStationIds, getStationGoods, getStock } from "@/config/old-stations"
import { getBuyDataArray, getSellDataArray } from "@/app/actions"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const dateTimeStringToHoursAgo = (dateTime: string) => {
  return linuxTimeToHoursAgo(new Date(dateTime).getTime())
}

export function linuxTimeToHoursAgo(time: number) {
  const now = new Date();
  const difference = now.getTime() - time;

  const hoursAgo = Math.floor(difference / (1000 * 60 * 60));

  if (hoursAgo < 1) {
    return '<1小时';
  } else {
    return `${hoursAgo}小时前`;
  }
}

export function transformSellDataArrayToDict(sellDataArray: SellDataResponse[]): TransformedSellDataDict {
  return sellDataArray.reduce((acc: TransformedSellDataDict, current) => {
    const { good_id } = current;
    acc[good_id] = current;
    return acc;
  }, {});
}

export const getTransformedSellDataDict = async (): Promise<TransformedSellDataDict> => {
  return transformSellDataArrayToDict(await getSellDataArray());
}

export function transformBuyDataArrayToDict(buyDataArray: SellDataResponse[]): TransformedBuyData {
  return buyDataArray.reduce((acc: TransformedBuyData, current) => {
    const { good_id, station_id } = current;
    if (!acc[good_id]) {
      acc[good_id] = {};
    }
    acc[good_id][station_id] = current;
    return acc;
  }, {});
}

export const getTransformedBuyDataDict = async (): Promise<TransformedBuyData> => {
  return transformBuyDataArrayToDict(await getBuyDataArray());
}

export const calculateStationProfitTable = (buyDataDict: TransformedBuyData, sellDataDict: TransformedSellDataDict, UserInfo: UserInfo): StationProfitTable => {
  const stationProfitTable: StationProfitTable = {};

  filterdStationIds.map((station_id) => {
    stationProfitTable[station_id] = [];

    getStationGoods(station_id).map(([good_id, stock]) => {
      const sellCorresponds = getSellCorresponds(good_id);
      sellCorresponds.map(({ good_id: sell_good_id, station_id: sell_station_id }) => {
        if (sell_good_id != "") { // 存在没有写sell correspond对应的商品
          const sellGood = sellDataDict[sell_good_id]; // 商品在目标站点的售卖信息
          if (sellGood == undefined) return; // 存在未定义的商品
          const buyGood = buyDataDict[good_id][station_id] // 商品在当前站点的购买信息
          const sellTime = new Date(sellGood.updated_at);
          const buyTime = new Date(buyGood.updated_at);
          const per_profit = Math.floor(calculateProfit(buyGood.price, sellGood.price, 0.1, 0.1, 1));

          stationProfitTable[station_id].push({
            good_id,
            target_station_id: sell_station_id,
            buy_price: buyGood.price,
            sell_price: sellGood.price,
            per_profit,
            all_profit: per_profit * stock,
            updated_at: Math.min(sellTime.getTime(), buyTime.getTime())
          });
        }
      });
    });

    stationProfitTable[station_id].sort((a, b) => b.per_profit - a.per_profit);
  });

  return stationProfitTable;
};