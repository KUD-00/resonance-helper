import { ManualPriceUpdater } from "@/components/maunal-price-updater";
import { PacketPriceUpdater } from "@/components/packet-price-updater";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from "@/components/ui/label";

export default function Index() {
  return (
    <div className="flex-1 flex flex-col gap-10 items-center">
      <div className="w-5/6 sm:w-[400px]">
        <PacketPriceUpdater />
      </div>
      <Card className="w-5/6 sm:w-[400px]">
        <CardHeader>
          <CardTitle>API 批量更新</CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
            向 /api/all 发送POST请求，请求体为游戏中进入某城市商店时特定的抓包数据，具体请参考/api/all的实现
        </p>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
            更加自动化的抓包数据获取与POST：参考MaaFramework + 安卓模拟器 + mitmdump + utils/capture.py
        </p>
        </CardContent>
      </Card>
    </div>
  );
}
