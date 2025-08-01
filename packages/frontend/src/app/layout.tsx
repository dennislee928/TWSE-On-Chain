import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TWSE On-Chain | 台灣證交所資料上鏈存證",
  description:
    "自動抓取台灣證交所公開資料並上傳到 IPFS，透過測試鏈或免費公鏈記錄 hash 進行資料存證",
  keywords: ["TWSE", "台灣證交所", "區塊鏈", "IPFS", "資料存證", "股票資料"],
  authors: [{ name: "TWSE On-Chain Team" }],
  openGraph: {
    title: "TWSE On-Chain | 台灣證交所資料上鏈存證",
    description: "即時查詢與展示將台灣證券交易所API資料上鏈存證",
    type: "website",
    locale: "zh_TW",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-TW">
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="pb-20">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
