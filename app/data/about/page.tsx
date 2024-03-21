import * as React from "react"
import Image from "next/image"

export default function Index() {
  return (
    <div className="flex-col m-6">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        雷索纳斯数据站
      </h1>
      <p className="leading-7 [&:not(:first-child)]:mt-6">
        列车长，欢迎您！网站旨在提供实时的准确的的商品价格数据及成本计算
      </p>
      <blockquote className="mt-6 border-l-2 pl-6 italic">
        这就是倒爷的快乐啊，你们有没有这样的...
      </blockquote>
      <p className="leading-7 [&:not(:first-child)]:mt-6">
        联系我：qq2570351247
      </p>
      <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
        关于开源
      </h2>
      <p className="leading-7 [&:not(:first-child)]:mt-6">
        本项目除了咸鱼买的账号密码不能公开外，其他都根据gplv3许可证协议公开，如果我没记错的话，这是一个传染性的许可证，还请任何想用本仓库任意代码的开发者注意这一点
      </p>
      <Image src="/zero-fatigue.PNG"
        width={800} height={600} alt={""}
      />
    </div>
  )
}
