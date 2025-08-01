"use client";

export function StatsCards() {
  // Placeholder data - in real app, this would come from API
  const stats = [
    {
      title: "總記錄數",
      value: "1,234",
      description: "已上鏈的資料記錄",
      icon: "📊",
      color: "bg-blue-500",
    },
    {
      title: "最新更新",
      value: "2小時前",
      description: "上次資料抓取時間",
      icon: "🕒",
      color: "bg-green-500",
    },
    {
      title: "區塊鏈網路",
      value: "Sepolia",
      description: "使用的測試網路",
      icon: "⛓️",
      color: "bg-purple-500",
    },
    {
      title: "資料類型",
      value: "3",
      description: "支援的資料類型",
      icon: "📈",
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stat.value}
              </p>
              <p className="text-sm text-gray-500 mt-1">{stat.description}</p>
            </div>
            <div
              className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center text-white text-xl`}
            >
              {stat.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
