// 專案常數定義

// TWSE API 基礎URL
export const TWSE_API_BASE = "https://openapi.twse.com.tw/v1";

// 支援的 TWSE API 端點
export const TWSE_ENDPOINTS = {
  // 上市股票基本資料
  STOCK_BASIC: "/exchangeReport/BWIBBU_d",

  // 所有上市股票日成交資訊
  STOCK_DAY_ALL: "/exchangeReport/STOCK_DAY_ALL",

  // 大盤統計資訊
  INDEX_MAIN: "/exchangeReport/MI_INDEX",

  // 所有指數資訊
  INDEX_ALL: "/exchangeReport/MI_INDEX_ALL",

  // 上市公司財務報表
  FINANCIAL: "/exchangeReport/FMTQIK",
} as const;

// 資料類型
export const DATA_TYPES = {
  STOCK_BASIC: "stock_basic",
  STOCK_DAY: "stock_day",
  INDEX: "index",
  FINANCIAL: "financial",
} as const;

// Cron 排程設定 (每小時執行)
export const CRON_SCHEDULE = "0 * * * *";

// IPFS 設定
export const IPFS_CONFIG = {
  DEFAULT_GATEWAY: "https://ipfs.io/ipfs/",
  DEFAULT_TIMEOUT: 30000, // 30秒
  DEFAULT_RETRIES: 3,
  PIN_DURATION: 86400 * 30, // 30天
} as const;

// 區塊鏈設定
export const BLOCKCHAIN_CONFIG = {
  DEFAULT_GAS_LIMIT: "100000",
  DEFAULT_GAS_PRICE: "20000000000", // 20 gwei
  CONFIRMATION_BLOCKS: 1, // 測試網只需要1個確認
  TRANSACTION_TIMEOUT: 300000, // 5分鐘
} as const;

// 錯誤代碼
export const ERROR_CODES = {
  TWSE_API_ERROR: "TWSE_API_ERROR",
  IPFS_UPLOAD_ERROR: "IPFS_UPLOAD_ERROR",
  BLOCKCHAIN_ERROR: "BLOCKCHAIN_ERROR",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  NETWORK_ERROR: "NETWORK_ERROR",
} as const;

// HTTP 狀態碼
export const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;
