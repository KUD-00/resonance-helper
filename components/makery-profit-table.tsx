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
import { buyToSellGoodsDict, getBuyGoodName, getSellCorresponds, makeryGoodsDict } from "@/config/goods";
import { allStationsDict, getStationName, stations } from "@/config/stations";
import { timeAgo } from "@/utils/utils";

export default function MakeryProfitTable({ buy_datas, sell_datas }: { buy_datas: BuyDataResponse[], sell_datas: SellDataResponse[] }) {
  interface MakeryProfitCell {
    station_id: string,
    price: number,
    profit: number,
    profit_ratio: number,
    updated_at: number
  }
  
  interface MakeryProfitTable {
    [key: string]: MakeryProfitCell[]
  }

  function transformSellData(sellDataArray: SellDataResponse[]): TransformedSellData {
    return sellDataArray.reduce((acc: TransformedSellData, current) => {
      const { good_id } = current;
      acc[good_id] = current;
      return acc;
    }, {});
  }
  interface TransformedBuyData {
    [key: string]: {
      [key: string]: BuyDataResponse 
    }
  }

  function transformBuyData(buyDataArray: SellDataResponse[]): TransformedBuyData {
    return buyDataArray.reduce((acc: TransformedBuyData, current) => {
      const { good_id, station_id } = current;
      if (!acc[good_id]) {
        acc[good_id] = {};
      }
      acc[good_id][station_id] = current;
      return acc;
    }, {});
  }

  const sell_good = transformSellData(sell_datas);
  const buy_good = transformBuyData(buy_datas)

  const makery_profit_table: MakeryProfitTable = {}

  const calculateMakeryCost = (recipe: [string, number][], sell_good: TransformedSellData, buy_good: TransformedBuyData): number => {
    let totalCost = 0;

    for (const [good_id, amount] of recipe) {
      if (makeryGoodsDict[good_id]) {
        const backtrace = calculateMakeryCost(makeryGoodsDict[good_id].recipe, sell_good, buy_good);
        console.log(backtrace)
        console.log(getBuyGoodName(good_id))
        totalCost += backtrace / makeryGoodsDict[good_id].output
      } else {
        if (buy_good[good_id]) {
          const prices = Object.entries(buy_good[good_id]).map(([station_id, data]) => data.price);
          const minPrice = Math.min(...prices);
          totalCost += minPrice * amount;
          console.log(totalCost)
        } else {
          throw new Error(`商品 ${good_id} 的价格信息不存在`);
        }
      }
    }
    return totalCost;
  }

  Object.entries(makeryGoodsDict).map(([good_id, { recipe, cost, output }]) => {
    getSellCorresponds(good_id).map(({ good_id: sell_good_id, station_id: sell_station_id }) => {
      const sellgood = sell_good[sell_good_id]
      const sell_time = new Date(sellgood?.updated_at ?? 1000000000000000).getTime()
      if (!makery_profit_table[good_id]) {
        makery_profit_table[good_id] = []
      }
      makery_profit_table[good_id].push({
        station_id: sell_station_id,
        price: sell_good[sell_good_id]?.price ?? 0,
        profit: (sell_good[sell_good_id]?.price ?? 0) - Math.floor(calculateMakeryCost(recipe, sell_good, buy_good) / output),
        profit_ratio: Math.floor(((sell_good[sell_good_id]?.price ?? 0) - Math.floor(calculateMakeryCost(recipe, sell_good, buy_good) / output)) / cost),
        updated_at: sell_time
      })
    })
  })

  return (
    <div className="flex-1 w-1/2 flex flex-col gap-10 items-center">
      {Object.entries(makery_profit_table).map(([good_id, cells]) => {
        return (
          <>
            <p>{getBuyGoodName(good_id)}</p>
            <Table>
              <TableCaption>无税率，无砍价抬价</TableCaption>
              <TableHeader>
                <TableHead>贩卖地</TableHead>
                <TableHead>贩卖价格</TableHead>
                <TableHead>单体利润</TableHead>
                <TableHead>单体利润比疲劳度</TableHead>
                <TableHead className="text-right">更新时间</TableHead>
              </TableHeader>
              <TableBody>
                {cells.map(({station_id, price, profit, profit_ratio, updated_at}, index) => (
                  <TableRow key={`${index}`}>
                    <TableCell>{getStationName(station_id)}</TableCell>
                    <TableCell>{price}</TableCell>
                    <TableCell>{profit}</TableCell>
                    <TableCell>{profit_ratio}</TableCell>
                    <TableCell className="text-right">{timeAgo(updated_at)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table >
          </>
        )
      })}
    </div>
  );
}