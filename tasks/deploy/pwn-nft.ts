import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

import type { PwnNFT, PwnNFT__factory } from "../../src/types";

task("deploy:pwnNFT")
  .addParam("targetAddress", "Address of the contract we want to pwn")
  .setAction(async function (taskArguments: TaskArguments, { ethers }) {
    const signers: SignerWithAddress[] = await ethers.getSigners();
    const greeterFactory: PwnNFT__factory = <PwnNFT__factory>await ethers.getContractFactory("PwnNFT");
    const greeter: PwnNFT = <PwnNFT>await greeterFactory.connect(signers[0]).deploy(taskArguments.targetAddress);
    await greeter.deployed();
    console.log("NFT deployed to: ", greeter.address);
  });
