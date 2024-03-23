import { getStationInfo } from "./actions";
import { cn, linuxTimeToMinutesAgo } from "@/utils/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { BellRing } from "lucide-react";
import { getStationName } from "@/config/stations";
import { stationMap, stationStaminMap } from "@/config/lines";

interface StationInfo {
  station_id: string
  updated_at: string
}

export default async function Index() {
  const stationInfos: StationInfo[] = await getStationInfo()

  return (
    <Card className={cn("w-[380px]")}>
      <CardHeader>
        <CardTitle>商品数据更新情况</CardTitle>
        <CardDescription>20分钟以内视为正常</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className=" flex items-center space-x-4 rounded-md border p-4">
          <BellRing />
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">
              提醒我模拟器挂了
            </p>
            <p className="text-sm text-muted-foreground">
              不过可能也没什么用
            </p>
          </div>
          <Button>已经过期啦</Button>
        </div>
        <div>
          {stationInfos.map((stationInfo, index) => (
            <div
              key={index}
              className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
            >
              <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">
                  {getStationName(stationInfo.station_id)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {linuxTimeToMinutesAgo(new Date(stationInfo.updated_at).getTime())}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
      </CardFooter>
    </Card>
  )
}