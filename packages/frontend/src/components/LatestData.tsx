"use client";

import { useState } from "react";

export function LatestData() {
  const [selectedType, setSelectedType] = useState<string>("all");

  // Placeholder data - in real app, this would come from API
  const latestData = {
    stock_basic: {
      id: "abc123_stock_basic",
      dataType: "stock_basic",
      ipfsCid: "QmExample123...",
      timestamp: Date.now(),
      metadata: {
        dataSize: 15000,
        fetchDate: "20231201",
      },
    },
  };

  const dataTypes = [
    { key: "all", label: "全部資料" },
    { key: "stock_basic", label: "股票基本資料" },
    { key: "stock_day", label: "日成交資料" },
    { key: "index", label: "指數資料" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {dataTypes.map((type) => (
          <button
            key={type.key}
            onClick={() => setSelectedType(type.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedType === type.key
                ? "bg-primary-100 text-primary-700 border border-primary-200"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {type.label}
          </button>
        ))}
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">最新資料記錄</h3>

        {Object.entries(latestData).map(([type, data]) => (
          <div
            key={type}
            className="bg-white rounded-lg p-4 border border-gray-200 mb-4"
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900">{type}</h4>
              <span className="text-sm text-gray-500">
                {new Date(data.timestamp).toLocaleString("zh-TW")}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">IPFS CID:</span>
                <p className="font-mono text-gray-900 break-all">
                  {data.ipfsCid}
                </p>
              </div>
              <div>
                <span className="text-gray-600">資料大小:</span>
                <p className="text-gray-900">{data.metadata.dataSize} bytes</p>
              </div>
            </div>

            <div className="mt-3 flex space-x-2">
              <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-sm hover:bg-blue-200 transition-colors">
                查看 IPFS
              </button>
              <button className="px-3 py-1 bg-green-100 text-green-700 rounded-md text-sm hover:bg-green-200 transition-colors">
                區塊鏈驗證
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
