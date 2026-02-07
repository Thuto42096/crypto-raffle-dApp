const hre = require("hardhat");
const fs = require("fs");
require("dotenv").config();

async function main() {
  console.log("🚀 Deploying RaffleVRF contract with Chainlink VRF...\n");

  // Get network
  const network = await hre.ethers.provider.getNetwork();
  console.log(`📡 Network: ${network.name} (Chain ID: ${network.chainId})`);

  // Get deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log(`👤 Deploying from: ${deployer.address}`);
  
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log(`💰 Account balance: ${hre.ethers.formatEther(balance)} ETH\n`);

  // Get configuration from environment variables
  const vrfCoordinator = process.env.VRF_COORDINATOR;
  const gasLane = process.env.GAS_LANE;
  const subscriptionId = process.env.SUBSCRIPTION_ID;
  const callbackGasLimit = process.env.CALLBACK_GAS_LIMIT || "500000";
  const entryFee = hre.ethers.parseEther(process.env.ENTRY_FEE || "0.01");
  const raffleDuration = process.env.RAFFLE_DURATION || "86400"; // 24 hours default

  // Validate configuration
  if (!vrfCoordinator || !gasLane || !subscriptionId) {
    console.error("❌ Error: Missing required environment variables!");
    console.error("Please set VRF_COORDINATOR, GAS_LANE, and SUBSCRIPTION_ID in your .env file");
    console.error("See CHAINLINK_VRF_SETUP.md for details");
    process.exit(1);
  }

  console.log("⚙️  Configuration:");
  console.log(`   VRF Coordinator: ${vrfCoordinator}`);
  console.log(`   Gas Lane: ${gasLane}`);
  console.log(`   Subscription ID: ${subscriptionId}`);
  console.log(`   Callback Gas Limit: ${callbackGasLimit}`);
  console.log(`   Entry Fee: ${hre.ethers.formatEther(entryFee)} ETH`);
  console.log(`   Raffle Duration: ${raffleDuration} seconds (${raffleDuration / 3600} hours)\n`);

  // Deploy contract
  console.log("📝 Deploying contract...");
  const RaffleVRF = await hre.ethers.getContractFactory("RaffleVRF");
  
  const raffle = await RaffleVRF.deploy(
    vrfCoordinator,
    gasLane,
    subscriptionId,
    callbackGasLimit,
    entryFee,
    raffleDuration
  );

  await raffle.waitForDeployment();
  const address = await raffle.getAddress();

  console.log(`✅ RaffleVRF deployed to: ${address}\n`);

  // Wait for block confirmations
  if (network.chainId !== 1337n && network.chainId !== 31337n) {
    console.log("⏳ Waiting for 6 block confirmations...");
    await raffle.deploymentTransaction().wait(6);
    console.log("✅ Confirmations complete\n");
  }

  // Save deployment info
  const contractsDir = "./frontend/src/contracts";
  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir, { recursive: true });
  }

  // Save contract address
  fs.writeFileSync(
    contractsDir + "/contract-address.json",
    JSON.stringify({ 
      RaffleVRF: address,
      network: network.name,
      chainId: Number(network.chainId),
      deployedAt: new Date().toISOString()
    }, undefined, 2)
  );

  // Save contract ABI
  const RaffleVRFArtifact = await hre.artifacts.readArtifact("RaffleVRF");
  fs.writeFileSync(
    contractsDir + "/RaffleVRF.json",
    JSON.stringify(RaffleVRFArtifact, null, 2)
  );

  console.log("💾 Contract address and ABI saved to frontend/src/contracts/\n");

  // Verify contract on Etherscan (if not local network)
  if (network.chainId !== 1337n && network.chainId !== 31337n && process.env.ETHERSCAN_API_KEY) {
    console.log("🔍 Verifying contract on Etherscan...");
    try {
      await hre.run("verify:verify", {
        address: address,
        constructorArguments: [
          vrfCoordinator,
          gasLane,
          subscriptionId,
          callbackGasLimit,
          entryFee,
          raffleDuration
        ],
      });
      console.log("✅ Contract verified on Etherscan\n");
    } catch (error) {
      console.log("⚠️  Verification failed:", error.message);
      console.log("You can verify manually later\n");
    }
  }

  // Display next steps
  console.log("=" .repeat(60));
  console.log("🎉 DEPLOYMENT SUCCESSFUL!");
  console.log("=" .repeat(60));
  console.log("\n📋 NEXT STEPS:\n");
  console.log("1. Add this contract as a consumer to your Chainlink VRF subscription:");
  console.log(`   - Go to: https://vrf.chain.link/`);
  console.log(`   - Select subscription ID: ${subscriptionId}`);
  console.log(`   - Click 'Add Consumer'`);
  console.log(`   - Enter contract address: ${address}`);
  console.log("\n2. Fund your subscription with LINK tokens if needed");
  console.log("\n3. Test the contract:");
  console.log(`   npx hardhat run scripts/test-vrf.cjs --network ${network.name}`);
  console.log("\n4. Update your frontend to use the new contract");
  console.log("\n" + "=".repeat(60) + "\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:");
    console.error(error);
    process.exit(1);
  });

