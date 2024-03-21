import { getBuyAndSellDataArray } from "@/app/actions";
import { defaultUser } from "@/config/others";
import { calculateStationProfitTable } from "@/utils/calculate";
import { calculateBestProfitTable, filterStationProfitTableByPerProfit, transformResponseArrayToDict } from "@/utils/utils";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const stationId = url.searchParams.get("stationId");
  const baseProfit = url.searchParams.get("baseProfit");

  const [buyDataArray, sellDataArray] = await getBuyAndSellDataArray();

  const sellDataDict = transformResponseArrayToDict(sellDataArray);

  const stationProfitTable: StationProfitTable = calculateStationProfitTable(transformResponseArrayToDict(buyDataArray), sellDataDict, defaultUser);

  if (baseProfit === null) {
    return Response.json("baseProfit is required")
  } else {
    const bestProfitTable = calculateBestProfitTable(filterStationProfitTableByPerProfit(stationProfitTable, Number(baseProfit))); // Convert baseProfit to a number

    if (stationId && bestProfitTable[stationId]) {
      return new Response(JSON.stringify(bestProfitTable[stationId]), {
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    return Response.json(bestProfitTable);
  }
}