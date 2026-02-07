import { expect } from "chai";
import { ethers } from "hardhat";

describe("Raffle Contract", function () {
  let raffle;
  let owner;
  let player1;
  let player2;
  const entryFee = ethers.parseEther("0.01");

  beforeEach(async function () {
    [owner, player1, player2] = await ethers.getSigners();
    
    const Raffle = await ethers.getContractFactory("Raffle");
    raffle = await Raffle.deploy(entryFee);
    await raffle.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await raffle.owner()).to.equal(owner.address);
    });

    it("Should set the correct entry fee", async function () {
      expect(await raffle.entryFee()).to.equal(entryFee);
    });

    it("Should start as active", async function () {
      expect(await raffle.isActive()).to.equal(true);
    });
  });

  describe("Entering the raffle", function () {
    it("Should allow players to enter with correct fee", async function () {
      await raffle.connect(player1).enter({ value: entryFee });
      expect(await raffle.getPlayerCount()).to.equal(1);
    });

    it("Should reject entry with incorrect fee", async function () {
      await expect(
        raffle.connect(player1).enter({ value: ethers.parseEther("0.005") })
      ).to.be.revertedWith("Incorrect entry fee");
    });

    it("Should not allow owner to enter", async function () {
      await expect(
        raffle.connect(owner).enter({ value: entryFee })
      ).to.be.revertedWith("Owner cannot enter the raffle");
    });

    it("Should increase prize pool", async function () {
      await raffle.connect(player1).enter({ value: entryFee });
      expect(await raffle.getPrizePool()).to.equal(entryFee);
    });
  });

  describe("Picking a winner", function () {
    beforeEach(async function () {
      await raffle.connect(player1).enter({ value: entryFee });
      await raffle.connect(player2).enter({ value: entryFee });
    });

    it("Should only allow owner to pick winner", async function () {
      await expect(
        raffle.connect(player1).pickWinner()
      ).to.be.revertedWith("Only owner can call this function");
    });

    it("Should pick a winner and transfer prize", async function () {
      const initialBalance1 = await ethers.provider.getBalance(player1.address);
      const initialBalance2 = await ethers.provider.getBalance(player2.address);
      
      await raffle.connect(owner).pickWinner();
      
      const finalBalance1 = await ethers.provider.getBalance(player1.address);
      const finalBalance2 = await ethers.provider.getBalance(player2.address);
      
      // One of the players should have received the prize
      const player1Won = finalBalance1 > initialBalance1;
      const player2Won = finalBalance2 > initialBalance2;
      
      expect(player1Won || player2Won).to.be.true;
    });

    it("Should reset players after picking winner", async function () {
      await raffle.connect(owner).pickWinner();
      expect(await raffle.getPlayerCount()).to.equal(0);
    });
  });

  describe("Raffle management", function () {
    it("Should allow owner to close raffle", async function () {
      await raffle.connect(owner).closeRaffle();
      expect(await raffle.isActive()).to.equal(false);
    });

    it("Should not allow entries when closed", async function () {
      await raffle.connect(owner).closeRaffle();
      await expect(
        raffle.connect(player1).enter({ value: entryFee })
      ).to.be.revertedWith("Raffle is not active");
    });

    it("Should allow owner to activate raffle", async function () {
      await raffle.connect(owner).closeRaffle();
      await raffle.connect(owner).activateRaffle();
      expect(await raffle.isActive()).to.equal(true);
    });
  });

  describe("Get raffle info", function () {
    it("Should return correct raffle information", async function () {
      await raffle.connect(player1).enter({ value: entryFee });
      
      const info = await raffle.getRaffleInfo();
      
      expect(info[0]).to.equal(entryFee); // entryFee
      expect(info[1]).to.equal(1); // playerCount
      expect(info[2]).to.equal(entryFee); // prizePool
      expect(info[3]).to.equal(true); // isActive
    });
  });
});

