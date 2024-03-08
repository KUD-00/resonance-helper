import { Inter as FontSans } from "next/font/google"
import { GeistSans } from "geist/font/sans";
import { cn } from "@/utils/utils"
import "./globals.css";
import { Navi } from "@/components/navigation";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Next.js and Supabase Starter Kit",
  description: "The fastest way to build apps with Next.js and Supabase",
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
        <main className="min-h-screen flex flex-col items-center gap-10">
          <Navi />
          {children}
        </main>
      </body>
    </html>
  );
}
