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
import { cn } from "@/utils/utils"

export function ProfitGuide({bestProfitTable}: {bestProfitTable: BestProfitTable}) {
  const [selectedStationId, setSelectedStationId] = React.useState("83000014")

  return (
    <div className="flex-col items-center">
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
        <div className="flex items-center justify-center">
          <Card className={cn("w-[380px]")}>
            <CardHeader>
              <CardTitle>{getStationName(selectedStationId)}倒{getStationName(bestProfitTable[selectedStationId].targetStationId)}最好</CardTitle>
              <CardDescription>只考虑单体利润500以上的商品</CardDescription>
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
        </div>
      }
    </div>
  )
}