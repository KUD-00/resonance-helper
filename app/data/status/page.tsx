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
import { getSellDataArray } from "@/app/actions";

export default async function Index() {
  const sellDataArray: SellDataResponse[] = await getSellDataArray()

  return (
    <div className="flex-1 w-5/6 md:w-1/2 flex flex-col gap-10 items-center">
      <h1>缺少的商品情报</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>商品名</TableHead>
            <TableHead>地点</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.entries(buyToSellGoodsDict).map(([good_id, {name, sell_correspond}], index) => {
            return sell_correspond.map(correspond => {
              if (correspond.good_id == "") {
                return (
                  <TableRow key={index}>
                    <TableCell>{name}</TableCell>
                    <TableCell>{getStationName(correspond.station_id)}</TableCell>
                  </TableRow>
                );
              }
              return null;
            });
          })}
        </TableBody>
        <TableFooter>
        </TableFooter>
      </Table>
    </div>
  );
}
