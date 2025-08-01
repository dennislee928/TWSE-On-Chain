"use client";

export function DataOverview() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-8 border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">系統概覽</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-3">資料流程</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold text-sm">1</span>
              </div>
              <p className="text-gray-600">自動抓取 TWSE API 資料</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-semibold text-sm">2</span>
              </div>
              <p className="text-gray-600">上傳到 IPFS 生成 CID</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 font-semibold text-sm">3</span>
              </div>
              <p className="text-gray-600">錨定到區塊鏈存證</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-3">系統狀態</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Worker 狀態</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                運行中
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">IPFS 連接</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                正常
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">區塊鏈連接</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                正常
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
