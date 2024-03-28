import { ProfitTable } from "@/components/ProfitTable";
import { getTransformedDataDict } from "@/utils/utils";
import { defaultUser } from "@/config/others";
import { calculateStationModifiedSellInfoDict, calculateStationProfitTable, calculateStationSellBasicInfoDict } from "@/utils/calculate";
import { getProfile, isLogin } from "@/app/actions";

export default async function Index() {
  const [transformedDataDicts, profile, isUserLoggedIn] = await Promise.all([
    getTransformedDataDict(),
    getProfile(),
    isLogin(),
  ]);

  // 从transformedDataDicts中解构出sellDataDict和buyDataDict
  const [sellDataDict, buyDataDict] = transformedDataDicts;

  const stationSellBasicInfo = calculateStationSellBasicInfoDict(buyDataDict, sellDataDict, isUserLoggedIn ? profile[0] : defaultUser as UserInfo)
  const modifiedSellBasicInfoDict = calculateStationModifiedSellInfoDict(stationSellBasicInfo);
  const stationProfitTable = calculateStationProfitTable(modifiedSellBasicInfoDict);

  return (
    <div className="flex-1 w-full md:w-1/2 flex flex-col gap-10 items-center">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-3xl">城市利润表</h1>
      <ProfitTable
        profitTable={stationProfitTable}
        isUserLoggedIn={isUserLoggedIn}
        userInfo={isUserLoggedIn ? profile[0] : defaultUser as UserInfo}
      ></ProfitTable>
    </div>
  );
}