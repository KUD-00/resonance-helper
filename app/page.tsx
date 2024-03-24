import { getStationInfo } from "./actions";
import { cn, isOutdated, linuxTimeToMinutesAgo } from "@/utils/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getStationName } from "@/config/stations";

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
        <div>
          {stationInfos.map((stationInfo, index) => {
            if (isOutdated(new Date(stationInfo.updated_at).getTime(), 20))
              return (
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
              )
            return null
          })}
          <p className="text-sm font-medium leading-none">没有条目就一切正常</p>
        </div>
      </CardContent>
      <CardFooter>
      </CardFooter>
    </Card>
  )
}