export default function Index() {
  const curlCommand = `curl -X POST [endpoint] \\
-H "Content-Type: application/json" \\
-d '{\\
  "user_id": 0,\\
  "role_name": "guest",\\
  "level": 35,\\
  "trade_level": 50,\\
  "reputations": {\\
    "83000001": 10,\\
    "83000003": 10,\\
    "83000004": 10,\\
    "83000012": 10,\\
    "83000014": 10,\\
    "83000020": 10,\\
    "83000026": 10,\\
    "83000029": 10,\\
    "83000053": 10\\
  },\\
  "default_book": 5,\\
  "default_per_stock_profit": 600,\\
  "default_stock": 500\\
}'`;

  return (
    <div className="flex-1 w-3/4 md:w-2/3 flex flex-col gap-10 items-center">
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
          需要Post一个UserInfo上来才能用
        </p>
        <pre className="bg-gray-100 rounded p-4 mt-4">
          <code>{curlCommand}</code>
        </pre>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          联系我：qq2570351247
        </p>
      </div>
    </div>
  );
}
