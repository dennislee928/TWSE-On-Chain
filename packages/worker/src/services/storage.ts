/**
 * 資料儲存服務 (Cloudflare KV)
 */

import { DataAnchor } from "@twse-on-chain/shared";
import { Env } from "../types/env";

/**
 * 儲存資料記錄到 KV
 */
export async function storeDataRecord(
  dataRecord: DataAnchor,
  env: Env
): Promise<void> {
  const key = `record:${dataRecord.id}`;
  const value = JSON.stringify(dataRecord);

  // 儲存個別記錄
  await env.TWSE_DATA.put(key, value);

  // 更新最新資料索引
  await updateLatestIndex(dataRecord, env);

  // 更新歷史列表
  await updateHistoryList(dataRecord, env);

  console.log(`Stored data record: ${key}`);
}

/**
 * 更新最新資料索引
 */
async function updateLatestIndex(
  dataRecord: DataAnchor,
  env: Env
): Promise<void> {
  const latestKey = `latest:${dataRecord.dataType}`;
  const latestAllKey = "latest:all";

  // 更新特定類型的最新資料
  await env.TWSE_DATA.put(latestKey, JSON.stringify(dataRecord));

  // 更新全體最新資料
  const existingAll = await env.TWSE_DATA.get(latestAllKey);
  let allLatest: Record<string, DataAnchor> = {};

  if (existingAll) {
    try {
      allLatest = JSON.parse(existingAll);
    } catch (error) {
      console.warn("Failed to parse existing latest data:", error);
    }
  }

  allLatest[dataRecord.dataType] = dataRecord;
  await env.TWSE_DATA.put(latestAllKey, JSON.stringify(allLatest));
}

/**
 * 更新歷史記錄列表
 */
async function updateHistoryList(
  dataRecord: DataAnchor,
  env: Env
): Promise<void> {
  const historyKey = `history:${dataRecord.dataType}`;
  const historyAllKey = "history:all";

  // 更新特定類型的歷史記錄
  await addToHistoryList(historyKey, dataRecord, env);

  // 更新全體歷史記錄
  await addToHistoryList(historyAllKey, dataRecord, env);
}

/**
 * 新增到歷史記錄列表
 */
async function addToHistoryList(
  key: string,
  dataRecord: DataAnchor,
  env: Env,
  maxItems: number = 100
): Promise<void> {
  const existing = await env.TWSE_DATA.get(key);
  let history: DataAnchor[] = [];

  if (existing) {
    try {
      history = JSON.parse(existing);
    } catch (error) {
      console.warn("Failed to parse existing history:", error);
    }
  }

  // 新增到列表開頭
  history.unshift(dataRecord);

  // 限制列表長度
  if (history.length > maxItems) {
    history = history.slice(0, maxItems);
  }

  await env.TWSE_DATA.put(key, JSON.stringify(history));
}

/**
 * 取得最新資料
 */
export async function getLatestData(
  dataType: string,
  env: Env
): Promise<DataAnchor | DataAnchor[] | null> {
  const key = dataType === "all" ? "latest:all" : `latest:${dataType}`;
  const data = await env.TWSE_DATA.get(key);

  if (!data) {
    return null;
  }

  try {
    return JSON.parse(data);
  } catch (error) {
    console.error("Failed to parse latest data:", error);
    return null;
  }
}

/**
 * 取得歷史資料
 */
export async function getDataHistory(
  dataType: string,
  limit: number = 10,
  offset: number = 0,
  env: Env
): Promise<DataAnchor[]> {
  const key = dataType === "all" ? "history:all" : `history:${dataType}`;
  const data = await env.TWSE_DATA.get(key);

  if (!data) {
    return [];
  }

  try {
    const history: DataAnchor[] = JSON.parse(data);
    return history.slice(offset, offset + limit);
  } catch (error) {
    console.error("Failed to parse history data:", error);
    return [];
  }
}

/**
 * 根據 CID 取得資料
 */
export async function getDataByCid(
  cid: string,
  env: Env
): Promise<DataAnchor | null> {
  // 在歷史記錄中搜尋
  const allHistory = await getDataHistory("all", 1000, 0, env);

  for (const record of allHistory) {
    if (record.ipfsCid === cid) {
      return record;
    }
  }

  return null;
}
