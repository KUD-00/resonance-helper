"use client"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { cn } from "@/utils/utils"
import { getStationName } from "@/config/old-stations"
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
import { useForm } from "react-hook-form"
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


export function UserInfo({ info }: { info: UserInfo }) {
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
      title: "财富",
      value: info.gold,
    },
  ]

  const schema = z.object({
    user_id: z.number(),
    max_energy: z.number(),
    energy: z.number(),
    role_name: z.string(),
    gold: z.number(),
    level: z.number(),
    move_energy: z.number(),
    reputations: z.record(z.number())
  });

  const form = useForm<UserInfo>({
    resolver: zodResolver(schema),
  });

  return (
    <>
      <Tabs defaultValue="profile" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="profile">用户信息</TabsTrigger>
          <TabsTrigger value="password">修改信息</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <Card className={cn("w-[380px]")}>
            <CardHeader>
              <CardTitle>列车长基本情报</CardTitle>
              <CardDescription>可通过抓包程序或手动更改</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div>
                {infos.map((notification, index) => (
                  <div
                    key={index}
                    className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
                  >
                    <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {notification.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {notification.value}
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
                通过您的信息，可更好的计算成本和利润
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(() => { })} className="animate-in flex-1 flex-col space-y-4">
                  <FormField
                    control={form.control}
                    name="level"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormControl>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="reputations"
                    render={({ field }) => (
                      <FormItem>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full">
                    提交修改
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