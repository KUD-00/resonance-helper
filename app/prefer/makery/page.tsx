import { getBuyAndSellDataArray } from "@/app/actions";
import MakeryProfitTable from "@/components/MakeryProfitTable";

export default async function Index() {
  const [buyDatas, sellDatas] = await getBuyAndSellDataArray()

  return (
    <div className="flex-1 md:w-1/2 flex flex-col gap-10 items-center">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-3xl">制作利润表</h1>
      <MakeryProfitTable buyArrayDatas={buyDatas} sellArrayDatas={sellDatas} />
    </div>
  );
}