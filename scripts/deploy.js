import hre from "hardhat";
import { ethers } from "hardhat";
import fs from "fs";

async function main() {
  console.log("Deploying Raffle contract...");

  // Entry fee: 0.01 ETH
  const entryFee = ethers.parseEther("0.01");

  const Raffle = await hre.ethers.getContractFactory("Raffle");
  const raffle = await Raffle.deploy(entryFee);

  await raffle.waitForDeployment();

  const address = await raffle.getAddress();
  console.log(`Raffle contract deployed to: ${address}`);
  console.log(`Entry fee set to: ${ethers.formatEther(entryFee)} ETH`);

  // Save the contract address to a file for the frontend
  const contractsDir = "./frontend/src/contracts";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir, { recursive: true });
  }

  fs.writeFileSync(
    contractsDir + "/contract-address.json",
    JSON.stringify({ Raffle: address }, undefined, 2)
  );

  // Copy the contract ABI to the frontend
  const RaffleArtifact = await hre.artifacts.readArtifact("Raffle");

  fs.writeFileSync(
    contractsDir + "/Raffle.json",
    JSON.stringify(RaffleArtifact, null, 2)
  );

  console.log("Contract address and ABI saved to frontend/src/contracts/");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

