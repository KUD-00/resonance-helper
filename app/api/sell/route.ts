import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
  const supabase = createClient();

  const { data: notes } = await supabase
    .from("sell")
    .select()

  return Response.json(notes)
}

export async function POST(request: Request) {
  const data = await request.json();
  const supabase = createClient();

  const { error } = await supabase
    .from('sell')
    .upsert(data)

  return Response.json(error)
}
