// IPFS 相關類型定義

export interface IPFSConfig {
  gatewayUrl: string; // IPFS Gateway URL
  apiUrl?: string; // IPFS API URL (如果使用私有節點)
  timeout?: number; // 超時時間 (毫秒)
  retries?: number; // 重試次數
}

export interface IPFSUploadOptions {
  pin?: boolean; // 是否固定檔案
  wrapWithDirectory?: boolean; // 是否包裝在目錄中
  timeout?: number; // 上傳超時時間
}

export interface IPFSFile {
  path: string; // 檔案路徑
  content: string | Uint8Array | ArrayBuffer; // 檔案內容
  mode?: number; // 檔案權限
  mtime?: Date; // 修改時間
}

export interface IPFSAddResult {
  cid: string; // Content ID
  path: string; // 檔案路徑
  size: number; // 檔案大小
  mode?: number; // 檔案權限
  mtime?: { secs: number; nsecs?: number }; // 修改時間
}

export interface IPFSMetadata {
  cid: string; // Content ID
  name: string; // 檔案名稱
  size: number; // 檔案大小
  type: string; // MIME類型
  timestamp: number; // 上傳時間戳
  pinned: boolean; // 是否已固定
}

// 常用的 IPFS Gateway
export const IPFS_GATEWAYS = {
  public: "https://ipfs.io/ipfs/",
  cloudflare: "https://cloudflare-ipfs.com/ipfs/",
  pinata: "https://gateway.pinata.cloud/ipfs/",
  infura: "https://ipfs.infura.io/ipfs/",
  dweb: "https://dweb.link/ipfs/",
} as const;

export type IPFSGateway = keyof typeof IPFS_GATEWAYS;
