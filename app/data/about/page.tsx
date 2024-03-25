import * as React from "react"
import Image from "next/image"

export default function Index() {
  return (
    <div className="flex-col flex m-6 w-3/4 md:w-2/3">
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
        如何使用
      </h2>
      <h3 className="mt-10 scroll-m-20 border-b pb-2 text-xl font-semibold tracking-tight transition-colors first:mt-0">
        注册登陆账号
      </h3>
      <p className="leading-7 [&:not(:first-child)]:mt-6">
        推荐注册账号，注册后自动登录。在用户界面可以修改修改贸易等级和城市声望等级，在登陆的状态下，所有的数据都会根据你的设置来计算。
      </p>
      <p className="leading-7 [&:not(:first-child)]:mt-6">
        有几个比较关键的设置，如最大使用进货书数量，最低单位仓储利润等，这些设置会影响推荐的路线。可以想象，如果最大使用进货书数量调整的很高，那么单车利润就会更高。最低单位仓储利润是用来筛除低利润的路线。
      </p>
      <blockquote className="mt-6 border-l-2 pl-6 italic">
        账号的邮箱可以是虚拟的（不需要验证），但要符合邮箱的格式，密码不能太简单
      </blockquote>
      <p className="leading-7 [&:not(:first-child)]:mt-6">
        不想注册登陆也没关系，默认的用户数据设置的并不是1级而是合理的数值，也可以直接使用，但是不会和你游戏中的实际数据完全吻合
      </p>
      <h3 className="mt-10 scroll-m-20 border-b pb-2 text-xl font-semibold tracking-tight transition-colors first:mt-0">
        几个页面的简单介绍
      </h3>
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
