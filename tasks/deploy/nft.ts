import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

import type { ProblematicNFT, ProblematicNFT__factory } from "../../src/types";

task("deploy:NFT").setAction(async function (taskArguments: TaskArguments, { ethers }) {
  const signers: SignerWithAddress[] = await ethers.getSigners();
  const greeterFactory: ProblematicNFT__factory = <ProblematicNFT__factory>(
    await ethers.getContractFactory("ProblematicNFT")
  );
  const greeter: ProblematicNFT = <ProblematicNFT>await greeterFactory.connect(signers[0]).deploy();
  await greeter.deployed();
  console.log("NFT deployed to: ", greeter.address);
});
