/**
 * 排程處理器 - 每小時自動抓取 TWSE 資料
 */

import { Env } from "../types/env";
import { fetchTWSEData } from "../services/twse";
import { uploadToIPFS } from "../services/ipfs";
import { anchorToBlockchain } from "../services/blockchain";
import { storeDataRecord } from "../services/storage";
import {
  DATA_TYPES,
  TWSE_ENDPOINTS,
  generateId,
  formatDateForTWSE,
} from "@twse-on-chain/shared";

export async function handleScheduled(
  controller: ScheduledController,
  env: Env,
  ctx: ExecutionContext
): Promise<void> {
  const startTime = Date.now();
  const taskId = generateId();

  console.log(
    `[${taskId}] Starting scheduled data fetch at ${new Date().toISOString()}`
  );

  try {
    // 1. 抓取多種類型的 TWSE 資料
    const dataFetchPromises = [
      fetchTWSEData(TWSE_ENDPOINTS.STOCK_BASIC, DATA_TYPES.STOCK_BASIC),
      fetchTWSEData(TWSE_ENDPOINTS.STOCK_DAY_ALL, DATA_TYPES.STOCK_DAY),
      fetchTWSEData(TWSE_ENDPOINTS.INDEX_ALL, DATA_TYPES.INDEX),
    ];

    const fetchResults = await Promise.allSettled(dataFetchPromises);

    // 2. 處理每個成功的資料抓取結果
    for (let i = 0; i < fetchResults.length; i++) {
      const result = fetchResults[i];

      if (result.status === "fulfilled" && result.value) {
        const { data, dataType } = result.value;

        try {
          console.log(`[${taskId}] Processing ${dataType} data...`);

          // 3. 上傳到 IPFS
          const ipfsResult = await uploadToIPFS(data, dataType, env);
          console.log(`[${taskId}] IPFS upload successful: ${ipfsResult.cid}`);

          // 4. 上鏈錨定
          const blockchainTx = await anchorToBlockchain(
            ipfsResult.cid,
            dataType,
            env
          );
          console.log(
            `[${taskId}] Blockchain anchor successful: ${blockchainTx.hash}`
          );

          // 5. 儲存記錄到 KV
          const dataRecord = {
            id: taskId + "_" + dataType,
            dataType,
            ipfsCid: ipfsResult.cid,
            blockchainTx,
            timestamp: Date.now(),
            metadata: {
              dataSize: ipfsResult.size,
              fetchDate: formatDateForTWSE(),
              processingTime: Date.now() - startTime,
            },
          };

          await storeDataRecord(dataRecord, env);
          console.log(`[${taskId}] Data record stored for ${dataType}`);
        } catch (error) {
          console.error(`[${taskId}] Error processing ${dataType}:`, error);
          // 繼續處理其他資料類型
        }
      } else {
        console.error(
          `[${taskId}] Data fetch failed for index ${i}:`,
          result.status === "rejected" ? result.reason : "Unknown error"
        );
      }
    }

    const totalTime = Date.now() - startTime;
    console.log(`[${taskId}] Scheduled task completed in ${totalTime}ms`);
  } catch (error) {
    console.error(`[${taskId}] Scheduled task failed:`, error);
    throw error;
  }
}
