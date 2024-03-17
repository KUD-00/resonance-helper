import { ProfitTable } from "@/components/ProfitTable";
import { getBuyAndSellDataArray } from "@/app/actions";
import { calculateStationProfitTable, transformResponseDataArrayToDict} from "@/utils/utils";
import { defaultUser } from "@/config/others";

export default async function Index() {
  const [buyDataArray, sellDataArray] = await getBuyAndSellDataArray();

  const sellDataDict = transformResponseDataArrayToDict(sellDataArray);

  const stationProfitTable: StationProfitTable = calculateStationProfitTable(transformResponseDataArrayToDict(buyDataArray), sellDataDict, defaultUser);

  return (
    <div className="flex-1 w-full md:w-1/2 flex flex-col gap-10 items-center">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-3xl">城市利润表</h1>
      <p className="text-sm text-gray-500">默认税率10%，砍抬价20%</p>
      <ProfitTable profitTable={stationProfitTable}></ProfitTable>
    </div>
  );
}