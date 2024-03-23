import { getTransformedDataDict } from "@/utils/utils";
import { defaultUser } from "@/config/others";
import { getStationProfitTable } from "@/utils/calculate";
import { ProfitGuide } from "@/components/ProfitGuide";
import { getProfile, isLogin } from "../../actions";

export default async function Index() {
  const [sellDataDict, buyDataDict] = await getTransformedDataDict();

  const profile: UserInfo[] = await getProfile();
  const isUserLoggedIn = await isLogin();
  const optimizedProfitTables = getStationProfitTable(buyDataDict, sellDataDict, isUserLoggedIn ? profile[0] : defaultUser as UserInfo)

  return (
    <div className="flex-1 w-full md:w-2/3 flex flex-col gap-8 items-center mb-8">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-3xl">倒货指南</h1>
      <ProfitGuide
        stationProfitTable={optimizedProfitTables}
        userInfo={isUserLoggedIn ? profile[0] : defaultUser as UserInfo}
        isUserLoggedIn={isUserLoggedIn}
      />
      <p className="text-sm text-gray-500">多多调整基准利润，找到合适的贩卖路径</p>
    </div>
  );
}