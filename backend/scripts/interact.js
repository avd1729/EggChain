const hre = require("hardhat");

async function main() {
  const [deployer, distributor, retailer, consumer] = await hre.ethers.getSigners();
  const EggChain = await hre.ethers.getContractFactory("EggChain");
  const eggChain = await EggChain.attach("0x5FbDB2315678afecb367f032d93F642f64180aa3");

  // Step 1: Farmer creates an egg
  let tx = await eggChain.connect(deployer).createEgg("Farm A", "Organic egg");
  await tx.wait();
  console.log("Egg created by Farmer");

  // Step 2: Distributor receives the egg
  tx = await eggChain.connect(deployer).updateEgg(1, distributor.address, "Packing Unit");
  await tx.wait();
  console.log("Egg sent to Distributor");

  // Step 3: Retailer receives the egg
  tx = await eggChain.connect(distributor).updateEgg(1, retailer.address, "Retail Store");
  await tx.wait();
  console.log("Egg sent to Retailer");

  // Step 4: Consumer receives the egg
  tx = await eggChain.connect(retailer).updateEgg(1, consumer.address, "Customer Location");
  await tx.wait();
  console.log("Egg received by Consumer");

  // Fetch egg details
  const egg = await eggChain.getEgg(1);
  console.log("Egg Details:");
  console.log({
    id: egg.id.toString(),
    owner: egg.currentOwner,
    location: egg.location,
    state: egg.state,
    metadata: egg.metadata,
    timestamp: new Date(Number(egg.timestamp) * 1000).toLocaleString()
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
