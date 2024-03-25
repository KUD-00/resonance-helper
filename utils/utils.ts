import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { getBuyDataArray, getSellDataArray } from "@/app/actions"
import { getStationName } from "@/config/stations";

const MILLISECONDS_PER_MINUTE = 1000 * 60;
const MILLISECONDS_PER_HOUR = MILLISECONDS_PER_MINUTE * 60;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const linuxTimeToMinutesAgo = (time: number) => {
  const now = new Date().getTime();
  const difference = now - time;

  const minutesAgo = Math.floor(difference / MILLISECONDS_PER_MINUTE);

  if (minutesAgo < 60) {
    return `${minutesAgo}分钟前`;
  } else {
    const hoursAgo = Math.floor(difference / MILLISECONDS_PER_HOUR);
    return `${hoursAgo}小时前`;
  }
};

export const isOutdated = (time: number, limitMinute: number) => {
  const now = new Date().getTime();
  const difference = now - time;
  const minutesAgo = Math.floor(difference / MILLISECONDS_PER_MINUTE);

  if (minutesAgo < limitMinute) {
    return false;
  }

  return true;
}

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

export const generateMermaidChartDefinition = (data: OptimizedProfitTable): string => {
  let chartDefinition = 'graph LR;\n';

  for (const [stationId, routes] of Object.entries(data)) {
    if (routes.length > 0) {
      const firstRoute = routes[0];
      const sourceStationName = getStationName(stationId);
      const targetStationName = getStationName(firstRoute.targetStationId);

      chartDefinition += `${sourceStationName} -->| ${firstRoute.profitPerStock} / ${firstRoute.profitPerStamin}| ${targetStationName};\n`;
    }
  }

  return chartDefinition;
}