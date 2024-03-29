import { getSellDataArray } from '@/app/actions';
import { getGoodName, getGoodSellPrice, goodsDict } from '@/config/goods';
import { getStationName } from '@/config/stations';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const stationId = url.searchParams.get("stationId");
  const goodId = url.searchParams.get("goodId");
  const stationName = url.searchParams.get("stationName");
  const goodName = url.searchParams.get("goodName");

  const sellDatasWithName = (await getSellDataArray()).map((data) => (
    {
      ...data,
      good_name: getGoodName(data.good_id),
      station_name: getStationName(data.station_id),
      base_price: getGoodSellPrice(data.good_id, data.station_id),
    }
  ))

  if (stationId) {
    return Response.json(sellDatasWithName.filter((data) => data.station_id == stationId))
  }

  if (goodId) {
    return Response.json(sellDatasWithName.filter((data) => data.good_id == goodId))
  }

  if (stationName) {
    return Response.json(sellDatasWithName.filter((data) => data.station_name == stationName))
  }

  if (goodName) {
    return Response.json(sellDatasWithName.filter((data) => data.good_name == goodName))
  }

  return Response.json(sellDatasWithName)
}