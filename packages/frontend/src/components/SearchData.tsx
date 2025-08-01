"use client";

import { useState } from "react";

export function SearchData() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState<"cid" | "txHash" | "date">(
    "cid"
  );
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    setIsSearching(true);

    try {
      // In real app, this would call the Worker API
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call

      // Mock search results
      setSearchResults([
        {
          id: "search_result_1",
          dataType: "stock_basic",
          ipfsCid: searchType === "cid" ? searchTerm : "QmExample123...",
          timestamp: Date.now() - 3600000,
          blockchainTx: {
            hash: searchType === "txHash" ? searchTerm : "0xabc123...",
            blockNumber: 18500000,
          },
        },
      ]);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">資料搜尋</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              搜尋類型
            </label>
            <div className="flex space-x-4">
              {[
                { key: "cid", label: "IPFS CID" },
                { key: "txHash", label: "交易雜湊" },
                { key: "date", label: "日期" },
              ].map((type) => (
                <label key={type.key} className="flex items-center">
                  <input
                    type="radio"
                    name="searchType"
                    value={type.key}
                    checked={searchType === type.key}
                    onChange={(e) => setSearchType(e.target.value as any)}
                    className="mr-2"
                  />
                  {type.label}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label
              htmlFor="searchTerm"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              搜尋內容
            </label>
            <div className="flex space-x-2">
              <input
                id="searchTerm"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={
                  searchType === "cid"
                    ? "輸入 IPFS CID..."
                    : searchType === "txHash"
                    ? "輸入交易雜湊..."
                    : "輸入日期 (YYYY-MM-DD)..."
                }
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
              <button
                onClick={handleSearch}
                disabled={isSearching || !searchTerm.trim()}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSearching ? "搜尋中..." : "搜尋"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h4 className="text-lg font-medium text-gray-900">搜尋結果</h4>
            <p className="text-sm text-gray-600">
              找到 {searchResults.length} 筆記錄
            </p>
          </div>

          <div className="divide-y divide-gray-200">
            {searchResults.map((result) => (
              <div key={result.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                        {result.dataType}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(result.timestamp).toLocaleString("zh-TW")}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">IPFS CID:</span>
                        <p className="font-mono text-gray-900 break-all">
                          {result.ipfsCid}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600">交易雜湊:</span>
                        <p className="font-mono text-gray-900 break-all">
                          {result.blockchainTx.hash}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="ml-4 flex space-x-2">
                    <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-sm hover:bg-blue-200 transition-colors">
                      查看詳情
                    </button>
                    <button className="px-3 py-1 bg-green-100 text-green-700 rounded-md text-sm hover:bg-green-200 transition-colors">
                      驗證
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {searchResults.length === 0 && searchTerm && !isSearching && (
        <div className="text-center py-8 text-gray-500">
          <p>未找到符合條件的記錄</p>
        </div>
      )}
    </div>
  );
}
