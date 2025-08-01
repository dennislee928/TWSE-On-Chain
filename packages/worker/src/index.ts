/**
 * TWSE On-Chain Cloudflare Worker
 *
 * 自動抓取台灣證交所資料並上傳到 IPFS，記錄到區塊鏈
 */

import { handleScheduled } from "./handlers/scheduled";
import { handleRequest } from "./handlers/request";
import { Env } from "./types/env";

export default {
  /**
   * Scheduled event handler - 每小時執行資料抓取
   */
  async scheduled(
    controller: ScheduledController,
    env: Env,
    ctx: ExecutionContext
  ): Promise<void> {
    console.log("Scheduled event triggered:", new Date().toISOString());
    ctx.waitUntil(handleScheduled(controller, env, ctx));
  },

  /**
   * HTTP request handler - 手動觸發或 API 查詢
   */
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    return handleRequest(request, env, ctx);
  },
};
