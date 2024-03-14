import { getBuyAndSellDataArray, getProfile } from "@/app/actions";
import ProfitTable from "@/components/ProfitTable";
import { defaultUser } from "@/config/others";

export default async function Index() {
  const [buyDatas, sellDatas]: BuyDataResponse[][] = await getBuyAndSellDataArray()

  const data = await getProfile()

  return (
    <div className="w-5/6 md:w-1/2">
      {data ? <ProfitTable buyArrayDatas={buyDatas} sellArrayDatas={sellDatas} userInfo={data[0]}/> 
      : <ProfitTable buyArrayDatas={buyDatas} sellArrayDatas={sellDatas} userInfo={defaultUser}/>}
    </div>
  );
}
