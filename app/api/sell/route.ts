import { getSellDataArray } from '@/app/actions';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
  return Response.json(getSellDataArray)
}

export async function POST(request: Request) {
  const data = await request.json();
  const supabase = createClient();

  const { error } = await supabase
    .from('sell')
    .upsert(data)

  return Response.json(error)
}
