"use client"

import * as React from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { filteredStationsDict, getStationName } from "@/config/stations"
import { calculateBestProfitTable, cn, filterStationProfitTableByPerProfit } from "@/utils/utils"
import { ChevronRightIcon, PlusIcon, MinusIcon } from "@radix-ui/react-icons"
import { Button } from "@/components/ui/button"
 
export function ProfitGuide({stationProfitTable}: {stationProfitTable: StationProfitTable}) {
  const [selectedStationId, setSelectedStationId] = React.useState("83000014")
  const [baseProfit, setBaseProfit] = React.useState(1000)

  const bestProfitTable = calculateBestProfitTable(filterStationProfitTableByPerProfit(stationProfitTable, baseProfit));

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="flex items-center py-4 md:gap-20">
        <Select onValueChange={(station_id) => { setSelectedStationId(station_id) }} defaultValue={selectedStationId}>
          <SelectTrigger className="">
            <SelectValue placeholder="起点" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(filteredStationsDict).map(([stationId, { name }]) => (
              <SelectItem key={stationId} value={stationId}>
                {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {bestProfitTable[selectedStationId] &&
        <div className="flex flex-col items-center justify-center gap-4">
          <p className="text-sm text-gray-500">基准利润(越高需要更多进货书)</p>
          <div className="flex items-center justify-center gap-4">
            <Button onClick={() => { setBaseProfit(baseProfit - 100) }} variant="outline" size="icon">
              <MinusIcon className="h-4 w-4" />
            </Button>
            {baseProfit}
            <Button onClick={() => { setBaseProfit(baseProfit + 100) }} variant="outline" size="icon">
              <PlusIcon className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-col lg:flex-row justify-center gap-4">
            <ProfitGuideCard
              selectedStationId={selectedStationId}
              bestProfitTable={calculateBestProfitTable(filterStationProfitTableByPerProfit(stationProfitTable, baseProfit - 300))}
              baseProfit={baseProfit - 500} 
            />
            <ProfitGuideCard
              selectedStationId={selectedStationId}
              bestProfitTable={bestProfitTable}
              baseProfit={baseProfit}
            />
            <ProfitGuideCard
              selectedStationId={selectedStationId}
              bestProfitTable={calculateBestProfitTable(filterStationProfitTableByPerProfit(stationProfitTable, baseProfit + 500))}
              baseProfit={baseProfit + 500}
            />
          </div>
        </div>
      }
    </div>
  )
}

function ProfitGuideCard({ selectedStationId, bestProfitTable, baseProfit }: { selectedStationId: string, bestProfitTable: BestProfitTable, baseProfit: number}) {
  return (
    <Card className={cn("w-[380px]")}>
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
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}