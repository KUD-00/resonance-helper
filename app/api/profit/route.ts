import { defaultUser } from "@/config/others";
import { getStationProfitTable } from "@/utils/calculate";
import { getBuyAndSellDict } from "@/utils/utils";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const stationId = url.searchParams.get("stationId");

  const [buyDataDict, sellDataDict] = await getBuyAndSellDict();
  const stationProfitTable: OptimizedProfitTable = getStationProfitTable(buyDataDict, sellDataDict, defaultUser);

  if (stationId && stationProfitTable[stationId]) {
    return Response.json(stationProfitTable[stationId])
  }

  return Response.json(stationProfitTable)
}

export async function POST(request: Request) {
  try {
    const userInfo: UserInfo = await request.json();

    const [buyDataDict, sellDataDict] = await getBuyAndSellDict();
    const stationProfitTable: OptimizedProfitTable = getStationProfitTable(buyDataDict, sellDataDict, userInfo);

    const url = new URL(request.url);
    const stationId = url.searchParams.get("stationId");

    if (stationId && stationProfitTable[stationId]) {
      return Response.json(stationProfitTable[stationId])
    }

    return Response.json(stationProfitTable)
  } catch (error) {
    return Response.json("Invalid request body", { status: 400 });
  }
}