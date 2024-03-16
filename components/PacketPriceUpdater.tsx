"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react"

const FormSchema = z.object({
  packetData: z
    .string()
})

export function PacketPriceUpdater() {
  const [msg, setMsg] = useState("提交")
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setMsg("正在更新...")

    const response = await fetch("/api/all", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data.packetData),
    });

    if (await response.json() == "OK") { //TODO: fix this bug here
      setMsg(`成功更新`)
    } else {
      setMsg(`网络错误或数据库错误`)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>抓包数据批量更新</CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent>
        <Label className="font-normal">
        </Label>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="packetData"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="在这里粘贴你的抓包数据"
                      className="resize-none min-h-60"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    不会收集个人隐私数据,提交数据后半分钟才会刷新服务器缓存
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">{msg}</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
