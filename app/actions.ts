"use server"

import { createClient } from "@/utils/supabase/server";

export const getBuyDataArray = async () => {
  const supabase = createClient();

  const { data: buyResponse, error } = await supabase
    .from('buy')
    .select()

  if (error) {
    return []
  } else {
    return buyResponse
  }
}

export const getSellDataArray = async () => {
  const supabase = createClient();

  const { data: sellResponse, error } = await supabase
    .from('sell')
    .select()

  if (error) {
    return []
  } else {
    return sellResponse
  }
}

export const getBuyAndSellDataArray = async () => {
  const buyData = await getBuyDataArray();
  const sellData = await getSellDataArray();
  return [buyData, sellData];
}