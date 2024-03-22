import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "./ui/separator"
import { cn } from "@/utils/utils"
import { getStationName } from "@/config/stations"

export function ProfitGuideCard({ selectedStationId, bestProfitTable, baseProfit, stock, userInfo}: { selectedStationId: string, bestProfitTable: BestProfitTable, baseProfit: number, stock: number, userInfo: UserInfo}) {
  const sumProfit = bestProfitTable[selectedStationId].goods.reduce((acc, value) => acc + value.allProfit, 0)
  const sumStock = bestProfitTable[selectedStationId].goods.reduce((acc, value) => acc + value.stock, 0)

  return (
    <Card className={cn("w-[300px]")}>
      <CardHeader>
        <CardTitle>倒{getStationName(bestProfitTable[selectedStationId].targetStationId)}最好</CardTitle>
        <CardDescription>只考虑单体利润{baseProfit}以上的商品</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div>
          {bestProfitTable[selectedStationId].goods.map((good, index) => (
            <div
              key={index}
              className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
            >
              <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">
                  {good.goodName}
                </p>
                <p className="text-sm text-muted-foreground">
                  总利润：{good.allProfit}
                </p>
                <p className="text-sm text-muted-foreground">
                  单体利润：{good.perProfit}
                </p>
                <p className="text-sm text-muted-foreground">
                  仓储：{good.stock}
                </p>
              </div>
            </div>
          ))}
        </div>
        <Separator />
        <p className="text-sm text-muted-foreground">仓储需求：{sumStock}</p>
        <p className="text-sm text-muted-foreground">单位仓储利润：{Math.floor(sumProfit / sumStock)}</p>
        <p className="text-sm text-muted-foreground">消耗进货书：{Math.floor(stock / sumStock) - 1}</p>
        <p className="text-sm text-muted-foreground">利润估算：{sumProfit * Math.floor(stock / sumStock)}</p>
        <p className="text-sm text-muted-foreground">单位进货书利润：{Math.floor(sumProfit * Math.floor(stock / sumStock) / (Math.floor(stock / sumStock)))}</p>
      </CardContent>
    </Card>
  )
}