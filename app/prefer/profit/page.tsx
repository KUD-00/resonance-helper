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
import { allStationsDict, getStationName, getStock } from "@/config/stations";
import { buyToSellGoodsDict, getSellCorresponds } from "@/config/goods";
import { calculateProfit } from "@/utils/calculate";
import { timeAgo } from "@/utils/utils";

export default async function Index() {
  const buy_datas: BuyDataResponse[] = await (await fetch(`${process.env.BASE_URL}/api/buy`, { cache: 'no-store' })).json();
  const sell_datas: SellDataResponse[] = await (await fetch(`${process.env.BASE_URL}/api/sell`, { cache: 'no-store' })).json();

  interface StationProfitTable {
    [station_id: string]: ProfitTableCell[]
  }

  interface ProfitTableCell {
    good_id: string;
    target_station_id: string;
    buy_price: number;
    sell_price: number;
    per_profit: number;
    all_profit: number;
    updated_at: string;
  }

  type TransformedSellData = {
    [goodId: string]: SellDataResponse;
  };

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
      console.log(good_id, sell_good_id, station_id, sell_station_id)
      const sellgood = sell_good[sell_good_id]
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
        updated_at
      })
    })
    station_profit_table[station_id].sort((a, b) => b.per_profit - a.per_profit)
  })


  return (
    <div className="flex-1 w-full md:w-1/2 flex flex-col gap-10 items-center">
      {Object.entries(station_profit_table).map(([station_id, cells], index) => {
        return (
          <>
            <p>
              {getStationName(station_id)}
            </p>
            <Table key={index}>
              <TableCaption>红色获利，绿色亏本，灰色已过期无法参考。税率10%，无砍价抬价</TableCaption>
              <TableHeader>
                <TableHead>商品</TableHead>
                <TableHead>目的地</TableHead>
                <TableHead>贩卖价格</TableHead>
                <TableHead>单体利润</TableHead>
                <TableHead>总体利润</TableHead>
                <TableHead className="text-right">更新时间</TableHead>
              </TableHeader>
              <TableBody>
                {cells.map(({ good_id, target_station_id, buy_price, sell_price, per_profit, all_profit, updated_at }) => {
                  if (target_station_id == station_id) return null
                  return (
                    <TableRow key={`${index}`} className={per_profit > 0 ? 'bg-red-100' : per_profit < 0 ? 'bg-green-100' : 'bg-gray-100'}>
                      <TableCell>{buyToSellGoodsDict[good_id].name}</TableCell>
                      <TableCell>{allStationsDict[target_station_id].name.cn}</TableCell>
                      <TableCell>{sell_price}</TableCell>
                      <TableCell>{per_profit}</TableCell>
                      <TableCell>{all_profit}</TableCell>
                      <TableCell className="text-right">{timeAgo(updated_at)}</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table >
          </>
        )
      })}
    </div>
  );
}