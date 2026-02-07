# Sepolia Testnet Setup Guide

This guide will help you configure and use the Crypto Raffle dApp on the Sepolia testnet for testing.

## 🌐 What is Sepolia?

Sepolia is an Ethereum testnet that allows you to test your dApp without spending real ETH. It's the recommended testnet for Ethereum development.

## 📋 Prerequisites

1. **MetaMask Wallet** - Install from [metamask.io](https://metamask.io)
2. **Sepolia ETH** - Free test ETH from faucets (see below)

## 🚀 Quick Start

### Step 1: Get Sepolia ETH

You need Sepolia ETH to deploy contracts and interact with the dApp. Get free Sepolia ETH from these faucets:

1. **Alchemy Sepolia Faucet** (Recommended)
   - URL: https://sepoliafaucet.com/
   - Requires: Alchemy account (free)
   - Amount: 0.5 SepoliaETH per day

2. **Infura Sepolia Faucet**
   - URL: https://www.infura.io/faucet/sepolia
   - Requires: Infura account (free)
   - Amount: 0.5 SepoliaETH per day

3. **QuickNode Faucet**
   - URL: https://faucet.quicknode.com/ethereum/sepolia
   - Requires: Twitter account
   - Amount: 0.1 SepoliaETH

### Step 2: Add Sepolia Network to MetaMask

The dApp will automatically prompt you to add/switch to Sepolia when you connect your wallet. But you can also add it manually:

1. Open MetaMask
2. Click the network dropdown (top center)
3. Click "Add Network" → "Add a network manually"
4. Enter these details:
   - **Network Name**: Sepolia Testnet
   - **RPC URL**: https://sepolia.infura.io/v3/a29782d9c5a64d6dbacaa40a4c4fc262
   - **Chain ID**: 11155111
   - **Currency Symbol**: ETH
   - **Block Explorer**: https://sepolia.etherscan.io
5. Click "Save"

### Step 3: Deploy Contract to Sepolia

Make sure you have Sepolia ETH in your wallet, then:

```bash
# Deploy the raffle contract to Sepolia
npm run deploy:sepolia
```

This will:
- Deploy the Raffle contract to Sepolia testnet
- Save the contract address to `frontend/src/contracts/contract-address.json`
- Update the `.env` file with the new contract address

### Step 4: Update Environment Variables

After deployment, update your `.env` file with the new contract address:

```bash
VITE_CONTRACT_ADDRESS=<your_deployed_contract_address>
```

### Step 5: Start the Frontend

```bash
npm run frontend
```

The app will automatically:
- Detect if you're on the wrong network
- Prompt you to switch to Sepolia
- Add Sepolia network if it's not in MetaMask

## 🔧 Configuration

### Environment Variables

Your `.env` file should look like this:

```bash
# Sepolia Testnet Configuration
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/a29782d9c5a64d6dbacaa40a4c4fc262
PRIVATE_KEY=your_private_key_here

# Contract Address (update after deployment)
CONTRACT_ADDRESS=0x...

# Frontend Environment Variables
VITE_CONTRACT_ADDRESS=0x...
VITE_NETWORK_ID=11155111
VITE_NETWORK_NAME=Sepolia
VITE_RPC_URL=https://sepolia.infura.io/v3/a29782d9c5a64d6dbacaa40a4c4fc262
```

### Getting Your Private Key

⚠️ **IMPORTANT**: Only use a test wallet for development. Never use your main wallet's private key!

1. Create a new MetaMask account for testing
2. In MetaMask: Click the 3 dots → Account Details → Export Private Key
3. Enter your password
4. Copy the private key and add it to `.env`

## 🎮 Using the dApp on Sepolia

1. **Connect Wallet**: Click "Connect Wallet" button
2. **Switch Network**: If prompted, click "Switch to Sepolia Testnet"
3. **Enter Raffle**: Pay the entry fee (e.g., 0.01 SepoliaETH)
4. **Pick Winner**: Owner can pick a winner (requires owner account)

## 🔍 Verify Transactions

All transactions on Sepolia can be viewed on Sepolia Etherscan:
- URL: https://sepolia.etherscan.io
- Search for your contract address or transaction hash

## 💡 Tips

1. **Save Test ETH**: Sepolia ETH is free but limited. Use small entry fees for testing.
2. **Multiple Accounts**: Create multiple MetaMask accounts to test the raffle with different players.
3. **Reset Account**: If you have transaction issues, reset your MetaMask account:
   - Settings → Advanced → Reset Account
4. **Check Network**: Always verify you're on Sepolia (chain ID: 11155111)

## 🐛 Troubleshooting

### "Insufficient funds" error
- Get more Sepolia ETH from faucets
- Make sure you're using the correct account

### "Wrong network" warning
- Click the "Switch to Sepolia Testnet" button
- Or manually switch in MetaMask

### Contract not found
- Make sure you deployed to Sepolia: `npm run deploy:sepolia`
- Check that `VITE_CONTRACT_ADDRESS` in `.env` matches the deployed address
- Restart the frontend after updating `.env`

### Transaction stuck
- Increase gas price in MetaMask
- Or reset your account: Settings → Advanced → Reset Account

## 📚 Additional Resources

- [Sepolia Testnet Info](https://sepolia.dev/)
- [Sepolia Etherscan](https://sepolia.etherscan.io)
- [MetaMask Documentation](https://docs.metamask.io/)
- [Ethereum Testnet Guide](https://ethereum.org/en/developers/docs/networks/#ethereum-testnets)

## 🚀 Next Steps

Once you've tested thoroughly on Sepolia:
1. Review the [PRODUCTION_READINESS_GUIDE.md](./PRODUCTION_READINESS_GUIDE.md)
2. Consider security audits
3. Deploy to mainnet (with caution!)

---

**Happy Testing! 🎰✨**

