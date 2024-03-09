import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
  const supabase = createClient();

  const { data } = await supabase
    .from("buy")
    .select()

  return Response.json(data)
}

export async function POST(request: Request) {
  const buyGoodsArray = await request.json();
  const supabase = createClient();

  const { data, error } = await supabase
    .from('buy')
    .upsert(buyGoodsArray)

  return Response.json(data)
}
