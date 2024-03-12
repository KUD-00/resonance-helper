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
import { getStationName, filteredStationDict } from "@/config/stations";
import { getBuyGoodName} from "@/config/goods";
import { calculateStationProfitTable, linuxTimeToHoursAgo, transformBuyDataArrayToDict, transformSellDataArrayToDict } from "@/utils/utils";
import React from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const ProfitTable = ({ buyArrayDatas, sellArrayDatas, userInfo }: { buyArrayDatas: BuyDataResponse[], sellArrayDatas: SellDataResponse[], userInfo: UserInfo}) => {

  const sellDataDict = transformSellDataArrayToDict(sellArrayDatas);
  const buyDataDict = transformBuyDataArrayToDict(buyArrayDatas)

  const stationProfitTable: StationProfitTable = calculateStationProfitTable(buyDataDict, sellDataDict, userInfo)

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
            {filteredStationDict.map(([station_id, info]) => (
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
            {filteredStationDict.map(([station_id, info]) => (
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

export default ProfitTable;