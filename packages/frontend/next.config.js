/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_WORKER_URL:
      process.env.NEXT_PUBLIC_WORKER_URL || "http://localhost:8787",
    NEXT_PUBLIC_IPFS_GATEWAY:
      process.env.NEXT_PUBLIC_IPFS_GATEWAY || "https://ipfs.io/ipfs/",
    NEXT_PUBLIC_BLOCKCHAIN_EXPLORER:
      process.env.NEXT_PUBLIC_BLOCKCHAIN_EXPLORER ||
      "https://sepolia.etherscan.io",
  },
};

module.exports = nextConfig;
