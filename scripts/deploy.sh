#!/bin/bash

# TWSE On-Chain 部署腳本

set -e

ENVIRONMENT=${1:-"staging"}

echo "🚀 開始部署 TWSE On-Chain 到 $ENVIRONMENT 環境..."

# 檢查環境變數
if [ ! -f ".env.local" ]; then
    echo "❌ 錯誤: 找不到 .env.local 檔案"
    echo "請先複製 .env.example 到 .env.local 並填入配置"
    exit 1
fi

# 載入環境變數
source .env.local

# 檢查必要的環境變數
if [ -z "$PRIVATE_KEY" ]; then
    echo "❌ 錯誤: 未設置 PRIVATE_KEY"
    exit 1
fi

if [ -z "$INFURA_API_KEY" ]; then
    echo "❌ 錯誤: 未設置 INFURA_API_KEY"
    exit 1
fi

# 建構所有套件
echo ""
echo "🔨 建構所有套件..."
npm run build

# 部署智能合約 (如果尚未部署)
if [ -z "$CONTRACT_ADDRESS" ]; then
    echo ""
    echo "📋 部署智能合約..."
    
    cd packages/contracts
    npx hardhat run scripts/deploy.ts --network $BLOCKCHAIN_NETWORK
    cd ../..
    
    echo "⚠️  請將合約地址添加到 .env.local 中的 CONTRACT_ADDRESS"
    echo "然後重新執行部署腳本"
    exit 0
else
    echo "✅ 智能合約已部署: $CONTRACT_ADDRESS"
fi

# 部署 Cloudflare Worker
echo ""
echo "☁️  部署 Cloudflare Worker..."

cd packages/worker

# 檢查是否已安裝 wrangler
if ! command -v wrangler &> /dev/null; then
    echo "📦 安裝 Wrangler CLI..."
    npm install -g wrangler
fi

# 設置秘密變數
echo "🔐 設置 Worker 秘密變數..."
echo "$PRIVATE_KEY" | wrangler secret put PRIVATE_KEY
echo "$INFURA_API_KEY" | wrangler secret put INFURA_API_KEY

if [ ! -z "$PINATA_JWT" ]; then
    echo "$PINATA_JWT" | wrangler secret put PINATA_JWT
fi

# 部署 Worker
if [ "$ENVIRONMENT" = "production" ]; then
    wrangler deploy --env production
else
    wrangler deploy --env development
fi

cd ../..

# 建構並部署前端
echo ""
echo "🎨 建構前端..."

cd packages/frontend
npm run build
cd ../..

echo ""
echo "✅ 部署完成！"
echo ""
echo "📋 部署摘要："
echo "- 智能合約: $CONTRACT_ADDRESS"
echo "- Cloudflare Worker: 已部署"
echo "- 前端: 已建構 (packages/frontend/out)"
echo ""
echo "📚 後續步驟："
echo "1. 上傳前端到 Cloudflare Pages 或其他托管服務"
echo "2. 設置 Worker 的 Cron 觸發器"
echo "3. 測試整個流程"
echo ""
echo "🎉 專案部署成功！" 