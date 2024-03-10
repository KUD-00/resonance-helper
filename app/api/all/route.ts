import { createClient } from '@/utils/supabase/server';

export async function POST(request: Request) {
  const supabase = createClient();

  const submitData = JSON.parse(await request.json());
  const stationIdKeys = Object.keys(submitData.stations);

  const station_id = stationIdKeys[0];
  const updated_at = new Date().toISOString();

  const buyGoodsArray = Object.entries(submitData.goods_price.buy_price).map(([good_id, details]) => ({
    good_id,
    trend: (details as PriceDetail).trend,
    price: (details as PriceDetail).price,
    updated_at,
    station_id
  }));

  const sellGoodsArray = Object.entries(submitData.goods_price.sell_price).map(([good_id, details]) => ({
    good_id,
    trend: (details as PriceDetail).trend,
    price: (details as PriceDetail).price,
    updated_at,
    station_id
  }));

  const { data: buyResponse, error: buyError } = await supabase
    .from('buy')
    .upsert(buyGoodsArray)

  const { data: sellResponse, error: sellError } = await supabase
    .from('sell')
    .upsert(sellGoodsArray)

  if (buyError || sellError) {
    return Response.json("Error")
  } else {
    return Response.json("OK")
  }
}
