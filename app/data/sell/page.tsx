export const dynamic = 'force-dynamic'

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
import { getStationName } from "@/config/stations";
import { buyToSellGoodsDict, sellToBuyGoodsDict } from "@/config/goods";
import { dateTimeStringToHoursAgo } from "@/utils/utils";

export default async function Index() {
  const sellDataArray: SellDataResponse[] = await (await fetch(`${process.env.BASE_URL}/api/sell`, { next: { revalidate: 30 }})).json();

  return (
    <div className="flex-1 w-5/6 md:w-1/2 flex flex-col gap-10 items-center">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>站点名</TableHead>
            <TableHead>商品名</TableHead>
            <TableHead>趋势</TableHead>
            <TableHead>价格</TableHead>
            <TableHead className="text-right">时效</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sellDataArray.map(({station_id, trend, price, updated_at, good_id}, index) => (
            <TableRow key={index}>
              <TableCell>{getStationName(station_id)}</TableCell>
              <TableCell>{
                buyToSellGoodsDict[sellToBuyGoodsDict[good_id]?.[0]]?.name ?? good_id
              }</TableCell>
              <TableCell className={trend === 1 ? 'text-red-500' : trend === -1 ? 'text-green-500' : 'text-gray-500'}>
                {trend === 1 ? '涨' : trend === -1 ? '跌' : '平'}
              </TableCell>
              <TableCell>{price}</TableCell>
              <TableCell className="text-right">{dateTimeStringToHoursAgo(updated_at)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
        </TableFooter>
      </Table>
    </div>
  );
}