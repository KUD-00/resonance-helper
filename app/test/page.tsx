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
import { allStationDict, getStock } from "@/config/stations";
import { buyToSellGoodsDict, getSellCorresponds, sellToBuyGoodsDict } from "@/config/goods";
import { DataTableDemo } from "@/components/table";
import { calculateProfit } from "@/utils/calculate";

export default async function Index() {
  const buy_datas: BuyDataResponse[] = await (await fetch(`${process.env.BASE_URL}/api/buy`, { cache: 'no-store' })).json();
  const sell_datas: SellDataResponse[] = await (await fetch(`${process.env.BASE_URL}/api/sell`, { cache: 'no-store' })).json();

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
        updated_at: updated_at.length
      })
    })
    station_profit_table[station_id].sort((a, b) => b.per_profit - a.per_profit)
  })

  return (
    <div className="flex-1 w-full md:w-1/2 flex flex-col gap-10 items-center">
      <DataTableDemo profitTable={station_profit_table}></DataTableDemo>
    </div>
  );
}