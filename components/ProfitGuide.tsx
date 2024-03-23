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
import { PlusIcon, MinusIcon } from "@radix-ui/react-icons"
import { Button } from "@/components/ui/button"
import { ProfitGuideCard } from "./ProfitGuideCard"
import { calculateTax } from "@/utils/calculate"
 
export function ProfitGuide({stationProfitTable, userInfo, isUserLoggedIn}: {stationProfitTable: OptimizedProfitTable, userInfo: UserInfo, isUserLoggedIn: boolean}) {
  const [selectedStationId, setSelectedStationId] = React.useState("83000014")
  const [stock, setStock] = React.useState(600)

  const selectedStationReputation = userInfo.reputations[getAttatchedToCity(selectedStationId)]

  const decreaseStock = React.useCallback(() => {
    setStock((prevStock) => prevStock - 50);
  }, []);

  const increaseStock = React.useCallback(() => {
    setStock((prevStock) => prevStock + 50);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center gap-4 m-4">
      <div className="flex flex-row border p-4 rounded-md items-center justify-center gap-4">
        <div className="flex flex-col items-center gap-4 p-4">
          <p className="text-sm text-gray-500">目的地</p>
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
        <div className="flex flex-col items-center justify-center gap-4 p-4">
          <p className="text-sm text-gray-500">仓储</p>
          <div className="flex items-center justify-center gap-4">
            <Button onClick={decreaseStock} variant="outline" size="icon">
              <MinusIcon className="h-4 w-4" />
            </Button>
            {stock}
            <Button onClick={increaseStock} variant="outline" size="icon">
              <PlusIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      {stationProfitTable[selectedStationId] &&
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="w-full flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 min-[2000px]:grid-cols-5 min-[2400px]:grid-cols-6 justify-center gap-16 m-4">
              {stationProfitTable[selectedStationId].map((profitTable, index) => (
                <ProfitGuideCard
                  key={index}
                  selectedStationId={selectedStationId}
                  profitTable={stationProfitTable[selectedStationId][index]}
                  stock={stock}
                  userInfo={userInfo}
                />
              ))}
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