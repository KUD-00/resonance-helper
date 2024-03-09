import { ManualPriceUpdater } from "@/components/maunal-price-updater";
import { PacketPriceUpdater } from "@/components/packet-price-updater";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from "@/components/ui/label";

export default function Index() {
  return (
    <div className="flex-1 flex flex-col gap-10 items-center">
      <div className="w-5/6">
        <PacketPriceUpdater />
      </div>
      <Card className="w-5/6 sm:w-[400px]">
          <CardHeader>
            <CardTitle>API 批量更新</CardTitle>
            <CardDescription></CardDescription>
          </CardHeader>
          <CardContent>
            <Label className="font-normal">
              向 /api/buy 或 /api/sell 发送 POST 请求
              <p>数据库结构参考</p>
              <pre>
                <code>
                  {`good_id integer,
station_id integer,
updated_at timestamp with time zone
trend smallint,
price smallint
`}
                </code>
              </pre>
              请求体 JSON 是数组，存放所有提交数据
              <p>提交数据后半分钟才会刷新服务器缓存</p>
            </Label>
          </CardContent>
        </Card>
    </div>
  );
}
