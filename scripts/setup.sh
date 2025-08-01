#!/bin/bash

# TWSE On-Chain 專案設置腳本

set -e

echo "🚀 開始設置 TWSE On-Chain 專案..."

# 檢查 Node.js 版本
echo "📋 檢查系統需求..."
if ! command -v node &> /dev/null; then
    echo "❌ 錯誤: 未找到 Node.js，請先安裝 Node.js >= 18.0.0"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ 錯誤: Node.js 版本需要 >= 18.0.0，當前版本: $(node -v)"
    exit 1
fi

echo "✅ Node.js 版本: $(node -v)"

# 檢查 npm 版本
if ! command -v npm &> /dev/null; then
    echo "❌ 錯誤: 未找到 npm"
    exit 1
fi

echo "✅ npm 版本: $(npm -v)"

# 安裝根目錄依賴
echo ""
echo "📦 安裝根目錄依賴..."
npm install

# 建構共享套件
echo ""
echo "🔨 建構共享套件..."
cd packages/shared
npm install
npm run build
cd ../..

# 安裝各套件依賴
echo ""
echo "📦 安裝各套件依賴..."

echo "  - Worker 套件..."
cd packages/worker
npm install
cd ../..

echo "  - Frontend 套件..."
cd packages/frontend
npm install
cd ../..

echo "  - Contracts 套件..."
cd packages/contracts
npm install
cd ../..

# 創建環境變數範例檔案
echo ""
echo "⚙️  創建環境變數範例檔案..."

if [ ! -f ".env.example" ]; then
cat > .env.example << EOL
# Cloudflare Worker 環境變數
PRIVATE_KEY=your_ethereum_private_key_here
INFURA_API_KEY=your_infura_api_key_here
BLOCKCHAIN_NETWORK=sepolia
CONTRACT_ADDRESS=

# IPFS 設置 (可選)
IPFS_API_URL=
PINATA_JWT=

# 前端環境變數
NEXT_PUBLIC_WORKER_URL=http://localhost:8787
NEXT_PUBLIC_IPFS_GATEWAY=https://ipfs.io/ipfs/
NEXT_PUBLIC_BLOCKCHAIN_EXPLORER=https://sepolia.etherscan.io

# 測試網 RPC URLs
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
MUMBAI_RPC_URL=https://rpc-mumbai.maticvigil.com
AMOY_RPC_URL=https://rpc-amoy.polygon.technology

# Etherscan API Keys (用於合約驗證)
ETHERSCAN_API_KEY=
POLYGONSCAN_API_KEY=
EOL
fi

if [ ! -f ".env.local" ]; then
    cp .env.example .env.local
    echo "📝 已創建 .env.local 檔案，請編輯並填入您的配置"
fi

# 創建基本的前端檔案
echo ""
echo "🎨 創建基本前端檔案..."

# 創建 globals.css
mkdir -p packages/frontend/src/app
cat > packages/frontend/src/app/globals.css << EOL
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  font-family: var(--font-inter), -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
EOL

# 創建基本的 postcss.config.js
cat > packages/frontend/postcss.config.js << EOL
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
EOL

# 創建 next-env.d.ts
cat > packages/frontend/next-env.d.ts << EOL
/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/basic-features/typescript for more information.
EOL

echo ""
echo "✅ 專案設置完成！"
echo ""
echo "📋 下一步操作："
echo "1. 編輯 .env.local 檔案，填入必要的配置"
echo "2. 部署智能合約: npm run deploy:contracts"
echo "3. 設置 Cloudflare Worker: npm run deploy:worker"
echo "4. 啟動開發環境: npm run dev"
echo ""
echo "📚 更多詳細說明請參考: docs/SETUP.md"
echo ""
echo "🎉 Happy coding!" 