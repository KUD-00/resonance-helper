import { ManualPriceUpdater } from "@/components/maunal-price-updater";
import { PacketPriceUpdater } from "@/components/packet-price-updater";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from "@/components/ui/label";

export default function Index() {

  return (
    <div className="flex-1 w-full flex flex-col gap-10 items-center">
      <div className="gap-10 flex flex-col md:flex-row flex-initial">
        <ManualPriceUpdater />
        <PacketPriceUpdater />
      </div>
      <Card className="w-full md:w-[400px]">
        <CardHeader>
          <CardTitle>API 批量更新</CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent>
          <Label className="font-normal">
            向/api/buy /api/sell发送POST请求，请求体JSON定义:
            <pre>
              <code>
                {`const schema = z.object({\n  transactionType: z.enum(['sell', 'buy']),\n  station_id: z.string(),\n  good_id: z.string(),\n  trend: z.enum(['0', '1', '-1']),\n  price: z.string().min(1),\n  updated_at: timestamp(with timezone) \n });`}
              </code>
            </pre>
          </Label>
        </CardContent>
      </Card>
    </div>
  );
}