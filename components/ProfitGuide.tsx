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
import { filteredStationsDict, getAttatchedToCity, getStationName } from "@/config/stations"
import { calculateBestProfitTable, cn, filterStationProfitTableByPerProfit } from "@/utils/utils"
import { PlusIcon, MinusIcon } from "@radix-ui/react-icons"
import { Button } from "@/components/ui/button"
import { Separator } from "./ui/separator"
import { calculateStock, calculateTax } from "@/utils/calculate"
 
export function ProfitGuide({stationProfitTable, userInfo, isUserLoggedIn}: {stationProfitTable: StationProfitTable, userInfo: UserInfo, isUserLoggedIn: boolean}) {
  const [selectedStationId, setSelectedStationId] = React.useState("83000014")
  const [baseProfit, setBaseProfit] = React.useState(500)
  const [stock, setStock] = React.useState(600)
  const gap = 100

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
          <div className="flex flex-row gap-16">
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
            </div>
            <div className="flex flex-col items-center justify-center gap-4">
              <p className="text-sm text-gray-500">仓储</p>
              <div className="flex items-center justify-center gap-4">
                <Button onClick={() => { setStock(stock - 50) }} variant="outline" size="icon">
                  <MinusIcon className="h-4 w-4" />
                </Button>
                {stock}
                <Button onClick={() => { setStock(stock + 50) }} variant="outline" size="icon">
                  <PlusIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          <div className="flex flex-col lg:flex-row justify-center gap-4">
            <ProfitGuideCard
              selectedStationId={selectedStationId}
              bestProfitTable={calculateBestProfitTable(filterStationProfitTableByPerProfit(stationProfitTable, baseProfit - gap))}
              baseProfit={baseProfit - gap}
              stock={stock}
              userInfo={userInfo}
            />
            <ProfitGuideCard
              selectedStationId={selectedStationId}
              bestProfitTable={bestProfitTable}
              baseProfit={baseProfit}
              stock={stock}
              userInfo={userInfo}
            />
            <ProfitGuideCard
              selectedStationId={selectedStationId}
              bestProfitTable={calculateBestProfitTable(filterStationProfitTableByPerProfit(stationProfitTable, baseProfit + gap))}
              baseProfit={baseProfit + gap}
              stock={stock}
              userInfo={userInfo}
            />
          </div>
        </div>
      }
      {isUserLoggedIn ?
          <p className="text-sm text-gray-500">{getStationName(selectedStationId)}税率{calculateTax(selectedStationId, userInfo.reputations[getAttatchedToCity(selectedStationId)])}，砍抬价20%，声望等级10即可购买数量+100%</p> :
          <p className="text-sm text-gray-500">默认税率10%，砍抬价20%，声望等级10即可购买数量+100%</p>
      }
    </div>
  )
}

function ProfitGuideCard({ selectedStationId, bestProfitTable, baseProfit, stock, userInfo}: { selectedStationId: string, bestProfitTable: BestProfitTable, baseProfit: number, stock: number, userInfo: UserInfo}) {
  const sumProfit = bestProfitTable[selectedStationId].goods.reduce((acc, value) => acc + value.allProfit, 0)
  const sumStock = bestProfitTable[selectedStationId].goods.reduce((acc, value) => acc + calculateStock(value.goodId, value.buyStationId, userInfo.reputations[getAttatchedToCity(value.buyStationId)]), 0)

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
        <Separator />
        <p className="text-sm text-muted-foreground">总利润：{sumProfit}</p>
        <p className="text-sm text-muted-foreground">仓储需求：{sumStock}</p>
        <p className="text-sm text-muted-foreground">单位仓储利润：{Math.floor(sumProfit / sumStock)}</p>
        <Separator />
        <p className="text-sm text-muted-foreground">消耗进货书：{Math.floor(stock / sumStock) - 1}</p>
        <p className="text-sm text-muted-foreground">利润估算：{sumProfit * Math.floor(stock / sumStock)}</p>
        <p className="text-sm text-muted-foreground">单位进货书利润：{Math.floor(sumProfit * Math.floor(stock / sumStock) / (Math.floor(stock / sumStock) - 1))}</p>
      </CardContent>
    </Card>
  )
}