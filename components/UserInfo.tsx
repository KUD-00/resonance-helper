"use client"
import { BellIcon, CheckIcon } from "@radix-ui/react-icons"
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
import { getStationName } from "@/config/stations"


export function UserInfo({ info }: {info: UserInfo}) {
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

  return (
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
        <Button className="w-full">
          提交修改
        </Button>
      </CardFooter>
    </Card>
  )
}
