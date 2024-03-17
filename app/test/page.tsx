import { getBuyAndSellDataArray, getProfile } from "@/app/actions";
import { goodsDict, sellIdToGoodUniqueIdDict, stationGoodsListDict } from "@/config/goods";
import { defaultUser } from "@/config/others";
import { filteredStationsDict, stationsDict } from "@/config/stations";

export default async function Index() {
  const [buyDatas, sellDatas]: DataResponse[][] = await getBuyAndSellDataArray()

  const data = await getProfile()

  return (
    <div className="w-5/6 md:w-1/2">
    </div>
  );
}