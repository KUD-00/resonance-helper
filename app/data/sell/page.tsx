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
import { allStationsDict } from "@/config/stations";
import { buyToSellGoodsDict, sellToBuyGoodsDict } from "@/config/goods";

export default async function Index() {
  const response = await fetch(`${process.env.BASE_URL}/api/sell`, { cache: 'no-store' });
  const sell_data: SellDataResponse[] = await response.json();

  return (
    <div className="flex-1 w-full md:w-1/2 flex flex-col gap-10 items-center">
      <Table>
        <TableCaption>背景颜色：红色上涨，绿色下降，灰色表示已过期无法参考</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>站点名称</TableHead>
            <TableHead>商品名称</TableHead>
            <TableHead>趋势</TableHead>
            <TableHead>价格</TableHead>
            <TableHead className="text-right">更新时间</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sell_data.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{allStationsDict[item.station_id].name.cn}</TableCell>
              <TableCell>{
                buyToSellGoodsDict[sellToBuyGoodsDict[item.good_id]?.[0]]?.name ?? item.good_id
              }</TableCell>
              <TableCell className={item.trend === 1 ? 'text-red-500' : item.trend === -1 ? 'text-green-500' : 'text-gray-500'}>
                {item.trend === 1 ? '上涨' : item.trend === -1 ? '下降' : '稳定'}
              </TableCell>
              <TableCell>{item.price}</TableCell>
              <TableCell className="text-right">{new Date(item.updated_at).toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
        </TableFooter>
      </Table>
    </div>
  );
}