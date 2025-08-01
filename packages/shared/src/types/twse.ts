// TWSE API 資料類型定義

export interface TWSeStockBasicInfo {
  Code: string; // 股票代碼
  Name: string; // 公司名稱
  ISIN: string; // ISIN碼
  ListingDate: string; // 上市日期
  MarketType: string; // 市場類別
  IndustryType: string; // 產業類別
  CFICode: string; // CFI代碼
}

export interface TWSeStockDayData {
  Code: string; // 股票代碼
  Name: string; // 證券名稱
  TradeVolume: string; // 成交股數
  TradeValue: string; // 成交金額
  OpeningPrice: string; // 開盤價
  HighestPrice: string; // 最高價
  LowestPrice: string; // 最低價
  ClosingPrice: string; // 收盤價
  Direction: string; // 漲跌(+/-)
  Change: string; // 漲跌價差
  LastBestBidPrice: string; // 最後揭示買價
  LastBestBidVolume: string; // 最後揭示買量
  LastBestAskPrice: string; // 最後揭示賣價
  LastBestAskVolume: string; // 最後揭示賣量
  PriceEarningRatio: string; // 本益比
}

export interface TWSeIndexData {
  Date: string; // 日期
  IndexCode: string; // 指數代碼
  IndexName: string; // 指數名稱
  OpeningIndex: string; // 開盤指數
  HighestIndex: string; // 最高指數
  LowestIndex: string; // 最低指數
  ClosingIndex: string; // 收盤指數
  Direction: string; // 漲跌(+/-)
  Change: string; // 漲跌點數
  ChangePercent: string; // 漲跌百分比
}

export interface TWSeFinancialData {
  CompanyCode: string; // 公司代碼
  CompanyName: string; // 公司名稱
  Year: string; // 年度
  Quarter: string; // 季度
  Revenue: string; // 營收
  GrossProfit: string; // 毛利
  OperatingIncome: string; // 營業利益
  NetIncome: string; // 淨利
  EPS: string; // 每股盈餘
}

// API 回應包裝類型
export interface TWSeApiResponse<T = any> {
  stat: string; // 狀態
  date: string; // 日期
  title: string; // 標題
  fields: string[]; // 欄位名稱
  data: T[]; // 資料陣列
  notes?: string[]; // 備註
}

// 支援的 API 端點類型
export type TWSeApiEndpoint =
  | "BWIBBU_d" // 上市股票基本資料
  | "STOCK_DAY_ALL" // 所有上市股票日成交資訊
  | "MI_INDEX" // 大盤統計資訊
  | "MI_INDEX_ALL" // 所有指數資訊
  | "FMTQIK"; // 上市公司財務報表
