import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import { ethers } from "hardhat";

import { ProblematicNFT, PwnNFT } from "../../src/types";
import { Signers } from "../types";

chai.use(chaiAsPromised);
const { expect } = chai;

let nft: ProblematicNFT;
let pwnNFT: PwnNFT;
let goodUser: SignerWithAddress;
let attacker: SignerWithAddress;

describe("Pwner tests", function () {
  before(async function () {
    this.signers = {} as Signers;

    const signers: SignerWithAddress[] = await ethers.getSigners();
    goodUser = signers[0];
    attacker = signers[1];

    const NFT = await ethers.getContractFactory("ProblematicNFT");
    nft = await NFT.deploy();

    const PwnNFT = await ethers.getContractFactory("PwnNFT");
    pwnNFT = await PwnNFT.deploy(nft.address);
  });

  it("should not accept less than the minimum deposit", async function () {
    const deposit = ethers.utils.parseEther("0.01");
    expect(nft.deposit({ from: goodUser.address, value: deposit })).to.be.rejectedWith(
      "Error: VM Exception while processing transaction: reverted with reason string 'deposit not enough'",
    );
  });

  it("should correctly accept a deposit & mint NFT from a behaving user", async function () {
    const deposit = ethers.utils.parseEther("0.1");
    const initialUserBalance = await ethers.provider.getBalance(goodUser.address);

    const txreceipt = await (await nft.deposit({ from: goodUser.address, value: deposit })).wait();
    const balance = await nft.tokensDeposited(goodUser.address);
    const userBalance = await ethers.provider.getBalance(goodUser.address);

    // after deposit we should have our balance minus the deposit and any gas paid
    expect(balance.toString()).to.eq(deposit.toString());
    expect(userBalance.toString()).to.eq(
      initialUserBalance.sub(deposit).sub(txreceipt.gasUsed.mul(txreceipt.effectiveGasPrice)).toString(),
    );

    const tx2receipt = await (await nft.mint({ from: goodUser.address })).wait();
    const newBalance = await nft.tokensDeposited(goodUser.address);
    const newUserBalance = await ethers.provider.getBalance(goodUser.address);

    // after mint we should have the original balance minus gas
    expect(newBalance.toString()).to.eq("0");
    expect(newUserBalance.toString()).to.eq(
      initialUserBalance
        .sub(txreceipt.gasUsed.mul(txreceipt.effectiveGasPrice))
        .sub(tx2receipt.gasUsed.mul(tx2receipt.effectiveGasPrice))
        .toString(),
    );
  });

  it("should have goodUsers funds get absolutely pwned by attacker", async function () {
    // lets deposit some funds into contract from our good user
    const deposit = ethers.utils.parseEther("0.1");
    await nft.deposit({ from: goodUser.address, value: deposit });

    //initial pwner balance
    const initialPwnerBalance = await ethers.provider.getBalance(attacker.address);

    const attackTxReceipt = await (
      await pwnNFT.connect(attacker).pwnNFTMint({
        from: attacker.address,
        value: deposit,
      })
    ).wait();
    const attackGas = attackTxReceipt.gasUsed.mul(attackTxReceipt.effectiveGasPrice);

    const contractBalance = await ethers.provider.getBalance(nft.address);
    const pwnerContractBalance = await ethers.provider.getBalance(pwnNFT.address);

    const totalStolenFunds = ethers.utils.parseEther("0.2");

    expect(contractBalance.toString()).to.eq("0");
    expect(pwnerContractBalance).to.eq(totalStolenFunds);

    const getawayTxReceipt = await (await pwnNFT.gimmeEther()).wait();
    const getawayGas = getawayTxReceipt.gasUsed.mul(getawayTxReceipt.effectiveGasPrice);

    const totalStolenFundsNotIncludingOurOwn = ethers.utils.parseEther("0.1");
    // just expect that we are profitable from stealint these funds
    expect(
      initialPwnerBalance
        .add(totalStolenFundsNotIncludingOurOwn)
        .sub(attackGas)
        .sub(getawayGas)
        .gt(initialPwnerBalance),
    ).to.eq(true);
  });

  //   describe("Greeter", function () {
  // beforeEach(async function () {
  //   const greeting: string = "Hello, world!";
  //   const greeterArtifact: Artifact = await artifacts.readArtifact("Greeter");
  //   this.greeter = <Greeter>await waffle.deployContract(this.signers.admin, greeterArtifact, [greeting]);
  // });

  //   });
});
