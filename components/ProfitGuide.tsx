"use client"

import * as React from "react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { filteredStationsDict, getAttatchedToCity, getStationName } from "@/config/stations"
import { calculateBestProfitTable, filterStationProfitTableByPerProfit } from "@/utils/utils"
import { PlusIcon, MinusIcon } from "@radix-ui/react-icons"
import { Button } from "@/components/ui/button"
import { ProfitGuideCard } from "./ProfitGuideCard"
import { calculateTax } from "@/utils/calculate"
 
export function ProfitGuide({stationProfitTable, userInfo, isUserLoggedIn}: {stationProfitTable: StationProfitTable, userInfo: UserInfo, isUserLoggedIn: boolean}) {
  const [selectedStationId, setSelectedStationId] = React.useState("83000014")
  const [baseProfit, setBaseProfit] = React.useState(500)
  const [stock, setStock] = React.useState(600)
  const gap = 100

  const bestProfitTable = calculateBestProfitTable(filterStationProfitTableByPerProfit(stationProfitTable, baseProfit));
  const selectedStationReputation = userInfo.reputations[getAttatchedToCity(selectedStationId)]

  return (
    <div className="flex flex-col items-center justify-center gap-4 m-4">
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
              <p className="text-sm text-gray-500">基准利润(越高需更多进货书)</p>
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
          <div className="flex flex-col md:flex-row justify-center gap-4 m-4">
            <div className="hidden md:block">
              <ProfitGuideCard
                selectedStationId={selectedStationId}
                bestProfitTable={calculateBestProfitTable(filterStationProfitTableByPerProfit(stationProfitTable, baseProfit - gap))}
                baseProfit={baseProfit - gap}
                stock={stock}
                userInfo={userInfo}
              />
            </div>
            <ProfitGuideCard
              selectedStationId={selectedStationId}
              bestProfitTable={bestProfitTable}
              baseProfit={baseProfit}
              stock={stock}
              userInfo={userInfo}
            />
            <div className="hidden md:block">
              <ProfitGuideCard
                selectedStationId={selectedStationId}
                bestProfitTable={calculateBestProfitTable(filterStationProfitTableByPerProfit(stationProfitTable, baseProfit + gap))}
                baseProfit={baseProfit + gap}
                stock={stock}
                userInfo={userInfo}
              />
            </div>
          </div>
        </div>
      }
      {isUserLoggedIn ?
          <p className="text-sm text-gray-500">{getStationName(selectedStationId)}税率{(100 * calculateTax(selectedStationId, selectedStationReputation)).toFixed(1)}%，砍抬价20%，声望等级{selectedStationReputation}可购买数量+{selectedStationReputation * 10}%</p> :
          <p className="text-sm text-gray-500">默认税率10%，砍抬价20%，声望等级10即可购买数量+100%</p>
      }
    </div>
  )
}