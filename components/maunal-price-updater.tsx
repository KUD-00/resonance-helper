'use client'
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { allStationsDict } from "@/config/stations";
import { Button } from "@/components/ui/button";
import { buyToSellGoodsDict } from '@/config/goods';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { toast } from "@/components/ui/use-toast"

interface ContributeForm {
  transactionType: 'sell' | 'buy';
  station_id: string;
  good_id: string;
  trend: string;
  price: string;
}

const schema = z.object({
  transactionType: z.enum(['sell', 'buy']),
  station_id: z.string(),
  good_id: z.string(),
  trend: z.enum(['0', '1', '-1']),
  price: z.string().min(1)
});

export function ManualPriceUpdater() {
  const form = useForm<ContributeForm>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: ContributeForm) => {
    const endpoint = data.transactionType === 'sell' ? '/api/sell' : '/api/buy';
    const updated_at = new Date().toISOString();
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([{
          station_id: data.station_id,
          good_id: data.good_id,
          price: data.price,
          trend: data.trend,
          updated_at,
        }]),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.error("Failed to submit form:", error);
    }
  };

  const watchTransactionType = form.watch("transactionType");
  const watchStationId = form.watch("station_id");
  const watchGoodId = form.watch("good_id");
  const watchTrend = form.watch("trend");

  return (
    <Card className="w-full md:w-[400px]">
      <CardHeader>
        <CardTitle>手动更新</CardTitle>
        <CardDescription>感谢您的贡献!</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="animate-in flex-1 flex-col space-y-4">
            <FormField
              control={form.control}
              name="transactionType"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="buy" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          购买
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="sell" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          贩卖
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex-1 flex'>
              <FormField
                control={form.control}
                name="station_id"
                render={({ field }) => (
                  <FormItem>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-[160px]">
                          <SelectValue placeholder="选择站点" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(allStationsDict).map((station) => (
                          <SelectItem key={station.station_id} value={station.station_id}>
                            {station.name.cn}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="good_id"
                render={({ field }) => (
                  <FormItem>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-[160px]">
                          <SelectValue placeholder="选择商品" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.keys(allStationsDict[watchStationId]?.goods_list || {}).map((good_id) => (
                          <SelectItem key={good_id} value={good_id}>
                            {buyToSellGoodsDict[good_id]?.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="trend"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="0" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          稳定
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="1" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          上涨
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="-1" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          下跌
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input className="w-[120px]" placeholder="价格" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">提交</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}