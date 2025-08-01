"use client";

import { useState } from "react";
import toast from "react-hot-toast";

export function ManualTrigger() {
  const [isTriggering, setIsTriggering] = useState(false);

  const handleTrigger = async () => {
    setIsTriggering(true);

    try {
      // In real app, this would call the Worker API
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate API call

      toast.success("資料抓取已觸發！將在幾分鐘內完成處理。");
    } catch (error) {
      toast.error("觸發失敗，請稍後再試。");
    } finally {
      setIsTriggering(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">
            手動觸發資料抓取
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            立即執行一次完整的資料抓取流程，包含 TWSE API 抓取、IPFS
            上傳和區塊鏈錨定。
          </p>
        </div>

        <button
          onClick={handleTrigger}
          disabled={isTriggering}
          className={`px-6 py-3 rounded-lg font-medium transition-all ${
            isTriggering
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-primary-600 text-white hover:bg-primary-700 shadow-sm hover:shadow-md"
          }`}
        >
          {isTriggering ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
              <span>處理中...</span>
            </div>
          ) : (
            "立即觸發"
          )}
        </button>
      </div>

      {isTriggering && (
        <div className="mt-4 p-3 bg-blue-50 rounded-md">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
            <span className="text-sm text-blue-800">
              正在處理資料抓取請求...
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
