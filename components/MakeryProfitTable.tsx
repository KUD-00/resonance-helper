import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getBuyGoodName, getSellCorresponds, makeryGoodsDict } from "@/config/old-goods";
import { getStationName } from "@/config/old-stations";
import { linuxTimeToHoursAgo, transformBuyDataArrayToDict, transformSellDataArrayToDict } from "@/utils/utils";
import { Separator } from "./ui/separator";

export default function MakeryProfitTable({ buyArrayDatas, sellArrayDatas }: { buyArrayDatas: BuyDataResponse[], sellArrayDatas: SellDataResponse[] }) {
  const sellDataDict = transformSellDataArrayToDict(sellArrayDatas);
  const buyDataDict = transformBuyDataArrayToDict(buyArrayDatas)

  const makeryProfitTable: MakeryProfitTable = {}

  const calculateMakeryCost = (recipe: [string, number][], sellDataDict: TransformedSellDataDict, buyDataDict: TransformedBuyData): number => {
    let totalCost = 0;

    for (const [good_id, amount] of recipe) {
      if (makeryGoodsDict[good_id]) {
        const backtrace = calculateMakeryCost(makeryGoodsDict[good_id].recipe, sellDataDict, buyDataDict);
        totalCost += backtrace / makeryGoodsDict[good_id].output
      } else {
        if (buyDataDict[good_id]) {
          const prices = Object.entries(buyDataDict[good_id]).map(([station_id, data]) => data.price);
          const minPrice = Math.min(...prices);
          totalCost += minPrice * amount;
        } else {
          throw new Error(`商品 ${good_id} 的价格信息不存在`);
        }
      }
    }
    return totalCost;
  }

  Object.entries(makeryGoodsDict).map(([good_id, { recipe, cost, output }]) => {
    getSellCorresponds(good_id).map(({ good_id: sell_good_id, station_id: sell_station_id }) => {
      const sellGood = sellDataDict[sell_good_id]
      const sellTime = new Date(sellGood?.updated_at ?? 1000000000000000).getTime()
      if (!makeryProfitTable[good_id]) {
        makeryProfitTable[good_id] = []
      }
      makeryProfitTable[good_id].push({
        station_id: sell_station_id,
        price: sellDataDict[sell_good_id]?.price ?? 0,
        profit: (sellDataDict[sell_good_id]?.price ?? 0) - Math.floor(calculateMakeryCost(recipe, sellDataDict, buyDataDict) / output),
        profit_ratio: Math.floor(((sellDataDict[sell_good_id]?.price ?? 0) - Math.floor(calculateMakeryCost(recipe, sellDataDict, buyDataDict) / output)) / cost),
        updated_at: sellTime
      })
    })
    makeryProfitTable[good_id].sort((a, b) => b.profit - a.profit)
  })

  return (
    <>
      {Object.entries(makeryProfitTable).map(([good_id, cells]) => {
        return (
          <>
            <p>{getBuyGoodName(good_id)}</p>
            <Table>
              <TableHeader>
                <TableHead>贩卖地</TableHead>
                <TableHead>贩卖价格</TableHead>
                <TableHead>单体利润</TableHead>
                <TableHead>单位疲劳度利润</TableHead>
                <TableHead className="text-right">更新时间</TableHead>
              </TableHeader>
              <TableBody>
                {cells.map(({ station_id, price, profit, profit_ratio, updated_at }, index) => (
                  <TableRow key={`${index}`}>
                    <TableCell>{getStationName(station_id)}</TableCell>
                    <TableCell>{price}</TableCell>
                    <TableCell>{profit}</TableCell>
                    <TableCell>{profit_ratio}</TableCell>
                    <TableCell className="text-right">{linuxTimeToHoursAgo(updated_at)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table >
            <Separator />
          </>
        )
      })}
    </>
  );
}