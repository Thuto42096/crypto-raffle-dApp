# 🚀 Quick Start Guide

Get your Crypto Raffle dApp running in 5 minutes!

## Step 1: Check Node.js Version

```bash
node --version
```

**You need Node.js v20 or higher!**

If you have an older version:
```bash
# Install nvm if you don't have it
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Install and use Node 20
nvm install 20
nvm use 20
```

## Step 2: Install Dependencies

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

## Step 3: Start Local Blockchain

Open a new terminal and run:

```bash
npm run node
```

Keep this terminal running! You'll see 20 test accounts with private keys.

## Step 4: Deploy Contract

Open another terminal and run:

```bash
npm run deploy
```

You should see:
```
Deploying Raffle contract...
Raffle contract deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
Entry fee set to: 0.01 ETH
Contract address and ABI saved to frontend/src/contracts/
```

## Step 5: Configure MetaMask

1. Open MetaMask
2. Click on the network dropdown (top center)
3. Click "Add Network" → "Add a network manually"
4. Enter these details:
   - **Network Name**: Hardhat Local
   - **RPC URL**: http://127.0.0.1:8545
   - **Chain ID**: 1337
   - **Currency Symbol**: ETH
5. Click "Save"

6. Import a test account:
   - Copy a private key from the Hardhat node terminal (Step 3)
   - In MetaMask: Click account icon → Import Account
   - Paste the private key
   - You should see 10000 ETH!

## Step 6: Start Frontend

Open a third terminal:

```bash
npm run frontend
```

The app will open at `http://localhost:5173`

## Step 7: Use the dApp!

1. Click "Connect Wallet" in the app
2. Approve the connection in MetaMask
3. Click "Enter Raffle" to join (costs 0.01 ETH)
4. Import another test account in MetaMask
5. Switch to that account and enter the raffle again
6. Switch back to the first account (the owner/deployer)
7. Click "Pick Winner" to select a random winner
8. Check the winner's balance - they got the prize! 🎉

## Troubleshooting

### "Cannot find module" errors
```bash
rm -rf node_modules package-lock.json
npm install
```

### Frontend can't find contract
Make sure you ran `npm run deploy` and the files exist:
```bash
ls frontend/src/contracts/
# Should show: Raffle.json  contract-address.json
```

### MetaMask shows wrong balance
Reset your account:
- MetaMask → Settings → Advanced → Reset Account

### Port already in use
Kill the process using the port:
```bash
# For port 8545 (Hardhat)
lsof -ti:8545 | xargs kill -9

# For port 5173 (Frontend)
lsof -ti:5173 | xargs kill -9
```

## Next Steps

- Read the full [README.md](./README.md) for detailed documentation
- Explore the smart contract in `contracts/Raffle.sol`
- Customize the frontend in `frontend/src/App.jsx`
- Add more features!

Happy coding! 🎰✨

