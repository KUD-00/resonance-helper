"use client"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getStationName, getStock, stations } from "@/config/stations";
import { getBuyGoodName, getSellCorresponds } from "@/config/goods";
import { calculateProfit } from "@/utils/calculate";
import { linuxTimeToHoursAgo, transformSellDataArrayToDict } from "@/utils/utils";
import React from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function ProfitTable({ buy_datas: buyArrayDatas, sell_datas: sellArrayDatas }: { buy_datas: BuyDataResponse[], sell_datas: SellDataResponse[] }) {
  console.log(buyArrayDatas)

  const sellDataDict = transformSellDataArrayToDict(sellArrayDatas);

  const stationProfitTable: StationProfitTable = {}

  buyArrayDatas.map(({ price, station_id, good_id, updated_at }) => {
    if (getSellCorresponds(good_id))
      getSellCorresponds(good_id).map(({ good_id: sell_good_id, station_id: sell_station_id }) => {
        const sellGood = sellDataDict[sell_good_id]
        const sellTime = new Date(sellGood?.updated_at ?? 1000000000000000)
        const buyTime = new Date(updated_at)
        const per_profit = Math.floor(calculateProfit(price, sellGood?.price ?? 0, 0.1, 0.1, 1))
        if (!stationProfitTable[station_id]) {
          stationProfitTable[station_id] = []
        }
        stationProfitTable[station_id].push({
          good_id,
          target_station_id: sell_station_id,
          buy_price: price,
          sell_price: sellGood?.price ?? 0,
          per_profit: per_profit,
          all_profit: per_profit * getStock(station_id, good_id),
          updated_at: Math.min(sellTime.getTime(), buyTime.getTime())
        })
      })
    if (!stationProfitTable[station_id]) {
      stationProfitTable[station_id] = []
    }
    stationProfitTable[station_id].sort((a, b) => b.per_profit - a.per_profit)
  })

  const handleStationChange = (station_id: string) => {
    setSelectedStationId(station_id);
  };

  const handleTargetStationChange = (station_id: string) => {
    setSelectedTargetStationId(station_id);
  };

  const [selectedStationId, setSelectedStationId] = React.useState("83000014")
  const [selectedTargetStationId, setSelectedTargetStationId] = React.useState("all")
  const [profitTable, setProfitTable] = React.useState(stationProfitTable[selectedStationId])

  React.useEffect(() => {
    if (selectedTargetStationId == "all") {
      setProfitTable(stationProfitTable[selectedStationId] || []);
    } else {
      const filteredData = stationProfitTable[selectedStationId].filter(item => item.target_station_id == selectedTargetStationId);
      setProfitTable(filteredData || []);
    }
  }, [selectedStationId, selectedTargetStationId]);

  return (
    <div className="flex flex-col gap-10">
      <div className="flex gap-20">
        <Select onValueChange={handleStationChange} defaultValue={selectedStationId}>
          <SelectTrigger className="">
            <SelectValue placeholder="起点" />
          </SelectTrigger>
          <SelectContent>
            {stations.map(([station_id, info]) => (
              <SelectItem key={station_id} value={station_id}>
                {info.name.cn}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select onValueChange={handleTargetStationChange} defaultValue={selectedTargetStationId}>
          <SelectTrigger className="">
            <SelectValue placeholder="终点" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem key={"all"} value={"all"}>
              终点
            </SelectItem>
            {stations.map(([station_id, info]) => (
              <SelectItem key={station_id} value={station_id}>
                {info.name.cn}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex-1 w-full flex flex-col gap-10 items-center">
        <Table>
          <TableCaption>红色获利，绿色亏本。税率10%，砍价抬价20%</TableCaption>
          <TableHeader>
            <TableHead>商品</TableHead>
            <TableHead>目的地</TableHead>
            <TableHead>卖价</TableHead>
            <TableHead>利润</TableHead>
            <TableHead className="text-right">时效</TableHead>
          </TableHeader>
          <TableBody>
            {profitTable.map(({ good_id, target_station_id, buy_price, sell_price, per_profit, all_profit, updated_at }, index) => {
              if (target_station_id == selectedStationId) return null
              return (
                <TableRow key={`${index}`} className={per_profit > 0 ? 'bg-red-100' : 'bg-green-100'}>
                  <TableCell>{getBuyGoodName(good_id)}</TableCell>
                  <TableCell>{getStationName(target_station_id)}</TableCell>
                  <TableCell>{sell_price}</TableCell>
                  <TableCell>{per_profit}</TableCell>
                  <TableCell className="text-right">{linuxTimeToHoursAgo(updated_at)}</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table >
      </div>
    </div>
  );
}