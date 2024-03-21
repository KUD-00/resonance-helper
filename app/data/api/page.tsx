export default function Index() {
  return (
    <div className="flex-1 w-full flex flex-col gap-10 items-center">
      <div className="flex-col m-6">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          API使用说明
        </h1>
        <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
          <li>/api/buy</li>
          <li>/api/sell</li>
        </ul>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          支持stationId, goodId, stationName, goodName的筛选。内容为当前所有买卖信息
        </p>
        <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
          <li>/api/profit</li>
          <li>/api/profit/best</li>
        </ul>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          支持stationId的筛选，/api/profit/best还支持一个baseProfit参数。内容难以用三言两语描述
        </p>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          联系我：qq2570351247
        </p>
      </div>
    </div>
  );
}
