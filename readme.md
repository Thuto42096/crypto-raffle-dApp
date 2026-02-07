# 🎰 Crypto Raffle dApp

A decentralized raffle application built on Ethereum with a React frontend. Users can enter the raffle by paying an entry fee in ETH, and a winner is randomly selected to receive the entire prize pool.

## 🌟 Features

- **Enter Raffle**: Pay the entry fee to participate in the raffle
- **Prize Pool**: All entry fees accumulate in a prize pool
- **Random Winner Selection**: Owner can pick a random winner from all participants
- **Real-time Updates**: Frontend updates automatically when events occur
- **MetaMask Integration**: Connect your wallet to interact with the dApp
- **Responsive UI**: Beautiful gradient design that works on all devices

## 🛠️ Tech Stack

### Smart Contract
- **Solidity** ^0.8.19
- **Hardhat** - Development environment
- **Ethers.js** - Ethereum library

### Frontend
- **React** - UI framework
- **Vite** - Build tool
- **Ethers.js** - Web3 integration

## 📋 Prerequisites

- **Node.js v20 or higher** (Required for Hardhat 3.x)
  - Check your version: `node --version`
  - If you have Node 18, you'll need to upgrade to Node 20+
  - Use [nvm](https://github.com/nvm-sh/nvm) to manage Node versions: `nvm install 20 && nvm use 20`
- MetaMask browser extension
- Git

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd crypto-raffle-dApp
   ```

2. **Install root dependencies**
   ```bash
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   cd ..
   ```

## 💻 Development

### 1. Start a local Hardhat node

In one terminal, start the local blockchain:

```bash
npm run node
```

This will start a local Ethereum network on `http://127.0.0.1:8545/` and display 20 test accounts with private keys.

### 2. Deploy the smart contract

In another terminal, deploy the Raffle contract:

```bash
npm run deploy
```

This will:
- Deploy the Raffle contract to the local network
- Set the entry fee to 0.01 ETH
- Save the contract address and ABI to `frontend/src/contracts/`

### 3. Configure MetaMask

1. Open MetaMask and add a new network:
   - **Network Name**: Hardhat Local
   - **RPC URL**: http://127.0.0.1:8545
   - **Chain ID**: 1337
   - **Currency Symbol**: ETH

2. Import test accounts from the Hardhat node output using their private keys

### 4. Start the frontend

In a third terminal:

```bash
npm run frontend
```

The frontend will be available at `http://localhost:5173`

## 📖 Usage

### For Players

1. **Connect Wallet**: Click "Connect Wallet" and approve the connection in MetaMask
2. **Enter Raffle**: Click "Enter Raffle" and confirm the transaction (0.01 ETH)
3. **Wait for Winner**: Watch the player count and prize pool grow
4. **Check Results**: If you win, the prize will be automatically sent to your wallet

### For Owner

The owner (deployer) has additional capabilities:

1. **Pick Winner**: Click "Pick Winner" to randomly select a winner from all participants
2. **Start New Raffle**: After a winner is picked, you can start a new raffle with a different entry fee
3. **Close/Activate Raffle**: Control whether new entries are allowed

## 🔧 Smart Contract Functions

### Public Functions
- `enter()` - Enter the raffle by sending the entry fee
- `getPrizePool()` - Get the current prize pool amount
- `getPlayers()` - Get list of all players
- `getPlayerCount()` - Get number of players
- `getRaffleInfo()` - Get all raffle information at once

### Owner Functions
- `pickWinner()` - Randomly select and pay the winner
- `startNewRaffle(uint256 _entryFee)` - Start a new raffle with a new entry fee
- `closeRaffle()` - Prevent new entries
- `activateRaffle()` - Allow new entries

## 📁 Project Structure

```
crypto-raffle-dApp/
├── contracts/
│   └── Raffle.sol           # Main raffle smart contract
├── scripts/
│   └── deploy.js            # Deployment script
├── frontend/
│   ├── src/
│   │   ├── App.jsx          # Main React component
│   │   ├── App.css          # Component styles
│   │   ├── index.css        # Global styles
│   │   └── contracts/       # Contract ABI and address (generated)
│   └── package.json
├── hardhat.config.js        # Hardhat configuration
├── package.json
└── README.md
```

## ⚠️ Security Notes

**IMPORTANT**: This is a demonstration project and should NOT be used in production without significant improvements:

1. **Random Number Generation**: The current implementation uses `block.timestamp` and `block.prevrandao` for randomness, which is NOT secure for production. Use Chainlink VRF or similar oracle service for true randomness.

2. **Testing**: Add comprehensive tests before deploying to mainnet

3. **Auditing**: Have the contract audited by security professionals

4. **Gas Optimization**: Optimize for gas efficiency

## 🧪 Testing

To run tests (when implemented):

```bash
npm test
```

## � Troubleshooting

### Node.js Version Issues

If you see errors like:
- `WARNING: You are using Node.js 18.20.8 which is not supported by Hardhat`
- `TypeError: plugins.toReversed is not a function`

**Solution**: Upgrade to Node.js 20 or higher

```bash
# Using nvm (recommended)
nvm install 20
nvm use 20

# Verify version
node --version  # Should show v20.x.x or higher
```

### MetaMask Connection Issues

1. Make sure you're on the correct network (Hardhat Local - Chain ID 1337)
2. Try resetting your MetaMask account: Settings → Advanced → Reset Account
3. Clear your browser cache and reload the page

### Contract Not Found

If the frontend can't find the contract:
1. Make sure you've deployed the contract: `npm run deploy`
2. Check that `frontend/src/contracts/` contains `contract-address.json` and `Raffle.json`
3. Restart the frontend: `npm run frontend`

## �📝 License

ISC

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

If you have any questions or issues, please open an issue on GitHub.

---

**Happy Raffling! 🎉**