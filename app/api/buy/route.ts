import { getBuyDataArray } from '@/app/actions';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
  return Response.json(getBuyDataArray())
}

export async function POST(request: Request) {
  const buyGoodsArray = await request.json();
  const supabase = createClient();

  const { data, error } = await supabase
    .from('buy')
    .upsert(buyGoodsArray)

  return Response.json(data)
}
