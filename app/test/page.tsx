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
  console.log(sellToBuyGoodsDict)

  return (
    <div className="flex-1 w-full md:w-1/2 flex flex-col gap-10 items-center">
      <Table>
        <TableCaption>背景颜色：红色上涨，绿色下降，灰色表示已过期无法参考</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">站点名称</TableHead>
            <TableHead>商品名称</TableHead>
            <TableHead>趋势</TableHead>
            <TableHead>价格</TableHead>
            <TableHead className="text-right">更新时间</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
        </TableBody>
        <TableFooter>
        </TableFooter>
      </Table>
    </div>
  );
}