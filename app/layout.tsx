import { Inter as FontSans } from "next/font/google"
import { GeistSans } from "geist/font/sans";
import { cn } from "@/utils/utils"
import "./globals.css";
import { Navi } from "@/components/Navigation";
import { Suspense } from "react";
import Image from "next/image";
import { modifiers } from "@/config/others";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

const defaultUrl = process.env.BASE_URL
  ? `https://${process.env.BASE_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "雷索纳斯小助手",
  description: "倒爷早上好",
};

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={GeistSans.className}>
      <body className={cn("bg-background text-foreground font-sans antialiased", fontSans.variable)}>
        <header className="w-full flex justify-center">
          <Navi />
        </header>
        <main className="min-h-screen flex flex-col items-center mt-16">
          <Suspense fallback={
            <Image
              src="/Loading.gif"
              width={300}
              height={300}
              alt=""
            />
          }>
            {modifiers.map((modifier, index) => (
              <Alert key={index} className="w-2/3 md:w-1/3 mb-8">
                <Terminal className="h-4 w-4" />
                <>
                  <AlertTitle>{modifier.messageTitle}</AlertTitle>
                  <AlertDescription>{modifier.messageContent}</AlertDescription>
                </>
              </Alert>
            ))}
            {children}
          </Suspense>
        </main>
      </body>
    </html>
  );
}
