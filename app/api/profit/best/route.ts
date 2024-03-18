import { getBuyAndSellDataArray } from "@/app/actions";
import { defaultUser } from "@/config/others";
import { calculateStationProfitTable } from "@/utils/calculate";
import { calculateBestProfitTable, filterStationProfitTableByPerProfit, transformResponseDataArrayToDict } from "@/utils/utils";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const stationId = url.searchParams.get("stationId");

  const [buyDataArray, sellDataArray] = await getBuyAndSellDataArray();

  const sellDataDict = transformResponseDataArrayToDict(sellDataArray);

  const stationProfitTable: StationProfitTable = calculateStationProfitTable(transformResponseDataArrayToDict(buyDataArray), sellDataDict, defaultUser);

  const bestProfitTable = calculateBestProfitTable(filterStationProfitTableByPerProfit(stationProfitTable, 500));

  if (stationId && bestProfitTable[stationId]) {
    return new Response(JSON.stringify(bestProfitTable[stationId]), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return Response.json(bestProfitTable)
}