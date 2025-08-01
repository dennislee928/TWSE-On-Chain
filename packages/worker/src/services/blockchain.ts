/**
 * 區塊鏈錨定服務
 */

import {
  BlockchainTransaction,
  SUPPORTED_NETWORKS,
  BLOCKCHAIN_CONFIG,
} from "@twse-on-chain/shared";
import { Env } from "../types/env";

/**
 * 將 IPFS CID 錨定到區塊鏈
 */
export async function anchorToBlockchain(
  ipfsCid: string,
  dataType: string,
  env: Env
): Promise<BlockchainTransaction> {
  const networkName = env.BLOCKCHAIN_NETWORK || "sepolia";
  const network = SUPPORTED_NETWORKS[networkName];

  if (!network) {
    throw new Error(`Unsupported network: ${networkName}`);
  }

  console.log(`Anchoring to ${network.name}: ${ipfsCid}`);

  // 在實際環境中，這裡應該是真實的區塊鏈交易
  // 由於 Cloudflare Worker 的限制，我們生成模擬交易

  try {
    // 實際的區塊鏈交易邏輯應該在這裡
    // 例如使用 ethers.js:
    /*
    const provider = new ethers.JsonRpcProvider(network.rpcUrl);
    const wallet = new ethers.Wallet(env.PRIVATE_KEY!, provider);
    
    const contract = new ethers.Contract(
      env.CONTRACT_ADDRESS!,
      contractABI,
      wallet
    );
    
    const tx = await contract.storeDataHash(ipfsCid, dataType, {
      gasLimit: BLOCKCHAIN_CONFIG.DEFAULT_GAS_LIMIT,
      gasPrice: BLOCKCHAIN_CONFIG.DEFAULT_GAS_PRICE
    });
    
    const receipt = await tx.wait(BLOCKCHAIN_CONFIG.CONFIRMATION_BLOCKS);
    */

    // 模擬交易 (實際部署時請替換)
    const mockTxHash = await generateMockTransaction(ipfsCid, dataType);

    return {
      hash: mockTxHash,
      blockNumber: Math.floor(Math.random() * 1000000) + 18000000,
      gasUsed: BLOCKCHAIN_CONFIG.DEFAULT_GAS_LIMIT,
      gasPrice: BLOCKCHAIN_CONFIG.DEFAULT_GAS_PRICE,
      timestamp: Date.now(),
      status: "confirmed",
    };
  } catch (error) {
    console.error("Blockchain anchoring failed:", error);
    throw new Error(`Failed to anchor to blockchain: ${error}`);
  }
}

/**
 * 生成模擬交易雜湊 (僅用於開發測試)
 */
async function generateMockTransaction(
  ipfsCid: string,
  dataType: string
): Promise<string> {
  const data = `${ipfsCid}-${dataType}-${Date.now()}`;
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);

  const hashBuffer = await crypto.subtle.digest("SHA-256", dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return `0x${hashHex}`;
}
