import { defaultUser } from "@/config/others";
import { getStationProfitTable } from "@/utils/calculate";
import { getBuyAndSellDict, transformResponseArrayToDict } from "@/utils/utils";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const stationId = url.searchParams.get("stationId");
  const uuid = url.searchParams.get("uuid");

  const [buyDataDict, sellDataDict] = await getBuyAndSellDict();
  const stationProfitTable: OptimizedProfitTable = getStationProfitTable(buyDataDict, sellDataDict, defaultUser);

  if (stationId && stationProfitTable[stationId]) {
    return Response.json(stationProfitTable[stationId])
  }

  return Response.json(stationProfitTable)
}