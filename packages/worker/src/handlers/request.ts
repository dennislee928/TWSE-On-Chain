/**
 * HTTP 請求處理器 - 提供 API 端點和手動觸發功能
 */

import { Env } from "../types/env";
import { handleScheduled } from "./scheduled";
import {
  getLatestData,
  getDataHistory,
  getDataByCid,
} from "../services/storage";
import { HTTP_STATUS } from "@twse-on-chain/shared";

export async function handleRequest(
  request: Request,
  env: Env,
  ctx: ExecutionContext
): Promise<Response> {
  const url = new URL(request.url);
  const { pathname, searchParams } = url;

  // CORS headers
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  // Handle CORS preflight requests
  if (request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // API 路由
    switch (pathname) {
      case "/":
        return new Response(
          JSON.stringify({
            name: "TWSE On-Chain Worker",
            version: "1.0.0",
            description: "自動抓取台灣證交所資料並上鏈存證",
            endpoints: {
              "/": "API 資訊",
              "/trigger": "POST - 手動觸發資料抓取",
              "/latest": "GET - 取得最新資料",
              "/history": "GET - 取得歷史資料",
              "/data/:cid": "GET - 根據 CID 取得資料",
            },
          }),
          {
            headers: {
              "Content-Type": "application/json",
              ...corsHeaders,
            },
          }
        );

      case "/trigger":
        if (request.method !== "POST") {
          return new Response("Method not allowed", {
            status: HTTP_STATUS.BAD_REQUEST,
            headers: corsHeaders,
          });
        }

        // 手動觸發資料抓取
        ctx.waitUntil(handleScheduled({} as ScheduledController, env, ctx));

        return new Response(
          JSON.stringify({
            success: true,
            message: "Data fetch triggered manually",
            timestamp: new Date().toISOString(),
          }),
          {
            headers: {
              "Content-Type": "application/json",
              ...corsHeaders,
            },
          }
        );

      case "/latest":
        // 取得最新資料
        const dataType = searchParams.get("type") || "all";
        const latestData = await getLatestData(dataType, env);

        return new Response(JSON.stringify(latestData), {
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        });

      case "/history":
        // 取得歷史資料
        const historyType = searchParams.get("type") || "all";
        const limit = parseInt(searchParams.get("limit") || "10");
        const offset = parseInt(searchParams.get("offset") || "0");

        const historyData = await getDataHistory(
          historyType,
          limit,
          offset,
          env
        );

        return new Response(JSON.stringify(historyData), {
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        });

      default:
        // Check if it's a data CID request (/data/:cid)
        const cidMatch = pathname.match(/^\/data\/(.+)$/);
        if (cidMatch) {
          const cid = cidMatch[1];
          const data = await getDataByCid(cid, env);

          if (!data) {
            return new Response("Data not found", {
              status: HTTP_STATUS.NOT_FOUND,
              headers: corsHeaders,
            });
          }

          return new Response(JSON.stringify(data), {
            headers: {
              "Content-Type": "application/json",
              ...corsHeaders,
            },
          });
        }

        return new Response("Not found", {
          status: HTTP_STATUS.NOT_FOUND,
          headers: corsHeaders,
        });
    }
  } catch (error) {
    console.error("Request handler error:", error);

    return new Response(
      JSON.stringify({
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  }
}
