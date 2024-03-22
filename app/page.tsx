import { getTransformedDataDict } from "@/utils/utils";
import { defaultUser, modifiers } from "@/config/others";
import { calculateStationModifiedSellInfoDict, calculateStationProfitTable, calculateStationSellBasicInfoDict, getProfitTables, getStationTargetProfitTable, optimizeProfitTables, sortProfitTables } from "@/utils/calculate";
import { ProfitGuide } from "@/components/ProfitGuide";
import { getProfile, isLogin } from "./actions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Terminal } from "lucide-react";

export default async function Index() {
  const [sellDataDict, buyDataDict] = await getTransformedDataDict();

  const profile: UserInfo[] = await getProfile();
  const isUserLoggedIn = await isLogin();
  const stationSellBasicInfo = calculateStationSellBasicInfoDict(buyDataDict, sellDataDict, isUserLoggedIn ? profile[0] : defaultUser as UserInfo)
  const modifiedSellBasicInfoDict = calculateStationModifiedSellInfoDict(stationSellBasicInfo);
  const stationProfitTable = calculateStationProfitTable(modifiedSellBasicInfoDict);
  const stationTargetProfitTable = getStationTargetProfitTable(stationProfitTable);
  const profitTables = getProfitTables(stationTargetProfitTable)
  const optimizedProfitTables = optimizeProfitTables(profitTables)

  return (
    <div className="flex-1 w-full md:w-2/3 flex flex-col gap-8 items-center mb-8">
      {modifiers.map((modifier, index) => (
        <Alert key={index} className="w-2/3 md:w-1/2">
          <Terminal className="h-4 w-4" />
          <>
            <AlertTitle>{modifier.messageTitle}</AlertTitle>
            <AlertDescription>{modifier.messageContent}</AlertDescription>
          </>
        </Alert>
      ))}
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