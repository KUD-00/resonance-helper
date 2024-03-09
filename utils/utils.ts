import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

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
    return '不到1小时前';
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