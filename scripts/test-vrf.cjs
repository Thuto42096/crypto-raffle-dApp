const hre = require("hardhat");
const fs = require("fs");

async function main() {
  console.log("🧪 Testing RaffleVRF contract...\n");

  // Load deployed contract address
  const contractAddressPath = "./frontend/src/contracts/contract-address.json";
  
  if (!fs.existsSync(contractAddressPath)) {
    console.error("❌ Contract address file not found!");
    console.error("Please deploy the contract first using:");
    console.error("npx hardhat run scripts/deploy-vrf.cjs --network <network>");
    process.exit(1);
  }

  const { RaffleVRF: contractAddress } = JSON.parse(
    fs.readFileSync(contractAddressPath, "utf8")
  );

  console.log(`📍 Contract address: ${contractAddress}\n`);

  // Get signers
  const [owner, player1, player2, player3] = await hre.ethers.getSigners();
  console.log(`👤 Owner: ${owner.address}`);
  console.log(`👤 Player 1: ${player1.address}`);
  console.log(`👤 Player 2: ${player2.address}`);
  console.log(`👤 Player 3: ${player3.address}\n`);

  // Connect to contract
  const RaffleVRF = await hre.ethers.getContractFactory("RaffleVRF");
  const raffle = RaffleVRF.attach(contractAddress);

  // Get raffle info
  console.log("📊 Current Raffle Info:");
  const info = await raffle.getRaffleInfo();
  console.log(`   Entry Fee: ${hre.ethers.formatEther(info[0])} ETH`);
  console.log(`   Player Count: ${info[1]}`);
  console.log(`   Prize Pool: ${hre.ethers.formatEther(info[2])} ETH`);
  console.log(`   Is Active: ${info[3]}`);
  console.log(`   Round Number: ${info[6]}`);
  console.log(`   Is Open: ${info[7]}`);
  console.log(`   Time Remaining: ${info[8]} seconds\n`);

  const entryFee = info[0];

  // Test 1: Players enter raffle
  console.log("🎯 Test 1: Players entering raffle...");
  try {
    const tx1 = await raffle.connect(player1).enter({ value: entryFee });
    await tx1.wait();
    console.log(`   ✅ Player 1 entered`);

    const tx2 = await raffle.connect(player2).enter({ value: entryFee });
    await tx2.wait();
    console.log(`   ✅ Player 2 entered`);

    const tx3 = await raffle.connect(player3).enter({ value: entryFee });
    await tx3.wait();
    console.log(`   ✅ Player 3 entered\n`);
  } catch (error) {
    console.log(`   ⚠️  Entry failed: ${error.message}\n`);
  }

  // Check updated info
  const updatedInfo = await raffle.getRaffleInfo();
  console.log("📊 Updated Raffle Info:");
  console.log(`   Player Count: ${updatedInfo[1]}`);
  console.log(`   Prize Pool: ${hre.ethers.formatEther(updatedInfo[2])} ETH\n`);

  // Get all players
  const players = await raffle.getPlayers();
  console.log("👥 Current Players:");
  players.forEach((player, index) => {
    console.log(`   ${index + 1}. ${player}`);
  });
  console.log();

  // Test 2: Request random winner
  console.log("🎲 Test 2: Requesting random winner...");
  try {
    const tx = await raffle.connect(owner).pickWinner();
    console.log(`   📝 Transaction hash: ${tx.hash}`);
    console.log(`   ⏳ Waiting for confirmation...`);
    
    const receipt = await tx.wait();
    console.log(`   ✅ Transaction confirmed in block ${receipt.blockNumber}`);
    
    // Check for RandomnessRequested event
    const requestEvent = receipt.logs.find(
      log => log.fragment && log.fragment.name === "RandomnessRequested"
    );
    
    if (requestEvent) {
      console.log(`   🎯 VRF Request ID: ${requestEvent.args[0]}`);
      console.log(`   ⏰ Timestamp: ${requestEvent.args[1]}\n`);
    }

    console.log("   ⏳ Waiting for Chainlink VRF to fulfill the request...");
    console.log("   This may take 1-3 minutes depending on network congestion.");
    console.log("   Monitor at: https://vrf.chain.link/\n");

    // Check if request is pending
    const isPending = await raffle.isRequestPending();
    console.log(`   Request Pending: ${isPending}`);
    
    if (isPending) {
      console.log("\n   ℹ️  The winner will be selected automatically when Chainlink VRF responds.");
      console.log("   You can check the contract later to see the winner.\n");
    }

  } catch (error) {
    console.log(`   ❌ Failed to request winner: ${error.message}\n`);
    
    if (error.message.includes("No players")) {
      console.log("   💡 Tip: Make sure players have entered the raffle first");
    } else if (error.message.includes("not active")) {
      console.log("   💡 Tip: The raffle may have ended. Start a new round.");
    } else if (error.message.includes("pending")) {
      console.log("   💡 Tip: A VRF request is already pending. Wait for it to complete.");
    }
  }

  // Test 3: Check VRF configuration
  console.log("⚙️  VRF Configuration:");
  const vrfConfig = await raffle.getVRFConfig();
  console.log(`   VRF Coordinator: ${vrfConfig[0]}`);
  console.log(`   Gas Lane: ${vrfConfig[1]}`);
  console.log(`   Subscription ID: ${vrfConfig[2]}`);
  console.log(`   Callback Gas Limit: ${vrfConfig[3]}\n`);

  console.log("=" .repeat(60));
  console.log("✅ Testing complete!");
  console.log("=" .repeat(60));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Test failed:");
    console.error(error);
    process.exit(1);
  });

