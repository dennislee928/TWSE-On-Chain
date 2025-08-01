/**
 * TWSE 資料抓取服務
 */

import {
  TWSE_API_BASE,
  //TWSeApiResponse,
  validateTWSEResponse,
  withRetry,
} from "@twse-on-chain/shared";

export interface TWSeDataResult {
  data: any;
  dataType: string;
  timestamp: number;
  source: string;
}

/**
 * 抓取 TWSE API 資料
 */
export async function fetchTWSEData(
  endpoint: string,
  dataType: string
): Promise<TWSeDataResult> {
  const url = `${TWSE_API_BASE}${endpoint}`;

  console.log(`Fetching TWSE data from: ${url}`);

  return withRetry(
    async () => {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "User-Agent": "TWSE-On-Chain/1.0.0",
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const rawData = await response.json();
      const validatedData = validateTWSEResponse(rawData);

      return {
        data: validatedData,
        dataType,
        timestamp: Date.now(),
        source: url,
      };
    },
    3,
    2000
  );
}
