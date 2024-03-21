import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { linuxTimeToMinutesAgo, transformResponseArrayToDict } from "@/utils/utils";
import { Separator } from "./ui/separator";
import { getGoodName, goodsDict, makeryGoodsDict } from "@/config/goods";
import { getStationName } from "@/config/stations";

export default function MakeryProfitTable({ buyArrayDatas, sellArrayDatas }: { buyArrayDatas: DataResponse[], sellArrayDatas: DataResponse[] }) {
  const sellDataDict = transformResponseArrayToDict(sellArrayDatas);
  const buyDataDict = transformResponseArrayToDict(buyArrayDatas)

  const makeryProfitTable: MakeryProfitTable = {}

  const calculateMakeryCost = (recipe: [string, number][], sellDataDict: TransformedResponseData, buyDataDict: TransformedResponseData): number => {
    let totalCost = 0;

    for (const [materialId, amount] of recipe) {
      if (makeryGoodsDict[materialId]) {
        const backtrace = calculateMakeryCost(makeryGoodsDict[materialId].recipe, sellDataDict, buyDataDict);
        totalCost += backtrace / makeryGoodsDict[materialId].output
      } else {
        if (buyDataDict[materialId]) {
          const prices = Object.entries(buyDataDict[materialId]).map(([station_id, data]) => data.price);
          const minPrice = Math.min(...prices);
          totalCost += minPrice * amount;
        } else {
          throw new Error(`商品 ${materialId} 的价格信息不存在`);
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

        if (sellDataDict[produceGoodId][sellStationId]) {
          makeryProfitTable[produceGoodId].push({
            stationId: sellStationId,
            price: sellDataDict[produceGoodId][sellStationId].price,
            profit: (sellDataDict[produceGoodId][sellStationId].price) - Math.floor(calculateMakeryCost(recipe, sellDataDict, buyDataDict) / output),
            profitRatio: Math.floor(((sellDataDict[produceGoodId][sellStationId].price) - Math.floor(calculateMakeryCost(recipe, sellDataDict, buyDataDict) / output)) / cost),
            updatedAt: sellTime
          })
        }
      }
    })
    makeryProfitTable[produceGoodId].sort((a, b) => b.profit - a.profit)
  })

  return (
    <>
      {Object.entries(makeryProfitTable).map(([produceGoodId, cells]) => {
        return (
          <>
            <p>{getGoodName(produceGoodId)}</p>
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
                    <TableCell>{getStationName(stationId)}</TableCell>
                    <TableCell>{price}</TableCell>
                    <TableCell>{profit}</TableCell>
                    <TableCell>{profitRatio}</TableCell>
                    <TableCell className="text-right">{linuxTimeToMinutesAgo(updatedAt)}</TableCell>
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