"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from "@/components/ui/label";

interface PriceDetail {
  trend: number;
  not_num: number;
  is_rise: number;
  price: number;
  trade_num: number;
  interval_num: number;
  is_rare: number;
}

const FormSchema = z.object({
  packetData: z
    .string()
})

export function PacketPriceUpdater() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      const jsonData = JSON.parse(data.packetData);
      const stationIdKeys = Object.keys(jsonData.stations);

      if (stationIdKeys.length !== 1) {
        throw new Error("stations对象中必须有且只有一个key");
      }

      const station_id = stationIdKeys[0];
      const updated_at = new Date().toISOString();

      const buy_goods_array = Object.entries(jsonData.goods_price.buy_price).map(([good_id, details]) => ({
        good_id,
        trend: (details as PriceDetail).trend,
        price: (details as PriceDetail).price,
        updated_at,
        station_id
      }));

      const sell_goods_array = Object.entries(jsonData.goods_price.sell_price).map(([good_id, details]) => ({
        good_id,
        trend: (details as PriceDetail).trend,
        price: (details as PriceDetail).price,
        updated_at,
        station_id
      }));

      const update_buy_response =  await fetch("/api/buy", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sell_goods_array),
      });

      const update_sell_response = await fetch("/api/sell", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(buy_goods_array),
      });

      console.log(update_buy_response);
      console.log(update_sell_response);

    } catch (error) {
      console.error("处理JSON数据时出错：", (error as Error).message);
    }
  }

  return (
    <Card className="w-full md:w-[400px]">
      <CardHeader>
        <CardTitle>抓包数据批量更新</CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent>
        <Label className="font-normal">
        </Label>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="packetData"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="在这里粘贴你的抓包数据"
                      className="resize-none min-h-60"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    不会收集个人隐私数据
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">提交</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
