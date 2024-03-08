export const dynamic = 'force-dynamic'

import MakeryProfitTable from "@/components/makery-profit-table";

export default async function Index() {
  const buy_datas: BuyDataResponse[] = await (await fetch(`${process.env.BASE_URL}/api/buy`, { next: { revalidate: 30 } })).json();
  const sell_datas: SellDataResponse[] = await (await fetch(`${process.env.BASE_URL}/api/sell`, { next: { revalidate: 30 }})).json();

  return (
    <MakeryProfitTable buy_datas={buy_datas} sell_datas={sell_datas} />
  );
}