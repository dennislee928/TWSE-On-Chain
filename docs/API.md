# TWSE On-Chain API 文檔

## 🔗 Cloudflare Worker API

Worker 提供以下 HTTP 端點來查詢和管理 TWSE 資料。

### 基礎 URL

```
https://your-worker.your-subdomain.workers.dev
```

---

## 📊 API 端點

### 1. 取得 API 資訊

獲取 API 的基本資訊和可用端點。

**端點:** `GET /`

**回應範例:**

```json
{
  "name": "TWSE On-Chain Worker",
  "version": "1.0.0",
  "description": "自動抓取台灣證交所資料並上鏈存證",
  "endpoints": {
    "/": "API 資訊",
    "/trigger": "POST - 手動觸發資料抓取",
    "/latest": "GET - 取得最新資料",
    "/history": "GET - 取得歷史資料",
    "/data/:cid": "GET - 根據 CID 取得資料"
  }
}
```

---

### 2. 手動觸發資料抓取

手動觸發一次 TWSE 資料抓取流程。

**端點:** `POST /trigger`

**回應範例:**

```json
{
  "success": true,
  "message": "Data fetch triggered manually",
  "timestamp": "2023-12-01T10:00:00.000Z"
}
```

---

### 3. 取得最新資料

獲取最新的 TWSE 資料記錄。

**端點:** `GET /latest`

**查詢參數:**

- `type` (可選): 資料類型 (`stock_basic`, `stock_day`, `index`, `all`)

**回應範例:**

```json
{
  "stock_basic": {
    "id": "abc123_stock_basic",
    "dataType": "stock_basic",
    "ipfsCid": "QmExample123...",
    "blockchainTx": {
      "hash": "0xabc123...",
      "blockNumber": 18500000,
      "gasUsed": "100000",
      "gasPrice": "20000000000",
      "timestamp": 1701432000000,
      "status": "confirmed"
    },
    "timestamp": 1701432000000,
    "metadata": {
      "dataSize": 15000,
      "fetchDate": "20231201",
      "processingTime": 5000
    }
  }
}
```

---

### 4. 取得歷史資料

獲取歷史 TWSE 資料記錄。

**端點:** `GET /history`

**查詢參數:**

- `type` (可選): 資料類型 (`stock_basic`, `stock_day`, `index`, `all`)
- `limit` (可選): 限制數量 (預設: 10)
- `offset` (可選): 偏移量 (預設: 0)

**回應範例:**

```json
[
  {
    "id": "abc123_stock_basic",
    "dataType": "stock_basic",
    "ipfsCid": "QmExample123...",
    "blockchainTx": {
      "hash": "0xabc123...",
      "blockNumber": 18500000,
      "timestamp": 1701432000000,
      "status": "confirmed"
    },
    "timestamp": 1701432000000,
    "metadata": {
      "dataSize": 15000,
      "fetchDate": "20231201"
    }
  }
]
```

---

### 5. 根據 CID 取得資料

使用 IPFS CID 獲取特定的資料記錄。

**端點:** `GET /data/:cid`

**路徑參數:**

- `cid`: IPFS Content ID

**回應範例:**

```json
{
  "id": "abc123_stock_basic",
  "dataType": "stock_basic",
  "ipfsCid": "QmExample123...",
  "blockchainTx": {
    "hash": "0xabc123...",
    "blockNumber": 18500000,
    "timestamp": 1701432000000,
    "status": "confirmed"
  },
  "timestamp": 1701432000000,
  "metadata": {
    "dataSize": 15000,
    "fetchDate": "20231201"
  }
}
```

---

## 🔐 智能合約 API

### 合約地址

- **Sepolia 測試網:** `0x...` (部署後更新)
- **Polygon Mumbai:** `0x...` (部署後更新)

### 主要函數

#### 1. `anchorData(string ipfsCid, string dataType, bytes32 dataHash)`

將 IPFS CID 錨定到區塊鏈。

**參數:**

- `ipfsCid`: IPFS Content ID
- `dataType`: 資料類型
- `dataHash`: 資料雜湊

**回傳:** `uint256` - 記錄 ID

#### 2. `getRecord(uint256 recordId)`

取得特定記錄。

**參數:**

- `recordId`: 記錄 ID

**回傳:** `DataRecord` - 完整記錄

#### 3. `getLatestRecord(string dataType)`

取得特定類型的最新記錄。

**參數:**

- `dataType`: 資料類型

**回傳:** `DataRecord` - 最新記錄

#### 4. `verifyCid(string ipfsCid)`

驗證 IPFS CID 是否存在。

**參數:**

- `ipfsCid`: IPFS Content ID

**回傳:** `(bool exists, uint256 recordId)` - 是否存在及記錄 ID

---

## 📋 資料結構

### DataAnchor

```typescript
interface DataAnchor {
  id: string; // 資料錨點ID
  dataType: string; // 資料類型
  ipfsCid: string; // IPFS CID
  blockchainTx: {
    // 區塊鏈交易
    hash: string; // 交易雜湊
    blockNumber?: number; // 區塊號碼
    gasUsed?: string; // Gas使用量
    gasPrice?: string; // Gas價格
    timestamp?: number; // 交易時間戳
    status: string; // 交易狀態
  };
  timestamp: number; // 錨定時間戳
  metadata?: {
    // 額外元資料
    dataSize: number; // 資料大小
    fetchDate: string; // 抓取日期
    processingTime?: number; // 處理時間
  };
}
```

### TWSE API 回應格式

```typescript
interface TWSeApiResponse<T> {
  stat: string; // 狀態
  date: string; // 日期
  title: string; // 標題
  fields: string[]; // 欄位名稱
  data: T[]; // 資料陣列
  notes?: string[]; // 備註
}
```

---

## 🛠️ 錯誤處理

### HTTP 狀態碼

- `200`: 成功
- `400`: 請求錯誤
- `404`: 找不到資源
- `500`: 內部伺服器錯誤

### 錯誤回應格式

```json
{
  "error": "錯誤類型",
  "message": "詳細錯誤訊息"
}
```

---

## 📝 使用範例

### JavaScript/TypeScript

```javascript
// 取得最新股票基本資料
async function getLatestStockData() {
  const response = await fetch(
    "https://your-worker.workers.dev/latest?type=stock_basic"
  );
  const data = await response.json();
  return data;
}

// 手動觸發資料抓取
async function triggerDataFetch() {
  const response = await fetch("https://your-worker.workers.dev/trigger", {
    method: "POST",
  });
  const result = await response.json();
  return result;
}

// 根據 CID 取得資料
async function getDataByCid(cid) {
  const response = await fetch(`https://your-worker.workers.dev/data/${cid}`);
  const data = await response.json();
  return data;
}
```

### curl

```bash
# 取得 API 資訊
curl https://your-worker.workers.dev/

# 取得最新資料
curl "https://your-worker.workers.dev/latest?type=stock_basic"

# 手動觸發
curl -X POST https://your-worker.workers.dev/trigger

# 取得歷史資料
curl "https://your-worker.workers.dev/history?type=all&limit=5"
```

---

## 🔄 資料更新頻率

- **自動更新:** 每小時執行一次 (透過 Cron 觸發)
- **手動觸發:** 透過 `/trigger` 端點
- **TWSE API 限制:** 請遵守 TWSE API 的使用條款

---

## 📚 相關連結

- [TWSE OpenAPI 官方文檔](https://openapi.twse.com.tw/)
- [IPFS 文檔](https://docs.ipfs.io/)
- [Cloudflare Workers 文檔](https://developers.cloudflare.com/workers/)
- [Ethers.js 文檔](https://docs.ethers.org/)
