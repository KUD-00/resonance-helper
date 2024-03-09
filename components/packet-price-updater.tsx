"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react"

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
  const [msg, setMsg] = useState("提交")
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      setMsg("正在更新...")
      const submitData = JSON.parse(data.packetData);
      const stationIdKeys = Object.keys(submitData.stations);

      if (stationIdKeys.length !== 1) {
        setMsg("stations对象中必须有且只有一个key")
      }

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

      const buyResponse = await fetch("/api/buy", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sellGoodsArray),
      });

      const sellResponse = await fetch("/api/sell", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(buyGoodsArray),
      });

      if (buyResponse.ok && sellResponse.ok) {
        setMsg(`成功更新`)
      } else {
        setMsg(`网络错误或数据库错误`)
      }
    } catch (error) {
        setMsg(`数据格式错误`)
    }
  }

  return (
    <Card className="w-full sm:w-[400px]">
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
                    不会收集个人隐私数据,提交数据后半分钟才会刷新服务器缓存
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">{msg}</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
