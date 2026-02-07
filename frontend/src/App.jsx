import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './App.css';
import RaffleABI from './contracts/Raffle.json';
import contractAddress from './contracts/contract-address.json';

function App() {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [raffleInfo, setRaffleInfo] = useState({
    entryFee: '0',
    playerCount: 0,
    prizePool: '0',
    isActive: false,
    lastWinner: ethers.ZeroAddress,
    lastWinAmount: '0'
  });
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    initializeProvider();
  }, []);

  useEffect(() => {
    if (contract) {
      loadRaffleInfo();
      loadPlayers();

      // Set up event listeners
      contract.on('PlayerEntered', (player, amount) => {
        setMessage(`Player ${player.slice(0, 6)}...${player.slice(-4)} entered with ${ethers.formatEther(amount)} ETH`);
        loadRaffleInfo();
        loadPlayers();
      });

      contract.on('WinnerPicked', (winner, amount) => {
        setMessage(`🎉 Winner: ${winner.slice(0, 6)}...${winner.slice(-4)} won ${ethers.formatEther(amount)} ETH!`);
        loadRaffleInfo();
        loadPlayers();
      });

      return () => {
        contract.removeAllListeners();
      };
    }
  }, [contract]);

  const initializeProvider = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        setProvider(provider);

        // Request account access
        const accounts = await provider.send('eth_requestAccounts', []);
        setAccount(accounts[0]);

        // Initialize contract
        const signer = await provider.getSigner();
        const raffleContract = new ethers.Contract(
          contractAddress.Raffle,
          RaffleABI.abi,
          signer
        );
        setContract(raffleContract);

        // Listen for account changes
        window.ethereum.on('accountsChanged', (accounts) => {
          setAccount(accounts[0]);
        });
      } catch (error) {
        console.error('Error initializing provider:', error);
        setMessage('Error connecting to MetaMask');
      }
    } else {
      setMessage('Please install MetaMask to use this dApp');
    }
  };

  const loadRaffleInfo = async () => {
    if (!contract) return;
    try {
      const info = await contract.getRaffleInfo();
      setRaffleInfo({
        entryFee: ethers.formatEther(info[0]),
        playerCount: Number(info[1]),
        prizePool: ethers.formatEther(info[2]),
        isActive: info[3],
        lastWinner: info[4],
        lastWinAmount: ethers.formatEther(info[5])
      });
    } catch (error) {
      console.error('Error loading raffle info:', error);
    }
  };

  const loadPlayers = async () => {
    if (!contract) return;
    try {
      const playersList = await contract.getPlayers();
      setPlayers(playersList);
    } catch (error) {
      console.error('Error loading players:', error);
    }
  };

  const enterRaffle = async () => {
    if (!contract) return;
    setLoading(true);
    setMessage('');
    try {
      const tx = await contract.enter({
        value: ethers.parseEther(raffleInfo.entryFee)
      });
      setMessage('Transaction submitted. Waiting for confirmation...');
      await tx.wait();
      setMessage('Successfully entered the raffle!');
    } catch (error) {
      console.error('Error entering raffle:', error);
      setMessage(`Error: ${error.reason || error.message}`);
    }
    setLoading(false);
  };

  const pickWinner = async () => {
    if (!contract) return;
    setLoading(true);
    setMessage('');
    try {
      const tx = await contract.pickWinner();
      setMessage('Picking winner... Please wait...');
      await tx.wait();
      setMessage('Winner picked successfully!');
    } catch (error) {
      console.error('Error picking winner:', error);
      setMessage(`Error: ${error.reason || error.message}`);
    }
    setLoading(false);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🎰 Crypto Raffle dApp</h1>
        <p className="subtitle">ETH Reward Pool</p>
      </header>

      {account ? (
        <div className="account-info">
          <p>Connected: {account.slice(0, 6)}...{account.slice(-4)}</p>
        </div>
      ) : (
        <button onClick={initializeProvider} className="connect-btn">
          Connect Wallet
        </button>
      )}

      {message && <div className="message">{message}</div>}

      <div className="raffle-container">
        <div className="raffle-info">
          <h2>Raffle Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <span className="label">Entry Fee:</span>
              <span className="value">{raffleInfo.entryFee} ETH</span>
            </div>
            <div className="info-item">
              <span className="label">Prize Pool:</span>
              <span className="value">{raffleInfo.prizePool} ETH</span>
            </div>
            <div className="info-item">
              <span className="label">Players:</span>
              <span className="value">{raffleInfo.playerCount}</span>
            </div>
            <div className="info-item">
              <span className="label">Status:</span>
              <span className={`value ${raffleInfo.isActive ? 'active' : 'inactive'}`}>
                {raffleInfo.isActive ? '🟢 Active' : '🔴 Inactive'}
              </span>
            </div>
          </div>

          {raffleInfo.lastWinner !== ethers.ZeroAddress && (
            <div className="last-winner">
              <h3>Last Winner</h3>
              <p>{raffleInfo.lastWinner}</p>
              <p className="win-amount">{raffleInfo.lastWinAmount} ETH</p>
            </div>
          )}
        </div>

        <div className="actions">
          <button
            onClick={enterRaffle}
            disabled={loading || !raffleInfo.isActive || !account}
            className="action-btn enter-btn"
          >
            {loading ? 'Processing...' : `Enter Raffle (${raffleInfo.entryFee} ETH)`}
          </button>

          <button
            onClick={pickWinner}
            disabled={loading || raffleInfo.playerCount === 0 || !account}
            className="action-btn winner-btn"
          >
            {loading ? 'Processing...' : 'Pick Winner (Owner Only)'}
          </button>
        </div>

        {players.length > 0 && (
          <div className="players-list">
            <h3>Current Players ({players.length})</h3>
            <ul>
              {players.map((player, index) => (
                <li key={index}>
                  {player.slice(0, 6)}...{player.slice(-4)}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
