import React from "react";
import { getProfile, getStationInfo, isLogin } from "./actions";
import { cn, generateMermaidChartDefinition, getTransformedDataDict, isOutdated, linuxTimeToMinutesAgo } from "@/utils/utils"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getStationName } from "@/config/stations";
import { getStationProfitTable } from "@/utils/calculate";
import { defaultUser } from "@/config/others";
import Mermaid from "@/components/Mermaid";

interface StationInfo {
  station_id: string
  updated_at: string
}

export default async function Index() {
  const stationInfos: StationInfo[] = await getStationInfo()
  const [sellDataDict, buyDataDict] = await getTransformedDataDict();

  const profile: UserInfo[] = await getProfile();
  const isUserLoggedIn = await isLogin();

  const user = isUserLoggedIn ? profile[0] : defaultUser as UserInfo
  const optimizedProfitTables = getStationProfitTable(buyDataDict, sellDataDict, user)
  const filteredTrades: OptimizedProfitTable = {};

  Object.keys(optimizedProfitTables).forEach(key => {
    const filtered = optimizedProfitTables[key].filter(trade => trade.profitPerStock >= user.default_per_stock_profit && trade.book <= user.default_book);
    if (filtered.length > 0) {
      filteredTrades[key] = filtered;
    }
  });

  const chartDefinition = generateMermaidChartDefinition(filteredTrades);

  return (
    <div className="flex flex-col gap-8 items-center m-4">
      <Card className={cn("w-[350px] sm:w-[500px] md:w-[700px] lg:w-[800px] xl:w-[900px] 2xl:w-[1000px]")}>
        <CardHeader>
          <CardTitle>推荐路线</CardTitle>
          <CardDescription>根据用户的设置(默认最大使用进货书/默认最低单位仓储利润)来推荐的哦</CardDescription>
          <CardDescription>数字为单位仓储利润/单位疲劳利润</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Mermaid text={chartDefinition} />
        </CardContent>
        <CardFooter>
        </CardFooter>
      </Card>
      <Card className={cn("w-[350px] sm:w-[500px]")}>
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
    </div>
  )
}