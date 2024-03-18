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