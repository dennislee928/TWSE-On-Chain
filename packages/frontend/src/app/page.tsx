"use client";

import { useState } from "react";
import { DataOverview } from "@/components/DataOverview";
import { LatestData } from "@/components/LatestData";
import { DataHistory } from "@/components/DataHistory";
import { StatsCards } from "@/components/StatsCards";
import { ManualTrigger } from "@/components/ManualTrigger";
import { SearchData } from "@/components/SearchData";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"latest" | "history" | "search">(
    "latest"
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">TWSE On-Chain</h1>
        <p className="text-xl text-gray-600 mb-6">台灣證交所資料上鏈存證系統</p>
        <p className="text-gray-500 max-w-2xl mx-auto">
          自動抓取台灣證交所公開資料並上傳到 IPFS，透過測試鏈記錄 hash
          進行不可篡改的資料存證。 提供即時查詢、展示原始資料與存證資訊。
        </p>
      </div>

      {/* Stats Cards */}
      <StatsCards />

      {/* Data Overview */}
      <DataOverview />

      {/* Manual Trigger Section */}
      <div className="mb-8">
        <ManualTrigger />
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow-sm mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {[
              { key: "latest", label: "最新資料", icon: "📊" },
              { key: "history", label: "歷史記錄", icon: "📚" },
              { key: "search", label: "搜尋資料", icon: "🔍" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`${
                  activeTab === tab.key
                    ? "border-primary-500 text-primary-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === "latest" && <LatestData />}
          {activeTab === "history" && <DataHistory />}
          {activeTab === "search" && <SearchData />}
        </div>
      </div>
    </div>
  );
}
