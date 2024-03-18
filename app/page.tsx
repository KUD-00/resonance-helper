import { calculateBestProfitTable, filterStationProfitTableByPerProfit, getTransformedDataDict } from "@/utils/utils";
import { defaultUser } from "@/config/others";
import { calculateStationProfitTable } from "@/utils/calculate";
import { ProfitGuide } from "@/components/ProfitGuide";

export default async function Index() {
  const [sellDataDict, buyDataDict] = await getTransformedDataDict();

  const stationProfitTable: StationProfitTable = calculateStationProfitTable(buyDataDict, sellDataDict, defaultUser);

  return (
    <div className="flex-1 w-full md:w-1/2 flex flex-col gap-8 items-center">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-3xl">倒货指南</h1>
      <ProfitGuide stationProfitTable={stationProfitTable}></ProfitGuide>
      <p className="text-sm text-gray-500">默认税率10%，砍抬价20%，声望等级10即可购买数量+100%</p>
      <p className="text-sm text-gray-500">请多多调整基准利润，找到合适的贩卖路径</p>
    </div>
  );
}