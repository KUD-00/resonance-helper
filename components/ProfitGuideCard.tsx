import React from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

import { Separator } from "./ui/separator"
import { getStationName } from "@/config/stations"
import { stationStaminMap } from "@/config/lines"

export const ProfitGuideCard = React.memo(function ProfitGuideCard({ selectedStationId, profitTable, stock, userInfo }: { selectedStationId: string, profitTable: ProfitTable, stock: number, userInfo: UserInfo }) {

  const { sumProfit, sumStock } = React.useMemo(() => ({
    sumProfit: profitTable.goods.reduce((acc, value) => acc + value.allProfit, 0),
    sumStock: profitTable.goods.reduce((acc, value) => acc + value.stock, 0),
  }), [profitTable.goods]);

  const stamin = stationStaminMap[selectedStationId][profitTable.targetStationId]
  const allProfit = sumProfit * Math.floor(stock / sumStock)

  return (
    <Card className="min-w-[250px] max-w-[300px]">
      <CardHeader>
        <CardTitle>倒{getStationName(profitTable.targetStationId)}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        {profitTable.goods.map((good, index) => (
          <div
            key={good.goodId}
            className="mb-4 grid grid-cols-[25px_1fr] items-start last:mb-0 last:pb-0 items-center"
          >
            <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger>
                  <p className="text-sm font-medium leading-none">
                    {good.goodName}
                  </p>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-muted-foreground">
                    总利润：{good.allProfit}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    单体利润：{good.perProfit}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    仓储：{good.stock}
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        ))}
        <p className="text-sm text-muted-foreground">利润估算：{allProfit}</p>
        <Separator />
        <p className="text-sm text-muted-foreground">仓储需求：{sumStock}</p>
        <p className="text-sm text-muted-foreground">单位仓储利润：{Math.floor(sumProfit / sumStock)}</p>
        <Separator />
        <p className="text-sm text-muted-foreground">消耗进货书：{Math.floor(stock / sumStock) - 1}</p>
        <p className="text-sm text-muted-foreground">单位进货书利润：{sumProfit}</p>
        <Separator />
        <p className="text-sm text-muted-foreground">行驶疲劳值：{stamin}</p>
        <p className="text-sm text-muted-foreground">砍价期望疲劳值：暂时固定60</p>
        <p className="text-sm text-muted-foreground">单位疲劳值利润：{Math.floor(allProfit / (stamin + 60))}</p>
      </CardContent>
    </Card>
  )
})