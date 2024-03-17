import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { linuxTimeToHoursAgo, transformResponseDataArrayToDict } from "@/utils/utils";
import { Separator } from "./ui/separator";
import { goodsDict, makeryGoodsDict } from "@/config/goods";

export default function MakeryProfitTable({ buyArrayDatas, sellArrayDatas }: { buyArrayDatas: DataResponse[], sellArrayDatas: DataResponse[] }) {
  const sellDataDict = transformResponseDataArrayToDict(sellArrayDatas);
  const buyDataDict = transformResponseDataArrayToDict(buyArrayDatas)

  const makeryProfitTable: MakeryProfitTable = {}

  const calculateMakeryCost = (recipe: [string, number][], sellDataDict: TransformedResponseData, buyDataDict: TransformedResponseData): number => {
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

  Object.entries(makeryGoodsDict).map(([produceGoodId, { recipe, cost, output }]) => {
    Object.entries(goodsDict[produceGoodId].stations).map(([sellStationId, { buy, sell }]) => {
      if (sell) {
        const sellGood = sellDataDict[produceGoodId][sellStationId]
        const sellTime = new Date(sellGood?.updated_at ?? 1000000000000000).getTime()

        if (!makeryProfitTable[produceGoodId]) {
          makeryProfitTable[produceGoodId] = []
        }

        makeryProfitTable[produceGoodId].push({
          stationId: sellStationId,
          price: sellDataDict[produceGoodId][sellStationId].price ?? 0,
          //        profit: (sellDataDict[sell_good_id]?.price ?? 0) - Math.floor(calculateMakeryCost(recipe, sellDataDict, buyDataDict) / output),
          profit: 0,
          //        profit_ratio: Math.floor(((sellDataDict[sell_good_id]?.price ?? 0) - Math.floor(calculateMakeryCost(recipe, sellDataDict, buyDataDict) / output)) / cost),
          profitRatio: 0,
          updatedAt: sellTime
        })
      }
    })
    makeryProfitTable[produceGoodId].sort((a, b) => b.profit - a.profit)
  })

  return (
    <>
      {Object.entries(makeryProfitTable).map(([produceGoodId, cells]) => {
        return (
          <>
            <p>{(produceGoodId)}</p>
            <Table>
              <TableHeader>
                <TableHead>贩卖地</TableHead>
                <TableHead>贩卖价格</TableHead>
                <TableHead>单体利润</TableHead>
                <TableHead>单位疲劳度利润</TableHead>
                <TableHead className="text-right">更新时间</TableHead>
              </TableHeader>
              <TableBody>
                {cells.map(({ stationId, price, profit, profitRatio, updatedAt }, index) => (
                  <TableRow key={`${index}`}>
                    <TableCell>{goodsDict[stationId].name}</TableCell>
                    <TableCell>{price}</TableCell>
                    <TableCell>{profit}</TableCell>
                    <TableCell>{profitRatio}</TableCell>
                    <TableCell className="text-right">{linuxTimeToHoursAgo(updatedAt)}</TableCell>
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