export const dynamic = 'force-dynamic'

import ProfitTable from "@/components/profit-table";

export default async function Index() {
  const buy_datas: BuyDataResponse[] = await (await fetch(`${process.env.BASE_URL}/api/buy`, { cache: "no-store" })).json();
  const sell_datas: SellDataResponse[] = await (await fetch(`${process.env.BASE_URL}/api/sell`, { cache: "no-store" })).json();

  return (
    <div className="w-5/6 md:w-1/2">
      <ProfitTable buy_datas={buy_datas} sell_datas={sell_datas} />
    </div>
  );
}