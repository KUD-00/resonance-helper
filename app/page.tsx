import * as React from "react"
import Image from "next/image"

export default function Index() {
  return (
    <div className="flex-col">
      <div>
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
          推荐您点击上方的推荐栏，查看
        </p>
        <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
          <li>商品制作利润</li>
          <li>各城市利润表</li>
        </ul>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          暂时只有这两个功能，在未来如果可能，会增加更多
        </p>
        <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
          有兴趣参与本站开发？
        </h2>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          联系我：qq2570351247
        </p>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          说实话，我对自己的代码水平没有任何自信，如果您有面对比屎山还不如的代码的觉悟，就请狠狠的鞭策我吧!
        </p>
        <h3 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">
          数据方面
        </h3>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          数据方面，主要有三个地方需要完善
        </p>
        <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
          <li>雷索纳斯购买商品和贩卖商品之间的关系映射表，在config/good.ts里
            <p>从雷索纳斯的抓包数据来看，同一商品在不同地区的贩卖和购买id都不一样，所以需要建立映射表，已经填充了大部分的数据，但仍有漏网之鱼</p>
          </li>
          <li>模拟器自动化更新数据的开发
            <p>已经从咸鱼买了和城市数相符的账号，并且让这些账号在各自的城市待机了</p>
            <p>现在是通过utils/capture.py和mitmdump来抓包并post到本机，但是我电脑性能不能同时开这么多城市数量的模拟器，或许需要考虑使用MaaFramework进行自动化的模拟器内账号切换</p>
          </li>
          <li>
            <p>有一个40级才能去的城市去不了，还有一些制作商品我做不了</p>
          </li>
        </ul>
        <h3 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">
          代码方面
        </h3>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          说实话，做这个项目踩了一堆坑，我怎么也不会想到抓包数据同一个商品的id竟然是不一样的，等到数据结构定义完了前端写好了一看怎么这么多奇怪的id才恍然大悟。
        </p>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          所以本项目的数据结构可能定义的比较烂。事先声明。我全责。
        </p>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          还有就是我其实不太懂Next.js，还请大佬多多鞭策
        </p>
        <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
          关于开源
        </h2>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          本项目除了咸鱼买的账号密码不能公开外，其他都根据gplv3许可证协议公开，如果我没记错的话，这是一个传染性的许可证，还请任何想使用本仓库任意代码的开发者注意这一点
        </p>
        <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
          写在最后
        </h2>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          开发这个站点花费了我三天时间，这三天我雷索纳斯都没怎么登，你见过凌晨三点半疲劳度为0的列车长吗.jpeg
        </p>
        <Image src="/zero-fatigue.PNG"
          width={800} height={600} alt={""}
        />
      </div>
    </div>
  )
}
