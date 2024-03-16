import { getBuyDataArray, getSellDataArray } from '@/app/actions';
import { createClient } from '@/utils/supabase/server';
import { transformBuyDataArrayToDict, transformSellDataArrayToDict } from '@/utils/utils';

export async function POST(request: Request) {
  const supabase = createClient();

  const submitData = JSON.parse(await request.json());
  const stationIdKeys = Object.keys(submitData.stations);

  const station_id = stationIdKeys[0];
  const updated_at = new Date().toISOString();

  const buyDataDict = transformBuyDataArrayToDict(await getBuyDataArray());
  const sellDataDict = transformSellDataArrayToDict(await getSellDataArray());

  const buyGoodsArray = Object.entries(submitData.goods_price.sell_price).map(([good_id, details]) => (
    {
      good_id,
      trend: (details as PriceDetail).trend,
      price: (details as PriceDetail).price,
      updated_at,
      station_id,
      min_price: buyDataDict[good_id][station_id] ? Math.min(buyDataDict[good_id][station_id].min_price, (details as PriceDetail).price) : (details as PriceDetail).price,
      max_price: buyDataDict[good_id][station_id] ? Math.max(buyDataDict[good_id][station_id].max_price, (details as PriceDetail).price) : (details as PriceDetail).price
    }
  ));

  const sellGoodsArray = Object.entries(submitData.goods_price.buy_price).map(([good_id, details]) => (
    {
      good_id,
      trend: (details as PriceDetail).trend,
      price: (details as PriceDetail).price,
      updated_at,
      station_id,
      min_price: sellDataDict[good_id] ? Math.min(sellDataDict[good_id].min_price, (details as PriceDetail).price) : (details as PriceDetail).price,
      max_price: sellDataDict[good_id] ? Math.max(sellDataDict[good_id].max_price, (details as PriceDetail).price) : (details as PriceDetail).price
    }
  ));

  const { data: buyPostResponse, error: buyError } = await supabase
    .from('buy')
    .upsert(buyGoodsArray)

  const { data: sellPostResponse, error: sellError } = await supabase
    .from('sell')
    .upsert(sellGoodsArray)

  if (buyError || sellError) {
    return Response.json("Error, ${buyError}, ${sellError}")
  } else {
    return Response.json("OK")
  }
}
