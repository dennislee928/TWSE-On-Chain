// Global type definitions for browser/Node.js APIs

declare global {
  // Cloudflare Workers global
  const crypto: Crypto;

  // Node.js timers
  function setTimeout(
    callback: (...args: any[]) => void,
    ms: number
  ): NodeJS.Timeout;
  function setInterval(
    callback: (...args: any[]) => void,
    ms: number
  ): NodeJS.Timeout;
  function clearTimeout(timeoutId: NodeJS.Timeout): void;
  function clearInterval(intervalId: NodeJS.Timeout): void;
}

export {};
