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
import { timeAgo, transformSellDataArrayToDict } from "@/utils/utils";
import React from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function ProfitTable({ buy_datas: buyArrayDatas, sell_datas: sellArrayDatas }: { buy_datas: BuyDataResponse[], sell_datas: SellDataResponse[] }) {

  const sellDataDict = transformSellDataArrayToDict(sellArrayDatas);

  const stationProfitTable: StationProfitTable = {}

  console.log(buyArrayDatas)
  buyArrayDatas.map(({ price, station_id, good_id, updated_at }) => {
    getSellCorresponds(good_id).map(({ good_id: sell_good_id, station_id: sell_station_id }) => {
      const sellGood = sellDataDict[sell_good_id]
      const sellTime = new Date(sellGood?.updated_at ?? 1000000000000000)
      const buyTime = new Date(updated_at)
      if (!stationProfitTable[station_id]) {
        stationProfitTable[station_id] = []
      }
      console.log(updated_at)
      console.log(sellGood?.updated_at)
      stationProfitTable[station_id].push({
        good_id,
        target_station_id: sell_station_id,
        buy_price: price,
        sell_price: sellGood?.price ?? 0,
        per_profit: Math.floor(calculateProfit(price, sellGood?.price ?? 0, 0.1, 0.1, 1)),
        all_profit: Math.floor(calculateProfit(price, sellGood?.price ?? 0, 0.1, 0.1, 1)) * getStock(station_id, good_id),
        updated_at: Math.min(sellTime.getTime(), buyTime.getTime())
      })
    })
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
    <>
      <p className="mb-8">如果提交数据后发现此处没有更新，请多刷新几次使服务器抛弃缓存，按道理来说是半分钟一次刷新缓存</p>
      <div className="md:w-1/2 flex gap-20">
        <Select onValueChange={handleStationChange} defaultValue={selectedStationId}>
          <SelectTrigger className="">
            <SelectValue placeholder="选择起点" />
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
            <SelectValue placeholder="选择终点" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem key={"all"} value={"all"}>
              选择终点
            </SelectItem>
            {stations.map(([station_id, info]) => (
              <SelectItem key={station_id} value={station_id}>
                {info.name.cn}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex-1 w-full md:w-1/2 flex flex-col gap-10 items-center">
        <Table>
          <TableCaption>红色获利，绿色亏本。税率10%，无砍价抬价</TableCaption>
          <TableHeader>
            <TableHead>商品</TableHead>
            <TableHead>目的地</TableHead>
            <TableHead>贩卖价格</TableHead>
            <TableHead>单体利润</TableHead>
            <TableHead className="text-right">更新时间</TableHead>
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
                  <TableCell className="text-right">{timeAgo(updated_at)}</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table >
      </div>
    </>
  );
}