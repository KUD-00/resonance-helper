import { getBuyAndSellDataArray } from "@/app/actions";
import { defaultUser } from "@/config/others";
import { calculateStationProfitTable, transformResponseDataArrayToDict } from "@/utils/utils";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const stationId = url.searchParams.get("stationId");

  const [buyDataArray, sellDataArray] = await getBuyAndSellDataArray();

  const sellDataDict = transformResponseDataArrayToDict(sellDataArray);

  const stationProfitTable: StationProfitTable = calculateStationProfitTable(transformResponseDataArrayToDict(buyDataArray), sellDataDict, defaultUser);

  if (stationId && stationProfitTable[stationId]) {
    return new Response(JSON.stringify(stationProfitTable[stationId]), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return Response.json(stationProfitTable)
}