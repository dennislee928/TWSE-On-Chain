// 通用工具函數

import { TWSeApiResponse } from "../types/twse";

/**
 * 格式化日期為 YYYYMMDD 格式
 */
export function formatDateForTWSE(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}${month}${day}`;
}

/**
 * 解析 TWSE 日期字串 (民國年)
 */
export function parseTWSEDate(twseDate: string): Date {
  // TWSE 使用民國年，例如: 11201 表示 112年01月 (2023年01月)
  if (twseDate.length === 5) {
    const year = parseInt(twseDate.substring(0, 3)) + 1911;
    const month = parseInt(twseDate.substring(3, 5));
    return new Date(year, month - 1, 1);
  }

  // 如果是完整日期格式 1120101 (112年01月01日)
  if (twseDate.length === 7) {
    const year = parseInt(twseDate.substring(0, 3)) + 1911;
    const month = parseInt(twseDate.substring(3, 5));
    const day = parseInt(twseDate.substring(5, 7));
    return new Date(year, month - 1, day);
  }

  throw new Error(`Invalid TWSE date format: ${twseDate}`);
}

/**
 * 驗證 TWSE API 回應
 */
export function validateTWSEResponse<T>(response: any): TWSeApiResponse<T> {
  if (!response || typeof response !== "object") {
    throw new Error("Invalid API response: not an object");
  }

  if (!response.stat) {
    throw new Error("Invalid API response: missing stat field");
  }

  if (response.stat !== "OK") {
    throw new Error(`API returned error status: ${response.stat}`);
  }

  if (!Array.isArray(response.data)) {
    throw new Error("Invalid API response: data is not an array");
  }

  return response as TWSeApiResponse<T>;
}

/**
 * 計算檔案雜湊 (SHA-256)
 */
export async function calculateHash(
  data: string | Uint8Array
): Promise<string> {
  const encoder = new TextEncoder();
  const dataBuffer = typeof data === "string" ? encoder.encode(data) : data;

  const hashBuffer = await crypto.subtle.digest("SHA-256", dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * 延遲執行函數
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * 重試機制包裝器
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<T> {
  let lastError: Error;

  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      if (i === maxRetries) {
        break;
      }

      console.warn(
        `Attempt ${i + 1} failed, retrying in ${delayMs}ms...`,
        error
      );
      await delay(delayMs);

      // 指數退避
      delayMs *= 2;
    }
  }

  throw lastError!;
}

/**
 * 驗證以太坊地址格式
 */
export function isValidEthereumAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * 驗證 IPFS CID 格式
 */
export function isValidIPFSCid(cid: string): boolean {
  // 簡單的 CID 格式驗證
  return (
    /^Qm[1-9A-HJ-NP-Za-km-z]{44}$/.test(cid) || // CIDv0
    /^baf[a-z2-7]+$/.test(cid) || // CIDv1 with base32
    /^b[A-Za-z0-9]+$/.test(cid)
  ); // CIDv1 with other bases
}

/**
 * 格式化檔案大小
 */
export function formatFileSize(bytes: number): string {
  const units = ["B", "KB", "MB", "GB"];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`;
}

/**
 * 產生唯一ID
 */
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
