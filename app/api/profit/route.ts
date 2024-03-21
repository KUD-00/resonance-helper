import { defaultUser } from "@/config/others";
import { getStationProfitTable } from "@/utils/calculate";
import { getBuyAndSellDict, transformResponseArrayToDict } from "@/utils/utils";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const stationId = url.searchParams.get("stationId");

  const [buyDataDict, sellDataDict] = await getBuyAndSellDict();
  const stationProfitTable: StationProfitTable = getStationProfitTable(buyDataDict, sellDataDict, defaultUser);

  if (stationId && stationProfitTable[stationId]) {
    return new Response(JSON.stringify(stationProfitTable[stationId]), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return Response.json(stationProfitTable)
}