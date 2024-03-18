import * as React from "react"
import Image from "next/image"

export default function Index() {
  return (
    <div className="flex-col m-6">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        雷索纳斯数据站
      </h1>
      <p className="leading-7 [&:not(:first-child)]:mt-6">
        列车长，欢迎您！这是由某位列车长和他的朋友们搭建的网站，旨在为所有列车长提供比较实时的，可能不准确的的商品价格数据以及成本计算
      </p>
      <blockquote className="mt-6 border-l-2 pl-6 italic">
        这就是倒爷的快乐啊，你们有没有这样的...
      </blockquote>
      <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
        如何使用？
      </h2>
      <p className="leading-7 [&:not(:first-child)]:mt-6">
        点击上方的导航栏查看
      </p>
      <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
        <li>商品制作利润</li>
        <li>各城市利润表</li>
      </ul>
      <p className="leading-7 [&:not(:first-child)]:mt-6">
        暂时只有这两个功能，未来如果可能会增加更多
      </p>
      <p className="leading-7 [&:not(:first-child)]:mt-6">
        联系我：qq2570351247
      </p>
      <h3 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">
        数据方面
      </h3>
      <p className="leading-7 [&:not(:first-child)]:mt-6">
        数据方面，需要完善
      </p>
      <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
        <li>
          <p>有一个40级才能去的城市去不了</p>
        </li>
      </ul>
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
