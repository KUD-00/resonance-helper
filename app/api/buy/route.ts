import { getBuyDataArray } from '@/app/actions';
import { getGoodName } from '@/config/goods';
import { getStationName } from '@/config/stations';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const stationId = url.searchParams.get("stationId");
  const goodId = url.searchParams.get("goodId");
  const stationName = url.searchParams.get("stationName");
  const goodName = url.searchParams.get("goodName");

  const buyDatasWithName = (await getBuyDataArray()).map((data) => (
    {
      ...data,
      good_name: getGoodName(data.good_id),
      station_name: getStationName(data.station_id)
    }
  ))

  if (stationId) {
    return Response.json(buyDatasWithName.filter((data) => data.station_id == stationId))
  }

  if (goodId) {
    return Response.json(buyDatasWithName.filter((data) => data.good_id == goodId))
  }

  if (stationName) {
    return Response.json(buyDatasWithName.filter((data) => data.station_name == stationName))
  }

  if (goodName) {
    return Response.json(buyDatasWithName.filter((data) => data.good_name == goodName))
  }

  return Response.json(buyDatasWithName)
}