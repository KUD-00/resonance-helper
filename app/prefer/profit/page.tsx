export const dynamic = 'force-dynamic'

import { getBuyAndSellDataArray, getBuyDataArray, getSellDataArray } from "@/app/actions";
import ProfitTable from "@/components/profit-table";

export default async function Index() {
  const [buyDatas, sellDatas]: BuyDataResponse[][] = await getBuyAndSellDataArray()

  return (
    <div className="w-5/6 md:w-1/2">
      <ProfitTable buyArrayDatas={buyDatas} sellArrayDatas={sellDatas} />
    </div>
  );
}