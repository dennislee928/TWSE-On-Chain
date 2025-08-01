# TWSE On-Chain 專案設置指南

## 📋 系統需求

- Node.js >= 18.0.0
- npm >= 9.0.0
- Git

## 🚀 快速開始

### 1. 複製專案

```bash
git clone https://github.com/your-username/twse-on-chain.git
cd twse-on-chain
```

### 2. 安裝依賴

```bash
# 安裝根目錄依賴
npm install

# 建構共享套件
npm run build:shared

# 安裝所有套件依賴
npm run install:all
```

### 3. 環境變數設置

創建環境變數檔案：

```bash
# 複製範例環境變數
cp .env.example .env.local
```

編輯 `.env.local` 並填入必要的配置：

```bash
# Cloudflare Worker 設置
PRIVATE_KEY=your_ethereum_private_key
INFURA_API_KEY=your_infura_api_key
BLOCKCHAIN_NETWORK=sepolia
CONTRACT_ADDRESS=your_deployed_contract_address

# 前端設置
NEXT_PUBLIC_WORKER_URL=https://your-worker.your-subdomain.workers.dev
NEXT_PUBLIC_IPFS_GATEWAY=https://ipfs.io/ipfs/
NEXT_PUBLIC_BLOCKCHAIN_EXPLORER=https://sepolia.etherscan.io
```

### 4. 部署智能合約

```bash
# 編譯合約
npm run build:contracts

# 部署到 Sepolia 測試網
npm run deploy:contracts -- --network sepolia

# 記錄合約地址並更新環境變數
```

### 5. 設置 Cloudflare Worker

```bash
# 安裝 Wrangler CLI
npm install -g wrangler

# 登入 Cloudflare 帳號
wrangler auth login

# 創建 KV namespace
wrangler kv:namespace create "TWSE_DATA"

# 更新 wrangler.toml 中的 KV namespace ID

# 設置環境變數
wrangler secret put PRIVATE_KEY
wrangler secret put INFURA_API_KEY

# 部署 Worker
npm run deploy:worker
```

### 6. 啟動前端開發

```bash
npm run dev:frontend
```

前端將在 http://localhost:3000 上運行。

## 🏗️ 專案結構

```
twse-on-chain/
├── packages/
│   ├── shared/          # 共享類型和工具
│   ├── worker/          # Cloudflare Worker
│   ├── frontend/        # React 前端應用
│   └── contracts/       # 智能合約
├── docs/               # 專案文檔
├── scripts/            # 建構和部署腳本
└── README.md          # 專案說明
```

## 🔧 開發指令

### 根目錄指令

```bash
# 開發模式 (同時啟動 Worker 和前端)
npm run dev

# 建構所有套件
npm run build

# 執行所有測試
npm run test

# 代碼風格檢查
npm run lint
```

### Worker 指令

```bash
# 開發模式
npm run dev:worker

# 部署到 Cloudflare
npm run deploy:worker

# 查看日誌
cd packages/worker && wrangler tail
```

### 前端指令

```bash
# 開發模式
npm run dev:frontend

# 建構為靜態網站
npm run build:frontend

# 部署到 Cloudflare Pages
npm run deploy:frontend
```

### 合約指令

```bash
# 編譯合約
npm run build:contracts

# 執行測試
npm run test:contracts

# 部署合約
npm run deploy:contracts
```

## 🌐 部署

### Cloudflare Worker 部署

1. 確保已設置所有必要的環境變數
2. 執行 `npm run deploy:worker`
3. 設置 Cron 觸發器 (每小時執行)

### 前端部署 (Cloudflare Pages)

1. 建構前端：`npm run build:frontend`
2. 上傳 `packages/frontend/out` 資料夾到 Cloudflare Pages
3. 或使用 GitHub 整合自動部署

### 智能合約部署

1. 準備測試網 ETH (Sepolia faucet)
2. 設置私鑰和 RPC URL
3. 執行部署腳本
4. 更新 Worker 中的合約地址

## 🧪 測試

### 執行所有測試

```bash
npm test
```

### 個別套件測試

```bash
# Worker 測試
npm run test:worker

# 前端測試
npm run test:frontend

# 合約測試
npm run test:contracts
```

## 🐛 故障排除

### 常見問題

1. **模組找不到錯誤**

   - 確保已執行 `npm install` 安裝依賴
   - 建構共享套件：`npm run build:shared`

2. **Cloudflare Worker 部署失敗**

   - 檢查 `wrangler.toml` 配置
   - 確認已設置所有必要的秘密變數

3. **智能合約部署失敗**

   - 確認私鑰和 RPC URL 正確
   - 檢查測試網 ETH 餘額

4. **前端無法連接 Worker**
   - 確認 `NEXT_PUBLIC_WORKER_URL` 設置正確
   - 檢查 CORS 設置

## 📚 更多資源

- [Cloudflare Workers 文檔](https://developers.cloudflare.com/workers/)
- [Next.js 文檔](https://nextjs.org/docs)
- [Hardhat 文檔](https://hardhat.org/docs)
- [TWSE OpenAPI 文檔](https://openapi.twse.com.tw/)

## 💡 開發提示

1. 使用 `npm run dev` 同時開發 Worker 和前端
2. 經常執行 `npm run build:shared` 更新類型定義
3. 使用 `wrangler tail` 監控 Worker 日誌
4. 在測試網上測試所有功能後再部署到主網
