import { ethers } from "hardhat";

async function main() {
  console.log("Starting deployment...");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with account:", deployer.address);
  console.log(
    "Account balance:",
    (await deployer.provider.getBalance(deployer.address)).toString()
  );

  // Deploy TWSeDataAnchor contract
  console.log("\nDeploying TWSeDataAnchor contract...");

  const TWSeDataAnchor = await ethers.getContractFactory("TWSeDataAnchor");
  const dataAnchor = await TWSeDataAnchor.deploy(deployer.address);

  await dataAnchor.waitForDeployment();
  const contractAddress = await dataAnchor.getAddress();

  console.log("TWSeDataAnchor deployed to:", contractAddress);

  // Verify deployment
  console.log("\nVerifying deployment...");
  const totalRecords = await dataAnchor.getTotalRecords();
  console.log("Initial total records:", totalRecords.toString());

  const isAuthorized = await dataAnchor.authorizedSubmitters(deployer.address);
  console.log("Deployer is authorized:", isAuthorized);

  console.log("\n=== Deployment Summary ===");
  console.log("Contract Address:", contractAddress);
  console.log("Deployer:", deployer.address);
  console.log("Network:", (await ethers.provider.getNetwork()).name);
  console.log("Chain ID:", (await ethers.provider.getNetwork()).chainId);

  // Save deployment info
  const deploymentInfo = {
    contractAddress,
    deployer: deployer.address,
    network: (await ethers.provider.getNetwork()).name,
    chainId: (await ethers.provider.getNetwork()).chainId.toString(),
    deploymentTime: new Date().toISOString(),
    blockNumber: await ethers.provider.getBlockNumber(),
  };

  console.log("\nDeployment info:", JSON.stringify(deploymentInfo, null, 2));

  return contractAddress;
}

main()
  .then((contractAddress) => {
    console.log("\n✅ Deployment completed successfully!");
    console.log("Contract Address:", contractAddress);
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Deployment failed:");
    console.error(error);
    process.exit(1);
  });
