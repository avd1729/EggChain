const hre = require("hardhat");

async function main() {
  const EggChain = await hre.ethers.getContractFactory("EggChain");

  const eggChain = await EggChain.deploy();

  // If you want to wait for the deployment transaction to be mined:
  await eggChain.waitForDeployment();

  console.log("EggChain deployed to:", await eggChain.getAddress());
}

main().catch((error) => {
  console.error("Deployment failed:", error);
  process.exitCode = 1;
});
