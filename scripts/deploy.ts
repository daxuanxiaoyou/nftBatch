// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const testNft = await deployNft();
  const batch = await deployBatch();
}

async function deployNft() {
  const testNft = await ethers.getContractFactory("TestNft");
  const nft = await testNft.deploy();

  await nft.deployed();
  console.log("nft deployed to:", nft.address);

  return nft;
}

async function deployBatch() {
  const batchTransfer = await ethers.getContractFactory("BatchTransfer");
  const batch = await batchTransfer.deploy();

  await batch.deployed();
  console.log("batch deployed to:", batch.address);

  return batch;
}


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
