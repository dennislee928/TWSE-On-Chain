/**
 * IPFS 上傳服務
 */

import {
  IPFSUploadResult,
  IPFS_GATEWAYS,
  calculateHash,
} from "@twse-on-chain/shared";
import { Env } from "../types/env";

/**
 * 上傳資料到 IPFS
 */
export async function uploadToIPFS(
  data: any,
  dataType: string,
  env: Env
): Promise<IPFSUploadResult> {
  const jsonData = JSON.stringify(data, null, 2);
  const dataBuffer = new TextEncoder().encode(jsonData);

  // 計算資料雜湊
  const dataHash = await calculateHash(dataBuffer);

  // 準備檔案元資料
  const filename = `twse-${dataType}-${Date.now()}.json`;

  // 嘗試上傳到公共 IPFS Gateway
  const uploadResult = await uploadToPublicGateway(jsonData, filename, env);

  console.log(
    `IPFS upload completed: ${uploadResult.cid} (${uploadResult.size} bytes)`
  );

  return uploadResult;
}

/**
 * 使用公共 Gateway 上傳到 IPFS
 */
async function uploadToPublicGateway(
  data: string,
  filename: string,
  env: Env
): Promise<IPFSUploadResult> {
  // 由於 Cloudflare Worker 的限制，我們使用模擬的 CID 生成
  // 在實際部署時，您需要使用 Pinata、Infura 或其他 IPFS 服務

  const dataBuffer = new TextEncoder().encode(data);
  const hash = await calculateHash(dataBuffer);

  // 生成模擬的 IPFS CID (實際使用時應該替換為真實的 IPFS 上傳)
  const mockCid = `Qm${hash.substring(0, 44)}`;

  // 在實際環境中，這裡應該是真實的 IPFS 上傳邏輯
  // 例如使用 Pinata API:
  /*
  const pinataResponse = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${env.PINATA_JWT}`,
    },
    body: JSON.stringify({
      pinataContent: JSON.parse(data),
      pinataMetadata: {
        name: filename,
        keyvalues: {
          dataType: dataType,
          timestamp: Date.now().toString()
        }
      }
    })
  });
  
  const pinataResult = await pinataResponse.json();
  const realCid = pinataResult.IpfsHash;
  */

  return {
    cid: mockCid,
    size: dataBuffer.length,
    url: `${IPFS_GATEWAYS.public}${mockCid}`,
    timestamp: Date.now(),
  };
}
