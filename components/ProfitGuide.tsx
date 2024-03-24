"use client"

import * as React from "react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

import { filteredStationsDict, getAttatchedToCity, getStationName } from "@/config/stations"
import { PlusIcon, MinusIcon } from "@radix-ui/react-icons"
import { Button } from "@/components/ui/button"
import { ProfitGuideCard } from "./ProfitGuideCard"
import { calculateTax } from "@/utils/calculate"
 
export function ProfitGuide({stationProfitTable, userInfo, isUserLoggedIn}: {stationProfitTable: OptimizedProfitTable, userInfo: UserInfo, isUserLoggedIn: boolean}) {
  const [selectedStationId, setSelectedStationId] = React.useState("83000014")
  const [stock, setStock] = React.useState(userInfo.default_stock)
  const [maxBook, setMaxBook] = React.useState(userInfo.default_book)
  const [minPerStockProfit, setMinPerStockProfit] = React.useState(userInfo.default_per_stock_profit)

  const selectedStationReputation = userInfo.reputations[getAttatchedToCity(selectedStationId)]

  const decreaseStock = React.useCallback(() => {
    setStock((prevStock) => prevStock - 50);
  }, []);

  const increaseStock = React.useCallback(() => {
    setStock((prevStock) => prevStock + 50);
  }, []);

  const decreaseMaxBook = React.useCallback(() => {
    setMaxBook((prevMaxBook) => prevMaxBook - 2);
  }, []);

  const increaseMaxBook = React.useCallback(() => {
    setMaxBook((prevMaxBook) => prevMaxBook + 2);
  }, []);

  const decreaseMinPerStockProfit = React.useCallback(() => {
    setMinPerStockProfit((prevMinPerStockProfit) => prevMinPerStockProfit - 100);
  }, []);

  const increaseMinPerStockProfit = React.useCallback(() => {
    setMinPerStockProfit((prevMinPerStockProfit) => prevMinPerStockProfit + 100);
  }, []);

  return (
    <div className="w-full flex flex-col items-center justify-center gap-4 m-4">
      <div className="flex flex-col md:flex-row p-4 items-center justify-center gap-4">
        <div className="flex flex-col items-center gap-4 p-4">
          <p className="text-sm text-gray-500">起点</p>
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
        <div className="flex flex-row border rounded-md items-center justify-center drop-shadow min-w-[100px]">
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>设置</AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col md:flex-row">
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
                  <div className="flex flex-col items-center justify-center gap-4 p-4">
                    <p className="text-sm text-gray-500">使用进货书</p>
                    <div className="flex items-center justify-center gap-4">
                      <Button onClick={decreaseMaxBook} variant="outline" size="icon">
                        <MinusIcon className="h-4 w-4" />
                      </Button>
                      {maxBook}
                      <Button onClick={increaseMaxBook} variant="outline" size="icon">
                        <PlusIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-center gap-4 p-4">
                    <p className="text-sm text-gray-500">最小单位仓储利润</p>
                    <div className="flex items-center justify-center gap-4">
                      <Button onClick={decreaseMinPerStockProfit} variant="outline" size="icon">
                        <MinusIcon className="h-4 w-4" />
                      </Button>
                      {minPerStockProfit}
                      <Button onClick={increaseMinPerStockProfit} variant="outline" size="icon">
                        <PlusIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
      {stationProfitTable[selectedStationId] &&
        <div className="w-full flex flex-col items-center justify-center gap-4">
          <div className="w-full flex flex-wrap justify-center gap-8 m-4">
            {stationProfitTable[selectedStationId].map((profitTable, index) => {
              const sumProfit = profitTable.goods.reduce((acc, value) => acc + value.allProfit, 0);
              const sumStock = profitTable.goods.reduce((acc, value) => acc + value.stock, 0);

              if (sumProfit / sumStock < minPerStockProfit || stock / sumStock - 1 > maxBook) return null;

              return (
                <div key={profitTable.totalProfit} className="w-full flex md:w-1/2 lg:w-1/3 xl:w-1/4 2xl:w-1/5 min-[2000px]:w-1/6 min-[2400px]:w-1/7 justify-center">
                  <ProfitGuideCard
                    key={index}
                    selectedStationId={selectedStationId}
                    profitTable={stationProfitTable[selectedStationId][index]}
                    stock={stock}
                    userInfo={userInfo}
                  />
                </div>
              )
            })}
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