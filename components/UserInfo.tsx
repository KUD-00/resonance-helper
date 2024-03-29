"use client"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { cn } from "@/utils/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { z } from "zod"
import { set, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { getStationName } from "@/config/stations"
import { updateProfile } from "@/app/actions"
import { useRouter } from 'next/navigation';
import React from "react"

export function UserInfo({ info }: { info: UserInfo }) {
  const router = useRouter();
  const [submitMessage, setSubmitMessage] = React.useState("提交")

  const infos = [
    {
      title: "id(和游戏uid不同，仅用于本网站）",
      value: info.user_id,
    },
    {
      title: "等级",
      value: info.level,
    },
    {
      title: "贸易等级",
      value: info.trade_level,
    },
    {
      title: "默认使用进货书数量",
      value: info.default_book,
    },
    {
      title: "默认最小单体仓储利润",
      value: info.default_per_stock_profit,
    },
    {
      title: "默认列车仓储容量",
      value: info.default_stock,
    }
  ]

  const schema = z.object({
    role_name: z.string(),
    level: z.coerce.number(),
    trade_level: z.coerce.number(),
    reputations: z.record(z.coerce.number()),
    default_book: z.coerce.number(),
    default_per_stock_profit: z.coerce.number(),
    default_stock: z.coerce.number(),
  });

  const form = useForm<UserInfo>({
    defaultValues: {
      ...info
    },
    resolver: zodResolver(schema),
  });

  const onSubmit = async (values: z.infer<typeof schema>) => {
    const profile = {
      user_id: info.user_id,
      ...values
    }

    const error = await updateProfile(profile)

    if (error) {
      console.log(error)
      setSubmitMessage("提交失败")
    } else {
      setSubmitMessage("提交成功")
    }
  }

  return (
    <>
      <Tabs defaultValue="profile" className="w-[350px] sm:w-[500px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="profile">用户信息</TabsTrigger>
          <TabsTrigger value="password">修改信息</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <Card className={cn("w-[350px] sm:w-[500px]")}>
            <CardHeader>
              <CardTitle>{info.role_name}，你好！</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div>
                {infos.map((info, index) => (
                  <div
                    key={index}
                    className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
                  >
                    <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {info.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {info.value}
                      </p>
                    </div>
                  </div>
                ))}
                <Accordion type="single" collapsible>
                  <AccordionItem value="item-1">
                    <AccordionTrigger>
                      <span>城市声望</span>
                    </AccordionTrigger>
                    <AccordionContent>
                      {Object.entries(info.reputations).map(([station_id, reputation]) => {
                        return (
                          <div key={station_id} className="flex items-center justify-between">
                            <span>{getStationName(station_id)}</span>
                            <span>{reputation}</span>
                          </div>
                        )
                      })}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </CardContent>
            <CardFooter>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>手动更改基本情报</CardTitle>
              <CardDescription>
                通过信息可更好的计算成本和利润
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="animate-in flex-1 flex-col space-y-4">
                  <FormField
                    control={form.control}
                    name="role_name"
                    render={({ field }) => (
                      <FormItem>
                        <p className="text-sm text-gray-500">昵称</p>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="level"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <p className="text-sm text-gray-500">等级</p>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="trade_level"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <p className="text-sm text-gray-500">贸易等级</p>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="default_book"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <p className="text-sm text-gray-500">默认使用进货书数量</p>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="default_per_stock_profit"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <p className="text-sm text-gray-500">默认最小单体仓储利润</p>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="default_stock"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <p className="text-sm text-gray-500">默认列车仓储容量</p>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {Object.keys(info.reputations).map(station_id => (
                    <FormField
                      key={station_id}
                      control={form.control}
                      name={`reputations.${station_id}`}
                      render={({ field }) => (
                        <FormItem>
                          <Label>{getStationName(station_id)} 声望等级</Label>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  ))}
                  <Button type="submit" className="w-full">
                    {submitMessage}
                  </Button>
                </form>
              </Form>
            </CardContent>
            <CardFooter>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  )
}
