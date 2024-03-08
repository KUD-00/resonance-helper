"use client"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter
} from "@/components/ui/table"
import { allStationsDict, getStationName, getStock, stations } from "@/config/stations";
import { buyToSellGoodsDict, getSellCorresponds } from "@/config/goods";
import { calculateProfit } from "@/utils/calculate";
import { timeAgo } from "@/utils/utils";
import React from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function ProfitTable({ buy_datas, sell_datas }: { buy_datas: BuyDataResponse[], sell_datas: SellDataResponse[] }) {

  function transformSellData(sellDataArray: SellDataResponse[]): TransformedSellData {
    return sellDataArray.reduce((acc: TransformedSellData, current) => {
      const { good_id } = current;
      acc[good_id] = current;
      return acc;
    }, {});
  }

  const sell_good = transformSellData(sell_datas);

  const station_profit_table: StationProfitTable = {}

  buy_datas.map(({ price, station_id, good_id, updated_at }) => {
    getSellCorresponds(good_id).map(({ good_id: sell_good_id, station_id: sell_station_id }) => {
      const sellgood = sell_good[sell_good_id]
      const sell_time = new Date(sellgood?.updated_at ?? 1000000000000000)
      const buy_time = new Date(updated_at)
      if (!station_profit_table[station_id]) {
        station_profit_table[station_id] = []
      }
      station_profit_table[station_id].push({
        good_id,
        target_station_id: sell_station_id,
        buy_price: price,
        sell_price: sellgood?.price ?? 0,
        per_profit: Math.floor(calculateProfit(price, sellgood?.price ?? 0, 0.1, 0.1, 1)),
        all_profit: Math.floor(calculateProfit(price, sellgood?.price ?? 0, 0.1, 0.1, 1)) * getStock(station_id, good_id),
        updated_at: Math.min(sell_time.getTime(), buy_time.getTime())
      })
    })
    station_profit_table[station_id].sort((a, b) => b.per_profit - a.per_profit)
  })

  const [selectedStationId, setSelectedStationId] = React.useState("83000014")
  const [selectedTargetStationId, setSelectedTargetStationId] = React.useState("all")
  const [profitTable, setProfitTable] = React.useState(station_profit_table[selectedStationId])


  const handleStationChange = (newValue: string) => {
    setSelectedStationId(newValue);
  };

  const handleTargetStationChange = (newValue: string) => {
    setSelectedTargetStationId(newValue);
  };

  React.useEffect(() => {
    if (selectedTargetStationId == "all") {
      setProfitTable(station_profit_table[selectedStationId] || []);
    } else {
      const filteredData = station_profit_table[selectedStationId].filter(item => item.target_station_id == selectedTargetStationId);
      setProfitTable(filteredData || []);
    }
  }, [selectedStationId, selectedTargetStationId]);

  return (
    <>
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
            <TableCaption>红色获利，绿色亏本，灰色已过期无法参考。税率10%，无砍价抬价</TableCaption>
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
                    <TableCell>{buyToSellGoodsDict[good_id].name}</TableCell>
                    <TableCell>{allStationsDict[target_station_id].name.cn}</TableCell>
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