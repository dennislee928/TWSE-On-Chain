# TWSE-On-Chain
即時查詢與展示將台灣證券交易所API資料上鏈（或上傳IPFS/hash）
___
# TWSE Data Fetcher with IPFS and Blockchain Anchoring

自動抓取台灣證交所公開資料並上傳到 IPFS，透過測試鏈或免費公鏈記錄 hash 進行資料存證。前端可即時查詢、展示原始資料與存證資訊。

## 📌 專案目標

- 每 1 小時自動拉取台灣證交所 (TWSE) 公開 API 資料
- 資料存至 IPFS，生成 hash
- hash 上鏈（使用免費區塊鏈或測試鏈）
- 前端網站展示最新資料與歷史紀錄、可視化與hash驗證資訊
- 全程免費運行（利用 Cloudflare Workers + IPFS + 測試鏈）

---

## 🔧 系統架構

### 1. Cloudflare Worker

- 利用 **Scheduled Cron Trigger** 每1小時自動啟動
- 用 `fetch` 擷取 TWSE 資料（JSON）
- 將資料上傳至 IPFS
- 將 IPFS 的 hash 寫入區塊鏈（Polygon Testnet / Sepolia 等）
- 可選：將 hash 同步存在 Cloudflare KV 或 Durable Object 供前端使用

### 2. IPFS 儲存

- 使用 openbare IPFS gateway 傳送資料與取得 CID（如 `ipfs.io`）
- 可支援歷史快照追蹤

### 3. 區塊鏈存證（免費）

- IPFS hash 可存入：
  - Ethereum Sepolia（測試網）
  - Polygon Mumbai / Amoy 測試網
  - Crust Network / Apillon 免費存證服務（視需求調整）

### 4. 前端應用

- 使用 **React / Vue**（建議搭配 Cloudflare Pages 部署）
- 功能包含：
  - 最新資料查詢與展示
  - 顯示原始 JSON 回應
  - 資料存證 hash 串接 IPFS gateway 與鏈上 explorer
  - 歷史快照列表與下載
  - 快速觸發重抓按鈕（選擇性）

---

## ✅ 套件與工具列表

| 功能 | 工具 / 平台 |
|------|-------------|
| 定時任務調度 | Cloudflare Workers Crons |
| 資料抓取 | Cloudflare Workers `fetch()` API |
| IPFS 上傳 | `js-ipfs` / `ipfs-http-client` |
| 區塊鏈上鏈 | `ethers.js` / `web3.js` 接測試鏈 RPC |
| 前端框架 | React / Vue（選擇其一） |
| 部署 | Cloudflare Pages（推薦） |

---

## 🔄 系統運作流程

+------------------------+
| Cloudflare Worker |
| (每小時啟動) |
+----------+-------------+
|
v
TWSE Open API 資料擷取
|
v
JSON 上傳至 IPFS → CID (Hash)
|
v
CID 上鏈 ▶ 記錄交易 hash
|
v
更新 Cloudflare KV / Gateway 可查詢
___

---

## 🖥️ 前端使用方式

1. 查詢最新的 CID（從 KV / Hash合約 / API）
2. 利用 IPFS gateway（如 `https://ipfs.io/ipfs/<CID>`）取得原始資料
3. 渲染成 JSON 檢視 or 視覺化圖表
4. 顯示區塊鏈交易 hash 供驗證用途

---

## 🔍 可能擴充功能

- 每日快照壓縮打包並可下載 CSV
- 將多筆 hash 聚合上鏈提升效率
- 使用 NFT metadata 容納快照資料（進階）
- 整合 L2 公鏈做低費用版本（如 zkSync、Starknet）

---

## 📎 備註

- 若未來上主網或存入完整 JSON 資料，將會產生 Gas 費用，請評估成本。
- 本專案設計目的為「免費開源、自動化、公信級存證」為主，不建議用於金融交易依據。

---
### 1. 上市股票基本資料／公司資訊

    內容如：股票代碼、公司名稱、產業分類、上市日期、股本、經理人名單等。

    適合存證理由：這類資訊屬於公開、變動頻率較低（有更動時才更新），上鏈或IPFS可作歷史快照存證與查驗用途。

    API參考：https://openapi.twse.com.tw/v1/exchangeReport/BWIBBU_d（股票基本資訊）



### 2. 每日上市公司成交資料

    內容如：每日每檔股票成交量、成交價、開收最高最低價。

    適合存證理由：每日快照有「不可篡改」需求者，上鏈後可追溯、驗證完整歷史，不易造假。

    API參考：https://openapi.twse.com.tw/v1/exchangeReport/STOCK_DAY_ALL（所有上市股票的每日成交明細）



### 3. 各項股價指數

    內容如：大盤指數（TAIEX）、產業分類指數、台灣50、中型100等指數。

    適合存證理由：每日指數（例如大盤收盤）本身具全市場公信力，上鏈有助資料一致性驗證。

    API位置：OpenAPI分類下的「指數」相關路徑


### 4. 財務報表資料

    內容如：上市公司季報、年報營收、獲利指標等。

    適合存證理由：這些資料為長期經營與信披基礎，上鏈/IPFS可追溯史料，不易造假，方便第三方驗證。

    API位置：OpenAPI中的「財務報表」節點


### 5. ESG與市場公告資訊（選擇性）

    內容如：公司重大訊息公告、ESG揭露、法說會紀錄。

    適合存證理由：適用於企業社會責任揭露與歷史查證。

    API參考：data.gov.tw 上的ESG相關集成資訊

___

## 📄 License

MIT License

---


