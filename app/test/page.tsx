import { getBuyAndSellDataArray, getProfile } from "@/app/actions";
import ProfitTable from "@/components/ProfitTable";
import { goodsDict } from "@/config/goods";
import { defaultUser } from "@/config/others";
import { stationsDict } from "@/config/station";

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