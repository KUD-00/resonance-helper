import { ProfitTable } from "@/components/ProfitTable";
import { getTransformedDataDict } from "@/utils/utils";
import { defaultUser } from "@/config/others";
import { calculateStationProfitTable } from "@/utils/calculate";
import { getProfile, isLogin } from "@/app/actions";

export default async function Index() {
  const [sellDataDict, buyDataDict] = await getTransformedDataDict();

  const profile: UserInfo[] = await getProfile();
  const isUserLoggedIn = await isLogin();
  const stationProfitTable = calculateStationProfitTable(buyDataDict, sellDataDict, isUserLoggedIn ? profile[0] : defaultUser as UserInfo);

  // TODO: make profittable and profit card separated
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