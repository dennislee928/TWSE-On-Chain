// 區塊鏈相關類型定義

export interface BlockchainNetwork {
  name: string; // 網路名稱
  chainId: number; // 鏈ID
  rpcUrl: string; // RPC URL
  explorerUrl: string; // 區塊鏈瀏覽器URL
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  isTestnet: boolean; // 是否為測試網
}

export interface ContractInfo {
  address: string; // 合約地址
  abi: any[]; // 合約ABI
  network: BlockchainNetwork; // 部署的網路
}

export interface IPFSUploadResult {
  cid: string; // IPFS Content ID
  size: number; // 檔案大小
  url: string; // IPFS Gateway URL
  timestamp: number; // 上傳時間戳
}

export interface BlockchainTransaction {
  hash: string; // 交易雜湊
  blockNumber?: number; // 區塊號碼
  gasUsed?: string; // 使用的Gas
  gasPrice?: string; // Gas價格
  timestamp?: number; // 交易時間戳
  status: "pending" | "confirmed" | "failed"; // 交易狀態
}

export interface DataAnchor {
  id: string; // 資料錨點ID
  dataType: string; // 資料類型
  ipfsCid: string; // IPFS CID
  blockchainTx: BlockchainTransaction; // 區塊鏈交易
  timestamp: number; // 錨定時間戳
  metadata?: Record<string, any>; // 額外元資料
}

// 支援的測試網路
export const SUPPORTED_NETWORKS: Record<string, BlockchainNetwork> = {
  sepolia: {
    name: "Ethereum Sepolia",
    chainId: 11155111,
    rpcUrl: "https://sepolia.infura.io/v3/YOUR_INFURA_KEY",
    explorerUrl: "https://sepolia.etherscan.io",
    nativeCurrency: {
      name: "Sepolia Ether",
      symbol: "SEP",
      decimals: 18,
    },
    isTestnet: true,
  },
  polygonMumbai: {
    name: "Polygon Mumbai",
    chainId: 80001,
    rpcUrl: "https://rpc-mumbai.maticvigil.com",
    explorerUrl: "https://mumbai.polygonscan.com",
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18,
    },
    isTestnet: true,
  },
  polygonAmoy: {
    name: "Polygon Amoy",
    chainId: 80002,
    rpcUrl: "https://rpc-amoy.polygon.technology",
    explorerUrl: "https://amoy.polygonscan.com",
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18,
    },
    isTestnet: true,
  },
};
