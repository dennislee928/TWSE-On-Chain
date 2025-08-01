// Cloudflare Worker 環境變數類型定義

export interface Env {
  // KV namespace
  TWSE_DATA: KVNamespace;

  // Environment variables
  ENVIRONMENT: string;

  // Secrets
  PRIVATE_KEY?: string; // 私鑰 (用於區塊鏈交易)
  INFURA_API_KEY?: string; // Infura API 金鑰
  IPFS_API_URL?: string; // IPFS API URL (可選)

  // Optional configuration
  BLOCKCHAIN_NETWORK?: string; // 區塊鏈網路 (sepolia, polygonMumbai 等)
  CONTRACT_ADDRESS?: string; // 智能合約地址
}
