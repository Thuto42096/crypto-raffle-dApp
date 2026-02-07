# 🎰 Crypto Raffle dApp - Project Overview

## What We Built

A complete decentralized application (dApp) for running ETH raffles on the Ethereum blockchain.

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (React)                      │
│  - User Interface                                        │
│  - MetaMask Integration                                  │
│  - Real-time Event Listening                            │
└────────────────┬────────────────────────────────────────┘
                 │
                 │ ethers.js
                 │
┌────────────────▼────────────────────────────────────────┐
│              Ethereum Blockchain                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │         Raffle Smart Contract                     │  │
│  │  - Entry Management                               │  │
│  │  - Prize Pool                                     │  │
│  │  - Winner Selection                               │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## File Structure

```
crypto-raffle-dApp/
├── contracts/
│   └── Raffle.sol              # Smart contract (Solidity)
│
├── scripts/
│   └── deploy.js               # Deployment script
│
├── test/
│   └── Raffle.test.js          # Contract tests
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx             # Main React component
│   │   ├── App.css             # Component styles
│   │   ├── index.css           # Global styles
│   │   └── contracts/          # Generated contract files
│   │       ├── Raffle.json     # Contract ABI
│   │       └── contract-address.json
│   └── package.json
│
├── hardhat.config.js           # Hardhat configuration
├── package.json                # Root dependencies
├── README.md                   # Full documentation
├── QUICKSTART.md              # Quick start guide
└── PROJECT_OVERVIEW.md        # This file
```

## Smart Contract Features

### Public Functions
- **enter()** - Join the raffle by paying the entry fee
- **getPrizePool()** - View current prize pool
- **getPlayers()** - Get list of all participants
- **getPlayerCount()** - Get number of participants
- **getRaffleInfo()** - Get all raffle data in one call

### Owner Functions
- **pickWinner()** - Randomly select and pay the winner
- **startNewRaffle()** - Start a new raffle with new entry fee
- **closeRaffle()** - Stop accepting new entries
- **activateRaffle()** - Resume accepting entries

### Events
- **PlayerEntered** - Emitted when someone joins
- **WinnerPicked** - Emitted when winner is selected
- **RaffleStarted** - Emitted when raffle begins
- **RaffleClosed** - Emitted when raffle is closed

## Frontend Features

### User Interface
- **Wallet Connection** - Connect MetaMask wallet
- **Raffle Information Display**
  - Entry fee
  - Current prize pool
  - Number of players
  - Raffle status (active/inactive)
  - Last winner and prize amount
- **Player List** - View all current participants
- **Action Buttons**
  - Enter Raffle
  - Pick Winner (owner only)

### Real-time Updates
- Listens to blockchain events
- Updates UI automatically when:
  - New player enters
  - Winner is picked
  - Raffle status changes

## Technology Stack

### Smart Contract
- **Solidity** 0.8.19
- **Hardhat** 3.x - Development framework
- **Ethers.js** - Ethereum library

### Frontend
- **React** 18.x - UI framework
- **Vite** 7.x - Build tool and dev server
- **Ethers.js** 6.x - Web3 integration
- **CSS3** - Styling with gradients and animations

### Development Tools
- **Node.js** 20+ - Runtime environment
- **npm** - Package manager
- **MetaMask** - Wallet integration

## How It Works

### 1. Deployment
```
Owner deploys contract → Sets entry fee → Contract is active
```

### 2. Players Enter
```
Player connects wallet → Pays entry fee → Added to players array
                                       → ETH added to prize pool
```

### 3. Winner Selection
```
Owner picks winner → Random selection → Winner receives prize pool
                                     → Players array reset
```

### 4. New Round
```
Owner can start new raffle with same or different entry fee
```

## Security Considerations

⚠️ **This is a demonstration project. For production use:**

1. **Randomness**: Replace pseudo-random with Chainlink VRF
2. **Testing**: Add comprehensive test coverage
3. **Auditing**: Get professional security audit
4. **Gas Optimization**: Optimize for lower gas costs
5. **Access Control**: Consider more sophisticated role management
6. **Reentrancy**: Add reentrancy guards
7. **Pause Mechanism**: Add emergency pause functionality

## Future Enhancements

Potential features to add:

- [ ] Multiple concurrent raffles
- [ ] Ticket-based system (buy multiple entries)
- [ ] Time-based automatic winner selection
- [ ] Referral system
- [ ] Prize distribution (1st, 2nd, 3rd place)
- [ ] NFT rewards
- [ ] DAO governance for raffle parameters
- [ ] Multi-chain support
- [ ] Mobile app

## Getting Started

See [QUICKSTART.md](./QUICKSTART.md) for a 5-minute setup guide.

See [README.md](./README.md) for complete documentation.

## License

ISC

---

Built with ❤️ for the Ethereum community

