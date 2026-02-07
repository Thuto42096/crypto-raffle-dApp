// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title Raffle
 * @dev A simple ETH raffle/lottery contract
 */
contract Raffle {
    address public owner;
    uint256 public entryFee;
    address[] public players;
    address public lastWinner;
    uint256 public lastWinAmount;
    bool public isActive;
    
    event PlayerEntered(address indexed player, uint256 amount);
    event WinnerPicked(address indexed winner, uint256 amount);
    event RaffleStarted(uint256 entryFee);
    event RaffleClosed();
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    modifier raffleActive() {
        require(isActive, "Raffle is not active");
        _;
    }
    
    constructor(uint256 _entryFee) {
        owner = msg.sender;
        entryFee = _entryFee;
        isActive = true;
        emit RaffleStarted(_entryFee);
    }
    
    /**
     * @dev Enter the raffle by sending the entry fee
     */
    function enter() public payable raffleActive {
        require(msg.value == entryFee, "Incorrect entry fee");
        require(msg.sender != owner, "Owner cannot enter the raffle");
        
        players.push(msg.sender);
        emit PlayerEntered(msg.sender, msg.value);
    }
    
    /**
     * @dev Get the current prize pool
     */
    function getPrizePool() public view returns (uint256) {
        return address(this).balance;
    }
    
    /**
     * @dev Get all players
     */
    function getPlayers() public view returns (address[] memory) {
        return players;
    }
    
    /**
     * @dev Get number of players
     */
    function getPlayerCount() public view returns (uint256) {
        return players.length;
    }
    
    /**
     * @dev Pick a winner (pseudo-random, not production-ready)
     * In production, use Chainlink VRF or similar oracle for true randomness
     */
    function pickWinner() public onlyOwner raffleActive {
        require(players.length > 0, "No players in the raffle");
        
        // Pseudo-random number generation (NOT SECURE FOR PRODUCTION)
        uint256 randomIndex = uint256(
            keccak256(
                abi.encodePacked(
                    block.timestamp,
                    block.prevrandao,
                    players.length
                )
            )
        ) % players.length;
        
        address winner = players[randomIndex];
        uint256 prizeAmount = address(this).balance;
        
        lastWinner = winner;
        lastWinAmount = prizeAmount;
        
        // Reset the raffle
        delete players;
        
        // Transfer prize to winner
        (bool success, ) = winner.call{value: prizeAmount}("");
        require(success, "Transfer failed");
        
        emit WinnerPicked(winner, prizeAmount);
    }
    
    /**
     * @dev Start a new raffle with a new entry fee
     */
    function startNewRaffle(uint256 _entryFee) public onlyOwner {
        require(players.length == 0, "Current raffle must be completed first");
        entryFee = _entryFee;
        isActive = true;
        emit RaffleStarted(_entryFee);
    }
    
    /**
     * @dev Close the raffle (no new entries allowed)
     */
    function closeRaffle() public onlyOwner {
        isActive = false;
        emit RaffleClosed();
    }
    
    /**
     * @dev Activate the raffle
     */
    function activateRaffle() public onlyOwner {
        isActive = true;
    }
    
    /**
     * @dev Get raffle info
     */
    function getRaffleInfo() public view returns (
        uint256 _entryFee,
        uint256 _playerCount,
        uint256 _prizePool,
        bool _isActive,
        address _lastWinner,
        uint256 _lastWinAmount
    ) {
        return (
            entryFee,
            players.length,
            address(this).balance,
            isActive,
            lastWinner,
            lastWinAmount
        );
    }
}

