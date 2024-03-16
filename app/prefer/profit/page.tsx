import { DataTableDemo } from "@/components/table";
import { getBuyDataArray, getSellDataArray } from "@/app/actions";
import { calculateStationProfitTable, transformBuyDataArrayToDict } from "@/utils/utils";
import { defaultUser } from "@/config/others";

export default async function Index() {
  const buy_datas: BuyDataResponse[] = await getBuyDataArray();
  const sell_datas: SellDataResponse[] = await getSellDataArray();

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

  const station_profit_table: StationProfitTable = calculateStationProfitTable(transformBuyDataArrayToDict(buy_datas), sell_good, defaultUser);

  return (
    <div className="flex-1 w-full md:w-1/2 flex flex-col gap-10 items-center">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-3xl">城市利润表</h1>
      <DataTableDemo profitTable={station_profit_table}></DataTableDemo>
    </div>
  );
}