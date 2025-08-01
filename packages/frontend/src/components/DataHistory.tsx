"use client";

import { useState } from "react";

export function DataHistory() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedType, setSelectedType] = useState<string>("all");

  // Placeholder data - in real app, this would come from API
  const historyData = [
    {
      id: "abc123_stock_basic",
      dataType: "stock_basic",
      ipfsCid: "QmExample123...",
      timestamp: Date.now() - 3600000,
      metadata: { dataSize: 15000 },
    },
    {
      id: "def456_stock_day",
      dataType: "stock_day",
      ipfsCid: "QmExample456...",
      timestamp: Date.now() - 7200000,
      metadata: { dataSize: 25000 },
    },
  ];

  const dataTypes = [
    { key: "all", label: "全部資料" },
    { key: "stock_basic", label: "股票基本資料" },
    { key: "stock_day", label: "日成交資料" },
    { key: "index", label: "指數資料" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
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

        <div className="flex items-center space-x-2">
          <label htmlFor="limit" className="text-sm text-gray-600">
            顯示數量:
          </label>
          <select
            id="limit"
            className="border border-gray-300 rounded-md px-3 py-1 text-sm"
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  時間
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  資料類型
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  IPFS CID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  大小
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {historyData.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(record.timestamp).toLocaleString("zh-TW")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                      {record.dataType}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-mono text-gray-600">
                    <span
                      className="truncate block max-w-xs"
                      title={record.ipfsCid}
                    >
                      {record.ipfsCid}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.metadata.dataSize} bytes
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                    <button className="text-blue-600 hover:text-blue-800">
                      查看
                    </button>
                    <button className="text-green-600 hover:text-green-800">
                      驗證
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              顯示第 <span className="font-medium">1</span> 到{" "}
              <span className="font-medium">10</span> 項， 共{" "}
              <span className="font-medium">100</span> 項
            </div>
            <div className="flex items-center space-x-2">
              <button
                className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50"
                disabled={currentPage === 1}
              >
                上一頁
              </button>
              <button className="px-3 py-1 border border-gray-300 rounded-md text-sm">
                下一頁
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
