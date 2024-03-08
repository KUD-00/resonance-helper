import { createClient } from '@/utils/supabase/server';

export const supabase = createClient();

export const getSellData = async () => {
  const { data } = await supabase
    .from("buy")
    .select()

  return data
}