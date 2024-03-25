import { getProfile, getStationInfo, isLogin } from "./actions";
import { cn, getTransformedDataDict, isOutdated, linuxTimeToMinutesAgo } from "@/utils/utils"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getStationName } from "@/config/stations";
import { calculateStationModifiedSellInfoDict, calculateStationProfitTable, calculateStationSellBasicInfoDict, getProfitTables, getStationProfitTable, getStationTargetProfitTable, optimizeProfitTables } from "@/utils/calculate";
import { defaultUser } from "@/config/others";

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

  const stationSellBasicInfoDict = calculateStationSellBasicInfoDict(buyDataDict, sellDataDict, user);
  const modifiedSellBasicInfoDict = calculateStationModifiedSellInfoDict(stationSellBasicInfoDict);
  const stationProfitTable = calculateStationProfitTable(modifiedSellBasicInfoDict);
  const stationTargetProfitTable = getStationTargetProfitTable(stationProfitTable);
  const profitTable = getProfitTables(stationTargetProfitTable, user);
  const optimizedProfitTables = optimizeProfitTables(profitTable)
  const filteredTrades: OptimizedProfitTable = {};

  const getCorrespondBestRoute = (route: ProfitTable) => {
    const routes = profitTable[route.targetStationId]
      .filter(r => r.targetStationId == route.startStationId)
      .filter(trade => trade.profitPerStock >= user.default_per_stock_profit && trade.book <= user.default_book);

    return routes[0]
  }

  Object.keys(optimizedProfitTables).forEach(key => {
    const filtered = optimizedProfitTables[key].filter(trade => trade.profitPerStock >= user.default_per_stock_profit && trade.book <= user.default_book);
    if (filtered.length > 0) {
      filteredTrades[key] = filtered;
    }
  });

  function generateMermaidChartDefinition(data: OptimizedProfitTable): string[] {
    let perStockProfitChartDefinition = 'graph LR;\n';
    let perStaminProfitChartDefinition = 'graph LR;\n';

    for (const [stationId, routes] of Object.entries(data)) {
      if (routes.length > 0) {
        const firstRoute = routes[0];
        const correspondRote = getCorrespondBestRoute(firstRoute);
        const sourceStationName = getStationName(stationId);
        const targetStationName = getStationName(firstRoute.targetStationId);

        perStockProfitChartDefinition += `${sourceStationName} -->| ${firstRoute.profitPerStock}| ${targetStationName};\n`;
        perStaminProfitChartDefinition += `${sourceStationName} -->| ${firstRoute.profitPerStamin}| ${targetStationName};\n`;
        if (correspondRote && correspondRote.targetStationId != data[correspondRote.startStationId][0].targetStationId) {
          perStockProfitChartDefinition += `${targetStationName} -.->| ${correspondRote.profitPerStock}| ${sourceStationName};\n`;
          perStaminProfitChartDefinition += `${targetStationName} -.->| ${correspondRote.profitPerStamin}| ${sourceStationName};\n`;
        }
      }
    }

    return [perStockProfitChartDefinition, perStaminProfitChartDefinition]
  }

  const [perStockProfitChartDefinition, perStaminProfitChartDefinition]= generateMermaidChartDefinition(filteredTrades);

  return (
    <div className="flex flex-col gap-8 items-center m-4">
      <Card className={cn("w-[350px] sm:w-[500px] md:w-[700px] lg:w-[800px] xl:w-[900px] 2xl:w-[1000px]")}>
        <CardHeader>
          <CardTitle>推荐路线</CardTitle>
          <CardDescription>根据用户的设置(默认最大使用进货书/默认最低单位仓储利润)来推荐的哦</CardDescription>
          <CardDescription>实线箭头指向当前站最好的倒货路线，虚线箭头为倒回来的参考利润</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <CardDescription>单位仓储利润图</CardDescription>
          <div className="mermaid">
            {perStockProfitChartDefinition}
          </div>
          <CardDescription>单位疲劳利润图</CardDescription>
          <div className="mermaid">
            {perStaminProfitChartDefinition}
          </div>
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