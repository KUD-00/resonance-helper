"use client"

import * as React from "react"
import Link from "next/link"

import { cn } from "@/utils/utils"
import { Icons } from "@/components/icons"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import Image from "next/image"

const components: { title: string; href: string; description: string }[] = [
  {
    title: "关于本项目",
    href: "/data/about",
    description:
      ""
  },
  {
    title: "API",
    href: "/data/api",
    description:
      ""
  },
  {
    title: "致谢",
    href: "/data/thankyou",
    description:
      ""
  },
]

export function Navi() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>利润表</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[450px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <a
                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                    href="/"
                  >
                    <Image src="/resonance-arrow.png" width={150} height={150} alt="arrow" />
                    <div className="mb-2 mt-4 text-lg font-medium">
                      主页
                    </div>
                    <p className="text-sm leading-tight text-muted-foreground">
                      总览(未完成)
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <ListItem href="/prefer/guide" title="倒货指南">
                简单易懂
              </ListItem>
              <ListItem href="/prefer/profit" title="各城市利润表">
                倒什么详情
              </ListItem>
              <ListItem href="/prefer/makery" title="商品制作利润">
                疲劳值MAX，别搓太多了
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>其他</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[200px] gap-3 p-4 md:w-[300px] md:grid-cols-1 lg:w-[300px] ">
              {components.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href={component.href}
                >
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/user" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              用户
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"
