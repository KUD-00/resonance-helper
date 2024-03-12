import { getBuyAndSellDataArray } from "@/app/actions";
import MakeryProfitTable from "@/components/MakeryProfitTable";

export default async function Index() {
  const [buyDatas, sellDatas] = await getBuyAndSellDataArray()

  return (
    <div className="flex-1 md:w-1/2 flex flex-col gap-10 items-center">
      <MakeryProfitTable buyArrayDatas={buyDatas} sellArrayDatas={sellDatas} />
    </div>
  );
}