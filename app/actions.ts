"use server"

import { defaultUser } from "@/config/others";
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

export const getProfile = async () => {
  const supabase = createClient();

  const { data, error } = await supabase.from("profiles").select()

  if (error) {
    return []
  } else {
    return data
  }
}

export const updateProfile = async (profile: any) => {
  const supabase = createClient();

  const { data, error } = await supabase.from("profiles").upsert(profile)

  if (error) {
    return error.details
  }
}

export const isLogin = async () => {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    return true
  } else {
    return false
  }
}